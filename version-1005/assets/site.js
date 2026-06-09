(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function text(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function schedule() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                schedule();
            });
        });

        hero.addEventListener("mouseenter", function () {
            window.clearInterval(timer);
        });
        hero.addEventListener("mouseleave", schedule);
        show(0);
        schedule();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var targetName = panel.getAttribute("data-filter-panel");
            var grid = document.querySelector('[data-filter-grid="' + targetName + '"]');
            if (!grid) {
                return;
            }
            var input = panel.querySelector("[data-filter-text]");
            var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-select]"));
            var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
            var empty = document.querySelector('[data-filter-empty="' + targetName + '"]');
            var params = new URLSearchParams(window.location.search);
            var incoming = params.get("q");
            if (incoming && input) {
                input.value = incoming;
            }

            function apply() {
                var q = input ? text(input.value) : "";
                var active = {};
                selects.forEach(function (select) {
                    active[select.getAttribute("data-filter-select")] = text(select.value);
                });
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = text(card.getAttribute("data-keywords") + " " + card.getAttribute("data-title"));
                    var matched = !q || haystack.indexOf(q) !== -1;
                    Object.keys(active).forEach(function (key) {
                        var expected = active[key];
                        if (!expected) {
                            return;
                        }
                        var actual = text(card.getAttribute("data-" + key));
                        if (actual !== expected) {
                            matched = false;
                        }
                    });
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            selects.forEach(function (select) {
                select.addEventListener("change", apply);
            });
            apply();
        });
    }

    function initMoviePlayer(videoId, layerId, sourceUrl) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        if (!video || !sourceUrl) {
            return;
        }
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal && hlsInstance) {
                        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                            hlsInstance.startLoad();
                        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                            hlsInstance.recoverMediaError();
                        } else {
                            hlsInstance.destroy();
                        }
                    }
                });
            } else {
                video.src = sourceUrl;
            }
        }

        function start(event) {
            if (event) {
                event.preventDefault();
            }
            attach();
            if (layer) {
                layer.classList.add("is-hidden");
            }
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {
                    if (layer) {
                        layer.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (layer) {
            layer.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", function () {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
