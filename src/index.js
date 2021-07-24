'use strict';

const jQuery = require('jquery');

const date = require('jquery-datetimepicker');
import 'jquery-datetimepicker/build/jquery.datetimepicker.min.css';

const select = require('select2');
import 'select2/dist/css/select2.min.css';

jQuery(document).on("select2:open", () => {
	setTimeout(() => {
	    document.querySelector(".select2-container--open .select2-search__field").focus()
	}, 0)
})

import Inputmask from 'inputmask';

import OverlayScrollbars from 'overlayscrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';

import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

import './scss/style.scss';

window.addEventListener('DOMContentLoaded', () => {
  // Checking for scroll width
  const div = document.createElement('div');
  div.classList.add('scroll-checker');
  let scrollWidth = null;

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
      document.body.style.marginRight = ``;
    } else {
      headerBlock.classList.add('opened-menu');
      document.body.style.overflow = 'hidden';
      document.body.append(div);
      scrollWidth = div.offsetWidth - div.clientWidth;
      div.remove();
      document.body.style.marginRight = `${scrollWidth}px`;
    }
  });
  headerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      headerBlock.classList.remove('opened-menu');
      document.body.style.overflow = '';
      document.body.style.marginRight = ``;
    });
  });

  // Modal window
  const modalBtn = document.querySelectorAll('[data-type="modal-open"]');
  const modals = document.querySelectorAll('.modal');
  const defaultModal = document.querySelector('[data-type="modal-default"]');
  const successModal = document.querySelector('[data-type="modal-success"]');

  modalBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      defaultModal.classList.add('opened-modal');
      headerBlock.classList.remove('opened-menu');
      document.body.style.overflow = 'hidden';
      document.body.append(div);
      scrollWidth = div.offsetWidth - div.clientWidth;
      div.remove();
      document.body.style.marginRight = `${scrollWidth}px`;
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('overlay')) {
        modal.classList.remove('opened-modal');
        document.body.style.overflow = '';
        document.body.style.marginRight = ``;
      }
    });
  });

  // Close menu, modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      headerBlock.classList.remove('opened-menu');
      defaultModal.classList.remove('opened-modal');
      successModal.classList.remove('opened-modal');
      document.body.style.overflow = '';
      document.body.style.marginRight = ``;
    }
  });

  // Phone mask
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  const phoneMask = new Inputmask({ mask: '+7(999)-999-99-99' });
  phoneInputs.forEach((input) => {
    phoneMask.mask(input);
  });

  // Type select
  const typeSelectWrap = jQuery('[data-type="type-select"]');
  const typeSelect = jQuery('[data-type="type-select"] select').select2();

  // City select
  const fromCityWrap = jQuery('[data-type="city-from"]');
  const fromCity = jQuery("[data-type='city-from'] select").select2({
    ajax: {
      url(par) {
        return `https://vl-taxi.ru/cities?city=${par.term}&second=&raw=1`;
      },
      dataType: 'json',
      delay: 250,
      processResults: function (data, params) {
        return {
          results: data.cities,
          id: data.cities.id,
        };
      },
      cache: true,
    },
    minimumInputLength: 1,
    templateResult: cityTemplate,
    tags: 'true',
    language: 'ru',
  });

  const whereCityWrap = jQuery('[data-type="city-where"]');
  const whereCity = jQuery("[data-type='city-where'] select").select2({
    ajax: {
      url(par) {
        return `https://vl-taxi.ru/cities?city=${par.term}&second=&raw=1`;
      },
      dataType: 'json',
      delay: 250,
      processResults: function (data, params) {
        return {
          results: data.cities,
          id: data.cities.id,
        };
      },
      cache: true,
    },
    minimumInputLength: 1,
    templateResult: cityTemplate,
    tags: 'true',
    language: 'ru',
  });

  function cityTemplate(city) {
    if (city.loading) {
      return 'Подождите...';
    }
    return jQuery('<div data-id=' + city.id + '>' + city.text + '</div>');
  }

  // Setting id for select
  fromCity.on('change', function (e) {
    if (typeof jQuery(this).select2('data')[0] === 'undefined') {
      return true;
    } else {
      fromCityWrap.attr({ 'city-id': Number(jQuery(this).select2('data')[0].id) });
    }
  });
  whereCity.on('change', function (e) {
    if (typeof jQuery(this).select2('data')[0] === 'undefined') {
      return true;
    } else {
      whereCityWrap.attr({ 'city-id': Number(jQuery(this).select2('data')[0].id) });
    }
  });
  typeSelect.on('change', function (e) {
    let formTariff = document
      .querySelector('[data-type="type-select"] .select2-selection__rendered')
      .textContent.toLowerCase();
    let tariffId =
      formTariff === 'cтандарт'
        ? 3
        : formTariff === 'комфорт'
        ? 4
        : formTariff === 'универсал'
        ? 5
        : formTariff === 'минивэн'
        ? 6
        : formTariff === 'бизнес'
        ? 7
        : false;
    typeSelectWrap.attr({ 'type-id': tariffId });
  });

  // Datepicker
  jQuery.datetimepicker.setLocale('ru');
  jQuery('#date').datetimepicker({
    format: 'd.m.Y H:i',
    minDate: '0',
    minTime: '0',
  });

  // Forms
  // Big form
  const orderForm = document.querySelector('[data-type="form"]');
  orderForm.addEventListener('submit', (e) => {
  	console.log(typeSelectWrap.attr('type-id'));
    e.preventDefault();

    const formData = {
      name: orderForm.querySelector('input[name="name"]').value,
      phone: orderForm.querySelector('input[name="phone"]').value,
      placeFromId: fromCityWrap.attr('city-id'),
      placeToId: whereCityWrap.attr('city-id'),
      tariffId: typeSelectWrap.attr('type-id'),
      dateAt: orderForm.querySelector('input[name="date"]').value,
      partnerId: '12345',
    };
    if (
      !orderForm.querySelector('input[name="name"]').value ||
      !orderForm.querySelector('input[name="phone"]').value ||
      !fromCityWrap.attr('city-id') ||
      !whereCityWrap.attr('city-id') ||
      !typeSelectWrap.attr('type-id') ||
      !orderForm.querySelector('input[name="date"]').value
    ) {
      alert('Заполните все обязательные поля');
    } else {
      jQuery.ajax({
        type: 'POST',
        url: 'https://vl-taxi.ru/handlers/newOrder',
        data: formData,
        error: function (req, textStatus, err) {
          console.error(err);
          alert('При обработки формы произошла ошибка. Попробуйте еще раз!');
        },
        success: function () {
          successModal.classList.add('opened-modal');
          fromCity.val(null).trigger('change');
          whereCity.val(null).trigger('change');
          typeSelect.val('Выберите класс такси').trigger('change');
          orderForm.reset();
          setTimeout(() => {
            successModal.classList.remove('opened-modal');
          }, 5000);
        },
      });
    }
  });

  // Small form
  const callForms = document.querySelectorAll('[data-type="form-call"]');

  callForms.forEach((form) => {
    let formName = null;
    let formPhone = null;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formName = form.querySelector('input[name="name"]');
      formPhone = form.querySelector('input[name="phone"]');

      const formData = {
        name: formName.value,
        phone: formPhone.value,
      };

      if (!formName.value || !formPhone.value) {
        alert('Заполните все обязательные поля');
      } else {
        jQuery.ajax({
          type: 'POST',
          url: 'https://vl-taxi.ru/handlers/newOrder',
          data: formData,
          error: function (req, textStatus, err) {
            console.error(err);
            alert('При обработки формы произошла ошибка. Попробуйте еще раз!');
          },
          success: function () {
            defaultModal.classList.remove('opened-modal');
            successModal.classList.add('opened-modal');
            form.reset();
            setTimeout(() => {
              successModal.classList.remove('opened-modal');
            }, 5000);
          },
        });
      }
    });
  });
});

// Message translations select 2
jQuery.fn.select2.amd.define('select2/i18n/ru', [], function () {
  return {
    errorLoading: function () {
      return 'Результат не может быть загружен.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;
      var message = 'Пожалуйста, удалите ' + overChars + ' символ';
      if (overChars >= 2 && overChars <= 4) {
        message += 'а';
      } else if (overChars >= 5) {
        message += 'ов';
      }
      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Пожалуйста, введите ' + remainingChars + ' или более символов';

      return message;
    },
    loadingMore: function () {
      return 'Загружаем ещё ресурсы…';
    },
    maximumSelected: function (args) {
      var message = 'Вы можете выбрать ' + args.maximum + ' элемент';

      if (args.maximum >= 2 && args.maximum <= 4) {
        message += 'а';
      } else if (args.maximum >= 5) {
        message += 'ов';
      }

      return message;
    },
    noResults: function () {
      return 'Ничего не найдено';
    },
    searching: function () {
      return 'Поиск…';
    },
  };
});
