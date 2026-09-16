/* ============================================================
   المسارات والتخصصات — مرجع موحّد تستخدمه صفحة النتيجة وصفحة الكليات
   ============================================================ */
(function (root) {
  "use strict";

  var Tracks = {};

  /** التخصصات المتاحة داخل كل مسار */
  Tracks.list = {
    "علمي": ["أحياء", "هندسية", "حاسوب"],
    "أدبي": ["دراسات إسلامية", "أدب إنجليزي", "فنون وتصميم"]
  };

  /** المادة المميِّزة لكل تخصص في كشف الثانوية */
  Tracks.bySubject = {
    "الأحياء": "أحياء",
    "العلوم الهندسية": "هندسية",
    "علوم الحاسوب": "حاسوب",
    "الدراسات الإسلامية": "دراسات إسلامية",
    "الأدب الإنجليزي": "أدب إنجليزي",
    "الفنون والتصميم": "فنون وتصميم"
  };

  /** مواد يُعرف بها المسار العلمي والمسار الأدبي */
  var SCI = ["الرياضيات المتخصصة", "الفيزياء", "الكيمياء"];
  var ART = ["الرياضيات الأساسية", "الجغرافيا", "التاريخ"];

  /**
   * يستنتج المسار والتخصص من قائمة أسماء مواد الطالب.
   * @returns {{track:string, spec:string}}  قيم فارغة إذا تعذّر التحديد
   */
  Tracks.detect = function (subjectNames) {
    var names = subjectNames || [];
    var has = function (arr) { return arr.some(function (s) { return names.indexOf(s) > -1; }); };
    var track = has(SCI) ? "علمي" : (has(ART) ? "أدبي" : "");
    var spec = "";
    for (var i = 0; i < names.length; i++) {
      if (Tracks.bySubject[names[i]]) { spec = Tracks.bySubject[names[i]]; break; }
    }
    if (!track && spec) {
      track = Tracks.list["علمي"].indexOf(spec) > -1 ? "علمي" : "أدبي";
    }
    return { track: track, spec: spec };
  };

  /* ---------- نسبة المفاضلة ----------
     القبول الجامعي لا يُحسب من متوسط كل المواد، بل من أربع مواد فقط
     حسب قاعدة دليل القبول:

       المجموعة العلمية (أحياء)  : الرياضيات المتخصصة + الفيزياء + الكيمياء + الأحياء
       المجموعة العلمية (رياضيات): الرياضيات المتخصصة + الفيزياء + الكيمياء
                                   + (العلوم الهندسية أو علوم الحاسوب)
       المجموعة الأدبية          : اللغة العربية + اللغة الإنجليزية + الرياضيات الأساسية
                                   + أحسن مادة من المواد المؤهلة

     المواد المؤهلة للمجموعة الأدبية: الدراسات الإسلامية، التاريخ، الجغرافيا،
     الأدب الإنجليزي، الفنون والتصميم.                                        */
  var MUFADALA = {
    "علمي": {
      fixed: ["الرياضيات المتخصصة", "الفيزياء", "الكيمياء"],
      best: ["الأحياء", "العلوم الهندسية", "علوم الحاسوب"]
    },
    "أدبي": {
      fixed: ["اللغة العربية", "اللغة الإنجليزية", "الرياضيات الأساسية"],
      best: ["الدراسات الإسلامية", "التاريخ", "الجغرافيا", "الأدب الإنجليزي", "الفنون والتصميم"]
    }
  };
  Tracks.mufadalaRule = MUFADALA;

  /**
   * يحسب نسبة المفاضلة من درجات الطالب.
   * @param marks قائمة {name, num} — num يكون null للدرجات غير الرقمية
   * @param track "علمي" أو "أدبي"؛ يُستنتج تلقائياً إذا تُرك فارغاً
   * @returns {{pct:number, subjects:string[], total:number}|null}
   *          null إذا نقصت إحدى المواد الأربع أو كانت درجتها غير رقمية
   */
  Tracks.mufadala = function (marks, track) {
    marks = marks || [];
    if (!track) track = Tracks.detect(marks.map(function (m) { return m.name; })).track;
    var rule = MUFADALA[track];
    if (!rule) return null;

    var score = {};
    marks.forEach(function (m) { if (m && m.num !== null && m.num !== undefined) score[m.name] = m.num; });

    var picked = [], total = 0;
    for (var i = 0; i < rule.fixed.length; i++) {
      var n = rule.fixed[i];
      if (!(n in score)) return null;
      picked.push(n); total += score[n];
    }

    var bestName = null;
    rule.best.forEach(function (n) {
      if (n in score && (bestName === null || score[n] > score[bestName])) bestName = n;
    });
    if (bestName === null) return null;
    picked.push(bestName); total += score[bestName];

    return { pct: total / picked.length, subjects: picked, total: total };
  };

  root.Tracks = Tracks;
})(window);
