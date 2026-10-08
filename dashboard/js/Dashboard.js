import ToDoWidget from "./ToDoWidget.js";
import WeatherWidget from "./WeatherWidget.js";
import ScheduleWidget from "./ScheduleWidget.js"; // «Страна назначения» (REST Countries)
import QuoteWidget from "./QuoteWidget.js";

// Тип виджета → его класс.
const WIDGET_TYPES = {
    weather: WeatherWidget,   // Open-Meteo
    country: ScheduleWidget,  // REST Countries
    todo: ToDoWidget,         // локальный (localStorage)
    quote: QuoteWidget,       // DummyJSON + MyMemory
};

export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
        this.nextId = 1;
    }

    addWidget(widgetType) {
        const Widget = WIDGET_TYPES[widgetType];
        if (!Widget) {
            console.warn(`Неизвестный тип виджета: ${widgetType}`);
            return;
        }
        const id = `widget-${this.nextId++}`;
        const widget = new Widget({ id });
        this.widgets.push(widget);
        this.container.appendChild(widget.render());
    }

    removeWidget(widgetId) {
        const widget = this.widgets.find((item) => item.id === widgetId);
        if (!widget) return;
        widget.destroy();
        this.widgets = this.widgets.filter((item) => item.id !== widgetId);
    }
}