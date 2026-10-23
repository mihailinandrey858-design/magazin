/* =========================================================
   Пист & Зёрна — общий скрипт для всех страниц
   ========================================================= */

/* ---------- Данные ---------- */

const SHOP = {
  name: "Пист & Зёрна",
  hours: "ежедневно с 08:00 до 22:00",
  address: "г. Бишкек, ваш адрес",
  phone: "+996 XXX XXX XXX",
};

const MENU = {
  drinks: [
    { name: "Латте", desc: "Нежный и сливочный", price: 250, img: "img/l3_BMTjehO2lcC8Nd-72kGVLts6aDte2LvTy1_Z12jxko2eMmVcyesYQKCL_p800tnIJXum1Bfs5W5rmNMjpma7b7bXmXZCYA171k34Vd1eosobI892T0q2HgQQvDMm9kB8brzSrXxTjls14NeFz9zrcZhNj9cx19fShxTqg8Xx3jhMujZYS0OopQwV6NTXY.jpg", tags: ["кофе", "молочн"] },
    { name: "Капучино", desc: "Плотная пенка и насыщенный эспрессо", price: 230, img: "img/1d75b6969c50eb072493f7ebf8074968.jpg", tags: ["кофе", "капучино", "молочн"] },
    { name: "Американо", desc: "Чистый вкус эспрессо с водой", price: 180, img: "img/загруженное (4).jpg", tags: ["кофе", "американо"] },
    { name: "Айс фильтр", desc: "Освежающий кофе со льдом", price: 260, img: "img/wwbtmIBlrbwgWWiAWsl8ZCKl8p7UZPlP2CB9f7rM081VcFISaRHDN2Yd6t8zTwccHtCPiGeR_fk1pEnxsq1RWJb0QXb1QhWRjY7Cp7yFVGQkYxWJ1dRyg9AUZcLGgRRGN6W4c5TIF7IODbOmNO9Z9IjAit6GdAkc3VkexHIKniFlvxbtZHh3I2VzZIKlVop5.jpg", tags: ["холод", "лёд", "фильтр"] },
  ],
  teaAndNoCaffeine: [
    { name: "Матча латте", desc: "Зелёный и сливочный", price: 280, img: "img/matcha.jpg", tags: ["матч", "чай", "без кофеин"] },
    { name: "Чай с мятой", desc: "Свежие листья мяты в заварке", price: 150, img: "img/tea-mint.jpg", tags: ["чай", "мята", "без кофеин"] },
  ],
  desserts: [
    { name: "Круассан с миндалём", desc: "Хрустящий снаружи, нежный внутри", price: 220, img: "img/croissant.jpg", tags: ["круассан", "миндал", "выпечк"] },
    { name: "Чизкейк с ягодами", desc: "Нежный десерт с ягодами", price: 260, img: "img/cheesecake.jpg", tags: ["чизкейк", "ягод", "десерт"] },
    { name: "Печенье с шоколадом", desc: "Тёплое, с хрустящей корочкой", price: 160, img: "img/cookie.jpg", tags: ["печень", "шоколад"] },
  ],
};

const VACANCIES = [
  {
    id: "barista",
    title: "Бариста",
    meta: "Полная занятость · от 2 смен в неделю",
    summary: "Готовите напитки, помогаете гостям с выбором и поддерживаете порядок на баре.",
    duties: [
      "Готовить эспрессо-напитки и фильтр по стандартам кофейни",
      "Консультировать гостей о напитках и зёрнах",
      "Вести смену: заготовки, чистота, работа с кассой",
    ],
    requirements: ["Опыт работы от 3 месяцев или желание учиться", "Доброжелательность и аккуратность"],
  },
  {
    id: "pastry",
    title: "Кондитер",
    meta: "Полная или частичная занятость",
    summary: "Готовите выпечку и десерты к витрине, следите за качеством и подачей.",
    duties: [
      "Выпекать круассаны, печенье и десерты по технологическим картам",
      "Поддерживать витрину свежей и аккуратной",
      "Вести учёт продуктов и списания",
    ],
    requirements: ["Опыт в кондитерском деле от 1 года", "Аккуратность и соблюдение санитарных норм"],
  },
  {
    id: "admin",
    title: "Администратор зала",
    meta: "Сменный график · 2/2",
    summary: "Встречаете гостей, ведёте бронирования и следите за залом.",
    duties: [
      "Встречать и рассаживать гостей",
      "Принимать бронирования по телефону и в мессенджерах",
      "Контролировать чистоту зала и работу персонала",
    ],
    requirements: ["Опыт в сфере общепита или сервиса приветствуется", "Грамотная речь и умение работать с людьми"],
  },
];

