import { characterAvatar, iconForToken, shuffle } from '../../data.js';
import { createButton } from '../../ui.js';
import { makeDraggable, rectContains } from '../../engine/input.js';

function pickText(lang, ru, en) {
  return lang === 'en' ? en : ru;
}

function shortLabel(text) {
  const raw = String(text || '').trim();
  if (!raw) {
    return '';
  }
  const words = raw.split(/\s+/).slice(0, 2).join(' ');
  return words.length > 16 ? `${words.slice(0, 16)}…` : words;
}

function visualLabel(lang, item) {
  return shortLabel(pickText(lang, item?.ru || '', item?.en || ''));
}

function visualIcon(lang, item) {
  if (item?.icon) {
    return item.icon;
  }
  const probe = item?.id || pickText(lang, item?.ru || '', item?.en || '');
  return iconForToken(probe);
}

function createKidTile(icon, label, className) {
  const button = createButton('', className);
  const emoji = document.createElement('span');
  emoji.className = 'kid-icon';
  emoji.textContent = icon || '⭐';

  const text = document.createElement('span');
  text.className = 'kid-text';
  text.textContent = label || '';

  button.append(emoji, text);
  button.setAttribute('aria-label', label || icon || 'item');
  return button;
}

function header(root, meta, api) {
  const lang = api.lang;
  const head = document.createElement('div');
  head.className = 'episode-head';

  const title = document.createElement('h2');
  title.className = 'episode-title';
  title.textContent = `${iconForToken(meta.id)} ${pickText(lang, meta.titleRu, meta.titleEn)}`;

  const cast = document.createElement('div');
  cast.className = 'episode-cast';

  const ids = (meta.characters || []).slice(0, 3);
  ids.forEach((id) => {
    const chip = document.createElement('div');
    chip.className = 'cast-chip';

    const img = document.createElement('img');
    img.src = characterAvatar(id, 84);
    img.alt = id;

    chip.appendChild(img);
    cast.appendChild(chip);
  });

  head.append(title, cast);
  root.appendChild(head);
}

function hintRow(root, icon = '👇', tinyText = '') {
  const row = document.createElement('div');
  row.className = 'episode-hint';

  const emoji = document.createElement('span');
  emoji.className = 'hint-icon';
  emoji.textContent = icon;

  const text = document.createElement('span');
  text.className = 'hint-text';
  text.textContent = tinyText;

  row.append(emoji, text);
  root.appendChild(row);
}

function statusLabel(root) {
  const line = document.createElement('p');
  line.className = 'episode-status';
  root.appendChild(line);
  return {
    set(text) {
      line.textContent = text;
    },
  };
}

function dotProgress(root, total) {
  const wrap = document.createElement('div');
  wrap.className = 'kid-progress';
  const dots = [];
  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'kid-dot';
    wrap.appendChild(dot);
    dots.push(dot);
  }
  root.appendChild(wrap);

  return {
    set(value) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle('on', idx < value);
      });
    },
  };
}

function rewardAndFinish(api) {
  api.audio.playSfx('success');
  api.particles.spawnStars(window.innerWidth * 0.5, window.innerHeight * 0.34, 12);
  setTimeout(() => api.finish(), 580);
}

function failSoft(api) {
  api.audio.playSfx('error');
  if (typeof api.setStatus === 'function') {
    api.setStatus(api.lang === 'en' ? 'Try again 🔁' : 'Ещё раз 🔁');
  }
}

export function makeEpisode(meta, mount) {
  return {
    ...meta,
    mount,
  };
}

