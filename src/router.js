export class BaseScene {
  constructor(app, params = {}) {
    this.app = app;
    this.params = params;
  }

  init() {}

  update() {}

  render() {}

  dispose() {}
}

export function createRouter(app) {
  const registry = new Map();
  let current = null;
  let currentRoute = { name: '', params: {} };
  let running = false;
  let rafId = 0;
  let lastTs = 0;

  function register(name, sceneFactory) {
    registry.set(name, sceneFactory);
  }

  function go(name, params = {}) {
    const factory = registry.get(name);
    if (!factory) {
      throw new Error(`Scene not found: ${name}`);
    }

    if (current && typeof current.dispose === 'function') {
      current.dispose();
    }

    app.canvas.setBackgroundRenderer(null);
    currentRoute = { name, params };
    current = factory(app, params);

    if (current && typeof current.init === 'function') {
      current.init();
    }
  }

  function tick(ts) {
    if (!running) {
      return;
    }
    const dt = Math.min(0.04, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;

    if (current && typeof current.update === 'function') {
      current.update(dt);
    }

    app.particles.update(dt);
    app.canvas.render((ctx, size) => {
      if (current && typeof current.render === 'function') {
        current.render(ctx, size, dt);
      }
      app.particles.render(ctx);
    });

    rafId = requestAnimationFrame(tick);
  }

  function start(initialRoute, params = {}) {
    go(initialRoute, params);
    running = true;
    lastTs = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    if (current && typeof current.dispose === 'function') {
      current.dispose();
    }
  }

  function getCurrentRoute() {
    return { ...currentRoute };
  }

  return {
    register,
    go,
    start,
    stop,
    getCurrentRoute,
  };
}
