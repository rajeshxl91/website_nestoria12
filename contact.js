/* Contact page: form validation and simulated confirmation */
(function () {
  'use strict';

  // Get the Nestoria application.
  var app = window.Nestoria;

  // Get contact form elements.
  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-status');

  // Check required dependencies and elements.
  if (
    !app ||
    !form ||
    !status ||
    typeof app.validateForm !== 'function' ||
    typeof app.showStatus !== 'function'
  ) {
    console.error(
      'Contact page initialization failed: required dependencies or elements are missing.'
    );
    return;
  }

  // Enable live form validation.
  if (typeof app.bindLiveValidation === 'function') {
    app.bindLiveValidation(form);
  }

  // Handle contact form submission.
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Hide the previous status message.
    status.hidden = true;

    // Validate all form fields.
    if (!app.validateForm(form)) {
      app.showStatus(
        status,
        'Please fix the highlighted fields and try again.',
        true
      );

      return;
    }

    // Get the user's first name.
    var nameField = document.getElementById('c-name');
    var firstName = nameField
      ? nameField.value.trim().split(/\s+/)[0]
      : '';

    // Display the simulated confirmation message.
    var message = firstName
      ? 'Thanks, ' + firstName + '.! Your message has been submitted successfully. Our Nestoria team will contact you soon.'
      : 'Thank you for contacting Nestoria! Your message has been submitted successfully. Our team will contact you soon.';

    app.showStatus(status, message, false);

    // Reset the form after successful validation.
    form.reset();
  });

  // Render interface icons if available.
  if (typeof app.renderIcons === 'function') {
    app.renderIcons();
  }
})();