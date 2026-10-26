/* Homepage behaviour: featured properties, testimonials, property search */
(function () {
  'use strict';

  // Get application data and core functions.
  var data = window.NestoriaData;
  var app = window.Nestoria;

  // Verify required dependencies.
  if (!data || !app) {
    console.error(
      'Homepage initialization failed: Nestoria data or application is missing.'
    );
    return;
  }

  // Testimonials displayed on the homepage.
  var testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Renter in Noida',
      avatar: data.avatars.sarah,
      text: 'Nestoria made finding our dream home so easy. The process was smooth and fully professional.'
    },
    {
      name: 'David Miller',
      role: 'Renter in Greater Noida',
      avatar: data.avatars.david,
      text: 'Amazing service and verified listings. I got the perfect apartment in just a few days!'
    },
    {
      name: 'Emily Carter',
      role: 'Homebuyer in Gurugram',
      avatar: data.avatars.emily,
      text: 'A trusted platform with real value. Highly recommended for anyone looking for a new home.'
    }
  ];

  /**
   * Render featured property cards.
   */
  function renderFeatured() {
    var grid = document.getElementById('featured-grid');

    if (!grid) {
      console.warn('Featured properties container was not found.');
      return;
    }

    if (!Array.isArray(data.properties)) {
      console.error('Property data is unavailable.');
      grid.innerHTML = '';
      return;
    }

    var featuredProperties = [1, 2, 3].map(function (id) {
      return data.properties.find(function (property) {
        return property.id === id;
      });
    }).filter(Boolean);

    if (typeof app.propertyCard !== 'function') {
      console.error('Property card renderer is unavailable.');
      return;
    }

    grid.innerHTML = featuredProperties.map(function (property) {
      return app.propertyCard(property);
    }).join('');
  }

  /**
   * Render customer testimonials and star ratings.
   */
  function renderTestimonials() {
    var grid = document.getElementById('testimonial-grid');

    if (!grid) {
      console.warn('Testimonials container was not found.');
      return;
    }

    var stars = new Array(5)
      .fill('<i data-lucide="star" aria-hidden="true"></i>')
      .join('');

    grid.innerHTML = testimonials.map(function (testimonial) {
      return (
        '<article class="testimonial-card">' +

          '<div class="stars" role="img" aria-label="Rated 5 out of 5 stars">' +
            stars +
          '</div>' +

          '<blockquote>&ldquo;' +
            app.escapeHtml(testimonial.text) +
          '&rdquo;</blockquote>' +

          '<div class="client">' +
            '<img src="' +
              app.img(testimonial.avatar, 200) +
              '" alt="Portrait of ' +
              app.escapeHtml(testimonial.name) +
              '" width="52" height="52" loading="lazy">' +

            '<div>' +
              '<strong>' +
                app.escapeHtml(testimonial.name) +
              '</strong>' +

              '<span>' +
                app.escapeHtml(testimonial.role) +
              '</span>' +
            '</div>' +
          '</div>' +

        '</article>'
      );
    }).join('');
  }

  /**
   * Initialize the homepage property search.
   */
  function initSearch() {
    var form = document.getElementById('search-form');
    var message = document.getElementById('search-message');
    var locationSelect = document.getElementById('s-location');
    var typeSelect = document.getElementById('s-type');
    var priceSelect = document.getElementById('s-price');

    if (
      !form ||
      !message ||
      !locationSelect ||
      !typeSelect ||
      !priceSelect
    ) {
      console.warn('One or more property search elements are missing.');
      return;
    }

    if (
      typeof app.fillSelect !== 'function' ||
      typeof app.filterProperties !== 'function'
    ) {
      console.error('Property search functions are unavailable.');
      return;
    }

    // Populate search dropdowns.
    app.fillSelect(
      locationSelect,
      data.locations || [],
      'Greater Noida'
    );

    app.fillSelect(
      typeSelect,
      data.types || [],
      'any'
    );

    app.fillSelect(
      priceSelect,
      data.priceRanges || [],
      'any'
    );

    // Hide the previous search message when filters change.
    [locationSelect, typeSelect, priceSelect].forEach(function (element) {
      element.addEventListener('change', function () {
        message.hidden = true;
      });
    });

    // Handle search submission.
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var criteria = {
        location: locationSelect.value,
        type: typeSelect.value,
        price: priceSelect.value
      };

      var matches = app.filterProperties(
        data.properties || [],
        criteria
      );

      // Show a message if no properties match.
      if (!matches || matches.length === 0) {
        message.textContent =
          'No properties match those filters yet. Try a different location, property type or price range.';

        message.hidden = false;
        return;
      }

      // Redirect to listings with the selected filters.
      var params = new URLSearchParams(criteria);

      window.location.href =
        'listings.html?' + params.toString();
    });
  }

  /**
   * Set the homepage introductory image.
   */
  function initIntroImage() {
    var image = document.getElementById('why-image');

    if (!image || !data.photo || !data.photo.livingRoom) {
      return;
    }

    image.src = app.img(data.photo.livingRoom, 1000);
  }

  /**
   * Initialize homepage functionality.
   */
  function init() {
    initIntroImage();
    renderFeatured();
    renderTestimonials();
    initSearch();

    // Synchronize favorite buttons if the function is available.
    if (typeof app.syncFavoriteUI === 'function') {
      app.syncFavoriteUI();
    }

    // Render Lucide icons if supported.
    if (typeof app.renderIcons === 'function') {
      app.renderIcons();
    }
  }

  // Start homepage initialization.
  init();
})();