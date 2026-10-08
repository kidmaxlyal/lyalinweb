import ApiWidget from "./ApiWidget.js";
import GlassSelect from "./GlassSelect.js";
import { CONFIG } from "./config.js";

/* Виджет «Страна назначения»: флаг, название, столица, население.
   Данные — factbook.json (зеркало CIA World Factbook на GitHub).
   GitHub raw поддерживает CORS, ключ не нужен.
   Флаг — flagcdn.com (статичный SVG по коду ISO2). */
export default class ScheduleWidget extends ApiWidget {
    constructor(config = {}) {
        super({
            id: config.id,
            title: config.title || "Страна назначения",
            kind: "country",
            sourceName: "factbook.json · flagcdn",
            sourceUrl: "https://github.com/factbook/factbook.json",
        });
        this.currentCountry = CONFIG.countries[0];
        this.select = null;
    }

    /* Управление: стеклянный выпадающий список стран */
    renderControls() {
        this.select = new GlassSelect({
            id: `${this.id}-country`,
            label: "Направление",
            options: CONFIG.countries.map((c) => ({ label: c.name, value: c.code })),
            value: 0,
            onChange: (index) => {
                this.currentCountry = CONFIG.countries[index];
                this.load();
            },
        });
        return this.select.render();
    }

    async fetchData(signal) {
        const { code, region, gec, name } = this.currentCountry;

        // factbook.json: /master/{region}/{gec}.json
        const url = `${CONFIG.countriesApi.baseUrl}/${region}/${gec}.json`;
        const data = await this.getJSON(url, signal);
        if (!data || !data.Government) throw new Error("Страна не найдена");

        // Столица: Government.Capital.name.text
        const capital =
            data.Government?.Capital?.name?.text ||
            data.Government?.Capital?.name ||
            "—";

        // Население: в актуальной версии — People and Society.Population.total.text
        // (в старых версиях могло быть просто People.Population.text)
        const populationText =
            data["People and Society"]?.Population?.total?.text ||
            data["People and Society"]?.Population?.text ||
            data.People?.Population?.total?.text ||
            data.People?.Population?.text ||
            "";

        const population = parsePopulation(populationText);

        // Флаг — статичный SVG по ISO2-коду (tr, eg, ge, th, ru)
        const flagSrc = `${CONFIG.countriesApi.flagUrl}/${code.toLowerCase()}.svg`;

        return { name, capital, population, flagSrc };
    }

    isEmpty(data) {
        return !data || !data.name;
    }

    emptyMessage() {
        return "Сервис не вернул данные о стране.";
    }

    renderData(container, data) {
        const head = document.createElement("div");
        head.className = "country-header";

        if (data.flagSrc) {
            const flag = document.createElement("img");
            flag.className = "country-flag";
            flag.src = data.flagSrc;
            flag.alt = `Флаг: ${data.name}`;
            flag.loading = "lazy";
            head.appendChild(flag);
        }

        const name = document.createElement("strong");
        name.className = "country-name";
        name.textContent = data.name;
        head.appendChild(name);

        const facts = document.createElement("dl");
        facts.className = "country-facts";
        facts.appendChild(makeFact("Столица", data.capital || "—"));
        facts.appendChild(makeFact(
            "Население",
            Number.isFinite(data.population)
                ? data.population.toLocaleString("ru-RU") + " чел."
                : "—"
        ));

        container.append(head, facts);
    }

    destroy() {
        this.select?.destroy();
        super.destroy();
    }
}

/* "84,625,585 (2025 est.)" → 84625585 */
function parsePopulation(text) {
    if (!text) return null;
    const match = String(text).replace(/,/g, "").match(/\d+/);
    return match ? Number(match[0]) : null;
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