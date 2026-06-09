(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            const open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        });

        if (active < 0) {
            active = 0;
        }

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(active - 1);
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }
    });

    document.querySelectorAll('[data-filter-form]').forEach(function (panel) {
        const keywordInput = panel.querySelector('[data-filter-keyword]');
        const regionSelect = panel.querySelector('[data-filter-region]');
        const typeSelect = panel.querySelector('[data-filter-type]');
        const scope = panel.parentElement || document;
        const cards = Array.from(scope.querySelectorAll('[data-filter-card]'));
        const empty = scope.querySelector('[data-filter-empty]');
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q');

        if (keywordInput && initialQuery) {
            keywordInput.value = initialQuery;
        }

        function applyFilter() {
            const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
            const region = regionSelect ? regionSelect.value : '';
            const type = typeSelect ? typeSelect.value : '';
            let visible = 0;

            cards.forEach(function (card) {
                const text = card.getAttribute('data-search') || '';
                const cardRegion = card.getAttribute('data-region') || '';
                const cardType = card.getAttribute('data-type') || '';
                const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                const matchedRegion = !region || cardRegion.indexOf(region) !== -1 || text.indexOf(region.toLowerCase()) !== -1;
                const matchedType = !type || cardType.indexOf(type) !== -1 || text.indexOf(type.toLowerCase()) !== -1;
                const matched = matchedKeyword && matchedRegion && matchedType;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [keywordInput, regionSelect, typeSelect].forEach(function (node) {
            if (node) {
                node.addEventListener('input', applyFilter);
                node.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });

    document.querySelectorAll('[data-player]').forEach(function (panel) {
        const video = panel.querySelector('video[data-stream-url]');
        const startButton = panel.querySelector('[data-player-start]');
        const status = panel.querySelector('[data-player-status]');
        let prepared = false;
        let mediaController = null;

        if (!video) {
            return;
        }

        const streamUrl = video.getAttribute('data-stream-url');

        function showStatus(text) {
            if (status) {
                status.textContent = text;
                status.hidden = false;
            }
        }

        function hideStatus() {
            if (status) {
                status.hidden = true;
            }
        }

        function prepareVideo() {
            if (prepared || !streamUrl) {
                return prepared;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                prepared = true;
                return true;
            }

            if (window.Hls && window.Hls.isSupported()) {
                mediaController = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                mediaController.loadSource(streamUrl);
                mediaController.attachMedia(video);
                mediaController.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    showStatus('播放暂时无法加载');
                    if (mediaController) {
                        mediaController.destroy();
                        mediaController = null;
                    }
                    prepared = false;
                });
                prepared = true;
                return true;
            }

            showStatus('播放暂时无法加载');
            return false;
        }

        function start() {
            hideStatus();
            if (!prepareVideo()) {
                return;
            }
            const promise = video.play();
            panel.classList.add('is-playing');
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    showStatus('点击播放按钮继续观看');
                    panel.classList.remove('is-playing');
                });
            }
        }

        if (startButton) {
            startButton.addEventListener('click', start);
        }

        video.addEventListener('play', function () {
            panel.classList.add('is-playing');
            hideStatus();
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                return;
            }
            panel.classList.remove('is-playing');
        });
    });
})();
