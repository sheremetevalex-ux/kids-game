import {
  createButton,
  createCard,
  createScreen,
  createSelectRow,
  createToggleRow,
  setHelperText,
} from '../ui.js';

export function createParentSettingsScene(app, params) {
  const returnTo = params.returnTo || { name: 'map', params: {} };
  let unlocked = false;
  let unsubscribe = null;

  function closePanel() {
    app.router.go(returnTo.name || 'map', returnTo.params || {});
  }

  function renderLocked(screen) {
    const gate = createCard('parent-gate');
    const title = document.createElement('h2');
    title.textContent = 'Parent Panel';

    const desc = document.createElement('p');
    desc.textContent = 'Quick check: 2 + 3 = ?';

    const input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.className = 'parent-input';

    const row = document.createElement('div');
    row.className = 'row';

    const submit = createButton('Open', 'btn btn-primary');
    const cancel = createButton('Cancel', 'btn btn-ghost');

    submit.addEventListener('click', () => {
      if (String(input.value).trim() === '5') {
        unlocked = true;
        app.audio.playSfx('tap');
        renderUi();
      } else {
        input.value = '';
        input.placeholder = 'Try again';
        app.audio.playSfx('error');
      }
    });

    cancel.addEventListener('click', closePanel);

    row.append(submit, cancel);
    gate.append(title, desc, input, row);
    screen.appendChild(gate);

    setTimeout(() => input.focus(), 80);
  }

  function renderUnlocked(screen) {
    const state = app.state.getState();
    const card = createCard('parent-panel');

    const title = document.createElement('h2');
    title.textContent = 'Parent Settings';
    card.appendChild(title);

    card.append(
      createSelectRow({
        label: 'Language',
        value: state.settings.language,
        options: [
          { value: 'ru', label: 'Russian' },
          { value: 'en', label: 'English' },
        ],
        onChange: (value) => app.state.setLanguage(value),
      }),
      createSelectRow({
        label: 'Difficulty',
        value: state.settings.difficulty,
        options: [
          { value: 'easy', label: 'Easy' },
          { value: 'normal', label: 'Normal' },
        ],
        onChange: (value) => app.state.setSetting('difficulty', value),
      }),
      createToggleRow({
        label: 'Unlock all episodes',
        checked: state.settings.unlockAll,
        onChange: (value) => app.state.setSetting('unlockAll', value),
      }),
      createToggleRow({
        label: 'Calm Corner reminders',
        checked: state.settings.calmReminders,
        onChange: (value) => app.state.setSetting('calmReminders', value),
      }),
      createSelectRow({
        label: 'Performance mode',
        value: state.settings.performanceMode,
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'low', label: 'Low (less effects)' },
        ],
        onChange: (value) => app.state.setSetting('performanceMode', value),
      }),
      createToggleRow({
        label: 'Music',
        checked: state.settings.musicOn,
        onChange: (value) => app.state.setSetting('musicOn', value),
      }),
      createToggleRow({
        label: 'Sound effects',
        checked: state.settings.sfxOn,
        onChange: (value) => app.state.setSetting('sfxOn', value),
      }),
    );

    const actions = document.createElement('div');
    actions.className = 'settings-actions';

    const install = createButton('Show install card again', 'btn btn-secondary');
    install.addEventListener('click', () => {
      app.state.reopenInstallCard();
      app.router.go('start');
    });

    const update = createButton('Check for update', 'btn btn-secondary');
    update.addEventListener('click', async () => {
      if (!app.swRegistration) {
        update.textContent = 'Service worker not ready';
        return;
      }
      update.textContent = 'Checking...';
      try {
        await app.swRegistration.update();
        if (app.swRegistration.waiting) {
          const reload = window.confirm('Update is ready. Reload now?');
          if (reload) {
            app.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
        update.textContent = 'Checked';
      } catch {
        update.textContent = 'Check failed';
      }
    });

    const reset = createButton('Reset progress', 'btn btn-danger');
    reset.addEventListener('click', () => {
      const ok = window.confirm('Reset all stars, stickers and progress?');
      if (!ok) {
        return;
      }
      app.state.resetProgress();
      app.audio.playSfx('tap');
      closePanel();
    });

    const close = createButton('Close', 'btn btn-primary');
    close.addEventListener('click', closePanel);

    actions.append(install, update, reset, close);
    card.appendChild(actions);

    screen.appendChild(card);
    setHelperText(app, 'Parent panel is open.');
  }

  function renderUi() {
    const screen = createScreen(app.uiRoot, 'parent-screen');
    if (!unlocked) {
      renderLocked(screen);
      return;
    }
    renderUnlocked(screen);
  }

  return {
    init() {
      renderUi();
      unsubscribe = app.state.subscribe(() => {
        if (unlocked) {
          renderUi();
        }
      });
    },
    dispose() {
      if (unsubscribe) {
        unsubscribe();
      }
    },
  };
}
