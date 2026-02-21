export function addTap(element, handler) {
  const onPointerUp = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    handler(event);
  };
  element.addEventListener('pointerup', onPointerUp);
  return () => {
    element.removeEventListener('pointerup', onPointerUp);
  };
}

export function makeDraggable(node, options) {
  const {
    onStart = () => {},
    onMove = () => {},
    onEnd = () => {},
  } = options;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const onDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    event.preventDefault();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    currentX = Number(node.dataset.tx || 0);
    currentY = Number(node.dataset.ty || 0);
    node.setPointerCapture(event.pointerId);
    node.classList.add('dragging');
    onStart(event);
  };

  const onMoveInternal = (event) => {
    if (!dragging) {
      return;
    }
    event.preventDefault();
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const tx = currentX + dx;
    const ty = currentY + dy;
    node.dataset.tx = String(tx);
    node.dataset.ty = String(ty);
    node.style.transform = `translate(${tx}px, ${ty}px)`;
    onMove({ event, tx, ty, dx, dy });
  };

  const onUp = (event) => {
    if (!dragging) {
      return;
    }
    dragging = false;
    node.classList.remove('dragging');
    onEnd({ event, tx: Number(node.dataset.tx || 0), ty: Number(node.dataset.ty || 0) });
  };

  node.addEventListener('pointerdown', onDown);
  node.addEventListener('pointermove', onMoveInternal);
  node.addEventListener('pointerup', onUp);
  node.addEventListener('pointercancel', onUp);

  return () => {
    node.removeEventListener('pointerdown', onDown);
    node.removeEventListener('pointermove', onMoveInternal);
    node.removeEventListener('pointerup', onUp);
    node.removeEventListener('pointercancel', onUp);
  };
}

export function rectContains(rect, x, y) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
