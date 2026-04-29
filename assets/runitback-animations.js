/* Runitback Classics — Scroll reveal + micro-interactions */

(function () {
  'use strict';

  /* ---- Scroll reveal via IntersectionObserver ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rb-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initReveal() {
    document.querySelectorAll('.rb-reveal').forEach((el) => revealObserver.observe(el));
  }

  /* ---- Auto-tag main titles for "drop into place" ---- */
  function initTitleAnimations() {
    const titleSelectors = [
      'h1', 'h2', 'h3',
      '.rb-hero__title',
      '.rb-brands__title',
      '.rb-vip__title',
      '.rb-product-section-title',
      '.section-title',
      '.h1', '.h2', '.h3',
      '.main-title',
      '.collection__title',
      '.product__title',
      '.product-title',
      '.product-card__title'
    ];
    
    document.querySelectorAll(titleSelectors.join(',')).forEach((title) => {
      // Avoid double-tagging or tagging if it already has reveal classes
      if (!title.classList.contains('rb-title-reveal')) {
        title.classList.add('rb-reveal', 'rb-title-reveal');
      }
    });
  }

  /* ---- Brand card tilt on hover ---- */
  function initBrandTilt() {
    document.querySelectorAll('.rb-brand-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(500px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---- Product card hover scale image ---- */
  function initProductCardHover() {
    document.querySelectorAll('.product-card, [class*="card--product"]').forEach((card) => {
      const img = card.querySelector('img');
      if (!img) return;
      img.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      card.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.06)'; });
      card.addEventListener('mouseleave', () => { img.style.transform = ''; });
    });
  }

  /* ---- Hero parallax on scroll ---- */
  function initHeroParallax() {
    const bg = document.querySelector('.rb-hero__bg-rainbow');
    if (!bg) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.35;
        bg.style.transform = `rotate(-22deg) translateY(calc(-50% + ${y}px))`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ---- Ticker pause on reduced motion ---- */
  function respectReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      document.querySelectorAll('.rb-ticker__track').forEach((t) => {
        t.style.animationDuration = '0s';
        t.style.animationPlayState = 'paused';
      });
    }
  }

  /* ---- Init ---- */
  function init() {
    initTitleAnimations();
    initReveal();
    initBrandTilt();
    initProductCardHover();
    initHeroParallax();
    respectReducedMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-run on Shopify section refresh in theme editor */
  document.addEventListener('shopify:section:load', () => {
    initTitleAnimations();
    initReveal();
    initBrandTilt();
    initProductCardHover();
  });
})();
