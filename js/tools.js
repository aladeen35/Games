/* ===== أدوات الأم: اليوميات، حقيبة المستشفى، عداد الركلات ===== */

const todayISO = () => new Date().toISOString().slice(0, 10);
const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

/* ===== يوميات الأم ===== */
let journal = readStore("hamli_journal", []);

function renderJournal() {
  const list = document.getElementById("journal-list");
  list.innerHTML = "";
  journal.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "journal-entry";
    div.innerHTML =
      '<button class="j-del" title="حذف">🗑️</button>' +
      '<div class="j-date"></div><div class="j-text"></div>';
    div.querySelector(".j-date").textContent = "📅 " +
      new Date(entry.d).toLocaleDateString("ar-SA-u-ca-gregory", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    div.querySelector(".j-text").textContent = entry.t;
    div.querySelector(".j-del").addEventListener("click", () => {
      journal.splice(i, 1);
      localStorage.setItem("hamli_journal", JSON.stringify(journal));
      renderJournal();
    });
    list.appendChild(div);
  });
}

document.getElementById("journal-save")?.addEventListener("click", () => {
  const input = document.getElementById("journal-input");
  const text = input.value.trim();
  if (!text) return alert("اكتبي شيئاً في يومياتك أولاً 🌸");
  journal.unshift({ d: todayISO(), t: text });
  localStorage.setItem("hamli_journal", JSON.stringify(journal));
  input.value = "";
  renderJournal();
});

/* ===== حقيبة المستشفى ===== */
const BAG_DEFAULTS = [
  "ملابس مريحة للمستشفى", "ملابس المولود (3-4 أطقم)", "حفاضات حديثي الولادة",
  "بطانية ناعمة للمولود", "مستندات وبطاقة التأمين", "أدوات النظافة الشخصية",
  "شاحن الجوال", "فوط قطنية للنفاس", "وجبات خفيفة وماء", "حمالة رضاعة وكريم مرطب",
];

let bag = readStore("hamli_bag", BAG_DEFAULTS.map((t) => ({ t, done: false })));

function saveBag() {
  localStorage.setItem("hamli_bag", JSON.stringify(bag));
}

function renderBag() {
  const list = document.getElementById("bag-list");
  list.innerHTML = "";
  bag.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "bag-item" + (item.done ? " done" : "");
    const id = "bag-" + i;
    li.innerHTML =
      '<input type="checkbox" id="' + id + '"' + (item.done ? " checked" : "") + ">" +
      '<label for="' + id + '"></label><button class="b-del" title="حذف">✖️</button>';
    li.querySelector("label").textContent = item.t;
    li.querySelector("input").addEventListener("change", (e) => {
      item.done = e.target.checked;
      saveBag();
      renderBag();
    });
    li.querySelector(".b-del").addEventListener("click", () => {
      bag.splice(i, 1);
      saveBag();
      renderBag();
    });
    list.appendChild(li);
  });

  const done = bag.filter((b) => b.done).length;
  document.getElementById("bag-progress").textContent =
    bag.length ? "✅ جهزتِ " + done + " من " + bag.length + " أغراض" : "";
}

document.getElementById("bag-add-btn")?.addEventListener("click", () => {
  const input = document.getElementById("bag-add-input");
  const text = input.value.trim();
  if (!text) return;
  bag.push({ t: text, done: false });
  saveBag();
  input.value = "";
  renderBag();
});

document.getElementById("bag-add-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("bag-add-btn").click();
});

/* ===== عداد الركلات ===== */
let kicks = readStore("hamli_kicks", {});

function saveKicks() {
  localStorage.setItem("hamli_kicks", JSON.stringify(kicks));
}

function renderKicks() {
  document.getElementById("kick-today").textContent = kicks[todayISO()] || 0;

  const history = document.getElementById("kick-history");
  history.innerHTML = "";
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days.push({ iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString("ar-SA-u-ca-gregory", { weekday: "short" }) });
  }
  const max = Math.max(...days.map((d) => kicks[d.iso] || 0), 1);
  days.forEach((d) => {
    const n = kicks[d.iso] || 0;
    const div = document.createElement("div");
    div.className = "kick-day";
    div.innerHTML = '<div class="n"></div><div class="bar"></div><div class="d"></div>';
    div.querySelector(".n").textContent = n;
    div.querySelector(".bar").style.height = Math.round((n / max) * 60) + 4 + "px";
    div.querySelector(".d").textContent = d.label;
    history.appendChild(div);
  });
}

document.getElementById("kick-btn")?.addEventListener("click", () => {
  kicks[todayISO()] = (kicks[todayISO()] || 0) + 1;
  saveKicks();
  renderKicks();
});

document.getElementById("kick-reset")?.addEventListener("click", () => {
  if (!confirm("تصفير عداد اليوم؟")) return;
  kicks[todayISO()] = 0;
  saveKicks();
  renderKicks();
});

if (document.getElementById("journal-list")) renderJournal();
if (document.getElementById("bag-list")) renderBag();
if (document.getElementById("kick-btn")) renderKicks();
