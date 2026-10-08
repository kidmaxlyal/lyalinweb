/* ═══════════════════════════════════════════════════════════════════════
   ROSE DESIGN — ЛОГИКА САЙТА
   Свои данные меняйте только в блоках 1–4. Всё остальное трогать не нужно.
   ═══════════════════════════════════════════════════════════════════════ */

/* ═══ 1. ВАШИ ДАННЫЕ ═══ */
const ME = {
  name: "Лялин Максим",
  email: "maxlyal05@ya.ru",
  telegram: "https://t.me/kidrose",
  instagram: "https://instagram.com/kidrose",
  behance: "https://behance.net/kidrose",
  role: {
    ru: "Веб-дизайнер / графический дизайнер / UI/UX / разработчик",
    en: "Web Designer / Graphic Designer / UI/UX / Developer",
  },
  extraEducation: {
    ru: "Мебель и интерьер",
    en: "Furniture and interior",
  },
};

/* ═══ 2. НАВЫКИ (level — от 0 до 100) ═══ */
const SKILLS = [
  { name: "Adobe Illustrator", icon: "Ai", level: 40 },
  { name: "Adobe Photoshop", icon: "Ps", level: 35 },
  { name: "Adobe After Effects", icon: "Ae", level: 25 },
  { name: "Figma", icon: "F", level: 30 },
  { name: "HTML / CSS / JS", icon: "<>", level: 10 },
];

/* ═══ 3. ПРОЕКТЫ (чтобы добавить работу — скопируйте блок { ... }) ═══ */
const PROJECTS = [
  {
    title: { ru: "Brand Identity", en: "Brand Identity" },
    tag: { ru: "Брендинг / графический дизайн", en: "Branding / Graphic Design" },
    desc: {
      ru: "Айдентика, паттерн, носители и визуальная система.",
      en: "Identity, pattern, brand assets and the complete visual system.",
    },
    image: "images/project-01-placeholder.png",
  },
  {
    title: { ru: "Сайт-визитка", en: "Business Card Website" },
    tag: { ru: "Веб-дизайн", en: "Web Design" },
    desc: {
      ru: "Разработка сайта-визитки с чистой типографикой и адаптивной вёрсткой.",
      en: "A business card website with clean typography and responsive layout.",
    },
    image: "images/project-02-placeholder.png",
  },
  {
    title: { ru: "МЕРЧ", en: "Merch" },
    tag: { ru: "Мерч / графический дизайн", en: "Merch / Graphic Design" },
    desc: {
      ru: "Разработка бейджей и мерча для выставки мебели.",
      en: "Badges and merchandise designed for a furniture exhibition.",
    },
    image: "images/project-03-placeholder.png",
  },
];

/* ═══ 4. ТЕКСТЫ САЙТА (RU / EN) ═══
   Ключ совпадает с атрибутом data-i18n в index.html */
