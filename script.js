/* ================================================
   PROMOCIÓN A LA SALUD — JS Premium
   ================================================ */

/* Versión de los archivos propios. Tiene que coincidir con el `?v=`
   de los <link> y <script> de las 9 páginas.
   AL TOCAR style.css, script.js o assets/data/*.js: subir las dos.
   Sin esto, el navegador sirve la copia vieja y parece que el cambio
   «no se aplicó» aunque el archivo ya esté corregido.
   Para comprobar qué versión se está viendo: abrir la consola (F12) y
   escribir  PS_VERSION */
const PS_VERSION = '20261008a';
window.PS_VERSION = PS_VERSION;

// ── Reduced motion preference ──────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll progress bar ────────────────────────
const scrollBar = document.createElement('div');
scrollBar.id = 'scroll-progress';
document.body.prepend(scrollBar);

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollBar.style.width = pct + '%';
}

// ── Navbar: scroll effect + clase activa ───────
const navbar  = document.getElementById('navbar');
const heroBg  = document.querySelector('.hero-bg-pattern');

// Un solo oyente para todo lo que depende del scroll, agrupado en un
// frame: antes había dos y el paralaje escribía `transform` en cada
// evento, forzando un recálculo de estilo por evento.
let scrollPendiente = false;
window.addEventListener('scroll', () => {
  if (scrollPendiente) return;
  scrollPendiente = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    updateScrollProgress();
    if (heroBg && !prefersReducedMotion) {
      heroBg.style.transform = `translateY(${y * 0.18}px)`;
    }
    scrollPendiente = false;
  });
}, { passive: true });

// ── Menú: hamburguesa + desplegables ───────────
const menuToggle  = document.getElementById('menu-toggle');
const navLinks    = document.getElementById('nav-links');
const dropToggles = [...document.querySelectorAll('.dropdown-toggle')];

/** Cierra el menú móvil dejando el estado ARIA sincronizado. */
function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

/** Cierra todos los desplegables salvo el indicado. */
function closeDropdowns(except) {
  dropToggles.forEach(t => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    t.parentElement.classList.remove('open');
  });
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  if (!isOpen) closeDropdowns();
});

// Los desplegables responden al clic (táctil y teclado), no solo al hover:
// en tabletas > 900px el hover no existe y el menú quedaba inalcanzable.
dropToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    closeDropdowns(toggle);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.parentElement.classList.toggle('open', willOpen);
  });
});

// Escape cierra lo abierto y devuelve el foco al control que lo abrió
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openToggle = dropToggles.find(t => t.getAttribute('aria-expanded') === 'true');
  if (openToggle) {
    closeDropdowns();
    openToggle.focus();
    return;
  }
  if (navLinks.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
  if (navbar.contains(e.target)) return;
  closeMenu();
  closeDropdowns();
});

// En móvil, dejar abierto el apartado de la página actual
const activeToggle = document.querySelector('.dropdown-toggle.active');
if (activeToggle && window.matchMedia('(max-width: 900px)').matches) {
  activeToggle.setAttribute('aria-expanded', 'true');
  activeToggle.parentElement.classList.add('open');
}

// ── Active nav link en scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.25, rootMargin: '-60px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Smooth scroll con offset dinámico ─────────
// El skip link se excluye: necesita la navegación nativa para
// que el foco llegue de verdad al <main>, no solo el scroll.
document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return; // placeholder sin destino: evitar querySelector('#') inválido
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMenu();
    closeDropdowns();
  });
});

// ── Hero scroll hint click ─────────────────────
const scrollHint = document.querySelector('.hero-scroll-hint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const quickAccess = document.querySelector('.quick-access');
    if (quickAccess) quickAccess.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── Parallax en el hero (sutil) ────────────────
if (!prefersReducedMotion) {
  // Partículas flotantes en el hero
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    const particlesWrap = document.createElement('div');
    particlesWrap.className = 'hero-particles';
    heroEl.appendChild(particlesWrap);

    const count = window.matchMedia('(max-width: 900px)').matches ? 8 : 18;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      const size = Math.random() * 4 + 2;
      const x    = Math.random() * 100;
      const dur  = Math.random() * 8 + 5;
      const delay = Math.random() * 6;
      span.style.cssText = `
        left: ${x}%;
        bottom: ${Math.random() * 20}%;
        width: ${size}px;
        height: ${size}px;
        --dur: ${dur}s;
        --delay: -${delay}s;
      `;
      particlesWrap.appendChild(span);
    }
  }
}

// ── Button ripple effect ───────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (prefersReducedMotion) return;
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── Reveal de tarjetas con IntersectionObserver ─
function createRevealObserver() {
  if (prefersReducedMotion) {
    // Sin animaciones: mostrar todo de inmediato
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || '0') +
                    parseFloat(getComputedStyle(el).getPropertyValue('--stagger') || '0');
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Añadir clase reveal a todos los elementos animables
function initRevealElements() {
  // Estos selectores apuntaban a componentes que ya no existen
  // (.content-card, .program-card, .sm-card, .resource-card,
  // .alert-card, .sij-placeholder): la animación de entrada solo
  // alcanzaba a .section-header, .ci-item y .qa-card.
  // Se excluyen a propósito .material-card y .directory-card: su
  // visibilidad la gobierna el filtro, que escribe opacity en línea.
  const selectors = [
    '.section-header',
    '.nav-card',
    '.det-card',
    '.subsec-card',
    '.ev-paso',
    '.ci-item',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Quick access cards con stagger manual
  document.querySelectorAll('.qa-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = i * 50;
  });
}

// ── Formulario de contacto ─────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');

  // Estado cargando
  btn.disabled  = true;
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
         style="animation:spin .8s linear infinite">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
    Enviando…
  `;

  // Inyectar keyframe de spin si no existe
  if (!document.getElementById('spin-style')) {
    const st = document.createElement('style');
    st.id = 'spin-style';
    st.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(st);
  }

  setTimeout(() => {
    btn.disabled   = false;
    btn.innerHTML  = 'Enviar mensaje';
    success.style.display = 'flex';
    e.target.reset();
    setTimeout(() => {
      success.style.animation = 'fade-in 0.3s ease reverse forwards';
      setTimeout(() => { success.style.display = 'none'; success.style.animation = ''; }, 300);
    }, 5000);
  }, 1400);
}

// ── Stagger en section headers ─────────────────
if (!prefersReducedMotion) {
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const header = entry.target;
      const tag = header.querySelector('.section-tag');
      const h2  = header.querySelector('h2');
      const p   = header.querySelector('p');
      [tag, h2, p].forEach((el, i) => {
        if (!el) return;
        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 500ms ${i * 80}ms cubic-bezier(0.22,1,0.36,1),
                               transform 500ms ${i * 80}ms cubic-bezier(0.22,1,0.36,1)`;
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, 50 + i * 80);
      });
      headerObserver.unobserve(header);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.section-header').forEach(h => headerObserver.observe(h));
}

// ── Inicialización ─────────────────────────────
updateScrollProgress();

// ══════════════════════════════════════════════
//  CARRUSEL DE CAMPAÑAS
// ══════════════════════════════════════════════

/** Renderiza slides desde CAMPAIGNS (campaigns.js) */
function renderCampaigns() {
  const track = document.querySelector('.carousel-track');
  if (!track || typeof CAMPAIGNS === 'undefined') return;

  const ICONS = {
    pdf:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    link: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    ext:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    mail: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    slides: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    video: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    image: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    doc:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  };

  track.innerHTML = CAMPAIGNS.map(c => `
    <article class="carousel-slide" data-color="${c.color}" role="group" aria-label="${c.titulo}">
      <div class="cs-body">
        <div>
          <span class="cs-tag">Campaña activa</span>
          <h2 class="cs-title">${c.titulo}</h2>
        </div>
        <div class="cs-meta">
          <div class="cs-meta-row">
            <strong>Objetivo</strong>
            <span>${c.objetivo}</span>
          </div>
          <div class="cs-meta-row">
            <strong>Población</strong>
            <span>${c.poblacion}</span>
          </div>
          <div class="cs-meta-row">
            <strong>Evidencia</strong>
            <span>${c.evidenciaSugerida}</span>
          </div>
        </div>
        <div class="cs-actions">
          ${c.materiales.map(m => `
            <a href="${m.url}" class="cs-btn"
               ${m.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              ${ICONS[m.icono] || ICONS.link}
              ${m.tipo}
            </a>
          `).join('')}
        </div>
      </div>
      <div class="cs-accent" aria-hidden="true">
        <span class="cs-accent-label">Vigencia hasta</span>
        <span style="font-size:1.6rem;font-weight:300;letter-spacing:-.01em">${c.vigencia}</span>
      </div>
    </article>
  `).join('');
}

/** Inicializa la lógica del carrusel (prev/next/dots/swipe) */
function initCarousel() {
  const wrap = document.querySelector('.carousel-wrap');
  if (!wrap) return;

  const track  = wrap.querySelector('.carousel-track');
  const slides = [...wrap.querySelectorAll('.carousel-slide')];
  const dotsEl = wrap.querySelector('.carousel-dots');
  const prevBtn = wrap.querySelector('.carousel-btn.prev');
  const nextBtn = wrap.querySelector('.carousel-btn.next');

  if (!slides.length) return;

  let current  = 0;
  let startX   = 0;
  let dragging = false;

  // ─ Crear dots ─
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className   = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a campaña ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl?.appendChild(dot);
  });

  function updateDots() {
    dotsEl?.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = ((idx % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    // Parallax interno: el contenido del slide entra escalonado
    if (!prefersReducedMotion) {
      const active = slides[current];
      active.querySelectorAll('.cs-tag, .cs-title, .cs-meta, .cs-actions').forEach((el, i) => {
        el.style.transition = 'none';
        el.style.opacity   = '0';
        el.style.transform = 'translateX(26px)';
        void el.offsetWidth; // forzar reflow: el estado oculto debe aplicarse antes de animar
        el.style.transition = `opacity 420ms ${i * 70}ms var(--ease-out),
                               transform 420ms ${i * 70}ms var(--ease-out)`;
        el.style.opacity   = '1';
        el.style.transform = 'translateX(0)';
      });
    }
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // ─ Teclado ─
  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
  });

  // ─ Touch / swipe ─
  track.addEventListener('touchstart', (e) => {
    startX   = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!dragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) goTo(diff > 0 ? current + 1 : current - 1);
    dragging = false;
  }, { passive: true });

  // ─ Drag (mouse) ─
  track.addEventListener('mousedown', (e) => {
    startX   = e.clientX;
    dragging = true;
    track.style.cursor = 'grabbing';
  });
  document.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 48) goTo(diff > 0 ? current + 1 : current - 1);
    dragging = false;
    track.style.cursor = '';
  });
}

