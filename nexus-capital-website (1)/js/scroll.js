/* ==========================================================================
   SCROLL — reveal animation, progress bar, back-to-top, parallax
   ========================================================================== */
(function () {
  /* ---- Scroll progress bar ---- */
  const progress = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---- Back to top ---- */
  const topBtn = document.querySelector('.fab--top');
  function toggleTopBtn() {
    if (!topBtn) return;
    topBtn.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', toggleTopBtn, { passive: true });
  toggleTopBtn();
  if (topBtn) {
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal], .text-reveal-line');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty('--delay', (i % 6) * 0.08 + 's');
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ---- Mouse parallax on hero shapes ---- */
  const shapes = document.querySelectorAll('.hero__shape, .floating-shape');
  if (shapes.length) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 6;
        shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  /* ---- Hero background subtle parallax on scroll ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        heroBg.style.transform = `scale(1.08) translateY(${y * 0.15}px)`;
      },
      { passive: true }
    );
  }

  /* ---- Smooth anchor scroll for in-page links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
})();
