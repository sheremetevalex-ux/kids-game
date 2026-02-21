import { shuffle } from '../../data.js';
import { createButton } from '../../ui.js';
import { makeDraggable, rectContains } from '../../engine/input.js';

function langFromApp(app) {
  return app.state.getState().settings.language === 'en' ? 'en' : 'ru';
}

function pickText(lang, ru, en) {
  return lang === 'en' ? en : ru;
}

function header(root, title) {
  const h2 = document.createElement('h2');
  h2.className = 'episode-title';
  h2.textContent = title;
  root.appendChild(h2);
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

function rewardAndFinish(api) {
  api.audio.playSfx('success');
  api.particles.spawnStars(window.innerWidth * 0.5, window.innerHeight * 0.34, 10);
  setTimeout(() => api.finish(), 650);
}

function failSoft(api, ruText, enText) {
  api.audio.playSfx('error');
  if (typeof api.setStatus === 'function') {
    api.setStatus(pickText(api.lang, ruText, enText));
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
    header(root, pickText(api.lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(api.lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const status = statusLabel(root);
    api.setStatus = status.set;

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'choice-grid';

    config.options.forEach((option) => {
      const button = createButton(pickText(api.lang, option.ru, option.en), 'choice-btn');
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (option.kind === 'good') {
          status.set(pickText(api.lang, option.okRu, option.okEn));
          rewardAndFinish(api);
          return;
        }
        status.set(pickText(api.lang, option.okRu, option.okEn));
      });
      optionsWrap.appendChild(button);
    });

    root.appendChild(optionsWrap);

    status.set(pickText(api.lang, 'Выбери добрый вариант.', 'Choose the kind option.'));
    return () => {};
  });
}

export function createFindEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const found = new Set();
    const status = statusLabel(root);
    api.setStatus = status.set;

    const checklist = document.createElement('div');
    checklist.className = 'checklist';
    const targetMap = new Map();
    config.targets.forEach((target) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = pickText(lang, target.ru, target.en);
      checklist.appendChild(chip);
      targetMap.set(target.id, chip);
    });
    root.appendChild(checklist);

    const buttons = shuffle([...config.targets, ...config.distractors]);
    const grid = document.createElement('div');
    grid.className = 'find-grid';

    buttons.forEach((item) => {
      const button = createButton(pickText(lang, item.ru, item.en), 'find-item');
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (targetMap.has(item.id)) {
          if (!found.has(item.id)) {
            found.add(item.id);
            targetMap.get(item.id).classList.add('done');
            button.classList.add('correct');
          }
          status.set(`${found.size}/${config.targets.length}`);
          if (found.size >= config.targets.length) {
            status.set(pickText(lang, 'Все найдено!', 'All found!'));
            rewardAndFinish(api);
          }
          return;
        }
        failSoft(api, config.failRu || 'Это не то. Попробуй ещё.', config.failEn || 'Not this one. Try again.');
      });
      grid.appendChild(button);
    });

    root.appendChild(grid);
    status.set(pickText(lang, 'Найди предметы из списка.', 'Find all target items.'));
    return () => {};
  });
}

export function createSequenceEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    let step = 0;
    const status = statusLabel(root);
    api.setStatus = status.set;

    const shuffled = shuffle(config.steps.map((stepConfig, idx) => ({ ...stepConfig, idx })));
    const wrap = document.createElement('div');
    wrap.className = 'sequence-wrap';

    shuffled.forEach((entry) => {
      const button = createButton(pickText(lang, entry.ru, entry.en), 'sequence-btn');
      button.addEventListener('click', () => {
        api.audio.playSfx('tap');
        if (entry.idx === step) {
          button.classList.add('correct');
          button.disabled = true;
          step += 1;
          status.set(`${step}/${config.steps.length}`);
          if (step >= config.steps.length) {
            status.set(pickText(lang, 'Отличный порядок!', 'Great order!'));
            rewardAndFinish(api);
          }
        } else {
          failSoft(api, config.failRu || 'Почти! Начнём сначала.', config.failEn || 'Almost! Start again.');
          step = 0;
          wrap.querySelectorAll('button').forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove('correct');
          });
          status.set('0/' + config.steps.length);
        }
      });
      wrap.appendChild(button);
    });

    root.appendChild(wrap);
    status.set('0/' + config.steps.length);
    return () => {};
  });
}

