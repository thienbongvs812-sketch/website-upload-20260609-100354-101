(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function setupMobileNav() {
        var button = document.querySelector('[data-mobile-nav-button]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function setupHero() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-search-input]');
            var region = panel.querySelector('[data-filter-region]');
            var type = panel.querySelector('[data-filter-type]');
            var year = panel.querySelector('[data-filter-year]');
            var category = panel.querySelector('[data-filter-category]');
            var grid = document.querySelector('[data-card-grid]');
            var empty = document.querySelector('[data-empty-state]');
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));

            function apply() {
                var query = normalize(input && input.value);
                var regionValue = normalize(region && region.value);
                var typeValue = normalize(type && type.value);
                var yearValue = normalize(year && year.value);
                var categoryValue = normalize(category && category.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var searchText = normalize(card.getAttribute('data-search'));
                    var cardRegion = normalize(card.getAttribute('data-region'));
                    var cardType = normalize(card.getAttribute('data-type'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var cardCategory = normalize(card.getAttribute('data-category'));
                    var matched = true;
                    if (query && searchText.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (regionValue && cardRegion !== regionValue) {
                        matched = false;
                    }
                    if (typeValue && cardType !== typeValue) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (categoryValue && cardCategory !== categoryValue) {
                        matched = false;
                    }
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [input, region, type, year, category].forEach(function (element) {
                if (element) {
                    element.addEventListener('input', apply);
                    element.addEventListener('change', apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var queryParam = params.get('q');
            if (queryParam && input) {
                input.value = queryParam;
            }
            apply();
        });
    }

    function setupHeroSearch() {
        var input = document.querySelector('[data-hero-search]');
        var button = document.querySelector('[data-hero-search-button]');
        if (!input || !button) {
            return;
        }
        function go() {
            var query = input.value.trim();
            if (query) {
                window.location.href = 'search.html?q=' + encodeURIComponent(query);
            } else {
                window.location.href = 'search.html';
            }
        }
        button.addEventListener('click', go);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                go();
            }
        });
    }

    ready(function () {
        setupMobileNav();
        setupHero();
        setupFilters();
        setupHeroSearch();
    });
}());
