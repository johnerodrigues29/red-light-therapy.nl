document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu');
  const list = document.querySelector('nav ul');
  if (toggle && list) {
    const close = () => { list.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Menu openen'); };
    toggle.addEventListener('click', () => { const open = list.classList.toggle('active'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen'); });
    list.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && list.classList.contains('active')) { close(); toggle.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('nav')) close(); });
  }
  document.querySelectorAll('[data-copy-code]').forEach(button => {
    button.addEventListener('click', async () => {
      const code = button.dataset.copyCode;
      const status = button.parentElement.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(code);
        status.textContent = 'Gekopieerd! Plak de code bij het afrekenen.';
      } catch (_) {
        const text = button.parentElement.querySelector('.coupon-code');
        const range = document.createRange(); range.selectNodeContents(text);
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        status.textContent = 'Kopieer de geselecteerde code handmatig: ' + code;
      }
    });
  });
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const dest = new URL(link.href);
    const brand = link.dataset.brand || (dest.hostname === 'nuvibody.com' && dest.searchParams.has('sca_ref') ? 'Nuvibody' : '');
    if (!brand || !link.rel.split(/\s+/).includes('sponsored')) return;
    if (typeof window.loadGA === 'function') window.loadGA();
    if (typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', {
      affiliate_brand: brand, product_name: link.dataset.product || link.textContent.trim(),
      link_url: link.href, page_path: window.location.pathname, transport_type: 'beacon'
    });
  });
});
