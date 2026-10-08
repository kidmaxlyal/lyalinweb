import ApiWidget from "./ApiWidget.js";
import GlassSelect from "./GlassSelect.js";
import { CONFIG } from "./config.js";

/* Виджет «Моё расписание»: занятия выбранного дня текущей недели.
   API: schedule.sutd.ru  GET /api/group_schedule/?group_id=310&lang=ru&week_start=ГГГГ-ММ-ДД
   Нужные поля ответа:
     week_type ("num" | "den"), week_type_ru, week_start
     schedule[]: weekday, start_time, end_time, subject, lesson_type, teacher,
                 classroom_localized, week_type ("num" | "den" | "both"), is_exam, date
   Путь данных тот же, что у остальных: ApiWidget.load() → getJSON → textContent. */

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function addDays(iso, n) {
    const [y, m, d] = iso.split("-").map(Number);
    return toISO(new Date(y, m - 1, d + n));
}
// Понедельник недели, в которой лежит дата (ISO-строка)
function mondayOf(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return addDays(iso, 1 - (new Date(y, m - 1, d).getDay() || 7));
}
// Сколько полных недель между двумя понедельниками (ISO-строки)
function weeksBetween(fromIso, toIso) {
    const t = (iso) => { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); };
    return Math.round((t(toIso) - t(fromIso)) / (7 * 24 * 3600 * 1000));
}
// "–" в этом API означает «нет данных»
const clean = (value) => (value && value !== "–" ? String(value) : "");

export default class TimetableWidget extends ApiWidget {
    constructor(config = {}) {
        super({
            id: config.id,
            title: config.title || "Моё расписание",
            kind: "timetable",
            sourceName: CONFIG.timetable.sourceName,
            sourceUrl: CONFIG.timetable.sourceUrl,
        });
        // getDay(): 0 = вс … 6 = сб → превращаем в 1…7 (пн…вс)
        this.day = new Date().getDay() || 7;
        this.select = null;
    }

    // Управление параметром данных: выбор дня недели
    renderControls() {
        this.select = new GlassSelect({
            id: `${this.id}-day`,
            label: "День недели",
            options: DAYS.map((name, i) => ({ label: name, value: i + 1 })),
            value: this.day - 1,
            onChange: (index) => {
                this.day = index + 1;
                this.load();
            },
        });
        return this.select.render();
    }

    async fetchData(signal) {
        const { url, params, headers } = CONFIG.timetable;
        const query = new URLSearchParams({ ...params, week_start: toISO(new Date()) });
        const data = await this.getJSON(`${url}?${query}`, signal, headers);
        if (!data || !Array.isArray(data.schedule)) throw new Error("Неверный формат расписания");

        // Считаем неделю сами: так виджет верен и с живым API, и с сохранённым файлом.
        // Если ответ относится к другой неделе, чётность числителя/знаменателя переворачиваем.
        const today = toISO(new Date());
        const monday = mondayOf(today);
        const shift = Math.abs(weeksBetween(mondayOf(data.week_start || today), monday)) % 2;
        const flip = { num: "den", den: "num" };
        const weekType = shift ? flip[data.week_type] ?? data.week_type : data.week_type;
        const weekTypeRu = shift ? (weekType === "num" ? "чис" : "знам") : data.week_type_ru;
        const dayDate = addDays(monday, this.day - 1); // дата выбранного дня на этой неделе

        const lessons = data.schedule
            .filter((item) => DAYS.indexOf(item.weekday) === this.day - 1)
            .filter((item) => {
                // Экзамены привязаны к конкретной дате
                if (item.date) return item.date === dayDate;
                // Обычные пары: каждую неделю или только числитель / знаменатель
                return item.week_type === "both" || item.week_type === weekType;
            })
            .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));

        return { lessons, weekTypeRu, dayDate };
    }

    isEmpty(data) {
        return !data || data.lessons.length === 0;
    }

    emptyMessage() {
        return "В этот день занятий нет.";
    }

    renderData(container, data) {
        if (data.weekTypeRu) {
            const week = document.createElement("p");
            week.className = "api-city";
            week.textContent = `Неделя: ${data.weekTypeRu}`;
            container.appendChild(week);
        }

        const list = document.createElement("ul");
        list.className = "timetable-list";

        data.lessons.forEach((item) => {
            const li = document.createElement("li");
            li.className = "timetable-item";

            const time = document.createElement("span");
            time.className = "timetable-time";
            time.textContent = item.end_time ? `${item.start_time}–${item.end_time}` : String(item.start_time ?? "");

            const body = document.createElement("div");

            const subject = document.createElement("strong");
            subject.textContent = item.subject || "Без названия";
            body.appendChild(subject);

            // Строка «тип · преподаватель» (экзамен помечаем отдельно)
            const info = [item.is_exam ? "Экзамен" : clean(item.lesson_type), clean(item.teacher)]
                .filter(Boolean)
                .join(" · ");
            if (info) body.appendChild(this.makeLine(info));

            const place = clean(item.classroom_localized) || clean(item.classroom);
            if (place) body.appendChild(this.makeLine(place));

            li.append(time, body);
            list.appendChild(li);
        });

        container.appendChild(list);
    }

    makeLine(text) {
        const line = document.createElement("span");
        line.className = "timetable-meta";
        line.textContent = text;
        return line;
    }

    errorMessage() {
        return "Не удалось загрузить расписание. Проверьте адрес API в config.js и нажмите «Повторить».";
    }

    destroy() {
        this.select?.destroy();
        super.destroy();
    }
}