export function createPuzzleEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

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
        const btn = createButton(piece, 'puzzle-piece');
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
            status.set(pickText(lang, 'Собрано!', 'Puzzle complete!'));
            rewardAndFinish(api);
          }
        });

        grid.appendChild(btn);
      });
    };

    root.appendChild(grid);
    status.set(pickText(lang, 'Нажми две плитки, чтобы поменять местами.', 'Tap two tiles to swap.'));
    render();
    return () => {};
  });
}

export function createBreathingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const bubble = document.createElement('div');
    bubble.className = 'breath-balloon';

    const status = statusLabel(root);
    api.setStatus = status.set;

    const total = api.difficulty === 'normal' ? (config.cyclesNormal || 5) : (config.cyclesEasy || 3);
    let cycle = 0;
    let inhale = true;

    const action = createButton(pickText(lang, 'Вдох', 'Inhale'), 'btn btn-primary');

    action.addEventListener('click', () => {
      api.audio.playSfx('tap');
      bubble.classList.toggle('inhale', inhale);
      bubble.classList.toggle('exhale', !inhale);

      if (!inhale) {
        cycle += 1;
      }

      inhale = !inhale;
      action.textContent = inhale ? pickText(lang, 'Вдох', 'Inhale') : pickText(lang, 'Выдох', 'Exhale');
      status.set(`${cycle}/${total}`);

      if (cycle >= total) {
        status.set(pickText(lang, 'Тихо и спокойно.', 'Calm and steady.'));
        rewardAndFinish(api);
      }
    });

    root.append(bubble, action);
    status.set('0/' + total);
    return () => {};
  });
}

export function createDragSortEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const status = statusLabel(root);
    api.setStatus = status.set;

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

      const title = document.createElement('strong');
      title.textContent = pickText(lang, category.ru, category.en);
      zone.appendChild(title);

      basketMap.set(category.id, zone);
      baskets.appendChild(zone);
    });

    const pool = document.createElement('div');
    pool.className = 'drag-pool';

    let done = 0;
    const teardown = [];

    config.items.forEach((item) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'drag-item';
      chip.textContent = pickText(lang, item.ru, item.en);
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
              api.audio.playSfx('tap');
              status.set(`${done}/${config.items.length}`);
              if (done >= config.items.length) {
                status.set(pickText(lang, 'Всё по местам!', 'Everything sorted!'));
                rewardAndFinish(api);
              }
            }
          });

          if (!dropped) {
            chip.style.transform = 'translate(0px, 0px)';
            chip.dataset.tx = '0';
            chip.dataset.ty = '0';
            failSoft(api, config.failRu || 'Нужна другая корзина.', config.failEn || 'Try another basket.');
          }
        },
      });

      teardown.push(removeDrag);
    });

    board.append(baskets, pool);
    root.appendChild(board);
    status.set('0/' + config.items.length);

    return () => {
      teardown.forEach((fn) => fn());
    };
  });
}

export function createMatchingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const status = statusLabel(root);
    api.setStatus = status.set;

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

    const rightButtons = new Map();

    leftItems.forEach((item) => {
      const btn = createButton(pickText(lang, item.ru, item.en), 'match-btn');
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
      const btn = createButton(pickText(lang, item.ru, item.en), 'match-btn');
      rightButtons.set(item.id, btn);
      btn.addEventListener('click', () => {
        if (!selectedLeft) {
          failSoft(api, 'Сначала выбери слева.', 'Pick left side first.');
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
          status.set(`${done}/${config.pairs.length}`);
          if (done >= config.pairs.length) {
            status.set(pickText(lang, 'Пары готовы!', 'Pairs complete!'));
            rewardAndFinish(api);
          }
        } else {
          failSoft(api, config.failRu || 'Это другая пара.', config.failEn || 'That pair is different.');
        }
      });
      rightWrap.appendChild(btn);
    });

    layout.append(leftWrap, rightWrap);
    root.appendChild(layout);
    status.set('0/' + config.pairs.length);

    return () => {};
  });
}

