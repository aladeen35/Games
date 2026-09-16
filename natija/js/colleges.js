/* ============================================================
   مطابقة الكليات — يرتّب الكليات حسب نسبة الطالب وتخصصه
   ============================================================ */
(function () {
  "use strict";

  /* ---------- قاعدة الترميز اللوني ----------
     الفارق = نسبة قبول الكلية − نسبة الطالب
       الفارق ≥ 10          → أحمر        ضعيف أو معدوم   (أسفل القائمة)
       0 <  الفارق < 10     → برتقالي     قبول محتمل      (أعلى القائمة)
       −5 ≤ الفارق ≤ 0      → أخضر خفيف   قبول
       الفارق < −5          → أخضر غامق   قبول مرتفع
     غيّر الأرقام هنا وحدها إن أردت تعديل الحدود.                  */
  var RULES = { weak: 10, close: 5 };

  var VERDICTS = {
    maybe: { cls: "v-maybe", label: "قبول محتمل",     order: 0, color: "#D98324" },
    ok:    { cls: "v-ok",    label: "قبول",           order: 1, color: "#5FB07A" },
    high:  { cls: "v-high",  label: "قبول مرتفع",     order: 2, color: "#12693F" },
    low:   { cls: "v-low",   label: "ضعيف أو معدوم",  order: 3, color: "#B3342F" }
  };

  function verdictOf(collegeMin, studentPct) {
    var d = collegeMin - studentPct;
    if (d >= RULES.weak) return "low";
    if (d > 0) return "maybe";
    if (d >= -RULES.close) return "ok";
    return "high";
  }

  /* ---------- الحالة ---------- */
  var DATA = null, sel = { track: "", spec: "", sector: "الكل" };
  var msg = Site.message("msg");
  var res = document.getElementById("result");
  var goBtn = document.getElementById("go");

  /* ---------- بناء أزرار الاختيار ---------- */
  function chips(box, values, onPick, current) {
    box.innerHTML = "";
    values.forEach(function (v) {
      var b = Site.el("button", "chip" + (v === current ? " on" : ""), v);
      b.type = "button";
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(box.children, function (c) { c.classList.remove("on"); });
        b.classList.add("on");
        onPick(v);
      });
      box.appendChild(b);
    });
  }

  function buildSpecChips() {
    var list = Tracks.list[sel.track] || [];
    chips(document.getElementById("specChips"), list, function (v) { sel.spec = v; }, sel.spec);
    if (list.indexOf(sel.spec) < 0) sel.spec = "";
  }

  function buildTrackChips() {
    chips(document.getElementById("trackChips"), ["علمي", "أدبي"], function (v) {
      sel.track = v; sel.spec = ""; buildSpecChips();
    }, sel.track);
  }

  function buildSectorChips() {
    function apply(v) {
      sel.sector = v;
      document.getElementById("feesField").hidden = (v === "حكومية");
    }
    chips(document.getElementById("sectorChips"), ["الكل", "حكومية", "أهلية"], apply, sel.sector);
    apply(sel.sector);
  }

  /* ---------- تحميل بيانات الكليات ---------- */
  goBtn.disabled = true;
  fetch("data/colleges.json", { cache: "force-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (db) {
      DATA = db;
      var notice = document.getElementById("srcNotice");
      var txt = "البيانات مأخوذة من <b>" + db.source + "</b>. تُحدَّث فور صدور دليل جديد.";
      if (db.sample) {
        notice.className = "notice";
        txt = "<b>تنبيه:</b> " + (db.sampleNote || "بيانات تجريبية للعرض فقط.") +
              " المصدر المعتمد عند التحديث: " + db.source + ".";
      }
      notice.querySelector("span").innerHTML = txt;

      var states = {};
      db.colleges.forEach(function (c) { if (c.state) states[c.state] = 1; });
      var stateSel = document.getElementById("state");
      Object.keys(states).sort().forEach(function (s) {
        var o = Site.el("option", null, s);
        o.value = s;
        stateSel.appendChild(o);
      });

      goBtn.disabled = false;
      prefill();
    })
    .catch(function () {
      msg.fail("تعذّر تحميل بيانات الكليات. تأكد من الاتصال ثم أعد تحميل الصفحة.");
    });

  /* ---------- تعبئة من صفحة النتيجة ---------- */
  function prefill() {
    var q = new URLSearchParams(location.search);
    var p = q.get("p"), t = q.get("t"), s = q.get("s");
    if (t && Tracks.list[t]) sel.track = t;
    if (s) sel.spec = s;
    buildTrackChips(); buildSpecChips(); buildSectorChips();
    if (p && !isNaN(parseFloat(p))) {
      document.getElementById("pct").value = String(Math.round(parseFloat(p) * 10) / 10);
      if (sel.track && sel.spec) search();
    }
  }

  /** يقبل الأرقام العربية والفاصلة العربية ويحوّلها إلى رقم عشري */
  function decimal(v) {
    return String(v || "")
      .replace(/[٠-٩]/g, function (d) { return String("٠١٢٣٤٥٦٧٨٩".indexOf(d)); })
      .replace(/[۰-۹]/g, function (d) { return String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)); })
      .replace(/[\u066B\u066C،,]/g, ".")   /* الفاصلة العربية ٫ وفاصلة الآلاف */
      .replace(/[^\d.]/g, "")
      .trim();
  }

  /* ---------- البحث ---------- */
  function search() {
    msg.clear();
    if (!DATA) { msg.fail("البيانات لم تكتمل تحميلها بعد."); return; }

    var pct = parseFloat(decimal(document.getElementById("pct").value));
    if (isNaN(pct) || pct <= 0 || pct > 100) { msg.fail("اكتب نسبة صحيحة بين 1 و 100."); return; }
    if (!sel.track) { msg.fail("اختر القسم: علمي أو أدبي."); return; }
    if (!sel.spec) { msg.fail("اختر التخصص الذي درسته في الثانوية."); return; }

    var state = document.getElementById("state").value;
    var maxFees = parseFloat(decimal(document.getElementById("fees").value)) || 0;

    var rows = DATA.colleges.filter(function (c) {
      if (c.specs.indexOf(sel.spec) < 0) return false;
      if (sel.sector !== "الكل" && c.sector !== sel.sector) return false;
      if (state && c.state !== state) return false;
      if (maxFees && c.sector === "أهلية" && c.fees && c.fees > maxFees) return false;
      return true;
    }).map(function (c) {
      var v = verdictOf(c.min, pct);
      return { c: c, v: v, d: c.min - pct };
    });

    rows.sort(function (a, b) {
      var o = VERDICTS[a.v].order - VERDICTS[b.v].order;
      if (o) return o;
      return Math.abs(a.d) - Math.abs(b.d);   /* الأقرب إلى نسبة الطالب أولاً */
    });

    render(rows, pct, state, maxFees);
  }

  /* ---------- العرض ---------- */
  function render(rows, pct, state, maxFees) {
    document.getElementById("rCount").textContent = rows.length
      ? Site.fmtNum(rows.length) + " كلية مطابقة" : "لا توجد نتائج";

    var meta = document.getElementById("rMeta"); meta.innerHTML = "";
    meta.appendChild(Site.cell("نسبتك", pct.toFixed(1) + "%"));
    meta.appendChild(Site.cell("القسم", "القسم " + (sel.track === "علمي" ? "العلمي" : "الأدبي")));
    meta.appendChild(Site.cell("التخصص", sel.spec));
    meta.appendChild(Site.cell("نوع الجامعة", sel.sector));
    if (state) meta.appendChild(Site.cell("الولاية", state));
    if (maxFees) meta.appendChild(Site.cell("أقصى مصاريف", Site.fmtNum(maxFees) + " ج"));

    var counts = { maybe: 0, ok: 0, high: 0, low: 0 };
    rows.forEach(function (r) { counts[r.v]++; });
    var tally = document.getElementById("rTally"); tally.innerHTML = "";
    ["high", "ok", "maybe", "low"].forEach(function (k) {
      var d = Site.el("div");
      var b = Site.el("b", null, String(counts[k]));
      b.style.color = VERDICTS[k].color;
      d.appendChild(b);
      d.appendChild(Site.el("span", null, VERDICTS[k].label));
      tally.appendChild(d);
    });

    var list = document.getElementById("rList"); list.innerHTML = "";
    if (!rows.length) {
      list.appendChild(Site.el("p", "empty",
        "لا توجد كلية مطابقة لهذه الشروط. جرّب توسيع البحث: كل الولايات، أو نوع جامعة مختلف، أو ارفع سقف المصاريف."));
    }

    rows.forEach(function (r) {
      var c = r.c, V = VERDICTS[r.v];
      var card = Site.el("div", "col " + V.cls);

      var top = Site.el("div", "top");
      var nm = Site.el("h3", "nm", c.name);
      var uni = Site.el("span", "uni", c.uni);
      var pctEl = Site.el("span", "pct", c.min.toFixed(1) + "%");
      top.appendChild(nm); top.appendChild(uni); top.appendChild(pctEl);
      card.appendChild(top);

      var tags = Site.el("div", "tags");
      tags.appendChild(Site.el("span", "verdict", V.label));
      if (c.sector) tags.appendChild(Site.el("span", "tag", c.sector));
      if (c.state) tags.appendChild(Site.el("span", "tag", c.state));
      if (c.group) tags.appendChild(Site.el("span", "tag", c.group));
      if (c.specs.length > 1) tags.appendChild(Site.el("span", "tag", "كلية مشتركة: " + c.specs.join(" + ")));
      if (c.sector === "أهلية" && c.fees) tags.appendChild(Site.el("span", "tag", "المصاريف: " + Site.fmtNum(c.fees) + " ج"));
      card.appendChild(tags);

      var d = r.d, gap;
      if (d > 0) gap = "نسبة القبول أعلى من نسبتك بـ " + d.toFixed(1) + " نقطة.";
      else if (d === 0) gap = "نسبة القبول تساوي نسبتك تماماً.";
      else gap = "نسبتك أعلى من نسبة القبول بـ " + Math.abs(d).toFixed(1) + " نقطة.";
      card.appendChild(Site.el("p", "gap", gap));

      list.appendChild(card);
    });

    document.getElementById("rNote").textContent =
      "الترتيب: القبول المحتمل أولاً، ثم القبول، ثم القبول المرتفع، وفي آخر القائمة الكليات ضعيفة الفرصة. " +
      "النسب استرشادية من " + DATA.source + " وقد تتغيّر من عام لآخر حسب عدد المتقدمين.";

    res.hidden = false;
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- الأزرار ---------- */
  goBtn.addEventListener("click", search);
  document.getElementById("pct").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") { ev.preventDefault(); search(); }
  });
  document.getElementById("pct").addEventListener("input", msg.clear);
  document.getElementById("prt").addEventListener("click", Site.print);
  document.getElementById("again").addEventListener("click", function () {
    res.hidden = true;
    document.getElementById("searchPanel").scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("pct").focus();
  });
  document.getElementById("toResult").addEventListener("click", function () {
    location.href = "result.html";
  });
})();
