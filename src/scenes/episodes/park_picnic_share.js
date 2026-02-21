import { createChoiceEpisode } from './common.js';

export default createChoiceEpisode(
  {
    id: 'park-picnic-share',
    titleRu: 'Пикник: делимся вкусняшкой',
    titleEn: 'Picnic Sharing',
    locationId: 'park',
    characters: ['rozi', 'miri', 'pip'],
    objective: 'Выбрать поступок с заботой о друзьях.',
    mechanics: 'Три варианта с мягкими последствиями.',
    success: 'Выбран вариант с делением и приглашением.',
    failFeedback: 'Резкий вариант не блокирует, можно выбрать снова.',
    rewardSticker: 'cupcake',
    durationMin: 2,
  },
  {
    promptRu: 'У Пипа одно печенье. Что сделать?',
    promptEn: 'Pip has one cookie. What to do?',
    options: [
      {
        ru: 'Разломить и поделиться',
        en: 'Split and share',
        kind: 'good',
        okRu: 'Все рады! Пикник стал дружнее.',
        okEn: 'Everyone is happy! Picnic is kinder.',
      },
      {
        ru: 'Спрятать печенье',
        en: 'Hide the cookie',
        kind: 'neutral',
        okRu: 'Становится грустно. Попробуй добрый вариант.',
        okEn: 'Feels sad. Try a kind option.',
      },
      {
        ru: 'Съесть одному',
        en: 'Eat alone',
        kind: 'neutral',
        okRu: 'Можно лучше: делиться приятно.',
        okEn: 'We can do better: sharing feels nice.',
      },
    ],
  },
);