const TEXT = {
  ru: {
    navAbout: "Кто я?", navServices: "Услуги", navPortfolio: "Работы", navSkills: "Навыки",
    navEducation: "Образование", navGame: "Игра", navContact: "Контакты",
    navDashboard: "Дашборд",
    heroEyebrow: "Креативное портфолио", heroCta: "Смотреть работы",
    aboutText: "Я создаю визуальные системы, сайты и графический дизайн, соединяя эстетику, типографику и функциональность.",
    aboutExtra: "Дополнительно:",
    service1: "Веб-дизайн", service2: "Графический дизайн", service3: "UI / UX", service4: "Веб-разработка",
    portfolioTitle: 'избранные<br>работы',
    skillsTitle: "Навыки",
    edu1Title: "Образование",
    edu1Text: "СПБГУПТД / ИИТА / ЦАТ<br>ИТ технологии создания цифрового контента / 2 курс",
    edu2Title: "Доп. образование",
    edu2Text: "СПО<br>Информационная безопасность автоматизированных систем",
    gameHint: "Кликайте по корове, пока не закончится время. Соберите как можно больше очков.",
    gameScore: "Счёт", gameReady: "Готовы? Нажмите «Старт».", gameStart: "Старт игры",
    gameTime: "Время", gameBest: "Рекорд", gameGo: "Ловите корову!",
    contactTitle: 'давай<br>поговорим.',
    send: "Отправить",
    formDone: "Форма готова — подключите обработчик отправки.",
    footerText: "Создано с использованием ИИ",
    loading: "Загрузка...", ready: "Готово",
    themeToggle: "Сменить тему",
  },
  en: {
    navAbout: "Who am I?", navServices: "Services", navPortfolio: "Work", navSkills: "Skills",
    navEducation: "Education", navGame: "Game", navContact: "Contact",
    navDashboard: "Dashboard",
    heroEyebrow: "Creative portfolio", heroCta: "View work",
    aboutText: "I create visual systems, websites and graphic design, combining aesthetics, typography and functionality.",
    aboutExtra: "Additionally:",
    service1: "Web Design", service2: "Graphic Design", service3: "UI / UX", service4: "Web Development",
    portfolioTitle: 'selected<br>work',
    skillsTitle: "Skills",
    edu1Title: "Education",
    edu1Text: "SPbSUITD / IIITA / CAT<br>IT technologies for creating digital content / 2nd year",
    edu2Title: "Additional education",
    edu2Text: "SPO<br>Information security of automated systems",
    gameHint: "Click the cow before time runs out. Try to score as many points as possible.",
    gameScore: "Score", gameReady: "Ready? Press Start.", gameStart: "Start game",
    gameTime: "Time", gameBest: "Best", gameGo: "Catch the cow!",
    contactTitle: 'let\'s<br>talk.',
    send: "Send",
    formDone: "The form is ready — connect a form handler.",
    footerText: "Created with the use of AI",
    loading: "Loading...", ready: "Ready",
    themeToggle: "Toggle theme",
  },
};

/* ═══ 5. ВСПОМОГАТЕЛЬНОЕ ═══ */
const $ = (id) => document.getElementById(id);
let lang = localStorage.getItem("roseLang") || "ru";
const t = (key) => TEXT[lang][key]; // t("send") → «Отправить» или «Send»

/* ═══ 6. ЯЗЫК И ПОДСТАНОВКА ДАННЫХ ═══ */
function applyLanguage() {
  document.documentElement.lang = lang;

  // тексты с data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  // подсказки в полях формы
  document.querySelectorAll("[data-ph-ru]").forEach((el) => {
    el.placeholder = lang === "ru" ? el.dataset.phRu : el.dataset.phEn;
  });
  // личные данные
  $("langBtn").textContent = lang === "ru" ? "EN" : "RU";
  $("themeBtn").setAttribute("aria-label", t("themeToggle"));
  $("heroRole").textContent = ME.role[lang];
  $("extraEducation").textContent = ME.extraEducation[lang];
  $("aboutName").textContent = ME.name;
  $("footerName").textContent = ME.name;
  $("telegramLink").href = ME.telegram;
  $("instagramLink").href = ME.instagram;
  $("behanceLink").href = ME.behance;
  $("emailLink").href = "mailto:" + ME.email;
  if (!introDone) $("cowHintText").textContent = t("loading");

  renderProjects();
  if (!game.running) $("cowMessage").textContent = t("gameReady");
}

$("langBtn").addEventListener("click", () => {
  lang = lang === "ru" ? "en" : "ru";
  localStorage.setItem("roseLang", lang);
  applyLanguage();
});

/* ═══ 7. КАРТОЧКИ ПРОЕКТОВ И НАВЫКОВ ═══ */
function renderProjects() {
  $("projectGrid").innerHTML = PROJECTS.map(
    (p) => `
    <article class="project reveal">
      <div class="project__media"><img src="${p.image}" alt="${p.title[lang]}" loading="lazy" /></div>
      <div class="project__info">
        <div class="project__title">${p.title[lang]}</div>
        <div class="project__tag">${p.tag[lang]}</div>
        <div class="project__desc">${p.desc[lang]}</div>
      </div>
    </article>`,
  ).join("");
  watchReveals();
}

