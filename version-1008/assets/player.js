(function () {
    function startVideo(video, trigger, source) {
        if (!video || !source) {
            return;
        }

        function play() {
            if (trigger) {
                trigger.classList.add("hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    if (trigger) {
                        trigger.classList.remove("hidden");
                    }
                });
            }
        }

        if (video.getAttribute("data-ready") === "1") {
            play();
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.setAttribute("data-ready", "1");
            play();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video.hls = hls;
            video.setAttribute("data-ready", "1");
            hls.on(window.Hls.Events.MANIFEST_PARSED, play);
            return;
        }

        video.src = source;
        video.setAttribute("data-ready", "1");
        play();
    }

    window.MoviePlayer = {
        init: function (options) {
            var video = document.getElementById(options.videoId);
            var trigger = document.getElementById(options.triggerId);
            var source = options.source;

            if (trigger) {
                trigger.addEventListener("click", function () {
                    startVideo(video, trigger, source);
                });
                trigger.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        startVideo(video, trigger, source);
                    }
                });
            }

            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        startVideo(video, trigger, source);
                    }
                });
            }
        }
    };
})();
