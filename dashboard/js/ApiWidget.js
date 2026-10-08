import UIComponent from "./UIComponent.js";

const timeFormat = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });

/* Базовый класс для виджетов, которые берут данные из сети.
   Здесь ОДИН раз описан весь «путь данных» из ТЗ:
     загрузка → fetch → response.ok → response.json() → выбор поля → textContent
   и состояния: загрузка / данные / пусто / ошибка + «источник и время» + «устарело».

   Наследник пишет только своё:
     fetchData(signal)  — сходить в API и вернуть нужные данные (или null, если пусто)
     renderData(box, d) — нарисовать данные (только через textContent!)
     renderControls()   — (по желанию) поле выбора / поиска над данными */
export default class ApiWidget extends UIComponent {
    constructor({ id, title, kind, sourceName, sourceUrl }) {
        super({ id, title, kind });
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.controller = null;  // AbortController текущего запроса
        this.lastData = null;    // последние УСПЕШНЫЕ данные (для «устарело»)
        this.lastUpdated = null; // время последнего успешного обновления
        this.busy = false;
        this.failed = false;
        this.isStale = false;
    }

    /* ── Переопределяются в наследниках ── */
    async fetchData(signal) { throw new Error("fetchData() не реализован"); }
    isEmpty(data) { return !data; }
    renderData(container, data) {}
    renderControls() { return null; }
    emptyMessage() { return "Нет данных."; }
    errorMessage() { return "Не удалось загрузить данные. Проверьте соединение и нажмите «Повторить»."; }

    /* Один запрос: fetch → проверка response.ok → JSON.
       Заголовки (например ключ API) передаются третьим аргументом — см. config.js */
    async getJSON(url, signal, headers = {}) {
        const response = await fetch(url, { signal, headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    render() {
        const element = super.render();

        const controls = this.renderControls();
        if (controls) element.appendChild(controls);

        this.content = document.createElement("div");
        this.content.className = "api-content";
        this.content.setAttribute("aria-live", "polite");

        element.append(this.content, this.createFooter());
        this.load();
        return element;
    }

    createFooter() {
        const footer = document.createElement("div");
        footer.className = "api-footer";

        const meta = document.createElement("div");
        meta.className = "api-footer__meta";

        const source = document.createElement("span");
        const link = document.createElement("a");
        link.href = this.sourceUrl;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = this.sourceName;
        source.append("Источник: ", link);

        this.timeEl = document.createElement("span");

        this.staleEl = document.createElement("span");
        this.staleEl.className = "badge";
        this.staleEl.textContent = "устарело";
        this.staleEl.hidden = true;

        meta.append(source, this.timeEl, this.staleEl);

        // Кнопка есть всегда: «Обновить»; после ошибки подпись меняется на «Повторить»
        this.refreshBtn = document.createElement("button");
        this.refreshBtn.className = "glass";
        this.refreshBtn.type = "button";
        this.listen(this.refreshBtn, "click", () => this.load());

        footer.append(meta, this.refreshBtn);
        this.updateFooter();
        return footer;
    }

    updateFooter() {
        if (this.busy) {
            this.timeEl.textContent = "обновляем…";
        } else if (this.lastUpdated) {
            this.timeEl.textContent = `обновлено в ${timeFormat.format(this.lastUpdated)}`;
        } else {
            this.timeEl.textContent = "данных пока нет";
        }
        this.staleEl.hidden = !this.isStale;
        this.refreshBtn.textContent = this.failed ? "Повторить" : "Обновить";
    }

    async load() {
        if (!this.element) return;

        this.controller?.abort(); // отменяем предыдущий незавершённый запрос
        const controller = new AbortController();
        this.controller = controller;

        this.busy = true;
        this.element.classList.add("is-loading");
        this.element.setAttribute("aria-busy", "true");
        if (!this.lastData) this.showMessage("loading", "Загрузка…");
        this.updateFooter();

        try {
            const data = await this.fetchData(controller.signal);
            this.lastUpdated = new Date();
            this.failed = false;
            this.isStale = false;

            if (this.isEmpty(data)) {
                this.lastData = null;
                this.showMessage("empty", this.emptyMessage());
            } else {
                this.lastData = data;
                this.showData(data);
            }
        } catch (error) {
            if (error.name === "AbortError") return; // нас отменили — это не ошибка
            this.failed = true;

            if (this.lastData) {
                // Старые данные не прячем, а помечаем как устаревшие
                this.isStale = true;
                this.showData(this.lastData);
                const since = this.lastUpdated ? ` (от ${timeFormat.format(this.lastUpdated)})` : "";
                this.content.appendChild(this.makeStatus("error", `Не удалось обновить — показаны прошлые данные${since}.`));
            } else {
                this.showMessage("error", this.errorMessage());
            }
        } finally {
            // Если запустили новый запрос, то «занято» снимет именно он
            if (this.controller === controller) {
                this.busy = false;
                this.element?.classList.remove("is-loading");
                this.element?.removeAttribute("aria-busy");
                this.updateFooter();
            }
        }
    }

    showData(data) {
        this.content.replaceChildren();
        this.renderData(this.content, data);
    }

    showMessage(kind, text) {
        this.content.replaceChildren(this.makeStatus(kind, text));
    }

    makeStatus(kind, text) {
        const p = document.createElement("p");
        p.className = kind === "error" ? "status error" : "status";
        p.textContent = text;
        return p;
    }

    destroy() {
        this.controller?.abort();
        super.destroy();
    }
}
