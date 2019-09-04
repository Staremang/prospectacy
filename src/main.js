import Sticky from 'sticky-js';
import AOS from 'aos';
import $ from 'jquery';
import 'simplebar';
// import ymaps from 'ymaps';

import './js/Input';
// import './js/Modal';

import 'aos/dist/aos.css';
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
  const $aboutBg = $('.s-about__bg-image');
  const $about = $('.s-about');
  $('.s-about__link').hover(
    (event) => {
      const $this = $(event.currentTarget);
      $($this.data('bg')).addClass('active');
      // $aboutBg.addClass('active');
      $about.addClass('active');
    },
    (event) => {
      const $this = $(event.currentTarget);
      $aboutBg.removeClass('active');
      $about.removeClass('active');
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

  new Sticky('#js-about-sticky', {
    marginTop: 150,
    stickyClass: 'is-sticky',
  });

  // new Input();

  $('.menu-button, .navbar__overlay ').on('click', () => {
    $('.navbar').toggleClass('navbar_active');
    $('.menu-button').toggleClass('active');
    $('html').toggleClass('noscroll');
  });
});
