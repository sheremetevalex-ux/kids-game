const app = document.getElementById('app');
const hint = document.getElementById('hint');
const homeBtn = document.getElementById('home-btn');
const musicBtn = document.getElementById('music-btn');

const STORE_KEY = 'playtime-v3';

const FRUITS = [
  { id: 'strawberry', emoji: '🍓', color: '#f05a79' },
  { id: 'banana', emoji: '🍌', color: '#f4d14f' },
  { id: 'orange', emoji: '🍊', color: '#ff9b45' },
  { id: 'kiwi', emoji: '🥝', color: '#7fc866' },
  { id: 'blueberry', emoji: '🫐', color: '#5d79d8' },
  { id: 'apple', emoji: '🍎', color: '#ea5b55' },
];

const PALETTE = ['#5bb8ff', '#ff8ea1', '#ffd86f', '#7ddc8b', '#b79dff', '#f9a45c', '#88e4f7', '#ffffff'];

const DEFAULT_STATE = {
  scene: 'home',
  audioOn: true,
  selectedColor: PALETTE[0],
  character: 'bluey',
  coloring: {
    bluey: {
      body: '#7db6e2',
      earL: '#3f3f71',
      earR: '#3f3f71',
      face: '#e9cc7e',
      belly: '#abd1ea',
      armL: '#7db6e2',
      armR: '#7db6e2',
      legL: '#7db6e2',
      legR: '#7db6e2',
      spot1: '#3f3f71',
      spot2: '#3f3f71',
    },
    bingo: {
      body: '#ef9f56',
      earL: '#c96f2e',
      earR: '#c96f2e',
      face: '#efe5bf',
      belly: '#e8e2c3',
      armL: '#efab66',
      armR: '#efab66',
      legL: '#e89a5a',
      legR: '#e89a5a',
      spot1: '#d6803f',
      spot2: '#d6803f',
    },
  },
  backyard: {
    orangesDropped: [false, false, false],
    faucetOn: false,
    bucket: 0,
    meatOnGrill: false,
    cooked: 0,
    meatPos: { x: 36, y: 286 },
  },
  smoothie: {
    fruits: [],
    smoothieColor: '#f2e5c7',
    ready: false,
  },
};

function clone(value) {
  return structuredClone(value);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      return clone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
    return {
      ...clone(DEFAULT_STATE),
      ...parsed,
      coloring: {
        ...clone(DEFAULT_STATE).coloring,
        ...(parsed.coloring || {}),
      },
      backyard: {
        ...clone(DEFAULT_STATE).backyard,
        ...(parsed.backyard || {}),
      },
      smoothie: {
        ...clone(DEFAULT_STATE).smoothie,
        ...(parsed.smoothie || {}),
      },
    };
  } catch {
    return clone(DEFAULT_STATE);
  }
}

const state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
}

function setHint(content) {
  hint.textContent = content;
}

const bgMusic = new Audio('./assets/audio/bg-loop.wav');
bgMusic.loop = true;
bgMusic.volume = 0.34;
bgMusic.preload = 'auto';

let audioUnlocked = false;
let tapAudioCtx = null;
let sceneCleanup = () => {};

function ensureTapAudio() {
  if (tapAudioCtx) {
    return tapAudioCtx;
  }
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) {
    return null;
  }
  tapAudioCtx = new Ctx();
  return tapAudioCtx;
}

