/**
 * home.js — Scripts da tela inicial
 * Semente da Vida
 */

(function () {

  /* ── Menu hambúrguer (mobile) ── */
  const burger  = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  if (burger && mainNav) {
    burger.addEventListener('click', () => {
      // O novo CSS usa .is-open
      mainNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', mainNav.classList.contains('is-open'));
    });

    // Fecha o menu ao clicar em qualquer link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('is-open'));
    });

    // Fecha ao clicar fora do header
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header')) {
        mainNav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Header: sombra ao rolar ── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Animação de contagem nos stats ── */
  function animateCount(el, target, duration) {
    const start     = performance.now();
    const startVal  = 0;

    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + eased * (target - startVal));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Dispara quando os stats ficam visíveis na tela
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

  if (statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          if (!isNaN(target)) animateCount(el, target, 1200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  /* ── Cards de faixa etária: garantir que o href funcione ── */
  // Os links já têm href em anchor <a>, mas adicionamos fallback de click
  document.querySelectorAll('.age-card[data-faixa]').forEach(card => {
    card.addEventListener('click', (e) => {
      const faixa = card.dataset.faixa;
      if (faixa) {
        window.location.href = `modulos.html?faixa=${faixa}`;
      }
    });
  });

})();
