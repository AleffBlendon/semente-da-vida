/**
 * slides.js — Visualizador de slides por imagem JPG
 * Semente da Vida
 *
 * URL esperada: slides.html?faixa=11-14&modulo=1
 *
 * Estrutura real dos arquivos:
 *   image/11~14 anos/Semente_da_Vida_11-14_Modulo-1/1.jpg
 *   image/11~14 anos/Semente_da_Vida_11-14_Modulo-1/2.jpg
 *   ...
 *   image/15~17 anos/Semente_da_Vida_15-17_Modulo-1/1.jpg
 *   ...
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════
     MAPA DE CAMINHOS DOS CONTEÚDOS
     Cada entrada tem a pasta e o prefixo dos arquivos.
  ════════════════════════════════════════════════ */
  const FAIXAS = {
    '11-14': {
      label:  '11 – 14 anos',
      cor:    '#8B1E2D',
      // Pasta base relativa ao index.html
      pasta:  'image/11~14 anos',
      // Nome da subpasta de cada módulo (substitui {N} pelo número)
      subpasta: 'Semente_da_Vida_11-14_Modulo-{N}',
    },
    '15-17': {
      label:  '15 – 17 anos',
      cor:    '#5B2C6F',
      pasta:  'image/15~17 anos',
      subpasta: 'Semente_da_Vida_15-17_Modulo-{N}',
    },
  };

  const MODULOS_TITULOS = [
    'Módulo 1 — Quem sou eu?',
    'Módulo 2 — Meu corpo é meu',
    'Módulo 3 — Relações seguras',
    'Módulo 4 — Falar é proteger',
    'Módulo 5 — Segurança digital',
    'Módulo 6 — Eu posso ajudar',
  ];

  // Número total de slides por módulo (todos têm 12)
  const TOTAL_SLIDES = 12;

  /* ════════════════════════════════════════════════
     ESTADO
  ════════════════════════════════════════════════ */
  const state = {
    faixa:    '11-14',
    modulo:   1,
    slides:   [],
    atual:    0,
    animando: false,
  };

  /* ════════════════════════════════════════════════
     DOM
  ════════════════════════════════════════════════ */
  const $ = (id) => document.getElementById(id);

  const DOM = {
    loading:      $('slidesLoading'),
    empty:        $('slidesEmpty'),
    emptyPath:    $('slidesEmptyPath'),
    emptyBack:    $('slidesEmptyBack'),
    viewer:       $('slidesViewer'),
    image:        $('slideImage'),
    imageWrap:    $('slideImageWrap'),
    progressBar:  $('progressBar'),
    btnPrev:      $('btnPrev'),
    btnNext:      $('btnNext'),
    arrowPrev:    $('arrowPrev'),
    arrowNext:    $('arrowNext'),
    slideAtual:   $('slideAtual'),
    slideTotal:   $('slideTotal'),
    dots:         $('slidesDots'),
    headerFaixa:  $('headerFaixa'),
    headerModulo: $('headerModulo'),
    btnVoltar:    $('btnVoltar'),
    btnVoltarTop: $('btnVoltarTop'),
    modalConcl:   $('modalConclusao'),
    modalText:    $('modalText'),
    modalProximo: $('modalProximo'),
    modalVoltar:  $('modalVoltar'),
  };

  /* ════════════════════════════════════════════════
     PARÂMETROS DE URL
  ════════════════════════════════════════════════ */
  function parseParams() {
    const p = new URLSearchParams(window.location.search);
    state.faixa  = p.get('faixa')  || '11-14';
    state.modulo = parseInt(p.get('modulo') || '1', 10);
    if (!FAIXAS[state.faixa])                          state.faixa  = '11-14';
    if (isNaN(state.modulo) || state.modulo < 1 || state.modulo > 6) state.modulo = 1;
  }

  /* ════════════════════════════════════════════════
     CONSTRUÇÃO DOS CAMINHOS
  ════════════════════════════════════════════════ */

  /** Retorna o caminho completo de um slide pelo seu número (1-based). */
  function buildSlideUrl(num) {
    const f    = FAIXAS[state.faixa];
    const sub  = f.subpasta.replace('{N}', state.modulo);
    // Constrói o path com espaço literal e encodeURI converte para %20
    // O til (~) é preservado por encodeURI — servidores HTTP tratam corretamente
    const path = `${f.pasta}/${sub}/${num}.jpg`;
    return encodeURI(path);
  }

  /** Gera o array de URLs de 1 até TOTAL_SLIDES. */
  function buildSlideList() {
    const list = [];
    for (let n = 1; n <= TOTAL_SLIDES; n++) {
      list.push(buildSlideUrl(n));
    }
    return list;
  }

  /* ════════════════════════════════════════════════
     VERIFICAÇÃO DE EXISTÊNCIA (fallback seguro)
     Tenta carregar a primeira imagem; se falhar,
     mostra o estado vazio.
  ════════════════════════════════════════════════ */
  function imageExists(url) {
    return new Promise((resolve) => {
      const img   = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src     = url;
    });
  }

  /* ════════════════════════════════════════════════
     HEADER
  ════════════════════════════════════════════════ */
  function renderHeader() {
    const f      = FAIXAS[state.faixa];
    const titulo = MODULOS_TITULOS[state.modulo - 1] || `Módulo ${state.modulo}`;
    const voltar = `modulos.html?faixa=${state.faixa}`;

    DOM.headerFaixa.textContent   = f.label;
    DOM.headerModulo.textContent  = titulo;
    DOM.btnVoltar.href             = voltar;
    DOM.btnVoltarTop.href          = voltar;
    DOM.progressBar.style.background = f.cor;
    document.title = `${titulo} — Semente da Vida`;
  }

  /* ════════════════════════════════════════════════
     DOTS DE NAVEGAÇÃO
  ════════════════════════════════════════════════ */
  function renderDots() {
    DOM.dots.innerHTML = '';
    // Mostra dots apenas se <= 20 slides
    if (state.slides.length > 20) return;

    state.slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className   = 'slides-dot' + (idx === state.atual ? ' slides-dot--active' : '');
      dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
      dot.addEventListener('click', () => goTo(idx, idx > state.atual ? 'next' : 'prev'));
      DOM.dots.appendChild(dot);
    });
  }

  /* ════════════════════════════════════════════════
     ATUALIZAÇÃO DA UI (sem trocar imagem)
  ════════════════════════════════════════════════ */
  function updateUI() {
    const cur   = state.atual + 1;
    const total = state.slides.length;

    DOM.slideAtual.textContent  = cur;
    DOM.slideTotal.textContent  = total;
    DOM.progressBar.style.width = `${(cur / total) * 100}%`;

    DOM.btnPrev.disabled   = state.atual === 0;
    DOM.arrowPrev.disabled = state.atual === 0;

    const isLast = state.atual === total - 1;
    if (isLast) {
      DOM.btnNext.innerHTML = `Concluir <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else {
      DOM.btnNext.innerHTML = `Próximo <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }

    // Atualiza dots
    DOM.dots.querySelectorAll('.slides-dot').forEach((dot, idx) => {
      dot.classList.toggle('slides-dot--active', idx === state.atual);
    });
  }

  /* ════════════════════════════════════════════════
     NAVEGAÇÃO
  ════════════════════════════════════════════════ */

  /**
   * Navega para o slide de índice `idx` com animação.
   * @param {number} idx
   * @param {'next'|'prev'} direction
   */
  function goTo(idx, direction = 'next') {
    if (state.animando) return;
    if (idx < 0 || idx >= state.slides.length) return;

    state.animando = true;

    const wrap = DOM.imageWrap;

    // Classe de saída
    const exitClass  = direction === 'next' ? 'slide-exit-left'  : 'slide-exit-right';
    const enterClass = direction === 'next' ? 'slide-enter-right' : 'slide-enter-left';

    wrap.classList.add(exitClass);

    setTimeout(() => {
      state.atual = idx;

      // Oculta a imagem atual enquanto a nova carrega
      DOM.image.style.opacity = '0';
      DOM.imageWrap.classList.add('is-loading');

      // FIX: define onload/onerror ANTES de mudar o src
      // Garante que o evento seja capturado mesmo com cache
      DOM.image.onload = () => {
        DOM.image.style.opacity = '1';
        DOM.imageWrap.classList.remove('is-loading');
        state.animando = false;
      };
      DOM.image.onerror = () => {
        DOM.image.style.opacity = '1';
        DOM.imageWrap.classList.remove('is-loading');
        state.animando = false;
      };

      DOM.image.src = state.slides[idx];
      DOM.image.alt = `Slide ${idx + 1} de ${state.slides.length}`;

      wrap.classList.remove(exitClass);
      wrap.classList.add(enterClass);
      void wrap.offsetWidth; // força reflow para reiniciar animação CSS
      wrap.classList.remove(enterClass);

      updateUI();
      saveProgress();

      // Pré-carrega o próximo slide em background
      if (idx + 1 < state.slides.length) {
        new Image().src = state.slides[idx + 1];
      }

      // Libera animando imediatamente para slides em cache
      // (onload já terá disparado de forma síncrona)
      if (DOM.image.complete && DOM.image.naturalWidth > 0) {
        DOM.image.style.opacity = '1';
        DOM.imageWrap.classList.remove('is-loading');
        state.animando = false;
      }
    }, 200);
  }

  function next() {
    if (state.atual < state.slides.length - 1) {
      goTo(state.atual + 1, 'next');
    } else {
      showConclusao();
    }
  }

  function prev() {
    if (state.atual > 0) goTo(state.atual - 1, 'prev');
  }

  /* ════════════════════════════════════════════════
     PROGRESSO (localStorage)
  ════════════════════════════════════════════════ */
  function saveProgress(completed = false) {
    try {
      const key  = `sdv_progress_${state.faixa}_mod${state.modulo}`;
      localStorage.setItem(key, JSON.stringify({
        slide:     state.atual,
        total:     state.slides.length,
        completed: completed || (state.atual === state.slides.length - 1),
        ts:        Date.now(),
      }));
    } catch (_) {}
  }

  function getSavedSlide() {
    try {
      const data = JSON.parse(localStorage.getItem(`sdv_progress_${state.faixa}_mod${state.modulo}`) || 'null');
      if (data && typeof data.slide === 'number') return data.slide;
    } catch (_) {}
    return 0;
  }

  /* ════════════════════════════════════════════════
     MODAL DE CONCLUSÃO
  ════════════════════════════════════════════════ */
  function showConclusao() {
    saveProgress(true);

    const titulo     = MODULOS_TITULOS[state.modulo - 1];
    const proximoMod = state.modulo < 6 ? state.modulo + 1 : null;

    DOM.modalText.textContent = `Você visualizou todos os ${state.slides.length} slides do ${titulo}.`;

    if (proximoMod) {
      DOM.modalProximo.href        = `slides.html?faixa=${state.faixa}&modulo=${proximoMod}`;
      DOM.modalProximo.innerHTML   = `Módulo ${proximoMod} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      DOM.modalProximo.style.display = '';
    } else {
      DOM.modalProximo.style.display = 'none';
    }

    DOM.modalVoltar.href  = `modulos.html?faixa=${state.faixa}`;
    DOM.modalConcl.hidden = false;
  }

  /* ════════════════════════════════════════════════
     ESTADOS DA TELA
  ════════════════════════════════════════════════ */
  function showLoading() {
    DOM.loading.hidden = false;
    DOM.empty.hidden   = true;
    DOM.viewer.hidden  = true;
  }

  function showEmpty() {
    const f   = FAIXAS[state.faixa];
    const sub = f.subpasta.replace('{N}', state.modulo);
    DOM.loading.hidden         = true;
    DOM.empty.hidden           = false;
    DOM.viewer.hidden          = true;
    DOM.emptyPath.textContent  = `${f.pasta}/${sub}/1.jpg`;
    DOM.emptyBack.href         = `modulos.html?faixa=${state.faixa}`;
  }

  function showViewer() {
    DOM.loading.hidden = true;
    DOM.empty.hidden   = true;
    DOM.viewer.hidden  = false;
  }

  /* ════════════════════════════════════════════════
     TECLADO E SWIPE
  ════════════════════════════════════════════════ */
  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!DOM.modalConcl.hidden) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    prev();
    });
  }

  function bindSwipe() {
    let startX = 0, startY = 0;

    DOM.imageWrap.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    DOM.imageWrap.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) next();
        else         prev();
      }
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════
     INICIALIZAÇÃO
  ════════════════════════════════════════════════ */
  async function init() {
    parseParams();
    renderHeader();
    showLoading();

    // Monta lista de URLs
    const slides = buildSlideList();

    // Verifica se ao menos o primeiro slide existe
    const primeiroOk = await imageExists(slides[0]);

    if (!primeiroOk) {
      showEmpty();
      return;
    }

    state.slides = slides;

    // Retoma do ponto salvo
    state.atual = Math.min(getSavedSlide(), slides.length - 1);

    // FIX: registra onload/onerror ANTES de setar src,
    // evitando a race condition quando a imagem já está em cache.
    DOM.image.onload = () => {
      showViewer();
      renderDots();
      updateUI();
      // Troca o handler pós-init: nas trocas de slide só esconde o mini-loader
      DOM.image.onload  = () => { DOM.image.style.opacity = '1'; DOM.imageWrap.classList.remove('is-loading'); };
      DOM.image.onerror = () => { DOM.image.style.opacity = '1'; DOM.imageWrap.classList.remove('is-loading'); };
    };
    DOM.image.onerror = () => {
      showViewer();
      renderDots();
      updateUI();
      DOM.image.onload  = () => { DOM.image.style.opacity = '1'; DOM.imageWrap.classList.remove('is-loading'); };
      DOM.image.onerror = () => { DOM.image.style.opacity = '1'; DOM.imageWrap.classList.remove('is-loading'); };
    };

    DOM.image.src = slides[state.atual];
    DOM.image.alt = `Slide ${state.atual + 1} de ${slides.length}`;

    // Pré-carrega o próximo
    if (state.atual + 1 < slides.length) {
      new Image().src = slides[state.atual + 1];
    }

    // Eventos dos botões
    DOM.btnNext.addEventListener('click', next);
    DOM.btnPrev.addEventListener('click', prev);
    DOM.arrowNext.addEventListener('click', next);
    DOM.arrowPrev.addEventListener('click', prev);

    // Fecha modal ao clicar fora
    DOM.modalConcl.addEventListener('click', (e) => {
      if (e.target === DOM.modalConcl) DOM.modalConcl.hidden = true;
    });

    bindKeyboard();
    bindSwipe();
  }

  init();

})();