// ══════════════════════════════════════════════
//  RECURSOS — índice único (assets/data/recursos.js)
//  Sustituye a renderBiblioteca / renderTalleres /
//  renderFormularios / renderPsicologia: los cuatro
//  producían la misma .material-card desde silos distintos.
// ══════════════════════════════════════════════

const PROGRAMA_LABELS = {
  transversal:    'Transversal',
  promocion:      'Promoción',
  adicciones:     'Adicciones',
  'salud-mental': 'Salud Mental',
  entornos:       'Entornos',
};

const TIPO_LABELS = {
  formato:      'Formato',
  normativa:    'Lineamiento',
  nom:          'NOM',
  manual:       'Manual',
  grafico:      'Material gráfico',
  presentacion: 'Presentación',
  documento:    'Doc. oficial',
  taller:       'Taller',
  formulario:   'Formulario',
  enlace:       'Sitio externo',
};

const TEMA_LABELS = {
  // Los 9 determinantes sociales (= las 9 det-card de promocion.html)
  alimentacion:             'Alimentación',
  actividad:                'Actividad Física',
  'salud-sexual':           'Salud Sexual y Reproductiva',
  'entornos-fisicos':       'Entornos Físicos',
  'entornos-psicosociales': 'Entornos Psicosociales',
  infancia:                 'Crecimiento Infantil',
  diversidad:               'Diversidad y Género',
  'derecho-salud':          'Derecho a la Salud',
  participacion:            'Participación Social',
  // Entornos saludables
  escuelas:     'Escuelas',
  comunidades:  'Comunidades',
  laborales:    'Espacios laborales',
  unidades:     'Unidades de salud',
  // Otros
  psicologia: 'Psicología',
  ferias:     'Ferias de salud',
};

const ICON_DOWNLOAD = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const ICON_EXTERNAL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const ICON_FOLDER   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`;
const ICON_CLOCK    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>`;

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const temasDe = r => r.tema || [];
const etiquetaTema = t => TEMA_LABELS[t] || t;

/** Minúsculas y sin acentos: «cedula» debe encontrar «Cédula». */
function normaliza(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Texto plano sobre el que busca el campo de búsqueda. */
function textoBuscable(r) {
  return normaliza([
    r.titulo, r.descripcion, r.subtema, r.publico, r.modalidad,
    PROGRAMA_LABELS[r.programa], TIPO_LABELS[r.tipo],
    ...temasDe(r).map(etiquetaTema),
    // El nombre de cada archivo del paquete también se busca: quien
    // necesita «el audio» o «la infografía» los pide por su nombre.
    ...(Array.isArray(r.materiales) ? r.materiales.map(m => m.tipo) : []),
  ].filter(Boolean).join(' '));
}

/** Todas las palabras de la consulta deben aparecer (en cualquier orden). */
function coincideTexto(texto, consulta) {
  const palabras = normaliza(consulta).split(/\s+/).filter(Boolean);
  return palabras.every(p => texto.includes(p));
}

/* ── Iconos por clase de archivo ──
   Un paquete de NotebookLM baja como presentación + guion + audio +
   infografía + fuentes. Cada material dice de qué clase es con `icono`
   y aquí se le pone su dibujo. Para una clase nueva basta añadir
   una línea a este objeto. */
const SVG = (d, extra = '') =>
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${d}${extra}</svg>`;

const ICONOS_MATERIAL = {
  descarga:     ICON_DOWNLOAD,
  enlace:       ICON_EXTERNAL,
  carpeta:      ICON_FOLDER,
  presentacion: SVG('<rect x="2" y="3" width="20" height="13" rx="2"/><line x1="12" y1="16" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>'),
  documento:    SVG('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'),
  hoja:         SVG('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>'),
  video:        SVG('<polygon points="22 7 16 12 22 17 22 7"/><rect x="2" y="5" width="14" height="14" rx="2"/>'),
  audio:        SVG('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 010 7"/>'),
  imagen:       SVG('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
  mapa:         SVG('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>'),
  formulario:   SVG('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'),
};

/* ── Google Drive: visor y descarga salen del mismo enlace ──────
   El índice traía 54 URLs terminadas en `/edit`, que abren el EDITOR:
   pide permisos, en el móvil ofrece instalar la app y deja que
   alguien modifique el original. `/preview` abre el visor de solo
   lectura y basta para consultar.

   La URL de descarga NO se guarda en `recursos.js`: se deriva del
   mismo id. Guardar las dos sería duplicar el dato y con el tiempo
   acabarían apuntando a archivos distintos.

   Sin par de descarga se quedan, a propósito, las CARPETAS (no son un
   archivo) y los FORMULARIOS (se contestan, no se bajan). */
const GD_RE = /^https:\/\/(?:docs|drive)\.google\.com\/(presentation|document|spreadsheets|file)\/d\/([A-Za-z0-9_-]{10,})/;

const GD_VISOR = {
  presentation: id => `https://docs.google.com/presentation/d/${id}/preview`,
  document:     id => `https://docs.google.com/document/d/${id}/preview`,
  spreadsheets: id => `https://docs.google.com/spreadsheets/d/${id}/preview`,
  // Un archivo suelto se queda en /view: el visor de Drive ya trae sus
  // propios botones de descargar e imprimir. /preview es para incrustar.
  file:         id => `https://drive.google.com/file/d/${id}/view`,
};

const GD_DESCARGA = {
  presentation: id => `https://docs.google.com/presentation/d/${id}/export/pdf`,
  document:     id => `https://docs.google.com/document/d/${id}/export?format=pdf`,
  spreadsheets: id => `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`,
  file:         id => `https://drive.google.com/uc?export=download&id=${id}`,
};

/** Qué formato baja cada tipo, para decirlo en el botón. */
const GD_FORMATO = {
  presentation: 'PDF', document: 'PDF', spreadsheets: 'Excel', file: 'Archivo',
};

/**
 * Cualquier enlace de Drive llevado a su forma de visor.
 * Lo que no es Drive (o es carpeta o formulario) se devuelve igual.
 * Es red de seguridad además de conversión: si mañana alguien pega un
 * `/edit` en el índice, aquí se endereza solo.
 */
function visorDrive(url) {
  const m = GD_RE.exec(url || '');
  return m ? GD_VISOR[m[1]](m[2]) : url;
}

/** El gemelo de descarga, o null si ese destino no tiene uno. */
function descargaDrive(url) {
  const m = GD_RE.exec(url || '');
  return m ? { url: GD_DESCARGA[m[1]](m[2]), formato: GD_FORMATO[m[1]] } : null;
}

/** A partir del cuarto, los materiales se pliegan tras «+N materiales». */
const MAX_BOTONES_VISIBLES = 3;

/**
 * Los materiales de una ficha, normalizados a una lista.
 *
 * Antes una tarjeta solo podía enseñar dos cosas: `url` y `complementos`.
 * Para los paquetes que ya vienen armados (presentación + guion + audio +
 * infografía + carpeta de fuentes) eso se queda corto, así que ahora se
 * acepta `materiales: [{ tipo, url, icono, estado }]` **sin tope**.
 *
 * El formato antiguo se sigue leyendo tal cual: no hay que reescribir
 * los recursos que ya están, y los dos pueden convivir en el índice.
 */
function materialesDe(r) {
  if (Array.isArray(r.materiales) && r.materiales.length) {
    return r.materiales.map(m => ({
      tipo:   m.tipo || 'Abrir',
      url:    m.url,
      icono:  m.icono,
      // Sin url no hay enlace posible: es un material en elaboración.
      estado: m.estado || (m.url ? 'ok' : 'pendiente'),
    }));
  }
  return [
    { tipo:   r.accion || 'Abrir',
      url:    r.url,
      icono:  r.icono,
      estado: r.estado === 'pendiente' ? 'pendiente' : 'ok' },
    ...(r.complementos
      ? [{ tipo: 'Complementos', url: r.complementos, icono: 'carpeta', estado: 'ok' }]
      : []),
  ];
}

/**
 * Un material = un botón.
 * `estado: 'pendiente'` NO produce un enlace: antes se renderizaba
 * href="#", que parecía funcional y no llevaba a ninguna parte.
 */
