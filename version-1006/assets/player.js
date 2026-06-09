(function () {
  function startPlayer(source) {
    var video = document.querySelector('[data-movie-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var hls = null;
    var prepared = false;

    if (!video || !source) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      prepare();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.startPlayer = startPlayer;
})();
