/* ═══════════════════════════════════════════════════════════════════════
   НАСТРОЙКИ ДАШБОРДА «ПОЕЗДКА»
   Все настройки — здесь. Остальные файлы трогать не нужно.
   ═══════════════════════════════════════════════════════════════════════ */

export const CONFIG = {
  /* ── 1. ПУНКТЫ НАЗНАЧЕНИЯ (для виджета «Погода») ── */
  destinations: [
    { name: "Берлин", lat: 52.52, lon: 13.405 },
    { name: "Аахен", lat: 50.7753, lon: 6.0839 },
    { name: "Санкт-Петербург", lat: 59.9343, lon: 30.3351 },
    { name: "Москва", lat: 55.7558, lon: 37.6173 },
    { name: "Прага", lat: 50.0755, lon: 14.4378 },
    { name: "Париж", lat: 48.8566, lon: 2.3522 },
    { name: "Рим", lat: 41.9028, lon: 12.4964 },
    { name: "Стамбул", lat: 41.0082, lon: 28.9784 },
    { name: "Токио", lat: 35.6762, lon: 139.6503 },
  ],

  /* ── 2. ПОГОДА — Open-Meteo (без ключа, CORS открыт) ── */
  weather: {
    url: "https://api.open-meteo.com/v1/forecast",
  },

  /* ── 3. ЦИТАТЫ — DummyJSON + MyMemory (без изменений) ── */
  quotes: {
    randomUrl: "https://dummyjson.com/quotes/random",
    translateUrl: "https://api.mymemory.translated.net/get",
  },

  /* ── 4. СТРАНА НАЗНАЧЕНИЯ — factbook.json (зеркало CIA World Factbook).
     GitHub raw отдаёт статичные JSON-файлы и поддерживает CORS.
     Используются GEC-коды (не ISO) и регионы (папки):
       https://raw.githubusercontent.com/factbook/factbook.json/master/{region}/{gec}.json
     Столица: Government.Capital.name.text
     Население: People.Population.total.text                  */
  countries: [
    { name: "Турция",  code: "TR", region: "middle-east",           gec: "tu" },
    { name: "Египет",  code: "EG", region: "africa",                gec: "eg" },
    { name: "Грузия",  code: "GE", region: "central-asia", gec: "gg" },
    { name: "Таиланд", code: "TH", region: "east-n-southeast-asia", gec: "th" },
    { name: "Россия",  code: "RU", region: "central-asia", gec: "rs" },
  ],
  countriesApi: {
    baseUrl: "https://raw.githubusercontent.com/factbook/factbook.json/master",
    flagUrl: "https://flagcdn.com",
  },

  /* ── 5. СПИСОК ВЕЩЕЙ ── */
  todo: {
    storageKey: "roseTripTodo",
    defaults: ["Паспорт и билеты", "Зарядка и павербанк", "Банковская карта", "Аптечка"],
  },
};