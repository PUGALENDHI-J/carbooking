/* ==========================================================================
   NAVBAR — sticky state, mobile menu, active link
   ========================================================================== */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggle = navbar.querySelector('.navbar__toggle');
  const links = navbar.querySelector('.navbar__links');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      })
    );
  }

  // Active link based on current file name
  const current = (window.location.pathname.split('/').pop() || 'index.html');
  navbar.querySelectorAll('.navbar__links a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();
