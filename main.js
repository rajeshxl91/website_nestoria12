/* Shared Nestoria UI: navigation, cards, favorites, validation and helpers */

(function () {
  'use strict';

  var data = window.NestoriaData;
  var app = {};

  // Fallback image displayed when a property image fails to load.
  var FALLBACK =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">' +
        '<rect width="800" height="520" fill="#eee9ff"/>' +
        '<path d="M170 280 400 100 630 280v150H170Z" fill="#c8bcff"/>' +
        '<path d="M340 430V300h120v130" fill="#6548e8"/>' +
        '<path d="M240 310h70v65h-70zm250 0h70v65h-70z" fill="#fff"/>' +
        '<text x="400" y="485" font-family="Arial" font-size="24" ' +
          'text-anchor="middle" fill="#24166b">Nestoria</text>' +
      '</svg>'
    );

  /**
   * Escape HTML special characters.
   */
  app.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(
      /[&<>"']/g,
      function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[character];
      }
    );
  };

  /**
   * Return an image URL or the fallback image.
   */
  app.img = function (src) {
    if (typeof src !== 'string' || !src.trim()) {
      return FALLBACK;
    }

    return src;
  };

  /**
   * Format a number as Indian Rupees.
   */
  app.formatMoney = function (amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  /**
   * Render Lucide icons when the library is available.
   */
  app.renderIcons = function () {
    if (
      window.lucide &&
      typeof window.lucide.createIcons === 'function'
    ) {
      window.lucide.createIcons();
    }
  };

  /**
   * Populate a select dropdown.
   */
  app.fillSelect = function (select, options, selected) {
    if (!select) {
      return;
    }

    options = Array.isArray(options) ? options : [];

    select.innerHTML = options.map(function (item) {
      var value = typeof item === 'string' ? item : item.value;
      var label = typeof item === 'string' ? item : item.label;

      return (
        '<option value="' + app.escapeHtml(value) + '">' +
          app.escapeHtml(label) +
        '</option>'
      );
    }).join('');

    if (
      selected != null &&
      Array.prototype.some.call(select.options, function (option) {
        return option.value === String(selected);
      })
    ) {
      select.value = String(selected);
    }
  };

  /**
   * Retrieve favorite property IDs from localStorage.
   */
  app.getFavorites = function () {
    try {
      var stored = JSON.parse(
        window.localStorage.getItem('nestoria:favorites') || '[]'
      );

      if (!Array.isArray(stored)) {
        return [];
      }

      return stored
        .map(Number)
        .filter(function (id, index, ids) {
          return Number.isFinite(id) &&
            ids.indexOf(id) === index;
        });
    } catch (error) {
      return [];
    }
  };

  /**
   * Save favorite IDs and notify the rest of the application.
   */
  function saveFavorites(ids) {
    try {
      window.localStorage.setItem(
        'nestoria:favorites',
        JSON.stringify(ids)
      );
    } catch (error) {
      // Storage may be disabled or unavailable.
    }

    document.dispatchEvent(
      new CustomEvent('nestoria:favorites-changed')
    );
  }

  /**
   * Add or remove a property from favorites.
   */
  app.toggleFavorite = function (id) {
    var propertyId = Number(id);

    if (!Number.isFinite(propertyId)) {
      return;
    }

    var ids = app.getFavorites();

    if (ids.indexOf(propertyId) !== -1) {
      ids = ids.filter(function (favoriteId) {
        return favoriteId !== propertyId;
      });
    } else {
      ids.push(propertyId);
    }

    saveFavorites(ids);
    app.syncFavoriteUI();
  };

  /**
   * Synchronize favorite buttons and header counters.
   */
  app.syncFavoriteUI = function () {
    var ids = app.getFavorites();

    document.querySelectorAll('[data-fav-id]').forEach(function (button) {
      var id = Number(button.dataset.favId);
      var active = ids.indexOf(id) !== -1;

      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-saved', active);

      var label = button.querySelector('[data-fav-text]');

      if (label) {
        label.textContent = active
          ? 'Saved to Favorites'
          : 'Save to Favorites';
      }

      var icon = button.querySelector('[data-lucide]');

      if (icon) {
        icon.setAttribute('data-lucide', 'heart');
      }

      if (button.classList.contains('fav-btn')) {
        button.setAttribute(
          'aria-label',
          active ? 'Remove from favorites' : 'Add to favorites'
        );
      }
    });

    document.querySelectorAll('[data-fav-count]').forEach(function (element) {
      element.textContent = ids.length;
      element.hidden = ids.length === 0;
    });

    app.renderIcons();
  };

  /**
   * Generate a property card.
   */
  app.propertyCard = function (property, options) {
    if (!property) {
      return '';
    }

    options = options || {};

    var saved = app.getFavorites().indexOf(Number(property.id)) !== -1;
    var listingLabel = property.listing === 'rent'
      ? 'For Rent'
      : 'For Sale';

    var price = app.formatMoney(property.price);

    if (property.listing === 'rent') {
      price += ' <span>/ month</span>';
    }

    var propertyUrl =
      'property-details.html?id=' +
      encodeURIComponent(property.id);

    return (
      '<article class="property-card">' +

        '<div class="pc-media">' +
          '<a href="' + propertyUrl + '" ' +
            'aria-label="View ' + app.escapeHtml(property.title) + '">' +

            '<img src="' +
              app.escapeHtml(app.img(property.image, 800)) +
              '" alt="' + app.escapeHtml(property.title) +
              '" width="800" height="600" loading="lazy">' +
          '</a>' +

          '<span class="pc-badge ' +
            (property.listing === 'sale' ? 'badge-sale' : '') + '">' +
            listingLabel +
          '</span>' +

          '<button type="button" class="fav-btn" ' +
            'data-fav-id="' + app.escapeHtml(property.id) + '" ' +
            'aria-label="' +
              (saved ? 'Remove from' : 'Add to') +
              ' favorites" aria-pressed="' + saved + '">' +
            '<i data-lucide="heart" aria-hidden="true"></i>' +
          '</button>' +
        '</div>' +

        '<div class="pc-body">' +

          '<p class="pc-location">' +
            '<i data-lucide="map-pin" aria-hidden="true"></i>' +
            app.escapeHtml(property.city) +
          '</p>' +

          '<h3>' +
            '<a href="' + propertyUrl + '">' +
              app.escapeHtml(property.title) +
            '</a>' +
          '</h3>' +

          '<ul class="pc-meta">' +
            '<li><i data-lucide="bed-double" aria-hidden="true"></i>' +
              app.escapeHtml(property.beds) + ' beds</li>' +

            '<li><i data-lucide="bath" aria-hidden="true"></i>' +
              app.escapeHtml(property.baths) + ' baths</li>' +

            '<li><i data-lucide="ruler" aria-hidden="true"></i>' +
              (Number(property.area) || 0).toLocaleString('en-IN') +
              ' sq ft</li>' +
          '</ul>' +

          '<div class="pc-footer">' +
            '<p class="pc-price">' + price + '</p>' +

            '<div class="pc-actions">' +
              '<a class="btn btn-outline btn-sm" href="' +
                propertyUrl + '">View Details</a>' +

              (options.removable
                ? '<button type="button" class="remove-btn" ' +
                    'data-fav-id="' +
                    app.escapeHtml(property.id) +
                  '">Remove</button>'
                : '') +
            '</div>' +
          '</div>' +

        '</div>' +
      '</article>'
    );
  };

  /**
   * Filter properties by search criteria.
   */
  app.filterProperties = function (properties, criteria) {
    criteria = criteria || {};
    properties = Array.isArray(properties) ? properties : [];

    var ranges = data && Array.isArray(data.priceRanges)
      ? data.priceRanges
      : [];

    var range = ranges.find(function (item) {
      return item.value === criteria.price;
    });

    return properties.filter(function (property) {
      var query = String(criteria.q || '').trim().toLowerCase();

      var searchableText = [
        property.title,
        property.city,
        property.address,
        property.type
      ].join(' ').toLowerCase();

      var matchesQuery =
        !query || searchableText.indexOf(query) !== -1;

      var matchesLocation =
        !criteria.location ||
        criteria.location === 'any' ||
        property.city === criteria.location;

      var matchesType =
        !criteria.type ||
        criteria.type === 'any' ||
        property.type === criteria.type;

      var matchesPrice =
        !range ||
        range.value === 'any' ||
        (
          Number(property.price) >= Number(range.min) &&
          Number(property.price) < Number(range.max)
        );

      var matchesBeds =
        !criteria.beds ||
        criteria.beds === 'any' ||
        Number(property.beds) >= Number(criteria.beds);

      var matchesListing =
        !criteria.listing ||
        criteria.listing === 'any' ||
        property.listing === criteria.listing;

      return (
        matchesQuery &&
        matchesLocation &&
        matchesType &&
        matchesPrice &&
        matchesBeds &&
        matchesListing
      );
    });
  };

  /**
   * Sort properties by price or keep the recommended order.
   */
  app.sortProperties = function (properties, sort) {
    var results = Array.isArray(properties)
      ? properties.slice()
      : [];

    if (sort === 'price-asc') {
      results.sort(function (a, b) {
        return Number(a.price) - Number(b.price);
      });
    } else if (sort === 'price-desc') {
      results.sort(function (a, b) {
        return Number(b.price) - Number(a.price);
      });
    }

    return results;
  };

  /**
   * Display a success or error message.
   */
  app.showStatus = function (element, message, error) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.hidden = false;
    element.classList.toggle('error', Boolean(error));
    element.classList.toggle('success', !error);
  };

  /**
   * Validate fields using their data-validate rules.
   */
  app.validateForm = function (form) {
    if (!form) {
      return false;
    }

    var valid = true;

    form.querySelectorAll('[data-validate]').forEach(function (field) {
      var rules = field.dataset.validate.split('|');
      var value = field.value.trim();
      var message = '';

      rules.some(function (rule) {
        if (rule === 'required' && !value) {
          message = 'This field is required.';
        } else if (rule.indexOf('min:') === 0) {
          var minLength = Number(rule.split(':')[1]);

          if (value.length < minLength) {
            message =
              'Please enter at least ' + minLength + ' characters.';
          }
        } else if (
          rule === 'email' &&
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          message = 'Enter a valid email address.';
        } else if (
          rule === 'phone' &&
          value &&
          !/^[+\d\s().-]{7,20}$/.test(value)
        ) {
          message = 'Enter a valid phone number.';
        } else if (rule === 'future' && value) {
          var selectedDate = new Date(value + 'T00:00:00');
          var today = new Date();

          today.setHours(0, 0, 0, 0);

          if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate < today
          ) {
            message = 'Choose today or a future date.';
          }
        }

        return Boolean(message);
      });

      var errorElement = document.getElementById(
        field.id + '-error'
      );

      field.setAttribute('aria-invalid', String(Boolean(message)));

      if (errorElement) {
        errorElement.textContent = message;
      }

      if (message) {
        valid = false;
      }
    });

    return valid;
  };

  /**
   * Enable validation on blur and update errors while typing.
   */
  app.bindLiveValidation = function (form) {
    if (!form) {
      return;
    }

    form.querySelectorAll('[data-validate]').forEach(function (field) {
      field.addEventListener('blur', function () {
        app.validateForm(form);
      });

      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          app.validateForm(form);
        }
      });
    });
  };

  /**
   * Render the shared site navigation.
   */
  function renderHeader() {
    var host = document.getElementById('site-header');

    if (!host) {
      return;
    }

    var pages = [
      ['home', 'Home', 'index.html'],
      ['listings', 'Listings', 'listings.html'],
      ['services', 'Services', 'services.html'],
      ['about', 'About', 'about.html'],
      ['blog', 'Blog', 'blog.html'],
      ['contact', 'Contact', 'contact.html']
    ];

    var currentPage = document.body.dataset.nav || 'home';

    host.className = 'site-header container';

    host.innerHTML =
      '<div class="nav-bar">' +

        '<a class="brand" href="index.html" aria-label="Nestoria home">' +
          '<span class="brand-mark">' +
            '<img src="assets/modern-house-wave-logo.svg" alt="">' +
          '</span>' +

          '<span class="brand-text">' +
            '<strong>Nestoria</strong>' +
            '<small>Live Elevated · India</small>' +
          '</span>' +
        '</a>' +

        '<nav class="primary-nav" id="primary-nav" ' +
          'aria-label="Main navigation">' +
          '<ul>' +

            pages.map(function (page) {
              var active = currentPage === page[0];

              return (
                '<li><a href="' + page[2] + '" class="' +
                  (active ? 'active' : '') + '"' +
                  (active ? ' aria-current="page"' : '') +
                '>' + page[1] + '</a></li>'
              );
            }).join('') +

            '<li class="nav-cta">' +
              '<a href="contact.html">Talk to an advisor</a>' +
            '</li>' +

          '</ul>' +
        '</nav>' +

        '<div class="nav-actions">' +
          '<a class="icon-btn" href="favorites.html" ' +
            'aria-label="Saved properties">' +
            '<i data-lucide="heart" aria-hidden="true"></i>' +
            '<span class="fav-count" data-fav-count hidden>0</span>' +
          '</a>' +

          '<a class="btn btn-primary" href="contact.html">Contact Us</a>' +

          '<button class="icon-btn nav-toggle" type="button" ' +
            'aria-label="Toggle navigation" aria-expanded="false" ' +
            'aria-controls="primary-nav">' +
            '<i data-lucide="menu" aria-hidden="true"></i>' +
          '</button>' +
        '</div>' +

      '</div>';

    var toggle = host.querySelector('.nav-toggle');
    var nav = host.querySelector('.primary-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');

        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  /**
   * Render the shared site footer.
   */
  function renderFooter() {
    var host = document.getElementById('site-footer');

    if (!host) {
      return;
    }

    host.innerHTML =
      '<footer class="site-footer">' +

        '<div class="container footer-grid">' +

          '<div class="footer-brand">' +
            '<a class="brand" href="index.html">' +
              '<span class="brand-mark">' +
                '<img src="assets/modern-house-wave-logo.svg" alt="">' +
              '</span>' +

              '<span class="brand-text">' +
                '<strong>Nestoria</strong>' +
                '<small>Live Elevated · India</small>' +
              '</span>' +
            '</a>' +

            '<p>Helping people find homes that fit their lives, budgets and next chapter.</p>' +
          '</div>' +

          '<div>' +
            '<h3>Explore</h3>' +
            '<ul class="footer-links">' +
              '<li><a href="listings.html">Property listings</a></li>' +
              '<li><a href="services.html">Our services</a></li>' +
              '<li><a href="about.html">About Nestoria</a></li>' +
              '<li><a href="blog.html">Real estate blog</a></li>' +
            '</ul>' +
          '</div>' +

          '<div>' +
            '<h3>Get in touch</h3>' +
            '<ul class="footer-contact">' +

              '<li>' +
                '<i data-lucide="phone" aria-hidden="true"></i>' +
                '<a href="tel:+91912294077">+91 912294077</a>' +
              '</li>' +

              '<li>' +
                '<i data-lucide="mail" aria-hidden="true"></i>' +
                '<a href="mailto:rajeshgond00322@gmail.com">' +
                  'rajeshgond00322@gmail.com' +
                '</a>' +
              '</li>' +

              '<li>' +
                '<i data-lucide="map-pin" aria-hidden="true"></i>' +
                '<span>Greater Noida, Uttar Pradesh, India</span>' +
              '</li>' +

            '</ul>' +
          '</div>' +

        '</div>' +

        '<div class="container footer-bottom">' +
          '<p>© ' + new Date().getFullYear() +
            ' Nestoria. All rights reserved.</p>' +
          '<p>Property prices are displayed in Indian Rupees (₹).</p>' +
        '</div>' +

      '</footer>';
  }

  /**
   * Handle clicks on favorite and Remove buttons.
   */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-fav-id]');

    if (!button) {
      return;
    }

    event.preventDefault();

    app.toggleFavorite(button.dataset.favId);
  });

  /**
   * Replace broken images with the fallback image.
   */
  document.addEventListener('error', function (event) {
    var image = event.target;

    if (
      !image ||
      image.tagName !== 'IMG' ||
      image.dataset.fallbackApplied
    ) {
      return;
    }

    image.dataset.fallbackApplied = 'true';
    image.src = FALLBACK;
  }, true);

  // Expose shared functions to other JavaScript files.
  window.Nestoria = app;

  // Initialize shared page elements.
  renderHeader();
  renderFooter();
  app.syncFavoriteUI();
  app.renderIcons();
})();