export function createChoiceEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    header(root, meta, api);
    hintRow(root, '💭', api.lang === 'en' ? 'Pick the kind picture' : 'Выбери добрую картинку');

    const status = statusLabel(root);
    api.setStatus = status.set;

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'choice-grid';

    config.options.forEach((option) => {
      const button = createKidTile(
        visualIcon(api.lang, option),
        visualLabel(api.lang, option),
        'choice-btn',
      );
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (option.kind === 'good') {
          status.set(api.lang === 'en' ? 'Great 💛' : 'Отлично 💛');
          rewardAndFinish(api);
          return;
        }
        status.set(api.lang === 'en' ? 'Try another 💫' : 'Попробуй другую 💫');
      });
      optionsWrap.appendChild(button);
    });

    root.appendChild(optionsWrap);
    status.set(api.lang === 'en' ? 'Tap a picture' : 'Нажми картинку');
    return () => {};
  });
}

export function createFindEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🔎', lang === 'en' ? 'Find all icons' : 'Найди все иконки');

    const found = new Set();
    const status = statusLabel(root);
    api.setStatus = status.set;

    const tracker = dotProgress(root, config.targets.length);

    const checklist = document.createElement('div');
    checklist.className = 'checklist';
    const targetMap = new Map();
    config.targets.forEach((target) => {
      const chip = document.createElement('span');
      chip.className = 'chip icon-chip';
      chip.textContent = visualIcon(lang, target);
      checklist.appendChild(chip);
      targetMap.set(target.id, chip);
    });
    root.appendChild(checklist);

    const buttons = shuffle([...config.targets, ...config.distractors]);
    const grid = document.createElement('div');
    grid.className = 'find-grid';

    buttons.forEach((item) => {
      const button = createKidTile(
        visualIcon(lang, item),
        visualLabel(lang, item),
        'find-item',
      );
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (targetMap.has(item.id)) {
          if (!found.has(item.id)) {
            found.add(item.id);
            targetMap.get(item.id).classList.add('done');
            button.classList.add('correct');
            tracker.set(found.size);
          }
          if (found.size >= config.targets.length) {
            status.set(lang === 'en' ? 'Found all! 🥳' : 'Все найдены! 🥳');
            rewardAndFinish(api);
          }
          return;
        }
        failSoft(api);
      });
      grid.appendChild(button);
    });

    root.appendChild(grid);
    status.set(lang === 'en' ? 'Find 5' : 'Найди 5');
    return () => {};
  });
}

export function createSequenceEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '1️⃣', lang === 'en' ? 'Tap in order' : 'Нажимай по порядку');

    let step = 0;
    const status = statusLabel(root);
    api.setStatus = status.set;
    const tracker = dotProgress(root, config.steps.length);

    const shuffled = shuffle(config.steps.map((stepConfig, idx) => ({ ...stepConfig, idx })));
    const wrap = document.createElement('div');
    wrap.className = 'sequence-wrap';

    shuffled.forEach((entry) => {
      const button = createKidTile(
        visualIcon(lang, entry),
        visualLabel(lang, entry),
        'sequence-btn',
      );
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (entry.idx === step) {
          button.classList.add('correct');
          button.disabled = true;
          step += 1;
          tracker.set(step);
          if (step >= config.steps.length) {
            status.set(lang === 'en' ? 'Perfect! 🎉' : 'Отлично! 🎉');
            rewardAndFinish(api);
          }
        } else {
          failSoft(api);
          step = 0;
          tracker.set(0);
          wrap.querySelectorAll('button').forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove('correct');
          });
        }
      });
      wrap.appendChild(button);
    });

    root.appendChild(wrap);
    status.set(lang === 'en' ? 'Start ▶️' : 'Начинай ▶️');
    return () => {};
  });
}

