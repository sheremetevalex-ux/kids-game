import { iconForEpisode, locationById } from '../data.js';
import { EPISODES } from './episodes/index.js';
import {
  createButton,
  createCard,
  createScreen,
  language,
  setHelperText,
  t,
} from '../ui.js';

export function createEpisodeRunnerScene(app, params) {
  const { episodeId } = params;
  let cleanup = null;
  let paused = false;
  let finished = false;

  function togglePause(overlay) {
    paused = !paused;
    overlay.classList.toggle('show', paused);
  }

  return {
    init() {
      const state = app.state.getState();
      const lang = language(state);
      const episode = EPISODES[episodeId];

      if (!episode) {
        app.router.go('map');
        return;
      }

      if (!app.state.isEpisodeUnlocked(episode.id)) {
        app.router.go('episodeSelect', { locationId: episode.locationId });
        return;
      }

      const location = locationById(episode.locationId);
      app.audio.setTrack(location.track);

      const screen = createScreen(app.uiRoot, 'episode-screen');
      const top = createCard('episode-top playful-card');

      const title = document.createElement('h2');
      title.textContent = `${iconForEpisode(episode.id)} ${lang === 'en' ? episode.titleEn : episode.titleRu}`;

      const controls = document.createElement('div');
      controls.className = 'episode-controls';

      const pause = createButton(`⏸️ ${t(app, 'pause')}`, 'btn btn-ghost');
      const home = createButton(`🏠 ${t(app, 'home')}`, 'btn btn-ghost');

      const pauseOverlay = document.createElement('div');
      pauseOverlay.className = 'pause-overlay';
      const resume = createButton(`▶️ ${t(app, 'resume')}`, 'btn btn-primary');
      resume.addEventListener('click', () => {
        app.audio.playSfx('tap');
        togglePause(pauseOverlay);
      });
      pauseOverlay.appendChild(resume);

      pause.addEventListener('click', () => {
        app.audio.playSfx('tap');
        togglePause(pauseOverlay);
      });

      home.addEventListener('click', () => {
        const message = lang === 'en'
          ? 'Go back to map?'
          : 'Вернуться на карту?';
        if (window.confirm(message)) {
          app.audio.playSfx('tap');
          app.router.go('map');
        }
      });

      controls.append(pause, home);
      top.append(title, controls);

      const contentCard = createCard('episode-content playful-card');
      const mountPoint = document.createElement('div');
      mountPoint.className = 'episode-mount';
      contentCard.appendChild(mountPoint);

      screen.append(top, contentCard, pauseOverlay);

      const statusNode = document.createElement('p');
      statusNode.className = 'episode-status global';
      statusNode.textContent = lang === 'en' ? 'Tap and play 🌟' : 'Нажимай и играй 🌟';
      contentCard.appendChild(statusNode);

      const api = {
        app,
        lang,
        difficulty: state.settings.difficulty,
        audio: app.audio,
        particles: app.particles,
        setStatus(text) {
          statusNode.textContent = text;
        },
        finish() {
          if (finished) {
            return;
          }
          finished = true;
          app.state.completeEpisode(episode.id, episode.rewardSticker);
          app.router.go('reward', {
            episodeId: episode.id,
            stickerId: episode.rewardSticker,
          });
        },
      };

      cleanup = episode.mount(mountPoint, api);

      setHelperText(app, lang === 'en' ? '🎉 Great! Keep tapping.' : '🎉 Отлично! Нажимай дальше.');
    },

    update() {
      if (paused) {
        return;
      }
    },

    dispose() {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    },
  };
}
