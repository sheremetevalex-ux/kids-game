import { createTrafficEpisode } from './common.js';

export default createTrafficEpisode(
  {
    id: 'play-cross-street',
    titleRu: 'Переход дороги',
    titleEn: 'Cross the Street',
    locationId: 'playground',
    characters: ['bobbi', 'niko'],
    objective: 'Переходить только на зелёный свет.',
    mechanics: 'Следить за светофором и нажимать в нужный момент.',
    success: 'Сделано несколько безопасных переходов.',
    failFeedback: 'На красный/жёлтый — мягкая подсказка подождать.',
    rewardSticker: 'anchor-safe',
    durationMin: 3,
  },
  {
    promptRu: 'Жди зелёный сигнал и только потом переходи.',
    promptEn: 'Wait for green light before crossing.',
    failRu: 'Стоп. Сначала зелёный.',
    failEn: 'Stop. Wait for green.',
  },
);
