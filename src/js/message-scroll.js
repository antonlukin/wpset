/**
 * Scroll to messages on page load
 */

(function() {
  const message = document.querySelector('.message');

  if (null === message) {
    return;
  }

  // Get current URL
  const location = document.location;

  if (location.href.match(/[?&]message=/i)) {
    const section = message.closest('.sections') || message;

    // Remove message param from URL
    const params = location.search.replace(/[\?&]message=[^&]+/, '').replace(/^&/, '?');
    window.history.replaceState(null, '', location.pathname + params);

    // Scroll to the message section
    window.addEventListener('load', () => {
      section.scrollIntoView();
    });
  }
})();
