import { GAME_TITLE, getDeviceProfile } from '../data.js';
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

export function createStartScene(app) {
  let unsubscribe = null;

  const render = () => {
    const current = app.state.getState();
    const lang = language(current);
    const profile = getDeviceProfile();

    const screen = createScreen(app.uiRoot, 'start-screen');
    const card = createCard('start-card');

    card.append(
      createTitle(GAME_TITLE.ru, GAME_TITLE.en, lang),
      createSubtitle(
        'Короткие добрые приключения',
        'Short kind adventures',
        lang,
      ),
    );

    if (!app.audio.isUnlocked()) {
      const unlock = createButton(t(app, 'unlockAudio'), 'btn btn-primary btn-big');
      unlock.addEventListener('click', async () => {
        await app.audio.unlock();
        app.audio.playSfx('tap');
        render();
      });
      const mute = createButton(t(app, 'soundOff'), 'btn btn-ghost');
      mute.addEventListener('click', async () => {
        app.state.setManySettings({ musicOn: false, sfxOn: false });
        await app.audio.unlock();
        render();
      });
      card.append(unlock, mute);
    } else {
      const play = createButton(t(app, 'play'), 'btn btn-primary btn-big');
      play.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('map');
      });

      const stickers = createButton(t(app, 'stickers'), 'btn btn-secondary btn-big');
      stickers.addEventListener('click', () => {
        app.audio.playSfx('tap');
        app.router.go('stickers');
      });

      card.append(play, stickers);

      if (canFullscreen() && !profile.isIOS) {
        const fs = createButton(t(app, 'fullscreen'), 'btn btn-ghost');
        fs.addEventListener('click', () => {
          document.documentElement.requestFullscreen().catch(() => {});
        });
        card.appendChild(fs);
      }
    }

    const stars = document.createElement('p');
    stars.className = 'start-stats';
    stars.textContent = `${current.stars} ★`;
    card.appendChild(stars);

    screen.appendChild(card);

    if (!current.settings.installDismissed && !profile.isStandalone) {
      const installCard = createCard('install-card');
      installCard.appendChild(createInstallInstructions(profile, lang));
      installCard.appendChild(createPointerHint(profile));

      if (app.installPromptEvent && profile.isAndroid) {
        const installNow = createButton(lang === 'en' ? 'Install now' : 'Установить сейчас', 'btn btn-primary');
        installNow.addEventListener('click', async () => {
          app.installPromptEvent.prompt();
          await app.installPromptEvent.userChoice;
          app.installPromptEvent = null;
          render();
        });
        installCard.appendChild(installNow);
      }

      const done = createButton(t(app, 'installDone'), 'btn btn-secondary');
      done.addEventListener('click', () => {
        app.state.markInstallDismissed();
      });

      const continueBrowser = createButton(t(app, 'continueBrowser'), 'btn btn-ghost');
      continueBrowser.addEventListener('click', () => {
        app.state.markInstallDismissed();
      });

      installCard.append(done, continueBrowser);
      screen.appendChild(installCard);
    }

    setHelperText(app, randomHelperTip(current));
  };

  return {
    init() {
      app.canvas.setBackgroundRenderer((ctx, size) => {
        drawSoftBackground(ctx, size.width, size.height, ['#8fd5ff', '#ffe19f']);
        const tNow = performance.now() * 0.001;
        for (let i = 0; i < 8; i += 1) {
          const x = ((i * 120 + tNow * 20) % (size.width + 80)) - 20;
          const y = 80 + (i % 3) * 70 + Math.sin(tNow + i) * 10;
          drawSparkle(ctx, x, y, 5 + (i % 3), '#ffffff');
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
