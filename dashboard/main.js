import Dashboard from "./js/Dashboard.js";

const $ = (id) => document.getElementById(id);

/* ═══ 1. КУРСОР-КОРОВА (только на компьютере) — САМЫМ ПЕРВЫМ ═══ */
const bull = $("bullCursor");
if (bull && matchMedia("(pointer:fine)").matches) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let cx = mx, cy = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    (function follow() {
        cx += (mx - cx) * 0.22;
        cy += (my - cy) * 0.22;
        bull.style.left = cx + "px";
        bull.style.top = cy + "px";
        requestAnimationFrame(follow);
    })();
    document.addEventListener("mouseover", (e) =>
        bull.classList.toggle("is-hover", !!e.target.closest("a,button,input,select,textarea,label"))
    );
    document.addEventListener("mousedown", () => bull.classList.add("is-click"));
    document.addEventListener("mouseup", () => bull.classList.remove("is-click"));
}

/* ═══ 2. МЕНЮ (бургер) ═══ */
const nav = $("nav");
const burger = $("burger");
function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ═══ 3. ТЕМА (светлая / тёмная) ═══ */
const themeBtn = $("themeBtn");
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme, save = true) {
    const root = document.documentElement;
    root.classList.add("theme-fade");
    root.dataset.theme = theme;
    themeBtn.setAttribute("aria-pressed", theme === "dark");
    if (save) { try { localStorage.setItem("roseTheme", theme); } catch (e) {} }
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
    setTimeout(() => root.classList.remove("theme-fade"), 500);
}
themeBtn.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
applyTheme(document.documentElement.dataset.theme || "light", false);

/* ═══ 4. КОРОВА В ШАПКЕ: клик — крутится ═══ */
const dashCow = $("dashCow");
if (dashCow) {
    dashCow.addEventListener("click", () => {
        dashCow.querySelector("img").animate(
            [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
            { duration: 800, easing: "cubic-bezier(0.45, 0.05, 0.2, 1)" }
        );
    });
}

/* ═══ 5. ВИДЖЕТЫ — В КОНЦЕ ═══ */
const dashboard = new Dashboard("dashboard");
["weather", "country", "todo", "quote"].forEach((type) => {
    try {
        dashboard.addWidget(type);
    } catch (error) {
        console.error(`Виджет «${type}» не создан:`, error);
    }
});