export function createPuzzleEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🧩', lang === 'en' ? 'Swap tiles' : 'Меняй плитки');

    const size = config.pieces.length;
    let order = shuffle([...Array(size).keys()]);
    if (order.every((value, idx) => value === idx)) {
      order = [order[1], order[0], ...order.slice(2)];
    }

    let selected = null;
    const status = statusLabel(root);
    api.setStatus = status.set;

    const grid = document.createElement('div');
    grid.className = 'puzzle-grid';
    grid.style.gridTemplateColumns = `repeat(${config.columns || 3}, minmax(0, 1fr))`;

    const render = () => {
      grid.innerHTML = '';
      order.forEach((pieceIndex, idx) => {
        const piece = config.pieces[pieceIndex];
        const btn = createKidTile(piece, '', 'puzzle-piece');
        if (selected === idx) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
          api.audio.playSfx('tap');
          if (selected === null) {
            selected = idx;
            render();
            return;
          }
          if (selected === idx) {
            selected = null;
            render();
            return;
          }
          [order[selected], order[idx]] = [order[idx], order[selected]];
          selected = null;
          render();
          const solved = order.every((value, index) => value === index);
          if (solved) {
            status.set(lang === 'en' ? 'Puzzle done! 🥳' : 'Пазл готов! 🥳');
            rewardAndFinish(api);
          }
        });

        grid.appendChild(btn);
      });
    };

    root.appendChild(grid);
    status.set(lang === 'en' ? 'Tap 2 tiles' : 'Нажми 2 плитки');
    render();
    return () => {};
  });
}

export function createBreathingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🌬️', lang === 'en' ? 'Breathe with balloon' : 'Дыши вместе с шариком');

    const bubble = document.createElement('div');
    bubble.className = 'breath-balloon';

    const status = statusLabel(root);
    api.setStatus = status.set;

    const total = api.difficulty === 'normal' ? (config.cyclesNormal || 5) : (config.cyclesEasy || 3);
    const tracker = dotProgress(root, total);
    let cycle = 0;
    let inhale = true;

    const action = createKidTile('🌬️', lang === 'en' ? 'Breathe' : 'Дышим', 'btn btn-primary breathe-btn');

    action.addEventListener('click', () => {
      api.audio.playSfx('tap');
      bubble.classList.toggle('inhale', inhale);
      bubble.classList.toggle('exhale', !inhale);

      if (!inhale) {
        cycle += 1;
        tracker.set(cycle);
      }

      inhale = !inhale;
      action.querySelector('.kid-icon').textContent = inhale ? '🌬️' : '💨';
      if (cycle >= total) {
        status.set(lang === 'en' ? 'Calm 🌈' : 'Спокойно 🌈');
        rewardAndFinish(api);
      }
    });

    root.append(bubble, action);
    status.set(lang === 'en' ? 'Tap slowly' : 'Нажимай медленно');
    return () => {};
  });
}

export function createDragSortEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🧺', lang === 'en' ? 'Drag to basket' : 'Перетащи в корзину');

    const status = statusLabel(root);
    api.setStatus = status.set;
    const tracker = dotProgress(root, config.items.length);

    const board = document.createElement('div');
    board.className = 'drag-board';

    const baskets = document.createElement('div');
    baskets.className = 'drag-baskets';

    const basketMap = new Map();
    config.categories.forEach((category) => {
      const zone = document.createElement('div');
      zone.className = 'drop-zone';
      zone.style.borderColor = category.color;
      zone.dataset.category = category.id;

      const icon = document.createElement('span');
      icon.className = 'drop-zone-icon';
      icon.textContent = visualIcon(lang, category);

      const title = document.createElement('strong');
      title.textContent = visualLabel(lang, category);
      zone.append(icon, title);

      basketMap.set(category.id, zone);
      baskets.appendChild(zone);
    });

    const pool = document.createElement('div');
    pool.className = 'drag-pool';

    let done = 0;
    const teardown = [];

    config.items.forEach((item) => {
      const chip = createKidTile(
        visualIcon(lang, item),
        visualLabel(lang, item),
        'drag-item',
      );
      chip.dataset.category = item.category;
      pool.appendChild(chip);

      const removeDrag = makeDraggable(chip, {
        onEnd: ({ event }) => {
          const x = event.clientX;
          const y = event.clientY;
          let dropped = false;
          basketMap.forEach((zone, categoryId) => {
            if (dropped) {
              return;
            }
            const rect = zone.getBoundingClientRect();
            if (!rectContains(rect, x, y)) {
              return;
            }
            if (categoryId === item.category) {
              dropped = true;
              chip.style.transform = 'none';
              chip.dataset.tx = '0';
              chip.dataset.ty = '0';
              chip.disabled = true;
              chip.classList.add('placed');
              zone.appendChild(chip);
              done += 1;
              tracker.set(done);
              api.audio.playSfx('tap');
              if (done >= config.items.length) {
                status.set(lang === 'en' ? 'Great sorting! 🌟' : 'Отлично! 🌟');
                rewardAndFinish(api);
              }
            }
          });

          if (!dropped) {
            chip.style.transform = 'translate(0px, 0px)';
            chip.dataset.tx = '0';
            chip.dataset.ty = '0';
            failSoft(api);
          }
        },
      });

      teardown.push(removeDrag);
    });

    board.append(baskets, pool);
    root.appendChild(board);
    status.set(lang === 'en' ? 'Drag icons' : 'Тяни иконки');

    return () => {
      teardown.forEach((fn) => fn());
    };
  });
}

