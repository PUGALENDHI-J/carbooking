/* ==========================================================================
   PRELOADER
   ========================================================================== */
(function () {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  function hidePreloader() {
    preloader.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
    setTimeout(() => preloader.remove(), 700);
  }

  window.addEventListener('load', () => {
    // small minimum display time so it doesn't just flash
    setTimeout(hidePreloader, 500);
  });

  // safety fallback in case load event is delayed
  setTimeout(hidePreloader, 3000);
})();
