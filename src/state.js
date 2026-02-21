import { loadProgress, saveProgress, clearProgress } from './storage.js';
import { LOCATION_EPISODES, LOCATION_IDS, STICKERS } from './data.js';

export const SCHEMA_VERSION = 1;

const DEFAULT_SETTINGS = {
  language: 'ru',
  musicOn: true,
  sfxOn: true,
  difficulty: 'easy',
  unlockAll: false,
  calmReminders: true,
  performanceMode: 'normal',
  installDismissed: false,
};

const DEFAULT_PROGRESS = {
  schemaVersion: SCHEMA_VERSION,
  completedEpisodes: {},
  stars: 0,
  stickers: {},
  settings: DEFAULT_SETTINGS,
  lastLocation: 'home',
  firstLaunchDone: false,
};

function normalizeProgress(raw) {
  const progress = structuredClone(raw);

  if (progress.schemaVersion !== SCHEMA_VERSION) {
    progress.schemaVersion = SCHEMA_VERSION;
  }

  if (!progress.completedEpisodes || typeof progress.completedEpisodes !== 'object') {
    progress.completedEpisodes = {};
  }

  if (!progress.stickers || typeof progress.stickers !== 'object') {
    progress.stickers = {};
  }

  if (!Number.isFinite(progress.stars)) {
    progress.stars = 0;
  }

  progress.settings = {
    ...DEFAULT_SETTINGS,
    ...(progress.settings || {}),
  };

  if (!LOCATION_IDS.includes(progress.lastLocation)) {
    progress.lastLocation = 'home';
  }

  if (typeof progress.firstLaunchDone !== 'boolean') {
    progress.firstLaunchDone = false;
  }

  return progress;
}

function deepClone(value) {
  return structuredClone(value);
}

export function createState() {
  let state = normalizeProgress(loadProgress(DEFAULT_PROGRESS));
  const listeners = new Set();
  let saveTimer = null;

  function emit() {
    const snapshot = deepClone(state);
    listeners.forEach((listener) => listener(snapshot));
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveProgress(state);
    }, 120);
  }

  function mutate(mutator) {
    const next = deepClone(state);
    mutator(next);
    state = normalizeProgress(next);
    scheduleSave();
    emit();
  }

  function getState() {
    return deepClone(state);
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function episodeLocation(episodeId) {
    for (const locationId of LOCATION_IDS) {
      if (LOCATION_EPISODES[locationId].includes(episodeId)) {
        return locationId;
      }
    }
    return null;
  }

  function isEpisodeUnlocked(episodeId) {
    const current = state;
    if (current.settings.unlockAll) {
      return true;
    }
    const locationId = episodeLocation(episodeId);
    if (!locationId) {
      return false;
    }
    if (locationId === 'calm') {
      return true;
    }
    const ids = LOCATION_EPISODES[locationId];
    const index = ids.indexOf(episodeId);
    if (index <= 0) {
      return true;
    }
    for (let i = 0; i < index; i += 1) {
      if (!current.completedEpisodes[ids[i]]) {
        return false;
      }
    }
    return true;
  }

  function completeEpisode(episodeId, stickerId) {
    mutate((draft) => {
      if (!draft.completedEpisodes[episodeId]) {
        draft.completedEpisodes[episodeId] = Date.now();
        draft.stars += 1;
      }
      if (stickerId) {
        draft.stickers[stickerId] = true;
      }
      const locationId = episodeLocation(episodeId);
      if (locationId) {
        draft.lastLocation = locationId;
      }
      draft.firstLaunchDone = true;
    });
  }

  function setSetting(key, value) {
    mutate((draft) => {
      draft.settings[key] = value;
    });
  }

  function setManySettings(payload) {
    mutate((draft) => {
      Object.keys(payload).forEach((key) => {
        draft.settings[key] = payload[key];
      });
    });
  }

  function setLanguage(language) {
    setSetting('language', language === 'en' ? 'en' : 'ru');
  }

  function markInstallDismissed() {
    setSetting('installDismissed', true);
  }

  function reopenInstallCard() {
    setSetting('installDismissed', false);
  }

  function setLastLocation(locationId) {
    if (!LOCATION_IDS.includes(locationId)) {
      return;
    }
    mutate((draft) => {
      draft.lastLocation = locationId;
      draft.firstLaunchDone = true;
    });
  }

  function resetProgress() {
    state = deepClone(DEFAULT_PROGRESS);
    clearProgress();
    scheduleSave();
    emit();
  }

  function locationStats(locationId) {
    const ids = LOCATION_EPISODES[locationId] || [];
    const done = ids.filter((id) => Boolean(state.completedEpisodes[id])).length;
    return {
      done,
      total: ids.length,
    };
  }

  function stickersCollectedCount() {
    return STICKERS.filter((sticker) => state.stickers[sticker.id]).length;
  }

  return {
    getState,
    subscribe,
    isEpisodeUnlocked,
    completeEpisode,
    setSetting,
    setManySettings,
    setLanguage,
    setLastLocation,
    markInstallDismissed,
    reopenInstallCard,
    resetProgress,
    locationStats,
    stickersCollectedCount,
  };
}
