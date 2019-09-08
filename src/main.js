import Sticky from 'sticky-js';
import AOS from 'aos';
import $ from 'jquery';
import 'simplebar';
import 'owl.carousel';
// import ymaps from 'ymaps';

import './js/Input';
// import './js/Modal';

import 'aos/dist/aos.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'simplebar/dist/simplebar.css';
import './scss/style.scss';

AOS.init({
  duration: 800,
  easing: 'ease-out',
  // once: true,
  anchorPlacement: 'top-center',
});

window.addEventListener('load', () => {
  document.getElementById('logo-mask').style.width = '100%';

  setTimeout(() => {
    document.body.style.overflow = '';
    $('.s-hero').addClass('animate');
    $('.hero-benefits').addClass('animate');
  }, 1500);

  setTimeout(() => {
    $('.header').addClass('header_animate');
  }, 2300);

  setTimeout(() => {
    document.getElementById('hero-video').play();
  }, 2500);
});


/**
 * @return {number}
 */
function Y(t, e, i) {
  return (1 - i) * t + i * e;
}

class Gallery {
  constructor() {
    this.$el = $('.gallery');
    this.$cursor = $('.gallery__control');
    this.$carousel = $('.gallery__wrapper');
    this.$counter = $('.gallery__counter');

    this.isHover = false;
    this.isReverse = false;

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.realMouse = {
      x: this.$el.width() / 2,
      y: this.$el.height() / 2,
    };

    this.lastRealMouse = {
      x: 0,
      y: 0,
    };


    if (document.documentElement.clientWidth >= 768) {
      this.$carousel.addClass('owl-carousel owl-theme');
      this.$carousel.owlCarousel({
        margin: 30,
        mouseDrag: false,
        loop: false,
        dots: false,
        nav: false,
        autoWidth: true,
        items: 1,
        onInitialized: () => {
          this.init();
        },
        // responsive: {
        //   768: {
        //     margin: 30,
        //   },
        // },
      });
    }

    setTimeout(() => {
      this.compute();
    }, 700);
  }

  init() {
    this.compute();
    this.animate();

    window.addEventListener('resize', () => {
      this.compute();
    });

    this.$carousel.on('resized.owl.carousel', (event) => {
      console.log('resized.owl.carousel');
    });

    this.$carousel.on('changed.owl.carousel', (event) => {
      if (event.item.index + 1 === event.item.count) {
        this.isReverse = true;
        this.$cursor.addClass('gallery__control_reverse');
      }

      if (event.item.index === 0) {
        this.isReverse = false;
        this.$cursor.removeClass('gallery__control_reverse');
      }

      this.$counter.html(`${event.item.index + 1}/${event.item.count}`);
    });

    this.$el.on('click.gallery', () => {
      if (this.isReverse) {
        this.$carousel.trigger('prev.owl.carousel');
      } else {
        this.$carousel.trigger('next.owl.carousel');
      }
    });

    this.$el.on('mouseenter.gallery', () => {
      this.isHover = true;
    });

    this.$el.on('mouseleave.gallery', () => {
      this.isHover = false;
    });
  }

  compute() {
    this.hasSmoothScroll = 0;

    // y.hasClass('has-smooth-scroll') && (this.hasSmoothScroll = !0);

    // this.clientWidth = this.el.clientWidth;
    // this.clientHeight = this.el.clientHeight;

    const t = this.hasSmoothScroll ? window.scrollY : 0;

    this.offsetTop = this.$el.offset().top + t;
    this.offsetLeft = this.$el.offset().left;
  }

  animate() {
    this.realMouse = {
      x: Math.round(100 * (window.cursor.x - this.offsetLeft)) / 100,
      y: Math.round(100 * (window.cursor.y - (this.offsetTop - window.scrollY))) / 100,
    };

    if (this.isHover) {
      this.mouse.x = Y(this.mouse.x, this.realMouse.x, 0.2);
      this.mouse.y = Y(this.mouse.y, this.realMouse.y, 0.2);

      this.$cursor.css({
        '-webkit-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        '-ms-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        transform: `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
      });
    } else {
      this.realMouse = {
        x: this.$el.width() / 2,
        y: this.$el.height() / 2,
      };

      this.mouse.x = Y(this.mouse.x, this.realMouse.x, 0.1);
      this.mouse.y = Y(this.mouse.y, this.realMouse.y, 0.1);

      this.$cursor.css({
        '-webkit-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        '-ms-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        transform: `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
      });
    }

    this.lastRealMouse = {
      x: parseFloat(this.realMouse.x),
      y: parseFloat(this.realMouse.y),
    };

    this.raf = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.$carousel.trigger('destroy.owl.carousel');

    this.$el.off('click.gallery');
    this.$el.off('mouseenter.gallery');
    this.$el.off('mouseleave.gallery');
  }
}

