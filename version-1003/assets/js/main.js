(function () {
    var navButton = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('is-open');
            navButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                play();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                play();
            });
        });

        showSlide(0);
        play();
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterGrid = document.querySelector('[data-filter-grid]');
    var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));

    function applyFilter() {
        if (!filterGrid) {
            return;
        }

        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var typeSelect = document.querySelector('[data-filter-select="type"]');
        var regionSelect = document.querySelector('[data-filter-select="region"]');
        var typeValue = typeSelect ? typeSelect.value.trim().toLowerCase() : '';
        var regionValue = regionSelect ? regionSelect.value.trim().toLowerCase() : '';
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchType = !typeValue || text.indexOf(typeValue) !== -1;
            var matchRegion = !regionValue || text.indexOf(regionValue) !== -1;
            card.classList.toggle('is-hidden', !(matchKeyword && matchType && matchRegion));
        });
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query) {
            filterInput.value = query;
        }

        filterInput.addEventListener('input', applyFilter);
    }

    selects.forEach(function (select) {
        select.addEventListener('change', applyFilter);
    });

    applyFilter();
})();
