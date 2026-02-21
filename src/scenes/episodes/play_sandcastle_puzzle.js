import { createPuzzleEpisode } from './common.js';

export default createPuzzleEpisode(
  {
    id: 'play-sandcastle-puzzle',
    titleRu: 'Песочный замок',
    titleEn: 'Sandcastle Puzzle',
    locationId: 'playground',
    characters: ['tommi', 'pip', 'luna'],
    objective: 'Собрать картинку песочного замка.',
    mechanics: 'Менять местами плитки.',
    success: 'Все 6 частей стоят правильно.',
    failFeedback: 'Ошибки не наказываются, можно пробовать.',
    rewardSticker: 'crown-gold',
    durationMin: 4,
  },
  {
    promptRu: 'Собери замок из 6 частей.',
    promptEn: 'Build castle from 6 pieces.',
    columns: 3,
    pieces: ['🏖️', '🏰', '🌊', '🧺', '☀️', '🪣'],
  },
);
