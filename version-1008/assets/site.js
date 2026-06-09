(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var navToggle = document.querySelector(".nav-toggle");
        var navLinks = document.querySelector(".nav-links");

        if (navToggle && navLinks) {
            navToggle.addEventListener("click", function () {
                var open = navLinks.classList.toggle("is-open");
                navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        var carousel = document.querySelector("[data-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var current = 0;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-slide")) || 0);
                });
            });

            if (slides.length > 1) {
                setInterval(function () {
                    show(current + 1);
                }, 5200);
            }
        }

        var sections = Array.prototype.slice.call(document.querySelectorAll(".catalog-section, .rank-section"));
        sections.forEach(function (section) {
            var input = section.querySelector(".catalog-search");
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card, .rank-row"));
            var pills = Array.prototype.slice.call(section.querySelectorAll(".filter-pill"));
            var activeType = "all";
            var activeValue = "all";

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var search = (card.getAttribute("data-search") || "").toLowerCase();
                    var matchText = !query || search.indexOf(query) !== -1;
                    var matchFilter = true;
                    if (activeType !== "all") {
                        matchFilter = (card.getAttribute("data-" + activeType) || "") === activeValue;
                    }
                    card.classList.toggle("is-hidden", !(matchText && matchFilter));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }

            pills.forEach(function (pill) {
                pill.addEventListener("click", function () {
                    pills.forEach(function (item) {
                        item.classList.remove("active");
                    });
                    pill.classList.add("active");
                    activeType = pill.getAttribute("data-filter-type") || "all";
                    activeValue = pill.getAttribute("data-filter-value") || "all";
                    apply();
                });
            });
        });
    });
})();
