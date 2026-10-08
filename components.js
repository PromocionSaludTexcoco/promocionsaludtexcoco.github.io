/* ================================================
   COMPONENTS.JS — Navbar y Footer compartidos
   Se inyecta en todas las páginas HTML.
   Modifica este archivo para cambiar el menú
   en todo el sitio de una sola vez.
   ================================================ */

(function () {
  /* ── 0. DATOS DE CONTACTO — FUENTE ÚNICA ──
     Edita SOLO aquí: footer, top-bar y la sección de contacto (index)
     se actualizan automáticamente. */
  const CONTACTO = {
    direccion: 'Cda. Carretera Papalotla s/n, San Andrés Chiautla 1, 56030 Chiautla, Méx.',
    tel1: '01 595 95 3 18 84', tel1Link: '015959531884',
    tel2: '01 595 95 3 19 45', tel2Link: '015959531945',
    ext: '94251',
    email: 'comitepromociontex@gmail.com',
    facebook: 'https://www.facebook.com/profile.php?id=100012254806363',
  };
  window.CONTACTO = CONTACTO;

  /* ── 1. HTML del navbar ── */
  const TOP_BAR = `
  <div class="top-bar">
    <div class="container top-bar-inner">
      <span><strong>ISEM</strong> — Instituto de Salud del Estado de México</span>
      <a href="tel:${CONTACTO.tel1Link}" class="top-bar-contact">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.3 19.79 19.79 0 01.22 2.62 2 2 0 012.2.5H5.1a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.41a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        ${CONTACTO.tel1} · ${CONTACTO.tel2}
      </a>
    </div>
  </div>`;

  const CHEVRON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
  const LUPA    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

  /* ── 1b. Menús desplegables — fuente única ──
     Editar aquí añade/quita elementos del menú y mantiene
     automáticamente el cableado de accesibilidad (aria-expanded,
     aria-controls) que necesita el acordeón móvil. */
  const NAV_MENUS = [
    { page: 'promocion', label: 'Promoción de la Salud', items: [
      ['determinantes', 'Determinantes Sociales'],
      ['paquete-garantizado.html', 'Paquete Garantizado'],
      ['material',      'Material Educativo'],
      ['campanas',      'Campañas'],
      ['estilos',       'Estilos de Vida'],
      ['alimentacion',  'Alimentación'],
      ['actividad',     'Actividad Física'],
      ['evidencias',    'Evidencias'],
    ]},
    { page: 'adicciones', label: 'Adicciones', items: [
      ['prevencion',   'Prevención'],
      ['riesgo',       'Factores de Riesgo'],
      ['tamizajes',    'Tamizajes'],
      ['capacitacion', 'Capacitación'],
      ['evidencias',   'Evidencias'],
      ['reportes',     'Reportes'],
    ]},
    { page: 'salud-mental', label: 'Salud Mental', items: [
      ['bienestar',  'Promoción del Bienestar'],
      ['suicidio',   'Prevención del Suicidio'],
      ['violencia',  'Violencia'],
      ['estres',     'Estrés y Ansiedad'],
      ['infancias',  'Infancias y Adolescencia'],
      ['evidencias', 'Evidencias y Reportes'],
    ]},
    { page: 'entornos', label: 'Entornos Saludables', items: [
      ['escuelas',    'Escuelas'],
      ['comunidades', 'Comunidades'],
      ['laborales',   'Espacios Laborales (ELHT)'],
      ['unidades',    'Unidades de Salud'],
      ['evidencias',  'Evidencias'],
    ]},
  ];

  const dropdown = ({ page, label, items }) => `
        <div class="nav-dropdown">
          <button class="nav-link dropdown-toggle" data-page="${page}"
                  aria-expanded="false" aria-controls="dd-${page}">
            ${label} ${CHEVRON}
          </button>
          <div class="dropdown-menu" id="dd-${page}">
            ${items.map(([destino, text]) =>
              // Un destino con .html es una página propia; el resto son
              // anclas dentro de la página del menú.
              `<a href="${destino.includes('.html') ? destino : `${page}.html#${destino}`}" class="dropdown-item">${text}</a>`).join('\n            ')}
          </div>
        </div>`;

  const NAV_HTML = `
  <a href="#main" class="skip-link">Saltar al contenido</a>
  ${TOP_BAR}
  <header class="navbar" id="navbar">
    <div class="container navbar-inner">
      <a href="index.html" class="brand">
        <div class="brand-icon">
          <img src="assets/img/isotipo.png" alt="Promoción a la Salud ISEM"
               onerror="this.style.display='none';this.parentElement.textContent='PS'">
        </div>
        <div class="brand-text">
          <span class="brand-main">Promoción a la Salud</span>
          <span class="brand-sub">Jurisdicción Sanitaria Texcoco</span>
        </div>
      </a>

      <nav class="nav-links" id="nav-links">
        <a href="index.html" class="nav-link" data-page="index">Inicio</a>

${NAV_MENUS.map(dropdown).join('')}

        <a href="biblioteca.html"  class="nav-link" data-page="biblioteca">Biblioteca</a>
        <a href="reportes.html"    class="nav-link" data-page="reportes">Reportes</a>
        <a href="directorio.html"  class="nav-link" data-page="directorio">Directorio</a>
      </nav>

      <button class="nav-search-btn" id="nav-search-btn"
              aria-label="Buscar recursos" aria-keyshortcuts="Control+K">
        ${LUPA}
        <span class="nsb-text">Buscar recursos</span>
        <kbd class="nsb-kbd">Ctrl K</kbd>
      </button>

      <button class="menu-toggle" id="menu-toggle" aria-label="Menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <!-- Buscador global: un solo punto de entrada a los 178 recursos.
       <dialog> nativo → foco atrapado y Escape sin código propio. -->
  <dialog class="search-dialog" id="search-dialog"
          aria-label="Buscar en el catálogo de recursos">
    <div class="sd-head">
      ${LUPA}
      <label class="visually-hidden" for="buscador-global">Buscar recursos</label>
      <input type="search" id="buscador-global" autocomplete="off"
             placeholder="Buscar formatos, talleres, lineamientos…">
      <button type="button" class="sd-close" aria-label="Cerrar buscador">Esc</button>
    </div>
    <p class="sd-status" role="status"></p>
    <div class="sd-results" id="sd-results"></div>
  </dialog>`;

  /* ── 2. HTML del footer ── */
  const FOOTER_HTML = `
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-icon small">
          <img src="assets/img/isotipo-blanco.png" alt="Promoción a la Salud"
               onerror="this.style.display='none';this.parentElement.textContent='PS'">
        </div>
        <div>
          <strong>Promoción a la Salud</strong>
          <span>Jurisdicción Sanitaria Texcoco · ISEM</span>
        </div>
      </div>
      <div class="footer-links">
        <a href="index.html">Inicio</a>
        <a href="promocion.html">Promoción</a>
        <a href="adicciones.html">Adicciones</a>
        <a href="salud-mental.html">Salud Mental</a>
        <a href="entornos.html">Entornos</a>
        <a href="biblioteca.html">Biblioteca</a>
        <a href="reportes.html">Reportes</a>
        <a href="directorio.html">Directorio</a>
        <a href="recursos-psicologia.html">Recursos psicología</a>
        <a href="privacidad.html">Aviso de privacidad</a>
      </div>
      <div class="footer-links">
        <span>${CONTACTO.direccion}</span>
        <a href="tel:${CONTACTO.tel1Link}">${CONTACTO.tel1}</a>
        <a href="tel:${CONTACTO.tel2Link}">${CONTACTO.tel2}</a>
        <span>Ext. ${CONTACTO.ext}</span>
        <a href="mailto:${CONTACTO.email}">${CONTACTO.email}</a>
        <a href="${CONTACTO.facebook}" target="_blank" rel="noopener">Facebook</a>
      </div>
      <div class="footer-legal">
        <span>© 2025 Promoción a la Salud — Jurisdicción Sanitaria Texcoco</span>
        <span>Gobierno del Estado de México</span>
      </div>
    </div>
  </footer>`;

  /* ── 3. Inyección ── */
  const navEl    = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  if (navEl)    navEl.innerHTML    = NAV_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;

  /* ── 4. Marcar el link activo según la página actual ── */
  const filename = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  /* Páginas propias que cuelgan de un menú: el desplegable se marca
     activo igual que si estuvieras en la página del menú. */
  const ALIAS = { 'paquete-garantizado': 'promocion' };
  const activa = ALIAS[filename] || filename;
  document.querySelectorAll('.nav-link[data-page], .dropdown-toggle[data-page]').forEach(link => {
    if (link.dataset.page === activa) link.classList.add('active');
  });
})();
