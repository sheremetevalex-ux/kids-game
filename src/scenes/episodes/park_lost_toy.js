import { createFindEpisode } from './common.js';

export default createFindEpisode(
  {
    id: 'park-lost-toy',
    titleRu: 'Поиск пропавшей игрушки',
    titleEn: 'Lost Toy Detective',
    locationId: 'park',
    characters: ['sem', 'luna', 'pip'],
    objective: 'Найти пять нужных предметов в парке.',
    mechanics: 'Нажимать на нужные объекты.',
    success: 'Найдены все 5 предметов.',
    failFeedback: 'Неправильный объект, мягкая подсказка.',
    rewardSticker: 'ladybug',
    durationMin: 4,
  },
  {
    promptRu: 'Помоги Сэму найти потерянный набор Пипа.',
    promptEn: 'Help Sam find Pip’s lost set.',
    targets: [
      { id: 'toy-car', ru: 'Машинка', en: 'Toy car' },
      { id: 'bucket', ru: 'Ведёрко', en: 'Bucket' },
      { id: 'blue-ball', ru: 'Синий мяч', en: 'Blue ball' },
      { id: 'hat', ru: 'Панама', en: 'Sun hat' },
      { id: 'leaf-map', ru: 'Карта-лист', en: 'Leaf map' },
    ],
    distractors: [
      { id: 'bench', ru: 'Лавка', en: 'Bench' },
      { id: 'tree', ru: 'Дерево', en: 'Tree' },
      { id: 'cloud', ru: 'Облако', en: 'Cloud' },
      { id: 'bird', ru: 'Птичка', en: 'Bird' },
      { id: 'flower', ru: 'Цветок', en: 'Flower' },
      { id: 'kite', ru: 'Воздушный змей', en: 'Kite' },
    ],
    failRu: 'Это не из набора. Ищем дальше.',
    failEn: 'Not from the set. Keep looking.',
  },
);
