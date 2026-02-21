import { LOCATION_EPISODES, characterAvatar, iconForEpisode, locationById } from '../data.js';
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

    const header = createCard('episode-select-top playful-card');
    const title = document.createElement('h2');
    title.textContent = `${location.icon || '⭐'} ${lang === 'en' ? location.en : location.ru}`;

    const back = createButton(`⬅️ ${t(app, 'back')}`, 'btn btn-ghost');
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

      const card = createCard('episode-card visual-episode-card');

      const badge = document.createElement('div');
      badge.className = 'episode-badge-big';
      badge.textContent = iconForEpisode(episodeId);

      const cast = document.createElement('div');
      cast.className = 'episode-card-cast';
      (episode.characters || []).slice(0, 2).forEach((id) => {
        const img = document.createElement('img');
        img.src = characterAvatar(id, 70);
        img.alt = id;
        cast.appendChild(img);
      });

      const h3 = document.createElement('h3');
      h3.textContent = lang === 'en' ? episode.titleEn : episode.titleRu;

      const reward = document.createElement('p');
      reward.textContent = done
        ? (lang === 'en' ? '✅ Done' : '✅ Готово')
        : (lang === 'en' ? `⭐ ${index + 1}` : `⭐ ${index + 1}`);

      const playBtn = createButton(
        unlocked ? (lang === 'en' ? '▶️ Play' : '▶️ Играть') : (lang === 'en' ? '🔒 Locked' : '🔒 Закрыто'),
        unlocked ? 'btn btn-primary' : 'btn btn-disabled',
      );
      playBtn.disabled = !unlocked;

      playBtn.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('episode', { episodeId });
      });

      card.append(badge, cast, h3, reward, playBtn);
      list.appendChild(card);
    });

    screen.appendChild(list);
    setHelperText(app, `🎈 ${randomHelperTip(state)}`);
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
