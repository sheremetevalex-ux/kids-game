import { createSequenceEpisode } from './common.js';

export default createSequenceEpisode(
  {
    id: 'work-help-delivery',
    titleRu: 'Доставь помощь',
    titleEn: 'Help Delivery',
    locationId: 'workshop',
    characters: ['sem', 'niko', 'miri'],
    objective: 'Сделать шаги помощи по порядку.',
    mechanics: 'Порядок коротких действий.',
    success: 'Все шаги выполнены верно.',
    failFeedback: 'При ошибке шаги начинаются снова.',
    rewardSticker: 'car-zoom',
    durationMin: 3,
  },
  {
    promptRu: 'Собери и доставь набор помощи.',
    promptEn: 'Prepare and deliver a help pack.',
    steps: [
      { ru: 'Проверить список', en: 'Check list' },
      { ru: 'Собрать коробку', en: 'Pack box' },
      { ru: 'Постучать в дверь', en: 'Knock the door' },
      { ru: 'Сказать: «Вот помощь»', en: 'Say: “Here is help”' },
    ],
    failRu: 'Порядок перепутался. Давай снова.',
    failEn: 'Order mixed up. Try again.',
  },
);
