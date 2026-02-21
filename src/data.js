export const GAME_TITLE = {
  ru: 'Город Добрых Дел',
  en: 'City of Kind Deeds',
};

export const LOCATIONS = [
  { id: 'home', ru: 'Дом', en: 'Home', color: '#ff9f66', x: 18, y: 22, track: 'happyA' },
  { id: 'park', ru: 'Парк', en: 'Park', color: '#7cd992', x: 74, y: 20, track: 'happyA' },
  { id: 'shop', ru: 'Магазин', en: 'Shop', color: '#f8c26a', x: 80, y: 48, track: 'happyB' },
  { id: 'playground', ru: 'Площадка', en: 'Playground', color: '#77b8ff', x: 42, y: 52, track: 'happyB' },
  { id: 'workshop', ru: 'Мастерская', en: 'Workshop', color: '#b396ff', x: 22, y: 62, track: 'happyB' },
  { id: 'calm', ru: 'Тихий уголок', en: 'Calm Corner', color: '#8bd5ff', x: 50, y: 84, track: 'calm' },
];

export const CHARACTERS = [
  {
    id: 'luna',
    nameRu: 'Луна',
    nameEn: 'Luna',
    palette: { fur: '#ffd28a', ear: '#e29e53', shirt: '#7cc8ff' },
    traitRu: 'Любопытная',
    traitEn: 'Curious',
  },
  {
    id: 'pip',
    nameRu: 'Пип',
    nameEn: 'Pip',
    palette: { fur: '#f5b6c8', ear: '#dd849d', shirt: '#ffe27a' },
    traitRu: 'Игривый',
    traitEn: 'Playful',
  },
  {
    id: 'rozi',
    nameRu: 'Рози',
    nameEn: 'Rozi',
    palette: { fur: '#c8b5ff', ear: '#9278dc', shirt: '#ffd479' },
    traitRu: 'Добрая',
    traitEn: 'Kind mediator',
  },
  {
    id: 'tommi',
    nameRu: 'Томми',
    nameEn: 'Tommi',
    palette: { fur: '#9fd19f', ear: '#5fa66a', shirt: '#ffb0a6' },
    traitRu: 'Мастер',
    traitEn: 'Builder',
  },
  {
    id: 'niko',
    nameRu: 'Нико',
    nameEn: 'Niko',
    palette: { fur: '#b2d4ff', ear: '#6ea0e0', shirt: '#ffc08f' },
    traitRu: 'Смелый',
    traitEn: 'Shy but brave',
  },
  {
    id: 'freya',
    nameRu: 'Фрея',
    nameEn: 'Freya',
    palette: { fur: '#ffd3a8', ear: '#e39a59', shirt: '#b0ecb5' },
    traitRu: 'Учится спокойствию',
    traitEn: 'Learns calm',
  },
  {
    id: 'bobbi',
    nameRu: 'Бобби',
    nameEn: 'Bobbi',
    palette: { fur: '#ffe58e', ear: '#d7b75d', shirt: '#8dc6ff' },
    traitRu: 'Любит порядок',
    traitEn: 'Likes rules',
  },
  {
    id: 'sem',
    nameRu: 'Сэм',
    nameEn: 'Sam',
    palette: { fur: '#b9f3d2', ear: '#79be98', shirt: '#fdb6ca' },
    traitRu: 'Следопыт',
    traitEn: 'Nature detective',
  },
  {
    id: 'miri',
    nameRu: 'Мири',
    nameEn: 'Miri',
    palette: { fur: '#ffbdde', ear: '#dd83b2', shirt: '#ace4ff' },
    traitRu: 'Ободряет друзей',
    traitEn: 'Cheerful helper',
  },
];

export const LOCATION_EPISODES = {
  home: ['home-routine', 'home-tidy', 'home-kind-words'],
  park: ['park-turn-slide', 'park-lost-toy', 'park-picnic-share'],
  shop: ['shop-color-shape', 'shop-queue-kindness', 'shop-bag-sort'],
  playground: ['play-sandcastle-puzzle', 'play-swing-turns', 'play-cross-street'],
  workshop: ['work-fix-birdhouse', 'work-tool-match', 'work-help-delivery'],
  calm: ['calm-balloon-breath', 'calm-cloud-count', 'calm-heart-hug'],
};

export const LOCATION_IDS = Object.keys(LOCATION_EPISODES);

