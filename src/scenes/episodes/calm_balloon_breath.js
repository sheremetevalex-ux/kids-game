import { createBreathingEpisode } from './common.js';

export default createBreathingEpisode(
  {
    id: 'calm-balloon-breath',
    titleRu: 'Шарик дыхания',
    titleEn: 'Balloon Breathing',
    locationId: 'calm',
    characters: ['freya', 'miri'],
    objective: 'Сделать спокойные вдохи и выдохи.',
    mechanics: 'Нажимать Вдох/Выдох в ритме.',
    success: 'Завершено нужное количество циклов.',
    failFeedback: 'Без штрафов, только мягкий ритм.',
    rewardSticker: 'moon-dream',
    durationMin: 3,
  },
  {
    promptRu: 'Надуваем и сдуваем шарик вместе.',
    promptEn: 'Inflate and deflate balloon together.',
    cyclesEasy: 3,
    cyclesNormal: 5,
  },
);
