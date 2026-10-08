/* Базовый класс всех виджетов: рисует рамку (секцию), заголовок и умеет
   аккуратно удаляться (снимает слушатели событий). */
export default class UIComponent {
    constructor({ title, id, kind = "generic", onClose = null }) {
        this.title = title;
        this.id = id;
        this.kind = kind;       // идёт в CSS-класс widget--weather, widget--todo …
        this.onClose = onClose; // если передать функцию — в углу появится кнопка «×»
        this.element = null;
        this.listeners = [];
    }

    render() {
        const element = document.createElement("section");
        element.className = `widget widget--${this.kind}`;
        element.id = this.id;
        element.setAttribute("aria-labelledby", `${this.id}-title`);

        const header = document.createElement("div");
        header.className = "widget-header";

        const title = document.createElement("h2");
        title.id = `${this.id}-title`;
        title.textContent = this.title;
        header.appendChild(title);

        if (this.onClose) {
            const closeButton = document.createElement("button");
            closeButton.className = "glass icon-btn";
            closeButton.type = "button";
            closeButton.textContent = "×";
            closeButton.setAttribute("aria-label", `Удалить виджет ${this.title}`);
            this.listen(closeButton, "click", () => this.onClose());
            header.appendChild(closeButton);
        }

        element.appendChild(header);
        this.element = element;
        return element;
    }

    // Все слушатели регистрируем через listen(), чтобы destroy() снял их разом
    listen(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    }

    destroy() {
        for (const { element, event, handler } of this.listeners) {
            element.removeEventListener(event, handler);
        }
        this.listeners = [];

        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
