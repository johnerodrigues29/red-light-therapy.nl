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
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link || !link.href.includes('nuvibody.com/') || !link.href.includes('sca_ref=')) return;
    if (typeof window.loadGA === 'function') window.loadGA();
    if (typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', {
      affiliate_brand: 'Nuvibody', product_name: link.dataset.product || link.textContent.trim(),
      link_url: link.href, page_path: window.location.pathname, transport_type: 'beacon'
    });
  });
});