const USE_AI = false;

/* ---------- Помощь ---------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const formatPrice = (price) => `${price} сом`;

function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach((link) => {
    if (link.getAttribute("href") === page) link.setAttribute("aria-current", "page");
  });
}

/* ---------- Рендеринг меню ---------- */

function renderContainerItems(containerId, itemsArray) {
  const box = $(containerId);
  if (!box) return;

  box.innerHTML = itemsArray
    .map(
      (item) => `
      <article class="item">
        <div class="item-photo">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <span class="price">${formatPrice(item.price)}</span>
      </article>`
    )
    .join("");
}

function renderDrinks() {
  const box = $("#drinks");
  if (!box) return;

  box.innerHTML = MENU.drinks
    .slice(0, 3)
    .map(
      (item) => `
      <article class="drink">
        <div class="drink-photo">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <strong>${formatPrice(item.price)}</strong>
      </article>`
    )
    .join("");
}

function renderFullMenu() {
  renderContainerItems("#coffee-items", MENU.drinks);
  renderContainerItems("#tea-items", MENU.teaAndNoCaffeine);
  renderContainerItems("#desserts-items", MENU.desserts);
}

/* ---------- Страница «Работа» ---------- */

function renderVacancies() {
  const list = $("#vacancies");
  const select = $("#position-select");
  if (!list) return;

  list.innerHTML = "";
  VACANCIES.forEach((job) => {
    const card = document.createElement("article");
    card.className = "card vacancy";
    card.id = job.id;

    const info = document.createElement("div");
    info.innerHTML = `<h3>${job.title}</h3><p>${job.summary}</p>`;

    const meta = document.createElement("span");
    meta.className = "vacancy-meta";
    meta.textContent = job.meta;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "vacancy-open";
    toggle.textContent = "Подробнее";
    toggle.setAttribute("aria-expanded", "false");

    const details = document.createElement("div");
    details.className = "vacancy-details";
    details.hidden = true;
    details.innerHTML = `
      <p><strong>Обязанности</strong></p>
      <ul>${job.duties.map((d) => `<li>${d}</li>`).join("")}</ul>
      <p><strong>Требования</strong></p>
      <ul>${job.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>`;

    toggle.addEventListener("click", () => {
      const willOpen = details.hidden;
      details.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.textContent = willOpen ? "Свернуть" : "Подробнее";
    });

    const apply = document.createElement("a");
    apply.className = "btn btn-small";
    apply.href = "#apply";
    apply.textContent = "Откликнуться";
    apply.dataset.position = job.title;

    card.append(info, apply, meta, toggle, details);
    list.appendChild(card);

    if (select) {
      const option = document.createElement("option");
      option.value = job.title;
      option.textContent = job.title;
      select.appendChild(option);
    }
  });

  if (select) {
    const other = document.createElement("option");
    other.value = "Другое";
    other.textContent = "Другое / без вакансии";
    select.appendChild(other);
  }
}

function setupApplyLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-position]");
    const select = $("#position-select");
    if (link && select) select.value = link.dataset.position;
  });
}

/* ---------- Формы и сохранение в админ-панель ---------- */

function isFieldValid(field) {
  const value = field.value.trim();
  if (!value) return false;
  if (field.type === "tel") return /^\+?[0-9\s()-]{7,}$/.test(value);
  if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return true;
}

function validateForm(form) {
  let valid = true;
  $$("[required]", form).forEach((field) => {
    const ok = isFieldValid(field);
    field.setAttribute("aria-invalid", String(!ok));
    if (!ok) valid = false;
  });
  return valid;
}

