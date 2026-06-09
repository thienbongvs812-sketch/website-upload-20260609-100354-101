(function () {
  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = queryAll('[data-hero-slide]', slider);
    var dots = queryAll('[data-hero-dot]', slider);
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var panels = queryAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var scope = panel.getAttribute('data-filter-panel');
      var grid = document.querySelector('[data-card-grid="' + scope + '"]');
      var empty = document.querySelector('[data-empty-state="' + scope + '"]');
      if (!grid) {
        return;
      }
      var cards = queryAll('[data-card]', grid);
      var inputs = queryAll('[data-filter]', panel);

      function matches(card) {
        return inputs.every(function (input) {
          var key = input.getAttribute('data-filter');
          var expected = normalize(input.value);
          if (!expected || expected === 'all') {
            return true;
          }
          var actual = normalize(card.getAttribute('data-' + key));
          if (key === 'q') {
            return normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-summary')).indexOf(expected) !== -1;
          }
          return actual === expected || actual.indexOf(expected) !== -1;
        });
      }

      function run() {
        var visible = 0;
        cards.forEach(function (card) {
          var ok = matches(card);
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      inputs.forEach(function (input) {
        input.addEventListener('input', run);
        input.addEventListener('change', run);
      });
      run();
    });
  }

  function initQuickSearch() {
    queryAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input');
        var value = input ? input.value.trim() : '';
        var url = './search.html';
        if (value) {
          url += '?q=' + encodeURIComponent(value);
        }
        window.location.href = url;
      });
    });

    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q');
    if (keyword) {
      var searchInput = document.querySelector('[data-filter="q"]');
      if (searchInput) {
        searchInput.value = keyword;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  function initPlayers() {
    queryAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var trigger = box.querySelector('[data-play-trigger]');
      var stream = box.getAttribute('data-stream');
      var attached = false;

      function playVideo() {
        if (!video || !stream) {
          return;
        }
        box.classList.add('is-playing');
        if (!attached) {
          attached = true;
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            video.addEventListener('loadedmetadata', function () {
              video.play().catch(function () {});
            }, { once: true });
          } else {
            video.src = stream;
            video.play().catch(function () {});
          }
        } else {
          video.play().catch(function () {});
        }
      }

      if (trigger) {
        trigger.addEventListener('click', playVideo);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            playVideo();
          } else {
            video.pause();
          }
        });
        video.addEventListener('play', function () {
          box.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
          if (!video.ended) {
            box.classList.remove('is-playing');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initHero();
    initQuickSearch();
    initFilters();
    initPlayers();
  });
}());
