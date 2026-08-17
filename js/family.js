/* ===== شجرة العائلة الكرتونية ===== */

const FAMILY_DEFAULTS = {
  dad: "اسم الأب", mom: "اسم الأم", baby: "اسم الجنين",
  sib1: "الأخ/الأخت الأول", sib1age: "4 سنوات",
  sib2: "الأخ/الأخت الثاني", sib2age: "سنتان",
};

function loadFamily() {
  try {
    return { ...FAMILY_DEFAULTS, ...JSON.parse(localStorage.getItem("hamli_family") || "{}") };
  } catch {
    return { ...FAMILY_DEFAULTS };
  }
}

const familyData = loadFamily();

function saveFamily() {
  localStorage.setItem("hamli_family", JSON.stringify(familyData));
}

/* كل اسم قابل للتعديل بالنقر عليه، ويُحفظ محلياً */
document.querySelectorAll(".member [data-field]").forEach((el) => {
  const field = el.dataset.field;
  el.textContent = familyData[field];

  el.addEventListener("click", () => {
    if (el.querySelector("input")) return;
    const input = document.createElement("input");
    input.value = familyData[field];
    el.textContent = "";
    el.appendChild(input);
    input.focus();
    input.select();

    const commit = () => {
      familyData[field] = input.value.trim() || FAMILY_DEFAULTS[field];
      saveFamily();
      el.textContent = familyData[field];
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });
});
