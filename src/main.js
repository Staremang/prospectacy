import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import enableInlineVideo from 'iphone-inline-video';
import Sticky from 'sticky-js';
import AOS from 'aos';
import $ from 'jquery';
import Simplebar from 'simplebar';
import 'owl.carousel';
// import ymaps from 'ymaps';

import './js/Input';
// import './js/Modal';

import 'aos/dist/aos.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'simplebar/dist/simplebar.css';
import './scss/style.scss';

AOS.init({
  disable: 'mobile',
  duration: 500,
  easing: 'ease-out',
  once: true,
  // anchorPlacement: 'top-center',
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

    // this.$carousel.on('resized.owl.carousel', (event) => {
    //   console.log('resized.owl.carousel');
    // });

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
      this.$el.css('cursor', 'none');
    });

    this.$el.on('mouseleave.gallery', () => {
      this.isHover = false;
      this.$el.css('cursor', '');
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
      x: Math.round(100 * (window.App.cursor.x - this.offsetLeft)) / 100,
      y: Math.round(100 * (window.App.cursor.y - (this.offsetTop - window.scrollY))) / 100,
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

    this.inited = false;
    this.addressList = [];

    $('.s-contacts__address').each((i, item) => {
      this.addressList.push({
        id: parseInt(item.dataset.point, 10),
        coords: JSON.parse(item.dataset.pointCoords),
      });
    });

    if (this.addressList.length === 0) {
      return;
    }


    this.count = this.addressList.length;
    this.currentId = null;
    this.loop = false;

    // if (document.documentElement.clientWidth >= 768) {
    //   this.loop = true;
    //
    //   // this.$slider.on('initialized.owl.carousel', () => {
    //   //
    //   // });
    //
    // } else {
    //   this.loop = false;
    // }

    if (window.ymaps) {
      window.ymaps.ready(this.init);
    }
  }

  initCarousel() {
    this.inited = true;
    this.loop = true;
    this.$slider.addClass('owl-carousel owl-theme');
    this.$slider.owlCarousel({
      mouseDrag: false,
      loop: this.loop,
      nav: false,
      items: 2,
    });
  }

  destroyCarousel() {
    this.inited = false;
    this.loop = false;
    this.$slider.removeClass('owl-carousel owl-theme');
    this.$slider.trigger('destroy.owl.carousel');
  }

  init = (ymaps) => {
    // this.$slider.on('changed.owl.carousel', (event) => {
    //   // console.log(event.target, event.item, event.page);
    //   this.setId(event.item.index, false);
    // });

    $('.s-contacts__address').on('click', (event) => {
      this.setId(parseInt(event.currentTarget.dataset.point, 10));
    });

    this.$buttonRight.on('click', this.next);
    this.$buttonLeft.on('click', this.prev);

    // Создание карты.
    this.Map = new ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 16,
      controls: ['zoomControl'],
    });

    this.addressList.forEach((item) => {
      const myPlacemark = new ymaps.Placemark(item.coords, {
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
    });

    this.setId(0);
  };

  next = () => {
    this.$slider.trigger('next.owl.carousel');

    if (this.currentId >= this.count - 1) {
      if (this.loop) {
        this.currentId = 0;
      } else {
        this.currentId = this.count - 1;
      }
    } else {
      this.currentId += 1;
    }

    if (!this.loop && this.count - 1) {
      this.$buttonLeft.removeClass('disabled');
      this.$buttonRight.addClass('disabled');
    }

    this.setCenter(this.currentId);
    // console.log(this.currentId);

    $('.s-contacts__address').removeClass('active');
    this.$slider.find(`[data-point="${this.currentId}"]`).addClass('active');
  };

  prev = () => {
    this.$slider.trigger('prev.owl.carousel');

    if (this.currentId <= 0) {
      if (this.loop) {
        this.currentId = this.count - 1;
      } else {
        this.currentId = 0;
      }
    } else {
      this.currentId -= 1;
    }

    if (!this.loop && this.currentId === 0) {
      this.$buttonRight.removeClass('disabled');
      this.$buttonLeft.addClass('disabled');
    }

    this.setCenter(this.currentId);
    // console.log(this.currentId);

    $('.s-contacts__address').removeClass('active');
    this.$slider.find(`[data-point="${this.currentId}"]`).addClass('active');
  };

  setId(id, trigger = true) {
    if (this.currentId === id) {
      return;
    }

    if (id < 0) {
      if (this.loop) {
        this.currentId = this.count - 1;
      } else {
        this.currentId = 0;
      }
    } else if (id > this.count - 1) {
      if (this.loop) {
        this.currentId = (id % this.count);
      } else {
        this.currentId = this.count - 1;
      }
    } else {
      this.currentId = id;
    }

    if (!this.loop) {
      if (this.currentId === 0) {
        this.$buttonLeft.addClass('disabled');
        this.$buttonRight.removeClass('disabled');
      }

      if (this.currentId === this.count - 1) {
        this.$buttonLeft.removeClass('disabled');
        this.$buttonRight.addClass('disabled');
      }
    }

    this.setCenter(this.currentId);
    // console.log(this.currentId);

    $('.s-contacts__address').removeClass('active');
    this.$slider.find(`[data-point="${this.currentId}"]`).addClass('active');

    if (trigger) {
      this.$slider.trigger('to.owl.carousel', [this.currentId, 300]);
    }
  }

  setCenter(id) {
    const point = this.addressList.find(item => item.id === id);
    // this.Map.setCenter(firstGeoObject.geometry.getCoordinates());
    // this.Map.setCenter(point.coords);
    this.Map.panTo(point.coords, {
      duration: 1500,
    });
  }
}

