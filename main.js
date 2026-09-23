document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu');
  const nav = document.getElementById('site-nav');
  const groups = [...document.querySelectorAll('.nav-group')];
  const closeGroups = () => groups.forEach(group => { group.open = false; });
  const backdrop = document.querySelector('.menu-backdrop');
  const outside = [...document.body.children].filter(el => !el.matches('.site-header,.menu-backdrop,script,.skip-link'));
  const setOpen = open => {
    document.body.classList.toggle('menu-open', open);
    outside.forEach(el => { el.inert = open; });
  };
  const closeMenu = () => {
    setOpen(false);
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Menu openen');
    closeGroups();
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      setOpen(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
      if (!open) closeGroups();
    });
    backdrop?.addEventListener('click', () => { closeMenu(); toggle.focus(); });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    groups.forEach(group => group.addEventListener('toggle', () => {
      if (group.open) groups.filter(other => other !== group).forEach(other => { other.open = false; });
    }));
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab' && nav.classList.contains('is-open')) {
        const focusable = [...document.querySelectorAll('.site-header a, .site-header button, .site-header summary')].filter(el => el.getClientRects().length);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      if (event.key !== 'Escape') return;
      const openGroup = groups.find(group => group.open);
      if (openGroup) { openGroup.open = false; openGroup.querySelector('summary').focus(); }
      else if (nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
    window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
  }
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

// Mailchimp POST, adapted from the supplied newsletter form.
document.querySelectorAll('.newsletter-form').forEach(form => {
  const button = form.querySelector('.newsletter-submit');
  const status = form.querySelector('.newsletter-status');
  const direct = form.querySelector('[data-direct-submit]');
  form.addEventListener('submit', async event => {
    if (event.submitter === direct) return;
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    if (form.querySelector('.newsletter-honey input').value) return;
    button.disabled = true;
    button.textContent = 'Bezig met verzenden…';
    status.textContent = '';
    direct.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      await fetch(form.action, {method:'POST', mode:'no-cors', body:new FormData(form), signal:controller.signal});
      // An opaque response cannot confirm acceptance by Mailchimp.
      status.textContent = 'Je aanvraag is verstuurd. Controleer je inbox en spammap op een eventuele bevestigingsmail. Bevestig je aanmelding als daarom wordt gevraagd. Niets ontvangen? Open het Mailchimp-formulier om je aanmelding te controleren.';
      button.textContent = 'Aanvraag verstuurd';
      direct.hidden = false;
    } catch (_) {
      status.textContent = 'We konden de verzending niet afronden. Probeer opnieuw of open het Mailchimp-formulier.';
      button.disabled = false;
      button.textContent = 'Opnieuw proberen';
      direct.hidden = false;
    } finally { clearTimeout(timeout); }
  });
});
