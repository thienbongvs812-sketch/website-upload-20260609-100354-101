(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var video = document.getElementById('movie-player');
        var button = document.querySelector('[data-player-button]');
        var frame = document.querySelector('[data-player-frame]');
        var source = window.__PLAYER_SOURCE__;
        var loaded = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function attach() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            attach();
            if (button) {
                button.classList.add('is-hidden');
            }
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        if (frame) {
            frame.addEventListener('click', function (event) {
                if (event.target === video && !loaded) {
                    play();
                }
            });
        }
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
}());
