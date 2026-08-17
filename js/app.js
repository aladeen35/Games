/* ===== حاسبة حملي — السلوك العام ===== */

/* قائمة الجوال */
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.toggle("open");
  });
}

/* تبويبات الحاسبة */
document.querySelectorAll(".calc-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".calc-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".calc-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("active");
  });
});

const DAY_MS = 24 * 60 * 60 * 1000;
const arDate = (d) =>
  d.toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "long", day: "numeric" });

function trimesterName(week) {
  if (week <= 13) return "المرحلة الأولى (أول 3 أشهر)";
  if (week <= 27) return "المرحلة الثانية (الأشهر 4، 5، 6)";
  return "المرحلة الثالثة (الأشهر 7، 8، 9)";
}

/* ===== حاسبة الحمل (قاعدة نايجل: آخر دورة + 280 يوماً) ===== */
function calcPregnancy() {
  const input = document.getElementById("lmp-date");
  const result = document.getElementById("pregnancy-result");
  if (!input.value) {
    alert("الرجاء إدخال تاريخ أول يوم من آخر دورة شهرية");
    return;
  }

  const lmp = new Date(input.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysPassed = Math.floor((today - lmp) / DAY_MS);

  if (daysPassed < 0) {
    alert("التاريخ المدخل في المستقبل، الرجاء التحقق منه");
    return;
  }
  if (daysPassed > 320) {
    alert("التاريخ المدخل أقدم من مدة الحمل الطبيعية، الرجاء التحقق منه");
    return;
  }

  const dueDate = new Date(lmp.getTime() + 280 * DAY_MS);
  const week = Math.min(Math.floor(daysPassed / 7), 42);
  const dayInWeek = daysPassed % 7;
  const remainingDays = Math.max(Math.floor((dueDate - today) / DAY_MS), 0);
  const progress = Math.min(Math.round((daysPassed / 280) * 100), 100);

  document.getElementById("res-week").textContent =
    "الأسبوع " + week + (dayInWeek ? " + " + dayInWeek + " أيام" : "");
  document.getElementById("res-due").textContent = arDate(dueDate);
  document.getElementById("res-trimester").textContent = trimesterName(week || 1);
  document.getElementById("res-remaining").textContent = remainingDays + " يوماً";

  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("progress-label").textContent = "أكملتِ " + progress + "% من رحلة الحمل";

  const weekLink = document.getElementById("res-week-link");
  if (weekLink) {
    const w = Math.min(Math.max(week, 1), 40);
    weekLink.href = "weeks.html#week-" + w;
    weekLink.textContent = "اطّلعي على تطور جنينك في الأسبوع " + w + " ←";
  }

  result.classList.add("show");
}

/* ===== حاسبة التبويض ===== */
function calcOvulation() {
  const dateInput = document.getElementById("ov-date");
  const cycleInput = document.getElementById("ov-cycle");
  if (!dateInput.value) {
    alert("الرجاء إدخال تاريخ أول يوم من آخر دورة شهرية");
    return;
  }

  const lmp = new Date(dateInput.value);
  const cycle = parseInt(cycleInput.value, 10) || 28;
  if (cycle < 21 || cycle > 45) {
    alert("طول الدورة يجب أن يكون بين 21 و45 يوماً");
    return;
  }

  const ovulationDay = new Date(lmp.getTime() + (cycle - 14) * DAY_MS);
  const fertileStart = new Date(ovulationDay.getTime() - 5 * DAY_MS);
  const fertileEnd = new Date(ovulationDay.getTime() + 1 * DAY_MS);
  const nextPeriod = new Date(lmp.getTime() + cycle * DAY_MS);

  document.getElementById("ov-day").textContent = arDate(ovulationDay);
  document.getElementById("ov-window").textContent =
    "من " + arDate(fertileStart) + " إلى " + arDate(fertileEnd);
  document.getElementById("ov-next").textContent = arDate(nextPeriod);

  document.getElementById("ovulation-result").classList.add("show");
}

document.getElementById("btn-pregnancy")?.addEventListener("click", calcPregnancy);
document.getElementById("btn-ovulation")?.addEventListener("click", calcOvulation);
