/**
 * CLASSICS — Slot Text 3D
 *
 * Each letter is a spinning drum. Random characters roll through in 3D space
 * before the correct letter snaps into place, staggered left → right.
 * Top/bottom gradient fades reinforce the cylindrical drum illusion.
 * Hover the hero title to replay. Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  var WORD      = 'CLASSICS';
  var CHARS     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var REEL_N    = 10;    /* random chars before the final one */
  var ITEM_H    = 0.88;  /* em — must match CSS --sh value    */
  var BASE_DEL  = 180;   /* ms — initial pause before slot 0  */
  var STAGGER   = 75;    /* ms — between each letter's start  */
  var BASE_DUR  = 700;   /* ms — how long each drum spins     */

  /* Final translateY to show the last item:
     -(REEL_N) * ITEM_H em  (REEL_N randoms + 1 final = REEL_N+1 items, index REEL_N) */
  var SLOT_TO = (-REEL_N * ITEM_H).toFixed(4);

  function rand() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function buildSlot(finalChar, idx) {
    var items = '';
    for (var i = 0; i < REEL_N; i++) {
      items += '<span class="rb-slot__item" aria-hidden="true">' + rand() + '</span>';
    }
    items += '<span class="rb-slot__item rb-slot__item--final">' + finalChar + '</span>';

    var delay = BASE_DEL + idx * STAGGER;
    var dur   = BASE_DUR + idx * 12;   /* tiny per-letter variation */

    return (
      '<span class="rb-slot__drum" style="' +
        '--sd:'  + delay   + 'ms;' +
        '--sdur:' + dur     + 'ms;' +
        '--sto:' + SLOT_TO + 'em;' +
        '--sh:'  + ITEM_H  + 'em'  +
      '">' +
        '<span class="rb-slot__reel">' + items + '</span>' +
      '</span>'
    );
  }

  function build(el) {
    el.setAttribute('aria-label', WORD);
    el.innerHTML = WORD.split('').map(buildSlot).join('');
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var el = document.querySelector('.rb-hero__title-line--outline');
    if (!el || el._slotFx) return;
    el._slotFx = true;

    build(el);

    /* hover anywhere on the h1 replays */
    var title = el.closest('.rb-hero__title') || el;
    title.addEventListener('mouseenter', function () {
      if (el._slotFx) build(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', function () {
    var el = document.querySelector('.rb-hero__title-line--outline');
    if (el) el._slotFx = false;
    init();
  });
})();
