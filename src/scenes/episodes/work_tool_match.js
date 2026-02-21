import { createMatchingEpisode } from './common.js';

export default createMatchingEpisode(
  {
    id: 'work-tool-match',
    titleRu: 'Инструменты и дела',
    titleEn: 'Tools and Tasks',
    locationId: 'workshop',
    characters: ['tommi', 'rozi'],
    objective: 'Подобрать инструмент к задаче помощи.',
    mechanics: 'Сопоставление пар.',
    success: 'Все задачи получили правильный инструмент.',
    failFeedback: 'Неправильная пара даёт мягкую подсказку.',
    rewardSticker: 'rocket-wow',
    durationMin: 3,
  },
  {
    promptRu: 'Какой инструмент к какому делу?',
    promptEn: 'Which tool matches each task?',
    pairs: [
      {
        left: { id: 'hammer', ru: 'Молоток', en: 'Hammer' },
        right: { id: 'task-nail', ru: 'Прибить планку', en: 'Nail plank' },
      },
      {
        left: { id: 'brush', ru: 'Кисточка', en: 'Brush' },
        right: { id: 'task-paint', ru: 'Покрасить скамейку', en: 'Paint bench' },
      },
      {
        left: { id: 'rope', ru: 'Верёвка', en: 'Rope' },
        right: { id: 'task-tie', ru: 'Привязать коробку', en: 'Tie box' },
      },
      {
        left: { id: 'tape', ru: 'Лента', en: 'Tape' },
        right: { id: 'task-fix', ru: 'Подклеить книгу', en: 'Fix book' },
      },
    ],
    failRu: 'Этот инструмент для другого дела.',
    failEn: 'This tool fits another task.',
  },
);