export function createMatchingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🧩', lang === 'en' ? 'Find pairs' : 'Найди пары');

    const status = statusLabel(root);
    api.setStatus = status.set;
    const tracker = dotProgress(root, config.pairs.length);

    const leftWrap = document.createElement('div');
    leftWrap.className = 'match-col';
    const rightWrap = document.createElement('div');
    rightWrap.className = 'match-col';
    const layout = document.createElement('div');
    layout.className = 'match-layout';

    const leftItems = config.pairs.map((pair) => pair.left);
    const rightItems = shuffle(config.pairs.map((pair) => pair.right));

    const map = new Map(config.pairs.map((pair) => [pair.left.id, pair.right.id]));
    let selectedLeft = null;
    let selectedLeftButton = null;
    let done = 0;

    leftItems.forEach((item) => {
      const btn = createKidTile(
        visualIcon(lang, item),
        visualLabel(lang, item),
        'match-btn',
      );
      btn.addEventListener('click', () => {
        api.audio.playSfx('tap');
        selectedLeft = item.id;
        if (selectedLeftButton) {
          selectedLeftButton.classList.remove('selected');
        }
        selectedLeftButton = btn;
        btn.classList.add('selected');
      });
      leftWrap.appendChild(btn);
    });

    rightItems.forEach((item) => {
      const btn = createKidTile(
        visualIcon(lang, item),
        visualLabel(lang, item),
        'match-btn',
      );
      btn.addEventListener('click', () => {
        if (!selectedLeft) {
          failSoft(api);
          return;
        }
        api.audio.playSfx('tap');
        if (map.get(selectedLeft) === item.id) {
          btn.disabled = true;
          btn.classList.add('correct');
          if (selectedLeftButton) {
            selectedLeftButton.disabled = true;
            selectedLeftButton.classList.add('correct');
            selectedLeftButton.classList.remove('selected');
          }
          selectedLeft = null;
          selectedLeftButton = null;
          done += 1;
          tracker.set(done);
          if (done >= config.pairs.length) {
            status.set(lang === 'en' ? 'Pairs done! 🥳' : 'Пары готовы! 🥳');
            rewardAndFinish(api);
          }
        } else {
          failSoft(api);
        }
      });
      rightWrap.appendChild(btn);
    });

    layout.append(leftWrap, rightWrap);
    root.appendChild(layout);
    status.set(lang === 'en' ? 'Left then right' : 'Слева, потом справа');

    return () => {};
  });
}

