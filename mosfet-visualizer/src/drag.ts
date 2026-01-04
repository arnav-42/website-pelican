interface CardPosition {
  left: number;
  top: number;
}

interface DragState {
  isDragging: boolean;
  currentCard: HTMLElement | null;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
}

const dragState: DragState = {
  isDragging: false,
  currentCard: null,
  startX: 0,
  startY: 0,
  startLeft: 0,
  startTop: 0,
};

const STORAGE_KEY = 'mosfet-card-positions';

export function initDrag(): void {
  const cards = document.querySelectorAll<HTMLElement>('.draggable-card');
  
  cards.forEach(card => {
    const handle = card.querySelector<HTMLElement>('.drag-handle');
    if (handle) {
      setupDragHandlers(card, handle);
    }
  });

  loadPositions();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
}

function setupDragHandlers(card: HTMLElement, handle: HTMLElement): void {
  handle.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(card, e.clientX, e.clientY);
  });

  handle.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(card, touch.clientX, touch.clientY);
  }, { passive: false });
}

function startDrag(card: HTMLElement, clientX: number, clientY: number): void {
  dragState.isDragging = true;
  dragState.currentCard = card;
  dragState.startX = clientX;
  dragState.startY = clientY;
  dragState.startLeft = card.offsetLeft;
  dragState.startTop = card.offsetTop;

  card.classList.add('dragging');
  
  bringToFront(card);
}

function onMouseMove(e: MouseEvent): void {
  if (!dragState.isDragging || !dragState.currentCard) return;
  
  const deltaX = e.clientX - dragState.startX;
  const deltaY = e.clientY - dragState.startY;
  
  moveCard(dragState.currentCard, deltaX, deltaY);
}

function onTouchMove(e: TouchEvent): void {
  if (!dragState.isDragging || !dragState.currentCard || e.touches.length !== 1) return;
  
  e.preventDefault();
  const touch = e.touches[0];
  const deltaX = touch.clientX - dragState.startX;
  const deltaY = touch.clientY - dragState.startY;
  
  moveCard(dragState.currentCard, deltaX, deltaY);
}

function moveCard(card: HTMLElement, deltaX: number, deltaY: number): void {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const canvasRect = canvas.getBoundingClientRect();
  
  let newLeft = dragState.startLeft + deltaX;
  let newTop = dragState.startTop + deltaY;
  
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  
  const minLeft = -cardWidth + 100;
  const maxLeft = canvasRect.width - 100;
  const minTop = 0;
  const maxTop = Math.max(canvasRect.height - 50, cardHeight);
  
  newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
  newTop = Math.max(minTop, Math.min(maxTop, newTop));
  
  card.style.left = `${newLeft}px`;
  card.style.top = `${newTop}px`;
}

function onMouseUp(): void {
  endDrag();
}

function onTouchEnd(): void {
  endDrag();
}

function endDrag(): void {
  if (!dragState.isDragging || !dragState.currentCard) return;
  
  dragState.currentCard.classList.remove('dragging');
  
  savePositions();
  
  dragState.isDragging = false;
  dragState.currentCard = null;
}

function bringToFront(card: HTMLElement): void {
  const cards = document.querySelectorAll<HTMLElement>('.draggable-card');
  let maxZ = 1;
  
  cards.forEach(c => {
    const z = parseInt(getComputedStyle(c).zIndex) || 1;
    if (z > maxZ) maxZ = z;
    c.style.zIndex = '1';
  });
  
  card.style.zIndex = String(maxZ + 1);
}

function savePositions(): void {
  const positions: Record<string, CardPosition> = {};
  const cards = document.querySelectorAll<HTMLElement>('.draggable-card');
  
  cards.forEach(card => {
    const id = card.id;
    if (id) {
      positions[id] = {
        left: card.offsetLeft,
        top: card.offsetTop,
      };
    }
  });
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    console.warn('Could not save card positions:', e);
  }
}

function loadPositions(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    const positions: Record<string, CardPosition> = JSON.parse(saved);
    const cards = document.querySelectorAll<HTMLElement>('.draggable-card');
    
    cards.forEach(card => {
      const id = card.id;
      if (id && positions[id]) {
        card.style.left = `${positions[id].left}px`;
        card.style.top = `${positions[id].top}px`;
      }
    });
  } catch (e) {
    console.warn('Could not load card positions:', e);
  }
}

export function resetCardPositions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
  }
  
  const defaults: Record<string, CardPosition> = {
    'card-control': { left: 20, top: 20 },
    'card-plot': { left: 360, top: 20 },
    'card-values': { left: 1060, top: 20 },
  };
  
  Object.entries(defaults).forEach(([id, pos]) => {
    const card = document.getElementById(id);
    if (card) {
      card.style.left = `${pos.left}px`;
      card.style.top = `${pos.top}px`;
    }
  });
}
