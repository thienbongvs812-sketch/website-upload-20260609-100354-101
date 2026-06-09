(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
            return;
        }
        document.addEventListener('DOMContentLoaded', callback);
    }

    function setupMobileMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var heading = hero.querySelector('[data-hero-heading]');
        var line = hero.querySelector('[data-hero-line]');
        var meta = hero.querySelector('[data-hero-meta]');
        var link = hero.querySelector('[data-hero-link]');
        var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-title]'));

        thumbs.forEach(function (thumb, index) {
            if (index === 0) {
                thumb.classList.add('is-active');
            }
            thumb.addEventListener('click', function () {
                thumbs.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                thumb.classList.add('is-active');
                hero.style.backgroundImage = "url('" + thumb.dataset.heroImage + "')";
                if (heading) {
                    heading.textContent = thumb.dataset.heroTitle;
                }
                if (line) {
                    line.textContent = thumb.dataset.heroLine;
                }
                if (meta) {
                    var parts = (thumb.dataset.heroMeta || '').split(' · ');
                    meta.innerHTML = parts.map(function (part) {
                        return '<span>' + escapeHtml(part) + '</span>';
                    }).join('');
                }
                if (link) {
                    link.href = thumb.dataset.heroLink;
                }
            });
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setupFilters() {
        var searchInput = document.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var count = document.querySelector('[data-result-count]');
        var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
        var fixedCategoryInput = document.querySelector('[data-fixed-category]');
        var activeCategory = fixedCategoryInput ? fixedCategoryInput.value : 'all';

        if (!cards.length) {
            if (count) {
                count.textContent = '0';
            }
            return;
        }

        function applyFilter() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var visibleIds = new Set();

            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.category,
                    card.dataset.tags
                ].join(' ').toLowerCase();
                var categoryMatches = activeCategory === 'all' || card.dataset.category === activeCategory;
                var queryMatches = !query || haystack.indexOf(query) !== -1;
                var shouldShow = categoryMatches && queryMatches;
                card.classList.toggle('is-hidden', !shouldShow);
                if (shouldShow) {
                    visibleIds.add(card.dataset.id || card.dataset.title || String(visibleIds.size));
                }
            });

            if (count) {
                count.textContent = String(visibleIds.size);
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                activeCategory = button.dataset.filterValue;
                applyFilter();
            });
        });

        applyFilter();
    }

    function setupPlayerScroll() {
        var button = document.querySelector('[data-scroll-player]');
        var player = document.querySelector('[data-movie-player]');
        if (!button || !player) {
            return;
        }
        button.addEventListener('click', function (event) {
            event.preventDefault();
            player.scrollIntoView({ behavior: 'smooth', block: 'start' });
            var playButton = player.querySelector('[data-player-start]');
            if (playButton) {
                setTimeout(function () {
                    playButton.focus();
                }, 450);
            }
        });
    }

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
        setupPlayerScroll();
    });
})();
