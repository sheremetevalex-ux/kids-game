import { createTurnTakingEpisode } from './common.js';

export default createTurnTakingEpisode(
  {
    id: 'park-turn-slide',
    titleRu: 'Очередь на горку',
    titleEn: 'Slide Turns',
    locationId: 'park',
    characters: ['bobbi', 'pip', 'niko'],
    objective: 'Соблюдать очередь на горке.',
    mechanics: 'Выбрать, кто идёт сейчас.',
    success: 'Очередь пройдена честно.',
    failFeedback: 'Неправильная очередь, попробуй снова.',
    rewardSticker: 'star-sun',
    durationMin: 3,
  },
  {
    queue: [
      { id: 'bobbi', ru: 'Бобби', en: 'Bobbi' },
      { id: 'pip', ru: 'Пип', en: 'Pip' },
      { id: 'niko', ru: 'Нико', en: 'Niko' },
    ],
    failRu: 'Давай честно: сейчас очередь другого друга.',
    failEn: 'Fair turn: it is another friend now.',
  },
);
