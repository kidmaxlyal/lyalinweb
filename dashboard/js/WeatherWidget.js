import ApiWidget from "./ApiWidget.js";
import GlassSelect from "./GlassSelect.js";
import { CONFIG } from "./config.js";

// Расшифровка кодов погоды (weather_code из Open-Meteo, стандарт WMO)
const WEATHER_CODES = {
    0: "Ясно", 1: "Преимущественно ясно", 2: "Переменная облачность", 3: "Пасмурно",
    45: "Туман", 48: "Изморозь",
    51: "Лёгкая морось", 53: "Морось", 55: "Сильная морось", 56: "Ледяная морось", 57: "Ледяная морось",
    61: "Небольшой дождь", 63: "Дождь", 65: "Сильный дождь", 66: "Ледяной дождь", 67: "Ледяной дождь",
    71: "Небольшой снег", 73: "Снег", 75: "Сильный снег", 77: "Снежная крупа",
    80: "Ливень", 81: "Ливень", 82: "Сильный ливень", 85: "Снегопад", 86: "Сильный снегопад",
    95: "Гроза", 96: "Гроза с градом", 99: "Гроза с градом",
};
const WET = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
const SNOW = new Set([71, 73, 75, 77, 85, 86]);

// Короткий совет — ради него панель и нужна: помочь решить, что брать с собой
function advice(data) {
    if (WET.has(data.weather_code)) return "Возьмите зонт или дождевик.";
    if (SNOW.has(data.weather_code)) return "Нужна тёплая обувь и шапка.";
    if (data.temperature_2m <= 5) return "Оденьтесь потеплее.";
    if (data.temperature_2m >= 25) return "Лёгкая одежда и бутылка воды.";
    return "Погода комфортная.";
}

function makeFact(term, value) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
}

export default class WeatherWidget extends ApiWidget {
    constructor(config = {}) {
        super({
            id: config.id,
            title: config.title || "Погода",
            kind: "weather",
            sourceName: "Open-Meteo",
            sourceUrl: "https://open-meteo.com/",
        });
        this.destination = CONFIG.destinations[0];
        this.select = null;
    }

    // Управление параметром данных: выбор пункта назначения
    renderControls() {
        this.select = new GlassSelect({
            id: `${this.id}-city`,
            label: "Пункт назначения",
            options: CONFIG.destinations.map((place) => ({ label: place.name, value: place.name })),
            value: 0,
            onChange: (index) => {
                this.destination = CONFIG.destinations[index];
                this.load();
            },
        });
        return this.select.render();
    }

    async fetchData(signal) {
        const { lat, lon, name } = this.destination;
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
            timezone: "auto",
        });
        const data = await this.getJSON(`${CONFIG.weather.url}?${params}`, signal);
        if (!data.current) return null;
        return { ...data.current, place: name };
    }

    isEmpty(current) {
        return !current || !Number.isFinite(current.temperature_2m);
    }

    emptyMessage() { return "Сервис не вернул температуру для этого города."; }

    renderData(container, data) {
        const place = document.createElement("p");
        place.className = "api-city";
        place.textContent = data.place;

        const temperature = document.createElement("div");
        temperature.className = "temperature";
        temperature.textContent = `${Math.round(data.temperature_2m)} °C`;

        const description = document.createElement("p");
        description.className = "weather-desc";
        description.textContent = WEATHER_CODES[data.weather_code] ?? "Без описания";

        const facts = document.createElement("dl");
        facts.className = "facts";
        if (Number.isFinite(data.apparent_temperature)) {
            facts.appendChild(makeFact("Ощущается как", `${Math.round(data.apparent_temperature)} °C`));
        }
        if (Number.isFinite(data.wind_speed_10m)) {
            facts.appendChild(makeFact("Ветер", `${Math.round(data.wind_speed_10m)} км/ч`));
        }

        const tip = document.createElement("p");
        tip.className = "advice";
        tip.textContent = advice(data);

        container.append(place, temperature, description, facts, tip);
    }

    destroy() {
        this.select?.destroy();
        super.destroy();
    }
}