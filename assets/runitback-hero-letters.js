/**
 * RUNITBACK CLASSICS — Hero Cipher Scramble
 *
 * Animation: each letter starts invisible, rapidly cycles through random
 * characters (cipher-machine style), then snaps / "locks" to the real letter
 * with a colour flash. Staggered left-to-right per line.
 *
 * Line 1 (RUNITBACK, solid):  lock-in with lime glow burst
 * Line 2 (CLASSICS, outline): lock-in with red+cyan chromatic split
 *
 * Hover the hero h1 to replay.
 */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────── */
  var CHARS        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&%!';
  var FRAME_MS     = 55;    /* ms between scramble frames per letter     */
  var SCRAMBLE_N   = 9;     /* # of random frames before lock-in         */
  var FLASH_MS     = 120;   /* ms the lock-in flash colour is held        */
  var SETTLE_MS    = 80;    /* ms after flash before switching to .rb-locked */

  /* Stagger: each letter starts its scramble this much later than previous */
  var STAGGER_MS   = 80;

  /* Line 2 starts this many ms after line 1 kicks off */
  var LINE2_DELAY  = 200;

  /* Letter spacing (em) injected as inline margin-right on each .rb-letter */
  var SPACING_LINE1 = '0.13em';   /* RUNITBACK — wide but not excessive */
  var SPACING_LINE2 = '0.22em';   /* CLASSICS  — even wider, more airy  */

  /* ── Helpers ─────────────────────────────────────── */
  function rand() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  /* Animate one letter through the scramble sequence */
  function animateLetter(innerEl, finalChar, isOutline) {
    var frame     = 0;
    var flashClass = isOutline ? 'rb-flash-outline' : 'rb-flash-solid';

    function tick() {
      if (frame < SCRAMBLE_N) {
        /* Show a random character with scramble styling */
        innerEl.textContent = rand();
        innerEl.className   = 'rb-letter__inner rb-scrambling';
        frame++;
        setTimeout(tick, FRAME_MS);
      } else {
        /* Lock-in flash: show real letter with colour burst */
        innerEl.textContent = finalChar;
        innerEl.className   = 'rb-letter__inner ' + flashClass;

        setTimeout(function () {
          /* Settle: restore correct CSS (outline stroke, white, etc.) */
          innerEl.className   = 'rb-letter__inner rb-locked';
          innerEl.textContent = finalChar;
        }, FLASH_MS + SETTLE_MS);
      }
    }

    tick();
  }

  /* Build split-letter HTML for one line, then kick off animations */
  function buildLine(lineEl, spacing, lineDelay, isOutline) {
    var text = lineEl.getAttribute('aria-label') || lineEl.textContent.trim();

    /* Build wrapper spans */
    var html = '';
    text.split('').forEach(function (ch, i) {
      var isSpace = ch === ' ';
      html +=
        '<span class="rb-letter" style="margin-right:' +
        (isSpace ? '0.4em' : spacing) +
        '">' +
        (isSpace
          ? ''
          : '<span class="rb-letter__inner">' + ch + '</span>') +
        '</span>';
    });
    lineEl.innerHTML = html;

    /* Schedule scramble animations */
    var letterIdx = 0;
    text.split('').forEach(function (ch) {
      if (ch === ' ') return;
      var inner = lineEl.querySelectorAll('.rb-letter__inner')[letterIdx];
      var delay = lineDelay + letterIdx * STAGGER_MS;
      letterIdx++;
      if (!inner) return;
      setTimeout(function () {
        animateLetter(inner, ch, isOutline);
      }, delay);
    });
  }

  function build(titleEl) {
    /* Reset _rbLetters flag so replay works */
    var lines = titleEl.querySelectorAll('[data-rb-split-letters]');

    lines.forEach(function (line, i) {
      var isOutline = line.classList.contains('rb-hero__title-line--outline');
      var spacing   = isOutline ? SPACING_LINE2 : SPACING_LINE1;
      var delay     = i === 0 ? 0 : LINE2_DELAY;
      buildLine(line, spacing, delay, isOutline);
    });
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var titleEl = document.getElementById('rb-hero-title');
    if (!titleEl || titleEl._rbCipher) return;
    titleEl._rbCipher = true;

    /* Small initial delay so the page has painted */
    setTimeout(function () { build(titleEl); }, 180);

    /* Hover → replay */
    titleEl.addEventListener('mouseenter', function () {
      build(titleEl);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Shopify editor section reload */
  document.addEventListener('shopify:section:load', function () {
    var titleEl = document.getElementById('rb-hero-title');
    if (titleEl) titleEl._rbCipher = false;
    init();
  });
})();
