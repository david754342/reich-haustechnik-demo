/* ==========================================================================
   Reich Haustechnik – Interaktionen (ohne externe Bibliotheken)
   Navigation · Slider · Tabs · Karussell · Vorher/Nachher · Karte
   · Formulare · Angebots-Assistent
   ========================================================================== */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = () => window.matchMedia('(hover: hover)').matches;
  const icon = (id) => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
  const PHONE = '07633 93 43 40';

  /* ---------- Header-Schatten beim Scrollen ---------- */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Desktop-Navigation mit Dropdowns ---------- */
  const ddItems = $$('.nav__item.has-dropdown');
  const setOpen = (item, open) => {
    item.classList.toggle('is-open', open);
    $('.nav__link', item).setAttribute('aria-expanded', String(open));
  };
  ddItems.forEach((item) => {
    const btn = $('.nav__link', item);
    let closeTimer;
    let hoverOpenedAt = 0;
    item.addEventListener('mouseenter', () => {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      ddItems.forEach((other) => other !== item && setOpen(other, false));
      if (!item.classList.contains('is-open')) hoverOpenedAt = Date.now();
      setOpen(item, true);
    });
    item.addEventListener('mouseleave', () => {
      if (!canHover()) return;
      closeTimer = setTimeout(() => setOpen(item, false), 150);
    });
    btn.addEventListener('click', () => {
      if (Date.now() - hoverOpenedAt < 400) return; // gerade per Hover geöffnet
      const open = !item.classList.contains('is-open');
      ddItems.forEach((other) => setOpen(other, false));
      setOpen(item, open);
    });
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item.has-dropdown')) ddItems.forEach((i) => setOpen(i, false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openItem = ddItems.find((i) => i.classList.contains('is-open'));
    if (openItem) {
      setOpen(openItem, false);
      $('.nav__link', openItem).focus();
    }
  });

  /* ---------- Mobiles Menü ---------- */
  const mnav = $('#mobile-nav');
  const menuBtn = $('[data-menu-open]');
  if (mnav && menuBtn) {
    const panel = $('.mobile-nav__panel', mnav);
    const closeBtn = $('[data-menu-close]', mnav);
    const openMenu = () => {
      mnav.classList.add('is-open');
      mnav.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtn.focus(), 60);
    };
    const closeMenu = () => {
      mnav.classList.remove('is-open');
      mnav.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuBtn.focus();
    };
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    mnav.addEventListener('click', (e) => { if (e.target === mnav) closeMenu(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mnav.classList.contains('is-open')) closeMenu();
    });
    mnav.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $$('a, button', panel).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('.mobile-nav__toggle', mnav).forEach((btn) => {
      const sub = document.getElementById(btn.getAttribute('aria-controls'));
      const set = (open) => { btn.setAttribute('aria-expanded', String(open)); sub.hidden = !open; };
      if (sub.querySelector('[aria-current]')) set(true);
      btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    });
  }

  /* ---------- Hero-Slider ---------- */
  $$('[data-slider]').forEach((slider) => {
    const slides = $$('.hero', slider);
    const dotsWrap = $('[data-slider-dots]', slider);
    const toggle = $('[data-slider-toggle]', slider);
    if (slides.length < 2) return;

    const DURATION = 7000;
    slider.style.setProperty('--slide-ms', `${DURATION}ms`);
    let index = 0;
    let timer = null;
    let playing = !reduceMotion;
    let held = false; // Maus/Fokus im Slider
    let startedAt = 0;
    let remaining = DURATION;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slider__dot';
      b.setAttribute('aria-label', `Folie ${i + 1} anzeigen`);
      b.innerHTML = '<span></span>';
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

    const updatePausedClass = () => slider.classList.toggle('is-paused', !playing || held);

    function schedule(reset = true) {
      clearTimeout(timer);
      if (reset) remaining = DURATION;
      if (!playing || held) return;
      startedAt = Date.now();
      timer = setTimeout(() => go(index + 1), remaining);
    }

    function render() {
      slides.forEach((s, i) => {
        const active = i === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
        s.inert = !active;
      });
      dots.forEach((d, i) => {
        d.classList.remove('is-active');
        d.classList.toggle('is-done', i < index);
        d.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
      void dots[index].offsetWidth; // Fortschrittsanimation neu starten
      dots[index].classList.add('is-active');
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      render();
      schedule();
    }

    function hold(on) {
      if (on === held) return;
      held = on;
      if (on) {
        clearTimeout(timer);
        if (playing) remaining -= Date.now() - startedAt;
      } else {
        schedule(false);
      }
      updatePausedClass();
    }

    function setPlaying(on) {
      playing = on;
      toggle.innerHTML = icon(on ? 'pause' : 'play');
      toggle.setAttribute('aria-label', on ? 'Automatische Wiedergabe anhalten' : 'Automatische Wiedergabe starten');
      updatePausedClass();
      schedule();
    }

    $('[data-slider-prev]', slider).addEventListener('click', () => go(index - 1));
    $('[data-slider-next]', slider).addEventListener('click', () => go(index + 1));
    toggle.addEventListener('click', () => setPlaying(!playing));
    slider.addEventListener('mouseenter', () => hold(true));
    slider.addEventListener('mouseleave', () => hold(false));
    slider.addEventListener('focusin', () => hold(true));
    slider.addEventListener('focusout', (e) => { if (!slider.contains(e.relatedTarget)) hold(false); });
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    let touchX = null;
    slider.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    window.addEventListener('load', () => {
      $$('img[loading="lazy"]', slider).forEach((img) => { img.loading = 'eager'; });
    });

    render();
    setPlaying(playing);
  });

  /* ---------- Tabs mit Vorschaubildern (Showcase) ---------- */
  $$('[data-showcase]').forEach((sc) => {
    const tabs = $$('[role="tab"]', sc);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- Karussell (Bewertungen) ---------- */
  $$('[data-carousel]').forEach((c) => {
    const track = $('[data-carousel-track]', c);
    const prev = $('[data-carousel-prev]', c);
    const next = $('[data-carousel-next]', c);
    const step = () => {
      const item = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return item ? item.getBoundingClientRect().width + gap : track.clientWidth;
    };
    const behavior = reduceMotion ? 'auto' : 'smooth';
    const update = () => {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Vorher/Nachher-Vergleich ---------- */
  $$('[data-compare]').forEach((cmp) => {
    const range = $('input[type="range"]', cmp);
    const set = () => cmp.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', set);
    set();
  });

  /* ---------- Google Maps erst nach Klick laden (DSGVO) ---------- */
  $$('[data-map]').forEach((box) => {
    const btn = $('[data-map-load]', box);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = box.dataset.map;
      frame.title = box.dataset.mapTitle || 'Karte';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      box.appendChild(frame);
      $('.map-consent__inner', box).hidden = true;
    });
  });

  /* ---------- Einblenden beim Scrollen ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Ankerleiste: aktiven Abschnitt markieren ---------- */
  const subLinks = $$('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    subLinks.forEach((a) => {
      const sec = document.getElementById(a.hash.slice(1));
      if (sec) map.set(sec, a);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        subLinks.forEach((l) => l.classList.remove('is-active'));
        map.get(e.target).classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, sec) => spy.observe(sec));
  }

  /* ---------- Jahr im Footer ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ==========================================================================
     Formulare
     ========================================================================== */
  const MAX_FILES = 5;
  const MAX_FILE_MB = 8;

  const fieldOf = (el) => el.closest('.field');
  const checkField = (el) => {
    const field = fieldOf(el);
    if (!field) return true;
    const controls = $$('input, select, textarea', field).filter((c) => c.type !== 'hidden');
    const valid = controls.every((c) => c.checkValidity());
    field.classList.toggle('has-error', !valid);
    return valid;
  };
  const validate = (scope) => {
    const controls = $$('.field input, .field select, .field textarea', scope)
      .filter((c) => c.type !== 'hidden' && !c.disabled && !c.closest('.hp-field'));
    let firstInvalid = null;
    controls.forEach((c) => {
      if (!checkField(c) && !firstInvalid) firstInvalid = c;
    });
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      fieldOf(firstInvalid).scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    return !firstInvalid;
  };

  // Fehler entfernen, sobald korrigiert wird
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('.field.has-error');
    if (f) checkField(e.target);
  });
  document.addEventListener('change', (e) => {
    const f = e.target.closest && e.target.closest('.field.has-error');
    if (f) checkField(e.target);
  });

  // Datei-Upload mit Vorschau-Liste und Größenprüfung
  $$('[data-dropzone]').forEach((dz) => {
    const input = $('input[type="file"]', dz);
    const field = fieldOf(dz);
    const list = $('[data-file-list]', field);
    const err = $('.field__error', field);
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, () => dz.classList.add('is-dragover')));
    ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, () => dz.classList.remove('is-dragover')));
    input.addEventListener('change', () => {
      const files = [...input.files];
      let problem = '';
      list.innerHTML = '';
      if (files.length > MAX_FILES) problem = `Bitte wählen Sie maximal ${MAX_FILES} Dateien aus.`;
      files.forEach((f) => {
        if (f.size > MAX_FILE_MB * 1024 * 1024) problem = `„${f.name}“ ist größer als ${MAX_FILE_MB} MB.`;
        const li = document.createElement('li');
        const name = document.createElement('span');
        const size = document.createElement('small');
        name.textContent = f.name;
        size.textContent = `${(f.size / 1048576).toFixed(1).replace('.', ',')} MB`;
        li.append(name, size);
        list.appendChild(li);
      });
      input.setCustomValidity(problem);
      if (err) err.textContent = problem || err.dataset.default || '';
      checkField(input);
    });
  });

  // Versand per fetch (Fallback ohne JS: normaler POST an send.php)
  $$('form[data-ajax-form]').forEach((form) => {
    const ts = $('[data-ts]', form);
    if (ts) ts.value = String(Date.now());

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(form)) return;

      const status = $('[data-form-status]', form);
      const btn = $$('[type="submit"]', form).find((b) => !b.hidden);
      const label = btn.innerHTML;
      status.className = 'form-status';
      status.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';

      try {
        await new Promise((r) => setTimeout(r, 800));
        const success = $('[data-form-success]', form.parentElement);
        form.hidden = true;
        success.hidden = false;
        if (!success.querySelector('.demo-note')) {
          const n = document.createElement('p'); n.className = 'demo-note';
          n.textContent = 'Demoversion: Es wurde keine Anfrage versendet.'; success.appendChild(n);
        }
        success.focus({ preventScroll: true });
        success.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      } catch (err) {
        status.textContent = err.message && err.message !== 'Failed to fetch'
          ? err.message
          : `Ihre Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: ${PHONE}.`;
        status.classList.add('is-error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  });

  /* ==========================================================================
     Angebots-Assistent (Konfigurator)
     ========================================================================== */
  const KONFIG = {
    bad: {
      q: 'Was ist für Ihr Bad geplant?',
      opts: [['Komplettsanierung', 'layers'], ['Teilrenovierung', 'wrench'], ['Barrierefreies Bad', 'shield'],
        ['Bodengleiche Dusche', 'shower'], ['Neue Sanitärobjekte / Armaturen', 'faucet'], ['Noch offen – Beratung gewünscht', 'info']],
    },
    sanitaer: {
      q: 'Worum geht es genau?',
      opts: [['Trinkwasser- & Leitungsinstallation', 'droplet'], ['Hebeanlage', 'gauge'], ['Hauswasserstation / Filter', 'faucet'],
        ['Enthärtungsanlage', 'droplet'], ['Leck / Rohrbruch', 'alert'], ['Sonstiges', 'info']],
    },
    heizung: {
      q: 'Was planen Sie bei Ihrer Heizung?',
      opts: [['Neue Heizungsanlage', 'flame'], ['Bestehende Heizung modernisieren', 'wrench'], ['Fußbodenheizung', 'layers'],
        ['Heizkörper tauschen / ergänzen', 'radiator'], ['Hydraulischer Abgleich', 'gauge'], ['Noch offen – Beratung gewünscht', 'info']],
    },
    waermepumpe: {
      q: 'Womit heizen Sie aktuell?',
      opts: [['Gasheizung', 'flame'], ['Ölheizung', 'droplet'], ['Elektro / Nachtspeicher', 'gauge'],
        ['Neubau – noch keine Heizung', 'crane'], ['Sonstiges', 'info']],
    },
    klima: {
      q: 'Wie viele Räume sollen klimatisiert werden?',
      opts: [['1 Raum', 'house'], ['2 Räume', 'house'], ['3 Räume', 'house'], ['4 oder mehr Räume', 'building'], ['Gewerbe / Büro', 'store']],
    },
    service: {
      q: 'Wobei können wir helfen?',
      opts: [['Heizungswartung', 'radiator'], ['Wärmepumpen-Wartung', 'heatpump'], ['Reparatur / Störung', 'wrench'],
        ['Leckortung / Wasserschaden', 'droplet'], ['Gasleitung prüfen', 'flame'], ['Notfall – sofort Hilfe', 'siren']],
    },
  };

  $$('[data-konfig]').forEach((form) => {
    const steps = $$('.konfig__step', form);
    const total = steps.length;
    const bar = $('[data-konfig-bar]', form);
    const count = $('[data-konfig-count]', form);
    const prevBtn = $('[data-konfig-prev]', form);
    const nextBtn = $('[data-konfig-next]', form);
    const submitBtn = $('[data-konfig-submit]', form);
    const optWrap = $('[data-konfig-options]', form);
    const q2 = $('[data-konfig-q2]', form);
    const emergency = $('[data-konfig-emergency]', form);
    const summary = $('[data-konfig-summary]', form);
    let current = 0;
    let pointerPick = false;

    const answered = (i) => {
      const radios = $$('.konfig__options input[type="radio"]', steps[i]);
      if (!radios.length) return true;
      return [...new Set(radios.map((r) => r.name))].every((n) => form.querySelector(`input[name="${n}"]:checked`));
    };

    const renderSummary = () => {
      summary.innerHTML = '';
      ['thema', 'vorhaben', 'objekt', 'zeitraum'].forEach((n) => {
        const r = form.querySelector(`input[name="${n}"]:checked`);
        if (!r) return;
        const chip = document.createElement('span');
        chip.textContent = r.value;
        summary.appendChild(chip);
      });
    };

    const show = (i, focus = true) => {
      current = Math.max(0, Math.min(total - 1, i));
      steps.forEach((s, n) => { s.hidden = n !== current; });
      bar.style.width = `${((current + 1) / total) * 100}%`;
      count.textContent = `Schritt ${current + 1} von ${total}`;
      const last = current === total - 1;
      prevBtn.hidden = current === 0;
      nextBtn.hidden = last;
      submitBtn.hidden = !last;
      nextBtn.disabled = !answered(current);
      if (last) renderSummary();
      if (focus) {
        const legend = $('legend', steps[current]);
        legend.tabIndex = -1;
        legend.focus({ preventScroll: true });
        const top = form.getBoundingClientRect().top;
        if (top < 120) window.scrollTo({ top: window.scrollY + top - 160, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };

    const buildStep2 = (key) => {
      const conf = KONFIG[key];
      if (!conf) return;
      q2.textContent = conf.q;
      optWrap.innerHTML = conf.opts.map(([label, ic]) => {
        const emerg = label.startsWith('Notfall') ? ' data-emergency' : '';
        return `<label class="opt opt--light"><input type="radio" name="vorhaben" value="${label}"${emerg}><span>${icon(ic)}${label}</span></label>`;
      }).join('');
      emergency.hidden = true;
    };

    form.addEventListener('pointerdown', (e) => { if (e.target.closest('.opt')) pointerPick = true; });
    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'thema') buildStep2(t.dataset.key);
      if (t.name === 'vorhaben') emergency.hidden = !t.hasAttribute('data-emergency');
      if (t.type === 'radio' && t.closest('.konfig__options')) {
        nextBtn.disabled = !answered(current);
        // Bei Maus/Touch automatisch weiter, bei Tastatur bewusst per "Weiter"
        if (pointerPick && !t.hasAttribute('data-emergency')) {
          setTimeout(() => show(current + 1), reduceMotion ? 0 : 260);
        }
      }
      pointerPick = false;
    });
    nextBtn.addEventListener('click', () => { if (answered(current)) show(current + 1); });
    prevBtn.addEventListener('click', () => show(current - 1));

    // Vorauswahl über Link, z. B. /angebot/?thema=bad
    const pre = new URLSearchParams(window.location.search).get('thema');
    const preRadio = pre && form.querySelector(`input[name="thema"][data-key="${pre.replace(/[^a-z]/g, '')}"]`);
    if (preRadio) {
      preRadio.checked = true;
      buildStep2(preRadio.dataset.key);
      show(1, false);
    } else {
      show(0, false);
    }
  });
})();
