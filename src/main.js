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
  once: true,
  anchorPlacement: 'top-center',
});

window.addEventListener('load', () => {
  document.getElementById('logo-mask').style.width = '100%';
  setTimeout(() => {
    document.getElementById('loader').classList.add('load');
    $('.header').addClass('animate');
    $('.s-hero').addClass('animate');
    $('.hero-benefits').addClass('animate');
  }, 800);
});

$(() => {
  $('.gallery__wrapper').owlCarousel({
    margin: 30,
    loop: false,
    dots: false,
    nav: false,
    autoWidth: true,
    items: 1,
  });

  if (document.documentElement.clientWidth >= 768) {
    $('.s-contacts__slider').addClass('owl-carousel owl-theme');
    $('.s-contacts__slider').owlCarousel({
      loop: true,
      nav: true,
      items: 2,
    });

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

  $('[data-modal]').on('click', (event) => {
    event.preventDefault();


    if ($openModal) {
      $openModal.removeClass('active');
      setTimeout(() => {
        $openModal.hide();
      }, 1000);
    }

    let target = event.currentTarget.dataset.src || event.currentTarget.getAttribute('href');

    const $target = $(target);

    $target.show();
    $('.wrapper').addClass('slide-up');
    $target.addClass('active');
    $openModal = $target;
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
    $('.navbar').toggleClass('navbar_active');
    $('.menu-button').toggleClass('active');
    $('html').toggleClass('noscroll');
  });
});