function botonMaterial(m, titulo, primario) {
  if (m.estado === 'pendiente' || !m.url) {
    return `<span class="mc-btn is-pending">${ICON_CLOCK} ${esc(m.tipo)} · en elaboración</span>`;
  }
  // visorDrive endereza cualquier /edit que se haya colado en el índice.
  const visor = visorDrive(m.url);
  const ext = /^https?:/i.test(visor);
  // La flecha de descarga ya significa una cosa concreta (el botón de bajar
  // del par), así que deja de usarse por defecto en lo que solo se abre:
  // los .html del sitio son las presentaciones de taller, no descargas.
  const ico = ICONOS_MATERIAL[m.icono]
    || (ext ? ICON_EXTERNAL
           : /\.html?$/i.test(visor) ? ICONOS_MATERIAL.presentacion
                                     : ICON_DOWNLOAD);
  // aria-label descriptivo: la lista de enlaces del lector de pantalla
  // era 40 entradas idénticas de «Descargar PDF».
  const ver = `<a href="${esc(visor)}" class="mc-btn${primario ? '' : ' outline mc-btn-sec'}"
             aria-label="${esc(m.tipo)}: ${esc(titulo)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}
          >${ico} ${esc(m.tipo)}</a>`;

  // El gemelo de descarga, derivado del mismo id. `descarga: false` en el
  // índice lo quita para un material que no se deba repartir como archivo.
  const gd = m.descarga === false ? null : descargaDrive(m.url);
  if (!gd) return ver;

  // Solo icono: con el texto al lado, una ficha de tres materiales pasaba
  // de tres botones a seis y no se leía nada. El nombre va en aria-label.
  return `<span class="mc-par">${ver}<a href="${esc(gd.url)}" class="mc-btn mc-baja"
             aria-label="Descargar ${esc(m.tipo)} en ${esc(gd.formato)}: ${esc(titulo)}"
             title="Descargar ${esc(gd.formato)}"
             target="_blank" rel="noopener noreferrer"
          >${ICON_DOWNLOAD}</a></span>`;
}

/**
 * Una tarjeta de recurso.
 * `ocultarSubtema` se usa dentro de los grupos plegables: el subtema
 * ya lo dice el encabezado del grupo, repetirlo en cada ficha sobra.
 */
function recursoCard(r, { ocultarSubtema = false } = {}) {
  const mats     = materialesDe(r);
  const visibles = mats.slice(0, MAX_BOTONES_VISIBLES);
  const resto    = mats.slice(MAX_BOTONES_VISIBLES);
  const enObra   = mats.filter(m => m.estado === 'pendiente').length;

  const meta = [
    !ocultarSubtema && r.subtema ? `<span><strong>Materia:</strong> ${esc(r.subtema)}</span>` : '',
    temasDe(r).length ? `<span><strong>Tema:</strong> ${temasDe(r).map(t => esc(etiquetaTema(t))).join(' · ')}</span>` : '',
    r.publico     ? `<span><strong>Público:</strong> ${esc(r.publico)}</span>` : '',
    r.modalidad   ? `<span><strong>Modalidad:</strong> ${esc(r.modalidad)}</span>` : '',
    r.actualizado ? `<span><strong>Actualizado:</strong> ${esc(r.actualizado)}</span>` : '',
  ].filter(Boolean).join('');

  // El contador solo aparece cuando hay paquete de verdad. Con uno o dos
  // materiales sería ruido en las 176 fichas que ya existen.
  const contador = mats.length >= 3
    ? `<span class="mc-num">${mats.length} materiales${enObra ? ` · ${enObra} en elaboración` : ''}</span>`
    : '';

  return `
      <article class="material-card"
               data-programa="${esc(r.programa)}"
               data-tipo="${esc(r.tipo)}"
               data-tema="${esc(temasDe(r).join(' '))}"
               data-buscar="${esc(textoBuscable(r))}">
        <div class="mc-head">
          <div class="mc-cat ${esc(r.tipo)}">${esc(TIPO_LABELS[r.tipo] || r.tipo)}</div>
          ${contador}
        </div>
        <h3 class="mc-title">${esc(r.titulo)}</h3>
        ${r.descripcion ? `<p class="mc-desc">${esc(r.descripcion)}</p>` : ''}
        <div class="mc-meta">${meta}</div>
        <div class="mc-files">
          ${visibles.map((m, i) => botonMaterial(m, r.titulo, i === 0)).join('')}
          ${resto.length ? `
            <details class="mc-mas">
              <summary>+${resto.length} material${resto.length !== 1 ? 'es' : ''}</summary>
              <div class="mc-files">${resto.map(m => botonMaterial(m, r.titulo, false)).join('')}</div>
            </details>` : ''}
        </div>
      </article>`;
}

/**
 * Los recursos repartidos en grupos plegables por `subtema`.
 *
 * El orden de los grupos es el del propio índice, que ya viene en orden
 * de catálogo (C01…C15). Así no hay una segunda lista de subtemas que
 * mantener sincronizada: se añade un taller a `recursos.js` y su grupo
 * aparece solo, en su sitio.
 *
 * Van en `<details>` a propósito: el plegado, el teclado y el estado
 * accesible los da el navegador. No hay que escribirlos.
 */
function gruposPorSubtema(items) {
  const grupos = new Map();
  for (const r of items) {
    const clave = r.subtema || 'Otros materiales';
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(r);
  }
  if (!grupos.size) return '<p class="empty-state">Sin recursos en este apartado todavía.</p>';

  return [...grupos].map(([nombre, rs]) => `
      <details class="rec-group" open>
        <summary class="rg-head">
          <span class="rg-flecha" aria-hidden="true"></span>
          <span class="rg-nombre">${esc(nombre)}</span>
          <span class="rg-count">${rs.length}</span>
        </summary>
        <div class="material-grid rg-body">
          ${rs.map(r => recursoCard(r, { ocultarSubtema: true })).join('')}
        </div>
      </details>`).join('');
}

/**
 * Rellena cada rejilla `[data-recursos]`. Las facetas se declaran
 * en el HTML, así que una página de programa pide solo lo suyo:
 *   <div class="material-grid" data-recursos data-programa="entornos"
 *        data-tema="escuelas" data-limite="6"></div>
 *
 * `data-agrupar="subtema"` reparte el resultado en grupos plegables.
 */
function renderRecursos() {
  const grids = document.querySelectorAll('[data-recursos]');
  if (!grids.length) return;

  if (typeof RECURSOS === 'undefined' || !RECURSOS.length) {
    grids.forEach(g => { g.innerHTML = '<p class="empty-state">Sin recursos por el momento.</p>'; });
    return;
  }

  grids.forEach(grid => {
    const f = grid.dataset;
    const tipos = f.tipo ? f.tipo.split(/\s+/) : null;
    const temas = f.tema ? f.tema.split(/\s+/) : null;

    let items = RECURSOS.filter(r =>
      (!f.programa || r.programa === f.programa) &&
      (!tipos || tipos.includes(r.tipo)) &&
      (!temas || temas.some(t => temasDe(r).includes(t)))
    );

    const total  = items.length;
    const limite = parseInt(f.limite, 10);
    const recortado = limite > 0 && total > limite;
    if (recortado) items = items.slice(0, limite);

    grid.innerHTML = f.agrupar === 'subtema'
      ? gruposPorSubtema(items)
      : (items.map(r => recursoCard(r)).join('') ||
         '<p class="empty-state">Sin recursos en este apartado todavía.</p>');

    // Mismo trato que el encabezado del filtro: el grupo dice cuántos
    // trae. En entornos y reportes, que no tienen filtro, es la única
    // pista de cuánto hay antes de ponerse a leer.
    const titulo = grid.previousElementSibling;
    if (titulo && titulo.classList.contains('subsec-group')) {
      let num = titulo.querySelector('.sg-count');
      if (!num) {
        num = document.createElement('span');
        num.className = 'sg-count';
        titulo.append(' ', num);
      }
      num.textContent = total;
    }

    // Divulgación progresiva: en vez de volcar 62 tarjetas, se muestran
    // las más usadas y se enlaza el resto ya filtrado en la Biblioteca.
    const previo = grid.nextElementSibling;
    if (previo && previo.classList.contains('grid-more')) previo.remove();
    if (recortado) {
      const params = new URLSearchParams();
      if (f.programa) params.set('programa', f.programa);
      if (f.tipo)     params.set('tipo', f.tipo);
      if (f.tema)     params.set('tema', f.tema);
      const mas = document.createElement('p');
      mas.className = 'grid-more';
      mas.innerHTML = `<a href="biblioteca.html?${params}" class="grid-more-link">
        Ver los ${total} recursos de este apartado en la Biblioteca →</a>`;
      grid.after(mas);
    }
  });
}

// ══════════════════════════════════════════════
//  BUSCADOR GLOBAL
//  Un solo punto de entrada a los 178 recursos, desde
//  cualquier página. Antes había que saber en qué
//  programa vivía un material para poder encontrarlo.
// ══════════════════════════════════════════════

/** Atajos que se ofrecen con el campo vacío (descubrimiento). */
const BUSQUEDA_SUGERENCIAS = [
  { texto: 'Formatos',          url: 'biblioteca.html?tipo=formato' },
  { texto: 'Catálogo de talleres', url: 'biblioteca.html?tipo=taller' },
  { texto: 'Reporte mensual',   url: 'reportes.html#formularios' },
  { texto: 'Escuelas',          url: 'biblioteca.html?programa=entornos&tema=escuelas' },
  { texto: 'NOMs',              url: 'biblioteca.html?tipo=nom' },
  { texto: 'Psicología',        url: 'recursos-psicologia.html' },
];

const ORDEN_PROGRAMAS = ['transversal', 'promocion', 'adicciones', 'salud-mental', 'entornos'];
const MAX_POR_PROGRAMA = 5;

