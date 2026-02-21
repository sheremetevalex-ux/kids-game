import { createTapCountEpisode } from './common.js';

export default createTapCountEpisode(
  {
    id: 'calm-cloud-count',
    titleRu: 'Считаем облака',
    titleEn: 'Count the Clouds',
    locationId: 'calm',
    characters: ['freya', 'sem'],
    objective: 'Считать медленно и спокойно.',
    mechanics: 'Нажимать в спокойном темпе.',
    success: 'Нужное количество спокойных нажатий.',
    failFeedback: 'Нет жёстких ошибок, можно в своём темпе.',
    rewardSticker: 'cloud-soft',
    durationMin: 2,
  },
  {
    promptRu: 'Нажимай облачко и считай спокойно.',
    promptEn: 'Tap cloud and count calmly.',
    buttonRu: 'Облачко',
    buttonEn: 'Cloud',
    goalEasy: 5,
    goalNormal: 8,
  },
);
