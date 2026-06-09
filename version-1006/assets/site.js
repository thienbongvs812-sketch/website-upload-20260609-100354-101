(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-dot]'));
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function restartTimer() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        restartTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        restartTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-carousel-dot')) || 0);
        restartTimer();
      });
    });

    showSlide(0);
    restartTimer();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  var filterGrid = document.querySelector('[data-filter-grid]');

  if (filterPanel && filterGrid) {
    var searchInput = filterPanel.querySelector('[data-filter-search]');
    var regionSelect = filterPanel.querySelector('[data-filter-region]');
    var typeSelect = filterPanel.querySelector('[data-filter-type]');
    var yearSelect = filterPanel.querySelector('[data-filter-year]');
    var resetButton = filterPanel.querySelector('[data-filter-reset]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('[data-movie-card]'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput && searchInput.value);
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-keywords'));
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesRegion = !region || card.getAttribute('data-region') === region;
        var matchesType = !type || card.getAttribute('data-type') === type;
        var matchesYear = !year || card.getAttribute('data-year') === year;
        var isVisible = matchesQuery && matchesRegion && matchesType && matchesYear;

        card.hidden = !isVisible;

        if (isVisible) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        if (regionSelect) {
          regionSelect.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        applyFilters();
      });
    }
  }

  var searchResults = document.querySelector('[data-search-results]');
  var searchStatus = document.querySelector('[data-search-status]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchForm = document.querySelector('[data-search-form]');

  if (searchResults && searchStatus && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (searchInput) {
      searchInput.value = initialQuery;
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderCard(item) {
      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + escapeHtml(item.page) + '" aria-label="观看' + escapeHtml(item.title) + '">' +
        '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<span class="score-badge">' + escapeHtml(item.score) + '</span>' +
        '</a>' +
        '<div class="card-body">' +
        '<h3><a href="' + escapeHtml(item.page) + '">' + escapeHtml(item.title) + '</a></h3>' +
        '<p class="card-meta">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</p>' +
        '<p class="card-desc">' + escapeHtml(item.oneLine) + '</p>' +
        '</div>' +
        '</article>';
    }

    function runSearch(query) {
      var value = String(query || '').trim().toLowerCase();

      if (!value) {
        searchStatus.textContent = '请输入关键词开始搜索。';
        searchResults.innerHTML = '';
        return;
      }

      var matches = window.SEARCH_INDEX.filter(function (item) {
        return item.text.toLowerCase().indexOf(value) !== -1;
      });

      searchStatus.textContent = matches.length ? '搜索结果' : '没有找到匹配的影片。';
      searchResults.innerHTML = matches.slice(0, 240).map(renderCard).join('');
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var query = searchInput ? searchInput.value : '';
        var url = new URL(window.location.href);
        url.searchParams.set('q', query);
        window.history.replaceState(null, '', url.toString());
        runSearch(query);
      });
    }

    runSearch(initialQuery);
  }
})();
