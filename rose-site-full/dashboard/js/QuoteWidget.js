import ApiWidget from "./ApiWidget.js";
import { CONFIG } from "./config.js";

/* Виджет «Мысль в дорогу»: случайная цитата.
   DummyJSON отдаёт англ. цитату, MyMemory переводит на русский.
   Оба API без ключа и с открытым CORS. */
export default class QuoteWidget extends ApiWidget {
    constructor(config = {}) {
        super({
            id: config.id,
            title: config.title || "Мысль в дорогу",
            kind: "quote",
            sourceName: "DummyJSON · MyMemory",
            sourceUrl: "https://dummyjson.com/docs/quotes",
        });
    }

    async fetchData(signal) {
        // 1. Случайная цитата (англ.)
        const random = await this.getJSON(CONFIG.quotes.randomUrl, signal);
        if (!random || !random.quote) throw new Error("Пустой ответ DummyJSON");

        // 2. Перевод на русский (если упадёт — покажем оригинал)
        let translatedText = random.quote;
        try {
            const params = new URLSearchParams({
                q: random.quote,
                langpair: "en|ru",
            });
            const translated = await this.getJSON(`${CONFIG.quotes.translateUrl}?${params}`, signal);
            if (translated?.responseData?.translatedText) {
                translatedText = translated.responseData.translatedText;
            }
        } catch (error) {
            if (error.name === "AbortError") throw error;
            // перевод не удался — не критично
        }

        return { quoteText: translatedText, quoteAuthor: random.author };
    }

    isEmpty(data) {
        return !data || !data.quoteText;
    }

    emptyMessage() {
        return "Сервис не вернул цитату.";
    }

    renderData(container, data) {
        const blockquote = document.createElement("blockquote");
        blockquote.className = "quote-text";
        blockquote.textContent = `«${data.quoteText.trim()}»`;

        const author = document.createElement("p");
        author.className = "author";
        author.textContent = data.quoteAuthor
            ? `— ${data.quoteAuthor.trim()}`
            : "— Неизвестный автор";

        container.append(blockquote, author);
    }
}