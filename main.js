document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu');
  const nav = document.getElementById('site-nav');
  const groups = [...document.querySelectorAll('.nav-group')];
  const closeGroups = () => groups.forEach(group => { group.open = false; });
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Menu openen');
    closeGroups();
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
      if (!open) closeGroups();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    groups.forEach(group => group.addEventListener('toggle', () => {
      if (group.open) groups.filter(other => other !== group).forEach(other => { other.open = false; });
    }));
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const openGroup = groups.find(group => group.open);
      if (openGroup) { openGroup.open = false; openGroup.querySelector('summary').focus(); }
      else if (nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
    window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
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