export function createTrafficEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🚦', lang === 'en' ? 'Go only on green' : 'Иди только на зелёный');

    const light = document.createElement('div');
    light.className = 'traffic-light';

    const nodes = ['red', 'yellow', 'green'].map((color) => {
      const node = document.createElement('div');
      node.className = `traffic-node ${color}`;
      light.appendChild(node);
      return node;
    });

    const status = statusLabel(root);
    api.setStatus = status.set;
    const goal = api.difficulty === 'normal' ? 4 : 3;
    const tracker = dotProgress(root, goal);

    const button = createKidTile('🚶', lang === 'en' ? 'Cross' : 'Переход', 'btn btn-primary traffic-btn');

    let phase = 0;
    let crossed = 0;

    function updateLight() {
      nodes.forEach((node, index) => {
        node.classList.toggle('active', index === phase);
      });
    }

    updateLight();
    const timer = setInterval(() => {
      phase = (phase + 1) % 3;
      updateLight();
    }, 1350);

    button.addEventListener('click', () => {
      api.audio.playSfx('tap');
      if (phase === 2) {
        crossed += 1;
        tracker.set(crossed);
        if (crossed >= goal) {
          status.set(lang === 'en' ? 'Safe! 🌟' : 'Безопасно! 🌟');
          rewardAndFinish(api);
        }
      } else {
        failSoft(api);
      }
    });

    root.append(light, button);
    status.set(lang === 'en' ? 'Wait green' : 'Жди зелёный');

    return () => {
      clearInterval(timer);
    };
  });
}

export function createTurnTakingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);
    hintRow(root, '🧍', lang === 'en' ? 'Whose turn now?' : 'Чья очередь?');

    const status = statusLabel(root);
    api.setStatus = status.set;
    const tracker = dotProgress(root, config.queue.length);

    const queueStrip = document.createElement('div');
    queueStrip.className = 'queue-strip';
    config.queue.forEach((item) => {
      const token = document.createElement('span');
      token.className = 'queue-token';
      token.textContent = visualIcon(lang, item);
      queueStrip.appendChild(token);
    });

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'choice-grid';
    root.append(queueStrip, optionsWrap);

    let step = 0;

    function renderRound() {
      const current = config.queue[step];
      queueStrip.querySelectorAll('.queue-token').forEach((node, index) => {
        node.classList.toggle('active', index === step);
      });

      optionsWrap.innerHTML = '';
      const options = shuffle(config.queue.slice(0, Math.min(3, config.queue.length)));
      options.forEach((option) => {
        const btn = createKidTile(
          visualIcon(lang, option),
          visualLabel(lang, option),
          'choice-btn',
        );
        btn.addEventListener('click', () => {
          api.audio.playSfx('tap');
          if (option.id === current.id) {
            step += 1;
            tracker.set(step);
            if (step >= config.queue.length) {
              status.set(lang === 'en' ? 'Fair play! 🥳' : 'Честно! 🥳');
              rewardAndFinish(api);
              return;
            }
            renderRound();
            return;
          }
          failSoft(api);
        });
        optionsWrap.appendChild(btn);
      });
    }

    status.set(lang === 'en' ? 'Tap friend' : 'Нажми друга');
    renderRound();

    return () => {};
  });
}

export function createTapCountEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, meta, api);

    const areaIcon = config.icon || iconForToken(config.buttonRu || config.buttonEn || meta.id);
    hintRow(root, areaIcon, lang === 'en' ? 'Tap gently' : 'Нажимай спокойно');

    const area = createKidTile(
      areaIcon,
      lang === 'en' ? 'Tap tap' : 'Тук-тук',
      'tap-area',
    );

    const goal = api.difficulty === 'normal' ? (config.goalNormal || 8) : (config.goalEasy || 5);
    const tracker = dotProgress(root, goal);
    let value = 0;

    const status = statusLabel(root);
    api.setStatus = status.set;
    status.set(lang === 'en' ? 'Start 🌟' : 'Начали 🌟');

    area.addEventListener('click', () => {
      api.audio.playSfx('tap');
      value += 1;
      tracker.set(value);
      area.style.setProperty('--pulse', `${1 + Math.min(0.2, value / goal / 2)}`);
      if (value >= goal) {
        status.set(lang === 'en' ? 'Nice rhythm! 🥳' : 'Отличный ритм! 🥳');
        rewardAndFinish(api);
      }
    });

    root.appendChild(area);
    return () => {};
  });
}
