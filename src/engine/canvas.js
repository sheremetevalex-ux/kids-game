export function createCanvasEngine(canvas) {
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let backgroundRenderer = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getSize() {
    return { width, height, dpr };
  }

  function setBackgroundRenderer(renderer) {
    backgroundRenderer = renderer;
  }

  function render(draw) {
    ctx.clearRect(0, 0, width, height);
    if (backgroundRenderer) {
      backgroundRenderer(ctx, getSize());
    }
    if (draw) {
      draw(ctx, getSize());
    }
  }

  window.addEventListener('resize', resize);
  resize();

  return {
    ctx,
    resize,
    render,
    getSize,
    setBackgroundRenderer,
    dispose() {
      window.removeEventListener('resize', resize);
      backgroundRenderer = null;
    },
  };
}
