import { H as Hls } from './hls-vendor.js';

function setupMoviePlayer(root) {
    const video = root.querySelector('.movie-video');
    const frame = root.querySelector('.video-frame');
    const startButton = root.querySelector('[data-player-start]');
    const status = root.querySelector('[data-player-status]');
    const source = root.dataset.videoSrc;
    let initialized = false;
    let hls = null;

    if (!video || !source) {
        if (status) {
            status.textContent = '未找到可用播放源。';
        }
        return;
    }

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function initializeSource() {
        if (initialized) {
            return;
        }
        initialized = true;

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                setStatus('HLS 清单加载完成，正在播放。');
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                var detail = data && data.details ? data.details : 'unknown';
                setStatus('播放源加载遇到问题：' + detail);
                if (data && data.fatal && hls) {
                    hls.destroy();
                    hls = null;
                    initialized = false;
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            setStatus('浏览器原生支持 HLS，正在播放。');
        } else {
            setStatus('当前浏览器不支持 HLS 播放。');
        }
    }

    function playVideo() {
        initializeSource();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
            });
        }
    }

    if (startButton) {
        startButton.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
        if (frame) {
            frame.classList.add('is-playing');
        }
    });

    video.addEventListener('pause', function () {
        if (frame && video.currentTime === 0) {
            frame.classList.remove('is-playing');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}

document.querySelectorAll('[data-movie-player]').forEach(setupMoviePlayer);
