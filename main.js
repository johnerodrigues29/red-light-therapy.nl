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

// Read Mailchimp's JSONP response so only accepted requests show success.
document.querySelectorAll('.newsletter-form').forEach(form => {
  const button = form.querySelector('.newsletter-submit');
  const status = form.querySelector('.newsletter-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity() || form.querySelector('.newsletter-honey input').value) return;
    button.disabled = true;
    button.textContent = 'Bezig met aanmelden…';
    status.textContent = '';
    status.classList.remove('is-success');
    const callback = 'newsletter_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const url = new URL(form.action);
    url.pathname = url.pathname.replace('/post', '/post-json');
    new FormData(form).forEach((value, key) => url.searchParams.set(key, value));
    url.searchParams.set('c', callback);
    const script = document.createElement('script');
    let timer;
    const cleanup = () => {
      clearTimeout(timer);
      script.remove();
      // Ignore a delayed response after timeout.
      window[callback] = () => {};
      setTimeout(() => { delete window[callback]; }, 60000);
    };
    const fail = () => {
      cleanup();
      button.disabled = false;
      button.textContent = 'Opnieuw proberen';
      status.textContent = 'Aanmelden is niet gelukt. Controleer je e-mailadres en probeer het opnieuw. Ben je al ingeschreven? Dan hoef je niets te doen.';
    };
    window[callback] = response => {
      if (response?.result !== 'success') { fail(); return; }
      cleanup();
      button.textContent = 'Aangemeld ✓';
      status.classList.add('is-success');
      status.textContent = '🎉 Je aanmelding is gelukt! Welkom erbij! Je hoort voortaan als eerste over onze promoties en exclusieve kortingscodes zodra ze beschikbaar zijn.';
    };
    script.onerror = fail;
    timer = setTimeout(fail, 15000);
    script.src = url.href;
    document.head.appendChild(script);
  });
});