function setupForms() {
  $$("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = $(".form-msg", form);
      const ok = validateForm(form);

      if (message) {
        message.classList.toggle("error", !ok);
        message.textContent = ok
          ? form.dataset.success || "Спасибо! Мы свяжемся с вами."
          : "Заполните обязательные поля правильно.";
      }

      if (ok) {
        const currentDate = new Date().toLocaleString("ru-RU");

        // 1. Проверка: является ли это формой подписки по e-mail (например, в футере)
        const emailInput = form.querySelector('input[type="email"]');
        const allInputs = form.querySelectorAll("input, select, textarea");
        
        if (allInputs.length === 1 && emailInput) {
          // Это только подписка на новости
          const subscribers = JSON.parse(localStorage.getItem("coffee_subscribers") || "[]");
          subscribers.push({ email: emailInput.value.trim(), date: currentDate });
          localStorage.setItem("coffee_subscribers", JSON.stringify(subscribers));
        } else {
          // Это общая заявка, бронь или отклик на вакансию
          let contactVal = "";
          let detailsSummary = "";

          const formData = new FormData(form);
          formData.forEach((value, key) => {
            if (key === "email" || key === "phone" || key === "name") {
              contactVal += `${value} `;
            } else {
              detailsSummary += `<b>${key}:</b> ${value}; `;
            }
          });

          // Если в форме есть текстовые поля ввода контактов напрямую
          if (!contactVal) {
            const tel = form.querySelector('input[type="tel"]');
            const name = form.querySelector('input[name*="name"], input[placeholder*="Имя"]');
            if (name) contactVal += name.value + " ";
            if (tel) contactVal += tel.value;
          }

          const orders = JSON.parse(localStorage.getItem("coffee_orders") || "[]");
          orders.push({
            contact: contactVal.trim() || "Гость сайта",
            details: detailsSummary || "Новая заявка с сайта",
            date: currentDate,
          });
          localStorage.setItem("coffee_orders", JSON.stringify(orders));
        }

        form.reset();
      }
    });
  });
}

function setBookingMinDate() {
  const dateInput = $('input[type="date"]');
  if (!dateInput) return;
  const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  dateInput.min = local.toISOString().slice(0, 10);
}

/* ---------- Помощник по продажам (Чат) ---------- */

function answerByRules(text) {
  const q = text.toLowerCase();

  if (/час|открыт|работаете|график/.test(q)) return `Мы работаем ${SHOP.hours}.`;
  if (/адрес|где вы|где нахо|как добраться/.test(q)) return `Нас можно найти: ${SHOP.address}.`;
  if (/телефон|номер|контакт|связаться/.test(q)) return `Телефон: ${SHOP.phone}.`;
  if (/посовет|рекоменд|что взять|что выбрать|что лучше/.test(q)) {
    return "Попробуйте Латте, если любите мягкий вкус, или Айс фильтр в жаркий день. К ним хорошо подойдёт круассан с миндалём.";
  }

  const allItems = [...MENU.drinks, ...MENU.teaAndNoCaffeine, ...MENU.desserts];
  const item = allItems.find(
    (i) => q.includes(i.name.toLowerCase()) || i.tags.some((t) => q.includes(t))
  );
  if (item) return `${item.name}: ${item.desc.toLowerCase()}. Цена — ${item.price} сом.`;

  if (/цен|сколько|стоит|прайс/.test(q)) {
    return "Цены указаны в меню. Назовите блюдо, и я подскажу стоимость.";
  }

  return "Я могу рассказать о напитках, десертах, часах работы, адресе и контактах. О чём хотите узнать?";
}

let chatPanel;
let chatToggle;
let chatLog;
let chatInput;

function addMessage(text, who) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${who}`;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
  return bubble;
}

async function sendMessage(text) {
  const clean = text.trim();
  if (!clean || !chatLog) return;

  addMessage(clean, "user");
  addMessage(answerByRules(clean), "bot");
}

function openChat() {
  if (!chatPanel) return;
  chatPanel.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  chatInput.focus();
}

function closeChat() {
  if (!chatPanel) return;
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
}

function setupChat() {
  chatToggle = $("#chat-toggle");
  if (!chatToggle) return;

  chatPanel = $("#chat-panel");
  chatLog = $("#chat-log");
  chatInput = $("#chat-input");

  chatToggle.addEventListener("click", () => (chatPanel.hidden ? openChat() : closeChat()));
  $("#chat-close").addEventListener("click", closeChat);
  $("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(chatInput.value);
    chatInput.value = "";
  });

  addMessage(`Здравствуйте! Я помогу с выбором напитков и десертов в ${SHOP.name}.`, "bot");
}

/* ---------- Запуск ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  renderDrinks();
  renderFullMenu();
  renderVacancies();
  setupApplyLinks();
  setupForms();
  setBookingMinDate();
  setupChat();
});