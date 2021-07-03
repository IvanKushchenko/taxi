'use strict';

import './scss/style.scss';

import OverlayScrollbars from 'overlayscrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';

import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

window.addEventListener('DOMContentLoaded', () => {
  // Custom ScrollBar
  const tableScroll = OverlayScrollbars(document.querySelector('[data-type="table-with-scroll"]'), {
    className: 'os-theme-dark',
    sizeAutoCapable: true,
    paddingAbsolute: true,
    autoUpdate: true,
    scrollbars: {
      clickScrolling: true,
    },
    overflowBehavior: {
      x: 'scroll',
      y: 'scroll',
    },
  });

  // Feedback slider
  const feedbackSlider = new Swiper('.swiper-container', {
    grabCursor: true,
    slidesPerView: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.feedback__counter',
      type: 'fraction',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      577: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      992: {
        spaceBetween: 30,
      },
    },
  });

  // Mobile menu
  const menuBtn = document.querySelector('[data-type="menu-btn"]');
  const headerBlock = document.querySelector('[data-type="header"]');
  const headerLinks = document.querySelectorAll('[data-type="header-mob"] a');

  menuBtn.addEventListener('click', (e) => {
    if (headerBlock.classList.contains('opened-menu')) {
      headerBlock.classList.remove('opened-menu');
      document.body.style.overflow = '';
    } else {
      headerBlock.classList.add('opened-menu');
      document.body.style.overflow = 'hidden';
    }
  });
  headerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      headerBlock.classList.remove('opened-menu');
      document.body.style.overflow = '';
    });
  });

  // Modal window
  const modalBtn = document.querySelectorAll('[data-type="modal-open"]');
  const modals = document.querySelectorAll('.modal');
  const defaultModal = document.querySelector('[data-type="modal-default"]');
  const successModal = document.querySelector('[data-type="modal-success"]');

  // For checking modal success
  const defaultModalBtn = defaultModal.querySelector('button');
  defaultModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    defaultModal.classList.remove('opened-modal');
    successModal.classList.add('opened-modal');
  });

  modalBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      defaultModal.classList.add('opened-modal');
      headerBlock.classList.remove('opened-menu');
      document.body.style.overflow = 'hidden';
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('overlay')) {
        modal.classList.remove('opened-modal');
        document.body.style.overflow = 'auto';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      headerBlock.classList.remove('opened-menu');
      defaultModal.classList.remove('opened-modal');
      successModal.classList.remove('opened-modal');
      document.body.style.overflow = '';
    }
  });
});