function tapSfx(freq = 640, duration = 0.08) {
  if (!state.audioOn) {
    return;
  }
  const ctx = ensureTapAudio();
  if (!ctx || ctx.state !== 'running') {
    return;
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.value = 0.001;
  gain.gain.exponentialRampToValueAtTime(0.13, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

async function unlockAudioOnce() {
  if (audioUnlocked) {
    return;
  }
  audioUnlocked = true;

  const ctx = ensureTapAudio();
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      // ignore
    }
  }

  if (state.audioOn) {
    try {
      await bgMusic.play();
    } catch {
      // iOS may need another tap, keep trying on next interaction
      audioUnlocked = false;
    }
  }
}

function updateMusicButton() {
  musicBtn.textContent = state.audioOn ? '🔊' : '🔇';
}

function colorSvg(character, fills) {
  if (character === 'bingo') {
    return `
<svg viewBox="0 0 580 760" aria-label="Bingo coloring">
  <rect x="180" y="120" width="220" height="370" rx="105" fill="${fills.body}" stroke="#84512d" stroke-width="6" class="paintable" data-region="body" />
  <ellipse cx="220" cy="182" rx="42" ry="120" fill="${fills.earL}" stroke="#84512d" stroke-width="6" class="paintable" data-region="earL" />
  <ellipse cx="360" cy="182" rx="42" ry="120" fill="${fills.earR}" stroke="#84512d" stroke-width="6" class="paintable" data-region="earR" />
  <ellipse cx="290" cy="240" rx="74" ry="95" fill="#ffffff" stroke="#2d2d34" stroke-width="5" />
  <ellipse cx="290" cy="258" rx="58" ry="70" fill="${fills.face}" stroke="#cfb889" stroke-width="4" class="paintable" data-region="face" />
  <ellipse cx="290" cy="396" rx="85" ry="105" fill="${fills.belly}" stroke="#d5ca9d" stroke-width="4" class="paintable" data-region="belly" />

  <rect x="132" y="330" width="92" height="34" rx="17" transform="rotate(-34 132 330)" fill="${fills.armL}" stroke="#b67649" stroke-width="5" class="paintable" data-region="armL" />
  <rect x="355" y="320" width="92" height="34" rx="17" transform="rotate(36 355 320)" fill="${fills.armR}" stroke="#b67649" stroke-width="5" class="paintable" data-region="armR" />
  <rect x="208" y="470" width="66" height="185" rx="33" fill="${fills.legL}" stroke="#b67649" stroke-width="5" class="paintable" data-region="legL" />
  <rect x="308" y="470" width="66" height="185" rx="33" fill="${fills.legR}" stroke="#b67649" stroke-width="5" class="paintable" data-region="legR" />

  <ellipse cx="240" cy="666" rx="48" ry="38" fill="#ece5c6" stroke="#c2b98b" stroke-width="5" />
  <ellipse cx="340" cy="666" rx="48" ry="38" fill="#ece5c6" stroke="#c2b98b" stroke-width="5" />

  <ellipse cx="332" cy="234" rx="14" ry="26" fill="#1f1f25" />
  <ellipse cx="248" cy="240" rx="14" ry="26" fill="#1f1f25" />
  <ellipse cx="290" cy="275" rx="30" ry="24" fill="#4a2f25" stroke="#2f1e19" stroke-width="5" />

  <ellipse cx="220" cy="560" rx="24" ry="34" fill="${fills.spot1}" stroke="#b67649" stroke-width="4" class="paintable" data-region="spot1" />
  <ellipse cx="358" cy="560" rx="24" ry="34" fill="${fills.spot2}" stroke="#b67649" stroke-width="4" class="paintable" data-region="spot2" />
</svg>`;
  }

  return `
<svg viewBox="0 0 580 760" aria-label="Bluey coloring">
  <rect x="170" y="120" width="240" height="370" rx="112" fill="${fills.body}" stroke="#3d4d73" stroke-width="6" class="paintable" data-region="body" />
  <ellipse cx="212" cy="184" rx="44" ry="120" fill="${fills.earL}" stroke="#2e3550" stroke-width="6" class="paintable" data-region="earL" />
  <ellipse cx="368" cy="184" rx="44" ry="120" fill="${fills.earR}" stroke="#2e3550" stroke-width="6" class="paintable" data-region="earR" />
  <ellipse cx="290" cy="232" rx="78" ry="96" fill="#ffffff" stroke="#2d2d34" stroke-width="5" />
  <path d="M234 210 C262 186 333 188 350 212 C348 294 308 320 244 316 C223 293 220 239 234 210 Z" fill="${fills.face}" stroke="#d0b979" stroke-width="4" class="paintable" data-region="face" />
  <ellipse cx="290" cy="398" rx="94" ry="112" fill="${fills.belly}" stroke="#99bdd9" stroke-width="4" class="paintable" data-region="belly" />

  <rect x="122" y="330" width="100" height="36" rx="18" transform="rotate(-34 122 330)" fill="${fills.armL}" stroke="#6598c3" stroke-width="5" class="paintable" data-region="armL" />
  <rect x="360" y="318" width="100" height="36" rx="18" transform="rotate(36 360 318)" fill="${fills.armR}" stroke="#6598c3" stroke-width="5" class="paintable" data-region="armR" />
  <rect x="206" y="470" width="70" height="185" rx="34" fill="${fills.legL}" stroke="#6598c3" stroke-width="5" class="paintable" data-region="legL" />
  <rect x="304" y="470" width="70" height="185" rx="34" fill="${fills.legR}" stroke="#6598c3" stroke-width="5" class="paintable" data-region="legR" />

  <ellipse cx="240" cy="668" rx="50" ry="40" fill="#afd5f1" stroke="#88b3d8" stroke-width="5" />
  <ellipse cx="338" cy="668" rx="50" ry="40" fill="#afd5f1" stroke="#88b3d8" stroke-width="5" />

  <ellipse cx="332" cy="233" rx="14" ry="26" fill="#1f1f25" />
  <ellipse cx="248" cy="240" rx="14" ry="26" fill="#1f1f25" />
  <ellipse cx="290" cy="270" rx="30" ry="24" fill="#2e2f47" stroke="#17171f" stroke-width="5" />

  <ellipse cx="216" cy="560" rx="20" ry="32" fill="${fills.spot1}" stroke="#2e3550" stroke-width="4" class="paintable" data-region="spot1" />
  <ellipse cx="364" cy="560" rx="20" ry="32" fill="${fills.spot2}" stroke="#2e3550" stroke-width="4" class="paintable" data-region="spot2" />
</svg>`;
}

function rgbFromHex(hex) {
  const value = hex.replace('#', '');
  const n = parseInt(value, 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function hexFromRgb(r, g, b) {
  const c = (x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function overlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function renderHomeScene() {
  app.innerHTML = `
    <section class="screen home-screen">
      <div class="hero-row">
        <div class="hero-card"><img src="./assets/svg/bluey.svg" alt="Bluey" /></div>
        <div class="hero-card"><img src="./assets/svg/bingo.svg" alt="Bingo" /></div>
      </div>
      <div class="menu-grid">
        <button class="menu-tile" data-open="color" aria-label="Coloring"><span class="menu-icon">🎨</span><span class="menu-dot"></span></button>
        <button class="menu-tile" data-open="yard" aria-label="Backyard"><span class="menu-icon">🍊🔥💧</span><span class="menu-dot"></span></button>
        <button class="menu-tile" data-open="smoothie" aria-label="Smoothie"><span class="menu-icon">🍓🌀🥤</span><span class="menu-dot"></span></button>
      </div>
    </section>
  `;

  app.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudioOnce();
      tapSfx();
      state.scene = btn.dataset.open;
      saveState();
      render();
    });
  });

  setHint('👇 🎨  🍊🔥💧  🍓🌀🥤');
}

function renderColorScene() {
  const character = state.character;
  const fills = state.coloring[character];

  app.innerHTML = `
    <section class="screen">
      <div class="scene-top">
        <div class="scene-chip">🎨</div>
        <div class="character-switch">
          <button class="character-btn ${character === 'bluey' ? 'active' : ''}" data-char="bluey"><img src="./assets/svg/bluey.svg" alt="bluey"/></button>
          <button class="character-btn ${character === 'bingo' ? 'active' : ''}" data-char="bingo"><img src="./assets/svg/bingo.svg" alt="bingo"/></button>
        </div>
        <div class="scene-chip">🖌️</div>
      </div>

      <div class="scene-work">
        <div class="paint-canvas">${colorSvg(character, fills)}</div>
      </div>

      <div class="palette">
        ${PALETTE.map((color) => `<button class="color-btn ${state.selectedColor === color ? 'active' : ''}" data-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join('')}
      </div>
    </section>
  `;

  app.querySelectorAll('[data-char]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudioOnce();
      tapSfx(540, 0.07);
      state.character = btn.dataset.char;
      saveState();
      render();
    });
  });

  app.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudioOnce();
      tapSfx(720, 0.07);
      state.selectedColor = btn.dataset.color;
      saveState();
      render();
    });
  });

  app.querySelectorAll('.paintable').forEach((region) => {
    region.addEventListener('click', () => {
      unlockAudioOnce();
      tapSfx(780, 0.08);
      const key = region.dataset.region;
      state.coloring[state.character][key] = state.selectedColor;
      saveState();
      renderColorScene();
    });
  });

  setHint('🎨 👉 🐶');
}

function renderYardScene() {
  const backyard = state.backyard;
  let waterTimer = null;
  let cookTimer = null;

  const meatColor = (() => {
    const t = backyard.cooked;
    const raw = [216, 100, 92];
    const done = [128, 82, 52];
    return hexFromRgb(
      raw[0] + (done[0] - raw[0]) * t,
      raw[1] + (done[1] - raw[1]) * t,
      raw[2] + (done[2] - raw[2]) * t,
    );
  })();

  app.innerHTML = `
    <section class="screen">
      <div class="scene-top">
        <div class="scene-chip">🌳</div>
        <div class="scene-chip">🍊🔥💧</div>
        <div class="scene-chip">🧪</div>
      </div>
      <div class="scene-work backyard" id="yard-area">
        <div class="sun"></div>

        <div class="tree">
          <div class="tree-top"></div>
          <div class="tree-trunk"></div>
          <button class="orange ${backyard.orangesDropped[0] ? 'falling' : ''}" data-orange="0" style="left:24px;top:26px;${backyard.orangesDropped[0] ? 'display:none;' : ''}"></button>
          <button class="orange ${backyard.orangesDropped[1] ? 'falling' : ''}" data-orange="1" style="left:72px;top:54px;${backyard.orangesDropped[1] ? 'display:none;' : ''}"></button>
          <button class="orange ${backyard.orangesDropped[2] ? 'falling' : ''}" data-orange="2" style="left:120px;top:24px;${backyard.orangesDropped[2] ? 'display:none;' : ''}"></button>
        </div>

        <div class="faucet-wrap">
          <button class="faucet-btn" id="faucet-btn">🚰</button>
          <div class="water-stream ${backyard.faucetOn ? 'on' : ''}"></div>
          <div class="bucket"><div class="bucket-fill" style="height:${backyard.bucket}%;"></div></div>
        </div>

        <div class="bbq" id="bbq-zone">
          <div class="bbq-top"></div>
          <div class="bbq-lines"></div>
          <div class="smoke ${backyard.meatOnGrill ? 'on' : ''}"></div>
        </div>

        <button id="meat" class="meat" style="left:${backyard.meatOnGrill ? 440 : backyard.meatPos.x}px;top:${backyard.meatOnGrill ? 328 : backyard.meatPos.y}px;background:${meatColor};"></button>
      </div>
    </section>
  `;

  const yardArea = document.getElementById('yard-area');
  const bbqZone = document.getElementById('bbq-zone');
  const meat = document.getElementById('meat');
  const faucetBtn = document.getElementById('faucet-btn');

  app.querySelectorAll('[data-orange]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudioOnce();
      tapSfx(840, 0.1);
      const i = Number(btn.dataset.orange);
      if (state.backyard.orangesDropped[i]) {
        return;
      }
      state.backyard.orangesDropped[i] = true;
      saveState();
      renderYardScene();
    });
  });

  faucetBtn.addEventListener('click', () => {
    unlockAudioOnce();
    tapSfx(540, 0.09);
    state.backyard.faucetOn = !state.backyard.faucetOn;
    saveState();
    renderYardScene();
  });

  if (state.backyard.faucetOn && state.backyard.bucket < 100) {
    waterTimer = setInterval(() => {
      state.backyard.bucket = Math.min(100, state.backyard.bucket + 2.2);
      const fill = app.querySelector('.bucket-fill');
      if (fill) {
        fill.style.height = `${state.backyard.bucket}%`;
      }
      saveState();
      if (state.backyard.bucket >= 100) {
        clearInterval(waterTimer);
      }
    }, 120);
  }

  if (state.backyard.meatOnGrill && state.backyard.cooked < 1) {
    cookTimer = setInterval(() => {
      state.backyard.cooked = Math.min(1, state.backyard.cooked + 0.03);
      const el = document.getElementById('meat');
      if (el) {
        const raw = [216, 100, 92];
        const done = [128, 82, 52];
        const t = state.backyard.cooked;
        el.style.background = hexFromRgb(
          raw[0] + (done[0] - raw[0]) * t,
          raw[1] + (done[1] - raw[1]) * t,
          raw[2] + (done[2] - raw[2]) * t,
        );
      }
      saveState();
      if (state.backyard.cooked >= 1) {
        clearInterval(cookTimer);
      }
    }, 180);
  }

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMove = (event) => {
    if (!dragging || state.backyard.meatOnGrill) {
      return;
    }
    const areaRect = yardArea.getBoundingClientRect();
    const x = event.clientX - areaRect.left - offsetX;
    const y = event.clientY - areaRect.top - offsetY;
    const nx = Math.max(0, Math.min(areaRect.width - meat.offsetWidth, x));
    const ny = Math.max(0, Math.min(areaRect.height - meat.offsetHeight, y));
    meat.style.left = `${nx}px`;
    meat.style.top = `${ny}px`;
  };

  const onUp = () => {
    if (!dragging) {
      return;
    }
    dragging = false;

    const mRect = meat.getBoundingClientRect();
    const gRect = bbqZone.getBoundingClientRect();

    if (overlap(mRect, gRect)) {
      state.backyard.meatOnGrill = true;
      state.backyard.meatPos = { x: 440, y: 328 };
      tapSfx(920, 0.09);
    } else {
      const areaRect = yardArea.getBoundingClientRect();
      state.backyard.meatPos = {
        x: Math.max(0, Math.min(areaRect.width - meat.offsetWidth, parseFloat(meat.style.left))),
        y: Math.max(0, Math.min(areaRect.height - meat.offsetHeight, parseFloat(meat.style.top))),
      };
    }

    saveState();
    renderYardScene();
  };

  meat.addEventListener('pointerdown', (event) => {
    if (state.backyard.meatOnGrill) {
      return;
    }
    unlockAudioOnce();
    tapSfx(620, 0.06);
    dragging = true;
    const rect = meat.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    meat.setPointerCapture(event.pointerId);
  });

  meat.addEventListener('pointermove', onMove);
  meat.addEventListener('pointerup', onUp);
  meat.addEventListener('pointercancel', onUp);

  if (!state.backyard.meatOnGrill) {
    setHint('🍖 ➜ 🔥');
  } else if (state.backyard.bucket < 100) {
    setHint('🚰 👆');
  } else if (state.backyard.orangesDropped.some((x) => !x)) {
    setHint('🍊 👆');
  } else {
    setHint('🥳 ✨');
  }

  sceneCleanup = () => {
    if (waterTimer) {
      clearInterval(waterTimer);
    }
    if (cookTimer) {
      clearInterval(cookTimer);
    }
  };
}

function renderSmoothieScene() {
  let blendTimer = null;
  let floatGhost = null;

  app.innerHTML = `
    <section class="screen">
      <div class="scene-top">
        <div class="scene-chip">🍓</div>
        <div class="scene-chip">🌀</div>
        <div class="scene-chip">🥤</div>
      </div>
      <div class="scene-work smoothie-stage" id="smoothie-stage">
        <button class="reset-btn" id="reset-btn" aria-label="reset">♻️</button>

        <div class="blender ${state.smoothie.ready ? 'blending-stop' : ''}" id="blender-wrap">
          <div class="jar ${state.smoothie.ready ? 'fill' : ''}" id="jar" style="background:linear-gradient(180deg, rgba(255,255,255,0.75), ${state.smoothie.ready ? state.smoothie.smoothieColor : 'rgba(220,239,253,0.7)'});">
            <div class="jar-fruits" id="jar-fruits">${state.smoothie.fruits.map((id) => FRUITS.find((f) => f.id === id)?.emoji || '').join('')}</div>
            <div class="blades" id="blades"></div>
          </div>
          <div class="base">
            <button class="blend-btn" id="blend-btn" aria-label="blend">🌀</button>
          </div>
        </div>

        <div class="cup">
          <div class="cup-fill ${state.smoothie.ready ? 'ready' : ''}" style="background:${state.smoothie.smoothieColor};"></div>
        </div>

        <div class="fruit-tray" id="fruit-tray">
          ${FRUITS.map((fruit) => `<button class="fruit" data-fruit="${fruit.id}" aria-label="${fruit.id}">${fruit.emoji}</button>`).join('')}
        </div>
      </div>
    </section>
  `;

  const jar = document.getElementById('jar');
  const tray = document.getElementById('fruit-tray');
  const blendBtn = document.getElementById('blend-btn');
  const blenderWrap = document.getElementById('blender-wrap');

  document.getElementById('reset-btn').addEventListener('click', () => {
    unlockAudioOnce();
    tapSfx(520, 0.09);
    state.smoothie.fruits = [];
    state.smoothie.smoothieColor = '#f2e5c7';
    state.smoothie.ready = false;
    saveState();
    renderSmoothieScene();
  });

  blendBtn.addEventListener('click', () => {
    unlockAudioOnce();
    tapSfx(760, 0.09);
    if (state.smoothie.fruits.length === 0 || blenderWrap.classList.contains('blending')) {
      return;
    }

    blenderWrap.classList.add('blending');
    blendTimer = setTimeout(() => {
      const colors = state.smoothie.fruits.map((id) => FRUITS.find((f) => f.id === id)?.color).filter(Boolean);
      if (!colors.length) {
        blenderWrap.classList.remove('blending');
        return;
      }
      const mix = colors.map(rgbFromHex).reduce((acc, rgb) => {
        acc[0] += rgb[0];
        acc[1] += rgb[1];
        acc[2] += rgb[2];
        return acc;
      }, [0, 0, 0]);
      const count = colors.length;
      state.smoothie.smoothieColor = hexFromRgb(mix[0] / count, mix[1] / count, mix[2] / count);
      state.smoothie.ready = true;
      saveState();
      renderSmoothieScene();
      tapSfx(980, 0.12);
    }, 1100);
  });

  const startDragFruit = (button, fruitId) => {
    const onDown = (event) => {
      unlockAudioOnce();
      tapSfx(640, 0.06);

      floatGhost = document.createElement('div');
      floatGhost.textContent = button.textContent;
      floatGhost.style.position = 'fixed';
      floatGhost.style.left = `${event.clientX - 26}px`;
      floatGhost.style.top = `${event.clientY - 26}px`;
      floatGhost.style.width = '52px';
      floatGhost.style.height = '52px';
      floatGhost.style.borderRadius = '14px';
      floatGhost.style.background = '#fff';
      floatGhost.style.border = '2px solid #ffd8b7';
      floatGhost.style.display = 'grid';
      floatGhost.style.placeItems = 'center';
      floatGhost.style.fontSize = '2rem';
      floatGhost.style.pointerEvents = 'none';
      floatGhost.style.zIndex = '99';
      document.body.appendChild(floatGhost);

      const onMove = (moveEvent) => {
        if (!floatGhost) {
          return;
        }
        floatGhost.style.left = `${moveEvent.clientX - 26}px`;
        floatGhost.style.top = `${moveEvent.clientY - 26}px`;
      };

      const onUp = (upEvent) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        if (floatGhost) {
          floatGhost.remove();
          floatGhost = null;
        }

        const jarRect = jar.getBoundingClientRect();
        if (
          upEvent.clientX >= jarRect.left &&
          upEvent.clientX <= jarRect.right &&
          upEvent.clientY >= jarRect.top &&
          upEvent.clientY <= jarRect.bottom
        ) {
          state.smoothie.fruits.push(fruitId);
          state.smoothie.ready = false;
          saveState();
          renderSmoothieScene();
          tapSfx(860, 0.08);
        }
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    button.addEventListener('pointerdown', onDown);
  };

  tray.querySelectorAll('[data-fruit]').forEach((btn) => {
    startDragFruit(btn, btn.dataset.fruit);
  });

  setHint('🍓 ➜ 🌀 ➜ 🥤');

  sceneCleanup = () => {
    if (blendTimer) {
      clearTimeout(blendTimer);
    }
    if (floatGhost) {
      floatGhost.remove();
      floatGhost = null;
    }
  };
}

function render() {
  sceneCleanup();
  sceneCleanup = () => {};

  if (state.scene === 'home') {
    renderHomeScene();
    return;
  }
  if (state.scene === 'color') {
    renderColorScene();
    return;
  }
  if (state.scene === 'yard') {
    renderYardScene();
    return;
  }
  renderSmoothieScene();
}

homeBtn.addEventListener('click', () => {
  unlockAudioOnce();
  tapSfx(560, 0.07);
  state.scene = 'home';
  saveState();
  render();
});

musicBtn.addEventListener('click', async () => {
  await unlockAudioOnce();
  state.audioOn = !state.audioOn;
  saveState();
  updateMusicButton();
  if (!state.audioOn) {
    bgMusic.pause();
  } else {
    bgMusic.play().catch(() => {});
  }
});

window.addEventListener('pointerdown', unlockAudioOnce, { passive: true });
window.addEventListener('beforeunload', () => {
  sceneCleanup();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    bgMusic.pause();
    return;
  }
  if (state.audioOn && audioUnlocked) {
    bgMusic.play().catch(() => {});
  }
});

updateMusicButton();
render();