function renderSkills() {
  $("skillsGrid").innerHTML = SKILLS.map(
    (s) => `
    <div class="skill reveal" data-level="${s.level}">
      <div class="skill__icon">${s.icon}</div>
      <div class="skill__head"><div class="skill__name">${s.name}</div><div>${s.level}%</div></div>
      <div class="skill__bar"><div class="skill__fill"></div></div>
    </div>`,
  ).join("");
}

/* ═══ 8. ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ═══ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      const fill = entry.target.querySelector(".skill__fill"); // полоска навыка
      if (fill) fill.style.width = entry.target.dataset.level + "%";
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);
function watchReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}

/* ═══ 9. МЕНЮ ═══ */
const nav = $("nav");
$("burger").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

/* ═══ 10. ПОЛОСА ПРОКРУТКИ И КНОПКА «НАВЕРХ» ═══ */
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  $("topBtn").classList.toggle("show", scrollY > 700);
}
addEventListener("scroll", updateScroll, { passive: true });
$("topBtn").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ═══ 11. ФОРМА ═══ */
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert(t("formDone")); // здесь потом подключите отправку письма
});

/* ═══ 12. КУРСОР-КОРОВА (только на компьютере) ═══ */
const bull = $("bullCursor");
if (matchMedia("(pointer:fine)").matches) {
  let mx = innerWidth / 2, my = innerHeight / 2; // где мышь
  let cx = mx, cy = my;                          // где корова (догоняет мышь плавно)
  let cursorScale = 1;                           // масштаб при клике

  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  addEventListener("mousedown", () => { cursorScale = 0.8; });
  addEventListener("mouseup",   () => { cursorScale = 1; });

  (function follow() {
    if (document.hidden) { requestAnimationFrame(follow); return; }
    // 0.35 — отзывчивее, чем 0.22 (было «вязко»)
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    // translate3d → GPU-композитинг, без layout-дёрганий
    bull.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener("mouseover", (e) =>
    bull.classList.toggle("is-hover", !!e.target.closest("a,button,input,textarea,.project,.service")),
  );
}

/* ═══ 13. ИНТРО: КРУТИМ КОРОВУ, ПОКА КРУГ НЕ ЗАПОЛНИТСЯ ═══ */
let introDone = false;
(function intro() {
  const section = $("cowIntro");
  const cow = $("cow");
  const stage = document.querySelector(".cow-intro__stage");
  const bar = $("cowProgressBar");
  const MAX = 720;   // сколько градусов надо прокрутить
  const CIRCLE = 289; // длина окружности индикатора
  let angle = 0;
  let touchY = 0;
  let introActive = true; // после финиша перестаём слушать мышь/крутить дрифт

  const visible = () => {
    const r = section.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  };

  function spin(amount) {
    angle = Math.min(MAX, angle + amount * 0.6);
    cow.style.transform = `rotate(${angle}deg)`;
    bar.style.strokeDashoffset = CIRCLE * (1 - angle / MAX);
    if (angle >= MAX) finish();
  }

  function finish() {
    introDone = true;
    introActive = false;
    document.body.classList.remove("is-cow-locked");
    document.querySelector(".cow-progress").classList.add("hide");
    $("cowHintText").textContent = t("ready");
    stage.classList.add("is-handoff");
    startTravelCow();
  }

  addEventListener("wheel", (e) => {
    if (introDone || !visible() || e.deltaY <= 0) return;
    e.preventDefault();
    spin(e.deltaY);
  }, { passive: false });

  addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), { passive: true });
  addEventListener("touchmove", (e) => {
    if (introDone || !visible()) return;
    const dy = touchY - e.touches[0].clientY;
    if (dy <= 0) return;
    e.preventDefault();
    touchY = e.touches[0].clientY;
    spin(dy);
  }, { passive: false });

  // корова слегка следует за мышью
  let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener("mousemove", (e) => {
    if (!introActive) return;
    tx = (e.clientX / innerWidth - 0.5) * 100;
    ty = (e.clientY / innerHeight - 0.5) * 60;
  }, { passive: true });

  (function drift() {
    if (!introActive) return; // стоп-луп после финиша — экономит CPU
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    stage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(drift);
  })();
})();

/* ═══ 14. КОРОВА-ПУТЕШЕСТВЕННИЦА: перебегает к текущей секции ═══
   x, y — позиция в % экрана; scale — размер; mirror — развернуть корову */
