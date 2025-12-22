document.addEventListener('DOMContentLoaded', () => {
  // Dropdown handling
  document.querySelectorAll('.nav-more').forEach(drop => {
    const btn = drop.querySelector('.nav-more-btn');
    const menu = drop.querySelector('.nav-more-menu');
    if (!btn || !menu) return;

    const close = () => {
      drop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', event => {
      event.preventDefault();
      const isOpen = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', event => {
      if (!drop.contains(event.target)) {
        close();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        close();
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });
  });
});