function initBuscadorGlobal() {
  const dlg = document.getElementById('search-dialog');
  const btn = document.getElementById('nav-search-btn');
  if (!dlg || !btn) return;

  // Sin índice cargado no hay nada que buscar: se retira el botón
  // en vez de dejar un control que no hace nada.
  if (typeof RECURSOS === 'undefined' || !RECURSOS.length) {
    btn.remove();
    dlg.remove();
    return;
  }

  // En Mac el atajo es Cmd, no Ctrl: la etiqueta debe decir la verdad
  const esMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
  if (esMac) {
    const kbd = btn.querySelector('.nsb-kbd');
    if (kbd) kbd.textContent = '⌘ K';
    btn.setAttribute('aria-keyshortcuts', 'Meta+K');
  }

  const input    = dlg.querySelector('#buscador-global');
  const salida   = dlg.querySelector('#sd-results');
  const estadoEl = dlg.querySelector('.sd-status');
  const cerrar   = dlg.querySelector('.sd-close');

  // El texto buscable se calcula una vez, no en cada pulsación
  const INDICE = RECURSOS.map(r => ({ r, texto: textoBuscable(r) }));

  function sugerencias() {
    estadoEl.textContent = '';
    salida.innerHTML = `
      <p class="sd-hint">Escribe para buscar entre ${RECURSOS.length} recursos, o empieza por aquí:</p>
      <div class="sd-chips">
        ${BUSQUEDA_SUGERENCIAS.map(s =>
          `<a href="${s.url}" class="sd-chip">${esc(s.texto)}</a>`).join('')}
      </div>`;
  }

  function fila(r) {
    const ext = /^https?:/i.test(r.url || '');
    const pendiente = r.estado === 'pendiente';
    const tipo = `<span class="sd-tipo ${esc(r.tipo)}">${esc(TIPO_LABELS[r.tipo] || r.tipo)}</span>`;
    const cuerpo = `${tipo}<span class="sd-titulo">${esc(r.titulo)}</span>`;
    return pendiente
      ? `<span class="sd-hit is-pending" aria-disabled="true">${cuerpo}<span class="sd-nota">Próximamente</span></span>`
      : `<a class="sd-hit" href="${esc(r.url)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>
           ${cuerpo}${ext ? '<span class="sd-nota">Abre en pestaña nueva</span>' : ''}
         </a>`;
  }

  function buscar(consulta) {
    if (!consulta) { sugerencias(); return; }

    const hits = INDICE.filter(x => coincideTexto(x.texto, consulta)).map(x => x.r);

    if (!hits.length) {
      estadoEl.textContent = 'Sin resultados';
      salida.innerHTML = `
        <p class="sd-hint">Nada coincide con «${esc(consulta)}».
        Prueba con menos palabras o revisa la
        <a href="biblioteca.html">Biblioteca completa</a>.</p>`;
      return;
    }

    // Lo que coincide en el título va antes que lo que solo coincide
    // en la descripción o el público.
    const enTitulo = r => coincideTexto(normaliza(r.titulo), consulta) ? 0 : 1;
    hits.sort((a, b) => enTitulo(a) - enTitulo(b));

    const grupos = ORDEN_PROGRAMAS
      .map(p => [p, hits.filter(r => r.programa === p)])
      .filter(([, rs]) => rs.length);

    estadoEl.textContent = `${hits.length} resultado${hits.length !== 1 ? 's' : ''}`;
    salida.innerHTML = grupos.map(([p, rs]) => {
      const extra = rs.length - MAX_POR_PROGRAMA;
      return `
      <section class="sd-group">
        <h2 class="sd-group-title">${esc(PROGRAMA_LABELS[p] || p)} <span>${rs.length}</span></h2>
        ${rs.slice(0, MAX_POR_PROGRAMA).map(fila).join('')}
        ${extra > 0
          ? `<a class="sd-hit sd-more" href="biblioteca.html?programa=${p}&q=${encodeURIComponent(consulta)}">
               Ver los ${rs.length} de ${esc(PROGRAMA_LABELS[p] || p)} →</a>`
          : ''}
      </section>`;
    }).join('') +
      `<a class="sd-all" href="biblioteca.html?q=${encodeURIComponent(consulta)}">
         Ver los ${hits.length} resultados en la Biblioteca →</a>`;
  }

  function abrir() {
    if (!dlg.open) dlg.showModal();
    buscar(input.value.trim());
    input.focus();
    input.select();
  }

  btn.addEventListener('click', abrir);
  cerrar.addEventListener('click', () => dlg.close());

  // Ctrl/⌘+K desde cualquier sitio; «/» solo si no se está escribiendo
  document.addEventListener('keydown', (e) => {
    const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
                        || document.activeElement.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrir(); return; }
    if (e.key === '/' && !escribiendo && !dlg.open) { e.preventDefault(); abrir(); }
  });

  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => buscar(input.value.trim()), 140);
  });

  // Flechas para recorrer resultados. Son enlaces reales, así que
  // Enter los abre sin código extra y Escape lo cierra <dialog>.
  dlg.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const hits = [...salida.querySelectorAll('a.sd-hit, a.sd-chip')];
    if (!hits.length) return;
    e.preventDefault();
    const i = hits.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') hits[i < 0 ? 0 : Math.min(i + 1, hits.length - 1)].focus();
    else if (i <= 0) input.focus();
    else hits[i - 1].focus();
  });

  // Clic en el backdrop cierra (el <dialog> ocupa toda la ventana)
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  sugerencias();
}

// ══════════════════════════════════════════════
//  FILTROS FACETADOS + BÚSQUEDA
// ══════════════════════════════════════════════

/**
 * Filtra por programa / tipo / tema y texto libre.
 * El estado va a la URL, así que se puede compartir un enlace
 * filtrado y el botón «atrás» del navegador lo deshace.
 */
function initFiltros() {
  const bar = document.querySelector('.filter-bar-wrap');
  if (!bar) return;

  const cards    = [...document.querySelectorAll('.material-card')];
  const grupos   = [...document.querySelectorAll('.rec-group')];
  const botones  = [...bar.querySelectorAll('.filter-btn[data-faceta]')];
  const buscador = document.getElementById('buscador');
  const countEl  = document.querySelector('.filter-count');
  const vacio    = document.querySelector('.filter-empty');
  const encabezado = document.querySelector('.filter-heading');

  // Compatibilidad: `?cat=` era el parámetro anterior. El personal puede
  // tener enlaces guardados o impresos, así que se sigue aceptando.
  const CAT_LEGADO = {
    formatos: 'formato', lineamientos: 'normativa', manuales: 'manual',
    noms: 'nom', grafico: 'grafico', presentacion: 'presentacion',
    documentos: 'documento',
  };

  const params = new URLSearchParams(location.search);
  const catViejo = params.get('cat');
  const estado = {
    programa: params.get('programa') || '',
    tipo:     params.get('tipo') || CAT_LEGADO[catViejo] || '',
    tema:     params.get('tema') || (catViejo && !CAT_LEGADO[catViejo] ? catViejo : ''),
    q:        params.get('q')        || '',
  };

  function coincide(card) {
    const d = card.dataset;
    if (estado.programa && d.programa !== estado.programa) return false;
    if (estado.tipo     && d.tipo     !== estado.tipo)     return false;
    if (estado.tema     && !d.tema.split(' ').includes(estado.tema)) return false;
    if (estado.q && !coincideTexto(d.buscar, estado.q)) return false;
    return true;
  }

  /** Etiqueta legible de una faceta activa. */
  function etiquetaFaceta(faceta, valor) {
    if (faceta === 'programa') return PROGRAMA_LABELS[valor] || valor;
    if (faceta === 'tipo')     return TIPO_LABELS[valor] || valor;
    if (faceta === 'tema')     return etiquetaTema(valor);
    return valor;
  }

  /**
   * Encabezado del grupo activo. Aparece solo cuando hay algún filtro
   * y se va solo al quitarlo: es la respuesta visible a «he pulsado
   * Alimentación», que antes solo se notaba en el botón resaltado.
   */
  function pintarEncabezado(visibles) {
    if (!encabezado) return;
    const activas = ['programa', 'tipo', 'tema']
      .filter(f => estado[f])
      .map(f => ({ faceta: f, valor: estado[f] }));

    const hayAlgo = activas.length || estado.q;
    encabezado.hidden = !hayAlgo;
    encabezado.classList.toggle('visible', !!hayAlgo);
    if (!hayAlgo) { encabezado.innerHTML = ''; return; }

    const chips = activas.map(({ faceta, valor }) => `
      <button type="button" class="fh-chip" data-quitar="${faceta}">
        ${esc(etiquetaFaceta(faceta, valor))}
        <span aria-hidden="true">&times;</span>
        <span class="visually-hidden">Quitar este filtro</span>
      </button>`).join('');
    const chipBusqueda = estado.q ? `
      <button type="button" class="fh-chip" data-quitar="q">
        “${esc(estado.q)}”
        <span aria-hidden="true">&times;</span>
        <span class="visually-hidden">Quitar la búsqueda</span>
      </button>` : '';

    encabezado.innerHTML = `
      <div class="fh-titulo">
        ${activas.map(a => esc(etiquetaFaceta(a.faceta, a.valor))).join(' · ') || 'Búsqueda'}
        <span class="fh-num">${visibles}</span>
      </div>
      <div class="fh-chips">${chips}${chipBusqueda}</div>`;
  }

  /**
   * Un grupo sin resultados se retira ENTERO, encabezado incluido.
   * Ocultar solo las tarjetas dejaba el rótulo flotando sobre una
   * rejilla vacía y, con `display:flex` ganándole al atributo `hidden`,
   * ni siquiera se recuperaba el hueco: media pantalla en blanco.
   *
   * El conteo se refresca al momento; el ocultado espera a que termine
   * el desvanecido, para que se vea salir a las tarjetas.
   */
  function sincronizarGrupos(demora = 0) {
    if (!grupos.length) return;
    const hayFiltro = ['programa', 'tipo', 'tema', 'q'].some(k => estado[k]);
    grupos.forEach(g => {
      const n = [...g.querySelectorAll('.material-card')].filter(coincide).length;
      const num = g.querySelector('.rg-count');
      if (num) num.textContent = n;
      // Al filtrar, un grupo con resultados se abre solo: la respuesta
      // no puede quedarse escondida dentro de un acordeón plegado.
      if (n && hayFiltro) g.open = true;
      if (demora) setTimeout(() => { g.hidden = n === 0; }, demora);
      else g.hidden = n === 0;
    });
  }

  function aplicar({ animar = true } = {}) {
    let visibles = 0;
    let entrando = 0;
    cards.forEach(card => {
      const dentro = coincide(card);
      if (dentro) visibles++;

      if (prefersReducedMotion || !animar) {
        card.hidden = !dentro;
        card.classList.remove('sale');
        card.style.cssText = '';
        return;
      }

      if (dentro) {
        // Entra: primero ocupa sitio, luego se desvanece hacia dentro
        if (card.hidden) {
          card.hidden = false;
          card.classList.add('sale');
          void card.offsetWidth;            // forzar reflujo antes de animar
        }
        const retraso = (entrando++ % 8) * 35;
        setTimeout(() => card.classList.remove('sale'), retraso);
      } else if (!card.hidden) {
        // Sale: se desvanece y solo entonces deja de ocupar sitio
        card.classList.add('sale');
        setTimeout(() => {
          if (!coincide(card)) card.hidden = true;
        }, 180);
      }
    });

    // Región `role="status"`: sin esto, quien usa lector de pantalla
    // no recibía ninguna confirmación de que la lista había cambiado.
    if (countEl) countEl.textContent = `${visibles} recurso${visibles !== 1 ? 's' : ''}`;
    if (vacio) vacio.hidden = visibles > 0;
    pintarEncabezado(visibles);
    sincronizarGrupos(animar && !prefersReducedMotion ? 190 : 0);

    botones.forEach(b => {
      const activo = (estado[b.dataset.faceta] || '') === b.dataset.valor;
      b.classList.toggle('active', activo);
      b.setAttribute('aria-pressed', String(activo));
    });

    const url = new URLSearchParams();
    Object.entries(estado).forEach(([k, v]) => { if (v) url.set(k, v); });
    history.replaceState(null, '', url.toString() ? `?${url}` : location.pathname);
  }

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const { faceta, valor } = btn.dataset;
      estado[faceta] = estado[faceta] === valor ? '' : valor;  // volver a pulsar quita el filtro
      aplicar();
    });
  });

  if (buscador) {
    buscador.value = estado.q;
    let t;
    buscador.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = buscador.value.trim(); aplicar({ animar: false }); }, 160);
    });
  }

  // Las × del encabezado quitan solo su faceta
  if (encabezado) {
    encabezado.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-quitar]');
      if (!chip) return;
      const faceta = chip.dataset.quitar;
      estado[faceta] = '';
      if (faceta === 'q' && buscador) buscador.value = '';
      aplicar();
    });
  }

  // Hay dos: el de la barra de conteo y el del estado vacío
  document.querySelectorAll('.filter-clear').forEach(limpiar => {
    limpiar.addEventListener('click', () => {
      Object.keys(estado).forEach(k => { estado[k] = ''; });
      if (buscador) buscador.value = '';
      aplicar();
    });
  });

  aplicar({ animar: false });
}

