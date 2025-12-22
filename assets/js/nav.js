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

  // Red laser trail
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  let drawing = false;
  let lastPoint = null;

  const fade = () => {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(fade);
  };
  fade();

  const start = (x, y) => {
    drawing = true;
    lastPoint = { x, y };
  };

  const stop = () => {
    drawing = false;
    lastPoint = null;
  };

  const draw = (x, y) => {
    if (!drawing || !lastPoint) return;
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.85)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(255, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPoint = { x, y };
  };

  document.addEventListener('mousedown', event => {
    if (event.button !== 0) return;
    start(event.clientX, event.clientY);
  });
  document.addEventListener('mouseup', stop);
  document.addEventListener('mouseleave', stop);
  document.addEventListener('mousemove', event => draw(event.clientX, event.clientY));
});
