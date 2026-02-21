const STORAGE_KEY = 'kind-city-progress-v1';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(base, incoming) {
  if (!isObject(base)) {
    return incoming;
  }
  const result = { ...base };
  if (!isObject(incoming)) {
    return result;
  }
  Object.keys(incoming).forEach((key) => {
    if (isObject(incoming[key]) && isObject(base[key])) {
      result[key] = mergeDeep(base[key], incoming[key]);
    } else {
      result[key] = incoming[key];
    }
  });
  return result;
}

export function loadProgress(defaults) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaults);
    }
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return structuredClone(defaults);
    }
    return mergeDeep(structuredClone(defaults), parsed);
  } catch {
    return structuredClone(defaults);
  }
}

export function saveProgress(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage errors on constrained devices.
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors on constrained devices.
  }
}

export { STORAGE_KEY };
