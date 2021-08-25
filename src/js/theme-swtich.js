(function() {
  const root = document.documentElement;

  // Check for dark mode preference at the OS level.
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.classList.add('is-dark');
  }

  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('is-dark');
  }

  if (localStorage.getItem('theme') === 'light') {
    root.classList.remove('is-dark');
  }

  // Listen for a click on the switch theme button.
  document.getElementById('switch-theme').addEventListener('click', () => {
    root.classList.toggle('is-dark');

    const theme = root.classList.contains('is-dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
})();
