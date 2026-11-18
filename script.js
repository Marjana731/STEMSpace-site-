
const cards = document.querySelectorAll(".event-card");
let route = [];

const events = [
    { id: "event-1", title: "Робот проходить лабіринт", time: "10:00–10:30" },
    { id: "event-2", title: "Вебсторінка за 30 хвилин", time: "10:45–11:15" },
    { id: "event-3", title: "Математичний квест", time: "10:00–10:30" },
    { id: "event-4", title: "Міст із паперу", time: "11:30–12:00" },
    { id: "event-5", title: "Вода під мікроскопом", time: "10:45–11:15" },
    { id: "event-6", title: "Досліджуємо світло", time: "12:15–12:45" }
];

function load() {
    const saved = localStorage.getItem("myFestivalRoute");
    if (saved) route = JSON.parse(saved);
}

function save() {
    localStorage.setItem("myFestivalRoute", JSON.stringify(route));
}

function add(id) {
    if (!route.includes(id)) {
        route.push(id);
        save();
        refresh();
    }
}

function remove(id) {
    route = route.filter(item => item !== id);
    save();
    refresh();
}

function refresh() {
    const list = document.getElementById("myRouteList");

    if (list) {
        list.innerHTML = "";

        if (route.length === 0) {
            list.innerHTML = "<p>Твій маршрут поки порожній.</p>";
        }

        route.forEach(id => {
            const ev = events.find(e => e.id === id);
            if (ev) {
                const item = document.createElement("div");
                item.className = "route-item";

                const text = document.createElement("p");
                text.textContent = ev.title + " — " + ev.time;

                const btn = document.createElement("button");
                btn.textContent = "Вилучити";
                btn.className = "remove-button";
                btn.addEventListener("click", () => remove(id));

                item.appendChild(text);
                item.appendChild(btn);
                list.appendChild(item);
            }
        });
    }

    cards.forEach((card, index) => {
        const btn = card.querySelector(".route-btn");
        const id = "event-" + (index + 1);

        if (btn) {
            btn.textContent = route.includes(id) ? "У маршруті" : "+ Мій маршрут";
        }
    });
}

cards.forEach((card, index) => {
    const id = "event-" + (index + 1);
    const btn = card.querySelector(".route-btn");
    card.dataset.id = id;

    if (btn) {
        btn.addEventListener("click", () => {
            if (route.includes(id)) {
                remove(id);
            } else {
                add(id);
            }
        });
    }
});

const directionFilter = document.getElementById("directionFilter");
const classFilter = document.getElementById("classFilter");
const resetFilters = document.getElementById("resetFilters");
const eventCounter = document.getElementById("eventCounter");
const noResults = document.getElementById("noResults");
const directionGroups = document.querySelectorAll(".group");

function filter() {
    if (!directionFilter || !classFilter) return;

    let count = 0;

    cards.forEach(card => {
        const dir = card.dataset.direction;
        const cls = card.dataset.classes.split(",");

        const matchDir = directionFilter.value === "all" || dir === directionFilter.value;
        const matchCls = classFilter.value === "all" || cls.includes(classFilter.value);

        if (matchDir && matchCls) {
            card.hidden = false;
            count++;
        } else {
            card.hidden = true;
        }
    });

    directionGroups.forEach(group => {
        const visibleCards = group.querySelectorAll(".event-card:not([hidden])");
        group.hidden = visibleCards.length === 0;
    });

    if (eventCounter) {
        eventCounter.textContent = "Знайдено подій: " + count + " із " + cards.length;
    }

    if (noResults) {
        noResults.hidden = count !== 0;
    }
}

if (directionFilter && classFilter) {
    directionFilter.addEventListener("change", filter);
    classFilter.addEventListener("change", filter);
}

if (resetFilters) {
    resetFilters.addEventListener("click", () => {
        directionFilter.value = "all";
        classFilter.value = "all";
        filter();
    });
}

const clearRoute = document.getElementById("clearRoute");
if (clearRoute) {
    clearRoute.addEventListener("click", () => {
        route = [];
        save();
        refresh();
    });
}

load();
refresh();
filter();