/** Píldora deslizante bajo el filtro activo (mejora progresiva).
 *  Una por grupo de facetas: cada barra tiene su propio activo. */
function initFilterPill() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.filter-bar').forEach(bar => {
    const pill = document.createElement('span');
    pill.className = 'filter-pill';
    pill.setAttribute('aria-hidden', 'true');
    bar.prepend(pill);
    bar.classList.add('has-pill');

    function movePill() {
      const active = bar.querySelector('.filter-btn.active');
      if (!active) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.left   = active.offsetLeft + 'px';
      pill.style.top    = active.offsetTop + 'px';
      pill.style.width  = active.offsetWidth + 'px';
      pill.style.height = active.offsetHeight + 'px';
    }

    movePill();
    window.addEventListener('resize', movePill);
    // Cualquier botón puede cambiar el activo de esta barra (p. ej. «Quitar filtros»)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.filter-btn, .filter-clear')) requestAnimationFrame(movePill);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
  });
}

/**
 * Deep-link desde las 9 det-card de promocion.html: si el catálogo
 * está en la misma página se filtra en el sitio; si no, el href
 * lleva a biblioteca.html ya filtrado.
 */
function initTallerDeepLinks() {
  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const btn = document.querySelector(`.filter-btn[data-faceta="tema"][data-valor="${link.dataset.filter}"]`);
      if (btn && !btn.classList.contains('active')) btn.click();
    });
  });
}
// ══════════════════════════════════════════════
//  EVIDENCIAS — un solo flujo, parametrizado
//  Estaba escrito 5 veces (promocion, adicciones,
//  salud-mental, entornos, reportes) con redacciones
//  distintas y —peor— destinos contradictorios:
//  «Enviar evidencias» llevaba a reportes#formularios
//  en dos páginas y a index#contacto en las otras dos.
// ══════════════════════════════════════════════

/** Regla general del departamento (la que estaba en reportes.html). */
const EVIDENCIA_BASE = [
  'Lista de asistencia firmada',
  'Fotografía de la actividad',
  'Bitácora o registro de la plática',
];

/** Solo los programas cuyo requisito es realmente distinto. */
const EVIDENCIA_POR_PROGRAMA = {
  entornos: [
    '<strong>Escuela:</strong> foto + acta de asistencia + formato de diagnóstico',
    '<strong>ELHT:</strong> cédula + foto del cartel instalado',
    '<strong>Comunidad:</strong> foto + lista de líderes + formato de seguimiento',
  ],
};

/** Fecha de corte: aplica a todos, pero solo se decía en reportes.html. */
const EVIDENCIA_CORTE = 'El reporte mensual se cierra el <strong>último día hábil del mes</strong>.';

function renderEvidencias() {
  const bloques = document.querySelectorAll('[data-evidencias]');
  if (!bloques.length) return;

  const ICON_LISTA = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`;
  const ICON_DESC  = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const ICON_ENVIO = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

  bloques.forEach(bloque => {
    const programa = bloque.dataset.evidencias;
    const lista = EVIDENCIA_POR_PROGRAMA[programa] || EVIDENCIA_BASE;
    const etiqueta = PROGRAMA_LABELS[programa] || '';
    const qFormatos = 'biblioteca.html?tipo=formato' +
      (programa && programa !== 'todos' ? `&programa=${encodeURIComponent(programa)}` : '');

    bloque.innerHTML = `
      <ol class="ev-pasos">
        <li class="ev-paso">
          <div class="ev-icon">${ICON_LISTA}</div>
          <h3>Qué documentar</h3>
          <ul class="ev-lista">${lista.map(x => `<li>${x}</li>`).join('')}</ul>
        </li>
        <li class="ev-paso">
          <div class="ev-icon">${ICON_DESC}</div>
          <h3>Con qué formato</h3>
          <p>Descarga el formato oficial${etiqueta ? ' de ' + esc(etiqueta) : ''} desde la Biblioteca.</p>
          <a href="${qFormatos}" class="subsec-link">Ver formatos</a>
        </li>
        <li class="ev-paso">
          <div class="ev-icon">${ICON_ENVIO}</div>
          <h3>Dónde enviarlo</h3>
          <p>Captura tu reporte con el formulario oficial de tu área. ${EVIDENCIA_CORTE}</p>
          <a href="reportes.html#formularios" class="subsec-link">Ir a formularios de reporte</a>
        </li>
      </ol>`;
  });
}

// ══════════════════════════════════════════════
//  DIRECTORIO — render desde directorio.js
// ══════════════════════════════════════════════

function renderDirectorio() {
  const grids = document.querySelectorAll('[data-dir]');
  if (!grids.length) return;

  const DC_ICONS = {
    psicologia: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    nutricion:  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    referencia: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.3 19.79 19.79 0 01.22 2.62 2 2 0 012.2.5H5.1a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.41a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  };
  const ICON_CLOCK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const ICON_USER  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`;

  const data = typeof DIRECTORIO !== 'undefined' ? DIRECTORIO : [];
  const unidades = typeof UNIDADES !== 'undefined' ? UNIDADES : [];

  grids.forEach(grid => {
    const tipo  = grid.dataset.dir;
    // `data-dir-tema` acota los servicios externos (crisis | adicciones |
    // violencia) para que cada programa muestre los suyos sin repetirlos.
    const temas = grid.dataset.dirTema ? grid.dataset.dirTema.split(/\s+/) : null;

    // `data-dir="psicologia"` y `data-dir="nutricion"` ya no son un tipo
    // de ficha: son un SERVICIO, y salen de la lista de unidades. Así
    // «C.S. Texcoco» se escribe una vez aunque tenga los dos servicios.
    if (typeof SERVICIOS !== 'undefined' && SERVICIOS[tipo]) {
      const conServicio = unidades.filter(u => (u.servicios || []).includes(tipo));
      // El directorio de origen no dice qué servicios da cada unidad, así
      // que el vacío aquí no es un fallo: es un dato que falta declarar.
      // Decirlo con nombre y apellido es más útil que «sin unidades».
      grid.innerHTML = conServicio.length
        ? conServicio.map(u => unidadCard(u, { servicio: tipo })).join('')
        : `<p class="empty-state">Todavía ninguna unidad tiene declarado el servicio de
             <strong>${esc(SERVICIOS[tipo].etiqueta.toLowerCase())}</strong>.
             Se añade poniendo <code>'${esc(tipo)}'</code> en el campo <code>servicios</code>
             de esa unidad, en <code>assets/data/directorio.js</code>.</p>`;
      return;
    }

    const items = data.filter(u =>
      u.tipo === tipo && (!temas || temas.some(t => (u.tema || []).includes(t))));
    if (!items.length) {
      grid.innerHTML = '<p class="empty-state">Sin unidades registradas por el momento.</p>';
      return;
    }
    // Variante compacta: para incrustar los teléfonos dentro de una
    // tarjeta existente sin repetir los datos en el HTML.
    if (grid.dataset.dirFormato === 'compacto') {
      // El número va en su propio campo: derivarlo del texto producía
      // `tel:` con los dígitos de «24 h» pegados al final.
      grid.innerHTML = `<ul class="dir-compacto">` + items.map(u => `
        <li><strong>${u.nombre}</strong> — ${
          u.telefono
            ? `<a href="tel:${u.telefono}">${u.horario || u.telefono}</a>`
            : (u.horario || '')}</li>`).join('') + `</ul>`;
      return;
    }

    grid.innerHTML = items.map(u => `
      <div class="directory-card">
        <div class="dc-header">
          <div class="dc-icon dc-${u.tipo}">${DC_ICONS[u.tipo] || ''}</div>
          <div>
            <h3 class="dc-name">${u.nombre || ''}</h3>
            <span class="dc-zone">${u.zona || ''}</span>
          </div>
        </div>
        <div class="dc-details">
          <div class="dc-row">${ICON_CLOCK}<span>${u.horario || 'Horario por confirmar'}</span></div>
          ${u.atencion ? `<div class="dc-row">${ICON_USER}<span>${u.atencion}</span></div>` : ''}
        </div>
      </div>
    `).join('');
  });
}

