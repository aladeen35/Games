/* ============================================================
   مطابقة الكليات — يرتّب تخصصات دليل القبول حسب نسبة مفاضلة الطالب وتخصصه
   مصدر البيانات: data/colleges.json المبني من ملف نتيجة القبول 2024
   ============================================================ */
(function () {
  "use strict";

  /* ---------- قاعدة الترميز اللوني ----------
     الفارق = نسبة قبول التخصص − نسبة مفاضلة الطالب
       الفارق ≥ 10          → أحمر        ضعيف أو معدوم   (آخر القائمة)
       0 <  الفارق < 10     → برتقالي     قبول محتمل      (أعلى القائمة)
       −5 ≤ الفارق ≤ 0      → أخضر خفيف   قبول
       الفارق < −5          → أخضر غامق   قبول مرتفع
     غيّر الأرقام هنا وحدها إن أردت تعديل الحدود.                  */
  var RULES = { weak: 10, close: 5 };

  var VERDICTS = {
    maybe: { cls: "v-maybe", label: "قبول محتمل",    order: 0, color: "#D98324" },
    ok:    { cls: "v-ok",    label: "قبول",          order: 1, color: "#5FB07A" },
    high:  { cls: "v-high",  label: "قبول مرتفع",    order: 2, color: "#12693F" },
    low:   { cls: "v-low",   label: "ضعيف أو معدوم", order: 3, color: "#B3342F" }
  };

  function verdictOf(collegeMin, studentPct) {
    var d = collegeMin - studentPct;
    if (d >= RULES.weak) return "low";
    if (d > 0) return "maybe";
    if (d >= -RULES.close) return "ok";
    return "high";
  }

  var PAGE = 60;   /* عدد البطاقات في كل دفعة */

  /* ---------- الحالة ---------- */
  var DATA = null, sel = { track: "", spec: "" };
  var rows = [], drawn = 0;
  var msg = Site.message("msg");
  var res = document.getElementById("result");
  var goBtn = document.getElementById("go");
  var moreBtn = document.getElementById("more");

  function norm(s) {
    return String(s || "").replace(/[إأآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
  }

  /** يقبل الأرقام العربية والفاصلة العربية ويحوّلها إلى رقم عشري */
  function decimal(v) {
    return String(v || "")
      .replace(/[٠-٩]/g, function (d) { return String("٠١٢٣٤٥٦٧٨٩".indexOf(d)); })
      .replace(/[۰-۹]/g, function (d) { return String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)); })
      .replace(/[٫٬،,]/g, ".")
      .replace(/[^\d.]/g, "")
      .trim();
  }

  /* ---------- أزرار الاختيار ---------- */
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
    if (list.indexOf(sel.spec) < 0) sel.spec = "";
    chips(document.getElementById("specChips"), list, function (v) { sel.spec = v; }, sel.spec);
  }

  function buildTrackChips() {
    chips(document.getElementById("trackChips"), ["علمي", "أدبي"], function (v) {
      sel.track = v; sel.spec = ""; buildSpecChips();
    }, sel.track);
  }

  /* ---------- قوائم القسم والجامعات ---------- */
  function fillSections() {
    var s = document.getElementById("sec");
    s.innerHTML = "";
    DATA.sections.forEach(function (x) {
      var n = DATA.colleges.reduce(function (a, c) { return a + (c.sec === x.id ? 1 : 0); }, 0);
      var o = Site.el("option", null, x.label + " (" + Site.fmtNum(n) + " تخصص)");
      o.value = String(x.id);
      s.appendChild(o);
    });
    s.addEventListener("change", fillUnis);
  }

  function currentSection() {
    var id = parseInt(document.getElementById("sec").value, 10) || 0;
    for (var i = 0; i < DATA.sections.length; i++) if (DATA.sections[i].id === id) return DATA.sections[i];
    return DATA.sections[0];
  }

  function fillUnis() {
    var sec = currentSection();
    var byState = !!sec.byState;
    document.getElementById("uniLabel").textContent = (byState ? "الولاية" : "الجامعة") + " (اختياري)";
    var seen = {};
    DATA.colleges.forEach(function (c) { if (c.sec === sec.id) seen[c.u] = 1; });
    var list = Object.keys(seen).map(Number).sort(function (a, b) {
      return DATA.unis[a].localeCompare(DATA.unis[b], "ar");
    });
    var u = document.getElementById("uni");
    u.innerHTML = "";
    var all = Site.el("option", null, byState ? "كل الولايات" : "كل الجامعات");
    all.value = "";
    u.appendChild(all);
    list.forEach(function (i) {
      var o = Site.el("option", null, DATA.unis[i]);
      o.value = String(i);
      u.appendChild(o);
    });
  }

  /* ---------- تحميل البيانات ---------- */
  goBtn.disabled = true;
  fetch("data/colleges.json", { cache: "force-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (db) {
      DATA = db;
      var notice = document.getElementById("srcNotice");
      var txt = "البيانات مأخوذة من <b>" + db.source + "</b>، وهو آخر ملف منشور. " +
                "النسبة هي الحد الأدنى للقبول في التخصص.";
      if (db.sample) {
        txt = "<b>تنبيه:</b> " + (db.sampleNote || "بيانات تجريبية للعرض فقط.");
      } else if (db.specsInferred) {
        txt += " التخصصات المؤهِّلة لكل كلية مستنتجة من اسم البرنامج، " +
               "فراجع شروط الكلية في الدليل الرسمي قبل التقديم.";
      }
      notice.querySelector("span").innerHTML = txt;

      fillSections();
      fillUnis();
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
    buildTrackChips(); buildSpecChips();
    if (p && !isNaN(parseFloat(p))) {
      document.getElementById("pct").value = String(Math.round(parseFloat(p) * 10) / 10);
      if (sel.track && sel.spec) search();
    }
  }

  /* ---------- البحث ---------- */
  function search() {
    msg.clear();
    if (!DATA) { msg.fail("البيانات لم تكتمل تحميلها بعد."); return; }

    var pct = parseFloat(decimal(document.getElementById("pct").value));
    if (isNaN(pct) || pct <= 0 || pct > 100) { msg.fail("اكتب نسبة مفاضلة صحيحة بين 1 و 100."); return; }
    if (!sel.track) { msg.fail("اختر القسم: علمي أو أدبي."); return; }
    if (!sel.spec) { msg.fail("اختر التخصص الذي درسته في الثانوية."); return; }

    var sec = currentSection();
    var uni = document.getElementById("uni").value;
    var q = norm(document.getElementById("q").value);

    rows = [];
    for (var i = 0; i < DATA.colleges.length; i++) {
      var c = DATA.colleges[i];
      if (c.sec !== sec.id) continue;
      if (c.s.indexOf(sel.spec) < 0) continue;
      if (uni !== "" && String(c.u) !== uni) continue;
      if (q && norm(c.n).indexOf(q) < 0 && norm(DATA.unis[c.u]).indexOf(q) < 0
          && norm(c.at).indexOf(q) < 0) continue;
      var v = verdictOf(c.p, pct);
      rows.push({ c: c, v: v, d: c.p - pct });
    }

    rows.sort(function (a, b) {
      var o = VERDICTS[a.v].order - VERDICTS[b.v].order;
      if (o) return o;
      return Math.abs(a.d) - Math.abs(b.d);   /* الأقرب إلى نسبة الطالب أولاً */
    });

    renderHead(pct, sec, uni, q);
    drawn = 0;
    document.getElementById("rList").innerHTML = "";
    drawMore();

    res.hidden = false;
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- العرض ---------- */
  function renderHead(pct, sec, uni, q) {
    document.getElementById("rCount").textContent = rows.length
      ? Site.fmtNum(rows.length) + " تخصص مطابق" : "لا توجد نتائج";

    var meta = document.getElementById("rMeta"); meta.innerHTML = "";
    meta.appendChild(Site.cell("نسبة المفاضلة", pct.toFixed(1) + "%"));
    meta.appendChild(Site.cell("القسم", "القسم " + (sel.track === "علمي" ? "العلمي" : "الأدبي")));
    meta.appendChild(Site.cell("التخصص", sel.spec));
    meta.appendChild(Site.cell("نوع القبول", sec.label));
    if (uni !== "") meta.appendChild(Site.cell(sec.byState ? "الولاية" : "الجامعة", DATA.unis[+uni]));
    if (q) meta.appendChild(Site.cell("بحث", q));

    var counts = { maybe: 0, ok: 0, high: 0, low: 0 };
    rows.forEach(function (r) { counts[r.v]++; });
    var tally = document.getElementById("rTally"); tally.innerHTML = "";
    ["high", "ok", "maybe", "low"].forEach(function (k) {
      var d = Site.el("div");
      var b = Site.el("b", null, Site.fmtNum(counts[k]));
      b.style.color = VERDICTS[k].color;
      d.appendChild(b);
      d.appendChild(Site.el("span", null, VERDICTS[k].label));
      tally.appendChild(d);
    });

    document.getElementById("rNote").textContent =
      "الترتيب: القبول المحتمل أولاً، ثم القبول، ثم القبول المرتفع، وفي آخر القائمة ضعيفة الفرصة. " +
      "النسب من " + DATA.source + ". النسبة شرط أولي والقبول النهائي يخضع للمفاضلة وعدد المقاعد.";
  }

  function card(r) {
    var c = r.c, V = VERDICTS[r.v];
    var el = Site.el("div", "col " + V.cls);

    var top = Site.el("div", "top");
    top.appendChild(Site.el("h3", "nm", c.n));
    /* في قسم الولائي: الجامعة المضيفة ثم اسم الولاية صاحبة النصيب */
    top.appendChild(Site.el("span", "uni", c.at ? c.at + " · ولاية " + DATA.unis[c.u] : DATA.unis[c.u]));
    top.appendChild(Site.el("span", "pct", c.p.toFixed(1) + "%"));
    el.appendChild(top);

    var tags = Site.el("div", "tags");
    tags.appendChild(Site.el("span", "verdict", V.label));
    if (c.c) tags.appendChild(Site.el("span", "tag", "درجة المفاضلة: " + c.c));
    if (c.s.length >= 6) tags.appendChild(Site.el("span", "tag", "يقبل كل التخصصات"));
    else if (c.s.length > 1) tags.appendChild(Site.el("span", "tag", "مشترك: " + c.s.join(" + ")));
    if (!c.g) tags.appendChild(Site.el("span", "tag", "التخصص غير مؤكد"));
    el.appendChild(tags);

    var d = r.d, gap;
    if (d > 0) gap = "نسبة القبول أعلى من نسبتك بـ " + d.toFixed(1) + " نقطة.";
    else if (d === 0) gap = "نسبة القبول تساوي نسبتك تماماً.";
    else gap = "نسبتك أعلى من نسبة القبول بـ " + Math.abs(d).toFixed(1) + " نقطة.";
    el.appendChild(Site.el("p", "gap", gap));
    return el;
  }

  function drawMore() {
    var list = document.getElementById("rList");
    if (!rows.length) {
      list.appendChild(Site.el("p", "empty",
        "لا يوجد تخصص مطابق لهذه الشروط. جرّب نوع قبول آخر، أو كل الجامعات، أو امسح كلمة البحث."));
      moreBtn.hidden = true;
      return;
    }
    var frag = document.createDocumentFragment();
    var end = Math.min(drawn + PAGE, rows.length);
    for (var i = drawn; i < end; i++) frag.appendChild(card(rows[i]));
    list.appendChild(frag);
    drawn = end;
    moreBtn.hidden = drawn >= rows.length;
    if (!moreBtn.hidden) {
      moreBtn.textContent = "عرض المزيد (" + Site.fmtNum(rows.length - drawn) + " متبقّ)";
    }
  }

  /* ---------- الأزرار ---------- */
  goBtn.addEventListener("click", search);
  moreBtn.addEventListener("click", drawMore);
  ["pct", "q"].forEach(function (id) {
    var e = document.getElementById(id);
    e.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); search(); } });
    e.addEventListener("input", msg.clear);
  });
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
