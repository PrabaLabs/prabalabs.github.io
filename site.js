// Shared behaviour: mobile menu, YouTube cards, Web3Forms submission.
(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // YouTube thumbnail that turns into a player on click
  function videoButton(id, title, square) {
    var button = document.createElement('button');
    button.className = 'video' + (square ? ' video-square' : '');
    button.setAttribute('aria-label', 'Play video: ' + title);
    var image = document.createElement('img');
    image.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
    image.alt = '';
    image.loading = 'lazy';
    image.onload = function () {
      if (image.naturalWidth < 400 && image.src.indexOf('maxres') > -1) {
        image.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      }
    };
    var play = document.createElement('span');
    play.className = 'play';
    button.append(image, play);
    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.className = button.className + ' video-frame';
      button.replaceWith(frame);
    });
    return button;
  }
  window.PRABALABS_videoButton = videoButton;

  // Any element with data-youtube="ID" becomes a playable thumbnail
  document.querySelectorAll('[data-youtube]').forEach(function (holder) {
    var id = holder.getAttribute('data-youtube');
    if (!id || id === 'YOUTUBE_ID') return;
    holder.replaceWith(videoButton(id, holder.getAttribute('data-title') || 'PrabaLabs video', holder.hasAttribute('data-square')));
  });

  // Tutorial grid from videos.js
  var grid = document.getElementById('cards');
  var videos = window.PRABALABS_VIDEOS || [];
  if (grid && videos.length) {
    var limit = parseInt(grid.getAttribute('data-limit') || '0', 10) || videos.length;
    var moreLink = grid.querySelector('.card-link');
    videos.slice(0, limit).forEach(function (video) {
      var card = document.createElement('article');
      card.className = 'card';
      card.append(videoButton(video.id, video.youtubeTitle));
      ['title', 'text', 'tags'].forEach(function (key, i) {
        if (!video[key]) return;
        var el = document.createElement(i === 0 ? 'h3' : 'p');
        el.textContent = video[key];
        if (key === 'tags') el.className = 'tags';
        card.append(el);
      });
      grid.insertBefore(card, moreLink);
    });
  }

  // Web3Forms submission without leaving the page
  document.querySelectorAll('form[data-web3forms]').forEach(function (form) {
    var status = form.querySelector('.status');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var key = form.querySelector('[name="access_key"]').value;
      if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = 'The form is not connected yet. Please email prabalabs@gmail.com instead.';
        status.className = 'status err';
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.textContent = 'Sending...';
      status.className = 'status';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (data.success) {
          status.textContent = 'Thank you. We will reply within one working day.';
          status.className = 'status ok';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      }).catch(function () {
        status.textContent = 'Something went wrong. Please email prabalabs@gmail.com.';
        status.className = 'status err';
      }).finally(function () { button.disabled = false; });
    });
  });
})();
