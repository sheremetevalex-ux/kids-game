# Город Добрых Дел (City of Kind Deeds)

Мобильная офлайн-PWA игра для детей 4+ лет: карта из 6 локаций и 18 мини-эпизодов про доброту, эмоции, бытовые привычки и простую логику.

- Технологии: `HTML + CSS + JS (ES modules)`
- Без сервера, без API, без внешних CDN
- Всё хранится локально (`localStorage`)

## FAST START (RU)

1. Выберите вариант публикации:
- Вариант A (рекомендовано): загрузите проект на GitHub Pages / Cloudflare Pages (HTTPS).
- Вариант B: запустите локально на ноутбуке в одной Wi‑Fi сети.

2. Откройте ссылку на телефоне.

3. Установите на главный экран:
- iPhone/iPad: `Поделиться` -> `На экран Домой` -> `Добавить`.
- Android Chrome: `⋮` -> `Установить приложение` / `Добавить на главный экран`.

4. Запускайте игру с иконки. После установки игра работает офлайн.

## Запуск локально (Option B, same Wi‑Fi)

### Способ 1: Python
```bash
python3 -m http.server 8080
```

### Способ 2: serve
```bash
npx serve . -l 8080
```

Откройте с телефона: `http://<IP-НОУТБУКА>:8080`
Пример: `http://192.168.1.23:8080`

Как узнать IP ноутбука:
- macOS/Linux: `ipconfig getifaddr en0` (или `ifconfig`)
- Windows: `ipconfig`

Важно для iOS:
- При HTTP игра откроется в Safari и будет играбельна.
- Полная установка/офлайн-PWA на iOS часто требует HTTPS.
- Простой обход: опубликовать на GitHub Pages/Netlify/Cloudflare Pages.

## Publish to GitHub (RU)

1. Создайте репозиторий на GitHub, например: `kids-kind-city`.
2. Загрузите все файлы проекта в корень репозитория (`main` branch).
3. Выберите один способ хостинга:

### A) GitHub Pages
- Откройте `Settings -> Pages`
- Source: `Deploy from a branch`
- Branch: `main` / `root`
- После публикации откройте URL Pages на телефоне и установите как PWA.

### B) Cloudflare Pages
- Подключите репозиторий GitHub в Cloudflare Pages
- Build command: пусто
- Output directory: корень репозитория
- После деплоя откройте URL на телефоне и установите как PWA.

## Troubleshooting

- Обновления не видны:
1. Закройте приложение полностью и откройте снова.
2. В родительской панели нажмите `Check for update`.
3. Если появится запрос на перезагрузку, подтвердите.

- На iOS нет звука:
- Это ограничение iOS. Нужен первый тап по `Начать со звуком`.

## Управление для ребёнка

- Старт: большие кнопки `Играть` и `Наклейки`
- В эпизодах: `Пауза` и `Домой` (с подтверждением)
- Маленькая шестерёнка (родительская панель): удерживать 2 секунды

## Родительская панель (English)

Math gate: `2 + 3 = ?`

Options:
- Reset progress
- Difficulty: easy/normal
- Unlock all episodes toggle
- Calm Corner reminders toggle
- Performance mode: normal/low
- Music and SFX toggles
- Check for update
- Show install card again

## Эпизоды (18)

### Дом
- `home-routine` — утренний порядок (sequence)
- `home-tidy` — сортировка игрушек (drag & drop)
- `home-kind-words` — добрые слова (choice)

### Парк
- `park-turn-slide` — очередь на горку (turn-taking)
- `park-lost-toy` — поиск 5 объектов (find objects)
- `park-picnic-share` — делимся на пикнике (choice)

### Магазин
- `shop-color-shape` — сортировка по цвету/форме (drag & drop)
- `shop-queue-kindness` — вежливая очередь (choice)
- `shop-bag-sort` — сбор пакетов (drag & drop)

### Площадка
- `play-sandcastle-puzzle` — пазл 6 частей
- `play-swing-turns` — очередь на качелях
- `play-cross-street` — переход на зелёный (safety)

### Мастерская
- `work-fix-birdhouse` — починка скворечника (matching)
- `work-tool-match` — инструмент к задаче (matching)
- `work-help-delivery` — доставка помощи (sequence)

### Тихий уголок
- `calm-balloon-breath` — дыхание шариком
- `calm-cloud-count` — спокойный счёт
- `calm-heart-hug` — ритм сердца

## PWA Notes

- `manifest.webmanifest`: корректные `name`, `short_name`, `start_url`, `scope`, `display`, `icons`
- `sw.js`: versioned cache + offline fallback
- iOS safe area и standalone meta tags в `index.html`
- Relative paths only (работает и в суб-папке GitHub Pages)

## Privacy / Security

- Нет аналитики
- Нет трекинга
- Нет внешних запросов
- Все данные только локально на устройстве

## Developer Notes (EN)

### Local run
Use any static server. No build step required.

### Add new episode
1. Create a file in `src/scenes/episodes/`.
2. Use a factory from `src/scenes/episodes/common.js` or custom episode object.
3. Add the episode import to `src/scenes/episodes/index.js`.
4. Add its id to location order in `src/data.js` (`LOCATION_EPISODES`).
5. Add it to `sw.js` precache list.

### PWA cache update
Increment `CACHE_VERSION` in `sw.js` for release updates.
