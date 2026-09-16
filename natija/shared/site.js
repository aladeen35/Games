/* ============================================================
   أدوات «البشري» المشتركة — Al-Bashari shared helpers
   مستخرجة من صفحة نتيجة الشهادة الثانوية 2026 ليُبنى عليها كل فرع جديد.
   الاستخدام: <script src="../shared/site.js"></script> ثم Site.xxx
   لا تعتمد على أي مكتبة خارجية، وتعمل دون إنترنت.
   ============================================================ */
(function (root) {
  "use strict";
  var Site = {};

  /* ---------- 1. أدوات عامة ---------- */

  /** يضيف فاصلة الآلاف: 12345 → "12,345" */
  Site.fmtNum = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /** يحوّل الأرقام العربية والفارسية إلى إنجليزية ويحذف ما عداها */
  Site.normalizeDigits = function (s) {
    return String(s || "")
      .replace(/[٠-٩]/g, function (d) { return String("٠١٢٣٤٥٦٧٨٩".indexOf(d)); })
      .replace(/[۰-۹]/g, function (d) { return String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)); })
      .replace(/[^\d]/g, "");
  };

  /** إنشاء عنصر مختصر */
  Site.el = function (tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };

  /** خلية بيانات لشبكة .meta — عنوان صغير فوق قيمة عريضة */
  Site.cell = function (label, value) {
    var d = Site.el("div");
    d.appendChild(Site.el("span", null, label));
    d.appendChild(Site.el("strong", null, value));
    return d;
  };

  /** عمود من أعمدة .pillars الثلاثة */
  Site.pillar = function (value, label) {
    var d = Site.el("div", "pillar");
    d.appendChild(Site.el("b", null, value));
    d.appendChild(Site.el("span", null, label));
    return d;
  };

  /* ---------- 2. رسائل الخطأ ---------- */
  Site.message = function (node) {
    var box = typeof node === "string" ? document.getElementById(node) : node;
    return {
      fail: function (t) { if (!box) return; box.textContent = t; box.className = "msg on"; },
      good: function (t) { if (!box) return; box.textContent = t; box.className = "msg good on"; },
      clear: function () { if (box) box.className = "msg"; }
    };
  };

  /* ---------- 3. رمز التحقق المصوَّر (Captcha) ----------
     Site.captcha({canvas:'cap', reload:'newcap', length:5})
     → { verify(text), redraw(), get answer() }                     */
  Site.captcha = function (opt) {
    opt = opt || {};
    var CH = opt.chars || "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var len = opt.length || 5;
    var cv = typeof opt.canvas === "string" ? document.getElementById(opt.canvas) : opt.canvas;
    if (!cv || !cv.getContext) return { verify: function () { return true; }, redraw: function () {}, answer: "" };
    var cx = cv.getContext("2d");
    var answer = "";

    function draw() {
      answer = "";
      for (var i = 0; i < len; i++) answer += CH[Math.floor(Math.random() * CH.length)];
      var w = cv.width, h = cv.height;
      cx.clearRect(0, 0, w, h);
      var g = cx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#15305F"); g.addColorStop(1, "#0E1F42");
      cx.fillStyle = g; cx.fillRect(0, 0, w, h);
      for (var n = 0; n < 7; n++) {
        cx.strokeStyle = n % 2 ? "rgba(43,196,216,.5)" : "rgba(198,163,95,.5)";
        cx.lineWidth = 1 + Math.random() * 1.6; cx.beginPath();
        cx.moveTo(Math.random() * w, Math.random() * h);
        cx.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h,
                         Math.random() * w, Math.random() * h);
        cx.stroke();
      }
      for (var d = 0; d < 45; d++) {
        cx.fillStyle = "rgba(255,255,255," + (0.1 + Math.random() * 0.3) + ")";
        cx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      var step = w / (len + 0.3);
      for (var c = 0; c < len; c++) {
        cx.save();
        var x = step * (c + 0.65) + (Math.random() * 8 - 4), y = h / 2 + (Math.random() * 12 - 6);
        cx.translate(x, y); cx.rotate(Math.random() * 0.6 - 0.3);
        cx.font = "800 " + (46 + Math.random() * 10) + "px Tajawal, Arial, sans-serif";
        cx.textAlign = "center"; cx.textBaseline = "middle";
        cx.fillStyle = c % 2 ? "#E7CE92" : "#FFFFFF";
        cx.shadowColor = "rgba(0,0,0,.55)"; cx.shadowBlur = 5;
        cx.fillText(answer[c], 0, 0);
        cx.restore();
      }
    }

    var btn = typeof opt.reload === "string" ? document.getElementById(opt.reload) : opt.reload;
    var input = typeof opt.input === "string" ? document.getElementById(opt.input) : opt.input;
    if (btn) btn.addEventListener("click", function () {
      draw();
      if (input) { input.value = ""; input.focus(); }
    });
    draw();

    return {
      redraw: draw,
      verify: function (text) { return String(text || "").trim().toUpperCase() === answer; },
      get answer() { return answer; }
    };
  };

  /* ---------- 4. الطباعة والمشاركة ---------- */
  Site.print = function () { root.print(); };

  Site.share = function (text, title) {
    if (navigator.share) {
      navigator.share({ title: title || document.title, text: text }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { alert("تم نسخ النص."); });
    } else {
      alert(text);
    }
  };

  /* ---------- 5. عدّاد الزيارات ----------
     Site.visits({box:'visits', endpoint:'/api/visits'})
     الواجهة المتوقّعة من الخادم (JSON):
       { ok:true, total:12345, online:37, countries:[{code:"SD", n:900}, ...] }
     إن فشل الطلب (استضافة ساكنة بلا دالة خادم) يُخفى الصندوق بهدوء.      */
  var COUNTRY_NAMES = {
    SD:"السودان",SA:"السعودية",EG:"مصر",AE:"الإمارات",QA:"قطر",KW:"الكويت",BH:"البحرين",
    OM:"عُمان",YE:"اليمن",JO:"الأردن",LB:"لبنان",SY:"سوريا",IQ:"العراق",PS:"فلسطين",LY:"ليبيا",
    TN:"تونس",DZ:"الجزائر",MA:"المغرب",MR:"موريتانيا",SO:"الصومال",DJ:"جيبوتي",KM:"جزر القمر",
    SS:"جنوب السودان",ET:"إثيوبيا",ER:"إريتريا",TD:"تشاد",KE:"كينيا",UG:"أوغندا",TZ:"تنزانيا",
    NG:"نيجيريا",GH:"غانا",ZA:"جنوب أفريقيا",TR:"تركيا",IR:"إيران",PK:"باكستان",IN:"الهند",
    BD:"بنغلاديش",ID:"إندونيسيا",MY:"ماليزيا",CN:"الصين",JP:"اليابان",KR:"كوريا الجنوبية",
    TH:"تايلاند",PH:"الفلبين",GB:"بريطانيا",IE:"أيرلندا",US:"أمريكا",CA:"كندا",AU:"أستراليا",
    NZ:"نيوزيلندا",DE:"ألمانيا",FR:"فرنسا",NL:"هولندا",BE:"بلجيكا",SE:"السويد",NO:"النرويج",
    DK:"الدنمارك",FI:"فنلندا",IT:"إيطاليا",ES:"إسبانيا",PT:"البرتغال",CH:"سويسرا",AT:"النمسا",
    PL:"بولندا",RU:"روسيا",UA:"أوكرانيا",RO:"رومانيا",GR:"اليونان",CY:"قبرص",BR:"البرازيل",
    AR:"الأرجنتين",MX:"المكسيك",AZ:"أذربيجان",KZ:"كازاخستان",AF:"أفغانستان",ZZ:"غير معروف"
  };
  Site.countryNames = COUNTRY_NAMES;

  Site.flagEmoji = function (code) {
    if (!/^[A-Z]{2}$/.test(code) || code === "ZZ") return "🌐";
    return String.fromCodePoint(0x1F1E6 + code.charCodeAt(0) - 65, 0x1F1E6 + code.charCodeAt(1) - 65);
  };

  Site.visits = function (opt) {
    opt = opt || {};
    var box = document.getElementById(opt.box || "visits");
    if (!box || typeof fetch !== "function") return;
    var endpoint = opt.endpoint || "/api/visits";
    var every = opt.interval || 45000;

    function sid() {
      try {
        var k = sessionStorage.getItem("vsid");
        if (!k) { k = Math.random().toString(36).slice(2, 12); sessionStorage.setItem("vsid", k); }
        return k;
      } catch (e) {
        if (!root.__vsid) root.__vsid = Math.random().toString(36).slice(2, 12);
        return root.__vsid;
      }
    }

    var shown = false;
    function render(d) {
      if (!d || !d.ok) throw 0;
      box.style.display = ""; shown = true;
      var t = document.getElementById("vTotal"), o = document.getElementById("vOnline"),
          c = document.getElementById("vCountries"), wrap = document.getElementById("vFlags");
      if (t) t.textContent = Site.fmtNum(d.total);
      if (o) o.textContent = Site.fmtNum(d.online);
      var cs = d.countries || [];
      if (c) c.textContent = Site.fmtNum(cs.length);
      if (!wrap) return;
      wrap.innerHTML = "";
      cs.slice(0, opt.maxFlags || 12).forEach(function (x) {
        var s = Site.el("span", "flag");
        s.appendChild(Site.el("em", null, Site.flagEmoji(x.code)));
        s.appendChild(document.createTextNode(" " + (COUNTRY_NAMES[x.code] || x.code) + " "));
        s.appendChild(Site.el("b", null, Site.fmtNum(x.n)));
        wrap.appendChild(s);
      });
    }

    /* زيارة واحدة لكل جلسة مهما تنقّل الزائر بين صفحات الموقع:
       أول صفحة ترسل hit، وما بعدها ping — حتى لا يتضخّم إجمالي الزيارات
       عند تقسيم الموقع إلى عدّة صفحات. */
    function firstMode() {
      if (opt.countOncePerSession === false) return "hit";
      try {
        if (sessionStorage.getItem("vhit")) return "ping";
        sessionStorage.setItem("vhit", "1");
        return "hit";
      } catch (e) {
        if (root.__vhit) return "ping";
        root.__vhit = 1;
        return "hit";
      }
    }

    function poll(mode) {
      try {
        fetch(endpoint + "?m=" + mode + "&sid=" + sid(), { cache: "no-store" })
          .then(function (r) { return r.json(); })
          .then(render)
          .catch(function () { if (!shown) box.style.display = "none"; });
      } catch (e) { if (!shown) box.style.display = "none"; }
    }

    poll(firstMode());
    setInterval(function () { if (!document.hidden) poll("ping"); }, every);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) poll("ping"); });
  };

  root.Site = Site;
})(window);
