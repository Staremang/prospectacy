import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Scrollbar from 'smooth-scrollbar';
import enableInlineVideo from 'iphone-inline-video';
// import Sticky from 'sticky-js';
import AOS from 'aos';
import $ from 'jquery';
import Simplebar from 'simplebar';
import 'owl.carousel';
// import ymaps from 'ymaps';

import Platform from './js/Platform';
// import Particles from './js/Particles';
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

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

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
    this.isDisabled = false;

    this.index = 0;
    this.count = 0;

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
        // lazyLoad: true,
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

    // window.addEventListener('resize', () => {
    //   this.compute();
    // });

    // this.$carousel.on('resized.owl.carousel', (event) => {
    //   console.log('resized.owl.carousel');
    // });

    this.$carousel.on('changed.owl.carousel', (event) => {
      // if (event.item.index + 1 === event.item.count) {
      //   this.isReverse = true;
      //   this.$cursor.addClass('gallery__control_reverse');
      // }
      //
      // if (event.item.index === 0) {
      //   this.isReverse = false;
      //   this.$cursor.removeClass('gallery__control_reverse');
      // }

      this.index = event.item.index;
      this.count = event.item.count;

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
      // this.$cursor.css('opacity', '1');
      this.$el.css('cursor', 'none');
    });

    this.$el.on('mouseleave.gallery', () => {
      this.isHover = false;
      // this.$cursor.css('opacity', '0');
      this.$el.css('cursor', '');
    });
  }

  compute() {
    // this.hasSmoothScroll = 0;

    // y.hasClass('has-smooth-scroll') && (this.hasSmoothScroll = !0);

    // this.clientWidth = this.el.clientWidth;
    // this.clientHeight = this.el.clientHeight;

    // const t = this.hasSmoothScroll ? window.scrollY : 0;

    this.offsetTop = this.$el.offset().top;
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

      if (this.realMouse.x >= document.documentElement.clientWidth / 2) {
        this.isReverse = false;
        this.$cursor.removeClass('gallery__control_reverse');
        this.isDisabled = this.index >= this.count - 1;
      } else {
        this.isReverse = true;
        this.$cursor.addClass('gallery__control_reverse');
        this.isDisabled = this.index === 0;
      }

      this.$cursor.css({
        '-webkit-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        '-ms-transform': `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        transform: `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0px)`,
        opacity: this.isDisabled ? '0.5' : '1',
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
        opacity: 0,
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
      autoWidth: true,
      items: 2,
      nav: false,
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
      const id = parseInt(event.currentTarget.dataset.point, 10);

      if (document.documentElement.clientWidth >= 768) {
        if (id !== this.currentId) {
          this.next();
        }
      } else {
        this.setId(id);
      }
    });

    this.$buttonRight.on('click', this.next);
    this.$buttonLeft.on('click', this.prev);

    this.mapEl = document.getElementById('map');
    // Создание карты.
    this.Map = new ymaps.Map(this.mapEl, {
      center: [55.76, 37.64],
      zoom: 16,
      controls: ['zoomControl'],
    });
    // mousewheel DOMMouseScroll
    // console.log(ymaps.domEvent.manager.group(this.mapEl));
    //
    ymaps.domEvent.manager.add(this.mapEl, 'mousewheel', (event) => {
      if (event.get('altKey') || event.get('ctrlKey') || event.get('metaKey') || event.get('shiftKey')) {
        return;
      }
      event.callMethod('stopPropagation');
    }, null, true);

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
    this.zIndex = 2000;


    const button = document.createElement('button');
    button.classList.add('modal-page__btn-back');
    button.classList.add('back-button');
    button.innerHTML = '<svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.10383 7.68628L0.625017 3.99994L4.10383 0.313603L5.55839 1.68628L4.31869 2.99994L16 2.99994L16 4.99994L4.31869 4.99994L5.55839 6.3136L4.10383 7.68628Z" fill="currentColor"/>' +
      '</svg>';
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const $target = $(event.currentTarget).parents('.modal-page');
      this.close($target);
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

      // this.close();

      const targetSelector = event.currentTarget.dataset.src || event.currentTarget.getAttribute('href');
      const targetEl = document.querySelector(targetSelector);

      if (!targetEl) {
        return;
      }

      if (event.currentTarget.dataset.field) {
        // data-field и data-field-value
        const form = targetEl.querySelector('form');
        const input = targetEl.querySelector(`input[name="${event.currentTarget.dataset.field}"]`);

        if (input) {
          input.value = event.currentTarget.dataset.fieldValue || '';
        } else if (form) {
          const newInput = document.createElement('input');
          newInput.type = 'hidden';
          newInput.name = event.currentTarget.dataset.field;
          newInput.value = event.currentTarget.dataset.fieldValue || '';

          form.appendChild(newInput);
        }
      }

      this.open(targetEl);
    });

    $('[data-modal-close]').on('click', (event) => {
      event.preventDefault();

      const $target = $(event.currentTarget).parents('.modal-page');
      this.close($target);
    });
  }

  close($target) {
    return new Promise((resolve) => {
      // if (!this.openModalEl) {
      //   resolve();
      //   return;
      // }

      // console.log(modal);
      const modal = $target[0];
      // this.openModalEl = null;

      enableBodyScroll(modal);
      // document.body.style.overflow = '';

      modal.classList.remove('active');
      modal.style.pointerEvents = 'none';
      modal.removeEventListener('scroll', this.onScroll);

      // this.$openModal
      //   .removeClass('active')
      //   .css('pointer-events', 'none')
      //   .off('scroll.modal');

      this.$button.removeClass('visible');

      setTimeout(() => {
        this.$button.detach();
        // this.$openModal.hide();
        // this.$openModal = null;
        modal.style.display = 'none';
        // this.openModalEl = null;
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
    this.openModalEl.style.zIndex = this.zIndex + 1;
    this.zIndex += 1;
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

    this.groupPhotoTop = 0;
    this.groupPhotoAnimOffset = 0;

    window.App = this;
    window.Platform = Platform;
  }

  init() {


    // Scrollbar.init(document.querySelector('#main-scrollbar'), {
    //   damping: 0.1,
    //   // plugin: {
    //   //   filterEvent: 1,
    //   // },
    // });

    this.$header = document.getElementById('header');
    this.$heroSection = document.getElementById('hero-section');
    this.$heroSectionBenefits = document.getElementById('hero-benefits');
    this.$groupPhoto = document.getElementById('group-photo');

    this.initVideo();
    // this.animate();

    this.Gallery = new Gallery();
    this.Map = new Map();
    this.Modal = new Modal();

    if (this.$header) {
      this.Header = new Header(this.$header);
    }

    if (!Platform.has.touch) {
      this.initAboutBg();
    }


    this.onResize();

    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('scroll', this.onScroll);

    // new Particles(document.getElementById('bird'), {
    //   img: 'images/bird.png',
    //   color: ['#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b','#005eec', '#d3bc7b'],
    // });
    //
    // new Particles(document.getElementById('video-scales'), {
    //   img: 'images/scales.png',
    //   color: '#005eec',
    // });
    //
    // new Particles(document.getElementById('video-rub'), {
    //   img: 'images/rub.png',
    //   color: '#ffffff',
    // });


    $('input[type="file"]').change((event) => {
      const fileName = event.target.files[0].name;
      const $container = $(event.currentTarget).parents('.custom-file');
      const $title = $container.find('.custom-file__title');
      const $subtitle = $container.find('.custom-file__subtitle');

      $title.html(fileName);
      $subtitle.html('Выбранный файл');
    });

    $('form').on('submit', (event) => {
      event.preventDefault();


      const form = event.currentTarget;
      const formData = new FormData(form);

      // console.log(form);
      const button = form.querySelector('button[type="submit"]');
      const file = form.querySelector('input[type="file"]');
      if (file) {
        formData.append('file', file.files[0]);
      }

      form.classList.add('loading');

      $.ajax({
        url: form.getAttribute('action'),
        data: formData,
        processData: false,
        contentType: false,
        type: form.getAttribute('method'),
      }).done(() => {
        button.classList.remove('btn-blue');
        button.classList.add('btn-green');
        button.innerHTML = `<svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0606 3.06077L9.99999 16.1214L0.939331 7.06077L3.06065 4.93945L9.99999 11.8788L20.9393 0.939453L23.0606 3.06077Z" fill="white"/>
              </svg> Заявка отправлена`;

        form.classList.add('success');
      }).fail(() => {
        alert('Ошибка');
      });

    });


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


    let shownItems = 0;
    const $portfolioList = $('.s-portfolio__col');
    const $portfolioLink = $('.s-portfolio').find('.next-link');


    $portfolioList.hide();
    $portfolioList.slice(shownItems, shownItems += 5).show();
    AOS.refresh();
    $portfolioLink.on('click', (event) => {
      event.preventDefault();

      $portfolioList.slice(shownItems, shownItems += 5).each((i, item) => {
        const $el = $(item);
        $el.show();
        $el.addClass('animated');
        $el.addClass('fadeInUp');
        $el.css({
          'animation-delay': `${i * 200}ms`,
        });
      });

      if (shownItems >= $portfolioList.length) {
        $portfolioLink.hide();
      } else {
        const l = ($portfolioList.length - shownItems) % 5;

        $portfolioLink.html(`Еще ${l} проект${l !== 1 && (l === 5 ? 'ов' : 'а')}`);
      }

      // for (let i = 0; i < 5; i += 1) {
      //   const $el = $(`<div class="s-portfolio__col">
      //     <div class="project-item">
      //       <a href="#project-modal-1" data-modal class="project-item__title arrow-link">
      //         Невыполнение договорных обязательств по строительным работам
      //         <svg class="arrow-link__icon" viewBox="0 0 38 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      //           <path class="arrow-link__tail" fill-rule="evenodd" clip-rule="evenodd" d="M34 9.56055H1V6.56055H34V9.56055Z" fill="currentColor"/>
      //           <path fill-rule="evenodd" clip-rule="evenodd" d="M29.1213 0L37.182 8.06066L29.1213 16.1213L27 14L32.9393 8.06066L27 2.12132L29.1213 0Z" fill="currentColor"/>
      //         </svg>
      //       </a>
      //       <p class="project-item__text">Взыскано 82,5 млн рублей убытков и 7 млн рублей задолженности по договору
      //         подряда.</p>
      //       <div class="project-item__footer">
      //         <span class="project-item__sticker">89,5 млн ₽</span>
      //       </div>
      //     </div>
      //   </div>`);
      //
      //   $el.addClass('animated');
      //   $el.addClass('fadeInUp');
      //   $el.css({
      //     'animation-delay': `${i * 200}ms`,
      //   });
      //
      //   $('.s-portfolio__list').append($el);
      // }
    });
  }

  scrollTo(element, duration = 1000) {
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;

    $('html, body').animate({
      scrollTop: offsetTop - this.$header.getBoundingClientRect().height,
    }, duration);
  }

  initVideo() {
    this.$videoBird = document.getElementById('video-bird');
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
    if (this.Gallery) {
      this.Gallery.compute();
    }


    const newBreakpoint = Prospectacy.breakpoint;

    if (this.lastBreakpoint !== newBreakpoint) {
      switch (newBreakpoint) {
        case 'xs':
          // if (this.aboutStickyParagraph) this.aboutStickyParagraph.destroy();
          if (this.portfolioSimplebar) this.portfolioSimplebar.unMount();
          this.Map.destroyCarousel();
          break;
        case 'md':
        case 'lg':
        case 'xl':
          if (!this.Map.inited) this.Map.initCarousel();
          // if (!this.aboutStickyParagraph) {
          //   this.aboutStickyParagraph = new Sticky('#js-about-sticky', {
          //     marginTop: 150,
          //     stickyClass: 'is-sticky',
          //   });
          // }
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
    // this.groupPhotoAnimOffset = Math.abs(this.$groupPhoto.offsetTop - window.pageYOffset + document.documentElement.clientHeight / 2);
    // this.groupPhotoTop = Math.round(100 * (this.$groupPhoto.getBoundingClientRect().top - document.documentElement.clientHeight / 2 * -1)) / 100;
    // console.log(this.groupPhotoTop);

    if (this.$groupPhoto) {
      if ((this.$groupPhoto.offsetTop - document.documentElement.clientHeight / 2) <= window.pageYOffset) {
        const p = (this.$groupPhoto.offsetTop - window.pageYOffset) / (document.documentElement.clientHeight);

        this.$groupPhoto.style.transform = `scale(${Math.min(Math.max(1 - p, 0.5), 1)})`;
        // this.$groupPhoto.style.transform = `scale(${Math.min(Math.max(1 - this.groupPhotoAnimOffset / document.documentElement.clientHeight, 0.5), 1)})`;
      } else {
        this.$groupPhoto.style.transform = `scale(0.5)`;
      }
    }


    if (this.Gallery) {
      this.Gallery.compute();
    }
    if (window.pageYOffset > this.headerBreakpoint) {
      this.$header.classList.add('header_has-bg');
    } else {
      this.$header.classList.remove('header_has-bg');
    }
  };

  onMove = (event) => {
    this.cursor.x = event.clientX;
    this.cursor.y = event.clientY;
  };

  animate = () => {
    if (this.$groupPhoto) {
      if ((this.$groupPhoto.offsetTop - document.documentElement.clientHeight / 2) <= window.pageYOffset) {

        this.$groupPhoto.style.transform = `scale(${Math.min(Math.max(1 - this.groupPhotoAnimOffset / document.documentElement.clientHeight, 0.5), 1)})`;
      } else {
        this.$groupPhoto.style.transform = `scale(0.5)`;
      }
    }

    this.raf = requestAnimationFrame(this.animate);
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


let per = 0;

document.addEventListener('DOMContentLoaded', () => {
  // startAnimation();
  // return;

  const App = new Prospectacy();
  App.init();


  Prospectacy.setLoadPercentage(per += 15);

  const timer = setInterval(() => {
    if (per < 100) {
      Prospectacy.setLoadPercentage(per += 15);
    } else {
      clearInterval(timer);

      Prospectacy.setLoadPercentage(100);

      setTimeout(() => {
        Prospectacy.startAnimation();
      }, 1000);
    }
  }, 1000);
});

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    Prospectacy.setLoadPercentage(per += 20);
  }
  if (document.readyState === 'complete') {
    Prospectacy.setLoadPercentage(per += 20);
  }
});

window.addEventListener('load', () => {
  Prospectacy.setLoadPercentage(per = 100);
});
