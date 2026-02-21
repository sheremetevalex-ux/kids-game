import { createMatchingEpisode } from './common.js';

export default createMatchingEpisode(
  {
    id: 'work-fix-birdhouse',
    titleRu: 'Почини скворечник',
    titleEn: 'Fix the Birdhouse',
    locationId: 'workshop',
    characters: ['tommi', 'sem'],
    objective: 'Собрать детали скворечника по парам.',
    mechanics: 'Сопоставить левую и правую детали.',
    success: 'Все детали собраны в пары.',
    failFeedback: 'Неверная пара — мягкая подсказка.',
    rewardSticker: 'tree-oak',
    durationMin: 4,
  },
  {
    promptRu: 'Найди пары деталей для скворечника.',
    promptEn: 'Match parts to fix the birdhouse.',
    pairs: [
      {
        left: { id: 'roof', ru: 'Крыша', en: 'Roof' },
        right: { id: 'roof-slot', ru: 'Верхняя рамка', en: 'Top frame' },
      },
      {
        left: { id: 'door', ru: 'Круглое окошко', en: 'Round hole' },
        right: { id: 'door-slot', ru: 'Передняя стенка', en: 'Front wall' },
      },
      {
        left: { id: 'base', ru: 'Полка', en: 'Base shelf' },
        right: { id: 'base-slot', ru: 'Нижняя планка', en: 'Bottom plank' },
      },
      {
        left: { id: 'nail', ru: 'Гвоздик', en: 'Nail' },
        right: { id: 'nail-slot', ru: 'Крепёж', en: 'Fastener' },
      },
    ],
    failRu: 'Не подходит. Посмотри форму детали.',
    failEn: 'Not matching. Watch the shape.',
  },
);
