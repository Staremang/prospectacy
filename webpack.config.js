const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const IconfontPlugin = require('iconfont-plugin-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const distPath = path.resolve(__dirname, 'dist');

module.exports = (env, args) => {
  process.env.NODE_ENV = args.mode;
  const devMode = args.mode === 'development';

  const config = {
    // mode: 'development',
    // devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: devMode ? '[name].js' : 'assets/js/[name].js',
      // publicPath: '',
      // chunkFilename: 'js/[name].[contenthash:8].js',
    },
    module: {
      rules: [
        // {
        //   test: /\.html$/i,
        //   use: 'html-loader',
        // },
        {
          test: /\.m?jsx?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader', options: { cacheDirectory: true } },
          ],
        },
        {
          test: /\.(css)(\?.*)?$/,
          use: [
            { loader: args.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader },
            // { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            { loader: args.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader },
            // { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            // {
            //   loader: 'sass-loader',
            //   options: {
            //     sourceMap: false,
            //   },
            // },
            {
              loader: 'fast-sass-loader',
            },
          ],
        },
        /* config.module.rule('images') */
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          use: [
            /* config.module.rule('images').use('url-loader') */
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'assets/img/[name].[hash:8].[ext]',
                  },
                },
              },
            },
          ],
        },
        /* config.module.rule('svg') */
        {
          test: /\.(svg)(\?.*)?$/,
          use: [
            /* config.module.rule('svg').use('file-loader') */
            {
              loader: 'file-loader',
              options: {
                name: 'assets/img/[name].[hash:8].[ext]',
              },
            },
          ],
        },
        /* config.module.rule('media') */
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: [
            /* config.module.rule('media').use('url-loader') */
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'assets/media/[name].[hash:8].[ext]',
                  },
                },
              },
            },
          ],
        },
        /* config.module.rule('fonts') */
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            /* config.module.rule('fonts').use('url-loader') */
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'assets/fonts/[name].[hash:8].[ext]',
                  },
                },
              },
            },
          ],
        },
      ],
    },

    externals: {
      // app: 'app',
      jquery: 'jQuery',
    },

    plugins: [
      // new CleanWebpackPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new CssUrlRelativePlugin(),
      new MiniCssExtractPlugin(
        {
          filename: 'assets/css/[name].css',
          chunkFilename: 'assets/css/[name].css',
        },
      ),
      // new IconfontPlugin(
      //   {
      //     src: './src/assets/icons', // required - directory where your .svg files are located
      //     family: 'iconfont', // optional - the `font-family` name. if multiple iconfonts are generated, the dir names will be used.
      //     dest: {
      //       font: 'src/assets/fonts/[family].[type]', // required - paths of generated font files
      //       css: 'src/scss/_[family].scss', // required - paths of generated css files
      //     },
      //     watch: {
      //       pattern: 'assets/icons/*.svg', // required - watch these files to reload
      //       cwd: 'src/', // optional - current working dir for watching
      //     },
      //   },
      // ),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        // 'window.$': 'jquery',
        // 'window.jQuery': 'jquery',

        // Костыль, чтоб подключить OwlCarousel2 и воткнуть jQuery в глобальную область видимости
        'window.Zepto': 'jquery',
      }),

      new HtmlWebpackPlugin(
        {
          filename: 'index.html',
          template: path.resolve(__dirname, 'public/index.html'),
          minify: false,
          alwaysWriteToDisk: true,
        },
      ),

      new HtmlWebpackHarddiskPlugin(),
      // new ScriptExtHtmlWebpackPlugin(
      //   {
      //     defaultAttribute: 'async'
      //   }
      // ),
      new CopyWebpackPlugin(
        [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
            toType: 'dir',
            ignore: [
              '.DS_Store',
            ],
          },
        ],
      ),
    ],

    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      quiet: true,
      // port: 9002,
      lazy: false,
      // host: '0.0.0.0',
      hot: true,
      inline: true,
      // compress: true,
      // open: true,
      historyApiFallback: true,
      watchContentBase: true,
    },


    entry: {
      app: [
        './src/main.js',
      ],
    },
  };

  return config;
};
