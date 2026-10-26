
(function () {
    'use strict';

    // Get shared Nestoria data and application utilities
    var data = window.NestoriaData;
    var app = window.Nestoria;

    // ==========================================
    // TEAM SECTION
    // ==========================================

    var team = [
        {
            name: 'Rajesh',
            role: 'Team Leader',
            image: 'rajesh-leader.jpeg'
        },
        {
            name: 'Shubham',
            role: 'Team Member',
            image: 'shubham-team-member.jpeg'
        }

        
    ];

    var teamGrid = document.getElementById('team-grid');

    if (teamGrid && app) {
        teamGrid.innerHTML = team.map(function (member) {
            return `
                <article class="team-card">
                    <img
                        src="${member.image}"
                        alt="${app.escapeHtml(member.name)} - ${app.escapeHtml(member.role)}"
                        width="500"
                        height="500"
                        loading="lazy"
                    >
                    <div>
                        <strong>${app.escapeHtml(member.name)}</strong>
                        <span>${app.escapeHtml(member.role)}</span>
                    </div>
                </article>
            `;
        }).join('');
    }

    // ==========================================
    // INTRODUCTION IMAGE
    // ==========================================

    var introImage = document.getElementById('intro-img');

    if (introImage && app && data && data.photo) {
        introImage.src = app.img(data.photo.villaB, 1000);
    }

    // ==========================================
    // ANIMATED STATISTICS
    // ==========================================

    var counters = document.querySelectorAll('[data-count]');

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(element) {
        var target = Number(element.dataset.count);
        var suffix = element.dataset.suffix || '';
        var startTime = null;
        var duration = 1400;

        if (!Number.isFinite(target)) {
            return;
        }

        function updateCounter(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            var progress = Math.min(
                (timestamp - startTime) / duration,
                1
            );

            var currentValue = Math.round(target * progress);

            element.textContent =
                currentValue.toLocaleString('en-IN') + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            }
        }

        window.requestAnimationFrame(updateCounter);
    }

    if (reduceMotion) {
        counters.forEach(function (counter) {
            counter.textContent =
                Number(counter.dataset.count).toLocaleString('en-IN') +
                (counter.dataset.suffix || '');
        });
    } else if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.6
            }
        );

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    // ==========================================
    // LUCIDE ICONS
    // ==========================================

    if (app && typeof app.renderIcons === 'function') {
        app.renderIcons();
    }

    // ==========================================
    // LIVE LOCATION
    // ==========================================

    var locationButton = document.getElementById(
        'live-location-button'
    );

    var locationStatus = document.getElementById(
        'live-location-status'
    );

    var locationMap = document.getElementById(
        'live-location-map'
    );

    var locationLink = document.getElementById(
        'live-location-link'
    );

    if (
        locationButton &&
        locationStatus &&
        locationMap &&
        locationLink
    ) {
        locationButton.addEventListener('click', function () {

            // Check browser support
            if (!navigator.geolocation) {
                locationStatus.textContent =
                    'Your browser does not support live location.';
                return;
            }

            locationButton.disabled = true;

            locationStatus.textContent =
                'Requesting location permission...';

            navigator.geolocation.getCurrentPosition(

                // Location successfully received
                function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    var west = longitude - 0.01;
                    var south = latitude - 0.01;
                    var east = longitude + 0.01;
                    var north = latitude + 0.01;

                    var bounds = [
                        west,
                        south,
                        east,
                        north
                    ].join('%2C');

                    locationMap.src =
                        'https://www.openstreetmap.org/export/embed.html' +
                        '?bbox=' + bounds +
                        '&layer=mapnik' +
                        '&marker=' + latitude + '%2C' + longitude;

                    locationMap.hidden = false;

                    locationLink.href =
                        'https://www.google.com/maps?q=' +
                        latitude + ',' + longitude;

                    locationLink.hidden = false;

                    locationStatus.textContent =
                        'Your location is shown below. This page does not send your coordinates to the Nestoria website server.';

                    locationButton.disabled = false;
                },

                // Location permission denied or location unavailable
                function (error) {
                    if (error.code === 1) {
                        locationStatus.textContent =
                            'Location permission was denied. Allow location access in your browser and try again.';
                    } else if (error.code === 2) {
                        locationStatus.textContent =
                            'Your location is unavailable. Check your device location settings and try again.';
                    } else {
                        locationStatus.textContent =
                            'The location request timed out. Please try again.';
                    }

                    locationButton.disabled = false;
                },

                // Location settings
                {
                    enableHighAccuracy: true,
                    timeout: 12000,
                    maximumAge: 0
                }
            );
        });
    }

})();
