/* ===== حاسبة حملي — السلوك العام ===== */

/* ===== PWA: تسجيل عامل الخدمة وزر التثبيت ===== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}

let installPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  const btn = document.getElementById("install-btn");
  if (btn) btn.style.display = "";
});

document.getElementById("install-btn")?.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  document.getElementById("install-btn").style.display = "none";
});

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("install-btn");
  if (btn) btn.style.display = "none";
});

/* قائمة الجوال */
document.querySelector(".nav-toggle")?.addEventListener("click", () => {
  document.querySelector(".main-nav").classList.toggle("open");
});

/* تبويبات عامة */
document.querySelectorAll(".calc-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".calc-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".calc-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("active");
    /* إخفاء نتيجة الحمل عند الانتقال لحاسبة التبويض */
    if (tab.dataset.panel === "panel-ovulation") {
      document.getElementById("pregnancy-result")?.classList.remove("show");
    }
  });
});

const DAY_MS = 24 * 60 * 60 * 1000;
const AVG_MONTH_DAYS = 30.4375;

const arDate = (d) =>
  d.toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "long", day: "numeric" });

const AR_ORDINAL = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];

function today0() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/* موعد الولادة بقاعدة نايجل: آخر دورة + 7 أيام − 3 أشهر + سنة */
function naegeleDue(lmp) {
  const d = new Date(lmp);
  d.setDate(d.getDate() + 7);
  d.setMonth(d.getMonth() - 3);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

/* الحالة الكاملة للحمل انطلاقاً من تاريخ آخر دورة */
function pregnancyState(lmp) {
  const daysPassed = Math.floor((today0() - lmp) / DAY_MS);
  const due = naegeleDue(lmp);
  const week = Math.min(Math.floor(daysPassed / 7), 42);
  const dayInWeek = daysPassed % 7;
  const fullMonths = Math.floor(daysPassed / AVG_MONTH_DAYS);
  const month = Math.min(fullMonths + 1, 10);
  const daysIntoMonth = Math.floor(daysPassed - fullMonths * AVG_MONTH_DAYS);
  const remaining = Math.max(Math.round((due - today0()) / DAY_MS), 0);
  const progress = Math.min(Math.round((daysPassed / 280) * 100), 100);
  return { daysPassed, due, week, dayInWeek, month, daysIntoMonth, remaining, progress };
}

const monthLabel = (s) =>
  "الشهر " + AR_ORDINAL[s.month - 1] + (s.daysIntoMonth ? " و" + s.daysIntoMonth + " أيام" : "");
const weekLabel = (s) =>
  "الأسبوع " + s.week + (s.dayInWeek ? " + " + s.dayInWeek + " أيام" : "");

/* حفظ واسترجاع بيانات الحمل */
const savePregnancy = (lmpISO) => localStorage.setItem("hamli_lmp", lmpISO);
function loadPregnancy() {
  const iso = localStorage.getItem("hamli_lmp");
  if (!iso) return null;
  const lmp = new Date(iso);
  const s = pregnancyState(lmp);
  return s.daysPassed >= 0 && s.daysPassed <= 320 ? s : null;
}

/* ===== حاسبة الحمل — طريقة آخر دورة (LMP) ===== */
function calcFromLMP() {
  const input = document.getElementById("lmp-date");
  if (!input.value) return alert("الرجاء إدخال تاريخ أول يوم من آخر دورة شهرية");

  const lmp = new Date(input.value);
  const s = pregnancyState(lmp);
  if (s.daysPassed < 0) return alert("التاريخ المدخل في المستقبل، الرجاء التحقق منه");
  if (s.daysPassed > 320) return alert("التاريخ المدخل أقدم من مدة الحمل الطبيعية، الرجاء التحقق منه");

  savePregnancy(input.value);
  showResult(s);
}

/* ===== حاسبة الحمل — طريقة موعد الولادة المتوقع (EDD) ===== */
function calcFromEDD() {
  const input = document.getElementById("edd-date");
  if (!input.value) return alert("الرجاء إدخال موعد الولادة المتوقع");

  /* الرجوع للخلف: آخر دورة = موعد الولادة − 280 يوماً */
  const edd = new Date(input.value);
  const lmp = new Date(edd.getTime() - 280 * DAY_MS);
  const s = pregnancyState(lmp);
  if (s.daysPassed < 0) return alert("موعد الولادة المدخل بعيد جداً، الرجاء التحقق منه");
  if (s.daysPassed > 320) return alert("موعد الولادة المدخل قد مضى، الرجاء التحقق منه");

  savePregnancy(lmp.toISOString().slice(0, 10));
  showResult(s);
}

function showResult(s) {
  document.getElementById("res-week").textContent = weekLabel(s);
  document.getElementById("res-month").textContent = monthLabel(s);
  document.getElementById("res-due").textContent = arDate(s.due);
  document.getElementById("res-remaining").textContent = s.remaining + " يوماً";

  document.getElementById("progress-fill").style.width = s.progress + "%";
  document.getElementById("progress-label").textContent = "أكملتِ " + s.progress + "% من رحلة الحمل";

  const w = Math.min(Math.max(s.week, 1), 40);
  const link = document.getElementById("res-week-link");
  link.href = "weeks.html#week-" + w;
  link.textContent = "اطّلعي على تطور جنينك في الأسبوع " + w + " ←";

  document.getElementById("pregnancy-result").classList.add("show");
}

document.getElementById("btn-lmp")?.addEventListener("click", calcFromLMP);
document.getElementById("btn-edd")?.addEventListener("click", calcFromEDD);

/* ===== حاسبة التبويض ===== */
document.getElementById("btn-ovulation")?.addEventListener("click", () => {
  const dateInput = document.getElementById("ov-date");
  const cycle = parseInt(document.getElementById("ov-cycle").value, 10) || 28;
  if (!dateInput.value) return alert("الرجاء إدخال تاريخ أول يوم من آخر دورة شهرية");
  if (cycle < 21 || cycle > 45) return alert("طول الدورة يجب أن يكون بين 21 و45 يوماً");

  const lmp = new Date(dateInput.value);
  const ovulationDay = new Date(lmp.getTime() + (cycle - 14) * DAY_MS);
  const fertileStart = new Date(ovulationDay.getTime() - 5 * DAY_MS);
  const fertileEnd = new Date(ovulationDay.getTime() + 1 * DAY_MS);
  const nextPeriod = new Date(lmp.getTime() + cycle * DAY_MS);

  document.getElementById("ov-day").textContent = arDate(ovulationDay);
  document.getElementById("ov-window").textContent = "من " + arDate(fertileStart) + " إلى " + arDate(fertileEnd);
  document.getElementById("ov-next").textContent = arDate(nextPeriod);
  document.getElementById("ovulation-result").classList.add("show");
});

/* ===== ملصق حالة الحمل (الصفحة الرئيسية) ===== */
const stickerBar = document.getElementById("sticker-bar");
if (stickerBar) {
  const s = loadPregnancy();
  if (s) {
    document.getElementById("st-week").textContent = weekLabel(s);
    document.getElementById("st-month").textContent = monthLabel(s);
    document.getElementById("st-due").textContent = arDate(s.due);
    document.getElementById("st-remaining").textContent = s.remaining + " يوماً";
    document.getElementById("sticker-data").style.display = "";
    document.getElementById("sticker-empty").style.display = "none";
  }
}
