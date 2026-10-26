/* Blog: article data, search, category filters, read more, newsletter */
(function () {
  'use strict';

  var data = window.NestoriaData;
  var app = window.Nestoria;

  // Ensure required dependencies are available.
  if (!data || !app || typeof app.escapeHtml !== 'function') {
    console.error('Blog initialization failed: Nestoria dependencies are missing.');
    return;
  }

  var esc = app.escapeHtml;
  var photo = data.photo;

  var categories = [
    'All',
    'Buying Guides',
    'Rental Tips',
    'Interior Design',
    'Market Insights'
  ];

  var articles = [
    {
      id: 1,
      featured: true,
      category: 'Buying Guides',
      title: "The First-Time Buyer's Checklist: 12 Things to Do Before You Make an Offer",
      date: 'Oct 6, 2026',
      read: '9 min read',
      image: photo.houseA,
      excerpt:
        'From mortgage pre-approval to neighborhood walk-throughs, this checklist keeps your first purchase organized and stress-free.',
      body:
        'Start with your numbers: get a pre-approval, set a ceiling that leaves room for repairs, and list your must-haves separately from nice-to-haves. Then visit each short-listed home at different times of day, ask about recent utility bills and review the inspection report line by line before you negotiate.'
    },
    {
      id: 2,
      category: 'Rental Tips',
      title: 'How to Read a Lease Without a Lawyer',
      date: 'Sep 28, 2026',
      read: '6 min read',
      image: photo.apartmentInterior,
      excerpt:
        'Deposits, break clauses and maintenance duties explained in plain language, plus the questions to ask before you sign.',
      body:
        'Look first at the term, the rent increase clause and who pays for repairs. Ask how the deposit is held and returned, confirm what counts as normal wear, and get every verbal promise written into the agreement.'
    },
    {
      id: 3,
      category: 'Interior Design',
      title: 'Five Ways to Make a Small Living Room Feel Bigger',
      date: 'Sep 19, 2026',
      read: '5 min read',
      image: photo.livingRoom,
      excerpt:
        'Lighting, mirrors and furniture scale can change how a room feels without a renovation.',
      body:
        'Pull furniture slightly off the walls, choose pieces with visible legs, and layer warm lighting at different heights. A large mirror opposite a window doubles the daylight, and a single consistent floor tone makes the room read as one space.'
    },
    {
      id: 4,
      category: 'Market Insights',
      title: 'Rent Trends in 2026: Where Prices Are Cooling',
      date: 'Sep 10, 2026',
      read: '7 min read',
      image: photo.tower,
      excerpt:
        'A look at which cities are seeing slower rent growth and what it means for negotiating your next renewal.',
      body:
        'Cities with a wave of new apartment completions are giving tenants more leverage. If your market has rising vacancy, ask for a smaller increase or extra months of fixed rent before you consider moving.'
    },
    {
      id: 5,
      category: 'Buying Guides',
      title: 'Villa, House or Apartment: Which Fits Your Next Ten Years?',
      date: 'Aug 30, 2026',
      read: '8 min read',
      image: photo.villaPool,
      excerpt:
        'Maintenance, community costs and resale value compared so you can choose with confidence.',
      body:
        'Apartments trade space for convenience and shared amenities. Houses add yard and privacy with more upkeep, and villas combine both at a premium. Match the choice to how long you will stay and how much time you want to spend maintaining it.'
    },
    {
      id: 6,
      category: 'Interior Design',
      title: 'Materials That Age Well: A Guide to Timeless Finishes',
      date: 'Aug 21, 2026',
      read: '6 min read',
      image: photo.interiorB,
      excerpt:
        'Natural stone, oak and linen: how to pick finishes that still look right in a decade.',
      body:
        'Choose a calm base of natural materials and put trend-led colors in cushions, art and paint, which are cheap to change. Solid wood and honed stone develop character instead of looking worn.'
    },
    {
      id: 7,
      category: 'Rental Tips',
      title: 'Moving Day Without the Chaos: A Two-Week Plan',
      date: 'Aug 12, 2026',
      read: '5 min read',
      image: photo.apartmentA,
      excerpt:
        'A simple countdown for utilities, packing and address changes so nothing is left to the last minute.',
      body:
        'Book movers and transfer utilities two weeks out. Pack one room per day, keep an essentials box for the first night and photograph the empty unit on both move-out and move-in days.'
    },
    {
      id: 8,
      category: 'Market Insights',
      title: 'Is Now a Good Time to Buy? Reading the Mortgage Rate Signals',
      date: 'Aug 2, 2026',
      read: '7 min read',
      image: photo.houseD,
      excerpt:
        'How to think about rates, timing and your own finances instead of chasing headlines.',
      body:
        'Rates matter, but your monthly budget and time horizon matter more. Compare payments at a few rate scenarios, keep an emergency fund after the down payment and plan to refinance only if the numbers clearly work.'
    }
  ];

  var state = {
    category: 'All',
    query: ''
  };

  var expanded = {};

  // DOM elements.
  var grid = document.getElementById('blog-grid');
  var empty = document.getElementById('blog-empty');
  var featuredWrap = document.getElementById('featured-wrap');
  var countEl = document.getElementById('blog-count');
  var searchInput = document.getElementById('blog-q');
  var chipWrap = document.getElementById('category-filters');
  var resetButton = document.getElementById('blog-reset');
  var newsForm = document.getElementById('newsletter-form');
  var newsStatus = document.getElementById('news-status');

  // Verify that the expected blog elements exist.
  if (
    !grid ||
    !empty ||
    !featuredWrap ||
    !countEl ||
    !searchInput ||
    !chipWrap ||
    !resetButton ||
    !newsForm ||
    !newsStatus
  ) {
    console.error('Blog initialization failed: one or more HTML elements are missing.');
    return;
  }

  /**
   * Check whether an article matches the selected category and search query.
   */
  function matches(article) {
    var inCategory =
      state.category === 'All' ||
      article.category === state.category;

    var query = state.query.trim().toLowerCase();

    var searchableText = (
      article.title +
      ' ' +
      article.excerpt +
      ' ' +
      article.body +
      ' ' +
      article.category
    ).toLowerCase();

    var inQuery =
      !query || searchableText.indexOf(query) !== -1;

    return inCategory && inQuery;
  }

  /**
   * Generate article date and reading-time metadata.
   */
  function meta(article) {
    return (
      '<div class="article-meta">' +
        '<span>' +
          '<i data-lucide="calendar"></i>' +
          esc(article.date) +
        '</span>' +
        '<span>' +
          '<i data-lucide="clock"></i>' +
          esc(article.read) +
        '</span>' +
      '</div>'
    );
  }

  /**
   * Generate the Read More / Show Less section.
   */
  function readMore(article) {
    var isOpen = Boolean(expanded[article.id]);

    var fullText = isOpen
      ? '<p class="article-full">' + esc(article.body) + '</p>'
      : '';

    var buttonLabel = isOpen ? 'Show less' : 'Read More';
    var iconName = isOpen ? 'chevron-up' : 'arrow-right';

    return (
      fullText +
      '<button type="button" class="text-link" ' +
        'data-read="' + article.id + '" ' +
        'aria-expanded="' + isOpen + '">' +
        buttonLabel +
        '<i data-lucide="' + iconName + '"></i>' +
      '</button>'
    );
  }

  /**
   * Generate a standard article card.
   */
  function card(article) {
    var imageUrl = app.img(article.image, 700);

    return (
      '<article class="article-card">' +
        '<img src="' + esc(imageUrl) + '" ' +
          'alt="' + esc(article.category + ': ' + article.title) + '" ' +
          'width="700" height="437" loading="lazy">' +

        '<div class="article-card-body">' +
          '<span class="article-tag">' + esc(article.category) + '</span>' +
          '<h3>' + esc(article.title) + '</h3>' +
          meta(article) +
          '<p class="article-excerpt">' + esc(article.excerpt) + '</p>' +
          readMore(article) +
        '</div>' +
      '</article>'
    );
  }

  /**
   * Generate the featured article.
   */
  function renderFeatured(article) {
    if (!article) {
      featuredWrap.innerHTML = '';
      featuredWrap.hidden = true;
      return;
    }

    var imageUrl = app.img(article.image, 1000);

    featuredWrap.innerHTML =
      '<article class="featured-article">' +
        '<img src="' + esc(imageUrl) + '" ' +
          'alt="' + esc(article.title) + '" ' +
          'width="1000" height="700">' +

        '<div class="featured-body">' +
          '<span class="article-tag">Featured &middot; ' +
            esc(article.category) +
          '</span>' +

          '<h2 id="featured-article-title">' +
            esc(article.title) +
          '</h2>' +

          meta(article) +
          '<p class="article-excerpt">' + esc(article.excerpt) + '</p>' +
          readMore(article) +
        '</div>' +
      '</article>';

    featuredWrap.hidden = false;
  }

  /**
   * Update the blog grid and all related UI.
   */
  function render() {
    var filteredArticles = articles.filter(matches);

    var featuredArticle = filteredArticles.find(function (article) {
      return article.featured;
    });

    var remainingArticles = filteredArticles.filter(function (article) {
      return article !== featuredArticle;
    });

    // Render featured content and article cards.
    renderFeatured(featuredArticle);

    grid.innerHTML = remainingArticles.map(card).join('');
    grid.hidden = remainingArticles.length === 0;

    // Show the empty state when there are no matching articles.
    empty.hidden = filteredArticles.length !== 0;

    // Update the matching article count.
    if (filteredArticles.length === 0) {
      countEl.textContent = '';
    } else {
      countEl.textContent =
        filteredArticles.length +
        (filteredArticles.length === 1 ? ' article' : ' articles');
    }

    // Update category filter accessibility states.
    chipWrap.querySelectorAll('.chip').forEach(function (chip) {
      var isActive = chip.dataset.category === state.category;

      chip.setAttribute('aria-pressed', String(isActive));
    });

    // Re-render icons after updating the HTML.
    if (typeof app.renderIcons === 'function') {
      app.renderIcons();
    }
  }

  /**
   * Create category filter buttons.
   */
  function renderCategories() {
    chipWrap.innerHTML = categories.map(function (category) {
      return (
        '<button type="button" class="chip" ' +
          'data-category="' + esc(category) + '" ' +
          'aria-pressed="false">' +
          esc(category) +
        '</button>'
      );
    }).join('');
  }

  // Category filter click handler.
  chipWrap.addEventListener('click', function (event) {
    var chip = event.target.closest('.chip');

    if (!chip || !chipWrap.contains(chip)) {
      return;
    }

    state.category = chip.dataset.category;
    render();
  });

  // Live article search.
  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    render();
  });

  // Reset category and search filters.
  resetButton.addEventListener('click', function () {
    state.category = 'All';
    state.query = '';

    searchInput.value = '';

    render();
  });

  // Toggle article body text using event delegation.
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-read]');

    if (!button) {
      return;
    }

    var articleId = button.dataset.read;

    expanded[articleId] = !expanded[articleId];

    render();

    // Return focus to the corresponding button after rendering.
    var updatedButton = document.querySelector(
      '[data-read="' + articleId + '"]'
    );

    if (updatedButton) {
      updatedButton.focus();
    }
  });

  /**
   * Initialize newsletter form validation.
   */
  if (typeof app.bindLiveValidation === 'function') {
    app.bindLiveValidation(newsForm);
  }

  newsForm.addEventListener('submit', function (event) {
    event.preventDefault();

    newsStatus.hidden = true;

    if (typeof app.validateForm !== 'function') {
      console.error('Newsletter validation is unavailable.');
      return;
    }

    if (!app.validateForm(newsForm)) {
      return;
    }

    if (typeof app.showStatus === 'function') {
      app.showStatus(
        newsStatus,
        'Thanks. Your email looks valid. This is a demo, so no subscription was created.',
        false
      );
    }

    newsForm.reset();
  });

  // Initialize the blog page.
  renderCategories();
  render();
})();