const travelCow = $("travelCow");
const STOPS = [
  { el: $("cowIntro"),                        x: 50, y: 50, scale: 1.4,  mirror: false },
  { el: document.querySelector(".hero"),      x: 16, y: 28, scale: 1,    mirror: true },
  { el: $("about"),                           x: 84, y: 74, scale: 0.95, mirror: false },
  { el: $("services"),                        x: 16, y: 30, scale: 1,    mirror: true },
  { el: $("portfolio"),                       x: 84, y: 72, scale: 0.95, mirror: false },
  { el: $("skills"),                          x: 16, y: 74, scale: 0.95, mirror: true },
  { el: document.querySelector(".education"), x: 84, y: 30, scale: 0.95, mirror: false },
  { el: $("cow-game"),                        x: 16, y: 28, scale: 0.9,  mirror: true },
  { el: $("contact"),                         x: 84, y: 74, scale: 0.95, mirror: false },
  { el: document.querySelector(".footer"),    x: 16, y: 40, scale: 0.85, mirror: true },
];
let travelOn = false;
let travelIndex = -1;

function moveTravelCow() {
  if (!travelOn) return;
  // ищем секцию, центр которой ближе всего к середине экрана
  let best = 0, bestDist = Infinity;
  STOPS.forEach((s, i) => {
    const r = s.el.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  if (best === travelIndex) return;
  travelIndex = best;
  const s = STOPS[best];
  travelCow.style.left = s.x + "%";
  travelCow.style.top = s.y + "%";
  travelCow.style.transform = `translate(-50%, -50%) scale(${s.scale})`;
  travelCow.classList.toggle("is-mirrored", s.mirror);
}
addEventListener("scroll", moveTravelCow, { passive: true });
addEventListener("resize", moveTravelCow, { passive: true });

function startTravelCow() {
  travelOn = true;
  travelIndex = -1;
  travelCow.style.transform = "translate(-50%, -50%) scale(1.4)";
  travelCow.classList.add("is-visible");
  setTimeout(moveTravelCow, 600);
}

/* ═══ 15. МИНИ-ИГРА «ПОЙМАЙ КОРОВУ» ═══ */
const game = { running: false, score: 0, time: 20, timer: null, best: Number(localStorage.getItem("cowBest") || 0) };
const arena = $("cowArena");
const gameCow = $("gameCow");

function showGameNumbers() {
  $("cowScore").textContent = game.score;
  $("cowTimer").textContent = game.time;
  $("cowBest").textContent = game.best;
}

function moveGameCow() {
  const pad = 20;
  const w = gameCow.offsetWidth, h = gameCow.offsetHeight;
  const freeX = Math.max(0, arena.clientWidth - w - pad * 2);
  const freeY = Math.max(0, arena.clientHeight - h - pad * 2);
  gameCow.style.left = pad + w / 2 + Math.random() * freeX + "px";
  gameCow.style.top = pad + h / 2 + Math.random() * freeY + "px";
  gameCow.style.setProperty("--tilt", (Math.random() * 14 - 7).toFixed(1) + "deg");
}

function startGame() {
  clearInterval(game.timer);
  Object.assign(game, { running: true, score: 0, time: 20 });
  $("cowMessage").textContent = t("gameGo");
  showGameNumbers();
  moveGameCow();
  game.timer = setInterval(() => {
    game.time -= 1;
    if (game.time <= 0) endGame();
    showGameNumbers();
  }, 1000);
}

function endGame() {
  game.running = false;
  clearInterval(game.timer);
  if (game.score > game.best) {
    game.best = game.score;
    localStorage.setItem("cowBest", game.best);
  }
  $("cowMessage").textContent =
    lang === "ru" ? `Игра окончена! Очков: ${game.score}.` : `Game over! Score: ${game.score}.`;
}

gameCow.addEventListener("click", () => {
  if (!game.running) return;
  game.score += 1;
  showGameNumbers();
  gameCow.classList.remove("hit");
  void gameCow.offsetWidth; // перезапуск анимации
  gameCow.classList.add("hit");
  moveGameCow();
});
$("cowStart").addEventListener("click", startGame);
addEventListener("resize", () => game.running && moveGameCow());

/* ═══ 16. ФОН СТРАНИЦЫ (только для разработчика, в интерфейсе кнопок нет) ═══
   У каждой темы свой фон: --page-bg-light и --page-bg-dark в style.css.
   Из консоли браузера можно сменить фон текущей темы на лету, с плавным переходом:
     setPageBg("#1c1010")
     setPageBg("linear-gradient(160deg, #f4f0eb, #d9c7b0)")
     setPageBg('url("assets/bg.jpg") center / cover no-repeat')
     setPageBg("#ffffff", "dark")   // можно указать тему явно: "light" или "dark"
   Кросс-фейд нужен, потому что градиенты и картинки сами по себе не анимируются. */
let pageBgTimer = null;
function setPageBg(value, theme = document.documentElement.dataset.theme || "light") {
  const base = $("pageBg");
  const fade = getComputedStyle(document.documentElement).getPropertyValue("--page-bg-fade").trim();
  const ms = fade.endsWith("ms") ? parseFloat(fade) : parseFloat(fade) * 1000 || 400;
  const varName = theme === "dark" ? "--page-bg-dark" : "--page-bg-light";

  clearTimeout(pageBgTimer);
  base.querySelectorAll(".page-bg__fade").forEach((el) => el.remove()); // убираем незаконченный переход

  const layer = document.createElement("div");
  layer.className = "page-bg__fade";
  layer.style.background = value;
  base.appendChild(layer);
  void layer.offsetWidth; // фиксируем стартовое состояние, чтобы переход сработал
  layer.style.opacity = "1";

  pageBgTimer = setTimeout(() => {
    document.documentElement.style.setProperty(varName, value); // новый фон становится основным
    layer.remove();
  }, ms + 50);
}

/* ═══ 17. ТЕМА САЙТА (светлая / тёмная) ═══
   Сама тема ставится в index.html до отрисовки (data-theme на <html>).
   Здесь — кнопка, запоминание выбора и подстройка шапки под цвет секции под ней. */
const themeBtn = $("themeBtn");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, save = true) {
  const root = document.documentElement;
  root.classList.add("theme-fade"); // плавная смена цветов на полсекунды
  root.dataset.theme = theme;
  themeBtn.setAttribute("aria-pressed", theme === "dark");
  if (save) { try { localStorage.setItem("roseTheme", theme); } catch (e) {} }
  // цвет строки состояния на телефоне
  if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
  setTimeout(() => { root.classList.remove("theme-fade"); tintFixedGlass(); }, 500);
}
themeBtn.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* Шапка и кнопка «наверх» плавают над секциями с разным фоном.
   Смотрим, какая секция/панель сейчас под ними, берём её цвет текста
   и красим в него стеклянные кнопки. Поэтому они читаются на любом цвете и фоне. */
const TONE_TARGETS = ".panel, .section, .cow-intro, .footer";
function textColorUnder(x, y) {
  const el = document.elementsFromPoint(x, y).find((e) => e.matches(TONE_TARGETS));
  return getComputedStyle(el || document.body).color; // "rgb(r, g, b)"
}
function tintFixedGlass() {
  const header = document.querySelector(".header");
  const top = $("topBtn").getBoundingClientRect();
  const headerColor = textColorUnder(innerWidth / 2, 40);
  header.style.setProperty("--glass-text", headerColor);
  $("topBtn").style.setProperty("--glass-text", textColorUnder(top.left + top.width / 2, top.top + top.height / 2));
}
let tintQueued = false;
function queueTint() {
  if (tintQueued) return;
  tintQueued = true;
  requestAnimationFrame(() => { tintQueued = false; tintFixedGlass(); });
}
addEventListener("scroll", queueTint, { passive: true });
addEventListener("resize", queueTint, { passive: true });

/* ═══ 18. СТАРТ ═══ */
renderSkills();
applyLanguage(); // также рисует проекты и запускает появление блоков
watchReveals();
showGameNumbers();
updateScroll();
applyTheme(document.documentElement.dataset.theme || "light", false); // синхронизируем кнопку с темой
tintFixedGlass();