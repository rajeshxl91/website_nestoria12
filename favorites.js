/* Favorites dashboard: render saved properties, remove one or all */
(function () {
  'use strict';

  // Get application data and core functions.
  var data = window.NestoriaData;
  var app = window.Nestoria;

  // Get dashboard elements.
  var grid = document.getElementById('fav-grid');
  var empty = document.getElementById('fav-empty');
  var summary = document.getElementById('fav-summary');
  var clearAllButton = document.getElementById('clear-all');

  // Validate required dependencies.
  if (
    !data ||
    !app ||
    !Array.isArray(data.properties) ||
    typeof app.getFavorites !== 'function' ||
    typeof app.propertyCard !== 'function'
  ) {
    console.error(
      'Favorites initialization failed: required data or functions are missing.'
    );
    return;
  }

  // Validate required HTML elements.
  if (!grid || !empty || !summary || !clearAllButton) {
    console.error(
      'Favorites initialization failed: required HTML elements are missing.'
    );
    return;
  }

  /**
   * Find saved property records from their IDs.
   */
  function getSavedProperties() {
    var favoriteIds = app.getFavorites();

    return favoriteIds.map(function (id) {
      return data.properties.find(function (property) {
        return String(property.id) === String(id);
      });
    }).filter(Boolean);
  }

  /**
   * Update the favorites dashboard summary.
   */
  function renderSummary(savedProperties) {
    var countElement = document.getElementById('sum-count');
    var citiesElement = document.getElementById('sum-cities');
    var rentElement = document.getElementById('sum-rent');

    if (savedProperties.length === 0) {
      summary.hidden = true;
      return;
    }

    summary.hidden = false;

    // Count saved properties.
    if (countElement) {
      countElement.textContent = savedProperties.length;
    }

    // Count unique cities.
    var uniqueCities = {};

    savedProperties.forEach(function (property) {
      if (property.city) {
        uniqueCities[property.city] = true;
      }
    });

    if (citiesElement) {
      citiesElement.textContent = Object.keys(uniqueCities).length;
    }

    // Find the lowest rent among saved rental properties.
    var rentalPrices = savedProperties
      .filter(function (property) {
        return property.listing === 'rent' &&
          typeof property.price === 'number' &&
          Number.isFinite(property.price);
      })
      .map(function (property) {
        return property.price;
      });

    if (rentElement) {
      rentElement.textContent = rentalPrices.length
        ? app.formatMoney(Math.min.apply(null, rentalPrices))
        : 'N/A';
    }
  }

  /**
   * Render saved property cards and dashboard information.
   */
  function render() {
    var savedProperties = getSavedProperties();

    // Render saved property cards.
    grid.innerHTML = savedProperties.map(function (property) {
      return app.propertyCard(property, {
        removable: true
      });
    }).join('');

    // Toggle the grid and empty-state message.
    grid.hidden = savedProperties.length === 0;
    empty.hidden = savedProperties.length !== 0;

    // Update dashboard statistics.
    renderSummary(savedProperties);

    // Synchronize favorite buttons across the page.
    if (typeof app.syncFavoriteUI === 'function') {
      app.syncFavoriteUI();
    }

    // Refresh icons after updating the HTML.
    if (typeof app.renderIcons === 'function') {
      app.renderIcons();
    }
  }

  /**
   * Remove all saved properties using the existing favorite controls.
   */
  function clearAllFavorites() {
    var favoriteIds = app.getFavorites().slice();

    favoriteIds.forEach(function (id) {
      var buttons = grid.querySelectorAll('[data-fav-id]');

      buttons.forEach(function (button) {
        if (String(button.dataset.favId) === String(id)) {
          button.click();
        }
      });
    });

    // Refresh the dashboard after clearing favorites.
    render();
  }

  // Update the dashboard when favorites change elsewhere.
  document.addEventListener(
    'nestoria:favorites-changed',
    render
  );

  // Handle the Clear All button.
  clearAllButton.addEventListener(
    'click',
    clearAllFavorites
  );

  // Initial dashboard render.
  render();
})();