/* ============================================================
   صفحة النتيجة — الاستعلام برقم الجلوس
   البيانات تُحمَّل من data/students.json بالصيغة المضغوطة.
   ============================================================ */
(function () {
  "use strict";

  var B36 = "0123456789abcdefghijklmnopqrstuvwxyz";
  function un36(s) { var n = 0; for (var i = 0; i < s.length; i++) n = n * 36 + B36.indexOf(s[i]); return n; }

  var DB = null, T, S, SUB, R, IDX = new Map(), minSeat = Infinity, maxSeat = -Infinity;
  var RANK = null, current = null;

  var msg = Site.message("msg");
  var cap = Site.captcha({ canvas: "cap", reload: "newcap", input: "code" });
  var res = document.getElementById("result");
  var hint = document.getElementById("hint");
  var goBtn = document.getElementById("go");

  /* ---------- تحميل الكشف ---------- */
  goBtn.disabled = true;
  fetch("data/students.json", { cache: "force-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (db) {
      DB = db; T = db.T; S = db.S; SUB = db.C; R = db.R;
      for (var i = 0; i < R.length; i++) {
        var s = +R[i].slice(0, R[i].indexOf("~"));
        IDX.set(s, i);
        if (s < minSeat) minSeat = s;
        if (s > maxSeat) maxSeat = s;
      }
      hint.textContent = "أرقام الجلوس المتاحة من " + minSeat + " إلى " + maxSeat +
                         " · " + Site.fmtNum(R.length) + " طالباً وطالبة";
      goBtn.disabled = false;
      document.getElementById("seat").focus();
    })
    .catch(function () {
      hint.textContent = "";
      msg.fail("تعذّر تحميل كشف النتائج. تأكد من الاتصال ثم أعد تحميل الصفحة.");
    });

  /* ---------- قراءة سجل ---------- */
  function parse(i) {
    var f = R[i].split("~");
    var names = f[1].split(".").map(function (t) { return T[un36(t)]; }).filter(Boolean);
    var idx = f[5].split(""), mk = f[6] ? f[6].split(",") : [];
    var marks = [], sum = 0, cnt = 0, pass50 = 0, numeric = 0;
    for (var k = 0; k < idx.length; k++) {
      var v = mk[k], num = parseFloat(v);
      var isNum = v !== "" && v !== undefined && !isNaN(num);
      marks.push({ name: SUB[un36(idx[k])], val: v, num: isNum ? num : null });
      cnt++;
      if (isNum) { sum += num; numeric++; if (num >= 50) pass50++; }
    }
    return {
      seat: +f[0], names: names, school: S[un36(f[2])], sex: +f[3], st: f[4],
      marks: marks, sum: sum, cnt: cnt, numeric: numeric, pass50: pass50,
      pct: numeric === cnt && cnt > 0 ? sum / cnt : null
    };
  }

  /* ---------- الترتيب ---------- */
  function buildRanks() {
    if (RANK) return RANK;
    var all = [], bySchool = {}, schoolCount = {};
    for (var i = 0; i < R.length; i++) {
      var f = R[i].split("~"), sc = f[2];
      schoolCount[sc] = (schoolCount[sc] || 0) + 1;
      if (f[4] !== "ن") continue;
      var mk = f[6] ? f[6].split(",") : [], s = 0, ok = mk.length > 0;
      for (var k = 0; k < mk.length; k++) {
        var n = parseFloat(mk[k]);
        if (isNaN(n)) { ok = false; break; }
        s += n;
      }
      if (!ok) continue;
      var p = s / mk.length;
      all.push([+f[0], p]);
      (bySchool[sc] = bySchool[sc] || []).push([+f[0], p]);
    }
    function rankList(arr) {
      arr.sort(function (a, b) { return b[1] - a[1]; });
      var m = new Map(), last = null, lastRank = 0;
      for (var j = 0; j < arr.length; j++) {
        var r = (last !== null && Math.abs(arr[j][1] - last) < 1e-9) ? lastRank : j + 1;
        m.set(arr[j][0], r); last = arr[j][1]; lastRank = r;
      }
      return { map: m, total: arr.length };
    }
    var state = rankList(all), schools = {};
    for (var key in bySchool) schools[key] = rankList(bySchool[key]);
    RANK = { state: state, schools: schools, count: schoolCount };
    return RANK;
  }

  /* ---------- مساعدات العرض ---------- */
  var STATUS = {
    "ن":  { t: "ناجح",    f: "ناجحة",   c: "ok" },
    "ر":  { t: "راسب",    f: "راسبة",   c: "no" },
    "غ":  { t: "حالة غش", f: "حالة غش", c: "no" }
  };
  function grade(p) {
    if (p >= 90) return "ممتاز";
    if (p >= 80) return "جيد جداً";
    if (p >= 70) return "جيد";
    if (p >= 60) return "مقبول";
    return "ناجح";
  }

  /* ---------- العرض ---------- */
  function show(i) {
    var st = parse(i), female = st.sex === 1, info = STATUS[st.st];
    var det = Tracks.detect(st.marks.map(function (m) { return m.name; }));
    var muf = Tracks.mufadala(st.marks, det.track);
    current = {
      pct: st.pct, muf: muf, track: det.track, spec: det.spec, status: st.st
    };

    document.getElementById("rName").textContent = st.names.join(" ");
    var b = document.getElementById("rBadge");
    if (info) { b.textContent = female ? info.f : info.t; b.className = "badge " + info.c; }
    else { b.textContent = "حالة خاصة (" + st.st + ")"; b.className = "badge warn"; }

    var meta = document.getElementById("rMeta"); meta.innerHTML = "";
    meta.appendChild(Site.cell("رقم الجلوس", String(st.seat)));
    meta.appendChild(Site.cell("المدرسة", st.school));
    meta.appendChild(Site.cell("الولاية", "الشمالية"));
    meta.appendChild(Site.cell("النوع", female ? "طالبة" : "طالب"));
    meta.appendChild(Site.cell("القسم", det.track ? "القسم " + (det.track === "علمي" ? "العلمي" : "الأدبي") : "—"));
    meta.appendChild(Site.cell("التخصص", det.spec || "—"));

    var pil = document.getElementById("rPillars"); pil.innerHTML = "";
    pil.className = "pillars";
    if (st.pct !== null) {
      pil.appendChild(Site.pillar(st.sum + " / " + (st.cnt * 100), "المجموع الكلي"));
      pil.appendChild(Site.pillar(st.pct.toFixed(1) + "%", "النسبة المئوية"));
      if (muf) {
        pil.className = "pillars p4";
        pil.appendChild(Site.pillar(muf.pct.toFixed(1) + "%", "نسبة المفاضلة"));
      }
      pil.appendChild(Site.pillar(
        st.st === "ن" ? grade(st.pct) : (st.pass50 + " / " + st.cnt),
        st.st === "ن" ? "التقدير" : "مواد بدرجة 50 فأكثر"));
    } else {
      pil.appendChild(Site.pillar("—", "المجموع الكلي"));
      pil.appendChild(Site.pillar("—", "النسبة المئوية"));
      pil.appendChild(Site.pillar(info ? (female && info.f ? info.f : info.t) : st.st, "الحالة"));
    }

    var tb = document.getElementById("rMarks"); tb.innerHTML = "";
    st.marks.forEach(function (m) {
      var tr = Site.el("tr");
      tr.appendChild(Site.el("td", null, m.name));
      var td = Site.el("td"), sp = Site.el("span", "mk");
      if (m.num === null) { sp.className = "mk abs"; sp.textContent = m.val; }
      else { if (m.num < 50) sp.className = "mk low"; sp.textContent = String(m.num); }
      td.appendChild(sp); tr.appendChild(td); tb.appendChild(tr);
    });

    var notes = [];
    if (st.st === "ن" && st.pct !== null) {
      var rk = buildRanks(), k = R[i].split("~")[2];
      var rs = rk.state.map.get(st.seat), sc = rk.schools[k];
      var rsc = sc ? sc.map.get(st.seat) : null;
      if (rs) notes.push("الترتيب على مستوى الولاية بين الناجحين: " + Site.fmtNum(rs) + " من " + Site.fmtNum(rk.state.total) + ".");
      if (rsc) notes.push("الترتيب على مستوى المدرسة بين الناجحين: " + rsc + " من " + sc.total + ".");
    }
    if (muf) {
      notes.push("نسبة المفاضلة (" + muf.pct.toFixed(1) + "%) هي التي يُحسب عليها القبول الجامعي، " +
                 "وتُؤخذ من أربع مواد: " + muf.subjects.join("، ") + ".");
    }
    if (st.marks.some(function (m) { return m.val === "غ"; })) notes.push("الرمز «غ» في خانة المادة يعني حالة غش.");
    if (st.marks.some(function (m) { return m.num === null && m.val !== "غ"; })) notes.push("الرموز الأخرى في خانة الدرجة رموز خاصة تُراجع مع مكتب التعليم بالمحلية.");
    if (!info) notes.push("هذه حالة خاصة مسجّلة بالرمز «" + st.st + "»، ويُرجى مراجعة مكتب التعليم بالمحلية.");
    if (st.cnt === 0) notes.push("لا توجد درجات مسجّلة لهذا الرقم في الكشف.");
    document.getElementById("rNote").textContent = notes.join(" ");

    /* زر الانتقال إلى الكليات — يظهر للناجحين بنسبة محسوبة فقط */
    var cbtn = document.getElementById("toColleges");
    cbtn.style.display = (st.st === "ن" && st.pct !== null && det.track) ? "" : "none";

    res.hidden = false;
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- البحث ---------- */
  function search() {
    msg.clear();
    if (!DB) { msg.fail("الكشف لم يكتمل تحميله بعد، انتظر لحظة."); return; }
    var seatEl = document.getElementById("seat"), codeEl = document.getElementById("code");
    var raw = Site.normalizeDigits(seatEl.value);
    if (!raw) { msg.fail("اكتب رقم الجلوس أولاً."); seatEl.focus(); return; }
    if (!cap.verify(codeEl.value)) {
      msg.fail("رمز التحقق غير صحيح. أعد كتابة الرمز الظاهر في الصورة.");
      cap.redraw(); codeEl.value = ""; codeEl.focus(); return;
    }
    var seat = parseInt(raw, 10);
    if (!IDX.has(seat)) {
      res.hidden = true;
      msg.fail("لا توجد نتيجة لرقم الجلوس " + seat + ". تأكد من الرقم، فالأرقام المتاحة من " + minSeat + " إلى " + maxSeat + ".");
      cap.redraw(); codeEl.value = ""; return;
    }
    show(IDX.get(seat));
    cap.redraw(); codeEl.value = "";
  }

  goBtn.addEventListener("click", search);
  ["seat", "code"].forEach(function (id) {
    var e = document.getElementById(id);
    e.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); search(); } });
    e.addEventListener("input", msg.clear);
  });

  /* ---------- الأزرار ---------- */
  document.getElementById("prt").addEventListener("click", Site.print);

  document.getElementById("shr").addEventListener("click", function () {
    Site.share(
      document.getElementById("rName").textContent + " — " + document.getElementById("rBadge").textContent +
      "\nنتيجة الشهادة الثانوية للولاية الشمالية 2026",
      "نتيجة الشهادة الثانوية 2026");
  });

  document.getElementById("again").addEventListener("click", function () {
    res.hidden = true;
    document.getElementById("seat").value = "";
    document.getElementById("code").value = "";
    cap.redraw(); msg.clear();
    document.getElementById("searchPanel").scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("seat").focus();
  });

  /* الانتقال إلى صفحة الكليات بنسبة الطالب وتخصصه جاهزَين */
  document.getElementById("toColleges").addEventListener("click", function () {
    if (!current || current.pct === null) return;
    /* القبول يُحسب على نسبة المفاضلة، ويُرجع إلى النسبة العامة إن تعذّر حسابها */
    var p = current.muf ? current.muf.pct : current.pct;
    location.href = "colleges.html?p=" + p.toFixed(2) +
                    "&t=" + encodeURIComponent(current.track) +
                    "&s=" + encodeURIComponent(current.spec);
  });
})();
