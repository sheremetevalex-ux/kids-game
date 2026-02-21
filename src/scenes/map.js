import { CHARACTERS, LOCATIONS, characterAvatar } from '../data.js';
import { drawMapPath, drawPuppy, drawSoftBackground } from '../engine/sprites.js';
import {
  createButton,
  createCard,
  createScreen,
  language,
  randomHelperTip,
  setHelperText,
  t,
} from '../ui.js';

export function createMapScene(app) {
  let unsubscribe = null;

  function renderUi() {
    const state = app.state.getState();
    const lang = language(state);
    const screen = createScreen(app.uiRoot, 'map-screen');

    const top = createCard('map-top playful-card');
    const title = document.createElement('h2');
    title.textContent = `🗺️ ${t(app, 'map')}`;
    const back = createButton(`⬅️ ${t(app, 'back')}`, 'btn btn-ghost');
    back.addEventListener('click', () => {
      app.audio.playSfx('tap');
      app.router.go('start');
    });
    top.append(title, back);

    const board = document.createElement('div');
    board.className = 'map-board';

    LOCATIONS.forEach((location, idx) => {
      const stats = app.state.locationStats(location.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'location-node';
      card.style.left = `${location.x}%`;
      card.style.top = `${location.y}%`;
      card.style.setProperty('--loc-color', location.color);

      const icon = document.createElement('span');
      icon.className = 'location-icon';
      icon.textContent = location.icon || '⭐';

      const avatar = document.createElement('img');
      avatar.className = 'location-avatar';
      avatar.src = characterAvatar(CHARACTERS[idx % CHARACTERS.length].id, 74);
      avatar.alt = '';

      const progress = document.createElement('span');
      progress.className = 'location-progress';
      progress.textContent = `${stats.done}/${stats.total} ⭐`;

      const titleText = document.createElement('strong');
      titleText.textContent = lang === 'en' ? location.en : location.ru;

      card.append(icon, avatar, titleText, progress);

      card.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.state.setLastLocation(location.id);
        app.router.go('episodeSelect', { locationId: location.id });
      });

      board.appendChild(card);
    });

    const stickers = createButton(`🧸 ${t(app, 'stickers')}`, 'btn btn-secondary floating-stickers');
    stickers.addEventListener('click', () => {
      app.audio.playSfx('tap');
      app.router.go('stickers');
    });

    screen.append(top, board, stickers);

    if (state.settings.calmReminders && Math.random() > 0.5) {
      setHelperText(
        app,
        lang === 'en' ? '🌈 Need a break? Calm Corner!' : '🌈 Хочешь передышку? Тихий уголок!',
      );
    } else {
      setHelperText(app, `🐾 ${randomHelperTip(state)}`);
    }
  }

  return {
    init() {
      app.audio.setTrack('happyA');
      app.canvas.setBackgroundRenderer((ctx, size) => {
        drawSoftBackground(ctx, size.width, size.height, ['#8fd7ff', '#ffd99c']);

        const points = LOCATIONS.map((location) => ({
          x: (location.x / 100) * size.width,
          y: (location.y / 100) * size.height,
        }));
        drawMapPath(ctx, points);

        points.forEach((point, index) => {
          const character = CHARACTERS[index % CHARACTERS.length];
          const blink = Math.sin(performance.now() * 0.004 + index) > 0.98 ? 0.95 : 0;
          drawPuppy(ctx, point.x - 26, point.y - 36, 54, character, blink);
        });
      });

      renderUi();
      unsubscribe = app.state.subscribe(() => {
        renderUi();
      });
    },

    dispose() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  };
}
