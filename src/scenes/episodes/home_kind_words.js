import { createChoiceEpisode } from './common.js';

export default createChoiceEpisode(
  {
    id: 'home-kind-words',
    titleRu: 'Добрые слова',
    titleEn: 'Kind Words',
    locationId: 'home',
    characters: ['luna', 'freya', 'miri'],
    objective: 'Выбрать мягкие и добрые фразы.',
    mechanics: 'Нажать один из трёх вариантов.',
    success: 'Выбран вариант с поддержкой друга.',
    failFeedback: 'Жёсткий ответ не проходит, можно выбрать заново.',
    rewardSticker: 'heart-hug',
    durationMin: 2,
  },
  {
    promptRu: 'Фрея расстроилась из-за башни. Что скажем?',
    promptEn: 'Freya is upset about the tower. What should we say?',
    options: [
      {
        ru: 'Давай вместе построим снова',
        en: 'Let us build it together again',
        kind: 'good',
        okRu: 'Тепло и дружно! Фрея улыбается.',
        okEn: 'Warm and kind! Freya smiles.',
      },
      {
        ru: 'Это просто башня',
        en: 'It is just a tower',
        kind: 'neutral',
        okRu: 'Не обидно, но можно мягче.',
        okEn: 'Not mean, but we can be softer.',
      },
      {
        ru: 'Не плачь!',
        en: 'Do not cry!',
        kind: 'neutral',
        okRu: 'Слишком резко. Выбери добрее.',
        okEn: 'Too sharp. Pick a kinder one.',
      },
    ],
  },
);
