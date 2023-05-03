/**
 * Highlight all pre code blocks
 */

(function() {
  const codes = document.querySelectorAll('pre code');

  if (codes.length < 1) {
    return;
  }

  const script = document.createElement('script');
  script.src = '/assets/highlight.min.js';
  document.head.append(script);

  script.addEventListener('load', () => {
    if ('hljs' in window) {
      window.hljs.highlightAll();
    }
  });

  codes.forEach((element) => {
    const html = element.innerHTML;

    // Find all spaces from string beginning
    const pattern = html.match(/\s*\n[\t\s]*/);

    element.innerHTML = html.replace(new RegExp(pattern, 'g'), '\n');
  });
})();
