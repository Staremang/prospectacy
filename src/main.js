import $ from 'jquery';
import ymaps from 'ymaps';

// import './js/Input';
// import './js/Modal';

import './scss/style.scss';


window.addEventListener('load', () => {
  setTimeout(() => {
    $('.hero-benefits').addClass('animate');
  }, 500);
});

$(() => {
  // new Input();

  $('.menu-button, .navbar__overlay ').on('click', () => {
    $('.navbar').toggleClass('navbar_active');
    $('.menu-button').toggleClass('active');
    $('html').toggleClass('noscroll');
  });
});
