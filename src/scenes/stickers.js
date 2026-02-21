import { STICKERS } from '../data.js';
import {
  createButton,
  createCard,
  createScreen,
  language,
  setHelperText,
  t,
} from '../ui.js';

export function createStickersScene(app) {
  let unsubscribe = null;

  function renderUi() {
    const state = app.state.getState();
    const lang = language(state);

    const screen = createScreen(app.uiRoot, 'stickers-screen');
    const top = createCard('stickers-top');

    const title = document.createElement('h2');
    title.textContent = t(app, 'stickers');

    const stats = document.createElement('p');
    stats.className = 'stickers-count';
    stats.textContent = `${app.state.stickersCollectedCount()}/${STICKERS.length}`;

    const back = createButton(t(app, 'back'), 'btn btn-ghost');
    back.addEventListener('click', () => {
      app.audio.playSfx('tap');
      app.router.go('map');
    });

    top.append(title, stats, back);

    const grid = document.createElement('div');
    grid.className = 'stickers-grid';

    STICKERS.forEach((sticker) => {
      const hasSticker = Boolean(state.stickers[sticker.id]);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'sticker-cell';
      if (!hasSticker) {
        cell.classList.add('locked');
      }

      const img = document.createElement('img');
      img.src = app.getStickerSrc(sticker);
      img.alt = sticker.id;
      cell.appendChild(img);

      cell.addEventListener('click', () => {
        if (!hasSticker) {
          app.audio.playSfx('error');
          return;
        }
        app.audio.playSfx('sticker');
        cell.classList.remove('pop');
        void cell.offsetWidth;
        cell.classList.add('pop');
        app.particles.spawnStars(
          cell.getBoundingClientRect().left + cell.offsetWidth / 2,
          cell.getBoundingClientRect().top + cell.offsetHeight / 2,
          12,
        );
      });

      grid.appendChild(cell);
    });

    screen.append(top, grid);
    setHelperText(
      app,
      lang === 'en'
        ? 'Tap a collected sticker for a little dance.'
        : 'Нажми на полученную наклейку, она подпрыгнет!',
    );
  }

  return {
    init() {
      app.audio.setTrack('happyB');
      renderUi();
      unsubscribe = app.state.subscribe(renderUi);
    },
    dispose() {
      if (unsubscribe) {
        unsubscribe();
      }
    },
  };
}
