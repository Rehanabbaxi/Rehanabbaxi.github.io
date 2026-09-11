// ---------- Light / dark toggle (choice is remembered) ----------
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : systemDark.matches;
  }

  function paint() {
    var dark = isDark();
    btn.textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });

  systemDark.addEventListener('change', paint);
  paint();
})();

// ---------- Highlight the current section in the nav ----------
(function () {
  var links = document.querySelectorAll('.nav a');
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach(function (s) { observer.observe(s); });
})();

// ---------- Contact form (sends via Formspree without leaving the page) ----------
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  function show(msg) { status.textContent = msg; status.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      show('The contact form isn\'t set up yet. Please email rehan020345@gmail.com directly.');
      return;
    }

    var button = form.querySelector('button');
    button.disabled = true;
    show('Sending…');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        show('Thanks! Your message has been sent. I\'ll get back to you soon.');
      } else {
        show('Something went wrong. Please email rehan020345@gmail.com instead.');
      }
    }).catch(function () {
      show('Couldn\'t send (are you offline?). Please email rehan020345@gmail.com instead.');
    }).finally(function () {
      button.disabled = false;
    });
  });
})();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
