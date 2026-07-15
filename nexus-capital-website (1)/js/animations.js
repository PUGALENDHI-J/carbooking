/* ==========================================================================
   ANIMATIONS — button ripple, testimonial slider, FAQ accordion
   ========================================================================== */
(function () {
  /* ---- Button ripple ---- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---- Testimonial slider ---- */
  const track = document.querySelector('.testimonial-track');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsWrap = document.querySelector('.testimonial-dots');
    let index = 0;
    let timer;

    if (dotsWrap) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('is-active');
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(i) {
      index = i;
      cards.forEach((c, ci) => c.classList.toggle('is-active', ci === i));
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, di) => d.classList.toggle('is-active', di === i));
      }
    }

    function next() {
      goTo((index + 1) % cards.length);
    }

    if (cards.length > 1) {
      timer = setInterval(next, 5000);
      track.addEventListener('mouseenter', () => clearInterval(timer));
      track.addEventListener('mouseleave', () => (timer = setInterval(next, 5000)));
    }
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item__q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---- Lazy image fade-in ---- */
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.classList.add('lazy-img');
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'));
    }
  });
})();
