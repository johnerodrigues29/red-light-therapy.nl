(() => {
  'use strict';
  if (typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'mito-offer';
  dialog.setAttribute('aria-labelledby', 'mito-offer-title');
  dialog.setAttribute('aria-describedby', 'mito-offer-description');
  dialog.innerHTML = '<button type="button" class="mito-offer-close" aria-label="Sluiten">×</button><span class="mito-offer-label">JOUW MITO LIGHT VOORDEEL</span><h2 id="mito-offer-title">Goed nieuws: 5% korting voor jou!</h2><p id="mito-offer-description">Gebruik deze kortingscode in je winkelwagen voordat je de aankoop afrondt.</p><div class="mito-offer-code"><strong>REDLIGHTNL5</strong><button type="button" class="mito-offer-copy">Kopieer code</button></div><p class="mito-offer-status" role="status" aria-live="polite"></p><a class="cta-button mito-offer-go" target="_blank" rel="sponsored nofollow noopener" data-brand="MITO LIGHT">Ga naar MITO LIGHT →</a><p class="mito-offer-note">De korting wordt niet automatisch toegepast. Controleer vóór betaling of de code is verwerkt.</p>';
  document.body.append(dialog);
  let trigger;
  const go = dialog.querySelector('.mito-offer-go');
  const status = dialog.querySelector('.mito-offer-status');
  const copy = dialog.querySelector('.mito-offer-copy');
  dialog.querySelector('.mito-offer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('mito-offer-open');
    trigger?.focus({preventScroll: true});
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('REDLIGHTNL5');
      status.textContent = 'Gekopieerd! Plak de code straks in je winkelwagen.';
      copy.textContent = 'Gekopieerd ✓';
    } catch {
      status.textContent = 'Selecteer de code en kopieer hem handmatig.';
      const range = document.createRange();
      range.selectNodeContents(dialog.querySelector('.mito-offer-code strong'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  // Intercept before the shared affiliate tracker; only the onward click counts.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-mito-offer]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    trigger = link;
    go.href = link.href;
    go.dataset.product = link.dataset.product || link.textContent.trim();
    status.textContent = '';
    copy.textContent = 'Kopieer code';
    dialog.showModal();
    document.body.classList.add('mito-offer-open');
  }, true);
})();
