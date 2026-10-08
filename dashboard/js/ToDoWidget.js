import UIComponent from "./UIComponent.js";
import { CONFIG } from "./config.js";

/* Локальный виджет (без сети): список вещей в дорогу.
   Сохраняется в localStorage — после перезагрузки страницы список остаётся. */
export default class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            id: config.id,
            title: config.title || "Список вещей",
            kind: "todo",
        });
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.todo.storageKey));
            if (Array.isArray(saved)) return saved;
        } catch (error) { /* хранилище недоступно — просто начнём с шаблона */ }
        return CONFIG.todo.defaults.map((text, index) => ({ id: index + 1, text, completed: false }));
    }

    saveTasks() {
        try {
            localStorage.setItem(CONFIG.todo.storageKey, JSON.stringify(this.tasks));
        } catch (error) { /* не страшно */ }
    }

    render() {
        const element = super.render();

        const form = document.createElement("form");
        form.className = "todo-form";

        const label = document.createElement("label");
        label.className = "visually-hidden";
        label.htmlFor = `${this.id}-input`;
        label.textContent = "Новая вещь";

        const input = document.createElement("input");
        input.className = "field";
        input.type = "text";
        input.id = `${this.id}-input`;
        input.placeholder = "Например: зонт";
        input.autocomplete = "off";

        const addButton = document.createElement("button");
        addButton.className = "glass";
        addButton.type = "submit";
        addButton.textContent = "Добавить";

        this.counter = document.createElement("p");
        this.counter.className = "todo-counter";

        this.list = document.createElement("ul");
        this.list.className = "todo-list";

        form.append(label, input, addButton);
        element.append(form, this.counter, this.list);

        this.listen(form, "submit", (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            this.tasks.push({ id: Date.now(), text, completed: false });
            this.saveTasks();
            input.value = "";
            this.renderTasks();
            input.focus();
        });

        // Делегирование: один слушатель на весь список, а не по одному на каждую задачу
        this.listen(this.list, "change", (event) => {
            if (!event.target.matches("input[type=checkbox]")) return;
            const task = this.findTask(event.target);
            if (task) {
                task.completed = event.target.checked;
                this.saveTasks();
                this.renderTasks();
            }
        });

        this.listen(this.list, "click", (event) => {
            if (!event.target.matches(".delete-task")) return;
            const task = this.findTask(event.target);
            if (task) {
                this.tasks = this.tasks.filter((item) => item.id !== task.id);
                this.saveTasks();
                this.renderTasks();
            }
        });

        this.renderTasks();
        return element;
    }

    findTask(node) {
        const id = Number(node.closest("li")?.dataset.id);
        return this.tasks.find((task) => task.id === id);
    }

    renderTasks() {
        this.list.replaceChildren();

        const done = this.tasks.filter((task) => task.completed).length;
        this.counter.textContent = this.tasks.length ? `Собрано ${done} из ${this.tasks.length}` : "";

        if (this.tasks.length === 0) {
            const empty = document.createElement("li");
            empty.className = "empty-state";
            empty.textContent = "Пока ничего нет — добавьте первую вещь";
            this.list.appendChild(empty);
            return;
        }

        this.tasks.forEach((task) => {
            const item = document.createElement("li");
            item.className = task.completed ? "todo-item completed" : "todo-item";
            item.dataset.id = task.id;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", `Собрано: ${task.text}`);

            const text = document.createElement("span");
            text.textContent = task.text;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "Удалить";
            deleteButton.setAttribute("aria-label", `Удалить: ${task.text}`);

            item.append(checkbox, text, deleteButton);
            this.list.appendChild(item);
        });
    }
}