class Map {
  constructor() {
    this.$slider = $('.s-contacts__slider');
    this.$buttonLeft = $('.s-contacts__btn-left');
    this.$buttonRight = $('.s-contacts__btn-right');


    if (document.documentElement.clientWidth >= 768) {
      this.$slider.addClass('owl-carousel owl-theme');
      this.$slider.owlCarousel({
        mouseDrag: false,
        loop: true,
        nav: false,
        items: 2,
      });
    }
  }

  init = (ymaps) => {
    this.$slider.on('changed.owl.carousel', (event) => {
      console.log(event.target, event.item, event.page);
    });

    this.$buttonRight.on('click', () => {
      this.$slider.trigger('next.owl.carousel');
    });

    this.$buttonLeft.on('click', () => {
      this.$slider.trigger('prev.owl.carousel');
    });

    // Создание карты.
    this.Map = new ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 14,
      controls: ['zoomControl'],
    });

    const myPlacemark = new ymaps.Placemark([55.76, 37.64], {
      hintContent: '',
    }, {
      // // Опции.
      // // Необходимо указать данный тип макета.
      // iconLayout: 'default#image',
      // // Своё изображение иконки метки.
      // iconImageHref: 'images/myIcon.gif',
      // // Размеры метки.
      // iconImageSize: [30, 42],
      // // Смещение левого верхнего угла иконки относительно
      // // её "ножки" (точки привязки).
      // iconImageOffset: [-5, -38],
    });

    this.Map.geoObjects.add(myPlacemark);
  };
}

$(() => {
  window.cursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  document.addEventListener('mousemove', (event) => {
    window.cursor.x = event.clientX;
    window.cursor.y = event.clientY;
  });

  let heroHeight = $('.s-hero').outerHeight();
  let headerHeight = $('.header').outerHeight();

  document.addEventListener('scroll', () => {
    if (window.scrollY > (heroHeight - headerHeight)) {
      $('.header').addClass('header_has-bg');
    } else {
      $('.header').removeClass('header_has-bg');
    }
  });

  window.addEventListener('resize', () => {
    heroHeight = $('.s-hero').outerHeight();
    headerHeight = $('.header').outerHeight();
  });

  window.app = {
    gallery: new Gallery(),
    map: new Map(),
  };

  window.ymaps.ready(window.app.map.init);

  if (document.documentElement.clientWidth >= 768) {
    new Sticky('#js-about-sticky', {
      marginTop: 150,
      stickyClass: 'is-sticky',
    });
  }

  const $aboutBg = $('.s-about__bg-image');
  const $about = $('.s-about');

  $('[data-bg-src]').hover(
    (event) => {
      const $this = $(event.currentTarget);
      $($this.data('bg-src')).addClass('active');
      // $aboutBg.addClass('active');
      $this.addClass('active');
      $about.addClass('active');
    },
    (event) => {
      const $this = $(event.currentTarget);
      $aboutBg.removeClass('active');
      $about.removeClass('active');
      $this.removeClass('active');
    },
  );

  let $openModal = null;

  function openModal($modal) {
    $modal.show();
    $('.wrapper').addClass('slide-up');
    $modal.addClass('active');
    $openModal = $modal;

    $modal.find('[data-anim-name]').each((i, item) => {
      const name = item.dataset.animName || 'fadeInUp';
      const delay = 500 + parseInt(item.dataset.animDelay, 10);

      item.style.animationDelay = `${delay}ms`;
      item.classList.add('animated');
      item.classList.add(name);
    });
  }

  $('[data-modal]').on('click', (event) => {
    event.preventDefault();

    if ($openModal) {
      $openModal.removeClass('active');
      setTimeout(() => {
        $openModal.hide();
      }, 1000);
    }

    const targetSelector = event.currentTarget.dataset.src || event.currentTarget.getAttribute('href');

    openModal($(targetSelector));
  });

  $('[data-modal-close]').on('click', (event) => {
    event.preventDefault();

    $openModal.removeClass('active');
    $('.wrapper').removeClass('slide-up');
    setTimeout(() => {
      $openModal.hide();
      $openModal = null;
    }, 1000);
  });
  // new Input();

  $('.menu-button, .navbar__overlay ').on('click', () => {
    $('.menu-button').toggleClass('active');
    $('.header').toggleClass('header_active');
  });
});
