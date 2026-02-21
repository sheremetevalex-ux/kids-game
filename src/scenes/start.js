import { CHARACTERS, GAME_TITLE, characterAvatar, getDeviceProfile } from '../data.js';
import {
  createButton,
  createCard,
  createInstallInstructions,
  createPointerHint,
  createScreen,
  createSubtitle,
  createTitle,
  language,
  randomHelperTip,
  setHelperText,
  t,
} from '../ui.js';
import { drawSoftBackground, drawSparkle } from '../engine/sprites.js';

function canFullscreen() {
  return Boolean(document.fullscreenEnabled);
}

function characterParade() {
  const wrap = document.createElement('div');
  wrap.className = 'start-characters';
  CHARACTERS.slice(0, 6).forEach((character) => {
    const chip = document.createElement('div');
    chip.className = 'start-character';
    const img = document.createElement('img');
    img.src = characterAvatar(character.id, 80);
    img.alt = character.nameRu;
    chip.appendChild(img);
    wrap.appendChild(chip);
  });
  return wrap;
}

export function createStartScene(app) {
  let unsubscribe = null;

  const render = () => {
    const current = app.state.getState();
    const lang = language(current);
    const profile = getDeviceProfile();

    const screen = createScreen(app.uiRoot, 'start-screen');
    const card = createCard('start-card playful-card');

    card.append(
      createTitle(GAME_TITLE.ru, GAME_TITLE.en, lang),
      createSubtitle(
        'Жми картинки и играй',
        'Tap pictures and play',
        lang,
      ),
      characterParade(),
    );

    if (!app.audio.isUnlocked()) {
      const unlock = createButton(`🎵 ${t(app, 'unlockAudio')}`, 'btn btn-primary btn-big');
      unlock.addEventListener('click', async () => {
        await app.audio.unlock();
        app.audio.playSfx('tap');
        render();
      });
      const mute = createButton(`🤫 ${t(app, 'soundOff')}`, 'btn btn-ghost');
      mute.addEventListener('click', async () => {
        app.state.setManySettings({ musicOn: false, sfxOn: false });
        await app.audio.unlock();
        render();
      });
      card.append(unlock, mute);
    } else {
      const play = createButton(`▶️ ${t(app, 'play')}`, 'btn btn-primary btn-big');
      play.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('map');
      });

      const stickers = createButton(`🧸 ${t(app, 'stickers')}`, 'btn btn-secondary btn-big');
      stickers.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('stickers');
      });

      card.append(play, stickers);

      if (canFullscreen() && !profile.isIOS) {
        const fs = createButton(`⛶ ${t(app, 'fullscreen')}`, 'btn btn-ghost');
        fs.addEventListener('click', () => {
          document.documentElement.requestFullscreen().catch(() => {});
        });
        card.appendChild(fs);
      }
    }

    const stars = document.createElement('p');
    stars.className = 'start-stats';
    stars.textContent = `⭐ ${current.stars}`;
    card.appendChild(stars);

    screen.appendChild(card);

    if (!current.settings.installDismissed && !profile.isStandalone) {
      const installCard = createCard('install-card playful-card');
      installCard.appendChild(createInstallInstructions(profile, lang));
      installCard.appendChild(createPointerHint(profile));

      if (app.installPromptEvent && profile.isAndroid) {
        const installNow = createButton(lang === 'en' ? '📲 Install now' : '📲 Установить сейчас', 'btn btn-primary');
        installNow.addEventListener('click', async () => {
          app.installPromptEvent.prompt();
          await app.installPromptEvent.userChoice;
          app.installPromptEvent = null;
          render();
        });
        installCard.appendChild(installNow);
      }

      const done = createButton(`✅ ${t(app, 'installDone')}`, 'btn btn-secondary');
      done.addEventListener('click', () => {
        app.state.markInstallDismissed();
      });

      const continueBrowser = createButton(`🌐 ${t(app, 'continueBrowser')}`, 'btn btn-ghost');
      continueBrowser.addEventListener('click', () => {
        app.state.markInstallDismissed();
      });

      installCard.append(done, continueBrowser);
      screen.appendChild(installCard);
    }

    setHelperText(app, `🐶 ${randomHelperTip(current)}`);
  };

  return {
    init() {
      app.canvas.setBackgroundRenderer((ctx, size) => {
        drawSoftBackground(ctx, size.width, size.height, ['#8fd5ff', '#ffe19f']);
        const tNow = performance.now() * 0.001;
        for (let i = 0; i < 10; i += 1) {
          const x = ((i * 120 + tNow * 25) % (size.width + 100)) - 30;
          const y = 72 + (i % 4) * 62 + Math.sin(tNow + i) * 12;
          drawSparkle(ctx, x, y, 5 + (i % 3), i % 2 ? '#ffffff' : '#ffe780');
        }
      });

      render();
      unsubscribe = app.state.subscribe(() => {
        render();
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
