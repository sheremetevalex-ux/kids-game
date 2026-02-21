import { createDragSortEpisode } from './common.js';

export default createDragSortEpisode(
  {
    id: 'shop-bag-sort',
    titleRu: 'Собери пакеты',
    titleEn: 'Pack the Bags',
    locationId: 'shop',
    characters: ['tommi', 'rozi'],
    objective: 'Разложить покупки по типам.',
    mechanics: 'Перетаскивать продукты в пакеты.',
    success: 'Каждый продукт в верном пакете.',
    failFeedback: 'Неподходящий пакет просит попробовать снова.',
    rewardSticker: 'gift-wow',
    durationMin: 4,
  },
  {
    promptRu: 'Разложи покупки аккуратно по пакетам.',
    promptEn: 'Sort groceries into the right bag.',
    categories: [
      { id: 'cold', ru: 'Холодное', en: 'Cold', color: '#8acfff' },
      { id: 'fragile', ru: 'Хрупкое', en: 'Fragile', color: '#ffc7a6' },
      { id: 'dry', ru: 'Сухое', en: 'Dry', color: '#f4dc8f' },
    ],
    items: [
      { id: 'milk', ru: 'Молоко', en: 'Milk', category: 'cold' },
      { id: 'yogurt', ru: 'Йогурт', en: 'Yogurt', category: 'cold' },
      { id: 'eggs', ru: 'Яйца', en: 'Eggs', category: 'fragile' },
      { id: 'berries', ru: 'Ягоды', en: 'Berries', category: 'fragile' },
      { id: 'pasta', ru: 'Макароны', en: 'Pasta', category: 'dry' },
      { id: 'rice', ru: 'Рис', en: 'Rice', category: 'dry' },
    ],
    failRu: 'Для этого товара нужен другой пакет.',
    failEn: 'This item needs another bag.',
  },
);
