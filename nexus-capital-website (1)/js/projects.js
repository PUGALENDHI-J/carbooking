/* ==========================================================================
   PROJECTS — filter gallery
   ========================================================================== */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.resource-card[data-category]');

  function applyFilter(filter) {
    filterBtns.forEach((b) => b.classList.toggle('is-active', b.getAttribute('data-filter') === filter));
    cards.forEach((card) => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('is-hidden', !match);
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter')));
  });

  // Support deep links from the navbar mega menu, e.g. projects.html#commercial
  const hashFilter = (window.location.hash || '').replace('#', '');
  const validFilters = Array.from(filterBtns).map((b) => b.getAttribute('data-filter'));
  if (hashFilter && validFilters.includes(hashFilter)) {
    applyFilter(hashFilter);
  }
})();
