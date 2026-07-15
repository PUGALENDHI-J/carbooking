/* ==========================================================================
   MAIN — global init
   ========================================================================== */
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-scrolled-check');

  // Set current year in footer
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Hero card slideshow
  const card = document.querySelector('.hero__card');
  if (card) {
    const slides = card.querySelectorAll('.hero__card-slide');
    const dotsContainer = card.querySelector('.hero__card-dots');
    let current = 0;
    let interval;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('span');

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function startAuto() {
      interval = setInterval(next, 3500);
    }

    function stopAuto() {
      clearInterval(interval);
    }

    card.addEventListener('mouseenter', stopAuto);
    card.addEventListener('mouseleave', startAuto);

    startAuto();
  }
});
