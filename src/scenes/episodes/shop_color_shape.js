import { createDragSortEpisode } from './common.js';

export default createDragSortEpisode(
  {
    id: 'shop-color-shape',
    titleRu: 'Покупки по цвету и форме',
    titleEn: 'Color and Shape Shop',
    locationId: 'shop',
    characters: ['bobbi', 'luna'],
    objective: 'Сложить товары по корзинам.',
    mechanics: 'Перетаскивание по признакам.',
    success: 'Все товары в правильных корзинах.',
    failFeedback: 'Неверная корзина даёт мягкую подсказку.',
    rewardSticker: 'apple-red',
    durationMin: 5,
  },
  {
    promptRu: 'Перетащи покупки в подходящую корзину.',
    promptEn: 'Drag groceries to matching baskets.',
    categories: [
      { id: 'red-round', ru: 'Красные круги', en: 'Red round', color: '#ff9595' },
      { id: 'green-long', ru: 'Зелёные длинные', en: 'Green long', color: '#95dd9b' },
      { id: 'yellow-square', ru: 'Жёлтые квадраты', en: 'Yellow square', color: '#ffdb86' },
    ],
    items: [
      { id: 'tomato', ru: 'Томат', en: 'Tomato', category: 'red-round' },
      { id: 'apple', ru: 'Яблоко', en: 'Apple', category: 'red-round' },
      { id: 'cucumber', ru: 'Огурец', en: 'Cucumber', category: 'green-long' },
      { id: 'zucchini', ru: 'Кабачок', en: 'Zucchini', category: 'green-long' },
      { id: 'cheese', ru: 'Сыр', en: 'Cheese', category: 'yellow-square' },
      { id: 'butter', ru: 'Масло', en: 'Butter', category: 'yellow-square' },
    ],
    failRu: 'Почти! Смотри на цвет и форму.',
    failEn: 'Almost! Watch color and shape.',
  },
);
