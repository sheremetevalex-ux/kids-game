import { createChoiceEpisode } from './common.js';

export default createChoiceEpisode(
  {
    id: 'shop-queue-kindness',
    titleRu: 'Добрая очередь',
    titleEn: 'Kind Queue',
    locationId: 'shop',
    characters: ['bobbi', 'niko', 'miri'],
    objective: 'Выбрать вежливое поведение в очереди.',
    mechanics: 'Три варианта ответа.',
    success: 'Выбран вежливый вариант.',
    failFeedback: 'Невежливый вариант даёт мягкий отклик.',
    rewardSticker: 'medal-star',
    durationMin: 2,
  },
  {
    promptRu: 'Нико спешит и хочет пройти без очереди. Что лучше?',
    promptEn: 'Niko is in a hurry and wants to skip queue. Best choice?',
    options: [
      {
        ru: 'Спросить: «Можно после вас?»',
        en: 'Ask: “May I go after you?”',
        kind: 'good',
        okRu: 'Очень вежливо! Все улыбаются.',
        okEn: 'Very polite! Everyone smiles.',
      },
      {
        ru: 'Тихо встать впереди',
        en: 'Quietly stand in front',
        kind: 'neutral',
        okRu: 'Люди удивились. Лучше спросить.',
        okEn: 'People look surprised. Better to ask.',
      },
      {
        ru: 'Сказать: «Я первый!»',
        en: 'Say: “I am first!”',
        kind: 'neutral',
        okRu: 'Слишком громко. Давай мягче.',
        okEn: 'Too loud. Let us be gentler.',
      },
    ],
  },
);