// ══════════════════════════════════════════════
//  NOTEBOOKLM — un asistente por determinante
//  El personal pregunta lo que necesita sobre SU tema
//  («¿cada cuánto se tamiza a una embarazada?») y el
//  cuaderno responde citando la fuente. Los enlaces
//  viven en assets/data/notebooks.js.
// ══════════════════════════════════════════════

const ICON_CHAT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`;

/** Los cuadernos declarados, o un objeto vacío si no se cargó el archivo. */
const notebooksDe = () => (typeof NOTEBOOKS !== 'undefined' ? NOTEBOOKS : {});

/**
 * Rellena `[data-notebooks]` con una tarjeta por determinante.
 * El orden es el de TEMA_LABELS, que ya es el orden de los 9
 * determinantes: no hay una segunda lista que mantener.
 */
function renderNotebooks() {
  const cont = document.querySelector('[data-notebooks]');
  const nb = notebooksDe();

  // Enlace «Preguntar» dentro de cada det-card
  document.querySelectorAll('[data-notebook]').forEach(hueco => {
    const n = nb[hueco.dataset.notebook];
    if (!n) { hueco.remove(); return; }
    hueco.outerHTML = n.estado === 'ok' && n.url
      ? `<a href="${esc(n.url)}" class="det-link det-link--ia" target="_blank" rel="noopener noreferrer"
             aria-label="Preguntar al asistente de ${esc(n.titulo)}">${ICON_CHAT} Preguntar</a>`
      : `<span class="det-link is-pending">${ICON_CHAT} Asistente en preparación</span>`;
  });

  if (!cont) return;

  const claves = Object.keys(nb);
  if (!claves.length) { cont.innerHTML = ''; return; }

  const listos = claves.filter(k => nb[k].estado === 'ok' && nb[k].url).length;

  cont.innerHTML = `
    ${listos < claves.length ? `
      <p class="nb-aviso">${ICON_CHAT}
        ${listos} de ${claves.length} asistentes están publicados. Los demás aparecen
        apagados hasta que se les pegue el enlace en <code>assets/data/notebooks.js</code>.</p>` : ''}
    <div class="nb-grid">
      ${claves.map(k => {
        const n = nb[k];
        const activo = n.estado === 'ok' && n.url;
        return `
        <article class="nb-card${activo ? '' : ' is-pending'}">
          <h3 class="nb-title">${esc(n.titulo)}</h3>
          ${n.descripcion ? `<p class="nb-desc">${esc(n.descripcion)}</p>` : ''}
          ${n.fuentes || n.actualizado ? `<p class="nb-meta">${
              [n.fuentes ? `${n.fuentes} fuente${n.fuentes !== 1 ? 's' : ''}` : '',
               n.actualizado].filter(Boolean).map(esc).join(' · ')}</p>` : ''}
          ${activo
            ? `<a href="${esc(n.url)}" class="mc-btn" target="_blank" rel="noopener noreferrer"
                  aria-label="Abrir el asistente de ${esc(n.titulo)}">${ICON_CHAT} Preguntar</a>`
            : `<span class="mc-btn is-pending">${ICON_CLOCK} En preparación</span>`}
        </article>`;
      }).join('')}
    </div>`;
}

// ══════════════════════════════════════════════
//  UNIDADES DE SALUD — mapa operativo
//  Una unidad, una ficha, con los servicios que ofrece
//  y su punto en el mapa. Sin librerías: los enlaces de
//  Google Maps se arman con lat/lng, que es todo lo que
//  hace falta para abrir el pin o pedir la ruta.
// ══════════════════════════════════════════════

const ICON_PIN   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICON_RUTA  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
const ICON_TEL   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.3 19.79 19.79 0 01.22 2.62 2 2 0 012.2.5H5.1a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.41a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
const ICON_USER_DIR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`;

/**
 * «5959531945» → «595 953 1945». El dato se guarda en dígitos porque
 * el enlace `tel:` los necesita limpios; la persona lee otra cosa.
 * Formato mexicano: 55/56/33/81 llevan lada de 2, el resto de 3.
 */
