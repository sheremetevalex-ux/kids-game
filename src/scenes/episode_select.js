import { LOCATION_EPISODES, locationById } from '../data.js';
import { EPISODES } from './episodes/index.js';
import {
  createButton,
  createCard,
  createScreen,
  language,
  randomHelperTip,
  setHelperText,
  t,
} from '../ui.js';

export function createEpisodeSelectScene(app, params) {
  const locationId = params.locationId;
  let unsubscribe = null;

  function renderUi() {
    const state = app.state.getState();
    const lang = language(state);
    const location = locationById(locationId);
    const episodes = LOCATION_EPISODES[locationId] || [];

    const screen = createScreen(app.uiRoot, 'episode-select-screen');

    const header = createCard('episode-select-top');
    const title = document.createElement('h2');
    title.textContent = lang === 'en' ? location.en : location.ru;

    const back = createButton(t(app, 'back'), 'btn btn-ghost');
    back.addEventListener('click', () => {
      app.audio.playSfx('tap');
      app.router.go('map');
    });
    header.append(title, back);
    screen.appendChild(header);

    const list = document.createElement('div');
    list.className = 'episode-list';

    episodes.forEach((episodeId, index) => {
      const episode = EPISODES[episodeId];
      const unlocked = app.state.isEpisodeUnlocked(episodeId);
      const done = Boolean(state.completedEpisodes[episodeId]);

      const card = createCard('episode-card');
      const h3 = document.createElement('h3');
      h3.textContent = lang === 'en' ? episode.titleEn : episode.titleRu;

      const meta = document.createElement('p');
      meta.textContent = `${episode.durationMin} min`;

      const reward = document.createElement('p');
      reward.textContent = done
        ? (lang === 'en' ? 'Completed ★' : 'Пройдено ★')
        : (lang === 'en' ? `Sticker: ${index + 1}` : `Наклейка: ${index + 1}`);

      const playBtn = createButton(
        unlocked ? (lang === 'en' ? 'Play episode' : 'Играть') : (lang === 'en' ? 'Locked' : 'Закрыто'),
        unlocked ? 'btn btn-primary' : 'btn btn-disabled',
      );
      playBtn.disabled = !unlocked;

      playBtn.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('episode', { episodeId });
      });

      card.append(h3, meta, reward, playBtn);
      list.appendChild(card);
    });

    screen.appendChild(list);
    setHelperText(app, randomHelperTip(state));
  }

  return {
    init() {
      const location = locationById(locationId);
      app.audio.setTrack(location.track);
      renderUi();
      unsubscribe = app.state.subscribe(() => {
        renderUi();
      });
    },
    dispose() {
      if (unsubscribe) {
        unsubscribe();
      }
    },
  };
}
