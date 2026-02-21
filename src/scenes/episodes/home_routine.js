import { createSequenceEpisode } from './common.js';

export default createSequenceEpisode(
  {
    id: 'home-routine',
    titleRu: 'Утро дома',
    titleEn: 'Morning Ready',
    locationId: 'home',
    characters: ['luna', 'pip'],
    objective: 'Собрать утренний порядок.',
    mechanics: 'Нажимать шаги по очереди.',
    success: 'Все шаги в правильном порядке.',
    failFeedback: 'Почти! Начни порядок сначала.',
    rewardSticker: 'house-home',
    durationMin: 3,
  },
  {
    promptRu: 'Сделай утренние шаги по порядку.',
    promptEn: 'Tap morning steps in order.',
    steps: [
      { ru: 'Проснуться', en: 'Wake up' },
      { ru: 'Умыться', en: 'Wash face' },
      { ru: 'Одеться', en: 'Get dressed' },
      { ru: 'Позавтракать', en: 'Eat breakfast' },
    ],
    failRu: 'Шаги перепутались, давай ещё раз!',
    failEn: 'Steps mixed up. Try again!',
  },
);