function telefonoLegible(d) {
  const n = String(d || '').replace(/\D/g, '');
  if (n.length === 10) {
    return /^(55|56|33|81)/.test(n)
      ? `${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6)}`
      : `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return n;
}

/** ¿Tiene la unidad un punto utilizable en el mapa? */
const tieneUbicacion = u =>
  !!u.maps || (Number.isFinite(u.lat) && Number.isFinite(u.lng));

/** Enlace al pin. `maps` (enlace corto pegado a mano) gana si existe. */
function urlMapa(u) {
  if (u.maps) return u.maps;
  if (!Number.isFinite(u.lat) || !Number.isFinite(u.lng)) return '';
  return `https://www.google.com/maps/search/?api=1&query=${u.lat},${u.lng}`;
}

/** Enlace «cómo llegar»: Maps calcula la ruta desde donde esté quien mira. */
function urlRuta(u) {
  if (Number.isFinite(u.lat) && Number.isFinite(u.lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${u.lat},${u.lng}`;
  }
  // Sin coordenadas, la dirección escrita sirve de destino.
  return u.direccion
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(u.direccion)}`
    : '';
}

/** Las píldoras de servicio: el color viene del catálogo SERVICIOS. */
function pildorasServicio(u, destacado) {
  const cat = typeof SERVICIOS !== 'undefined' ? SERVICIOS : {};
  return (u.servicios || []).map(s => {
    const d = cat[s] || { etiqueta: s, color: 'charcoal' };
    return `<span class="uc-serv uc-serv--${esc(d.color)}${s === destacado ? ' is-destacado' : ''}"
                  data-servicio="${esc(s)}">${esc(d.etiqueta)}</span>`;
  }).join('');
}

/**
 * Ficha de unidad. Degrada sola: sin coordenadas no inventa un enlace
 * roto, avisa de que la ubicación está por cargar. Así se pueden ir
 * añadiendo las coordenadas poco a poco sin que la página se rompa.
 */
function unidadCard(u, { servicio = '' } = {}) {
  const mapa = urlMapa(u), ruta = urlRuta(u);
  // Sin coordenada propia, el enlace es una BÚSQUEDA en Maps, no un pin.
  // Decirlo evita que alguien salga a una dirección que no está confirmada.
  const exacta = Number.isFinite(u.lat) && Number.isFinite(u.lng);
  const ubicacion = tieneUbicacion(u)
    ? `<div class="uc-acciones">
         <a href="${esc(mapa)}" class="mc-btn${exacta ? '' : ' outline'}" target="_blank" rel="noopener noreferrer"
            aria-label="${exacta ? 'Ver' : 'Buscar'} ${esc(u.nombre)} en el mapa">
            ${ICON_PIN} ${exacta ? 'Ver en el mapa' : 'Buscar en Maps'}</a>
         ${exacta && ruta ? `<a href="${esc(ruta)}" class="mc-btn outline" target="_blank" rel="noopener noreferrer"
            aria-label="Cómo llegar a ${esc(u.nombre)}">${ICON_RUTA} Cómo llegar</a>` : ''}
       </div>
       ${!exacta ? `<p class="uc-aviso">Ubicación sin confirmar: el enlace busca por nombre y dirección.</p>` : ''}`
    : `<p class="uc-sin-mapa">${ICON_PIN} Ubicación por cargar</p>`;

  return `
      <article class="directory-card unidad-card"
               data-servicios="${esc((u.servicios || []).join(' '))}"
               data-municipio="${esc(u.municipio || '')}"
               data-buscar="${esc(normaliza([u.nombre, u.municipio, u.zona, u.direccion].filter(Boolean).join(' ')))}">
        <div class="dc-header">
          <div class="dc-icon dc-${esc(u.tipo || 'centro-salud')}">${ICON_PIN}</div>
          <div>
            <h3 class="dc-name">${esc(u.nombre || '')}</h3>
            <span class="dc-zone">${esc(u.municipio || u.zona || '')}${
              u.tipologia ? ` · ${esc(u.tipologia)}` : ''}</span>
          </div>
        </div>
        ${u.clues ? `<p class="uc-clues"><abbr title="Clave Única de Establecimientos de Salud — IMSS Bienestar">CLUES</abbr>
           <code>${esc(u.clues)}</code>${u.cluesSSA ? ` · <span class="uc-clues-ssa">SSA <code>${esc(u.cluesSSA)}</code></span>` : ''}</p>` : ''}
        <div class="uc-servicios">${pildorasServicio(u, servicio)}</div>
        <div class="dc-details">
          ${u.direccion ? `<div class="dc-row">${ICON_PIN}<span>${esc(u.direccion)}</span></div>` : ''}
          <div class="dc-row">${ICON_CLOCK}<span>${esc(u.horario || 'Horario por confirmar')}</span></div>
          ${u.atencion ? `<div class="dc-row">${ICON_USER_DIR}<span>${esc(u.atencion)}</span></div>` : ''}
          ${u.telefono ? `<div class="dc-row">${ICON_TEL}<a href="tel:${esc(u.telefono)}">${esc(telefonoLegible(u.telefono))}</a></div>` : ''}
        </div>
        ${ubicacion}
      </article>`;
}


/**
 * El mapa operativo: todas las unidades en `[data-unidades]`, con
 * filtros por servicio y por municipio generados a partir de los datos.
 * No hay lista de botones que mantener en el HTML: si mañana una unidad
 * estrena odontología, el filtro de odontología aparece solo.
 */
/* ── Mapa de unidades (Leaflet) ─────────────────────────────────
   Leaflet vive en assets/vendor/leaflet: si se cayera un CDN el mapa
   seguiría estando. Lo único que necesita red son los mosaicos de
   OpenStreetMap; sin ellos el lienzo sale gris pero los puntos siguen
   en su sitio y las fichas de abajo funcionan igual.

   El mapa NO es la lista: es una segunda vista del mismo filtro. Quien
   use lector de pantalla o no cargue el mapa tiene la rejilla completa
   debajo, que es la fuente de verdad.                                 */

/** Color del punto según el tipo de unidad. */
const MAPA_COLORES = {
  'centro-salud':  '#9F2241',
  'ceaps':         '#235B4E',
  'hospital':      '#5C3D8F',
  'especializada': '#BC955C',
  'jurisdiccion':  '#4A4848',
};

const MAPA_TIPOS = {
  'centro-salud':  'Centro de salud',
  'ceaps':         'CEAPS',
  'hospital':      'Hospital',
  'especializada': 'Unidad especializada',
  'jurisdiccion':  'Jurisdicción',
  'movil':         'Unidad móvil',
};

/** Glifo blanco dentro del pin, según el tipo de unidad. */
const PIN_GLIFO = {
  'hospital':      '<path d="M9 7v10M15 7v10M9 12h6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
  'ceaps':         '<text x="12" y="15.2" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">24</text>',
  'jurisdiccion':  '<path d="M7 16V10l5-3 5 3v6M10 16v-3h4v3" stroke="#fff" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  'default':       '<path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
};

/** Pin en forma de gota con el color del tipo: se distingue por forma y glifo, no solo por color. */
function pinUnidad(tipo, color, grande) {
  const w = grande ? 36 : 30, h = Math.round(w * 1.3);
  const glifo = PIN_GLIFO[tipo] || PIN_GLIFO.default;
  return L.divIcon({
    className: 'mapa-pin',
    iconSize: [w, h],
    iconAnchor: [w / 2, h - 2],
    popupAnchor: [0, -h + 6],
    html: `<svg viewBox="0 0 24 31" width="${w}" height="${h}" aria-hidden="true">
      <path d="M12 30s10-10.2 10-18A10 10 0 0 0 2 12c0 7.8 10 18 10 18z" fill="${color}" stroke="#fff" stroke-width="1.6"/>
      <g transform="translate(0 0)">${glifo}</g></svg>`,
  });
}

/**
 * Dibuja las unidades con coordenada y devuelve un mando para que el
 * filtro de la página mueva el mapa. Si Leaflet no cargó, devuelve null
 * y la página sigue funcionando sin mapa.
 */
function initMapaUnidades(unidades) {
  const div = document.getElementById('mapa-unidades');
  if (!div) return null;

  const conPunto = unidades.filter(u => Number.isFinite(u.lat) && Number.isFinite(u.lng));
  if (typeof L === 'undefined' || !conPunto.length) {
    div.innerHTML = `<p class="mapa-nolib">${ICON_PIN} El mapa no se pudo cargar.
      El listado de unidades de abajo funciona igual.</p>`;
    div.classList.add('is-vacio');
    return null;
  }

  const map = L.map(div, {
    // Sin zoom con la rueda: en una página larga, atrapar el scroll del
    // usuario dentro del mapa es de las cosas que más molestan.
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Mosaicos de OpenStreetMap: gratuitos y sin clave. El tono apagado y
  // cálido lo pone CSS (.mapa-lienzo .leaflet-tile-pane), para que los
  // pines con los colores institucionales sean lo que se lea. CARTO se
  // probó y pide clave: devuelve mosaicos con «API KEY REQUIRED».
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  const capa = L.layerGroup().addTo(map);
  const marcas = conPunto.map(u => {
    const color = MAPA_COLORES[u.tipo] || MAPA_COLORES['centro-salud'];
    const grande = u.tipo === 'hospital' || u.tipo === 'jurisdiccion';
    const m = L.marker([u.lat, u.lng], {
      icon: pinUnidad(u.tipo, color, grande),
      title: u.nombre,          // también es el nombre accesible del pin
      alt: u.nombre,
      riseOnHover: true,
    });
    m.bindPopup(popupUnidad(u), { maxWidth: 290, className: 'mapa-globo' });
    m.bindTooltip(u.nombre, { direction: 'top', offset: [0, grande ? -40 : -34], className: 'mapa-etiqueta' });
    return { u, m };
  });

  /** Encuadra el mapa sobre las unidades que se le pasen. */
  function encuadrar(lista) {
    if (!lista.length) return;
    map.invalidateSize({ animate: false });
    const b = L.latLngBounds(lista.map(x => [x.u.lat, x.u.lng]));
    map.fitBounds(b, { padding: [34, 34], maxZoom: lista.length === 1 ? 15 : 14 });
  }

  marcas.forEach(x => capa.addLayer(x.m));
  encuadrar(marcas);

  // Leaflet mide el contenedor al crearse. Si en ese momento el diseño aún
  // no ha cuajado —tipografías por llegar, la rejilla acomodándose— se
  // queda con una medida vieja y los mosaicos no llenan la caja. Se le
  // vuelve a preguntar en cuanto el contenedor cambie de tamaño.
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => map.invalidateSize({ animate: false })).observe(div);
  } else {
    window.addEventListener('resize', () => map.invalidateSize({ animate: false }));
  }
  requestAnimationFrame(() => {
    map.invalidateSize({ animate: false });
    encuadrar(marcas);
  });

  return {
    /** El filtro de la página manda: mismos criterios que las fichas. */
    sincroniza(pasa) {
      const visibles = marcas.filter(x => pasa(x.u));
      capa.clearLayers();
      visibles.forEach(x => capa.addLayer(x.m));
      encuadrar(visibles);
      return visibles.length;
    },
  };
}

/**
 * La clave de colores del mapa. Sale de los datos: solo aparecen los
 * tipos que de verdad tienen unidades con punto, y con su conteo.
 * Un color sin explicar es un color que no dice nada.
 */
function leyendaMapa(unidades) {
  const conPunto = unidades.filter(u => Number.isFinite(u.lat) && Number.isFinite(u.lng));
  const cuenta = {};
  conPunto.forEach(u => { cuenta[u.tipo] = (cuenta[u.tipo] || 0) + 1; });
  const filas = Object.keys(MAPA_COLORES)
    .filter(t => cuenta[t])
    .map(t => `<li><svg class="ml-pin" viewBox="0 0 24 31" width="15" height="19" aria-hidden="true"><path d="M12 30s10-10.2 10-18A10 10 0 0 0 2 12c0 7.8 10 18 10 18z" fill="${MAPA_COLORES[t]}"/>${PIN_GLIFO[t] || PIN_GLIFO.default}</svg>
                 ${esc(MAPA_TIPOS[t] || t)} <span class="ml-n">${cuenta[t]}</span></li>`);
  return filas.length
    ? `<ul class="mapa-leyenda">${filas.join('')}</ul>`
    : '';
}

/** El globo de un punto: lo mínimo para decidir e irse a la ruta. */
function popupUnidad(u) {
  const servicios = (u.servicios || [])
    .map(s => esc((typeof SERVICIOS !== 'undefined' && SERVICIOS[s]?.etiqueta) || s))
    .join(' · ');
  const aviso = u.ubicacion === 'por-validar'
    ? '<p class="mp-aviso">Ubicación por corroborar.</p>' : '';
  return `
    <div class="mapa-popup">
      <strong class="mp-nombre">${esc(u.nombre || '')}</strong>
      <span class="mp-tipo">${esc(MAPA_TIPOS[u.tipo] || u.tipo || '')} · ${esc(u.municipio || '')}</span>
      ${servicios ? `<span class="mp-serv">${servicios}</span>` : ''}
      ${aviso}
      <span class="mp-links">
        <a href="${esc(urlMapa(u))}" target="_blank" rel="noopener noreferrer">Ver en Maps</a>
        <a href="${esc(urlRuta(u))}" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
      </span>
    </div>`;
}


function renderUnidades() {
  const cont = document.querySelector('[data-unidades]');
  if (!cont) return;
  if (typeof UNIDADES === 'undefined' || !UNIDADES.length) {
    cont.innerHTML = '<p class="empty-state">Sin unidades registradas por el momento.</p>';
    return;
  }

  const cat = typeof SERVICIOS !== 'undefined' ? SERVICIOS : {};
  // Solo se ofrecen los filtros que de verdad tienen unidades detrás:
  // un filtro que siempre da cero es una promesa incumplida.
  const usados = [...new Set(UNIDADES.flatMap(u => u.servicios || []))]
    .sort((a, b) => (cat[a]?.etiqueta || a).localeCompare(cat[b]?.etiqueta || b, 'es'));
  const municipios = [...new Set(UNIDADES.map(u => u.municipio).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));

  // «Con coordenada» = pin exacto. Las demás solo tienen búsqueda por nombre.
  const conCoordenada = UNIDADES.filter(u => Number.isFinite(u.lat) && Number.isFinite(u.lng)).length;
  // Faltar coordenada no significa lo mismo en todas: una unidad móvil no
  // tiene punto fijo, y donde el enlace apuntaba a otra unidad se dejó sin
  // punto a propósito. Decirlo por separado evita que parezca descuido.
  const moviles = UNIDADES.filter(u => u.ubicacion === 'movil').length;
  const dudosas = UNIDADES.filter(u => u.ubicacion === 'discrepancia').length;

  cont.innerHTML = `
    <div class="mapa-barra">
      <div class="filter-group">
        <span class="filter-label" id="lbl-servicio">Servicio</span>
        <div class="filter-bar" role="group" aria-labelledby="lbl-servicio">
          ${usados.map(s => {
            const n = UNIDADES.filter(u => (u.servicios || []).includes(s)).length;
            return `<button type="button" class="filter-btn" data-u-servicio="${esc(s)}" aria-pressed="false">
                      ${esc(cat[s]?.etiqueta || s)} <span class="filter-count">${n}</span></button>`;
          }).join('')}
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label" id="lbl-municipio">Municipio</span>
        <div class="filter-bar" role="group" aria-labelledby="lbl-municipio">
          ${municipios.map(m => {
            const n = UNIDADES.filter(u => u.municipio === m).length;
            return `<button type="button" class="filter-btn" data-u-municipio="${esc(m)}" aria-pressed="false">
                      ${esc(m)} <span class="filter-count">${n}</span></button>`;
          }).join('')}
        </div>
      </div>
      <p class="filter-count-wrap">
        <span class="u-count" role="status">${UNIDADES.length} unidades</span>
        <button type="button" class="filter-clear u-clear">Quitar filtros</button>
      </p>
      ${conCoordenada < UNIDADES.length
        ? `<p class="mapa-aviso">${ICON_PIN} ${conCoordenada} de ${UNIDADES.length} unidades están en el mapa.
             ${moviles ? `${moviles} son unidades móviles y no tienen punto fijo. ` : ''}
             ${dudosas ? `En ${dudosas} el enlace del directorio apuntaba a otra unidad y se dejaron sin punto
             en vez de arriesgar una ubicación falsa. ` : ''}
             Todas abren una búsqueda en Maps por nombre y municipio.</p>`
        : ''}
    </div>
    <div class="mapa-lienzo" id="mapa-unidades" role="application"
         aria-label="Mapa de unidades de la Jurisdicción"></div>
    ${leyendaMapa(UNIDADES)}
    <p class="mapa-pie">El mapa es un atajo visual. La lista completa, con horarios y teléfonos, está debajo.</p>
    <div class="directory-grid mapa-grid">${UNIDADES.map(u => unidadCard(u)).join('')}</div>
    <p class="empty-state u-vacio" hidden>Ninguna unidad coincide con esos filtros.</p>`;

  // Las fichas se pintan en el orden de UNIDADES, así que cada una queda
  // emparejada con su unidad y el filtro se evalúa sobre el dato, no sobre
  // atributos del DOM: una sola condición para la lista y para el mapa.
  const fichas  = [...cont.querySelectorAll('.unidad-card')]
    .map((el, i) => ({ el, u: UNIDADES[i] }));
  const vacio   = cont.querySelector('.u-vacio');
  const countEl = cont.querySelector('.u-count');
  const estado  = { servicio: '', municipio: '' };
  // El mapa es una segunda vista del MISMO filtro, no un control aparte.
  const mapa = initMapaUnidades(UNIDADES);

  const pasa = u => (!estado.servicio  || (u.servicios || []).includes(estado.servicio))
                 && (!estado.municipio || u.municipio === estado.municipio);

  function aplicar() {
    let n = 0;
    if (mapa) mapa.sincroniza(pasa);
    fichas.forEach(({ el, u }) => {
      const ok = pasa(u);
      el.hidden = !ok;
      if (ok) n++;
      // La píldora del servicio filtrado se resalta: se ve de un vistazo
      // por qué esa unidad está en la lista.
      el.querySelectorAll('.uc-serv').forEach(p =>
        p.classList.toggle('is-destacado', !!estado.servicio && p.dataset.servicio === estado.servicio));
    });
    if (countEl) countEl.textContent = `${n} unidad${n !== 1 ? 'es' : ''}`;
    if (vacio) vacio.hidden = n > 0;
    cont.querySelectorAll('[data-u-servicio], [data-u-municipio]').forEach(b => {
      const activo = b.dataset.uServicio  ? estado.servicio  === b.dataset.uServicio
                                          : estado.municipio === b.dataset.uMunicipio;
      b.classList.toggle('active', activo);
      b.setAttribute('aria-pressed', String(activo));
    });
  }

  cont.querySelectorAll('[data-u-servicio], [data-u-municipio]').forEach(b => {
    b.addEventListener('click', () => {
      const clave = b.dataset.uServicio ? 'servicio' : 'municipio';
      const valor = b.dataset.uServicio || b.dataset.uMunicipio;
      estado[clave] = estado[clave] === valor ? '' : valor;   // repulsar = quitar
      aplicar();
    });
  });
  cont.querySelector('.u-clear')?.addEventListener('click', () => {
    estado.servicio = estado.municipio = '';
    aplicar();
  });

  aplicar();
}

// ══════════════════════════════════════════════
//  KPIs — render + contadores animados
// ══════════════════════════════════════════════

/** Formatea 8500 → "8 500" (separador de miles con espacio) */
function formatKpi(n) {
  return n.toLocaleString('es-MX').replace(/,/g, ' ');
}

/** Genera las kpi-cards desde KPIS (assets/data/kpis.js) */
function renderKPIs() {
  if (typeof KPIS === 'undefined') return;
  document.querySelectorAll('[data-kpis]').forEach(grid => {
    const items = KPIS[grid.dataset.kpis];
    if (!items || !items.length) {
      grid.innerHTML = '<p class="empty-state">Sin indicadores por el momento.</p>';
      return;
    }
    grid.innerHTML = items.map(k => `
      <div class="kpi-card" style="--kpi-color: var(--${k.color})">
        <div class="kpi-number" data-target="${k.numero}" data-sufijo="${k.sufijo}">${formatKpi(k.numero)}${k.sufijo}</div>
        <div class="kpi-label">${k.etiqueta}</div>
        <div class="kpi-desc">${k.desc}</div>
      </div>
    `).join('');
  });
}

/** Contador 0 → valor con easeOutExpo al entrar al viewport */
function initKpiCounters() {
  if (prefersReducedMotion) return; // los números ya muestran el valor final
  const nums = document.querySelectorAll('.kpi-number[data-target]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseInt(el.dataset.target, 10);
      const sufijo = el.dataset.sufijo || '';
      const dur    = 1200;
      const start  = performance.now();
      const tick = (now) => {
        const p    = Math.min((now - start) / dur, 1);
        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
        el.textContent = formatKpi(Math.round(target * ease)) + sufijo;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  nums.forEach(n => io.observe(n));
}

// ══════════════════════════════════════════════
//  CAMPAÑAS (grid) — misma fuente que el carrusel: campaigns.js
//  Se usa en promocion.html#campanas para no duplicar info.
// ══════════════════════════════════════════════

function renderCampaignsGrid() {
  const grid = document.getElementById('campanas-grid');
  if (!grid) return;
  if (typeof CAMPAIGNS === 'undefined' || !CAMPAIGNS.length) {
    grid.innerHTML = '<p class="empty-state">Sin campañas activas.</p>';
    return;
  }
  const ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`;
  grid.innerHTML = CAMPAIGNS.map(c => {
    // Materiales reales de la campaña (misma fuente que el carrusel)
    const mats = (c.materiales || []).map(m => `
      <a href="${m.url}" class="subsec-link"${m.url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${m.tipo} →</a>`).join('');
    return `
    <div class="subsec-card" style="--nc-color: var(--${c.color === 'gold' ? 'gold' : c.color})">
      <div class="subsec-icon">${ICON}</div>
      <h3>${c.titulo}</h3>
      <p>${c.objetivo}</p>
      <p style="font-size:.85rem;color:var(--text-muted);margin:.5rem 0 .75rem"><strong>Población:</strong> ${c.poblacion}</p>
      ${mats}
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════
//  CONTACTO — fuente única: window.CONTACTO (definido en components.js)
//  Rellena la sección de contacto (index.html) para no duplicar datos.
// ══════════════════════════════════════════════

function renderContacto() {
  const C = window.CONTACTO;
  if (!C) return;
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('c-direccion', C.direccion);
  set('c-telefonos', `<a href="tel:${C.tel1Link}">${C.tel1}</a> · <a href="tel:${C.tel2Link}">${C.tel2}</a> · Ext. ${C.ext}`);
  set('c-email', `<a href="mailto:${C.email}">${C.email}</a>`);
  set('c-facebook', `<a href="${C.facebook}" target="_blank" rel="noopener">Facebook · Promoción a la Salud Texcoco</a>`);
}

// ══════════════════════════════════════════════
//  ARRANQUE GLOBAL
// ══════════════════════════════════════════════

// Campañas — renderizar antes de initCarousel
renderCampaigns();
renderCampaignsGrid();

// Datos de contacto (fuente única en components.js)
renderContacto();

// KPIs (index.html y reportes.html)
renderKPIs();
initKpiCounters();

// Carrusel (index.html)
initCarousel();

// Recursos — índice único. Rellena toda rejilla [data-recursos]
// (biblioteca, talleres, formularios, psicología, entornos).
// Debe correr ANTES de initFiltros: este lee las tarjetas ya puestas.
renderRecursos();

// Directorio (directorio.html)
renderDirectorio();

// Mapa operativo de unidades (directorio.html#mapa)
renderUnidades();

// Asistentes de NotebookLM (promocion.html#asistente)
renderNotebooks();

// Bloque de evidencias (mismo flujo en las 5 páginas que lo repetían)
renderEvidencias();

// Buscador global (todas las páginas con el navbar)
initBuscadorGlobal();

// Filtros facetados + búsqueda
initFiltros();
initFilterPill();

// Deep-link de determinantes → filtro del catálogo de talleres
initTallerDeepLinks();

// Formulario de contacto
// Animaciones de entrada: al final, cuando ya existe todo lo generado
initRevealElements();
createRevealObserver();

const contactForm = document.getElementById('contact-form');
if (contactForm) contactForm.addEventListener('submit', handleForm);