class Modal {
  constructor() {
    this.openModalEl = null;


    const button = document.createElement('button');
    button.classList.add('modal-page__btn-back');
    button.classList.add('back-button');
    button.innerHTML = '<svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.10383 7.68628L0.625017 3.99994L4.10383 0.313603L5.55839 1.68628L4.31869 2.99994L16 2.99994L16 4.99994L4.31869 4.99994L5.55839 6.3136L4.10383 7.68628Z" fill="currentColor"/>' +
      '</svg>';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.close();
    });

    // this.$button = $(button);
    // this.$button.on('click', () => {
    //   this.close();
    // });
    this.$button = $(button);

    this.init();
  }

  init() {
    $('[data-modal]').on('click', (event) => {
      event.preventDefault();

      this.close()
        .then(() => {
          const targetSelector = event.currentTarget.dataset.src || event.currentTarget.getAttribute('href');
          this.open(document.querySelector(targetSelector));
        });
    });

    $('[data-modal-close]').on('click', (event) => {
      event.preventDefault();
      this.close();
    });
  }

  close() {
    return new Promise((resolve) => {
      if (!this.openModalEl) {
        resolve();
        return;
      }

      enableBodyScroll(this.openModalEl);
      // document.body.style.overflow = '';

      this.openModalEl.classList.remove('active');
      this.openModalEl.style.pointerEvents = 'none';
      this.openModalEl.removeEventListener('scroll', this.onScroll);

      // this.$openModal
      //   .removeClass('active')
      //   .css('pointer-events', 'none')
      //   .off('scroll.modal');

      this.$button.removeClass('visible');

      setTimeout(() => {
        this.$button.detach();
        // this.$openModal.hide();
        // this.$openModal = null;
        this.openModalEl.style.display = 'none';
        this.openModalEl = null;
        resolve();
      }, 1000);
    });
  }

  open(modalEl) {
    if (!modalEl) {
      return;
    }

    this.openModalEl = modalEl;

    disableBodyScroll(this.openModalEl);
    // document.body.style.overflow = 'hidden';
    // $('.wrapper').addClass('slide-up');

    this.openModalEl.classList.add('active');
    this.openModalEl.style.pointerEvents = '';
    this.openModalEl.style.display = 'block';

    // this.$openModal = $modal
    //   .addClass('active')
    //   .css({
    //     pointerEvents: '',
    //     display: 'block',
    //   });

    // $modal.find('[data-anim-name]').each((i, item) => {
    [].forEach.call(this.openModalEl.querySelectorAll('[data-anim-name]'), (item) => {
      const name = item.dataset.animName || 'fadeInUp';
      const delay = 500 + parseInt(item.dataset.animDelay, 10);

      // eslint-disable-next-line no-param-reassign
      item.style.animationDelay = `${delay}ms`;
      item.classList.add('animated');
      item.classList.add(name);
    });

    this.openModalEl.addEventListener('scroll', this.onScroll);

    $(this.openModalEl).append(this.$button);
    // $(this.openModalEl).on('scroll.modal', this.onScroll);
  }

  onScroll = () => {
    if (this.openModalEl.scrollTop > 100) {
      this.$button.addClass('visible');
    } else {
      this.$button.removeClass('visible');
    }
  };
}