const stickerRaw = [
  ['star-sun', 'star', '#ffd84f'],
  ['heart-hug', 'heart', '#ff8ba8'],
  ['leaf-green', 'leaf', '#80d47a'],
  ['rocket-wow', 'rocket', '#9db6ff'],
  ['cupcake', 'cupcake', '#ffcf9d'],
  ['rainbow-smile', 'rainbow', '#ffa36b'],
  ['moon-dream', 'moon', '#87b8ff'],
  ['flower-red', 'flower', '#ff98a4'],
  ['apple-red', 'apple', '#ff6b6b'],
  ['kite-sky', 'kite', '#69b7ff'],
  ['fish-blue', 'fish', '#57c8d8'],
  ['drum-beat', 'drum', '#f59b6d'],
  ['book-kind', 'book', '#9ea6ff'],
  ['balloon-pop', 'balloon', '#f986d3'],
  ['cloud-soft', 'cloud', '#b9e6ff'],
  ['smile-big', 'smile', '#ffd36f'],
  ['paw-print', 'paw', '#c8b7ff'],
  ['car-zoom', 'car', '#75d27f'],
  ['tree-oak', 'tree', '#72c476'],
  ['house-home', 'house', '#ffa384'],
  ['gift-wow', 'gift', '#ff8ec2'],
  ['bee-buzz', 'bee', '#ffd35e'],
  ['ladybug', 'ladybug', '#ff6f76'],
  ['shell-sea', 'shell', '#f3c8a2'],
  ['music-note', 'music', '#8bc6ff'],
  ['planet-fun', 'planet', '#9dd0ff'],
  ['crown-gold', 'crown', '#ffd369'],
  ['medal-star', 'medal', '#fcbf56'],
  ['anchor-safe', 'anchor', '#7db6d9'],
  ['sparkle-kind', 'sparkle', '#c6a8ff'],
];

export const STICKERS = stickerRaw.map(([id, shape, color], idx) => ({
  id,
  shape,
  color,
  index: idx,
}));

export const HELPER_TIPS = {
  ru: [
    'Нажми и попробуй! У тебя получится.',
    'Доброе слово делает день ярче.',
    'Медленно вдох, медленно выдох.',
    'Делись по очереди, это приятно.',
    'Если ошибка, просто попробуй ещё.',
  ],
  en: [
    'Tap and try. You can do it!',
    'Kind words make bright days.',
    'Slow breath in, slow breath out.',
    'Taking turns feels good.',
    'If it was wrong, try again.',
  ],
};

export const UI_TEXT = {
  start: { ru: 'Начать', en: 'Start' },
  play: { ru: 'Играть', en: 'Play' },
  stickers: { ru: 'Наклейки', en: 'Stickers' },
  map: { ru: 'Карта дел', en: 'Kind map' },
  back: { ru: 'Назад', en: 'Back' },
  home: { ru: 'Домой', en: 'Home' },
  pause: { ru: 'Пауза', en: 'Pause' },
  resume: { ru: 'Продолжить', en: 'Resume' },
  yes: { ru: 'Да', en: 'Yes' },
  no: { ru: 'Нет', en: 'No' },
  done: { ru: 'Готово', en: 'Done' },
  next: { ru: 'Дальше', en: 'Next' },
  continueBrowser: { ru: 'Играть в браузере', en: 'Continue in browser' },
  installDone: { ru: 'Я установил(а) — продолжить', en: 'I installed it — continue' },
  updateReady: { ru: 'Есть обновление', en: 'Update available' },
  reload: { ru: 'Обновить', en: 'Reload' },
  fullscreen: { ru: 'Полный экран', en: 'Fullscreen' },
  unlockAudio: { ru: 'Начать со звуком', en: 'Start with sound' },
  soundOff: { ru: 'Без звука', en: 'No sound' },
  rewardGreat: { ru: 'Ты молодец!', en: 'Great job!' },
  episodeDone: { ru: 'Серия завершена', en: 'Episode complete' },
};

export function textFor(state, key) {
  const lang = state.settings.language === 'en' ? 'en' : 'ru';
  const entry = UI_TEXT[key];
  return entry ? entry[lang] : key;
}

export function locationById(id) {
  return LOCATIONS.find((location) => location.id === id);
}

export function nextEpisodeId(episodeId) {
  for (const locationId of LOCATION_IDS) {
    const episodes = LOCATION_EPISODES[locationId];
    const idx = episodes.indexOf(episodeId);
    if (idx !== -1) {
      return episodes[idx + 1] || null;
    }
  }
  return null;
}

