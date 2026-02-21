import { createAudioManager } from './audio.js';
import { STICKERS, getDeviceProfile, stickerSvg } from './data.js';
import { createCanvasEngine } from './engine/canvas.js';
import { createParticleSystem } from './engine/particles.js';
import { createRouter } from './router.js';
import { createEpisodeRunnerScene } from './scenes/episode_runner.js';
import { createEpisodeSelectScene } from './scenes/episode_select.js';
import { createMapScene } from './scenes/map.js';
import { createRewardScene } from './scenes/reward.js';
import { createParentSettingsScene } from './scenes/settings_parent.js';
import { createStartScene } from './scenes/start.js';
import { createStickersScene } from './scenes/stickers.js';
import { createState } from './state.js';
import { addLongPress, createProgressBar, showToast, t } from './ui.js';

const canvasElement = document.getElementById('game-canvas');
const uiRoot = document.getElementById('ui-root');
const helperBubble = document.getElementById('helper-bubble');
const toastRoot = document.getElementById('toast-root');
const gearButton = document.getElementById('gear-button');
const orientationOverlay = document.getElementById('orientation-overlay');
const loadingScreen = document.getElementById('loading-screen');
const loadingLabel = document.getElementById('loading-label');
const loadingMount = document.getElementById('loading-progress');

const state = createState();

if (!state.getState().firstLaunchDone && navigator.deviceMemory && navigator.deviceMemory <= 2) {
  state.setSetting('performanceMode', 'low');
}

const app = {
  uiRoot,
  helperBubble,
  toastRoot,
  state,
  canvas: createCanvasEngine(canvasElement),
  particles: createParticleSystem(() => state.getState().settings.performanceMode),
  router: null,
  audio: null,
  swRegistration: null,
  installPromptEvent: null,
  stickerCache: new Map(),
  getStickerSrc(sticker) {
    const key = typeof sticker === 'string' ? sticker : sticker.id;
    return app.stickerCache.get(key) || '';
  },
};

const audio = createAudioManager(() => state.getState());
app.audio = audio;

function applyGraphicsMode() {
  const mode = state.getState().settings.performanceMode;
  document.body.classList.toggle('low-graphics', mode === 'low');
}

state.subscribe(() => {
  audio.syncSettings();
  applyGraphicsMode();
});

const router = createRouter(app);
app.router = router;

router.register('start', (ctx, params) => createStartScene(ctx, params));
router.register('map', (ctx, params) => createMapScene(ctx, params));
router.register('episodeSelect', (ctx, params) => createEpisodeSelectScene(ctx, params));
router.register('episode', (ctx, params) => createEpisodeRunnerScene(ctx, params));
router.register('reward', (ctx, params) => createRewardScene(ctx, params));
router.register('stickers', (ctx, params) => createStickersScene(ctx, params));
router.register('parentSettings', (ctx, params) => createParentSettingsScene(ctx, params));

function setupInteractionGuards() {
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 280) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

function updateOrientationOverlay() {
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const likelyPhoneOrSmallTablet = coarsePointer && Math.min(viewportWidth, viewportHeight) < 900;
  if (!likelyPhoneOrSmallTablet) {
    orientationOverlay.hidden = true;
    return;
  }
  const portraitMedia = window.matchMedia('(orientation: portrait)').matches;
  const screenPortrait = (window.screen?.height || 0) >= (window.screen?.width || 0);
  const definitelyLandscape = viewportWidth > viewportHeight * 1.15;
  const showOverlay = definitelyLandscape && !portraitMedia && !screenPortrait;
  orientationOverlay.hidden = !showOverlay;
}

function setupOrientationWatcher() {
  const onChange = () => requestAnimationFrame(updateOrientationOverlay);
  window.addEventListener('resize', onChange);
  window.addEventListener('orientationchange', onChange);
  window.visualViewport?.addEventListener('resize', onChange);
  onChange();
  setTimeout(onChange, 250);
}

async function preload() {
  const progress = createProgressBar();
  loadingMount.appendChild(progress.root);

  const assets = ['./assets/img/icon-180.png', './assets/img/icon-192.png', './assets/img/icon-512.png'];
  const total = assets.length + STICKERS.length;
  let done = 0;

  const bump = () => {
    done += 1;
    const value = done / total;
    progress.set(value);
    loadingLabel.textContent = `${Math.round(value * 100)}%`;
  };

  for (const sticker of STICKERS) {
    app.stickerCache.set(sticker.id, stickerSvg(sticker, 120));
    bump();
    await new Promise((resolve) => setTimeout(resolve, 6));
  }

  await Promise.all(
    assets.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            bump();
            resolve();
          };
          img.onerror = () => {
            bump();
            resolve();
          };
          img.src = src;
        }),
    ),
  );

  progress.set(1);
  await new Promise((resolve) => setTimeout(resolve, 150));
}

function setupParentLongPress() {
  return addLongPress(gearButton, 2000, () => {
    const current = router.getCurrentRoute();
    if (current.name === 'parentSettings') {
      return;
    }
    app.audio.playSfx('tap');
    router.go('parentSettings', { returnTo: current });
  });
}

function setupInstallPromptCapture() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    app.installPromptEvent = event;
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    app.swRegistration = reg;
    reg.update().catch(() => {});

    const showUpdateToast = () => {
      showToast(app, t(app, 'updateReady'), t(app, 'reload'), () => {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    };

    if (reg.waiting) {
      showUpdateToast();
    }

    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      if (!worker) {
        return;
      }
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateToast();
        }
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  } catch {
    // Service worker is optional in unsupported environments.
  }
}

async function boot() {
  setupInteractionGuards();
  setupOrientationWatcher();
  setupInstallPromptCapture();
  setupParentLongPress();

  const profile = getDeviceProfile();
  if (profile.isStandalone) {
    state.markInstallDismissed();
  }

  applyGraphicsMode();

  await preload();
  loadingLabel.textContent = '100%';
  loadingScreen.classList.add('hide');

  await registerServiceWorker();

  router.start('start');
}

boot();
