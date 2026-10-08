# Дашборд «Поездка»

Учебная работа «Практика 2 · Создание дашборда с данными из API».
Чистые HTML / CSS / JavaScript (ES6-модули, классы), без фреймворков и без API-ключей.

## Тема и пользователь

**Пользователь:** человек, который собирается в поездку.
**Вопрос панели:** «Что меня ждёт на месте и что взять с собой?»

Панель оформлена в стиле моего сайта-визитки (Rose Design): Liquid Glass, шрифты, цвета логотипа,
светлая и тёмная темы. Общие стили берутся из `../style.css`, в папке `styles/` лежит только то,
что относится к дашборду. В бургер-меню портфолио есть ссылка на эту страницу.

## Виджеты

| № | Виджет | Источник данных | Управление параметром |
|---|--------|-----------------|-----------------------|
| 1 | Погода в пункте назначения | **Open-Meteo** (сеть) | выбор города из списка |
| 2 | Страна назначения (флаг, столица, население) | **REST Countries** (сеть) | выбор страны из списка |
| 3 | Список вещей | локальный, `localStorage` | добавить / отметить / удалить |
| 4 | Цитата в дорогу | **DummyJSON** + перевод **MyMemory** (сеть) | кнопка «Обновить» (новая цитата) |

Три разных сетевых API. Каждый API-виджет показывает: загрузку, данные, пустой результат, ошибку,
источник и время последнего успешного обновления; при ошибке старые данные остаются на экране с пометкой «устарело».
Ошибка одного API не ломает остальные виджеты (у каждого свой запрос и свой `AbortController`).

## API, документация и примеры запросов

1. **Open-Meteo** — https://open-meteo.com/en/docs (без ключа)
   `GET https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
   Поля: `current.temperature_2m`, `current.apparent_temperature`, `current.weather_code`, `current.wind_speed_10m`.

2. **REST Countries** — https://restcountries.com/ (без ключа, CORS открыт)
   `GET https://restcountries.com/v3.1/alpha/tr?fields=name,capital,population,flags,translations`
   Поля: `name.common`, `translations.rus.common`, `capital[]`, `population`, `flags.svg`.
   Управление: выбор страны из списка (TR, EG, GE, TH, RU — в `js/config.js`).

3. **DummyJSON Quotes** — https://dummyjson.com/docs/quotes (без ключа)
   `GET https://dummyjson.com/quotes/random` → `{ id, quote, author }`.
   Перевод на русский — MyMemory: https://mymemory.translated.net/doc/spec.php
   `GET https://api.mymemory.translated.net/get?q=...&langpair=en|ru` → `responseData.translatedText`.
   Если перевод не удался — показываем оригинал.

## Путь данных (для защиты)

Кнопка / загрузка страницы → `ApiWidget.load()` → `fetch()` (`getJSON`) → проверка `response.ok` →
`response.json()` → выбор поля → вывод через `textContent`. Эта цепочка описана один раз в `js/ApiWidget.js`.
Например, для погоды строка вывода: `temperature.textContent = \`${Math.round(data.temperature_2m)} °C\`` в `js/WeatherWidget.js`.
Данные API нигде не вставляются через `innerHTML`.

## Структура

```text
index.html            ← портфолио (в меню есть ссылка на дашборд)
style.css, script.js  ← портфолио
images/, fonds/, assets/
dashboard/
├── index.html
├── main.js
├── README.md
├── js/
│   ├── config.js         ← города, страны, адреса API (все настройки здесь)
│   ├── UIComponent.js    ← базовый класс виджета
│   ├── ApiWidget.js      ← базовый класс сетевых виджетов
│   ├── GlassSelect.js    ← стеклянный выпадающий список (замена <select>)
│   ├── WeatherWidget.js
│   ├── ScheduleWidget.js ← «Страна назначения»
│   ├── ToDoWidget.js
│   ├── QuoteWidget.js
│   └── Dashboard.js
└── styles/
    ├── main.css          ← страница и адаптивная сетка (mobile-first)
    └── components.css    ← виджеты