export function getDeviceProfile() {
  const ua = navigator.userAgent || '';
  const isIOS = /iP(ad|hone|od)/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edg/i.test(ua);
  return {
    isIOS,
    isSafari,
    isAndroid,
    isChrome,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
  };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function stickerSvg(sticker, size = 120) {
  const { shape, color } = sticker;
  const s = size;
  const c = s / 2;

  const templates = {
    star: `<polygon points="${c},8 ${c + 14},${c - 2} ${s - 12},${c - 2} ${c + 22},${c + 8} ${c + 30},${s - 10} ${c},${c + 18} ${c - 30},${s - 10} ${c - 22},${c + 8} 12,${c - 2} ${c - 14},${c - 2}" />`,
    heart: `<path d="M${c} ${s - 18} C${s - 8} ${c + 8}, ${s - 4} ${c - 16}, ${c} ${c - 2} C4 ${c - 16}, 8 ${c + 8}, ${c} ${s - 18} Z" />`,
    leaf: `<path d="M${c} 10 C${s - 6} 24, ${s - 8} ${s - 20}, ${c} ${s - 8} C10 ${s - 20}, 12 24, ${c} 10 Z" />`,
    rocket: `<path d="M${c} 12 C${s - 2} 34, ${s - 2} ${s - 40}, ${c} ${s - 14} C6 ${s - 40}, 6 34, ${c} 12 Z" /><rect x="${c - 6}" y="${s - 30}" width="12" height="16" rx="5" fill="#fff"/>`,
    cupcake: `<rect x="24" y="56" width="${s - 48}" height="36" rx="12" /><circle cx="${c}" cy="42" r="24" fill="#ffdff0" />`,
    rainbow: `<path d="M20 ${s - 20} A${c - 20} ${c - 20} 0 0 1 ${s - 20} ${s - 20}" stroke="#ff8f8f" stroke-width="12" fill="none"/><path d="M30 ${s - 20} A${c - 30} ${c - 30} 0 0 1 ${s - 30} ${s - 20}" stroke="#ffd66d" stroke-width="10" fill="none"/><path d="M40 ${s - 20} A${c - 40} ${c - 40} 0 0 1 ${s - 40} ${s - 20}" stroke="#7bd9a3" stroke-width="8" fill="none"/>`,
    moon: `<path d="M${c + 16} 20 A${c - 10} ${c - 10} 0 1 0 ${c + 16} ${s - 20} A${c - 16} ${c - 16} 0 1 1 ${c + 16} 20 Z" />`,
    flower: `<circle cx="${c}" cy="${c}" r="12" fill="#ffd86b"/><circle cx="${c}" cy="18" r="14"/><circle cx="${c}" cy="${s - 18}" r="14"/><circle cx="18" cy="${c}" r="14"/><circle cx="${s - 18}" cy="${c}" r="14"/>`,
    apple: `<circle cx="${c}" cy="${c + 8}" r="32" /><rect x="${c - 4}" y="16" width="8" height="16" rx="3" fill="#5f7d3f"/><ellipse cx="${c + 12}" cy="20" rx="10" ry="6" fill="#7ec76d"/>`,
    kite: `<polygon points="${c},10 ${s - 20},${c} ${c},${s - 10} 20,${c}" /><path d="M${c} ${s - 10} Q${c - 8} ${s - 2} ${c - 16} ${s - 12} Q${c - 24} ${s - 2} ${c - 32} ${s - 12}" stroke="#fff" stroke-width="4" fill="none"/>`,
    fish: `<ellipse cx="${c}" cy="${c}" rx="34" ry="22"/><polygon points="${s - 24},${c} ${s - 6},${c - 14} ${s - 6},${c + 14}"/><circle cx="${c - 12}" cy="${c - 4}" r="4" fill="#fff"/>`,
    drum: `<ellipse cx="${c}" cy="32" rx="30" ry="14"/><rect x="${c - 30}" y="32" width="60" height="44"/><ellipse cx="${c}" cy="76" rx="30" ry="14"/>`,
    book: `<rect x="22" y="22" width="${s - 44}" height="${s - 44}" rx="8"/><line x1="${c}" y1="22" x2="${c}" y2="${s - 22}" stroke="#fff" stroke-width="6"/>`,
    balloon: `<ellipse cx="${c}" cy="46" rx="24" ry="30"/><path d="M${c} 76 L${c - 8} 96" stroke="#fff" stroke-width="4"/>`,
    cloud: `<circle cx="${c - 16}" cy="56" r="20"/><circle cx="${c + 4}" cy="46" r="24"/><circle cx="${c + 24}" cy="58" r="18"/><rect x="${c - 28}" y="56" width="56" height="20" rx="10"/>`,
    smile: `<circle cx="${c}" cy="${c}" r="40"/><circle cx="${c - 14}" cy="${c - 10}" r="6" fill="#fff"/><circle cx="${c + 14}" cy="${c - 10}" r="6" fill="#fff"/><path d="M${c - 18} ${c + 12} Q${c} ${c + 24} ${c + 18} ${c + 12}" stroke="#fff" stroke-width="6" fill="none"/>`,
    paw: `<circle cx="${c}" cy="64" r="20"/><circle cx="${c - 20}" cy="40" r="10"/><circle cx="${c - 6}" cy="30" r="10"/><circle cx="${c + 8}" cy="30" r="10"/><circle cx="${c + 22}" cy="40" r="10"/>`,
    car: `<rect x="18" y="44" width="${s - 36}" height="26" rx="10"/><rect x="32" y="30" width="${s - 64}" height="18" rx="8"/><circle cx="34" cy="74" r="8" fill="#fff"/><circle cx="${s - 34}" cy="74" r="8" fill="#fff"/>`,
    tree: `<rect x="${c - 8}" y="58" width="16" height="30" rx="6" fill="#8d6444"/><circle cx="${c}" cy="40" r="24"/><circle cx="${c - 18}" cy="48" r="18"/><circle cx="${c + 18}" cy="48" r="18"/>`,
    house: `<rect x="26" y="42" width="${s - 52}" height="42" rx="8"/><polygon points="${c},16 ${s - 14},42 14,42"/><rect x="${c - 8}" y="60" width="16" height="24" rx="4" fill="#fff"/>`,
    gift: `<rect x="20" y="30" width="${s - 40}" height="${s - 44}" rx="8"/><rect x="${c - 5}" y="30" width="10" height="${s - 44}" fill="#fff"/><rect x="20" y="${c + 2}" width="${s - 40}" height="10" fill="#fff"/>`,
    bee: `<ellipse cx="${c}" cy="${c}" rx="30" ry="20"/><rect x="${c - 18}" y="${c - 20}" width="8" height="40" fill="#2f2f2f"/><rect x="${c - 2}" y="${c - 20}" width="8" height="40" fill="#2f2f2f"/><ellipse cx="${c - 14}" cy="26" rx="12" ry="8" fill="#d9f3ff"/><ellipse cx="${c + 12}" cy="26" rx="12" ry="8" fill="#d9f3ff"/>`,
    ladybug: `<circle cx="${c}" cy="${c}" r="34"/><line x1="${c}" y1="18" x2="${c}" y2="${s - 18}" stroke="#2c2c2c" stroke-width="4"/><circle cx="${c - 12}" cy="${c - 6}" r="5" fill="#2c2c2c"/><circle cx="${c + 10}" cy="${c + 8}" r="5" fill="#2c2c2c"/>`,
    shell: `<path d="M${c} ${s - 18} C${s - 12} ${s - 20}, ${s - 16} 24, ${c} 18 C16 24, 12 ${s - 20}, ${c} ${s - 18} Z"/>`,
    music: `<circle cx="42" cy="74" r="10"/><circle cx="74" cy="68" r="10"/><rect x="48" y="26" width="8" height="48"/><rect x="80" y="20" width="8" height="48"/><path d="M56 26 Q72 22 80 20" stroke="#fff" stroke-width="6" fill="none"/>`,
    planet: `<circle cx="${c}" cy="${c}" r="28"/><ellipse cx="${c}" cy="${c}" rx="44" ry="12" fill="none" stroke="#fff" stroke-width="6"/>`,
    crown: `<polygon points="18,74 ${s - 18},74 ${s - 26},32 ${c},52 26,32"/><circle cx="26" cy="30" r="6" fill="#fff"/><circle cx="${c}" cy="50" r="6" fill="#fff"/><circle cx="${s - 26}" cy="30" r="6" fill="#fff"/>`,
    medal: `<circle cx="${c}" cy="${c}" r="28"/><polygon points="${c},28 ${c + 8},46 ${c + 28},48 ${c + 12},62 ${c + 18},82 ${c},70 ${c - 18},82 ${c - 12},62 ${c - 28},48 ${c - 8},46" fill="#fff"/>`,
    anchor: `<line x1="${c}" y1="18" x2="${c}" y2="78" stroke="#fff" stroke-width="8"/><circle cx="${c}" cy="22" r="8" fill="#fff"/><path d="M24 58 Q${c} 98 ${s - 24} 58" stroke="#fff" stroke-width="8" fill="none"/><line x1="24" y1="58" x2="40" y2="58" stroke="#fff" stroke-width="8"/><line x1="${s - 24}" y1="58" x2="${s - 40}" y2="58" stroke="#fff" stroke-width="8"/>`,
    sparkle: `<polygon points="${c},10 ${c + 10},${c - 4} ${s - 6},${c} ${c + 10},${c + 4} ${c},${s - 10} ${c - 10},${c + 4} 6,${c} ${c - 10},${c - 4}"/>`,
  };

  const art = templates[shape] || templates.sparkle;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" rx="28" fill="${color}"/>${art}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
