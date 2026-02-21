import { createDragSortEpisode } from './common.js';

export default createDragSortEpisode(
  {
    id: 'home-tidy',
    titleRu: 'Убери игрушки',
    titleEn: 'Tidy Toys',
    locationId: 'home',
    characters: ['rozi', 'pip'],
    objective: 'Разложить игрушки по коробкам.',
    mechanics: 'Перетаскивать предметы в нужные категории.',
    success: 'Все предметы в своих коробках.',
    failFeedback: 'Предмет не туда. Попробуй другую коробку.',
    rewardSticker: 'book-kind',
    durationMin: 4,
  },
  {
    promptRu: 'Перетащи игрушки в правильные коробки.',
    promptEn: 'Drag toys to the right box.',
    categories: [
      { id: 'soft', ru: 'Мягкие', en: 'Soft', color: '#ffb4cf' },
      { id: 'build', ru: 'Строим', en: 'Build', color: '#8fd2ff' },
      { id: 'round', ru: 'Круглые', en: 'Round', color: '#ffd780' },
    ],
    items: [
      { id: 'bear', ru: 'Мишка', en: 'Bear', category: 'soft' },
      { id: 'bunny', ru: 'Зайка', en: 'Bunny', category: 'soft' },
      { id: 'cube', ru: 'Кубик', en: 'Cube', category: 'build' },
      { id: 'tower', ru: 'Башня', en: 'Tower', category: 'build' },
      { id: 'ball', ru: 'Мяч', en: 'Ball', category: 'round' },
      { id: 'ring', ru: 'Кольцо', en: 'Ring', category: 'round' },
    ],
    failRu: 'Эта игрушка живёт в другой коробке.',
    failEn: 'This toy belongs in another box.',
  },
);
