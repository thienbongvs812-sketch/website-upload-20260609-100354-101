(function () {
    function initMoviePlayer(streamUrl) {
        var video = document.getElementById('moviePlayer');
        var shell = document.querySelector('.player-wrap');
        var button = document.querySelector('[data-play-button]');
        var prepared = false;
        var hlsInstance = null;

        if (!video || !shell || !button || !streamUrl) {
            return;
        }

        function attachStream() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function startPlayback() {
            attachStream();
            shell.classList.add('is-playing');

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', startPlayback);

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                shell.classList.remove('is-playing');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