class Header {
  constructor($header) {
    this.$el = $header;
    this.isActive = this.$el.classList.contains('header_active');

    $('.menu-button ').on('click', this.toggle);
    $('.navbar__overlay').on('click', this.open);
  }

  toggle = () => {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  };

  open = () => {
    document.body.style.overflow = 'hidden';
    this.$el.classList.add('header_active');
    $('.menu-button').addClass('active');
    this.isActive = true;
  };

  close = () => {
    document.body.style.overflow = '';
    this.$el.classList.remove('header_active');
    $('.menu-button').removeClass('active');
    this.isActive = false;
  };
}

class Prospectacy {
  constructor() {
    this.cursor = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.lastBreakpoint = null;
    this.headerBreakpoint = 0;
    this.aboutBgInited = false;

    window.App = this;
  }

  init() {
    this.$header = document.getElementById('header');
    this.$heroSection = document.getElementById('hero-section');
    this.$heroSectionBenefits = document.getElementById('hero-benefits');

    this.initVideo();

    this.Gallery = new Gallery();
    this.Map = new Map();
    this.Modal = new Modal();

    if (this.$header) {
      this.Header = new Header(this.$header);
    }


    this.onResize();

    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('scroll', this.onScroll);


    $('[data-anchor]').on('click', (event) => {
      const targetEl = document.querySelector(event.currentTarget.getAttribute('href'));
      if (targetEl) {
        event.preventDefault();
        if (this.Header) {
          this.Header.close();
        }
        this.scrollTo(targetEl);
      }
    });


    $('.s-portfolio').find('.next-link').on('click', (event) => {
      event.preventDefault();

      for (let i = 0; i < 5; i += 1) {
        const $el = $(`<div class="s-portfolio__col">
          <div class="project-item">
            <a href="#project-modal-1" data-modal class="project-item__title arrow-link">
              Невыполнение договорных обязательств по строительным работам
              <svg class="arrow-link__icon" viewBox="0 0 38 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="arrow-link__tail" fill-rule="evenodd" clip-rule="evenodd" d="M34 9.56055H1V6.56055H34V9.56055Z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29.1213 0L37.182 8.06066L29.1213 16.1213L27 14L32.9393 8.06066L27 2.12132L29.1213 0Z" fill="currentColor"/>
              </svg>
            </a>
            <p class="project-item__text">Взыскано 82,5 млн рублей убытков и 7 млн рублей задолженности по договору
              подряда.</p>
            <div class="project-item__footer">
              <span class="project-item__sticker">89,5 млн ₽</span>
            </div>
          </div>
        </div>`);

        $el.addClass('animated');
        $el.addClass('fadeInUp');
        $el.css({
          'animation-delay': `${i * 200}ms`,
        });

        $('.s-portfolio__list').append($el);
      }
    });
  }

  scrollTo(element, duration = 1000) {
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;

    $('html, body').animate({
      scrollTop: offsetTop - this.$header.getBoundingClientRect().height,
    }, duration);
  }

  initVideo() {
    this.$videoBird = document.getElementById('hero-video');
    if (this.$videoBird) {
      enableInlineVideo(this.$videoBird, { iPad: true });

      // this.$videoBird.addEventListener('canplaythrough', () => {
      //   this.$videoBird.play();
      //   this.$videoBird.classList.add('animated');
      //   this.$videoBird.classList.add('fadeIn');
      // });
      //
      // this.$videoBird.load();
    }

    this.$videoScales = document.getElementById('video-scales');
    if (this.$videoScales) {
      enableInlineVideo(this.$videoScales, { iPad: true });

      // this.$videoScales.addEventListener('canplaythrough', () => {
      //   this.$videoScales.play();
      //   this.$videoScales.classList.add('animated');
      //   this.$videoScales.classList.add('fadeIn');
      // });
      //
      // this.$videoScales.load();
    }

    this.$videoRub = document.getElementById('video-rub');
    if (this.$videoRub) {
      enableInlineVideo(this.$videoRub, { iPad: true });

      // this.$videoRub.addEventListener('canplaythrough', () => {
      //   this.$videoRub.play();
      //   this.$videoRub.classList.add('animated');
      //   this.$videoRub.classList.add('fadeIn');
      // });
      //
      // this.$videoRub.load();
    }
  }

