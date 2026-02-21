import { HELPER_TIPS, textFor } from './data.js';

export function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function createScreen(root, className = '') {
  clearNode(root);
  const section = document.createElement('section');
  section.className = `screen ${className}`.trim();
  root.appendChild(section);
  return section;
}

export function createCard(className = '') {
  const card = document.createElement('div');
  card.className = `card ${className}`.trim();
  return card;
}

export function createTitle(ruText, enText, lang = 'ru') {
  const h = document.createElement('h1');
  h.className = 'title';
  h.textContent = lang === 'en' ? enText : ruText;
  return h;
}

export function createSubtitle(ruText, enText, lang = 'ru') {
  const p = document.createElement('p');
  p.className = 'subtitle';
  p.textContent = lang === 'en' ? enText : ruText;
  return p;
}

export function createButton(text, className = 'btn') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  return button;
}

export function createDualLabelButton(ruText, enText, lang = 'ru', className = 'btn') {
  const button = createButton(lang === 'en' ? enText : ruText, className);
  button.dataset.ru = ruText;
  button.dataset.en = enText;
  return button;
}

export function createSmallTag(text) {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = text;
  return tag;
}

export function language(state) {
  return state.settings.language === 'en' ? 'en' : 'ru';
}

export function t(app, key) {
  return textFor(app.state.getState(), key);
}

export function randomHelperTip(state) {
  const lang = language(state);
  const tips = HELPER_TIPS[lang];
  return tips[Math.floor(Math.random() * tips.length)];
}

export function setHelperText(app, message) {
  app.helperBubble.textContent = message;
  app.helperBubble.classList.add('show');
}

export function showToast(app, message, actionLabel = '', onAction = null) {
  const toast = document.createElement('div');
  toast.className = 'toast';

  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);

  if (actionLabel && onAction) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'toast-action';
    action.textContent = actionLabel;
    action.addEventListener('click', () => {
      onAction();
      toast.remove();
    });
    toast.appendChild(action);
  }

  app.toastRoot.appendChild(toast);
  const timer = setTimeout(() => {
    toast.remove();
  }, 4200);

  return () => {
    clearTimeout(timer);
    toast.remove();
  };
}

export function addLongPress(element, ms, callback) {
  let timer = null;

  const start = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
      timer = null;
    }, ms);
  };

  const cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  element.addEventListener('pointerdown', start);
  element.addEventListener('pointerup', cancel);
  element.addEventListener('pointerleave', cancel);
  element.addEventListener('pointercancel', cancel);

  return () => {
    cancel();
    element.removeEventListener('pointerdown', start);
    element.removeEventListener('pointerup', cancel);
    element.removeEventListener('pointerleave', cancel);
    element.removeEventListener('pointercancel', cancel);
  };
}

export function createToggleRow({ label, checked, onChange }) {
  const row = document.createElement('label');
  row.className = 'settings-row';

  const title = document.createElement('span');
  title.textContent = label;

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = Boolean(checked);
  input.addEventListener('change', () => {
    onChange(input.checked);
  });

  row.append(title, input);
  return row;
}

export function createSelectRow({ label, value, options, onChange }) {
  const row = document.createElement('label');
  row.className = 'settings-row';

  const title = document.createElement('span');
  title.textContent = label;

  const select = document.createElement('select');
  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.value === value) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  select.addEventListener('change', () => onChange(select.value));

  row.append(title, select);
  return row;
}

export function createProgressBar() {
  const wrap = document.createElement('div');
  wrap.className = 'progress-wrap';

  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  wrap.appendChild(bar);

  return {
    root: wrap,
    set(value) {
      const clamped = Math.max(0, Math.min(1, value));
      bar.style.transform = `scaleX(${clamped})`;
    },
  };
}

export function createInstallInstructions(profile, lang) {
  const wrapper = document.createElement('div');
  wrapper.className = 'install-steps';

  const title = document.createElement('h3');
  title.textContent = lang === 'en' ? 'Install on phone' : 'Установить игру на телефон';

  const list = document.createElement('ol');
  list.className = 'steps-list';

  const addStep = (text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  };

  if (profile.isIOS) {
    addStep(lang === 'en' ? 'Tap Share button in Safari.' : 'Нажмите «Поделиться» в Safari.');
    addStep(lang === 'en' ? 'Choose "Add to Home Screen".' : 'Выберите «На экран Домой».');
    addStep(lang === 'en' ? 'Tap "Add".' : 'Нажмите «Добавить».');
  } else if (profile.isAndroid) {
    addStep(lang === 'en' ? 'Open browser menu (⋮).' : 'Откройте меню браузера (⋮).');
    addStep(lang === 'en' ? 'Tap "Install app" or "Add to Home screen".' : 'Нажмите «Установить приложение» или «Добавить на главный экран».');
    addStep(lang === 'en' ? 'Confirm install.' : 'Подтвердите установку.');
  } else {
    addStep(lang === 'en' ? 'Open this page on a phone browser.' : 'Откройте эту страницу на телефоне.');
    addStep(lang === 'en' ? 'Use browser menu to install as app.' : 'Через меню браузера установите как приложение.');
  }

  wrapper.append(title, list);
  return wrapper;
}

export function createPointerHint(profile) {
  const hint = document.createElement('div');
  hint.className = 'pointer-hint';
  if (profile.isIOS) {
    hint.classList.add('ios');
  } else if (profile.isAndroid) {
    hint.classList.add('android');
  }
  return hint;
}