export function createTrafficEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

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
    const button = createButton(pickText(lang, 'Переходить', 'Cross now'), 'btn btn-primary');

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
    }, 1400);

    const goal = api.difficulty === 'normal' ? 4 : 3;
    status.set('0/' + goal);

    button.addEventListener('click', () => {
      api.audio.playSfx('tap');
      if (phase === 2) {
        crossed += 1;
        status.set(`${crossed}/${goal}`);
        if (crossed >= goal) {
          status.set(pickText(lang, 'Переход безопасный!', 'Safe crossing!'));
          rewardAndFinish(api);
        }
      } else {
        failSoft(api, config.failRu || 'Подожди зелёный.', config.failEn || 'Wait for green.');
      }
    });

    root.append(light, button);

    return () => {
      clearInterval(timer);
    };
  });
}

export function createTurnTakingEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    root.appendChild(prompt);

    const status = statusLabel(root);
    api.setStatus = status.set;
    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'choice-grid';
    root.appendChild(optionsWrap);

    let step = 0;

    function renderRound() {
      const current = config.queue[step];
      prompt.textContent = pickText(
        lang,
        `Кто идёт сейчас? Очередь: ${config.queue.map((item) => item.ru).join(' → ')}`,
        `Who goes now? Queue: ${config.queue.map((item) => item.en).join(' -> ')}`,
      );

      optionsWrap.innerHTML = '';
      const options = shuffle(config.queue.slice(0, Math.min(3, config.queue.length)));
      options.forEach((option) => {
        const btn = createButton(pickText(lang, option.ru, option.en), 'choice-btn');
        btn.addEventListener('click', () => {
          api.audio.playSfx('tap');
          if (option.id === current.id) {
            step += 1;
            status.set(`${step}/${config.queue.length}`);
            if (step >= config.queue.length) {
              rewardAndFinish(api);
              return;
            }
            renderRound();
            return;
          }
          failSoft(api, config.failRu || 'Сейчас другая очередь.', config.failEn || 'Now it is another turn.');
        });
        optionsWrap.appendChild(btn);
      });
    }

    status.set('0/' + config.queue.length);
    renderRound();

    return () => {};
  });
}

export function createTapCountEpisode(meta, config) {
  return makeEpisode(meta, (root, api) => {
    const lang = api.lang;
    header(root, pickText(lang, meta.titleRu, meta.titleEn));

    const prompt = document.createElement('p');
    prompt.className = 'episode-prompt';
    prompt.textContent = pickText(lang, config.promptRu, config.promptEn);
    root.appendChild(prompt);

    const area = document.createElement('button');
    area.type = 'button';
    area.className = 'tap-area';
    area.textContent = pickText(lang, config.buttonRu || 'Нажимай', config.buttonEn || 'Tap');

    const goal = api.difficulty === 'normal' ? (config.goalNormal || 8) : (config.goalEasy || 5);
    let value = 0;

    const status = statusLabel(root);
    api.setStatus = status.set;
    status.set('0/' + goal);

    area.addEventListener('click', () => {
      api.audio.playSfx('tap');
      value += 1;
      status.set(`${value}/${goal}`);
      area.style.setProperty('--pulse', `${1 + Math.min(0.2, value / goal / 2)}`);
      if (value >= goal) {
        rewardAndFinish(api);
      }
    });

    root.appendChild(area);
    return () => {};
  });
}
