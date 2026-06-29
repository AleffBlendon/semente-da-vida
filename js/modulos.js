/**
 * modulos.js — Tela de seleção de módulos
 * Semente da Vida
 *
 * URL esperada: modulos.html?faixa=11-14  ou  modulos.html?faixa=15-17
 */

(function () {

  /* ── Configuração das faixas etárias ── */
  const FAIXAS = {
    '3-6': {
      emoji:  '🌱',
      titulo: '3 – 6 anos',
      label:  'Primeira Infância',
      sub:    'Vamos aprender sobre o nosso corpo, toques bons e ruins, e em quem podemos confiar!',
      cor:    '#E07B39',
    },
    '7-10': {
      emoji:  '🌿',
      titulo: '7 – 10 anos',
      label:  'Infância',
      sub:    'Aprenda sobre seus limites, como reconhecer situações ruins e pedir ajuda quando precisar.',
      cor:    '#2A9D8F',
    },
    '11-14': {
      emoji:  '🌲',
      titulo: '11 – 14 anos',
      label:  'Pré-adolescência',
      sub:    'Conteúdos sobre limites pessoais, privacidade e relações seguras.',
      cor:    '#8B1E2D',
    },
    '15-17': {
      emoji:  '🌳',
      titulo: '15 – 17 anos',
      label:  'Adolescência',
      sub:    'Aprofundamento em relações, consentimento e proteção no mundo digital.',
      cor:    '#5B2C6F',
    },
  };

  /* ── Títulos e descrições de cada módulo — variam por faixa etária ── */
  const MODULOS_POR_FAIXA = {

    // 3–6 anos: linguagem simples, frases curtas, foco no concreto
    '3-6': [
      { titulo: 'Módulo 1 — Quem sou eu?',        desc: 'Meu nome, meu corpo e o que me faz especial!',                        icone: '🪞' },
      { titulo: 'Módulo 2 — Meu corpo é meu',      desc: 'Aprendo que meu corpo é meu e ninguém pode tocá-lo sem minha permissão.', icone: '🛡️' },
      { titulo: 'Módulo 3 — Toques bons e ruins',  desc: 'Existem toques que fazem bem e toques que não são certos.',            icone: '🤲' },
      { titulo: 'Módulo 4 — Pode contar!',          desc: 'Quando algo me deixa triste ou com medo, posso contar para um adulto.', icone: '💬' },
      { titulo: 'Módulo 5 — Pessoas de confiança', desc: 'Quem são os adultos que me ajudam e me protegem?',                    icone: '🤝' },
      { titulo: 'Módulo 6 — Me sinto seguro!',     desc: 'Eu sei me proteger e sei pedir ajuda. Muito bem!',                    icone: '🌟' },
    ],

    // 7–10 anos: um pouco mais elaborado, mas ainda direto e acolhedor
    '7-10': [
      { titulo: 'Módulo 1 — Quem sou eu?',          desc: 'Conhecer a si mesmo é o primeiro passo para se cuidar.',             icone: '🪞' },
      { titulo: 'Módulo 2 — Meu corpo é meu',        desc: 'Entender os limites do meu corpo e respeitar o dos outros.',         icone: '🛡️' },
      { titulo: 'Módulo 3 — Segredos e mentiras',    desc: 'Aprendo a diferença entre segredos bons e segredos ruins.',          icone: '🤔' },
      { titulo: 'Módulo 4 — Falar protege',          desc: 'Contar para um adulto de confiança é sempre a escolha certa.',       icone: '💬' },
      { titulo: 'Módulo 5 — Quando não me sinto bem',desc: 'Reconheço situações que me deixam desconfortável e sei o que fazer.',icone: '🔒' },
      { titulo: 'Módulo 6 — Posso ajudar!',          desc: 'Se um amigo precisar, eu sei como apoiar e onde buscar ajuda.',      icone: '🌟' },
    ],

    // 11–14 e 15–17: textos originais mantidos
    'default': [
      { titulo: 'Módulo 1 — Quem sou eu?',        desc: 'Autoconhecimento, identidade e valorização pessoal.',                          icone: '🪞' },
      { titulo: 'Módulo 2 — Meu corpo é meu',      desc: 'Limites corporais, privacidade e respeito ao próprio corpo.',                  icone: '🛡️' },
      { titulo: 'Módulo 3 — Relações seguras',     desc: 'Como identificar relações saudáveis e reconhecer situações de risco.',         icone: '🤝' },
      { titulo: 'Módulo 4 — Falar é proteger',     desc: 'A importância de se comunicar com adultos de confiança.',                     icone: '💬' },
      { titulo: 'Módulo 5 — Segurança digital',    desc: 'Proteção nas redes sociais, privacidade online e uso seguro da internet.',     icone: '🔒' },
      { titulo: 'Módulo 6 — Eu posso ajudar',      desc: 'Como apoiar colegas e buscar ajuda em situações difíceis.',                   icone: '🌟' },
    ],
  };

  /* ── Lê o parâmetro ?faixa= da URL ── */
  function getFaixa() {
    const params = new URLSearchParams(window.location.search);
    return params.get('faixa') || '11-14';
  }

  /* ── Recupera progresso salvo no localStorage ── */
  function getProgress(faixa, modulo) {
    try {
      const key  = `sdv_progress_${faixa}_mod${modulo}`;
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      return data; // { slide, total, completed }
    } catch (_) { return null; }
  }

  /* ── Renderiza o hero da faixa ── */
  function renderHero(faixa) {
    const config = FAIXAS[faixa];
    if (!config) return;

    document.title = `${config.titulo} — Semente da Vida`;

    // Marca o body com a faixa para coloração CSS
    document.body.setAttribute('data-faixa', faixa);

    const el = (id) => document.getElementById(id);

    el('faixaEmoji').textContent   = config.emoji;
    el('faixaTitle').textContent   = `${config.label} · ${config.titulo}`;
    el('faixaSub').textContent     = config.sub;
    el('faixaBadge').textContent   = '6 módulos disponíveis';

    // Cor dinâmica do hero
    const hero = document.getElementById('modulesHero');
    if (hero) {
      hero.style.background = `linear-gradient(135deg, ${config.cor} 0%, ${darken(config.cor, 20)} 100%)`;
    }
  }

  /* ── Escurece uma cor hex (util) ── */
  function darken(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  /* ── Renderiza os cards de módulo ── */
  function renderModulos(faixa) {
    const grid = document.getElementById('modulesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Usa textos específicos da faixa se existirem, senão usa os padrão
    const modulos = MODULOS_POR_FAIXA[faixa] || MODULOS_POR_FAIXA['default'];

    // Texto do botão CTA adaptado por faixa
    const ctaTexto = {
      '3-6':  { inicio: 'Vamos lá! 🎉', continua: 'Continuar 👉', rever: 'Ver de novo 🔁' },
      '7-10': { inicio: 'Começar',       continua: 'Continuar',    rever: 'Rever módulo'   },
    };
    const cta = ctaTexto[faixa] || { inicio: 'Começar', continua: 'Continuar', rever: 'Rever módulo' };

    modulos.forEach((mod, idx) => {
      const num      = idx + 1;
      const progress = getProgress(faixa, num);

      const pct       = progress ? Math.round((progress.slide / progress.total) * 100) : 0;
      const completed = progress?.completed === true;
      const started   = progress && progress.slide > 0;

      const statusClass = completed ? 'module-card__status--done' : '';
      const statusIcon  = completed ? '✅' : (started ? '▶️' : '');
      const progressBar = started || completed
        ? `<div class="module-card__progress"><div class="module-card__progress-fill" style="width:${pct}%"></div></div>`
        : '';

      const card = document.createElement('a');
      card.href  = `slides.html?faixa=${faixa}&modulo=${num}`;
      card.className = 'module-card';
      card.setAttribute('aria-label', `${mod.titulo} — clique para acessar`);

      card.innerHTML = `
        <div class="module-card__header">
          <span class="module-card__icone">${mod.icone}</span>
          <span class="module-card__num">Módulo ${num}</span>
          ${statusIcon ? `<span class="module-card__status-icon">${statusIcon}</span>` : ''}
        </div>
        <h3 class="module-card__title">${mod.titulo}</h3>
        <p class="module-card__desc">${mod.desc}</p>
        ${progressBar}
        <div class="module-card__footer">
          <span class="module-card__cta">
            ${completed ? cta.rever : (started ? cta.continua : cta.inicio)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
          <span class="module-card__status ${statusClass}"></span>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  /* ── Inicializa a página ── */
  function init() {
    const faixa = getFaixa();

    // Valida faixa
    if (!FAIXAS[faixa]) {
      window.location.href = 'index.html';
      return;
    }

    renderHero(faixa);
    renderModulos(faixa);

    // Link "Voltar"
    const backLink = document.getElementById('backLink');
    if (backLink) {
      backLink.href = 'index.html#faixas';
    }
  }

  init();

})();