  initAboutBg() {
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
  }

  static get breakpoint() {
    if (document.documentElement.clientWidth >= 1600) {
      return 'xl';
    }
    if (document.documentElement.clientWidth >= 1280) {
      return 'lg';
    }
    if (document.documentElement.clientWidth >= 768) {
      return 'md';
    }
    return 'xs';
  }

  onResize = () => {
    const newBreakpoint = Prospectacy.breakpoint;

    if (this.lastBreakpoint !== newBreakpoint) {
      switch (newBreakpoint) {
        case 'xs':
          if (this.aboutStickyParagraph) this.aboutStickyParagraph.destroy();
          if (this.portfolioSimplebar) this.portfolioSimplebar.unMount();
          this.Map.destroyCarousel();
          break;
        case 'md':
        case 'lg':
        case 'xl':
          if (!this.aboutBgInited) this.initAboutBg();
          if (!this.Map.inited) this.Map.initCarousel();
          if (!this.aboutStickyParagraph) {
            this.aboutStickyParagraph = new Sticky('#js-about-sticky', {
              marginTop: 150,
              stickyClass: 'is-sticky',
            });
          }
          if (!this.portfolioSimplebar) {
            this.portfolioSimplebar = new Simplebar(document.querySelector('.portfolio-modal__wrapper'), {
              autoHide: false,
            });
          }
          break;
        default:
          break;
      }

      this.lastBreakpoint = newBreakpoint;
      console.log(this.lastBreakpoint);
    }

    try {
      if (newBreakpoint === 'lg' || newBreakpoint === 'xl') {
        this.headerBreakpoint = this.$heroSection.getBoundingClientRect().height
          - this.$header.getBoundingClientRect().height;
      } else {
        this.headerBreakpoint = this.$heroSection.getBoundingClientRect().height
          - this.$heroSectionBenefits.getBoundingClientRect().height;
      }
    } catch (e) {
      this.headerBreakpoint = 0;
      console.error(e);
    }
  };

  onScroll = () => {
    if (window.scrollY > this.headerBreakpoint) {
      this.$header.classList.add('header_has-bg');
    } else {
      this.$header.classList.remove('header_has-bg');
    }
  };

  onMove = (event) => {
    this.cursor.x = event.clientX;
    this.cursor.y = event.clientY;
  };

  static setLoadPercentage(num) {
    if (document.getElementById('logo-mask')) {
      setTimeout(() => {
        document.getElementById('logo-mask').style.width = `${num}%`;
      }, 200);
    }
  }

  static startAnimation() {
    // document.body.style.overflow = 'hidden';
    // document.body.style.overflow = '';
    document.getElementById('loader').classList.add('animate');
    document.getElementById('header').classList.add('animate');
    document.getElementById('hero-section').classList.add('animate');
    document.getElementById('hero-benefits').classList.add('animate');
    // document.getElementById('hero-video').play();

    // setTimeout(() => {
    // }, 800);
    //
    // setTimeout(() => {
    // }, 1000);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // startAnimation();
  // return;

  const App = new Prospectacy();
  App.init();


  Prospectacy.setLoadPercentage(35);
});

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    Prospectacy.setLoadPercentage(20);
  }
  if (document.readyState === 'complete') {
    Prospectacy.setLoadPercentage(60);
  }
});

window.addEventListener('load', () => {
  Prospectacy.setLoadPercentage(80);

  setTimeout(() => {
    Prospectacy.setLoadPercentage(100);
  }, 700);

  setTimeout(() => {
    Prospectacy.startAnimation();
  }, 1500);
});
