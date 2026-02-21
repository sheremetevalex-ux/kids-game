import { STICKERS, nextEpisodeId } from '../data.js';
import { drawSoftBackground } from '../engine/sprites.js';
import {
  createButton,
  createCard,
  createScreen,
  language,
  setHelperText,
  t,
} from '../ui.js';

export function createRewardScene(app, params) {
  const { episodeId, stickerId } = params;

  return {
    init() {
      const state = app.state.getState();
      const lang = language(state);

      app.canvas.setBackgroundRenderer((ctx, size) => {
        drawSoftBackground(ctx, size.width, size.height, ['#ffe5a5', '#ffb7d3']);
      });

      const screen = createScreen(app.uiRoot, 'reward-screen');
      const card = createCard('reward-card');

      const title = document.createElement('h2');
      title.textContent = t(app, 'rewardGreat');

      const sub = document.createElement('p');
      sub.textContent = t(app, 'episodeDone');

      const star = document.createElement('div');
      star.className = 'reward-star';
      star.textContent = '★';

      const sticker = STICKERS.find((item) => item.id === stickerId) || STICKERS[0];
      const stickerImg = document.createElement('img');
      stickerImg.className = 'reward-sticker';
      stickerImg.src = app.getStickerSrc(sticker);
      stickerImg.alt = sticker.id;

      const actions = document.createElement('div');
      actions.className = 'reward-actions';

      const nextId = nextEpisodeId(episodeId);
      if (nextId && app.state.isEpisodeUnlocked(nextId)) {
        const next = createButton(t(app, 'next'), 'btn btn-primary');
        next.addEventListener('click', () => {
          app.audio.playSfx('tap');
          app.router.go('episode', { episodeId: nextId });
        });
        actions.appendChild(next);
      }

      const map = createButton(t(app, 'map'), 'btn btn-secondary');
      map.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('map');
      });

      const stickers = createButton(t(app, 'stickers'), 'btn btn-ghost');
      stickers.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('stickers');
      });

      actions.append(map, stickers);
      card.append(title, sub, star, stickerImg, actions);
      screen.appendChild(card);

      setHelperText(app, lang === 'en' ? 'You got a new sticker!' : 'Новая наклейка уже в альбоме!');

      app.particles.spawnConfetti(window.innerWidth * 0.5, 140, 38);
      app.audio.playSfx('confetti');
    },
  };
}
