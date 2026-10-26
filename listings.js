/* Listings page: filtering, sorting, URL params and Load More */
(function () {
  'use strict';

  // Application data and shared functions.
  var data = window.NestoriaData;
  var app = window.Nestoria;

  var PAGE_SIZE = 6;
  var visibleCount = PAGE_SIZE;

  // Main page elements.
  var form = document.getElementById('filter-form');
  var grid = document.getElementById('listings-grid');
  var countEl = document.getElementById('results-count');
  var emptyState = document.getElementById('empty-state');
  var loadMore = document.getElementById('load-more');
  var sortSelect = document.getElementById('f-sort');
  var clearFiltersButton = document.getElementById('clear-filters');
  var emptyClearButton = document.getElementById('empty-clear');

  // Filter input elements.
  var fields = {
    q: document.getElementById('f-q'),
    location: document.getElementById('f-location'),
    type: document.getElementById('f-type'),
    price: document.getElementById('f-price'),
    beds: document.getElementById('f-beds'),
    listing: document.getElementById('f-listing')
  };

  // Default filter values.
  var defaults = {
    q: '',
    location: 'any',
    type: 'any',
    price: 'any',
    beds: 'any',
    listing: 'any',
    sort: 'recommended'
  };

  // Verify required dependencies.
  if (
    !data ||
    !app ||
    !Array.isArray(data.properties) ||
    typeof app.filterProperties !== 'function' ||
    typeof app.sortProperties !== 'function' ||
    typeof app.propertyCard !== 'function'
  ) {
    console.error(
      'Listings initialization failed: required data or functions are missing.'
    );
    return;
  }

  // Verify required HTML elements.
  var requiredElements = [
    form,
    grid,
    countEl,
    emptyState,
    loadMore,
    sortSelect,
    clearFiltersButton,
    emptyClearButton
  ];

  var elementsMissing = requiredElements.some(function (element) {
    return !element;
  });

  var fieldsMissing = Object.keys(fields).some(function (key) {
    return !fields[key];
  });

  if (elementsMissing || fieldsMissing) {
    console.error(
      'Listings initialization failed: one or more HTML elements are missing.'
    );
    return;
  }

  /**
   * Read current filter values.
   */
  function readCriteria() {
    var criteria = {};

    Object.keys(fields).forEach(function (key) {
      criteria[key] = fields[key].value;
    });

    return criteria;
  }

  /**
   * Apply filter values from the URL query parameters.
   */
  function applyParams() {
    var params = new URLSearchParams(window.location.search);

    Object.keys(fields).forEach(function (key) {
      var value = params.get(key);
      var field = fields[key];

      if (value === null) {
        return;
      }

      field.value = value;

      // Fall back to the default if a select option is invalid.
      if (
        field.tagName === 'SELECT' &&
        field.value !== value
      ) {
        field.value = defaults[key];
      }
    });

    var sort = params.get('sort');

    if (sort !== null) {
      sortSelect.value = sort;

      if (sortSelect.value !== sort) {
        sortSelect.value = defaults.sort;
      }
    }
  }

  /**
   * Synchronize filters and sorting with the URL.
   */
  function updateUrl(criteria) {
    var params = new URLSearchParams();

    Object.keys(criteria).forEach(function (key) {
      var value = criteria[key];

      if (
        value &&
        value !== defaults[key]
      ) {
        params.set(key, value);
      }
    });

    if (sortSelect.value !== defaults.sort) {
      params.set('sort', sortSelect.value);
    }

    var query = params.toString();
    var newUrl = window.location.pathname +
      (query ? '?' + query : '') +
      window.location.hash;

    try {
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      // The page continues to work if the History API is unavailable.
    }
  }

  /**
   * Update the results counter.
   */
  function renderCount(total, shown) {
    if (total === 0) {
      countEl.textContent = 'No properties found';
      return;
    }

    countEl.innerHTML =
      'Showing <strong>' + shown +
      '</strong> of <strong>' + total +
      '</strong> ' +
      (total === 1 ? 'property' : 'properties');
  }

  /**
   * Render the filtered and sorted property listings.
   */
  function render() {
    var criteria = readCriteria();

    var filteredProperties = app.filterProperties(
      data.properties,
      criteria
    );

    var results = app.sortProperties(
      filteredProperties,
      sortSelect.value
    );

    var shownProperties = results.slice(0, visibleCount);

    // Render property cards.
    grid.innerHTML = shownProperties.map(function (property) {
      return app.propertyCard(property);
    }).join('');

    // Toggle results and empty state.
    grid.hidden = shownProperties.length === 0;
    emptyState.hidden = results.length !== 0;

    // Show Load More only when additional results exist.
    loadMore.hidden = results.length <= visibleCount;

    // Update the results counter.
    renderCount(results.length, shownProperties.length);

    // Synchronize URL and favorite buttons.
    updateUrl(criteria);

    if (typeof app.syncFavoriteUI === 'function') {
      app.syncFavoriteUI();
    }

    // Refresh icons after rendering cards.
    if (typeof app.renderIcons === 'function') {
      app.renderIcons();
    }
  }

  /**
   * Reset the number of visible results.
   */
  function resetVisible() {
    visibleCount = PAGE_SIZE;
  }

  /**
   * Clear all filters and restore default sorting.
   */
  function clearFilters() {
    Object.keys(fields).forEach(function (key) {
      fields[key].value = defaults[key];
    });

    sortSelect.value = defaults.sort;

    resetVisible();
    render();
  }

  /**
   * Populate filter dropdowns.
   */
  if (typeof app.fillSelect === 'function') {
    app.fillSelect(
      fields.location,
      data.locations || [],
      defaults.location
    );

    app.fillSelect(
      fields.type,
      data.types || [],
      defaults.type
    );

    app.fillSelect(
      fields.price,
      data.priceRanges || [],
      defaults.price
    );
  } else {
    console.error('Dropdown initialization function is unavailable.');
    return;
  }

  // Restore filter state from the URL.
  applyParams();

  // Prevent the filter form from submitting and reloading the page.
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    resetVisible();
    render();
  });

  // Update results when a filter changes.
  form.addEventListener('change', function () {
    resetVisible();
    render();
  });

  // Update results as the user types a search query.
  fields.q.addEventListener('input', function () {
    resetVisible();
    render();
  });

  // Update results when sorting changes.
  sortSelect.addEventListener('change', function () {
    resetVisible();
    render();
  });

  // Clear filters from either button.
  clearFiltersButton.addEventListener('click', clearFilters);
  emptyClearButton.addEventListener('click', clearFilters);

  /**
   * Load the next group of properties.
   */
  loadMore.addEventListener('click', function () {
    var previousCount = visibleCount;

    visibleCount += PAGE_SIZE;
    render();

    // Move focus to the first newly loaded property's link.
    var cards = grid.querySelectorAll('.property-card');
    var newCard = cards[previousCount];

    if (newCard) {
      var link = newCard.querySelector('a.btn, a');

      if (link) {
        link.focus();
      }
    }
  });

  // Initial page render.
  render();
})();