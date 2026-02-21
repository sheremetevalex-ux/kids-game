import { createTapCountEpisode } from './common.js';

export default createTapCountEpisode(
  {
    id: 'calm-heart-hug',
    titleRu: 'Тёплое сердце',
    titleEn: 'Warm Heart',
    locationId: 'calm',
    characters: ['freya', 'rozi'],
    objective: 'Сделать короткое успокаивающее упражнение.',
    mechanics: 'Нажимать на сердце в мягком ритме.',
    success: 'Серия спокойных ритмичных нажатий.',
    failFeedback: 'Упражнение без жёстких ошибок.',
    rewardSticker: 'smile-big',
    durationMin: 2,
  },
  {
    promptRu: 'Нажимай на сердце: тук-тук спокойно.',
    promptEn: 'Tap heart in calm rhythm.',
    buttonRu: 'Сердце',
    buttonEn: 'Heart',
    goalEasy: 6,
    goalNormal: 10,
  },
);
