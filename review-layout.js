(() => {
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.review-buy');
  if (!header || !bar) return;
  const mobile = matchMedia('(max-width: 760px)');
  const offers = [...document.querySelectorAll('.review-top-offer, main .cta-wrapper')];
  const end = document.querySelector('#nieuwsbrief') || document.querySelector('.site-footer');
  let last = Math.max(0, scrollY), frame = 0;
  function update() {
    frame = 0;
    const y = Math.max(0, scrollY), delta = y - last;
    const menu = document.body.classList.contains('menu-open');
    const dialog = !!document.querySelector('dialog[open]');
    if (y < 80 || menu || dialog || header.contains(document.activeElement)) {
      header.classList.remove('header-away'); last = y;
    } else if (Math.abs(delta) > 6) {
      header.classList.toggle('header-away', delta > 0); last = y;
    }
    const offerVisible = offers.some(el => { const r = el.getBoundingClientRect(); return r.bottom > 90 && r.top < innerHeight - 90; });
    const endReached = end && end.getBoundingClientRect().top <= innerHeight;
    const visible = mobile.matches && y > 500 && !menu && !dialog && !offerVisible && !endReached;
    // Do not remove a focused purchase link while the keyboard user is activating it.
    if (!bar.contains(document.activeElement) || menu || dialog || !mobile.matches) bar.hidden = !visible;
    if (document.body.classList.contains('buy-bar-visible') !== !bar.hidden) document.body.classList.toggle('buy-bar-visible', !bar.hidden);
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  header.addEventListener('focusin', () => header.classList.remove('header-away'));
  new MutationObserver(schedule).observe(document.body, {attributes:true, attributeFilter:['class']});
  // The MITO dialog is inserted at runtime; observe open/close without changing its coupon flow.
  new MutationObserver(schedule).observe(document.body, {subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  update();
})();
