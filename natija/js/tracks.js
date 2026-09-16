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

  root.Tracks = Tracks;
})(window);
