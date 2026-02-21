import { createTurnTakingEpisode } from './common.js';

export default createTurnTakingEpisode(
  {
    id: 'play-swing-turns',
    titleRu: 'Качели по очереди',
    titleEn: 'Swing Turns',
    locationId: 'playground',
    characters: ['miri', 'bobbi', 'niko'],
    objective: 'Соблюдать очередь на качелях.',
    mechanics: 'Выбрать следующего в очереди.',
    success: 'Очередь завершена спокойно.',
    failFeedback: 'Система мягко подсказывает правильный ход.',
    rewardSticker: 'balloon-pop',
    durationMin: 3,
  },
  {
    queue: [
      { id: 'miri', ru: 'Мири', en: 'Miri' },
      { id: 'niko', ru: 'Нико', en: 'Niko' },
      { id: 'bobbi', ru: 'Бобби', en: 'Bobbi' },
    ],
    failRu: 'Сейчас очередь другого щенка.',
    failEn: 'It is another pup turn now.',
  },
);
