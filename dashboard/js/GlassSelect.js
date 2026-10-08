/* Стеклянный выпадающий список (замена <select>).
   Кнопка снаружи — как .glass, список — «стеклянная» панель с опциями.
   Поддерживает мышь, клавиатуру (↓ ↑ Esc Enter), закрытие по клику снаружи. */
export default class GlassSelect {
    constructor({ id, label, options, value = 0, onChange }) {
        this.id = id;
        this.label = label;
        this.options = options;    // [{ label, value }]
        this.value = value;
        this.onChange = onChange;  // (index, option) => {}
        this.isOpen = false;
        this.listeners = [];
        this.element = null;
    }

    render() {
        const wrap = document.createElement("div");
        wrap.className = "widget-controls";

        if (this.label) {
            const label = document.createElement("span");
            label.className = "field-label";
            label.id = `${this.id}-label`;
            label.textContent = this.label;
            wrap.appendChild(label);
        }

        const root = document.createElement("div");
        root.className = "glass-select";
        root.id = this.id;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "glass-select__button";
        button.setAttribute("aria-haspopup", "listbox");
        button.setAttribute("aria-expanded", "false");
        if (this.label) button.setAttribute("aria-labelledby", `${this.id}-label ${this.id}-value`);

        const value = document.createElement("span");
        value.className = "glass-select__value";
        value.id = `${this.id}-value`;
        value.textContent = this.options[this.value]?.label ?? "";

        const arrow = document.createElement("span");
        arrow.className = "glass-select__arrow";
        arrow.setAttribute("aria-hidden", "true");

        button.append(value, arrow);

        const list = document.createElement("ul");
        list.className = "glass-select__list";
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-labelledby", `${this.id}-label`);
        list.hidden = true;

        this.options.forEach((opt, i) => {
            const li = document.createElement("li");
            li.className = "glass-select__option";
            li.setAttribute("role", "option");
            li.dataset.index = i;
            li.textContent = opt.label;
            const on = i === this.value;
            li.classList.toggle("is-selected", on);
            li.setAttribute("aria-selected", on ? "true" : "false");
            list.appendChild(li);
        });

        root.append(button, list);
        wrap.appendChild(root);

        this.element = root;
        this.buttonEl = button;
        this.listEl = list;
        this.valueEl = value;

        this.bind(button, "click", (e) => {
            e.stopPropagation();
            this.isOpen ? this.close() : this.open();
        });

        this.bind(button, "keydown", (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (!this.isOpen) this.open();
                this.moveFocus(e.key === "ArrowDown" ? 1 : -1);
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.isOpen ? this.close() : this.open();
            } else if (e.key === "Escape" && this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });

        this.bind(list, "click", (e) => {
            const item = e.target.closest(".glass-select__option");
            if (!item) return;
            e.stopPropagation();
            this.select(Number(item.dataset.index));
        });

        this.bind(document, "click", (e) => {
            if (this.isOpen && !this.element.contains(e.target)) this.close();
        });

        return wrap;
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.listEl.hidden = false;
        this.element.classList.add("is-open");
        this.buttonEl.setAttribute("aria-expanded", "true");
        this.listEl.querySelector(".is-selected")?.scrollIntoView({ block: "nearest" });
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.listEl.hidden = true;
        this.element.classList.remove("is-open");
        this.buttonEl.setAttribute("aria-expanded", "false");
        this.listEl.querySelectorAll(".is-focused").forEach((el) => el.classList.remove("is-focused"));
    }

    select(index) {
        const option = this.options[index];
        if (!option) return;
        const changed = index !== this.value;
        this.value = index;
        this.valueEl.textContent = option.label;
        this.listEl.querySelectorAll(".glass-select__option").forEach((el, i) => {
            const on = i === index;
            el.classList.toggle("is-selected", on);
            el.setAttribute("aria-selected", on ? "true" : "false");
        });
        this.close();
        if (changed) this.onChange?.(index, option);
    }

    moveFocus(dir) {
        const items = [...this.listEl.querySelectorAll(".glass-select__option")];
        const current = items.findIndex((el) => el.classList.contains("is-focused"));
        let next = current;
        if (current === -1) next = dir > 0 ? 0 : items.length - 1;
        else next = (current + dir + items.length) % items.length;
        items.forEach((el) => el.classList.remove("is-focused"));
        items[next].classList.add("is-focused");
        items[next].scrollIntoView({ block: "nearest" });
    }

    bind(el, event, handler) {
        el.addEventListener(event, handler);
        this.listeners.push({ el, event, handler });
    }

    destroy() {
        for (const { el, event, handler } of this.listeners) el.removeEventListener(event, handler);
        this.listeners = [];
        this.element?.remove();
        this.element = null;
    }
}