(function () {
  'use strict';

  var root = document.documentElement;

  // Theme toggle: dark by default, light follows the system unless overridden.
  var toggle = document.querySelector('.theme-toggle');
  var label = toggle && toggle.querySelector('.theme-toggle__label');
  var systemLight = window.matchMedia('(prefers-color-scheme: light)');

  function currentTheme() {
    return root.dataset.theme || (systemLight.matches ? 'light' : 'dark');
  }

  function render() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    label.textContent = next;
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (toggle) {
    toggle.hidden = false;
    render();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    });
    systemLight.addEventListener('change', render);
  }

  // Mark the section currently in view in the navigation.
  var links = document.querySelectorAll('.site-header nav a');
  if (!('IntersectionObserver' in window) || !links.length) return;

  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      byId[entry.target.id].setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-30% 0px -65% 0px' });

  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
