/* ==========================================================================
   CINEMATIC — additive scroll storytelling layer
   Auto-enhances existing markup; does not require HTML changes on most
   pages. Only the hero on index.html opts in via [data-cinematic].
   ========================================================================== */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1) SPLIT-TEXT REVEAL — auto-wraps headline words for a staggered rise
     ---------------------------------------------------------------------- */
  function splitText() {
    const targets = document.querySelectorAll(
      '.section-head h2:not([data-char-reveal]), .cta-band h2, .page-header h1, .cinematic-quote__text'
    );
    targets.forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = 'true';
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map(
          (w, i) =>
            `<span class="split-word" style="--word-delay:${i * 0.045}s">${w}</span> `
        )
        .join('');
      el.classList.add('split-ready');
    });

    if (!('IntersectionObserver' in window) || reduceMotion) {
      document.querySelectorAll('.split-ready').forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll('.split-ready').forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------------
     2) IMAGE MASK REVEAL — wipes a gold panel off feature imagery on scroll
     ---------------------------------------------------------------------- */
  function maskReveal() {
    const selectors = [
      '.about-preview__media',
      '.project-card',
      '.team-card__photo',
    ];
    const els = document.querySelectorAll(selectors.join(','));
    els.forEach((el) => el.classList.add('mask-reveal'));

    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-revealed'), i * 90);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------------
     3) MAGNETIC BUTTONS — subtle pull toward cursor on hover (desktop only)
     ---------------------------------------------------------------------- */
  function magneticButtons() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const targets = document.querySelectorAll('.btn-primary, .fab--whatsapp, .fab--call');
    targets.forEach((el) => {
      el.classList.add('magnetic');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ----------------------------------------------------------------------
     4) HERO BACKGROUND SLIDESHOW
      ---------------------------------------------------------------------- */
  function initHeroSlideshow() {
    const hero = document.querySelector('.hero[data-cinematic]');
    if (!hero) return;
    const slides = hero.querySelectorAll('.hero__bg-slide');
    if (slides.length < 2) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
  }

  /* ----------------------------------------------------------------------
     5) PINNED CINEMATIC HERO — drives 3 crossfading scenes across scroll
      ---------------------------------------------------------------------- */
  function cinematicHero() {
    const hero = document.querySelector('.hero[data-cinematic]');
    if (!hero) return;

    // Build the sticky stage + scene-2 layer only once, from existing content.
    let stage = hero.querySelector('.hero__stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'hero__stage';
      // Move all existing hero children into the sticky stage (no content removed).
      while (hero.firstChild) stage.appendChild(hero.firstChild);
      hero.appendChild(stage);

      // Scene 2: a large stat callout, built from data already on the page.
      const statNum = document.querySelector('[data-count]');
      const scene = document.createElement('div');
      scene.className = 'hero__scene-stat';
      scene.innerHTML = `
        <div class="hero__scene-stat__num">${statNum ? statNum.getAttribute('data-count') : '6'}+</div>
        <div class="hero__scene-stat__label">Years Connecting Investors in Coimbatore</div>
      `;
      stage.appendChild(scene);

      const dots = document.createElement('div');
      dots.className = 'hero__scene-dots';
      dots.innerHTML = '<span class="is-active"></span><span></span><span></span>';
      stage.appendChild(dots);
    }

    if (reduceMotion) return;

    const content = stage.querySelector('.hero__content');
    const sceneStat = stage.querySelector('.hero__scene-stat');
    const bg = stage.querySelector('.hero__bg');
    const dots = [...stage.querySelectorAll('.hero__scene-dots span')];

    function onScroll() {
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);

      // Scene 1 (0 - 0.4): title content visible, fades out
      // Scene 2 (0.35 - 0.7): big stat crossfades in, then out
      // Scene 3 (0.65 - 1): everything fades to reveal next section
      const scene1 = 1 - smoothstep(0.28, 0.46, progress);
      const scene2 = smoothstep(0.36, 0.5, progress) * (1 - smoothstep(0.66, 0.82, progress));
      const overallFade = 1 - smoothstep(0.82, 1, progress);

      if (content) {
        content.style.opacity = '1';
        content.style.transform = 'none';
      }
      if (sceneStat) {
        sceneStat.style.opacity = String(scene2 * overallFade);
        sceneStat.style.transform = `scale(${0.94 + scene2 * 0.06})`;
      }
      if (bg) {
        bg.style.transform = `scale(${1.08 + progress * 0.1}) translateY(${progress * 60}px)`;
      }
      if (dots.length) {
        const activeIndex = progress < 0.4 ? 0 : progress < 0.75 ? 1 : 2;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
      }
    }

    function smoothstep(edge0, edge1, x) {
      const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
      return t * t * (3 - 2 * t);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     6) HORIZONTAL SCROLL — translates services track on vertical scroll
      ---------------------------------------------------------------------- */
  function initHorizontalScroll() {
    const section = document.querySelector('[data-services-split]');
    if (!section || reduceMotion) return;

    function cleanup() {
      section.style.minHeight = '';
    }

    if (window.innerWidth <= 991) {
      cleanup();
      return;
    }

    const inner = section.querySelector('.services-split__inner');
    const left = section.querySelector('.services-split__left');
    const track = section.querySelector('.services-split__track');
    if (!inner || !left || !track) return;

    function updateHeight() {
      const visibleW = left.offsetWidth;
      const scrollW = track.scrollWidth - visibleW;
      const extra = Math.max(scrollW, 0);
      section.style.minHeight = `${window.innerHeight + extra + 80}px`;
    }

    updateHeight();

    function onResize() {
      if (window.innerWidth <= 991) {
        cleanup();
        return;
      }
      updateHeight();
    }
    window.addEventListener('resize', onResize);

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const visibleW = left.offsetWidth;
      const scrollW = track.scrollWidth - visibleW;
      track.style.transform = `translateX(-${progress * Math.max(scrollW, 0)}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     7) PARALLAX HEAD — subtle vertical parallax on section heads
      ---------------------------------------------------------------------- */
  function initParallaxHeads() {
    if (reduceMotion) return;
    const heads = document.querySelectorAll('[data-parallax-head]');
    if (!heads.length) return;
    const isMobile = window.innerWidth <= 991;

    function onScroll() {
      heads.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) / window.innerHeight;
        const distance = isMobile ? 12 : 30;
        const translateY = offset * distance;
        el.style.transform = `translateY(${translateY}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     8) CHAR REVEAL — staggered character fade-in for [data-char-reveal]
      ---------------------------------------------------------------------- */
  function initCharReveal() {
    const targets = document.querySelectorAll('[data-char-reveal]');
    targets.forEach((el) => {
      if (el.dataset.charDone) return;
      el.dataset.charDone = 'true';
      const chars = el.textContent.trim().split('');
      el.innerHTML = chars
        .map((c, i) => {
          if (c === ' ') return ' ';
          return `<span class="char-unit" style="--char-delay:${i * 0.035}s">${c}</span>`;
        })
        .join('');
      el.classList.add('char-ready');
    });

    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------------
     9) STEP REVEAL — staggered entrance + sliding bar for [data-step-reveal]
      ---------------------------------------------------------------------- */
  function initStepReveal() {
    const targets = document.querySelectorAll('[data-step-reveal]');
    if (!targets.length) return;

    if (reduceMotion) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    targets.forEach((el) => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    splitText();
    maskReveal();
    magneticButtons();
    initHeroSlideshow();
    cinematicHero();
    initHorizontalScroll();
    initParallaxHeads();
    initCharReveal();
    initStepReveal();
  });
})();
