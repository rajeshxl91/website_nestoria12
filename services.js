
/* Nestoria — Services page enhancements */
(function () {
  'use strict';

  var app = window.Nestoria;

  // Stop safely if the shared application script is missing.
  if (!app) {
    console.error('Nestoria is not initialized. Load main.js first.');
    return;
  }

  /**
   * FAQ accordion:
   * Opening one FAQ closes all other FAQ items.
   */
  function setupFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) {
          return;
        }

        faqItems.forEach(function (otherItem) {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      });
    });
  }

  /**
   * Render Lucide icons used on the services page.
   */
  function renderPageIcons() {
    if (typeof app.renderIcons === 'function') {
      app.renderIcons();
    }
  }

  // Initialize services page.
  function init() {
    setupFAQ();
    renderPageIcons();
  }

  init();
}());
