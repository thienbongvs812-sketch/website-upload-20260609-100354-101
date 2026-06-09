(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var heroIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === heroIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === heroIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showHero(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
        var input = panel.querySelector('[data-filter-search]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var regionSelect = panel.querySelector('[data-filter-region]');
        var scope = document.querySelector(panel.getAttribute('data-filter-panel'));
        var empty = document.querySelector('[data-no-results]');

        if (!scope) {
            return;
        }

        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var q = normalize(input && input.value);
            var type = normalize(typeSelect && typeSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.textContent
                ].join(' '));
                var ok = true;

                if (q && haystack.indexOf(q) === -1) {
                    ok = false;
                }
                if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
                    ok = false;
                }
                if (year && normalize(card.getAttribute('data-year')).indexOf(year) === -1) {
                    ok = false;
                }
                if (region && normalize(card.getAttribute('data-region')).indexOf(region) === -1) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        [input, typeSelect, yearSelect, regionSelect].forEach(function (field) {
            if (field) {
                field.addEventListener('input', applyFilter);
                field.addEventListener('change', applyFilter);
            }
        });
    });
})();
