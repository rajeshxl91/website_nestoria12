
/* Nestoria — Property detail page
   Gallery, property information, agent details and visit form.
*/
(function () {
  'use strict';

  var data = window.NestoriaData;
  var app = window.Nestoria;

  // Ensure required shared scripts are loaded.
  if (!data || !app) {
    console.error('NestoriaData or Nestoria is missing. Check script loading order.');
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var propertyId = Number(params.get('id') || 1);

  var property = data.properties.find(function (item) {
    return item.id === propertyId;
  });

  var notFound = document.getElementById('not-found');
  var root = document.getElementById('detail-root');

  if (!notFound || !root) {
    console.error('Property detail page containers were not found.');
    return;
  }

  // Handle invalid property IDs.
  if (!property) {
    notFound.hidden = false;
    root.hidden = true;
    app.renderIcons();
    return;
  }

  notFound.hidden = true;
  root.hidden = false;

  // Reusable DOM helper.
  function getElement(id) {
    var element = document.getElementById(id);

    if (!element) {
      console.warn('Nestoria detail element not found:', id);
    }

    return element;
  }

  function setText(id, value) {
    var element = getElement(id);

    if (element) {
      element.textContent = value == null ? '' : String(value);
    }
  }

  function setHTML(id, html) {
    var element = getElement(id);

    if (element) {
      element.innerHTML = html;
    }
  }

  // Property heading and summary.
  function renderPropertyInfo() {
    document.title = property.title + ' | Nestoria';

    setText('crumb-current', property.title);

    setText(
      'detail-status',
      property.listing === 'rent'
        ? 'Available for Rent'
        : 'Available for Sale'
    );

    setText('detail-title', property.title);
    setText('detail-address', property.address);
    setText('detail-description', property.description);

    var price = getElement('detail-price');

    if (price) {
      price.innerHTML =
        app.escapeHtml(app.formatMoney(property.price)) +
        (property.listing === 'rent' ? ' <span>/ month</span>' : '');
    }

    var stats = [
      {
        icon: 'bed-double',
        value: property.beds + ' beds',
        label: 'Bedrooms'
      },
      {
        icon: 'bath',
        value: property.baths + ' baths',
        label: 'Bathrooms'
      },
      {
        icon: 'ruler',
        value: Number(property.area).toLocaleString('en-IN') + ' sq ft',
        label: 'Area'
      },
      {
        icon: 'building-2',
        value: property.type,
        label: 'Property type'
      }
    ];

    setHTML(
      'detail-stats',
      stats.map(function (stat) {
        return (
          '<li>' +
            '<i data-lucide="' + stat.icon + '"></i>' +
            '<div>' +
              '<strong>' + app.escapeHtml(stat.value) + '</strong>' +
              '<span>' + app.escapeHtml(stat.label) + '</span>' +
            '</div>' +
          '</li>'
        );
      }).join('')
    );

    var amenities = Array.isArray(property.amenities)
      ? property.amenities
      : [];

    setHTML(
      'detail-amenities',
      amenities.map(function (item) {
        return (
          '<li>' +
            '<i data-lucide="check-circle-2"></i>' +
            app.escapeHtml(item) +
          '</li>'
        );
      }).join('')
    );

    var features = Array.isArray(property.features)
      ? property.features
      : [];

    setHTML(
      'detail-features',
      features.map(function (item) {
        return (
          '<li>' +
            '<i data-lucide="check"></i>' +
            app.escapeHtml(item) +
          '</li>'
        );
      }).join('')
    );
  }

  // Property image gallery.
  function renderGallery() {
    var photos = data.photo || {};

    var gallery = [
      property.image,
      photos.livingRoom,
      photos.villaB,
      photos.apartmentInterior
    ].filter(Boolean);

    if (!gallery.length) {
      return;
    }

    var mainImage = getElement('gallery-main');
    var thumbs = getElement('gallery-thumbs');

    if (!mainImage || !thumbs) {
      return;
    }

    function showImage(index) {
      if (!gallery[index]) {
        return;
      }

      mainImage.src = gallery[index];
      mainImage.alt = property.title + ' photo ' + (index + 1);

      thumbs.querySelectorAll('[data-gallery-index]').forEach(function (button) {
        button.setAttribute(
          'aria-current',
          String(Number(button.dataset.galleryIndex) === index)
        );
      });
    }

    mainImage.src = gallery[0];
    mainImage.alt = property.title;

    thumbs.innerHTML = gallery.map(function (src, index) {
      return (
        '<li>' +
          '<button type="button"' +
            ' data-gallery-index="' + index + '"' +
            ' aria-label="Show property photo ' + (index + 1) + '"' +
            ' aria-current="' + String(index === 0) + '">' +
            '<img src="' + app.escapeHtml(src) + '"' +
              ' alt="" width="300" height="220" loading="lazy">' +
          '</button>' +
        '</li>'
      );
    }).join('');

    // Use one delegated listener for the gallery.
    thumbs.addEventListener('click', function (event) {
      var button = event.target.closest('[data-gallery-index]');

      if (!button || !thumbs.contains(button)) {
        return;
      }

      showImage(Number(button.dataset.galleryIndex));
    });
  }

  // Agent details and contact links.
  function renderAgent() {
    var agents = Array.isArray(data.agents) ? data.agents : [];
    var agent = agents[property.agentIndex] || agents[0];

    if (!agent) {
      return;
    }

    var photo = getElement('agent-photo');

    if (photo) {
      photo.src = agent.image || '';
      photo.alt = agent.name || 'Property agent';
    }

    setText('agent-name', agent.name);
    setText('agent-role', agent.role);

    var phone = getElement('agent-phone');

    if (phone) {
      var phoneNumber = String(agent.phone || '');
      phone.href = 'tel:' + phoneNumber.replace(/[^\d+]/g, '');

      var phoneText = phone.querySelector('span');

      if (phoneText) {
        phoneText.textContent = phoneNumber;
      }
    }

    var email = getElement('agent-email');

    if (email) {
      var emailAddress = String(agent.email || '');
      email.href = 'mailto:' + emailAddress;

      var emailText = email.querySelector('span');

      if (emailText) {
        emailText.textContent = emailAddress;
      }
    }
  }

  // Favorite button and related properties.
  function renderRelatedProperties() {
    var favoriteButton = getElement('detail-fav');

    if (favoriteButton) {
      favoriteButton.dataset.favId = String(property.id);
      app.syncFavoriteUI();
    }

    var properties = Array.isArray(data.properties)
      ? data.properties
      : [];

    var similar = properties.filter(function (item) {
      return (
        item.id !== property.id &&
        (item.city === property.city || item.type === property.type)
      );
    }).slice(0, 3);

    setHTML(
      'similar-grid',
      similar.map(function (item) {
        return app.propertyCard(item);
      }).join('')
    );
  }

  // Visit request form.
  function setupVisitForm() {
    var form = getElement('visit-form');
    var status = getElement('visit-status');
    var dateInput = getElement('v-date');

    if (!form || !status) {
      return;
    }

    if (typeof app.bindLiveValidation === 'function') {
      app.bindLiveValidation(form);
    }

    if (dateInput) {
      // Use the local calendar date rather than UTC.
      var today = new Date();
      var year = today.getFullYear();
      var month = String(today.getMonth() + 1).padStart(2, '0');
      var day = String(today.getDate()).padStart(2, '0');

      dateInput.min = year + '-' + month + '-' + day;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.hidden = true;

      if (!app.validateForm(form)) {
        app.showStatus(
          status,
          'Please fix the highlighted fields and try again.',
          true
        );
        return;
      }

      app.showStatus(
        status,
        'Thank you. Your visit request is valid, but this demo does not send or book appointments.',
        false
      );

      form.reset();

      // Restore the minimum date after resetting the form.
      if (dateInput) {
        var now = new Date();
        dateInput.min =
          now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0');
      }
    });
  }

  // Render the complete page.
  renderPropertyInfo();
  renderGallery();
  renderAgent();
  renderRelatedProperties();
  setupVisitForm();

  // Refresh icons and favorite state after rendering.
  app.syncFavoriteUI();
  app.renderIcons();
}());
