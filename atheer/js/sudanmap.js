/* =====================================================================
   خريطة السودان — لغز الولايات الثماني عشرة (بعد 2011) بالعربية والإنجليزية
   اسحب كل ولاية إلى مكانها، وتعرّف على معالمها، ثم اختبر نفسك
   الحدود: geoBoundaries (SDN ADM1، رخصة مفتوحة) مبسّطة بخوارزمية تحافظ على الحدود المشتركة
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'sudanmap';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';

  /* ---------- الحدود: خط الطول/العرض × 100 (أزواج متتالية) ---------- */
  const GEO = {
    wkordofan: [2900,967,2908,975,2954,975,2954,1008,2998,1029,2984,1056,2939,1094,2934,1114,2947,1125,2950,1138,2938,1170,2922,1175,2927,1198,2942,1216,2952,1236,2963,1246,2979,1274,2959,1309,2952,1340,2926,1350,2910,1368,2826,1402,2806,1398,2799,1406,2778,1412,2744,1410,2748,1398,2746,1374,2754,1364,2752,1350,2738,1334,2736,1317,2714,1291,2712,1258,2706,1210,2722,1176,2726,1127,2730,1105,2726,1086,2748,1039,2745,1024,2748,979,2758,962,2790,961,2804,935,2877,935,2880,949],
    gezira: [3357,1546,3331,1539,3317,1522,3268,1538,3267,1518,3254,1520,3254,1478,3235,1465,3249,1428,3245,1420,3258,1392,3266,1391,3274,1361,3283,1356,3294,1370,3306,1384,3306,1404,3324,1408,3332,1400,3346,1366,3362,1366,3363,1404,3367,1410,3399,1400,3393,1414,3402,1431,3428,1473,3404,1514,3365,1530],
    bluenile: [3505,1174,3492,1195,3478,1242,3464,1252,3449,1254,3423,1246,3403,1222,3386,1215,3317,1174,3314,1163,3326,1083,3322,1074,3348,1066,3380,1034,3399,1006,3399,991,3389,962,3390,950,3411,956,3422,990,3424,1006,3435,1022,3428,1054,3447,1081,3460,1090,3478,1072,3498,1088,3501,1118,3494,1124,3506,1142,3509,1164],
    cdarfur: [2444,1312,2462,1323,2468,1343,2447,1342,2413,1327,2391,1339,2350,1356,2322,1343,2318,1330,2308,1326,2295,1310,2290,1294,2268,1279,2261,1266,2270,1248,2272,1226,2259,1206,2256,1163,2278,1140,2294,1142,2298,1122,2291,1102,2311,1108,2318,1118,2334,1116,2340,1124,2360,1130,2374,1142,2372,1164,2376,1190,2369,1213,2379,1245,2378,1269,2388,1280,2410,1283,2421,1294,2438,1299],
    edarfur: [2722,1176,2680,1175,2664,1184,2635,1188,2621,1194,2590,1234,2609,1241,2609,1248,2593,1268,2558,1286,2546,1296,2546,1269,2542,1250,2546,1240,2532,1220,2528,1170,2537,1142,2555,1130,2554,1118,2570,1106,2570,1094,2578,1072,2597,1050,2593,1038,2598,1014,2622,990,2632,960,2666,948,2676,949,2708,962,2758,962,2748,979,2745,1024,2748,1039,2726,1086,2730,1105,2726,1127],
    gedaref: [3399,1400,3410,1381,3458,1326,3478,1320,3486,1303,3501,1290,3511,1290,3523,1278,3570,1266,3599,1272,3617,1269,3616,1293,3628,1338,3650,1384,3646,1398,3654,1422,3635,1428,3608,1420,3585,1434,3592,1485,3573,1487,3478,1546,3470,1554,3438,1568,3398,1576,3362,1566,3357,1546,3365,1530,3404,1514,3428,1473,3402,1431,3393,1414],
    kassala: [3654,1422,3644,1516,3653,1523,3677,1584,3697,1643,3690,1668,3703,1680,3701,1708,3676,1700,3617,1704,3608,1702,3566,1720,3567,1642,3542,1627,3534,1631,3440,1629,3424,1607,3434,1585,3438,1568,3470,1554,3478,1546,3573,1487,3592,1485,3585,1434,3608,1420,3635,1428],
    khartoum: [3357,1546,3362,1566,3398,1576,3438,1568,3434,1585,3422,1606,3366,1598,3328,1617,3280,1626,3270,1634,3217,1640,3188,1663,3170,1653,3201,1584,3210,1572,3235,1519,3254,1520,3267,1518,3268,1538,3317,1522,3331,1539],
    ndarfur: [2444,1312,2476,1310,2498,1296,2546,1296,2558,1286,2593,1268,2609,1248,2609,1241,2590,1234,2621,1194,2635,1188,2664,1184,2680,1175,2722,1176,2706,1210,2712,1258,2714,1291,2736,1317,2738,1334,2752,1350,2754,1364,2746,1374,2748,1398,2744,1410,2734,1426,2720,1480,2707,1508,2694,1653,2750,1652,2750,1872,2750,2001,2500,2002,2400,2000,2400,1866,2400,1805,2400,1682,2400,1572,2360,1576,2334,1570,2311,1572,2292,1556,2300,1523,2278,1498,2288,1490,2282,1456,2301,1455,2314,1436,2310,1422,2324,1401,2310,1375,2318,1370,2322,1343,2350,1356,2391,1339,2413,1327,2447,1342,2468,1343,2462,1323],
    nkordofan: [3170,1653,3092,1652,2934,1652,2825,1652,2750,1652,2694,1653,2707,1508,2720,1480,2734,1426,2744,1410,2778,1412,2799,1406,2806,1398,2826,1402,2910,1368,2926,1350,2952,1340,2959,1309,2979,1274,3001,1271,3003,1248,3033,1254,3045,1245,3056,1226,3071,1227,3102,1238,3098,1260,3144,1266,3168,1260,3168,1286,3174,1301,3202,1322,3198,1338,3203,1348,3188,1362,3178,1387,3160,1401,3153,1430,3161,1462,3188,1476,3196,1496,3204,1505,3235,1519,3210,1572,3201,1584],
    northern: [3188,1663,3238,1733,3220,1784,3234,1820,3266,1850,3226,1889,3232,1961,3235,2042,3240,2130,3241,2200,3141,2200,3048,2200,2928,2200,2767,2200,2604,2200,2500,2200,2500,2120,2500,2002,2750,2001,2750,1872,2750,1652,2825,1652,2934,1652,3092,1652,3170,1653],
    redsea: [3701,1708,3732,1710,3740,1706,3761,1738,3776,1738,3801,1756,3826,1756,3834,1765,3854,1808,3816,1824,3803,1846,3774,1871,3757,1871,3743,1884,3734,1914,3730,1948,3724,1956,3726,1986,3719,2045,3724,2056,3717,2088,3733,2106,3706,2136,3694,2156,3689,2182,3690,2206,3644,2236,3624,2264,3591,2272,3566,2300,3562,2314,3520,2278,3494,2286,3468,2230,3415,2220,3401,2177,3356,2172,3326,2152,3335,2125,3329,2118,3328,2092,3356,2074,3367,2050,3361,2007,3370,1971,3368,1936,3380,1917,3412,1837,3461,1818,3486,1794,3514,1760,3535,1741,3566,1720,3608,1702,3617,1704,3676,1700],
    rivernile: [3566,1720,3535,1741,3514,1760,3486,1794,3461,1818,3412,1837,3380,1917,3368,1936,3370,1971,3361,2007,3367,2050,3356,2074,3328,2092,3329,2118,3335,2125,3326,2152,3356,2172,3316,2200,3241,2200,3240,2130,3235,2042,3232,1961,3226,1889,3266,1850,3234,1820,3220,1784,3238,1733,3188,1663,3217,1640,3270,1634,3280,1626,3328,1617,3366,1598,3422,1606,3434,1585,3438,1568,3434,1585,3424,1607,3440,1629,3534,1631,3542,1627,3567,1642],
    sennar: [3294,1370,3296,1340,3291,1328,3306,1304,3318,1293,3307,1265,3326,1222,3317,1174,3386,1215,3403,1222,3423,1246,3449,1254,3464,1252,3478,1242,3492,1195,3505,1174,3528,1194,3546,1229,3570,1266,3523,1278,3511,1290,3501,1290,3486,1303,3478,1320,3458,1326,3410,1381,3399,1400,3367,1410,3363,1404,3362,1366,3346,1366,3332,1400,3324,1408,3306,1404,3306,1384],
    sdarfur: [2291,1102,2288,1092,2300,1072,2333,1044,2367,990,2370,968,2361,947,2362,923,2349,917,2352,882,2373,870,2386,873,2408,868,2426,870,2452,885,2454,906,2462,932,2474,948,2474,971,2495,994,2514,1033,2534,1034,2585,1044,2593,1038,2597,1050,2578,1072,2570,1094,2570,1106,2554,1118,2555,1130,2537,1142,2528,1170,2532,1220,2546,1240,2542,1250,2546,1269,2546,1296,2498,1296,2476,1310,2444,1312,2438,1299,2421,1294,2410,1283,2388,1280,2378,1269,2379,1245,2369,1213,2376,1190,2372,1164,2374,1142,2360,1130,2340,1124,2334,1116,2318,1118,2311,1108],
    skordofan: [2979,1274,2963,1246,2952,1236,2942,1216,2927,1198,2922,1175,2938,1170,2950,1138,2947,1125,2934,1114,2939,1094,2984,1056,2998,1029,3054,996,3082,972,3128,976,3154,1001,3196,1050,3216,1046,3223,1051,3220,1072,3246,1098,3238,1125,3239,1168,3213,1194,3191,1216,3182,1216,3168,1260,3144,1266,3098,1260,3102,1238,3071,1227,3056,1226,3045,1245,3033,1254,3003,1248,3001,1271],
    wdarfur: [2322,1343,2318,1370,2310,1375,2324,1401,2310,1422,2314,1436,2301,1455,2282,1456,2288,1490,2278,1498,2266,1484,2272,1470,2241,1460,2238,1452,2254,1411,2224,1396,2207,1378,2223,1354,2230,1336,2214,1317,2193,1305,2185,1284,2195,1262,2215,1267,2220,1276,2246,1264,2236,1244,2249,1218,2259,1206,2272,1226,2270,1248,2261,1266,2268,1279,2290,1294,2295,1310,2308,1326,2318,1330],
    whitenile: [3254,1520,3235,1519,3204,1505,3196,1496,3188,1476,3161,1462,3153,1430,3160,1401,3178,1387,3188,1362,3203,1348,3198,1338,3202,1322,3174,1301,3168,1286,3168,1260,3182,1216,3191,1216,3213,1194,3274,1194,3274,1224,3326,1222,3307,1265,3318,1293,3306,1304,3291,1328,3296,1340,3294,1370,3283,1356,3274,1361,3266,1391,3258,1392,3245,1420,3249,1428,3235,1465,3254,1478]
  };

  /* ---------- الولايات ومعالمها ---------- */
  const STATES = [
    { k: 'khartoum', ar: 'الخرطوم', en: 'Khartoum', col: '#FF7E93', lm: [
      { ic: 'tower', ar: 'برج الفاتح', en: 'Al-Fateh Tower', at: [32.62, 15.52] },
      { ic: 'confluence', ar: 'المقرن', en: 'Al-Mogran', sar: 'ملتقى النيلين', sen: 'where the two Niles meet', at: [32.5, 15.63] }] },
    { k: 'rivernile', ar: 'نهر النيل', en: 'River Nile', col: '#FFAE6E', lm: [
      { ic: 'pyramids', ar: 'أهرامات البجراوية', en: 'Meroe Pyramids', sar: 'مروي القديمة', sen: 'ancient Meroe', at: [33.75, 16.94], pl: 1 }] },
    { k: 'northern', ar: 'الشمالية', en: 'Northern', col: '#FFDD6E', lm: [
      { ic: 'barkal', ar: 'جبل البركل', en: 'Jebel Barkal', at: [31.83, 18.53] }] },
    { k: 'redsea', ar: 'البحر الأحمر', en: 'Red Sea', col: '#F8A3C8', lm: [
      { ic: 'port', ar: 'ميناء بورتسودان', en: 'Port Sudan', at: [37.0, 19.6] }] },
    { k: 'gezira', ar: 'الجزيرة', en: 'Gezira', col: '#86E2C2', lm: [
      { ic: 'cotton', ar: 'مشروع الجزيرة', en: 'Gezira Scheme', sar: 'القطن', sen: 'cotton', at: [33.2, 14.5] }] },
    { k: 'kassala', ar: 'كسلا', en: 'Kassala', col: '#BDE68A', lm: [
      { ic: 'taka', ar: 'جبال التاكا', en: 'Taka Mountains', at: [36.25, 15.45], pl: 1 }] },
    { k: 'gedaref', ar: 'القضارف', en: 'Gedaref', col: '#C7B5FF', lm: [
      { ic: 'sorghum', ar: 'مزارع الذرة', en: 'Sorghum Farms', at: [35.3, 13.9], pl: 1 }] },
    { k: 'sennar', ar: 'سنار', en: 'Sennar', col: '#FFC596', lm: [
      { ic: 'dam', ar: 'خزان سنار', en: 'Sennar Dam', at: [33.62, 13.55] }] },
    { k: 'bluenile', ar: 'النيل الأزرق', en: 'Blue Nile', col: '#8CC4FF', lm: [
      { ic: 'dam', ar: 'خزان الروصيرص', en: 'Roseires Dam', at: [34.39, 11.8] }] },
    { k: 'whitenile', ar: 'النيل الأبيض', en: 'White Nile', col: '#E6C6FF', lm: [
      { ic: 'sugar', ar: 'سكر كنانة', en: 'Kenana Sugar', sar: 'قصب السكر', sen: 'sugar cane', at: [32.9, 12.95] }] },
    { k: 'nkordofan', ar: 'شمال كردفان', en: 'North Kordofan', col: '#F6D48C', lm: [
      { ic: 'gum', ar: 'الصمغ العربي', en: 'Gum Arabic', sar: 'الأبيض', sen: 'El Obeid', at: [30.22, 13.18] }] },
    { k: 'skordofan', ar: 'جنوب كردفان', en: 'South Kordofan', col: '#9FDF9C', lm: [
      { ic: 'nuba', ar: 'جبال النوبة', en: 'Nuba Mountains', at: [30.5, 11.35], pl: 1 }] },
    { k: 'wkordofan', ar: 'غرب كردفان', en: 'West Kordofan', col: '#FFB0AE', lm: [
      { ic: 'oil', ar: 'حقول النفط', en: 'Oil Fields', at: [28.6, 11.0], pl: 1 }] },
    { k: 'ndarfur', ar: 'شمال دارفور', en: 'North Darfur', col: '#8FCBF0', lp: [25.4, 17.2], lm: [
      { ic: 'palace', ar: 'قصر السلطان علي دينار', en: 'Sultan Ali Dinar Palace', sar: 'الفاشر', sen: 'El Fasher', at: [25.35, 13.75] }] },
    { k: 'sdarfur', ar: 'جنوب دارفور', en: 'South Darfur', col: '#FFB3D0', lm: [
      { ic: 'radom', ar: 'محمية الردوم', en: 'Radom National Park', at: [24.0, 10.0] }] },
    { k: 'wdarfur', ar: 'غرب دارفور', en: 'West Darfur', col: '#F4DF86', lm: [
      { ic: 'city', ar: 'مدينة الجنينة', en: 'Geneina City', at: [22.45, 13.45] }] },
    { k: 'cdarfur', ar: 'وسط دارفور', en: 'Central Darfur', col: '#B7ABFF', lm: [
      { ic: 'marra', ar: 'جبل مرة', en: 'Jebel Marra', at: [24.25, 12.95] }] },
    { k: 'edarfur', ar: 'شرق دارفور', en: 'East Darfur', col: '#A3E2D6', lm: [
      { ic: 'cattle', ar: 'قطعان الأبقار', en: 'Cattle Herds', at: [26.4, 11.5], pl: 1 }] }
  ];
  const BYK = {}; STATES.forEach((s, i) => { s.i = i; BYK[s.k] = s; });
  const LANDMARKS = []; STATES.forEach(s => s.lm.forEach(l => { l.st = s; LANDMARKS.push(l); }));
  const EASY_PRE = ['northern', 'ndarfur', 'redsea', 'nkordofan', 'sdarfur', 'skordofan'];
  const MODES = {
    easy: { ic: '🧩', t: 'سهل', d: 'الأسماء ظاهرة وبعض الولايات في مكانها' },
    normal: { ic: '🗺️', t: 'كل الولايات', d: '١٨ ولاية من البداية' },
    quiz: { ic: '❓', t: 'أين الولاية؟', d: 'المس الولاية الصحيحة' },
    lmq: { ic: '🏛️', t: 'أين المَعلم؟', d: 'المس ولاية كل مَعلم' }
  };
  const QN = 10;

  /* ---------- الإسقاط ---------- */
  const CX = Math.cos(15 * Math.PI / 180);
  const BB = { lon0: 21.8, lon1: 38.62, lat0: 8.65, lat1: 23.16 };
  const RINGS = {};
  for (const s of STATES) {
    const a = GEO[s.k], r = [];
    for (let i = 0; i < a.length; i += 2) r.push([a[i] / 100, a[i + 1] / 100]);
    RINGS[s.k] = r;
  }
  /* الأنهار (خط طول، خط عرض) — باتجاه الجريان */
  const RIVERS = [
    { c: '#9AD9F7', d: '#5FA9D6', w: .8, pts: [[32.9, 9.4], [32.85, 10.0], [32.78, 11.2], [32.72, 12.3], [32.66, 13.17], [32.45, 13.7], [32.31, 14.0], [32.38, 14.6], [32.47, 15.24], [32.52, 15.6]] },
    { c: '#3C8FEA', d: '#1F5FB8', w: .85, pts: [[35.4, 11.15], [34.95, 11.3], [34.7, 11.55], [34.38, 11.82], [34.05, 12.4], [33.93, 13.15], [33.62, 13.55], [33.52, 14.4], [33.37, 14.77], [33.0, 15.25], [32.53, 15.61]] },
    { c: '#5AAEF2', d: '#2A6FC4', w: 1, pts: [[32.52, 15.6], [32.65, 16.05], [33.0, 16.35], [33.43, 16.69], [33.95, 17.45], [33.98, 17.7], [33.98, 18.02], [33.7, 18.75], [33.32, 19.53], [32.9, 19.25], [32.4, 18.9], [32.05, 18.67], [31.82, 18.5], [31.55, 18.2], [30.95, 18.05], [30.6, 18.5], [30.48, 19.17], [30.4, 19.63], [30.45, 20.2], [30.35, 20.8], [30.8, 21.3], [31.35, 21.8], [31.65, 22.4], [32.2, 23.2], [32.6, 24.2]] },
    { c: '#7CC4F2', d: '#4A8FC8', w: .55, pts: [[36.7, 13.4], [36.5, 13.8], [36.25, 14.2], [35.9, 14.95], [35.2, 15.9], [34.6, 16.8], [33.98, 17.7]] }
  ];
  const NEIGH = [
    { ar: 'مصر', en: 'Egypt', at: [29.6, 22.75] }, { ar: 'ليبيا', en: 'Libya', at: [22.9, 21.6] },
    { ar: 'تشاد', en: 'Chad', at: [22.35, 17.6] }, { ar: 'جنوب السودان', en: 'South Sudan', at: [30.6, 9.15] },
    { ar: 'إثيوبيا', en: 'Ethiopia', at: [36.6, 11.6] }, { ar: 'إريتريا', en: 'Eritrea', at: [38.2, 16.2] },
    { ar: 'إفريقيا الوسطى', en: 'C. Africa', at: [22.3, 9.4] }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function shade(hex, f) { // f<0 أغمق، f>0 أفتح
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    if (f < 0) { r *= 1 + f; g *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }
  function inPoly(x, y, r) {
    let c = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function segD(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = clamp(t, 0, 1);
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  /* أبعد نقطة داخلية عن الحواف (لكتابة الاسم) — بإحداثيات مسقطة */
  function pole(r) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const dist = (x, y) => { let m = 1e9; for (let i = 0, j = r.length - 1; i < r.length; j = i++) m = Math.min(m, segD(x, y, r[j][0], r[j][1], r[i][0], r[i][1])); return m; };
    let best = null, bd = -1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sw = x1 - x0, sh = y1 - y0;
    for (let it = 0; it < 4; it++) {
      const N = 18;
      for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
        const x = cx - sw / 2 + sw * i / N, y = cy - sh / 2 + sh * j / N;
        if (!inPoly(x, y, r)) continue;
        // نفضّل المركز قليلًا حتى لا يلتصق الاسم بطرف بعيد
        const d = dist(x, y) - Math.hypot(x - (x0 + x1) / 2, y - (y0 + y1) / 2) * .08;
        if (d > bd) { bd = d; best = [x, y]; }
      }
      if (!best) break;
      cx = best[0]; cy = best[1]; sw /= 3.2; sh /= 3.2;
    }
    return best || [(x0 + x1) / 2, (y0 + y1) / 2];
  }
  /* بيانات مسقطة ثابتة (وحدة = درجة عرض) */
  const PJ = {};
  const proj0 = (lon, lat) => [(lon - BB.lon0) * CX, BB.lat1 - lat];
  for (const s of STATES) {
    const r = RINGS[s.k].map(([a, b]) => proj0(a, b));
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, A = 0;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) { A += r[j][0] * r[i][1] - r[i][0] * r[j][1]; }
    for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const pl = s.lp ? proj0(s.lp[0], s.lp[1]) : pole(r);
    PJ[s.k] = { r, x0, x1, y0, y1, area: Math.abs(A / 2), pole: pl };
    s.lm.forEach(l => { const p = proj0(l.at[0], l.at[1]); l.p = inPoly(p[0], p[1], r) ? p : pl.slice(); });
  }
  // مَعلما الخرطوم: نفصلهما قليلًا حتى لا يتراكبا
  const W0 = (BB.lon1 - BB.lon0) * CX, H0 = BB.lat1 - BB.lat0;

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, k = 20, mx0 = 0, my0 = 0, D = 6, portrait = true;
  let board = null, tray = null, inner = null, bgLayer = null, labLayer = null, labDirty = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let mode = 'easy', lang = 'ar', pieces = [], P = {}, queue = [], slots = [], cells = [];
  let mistakes = 0, over = false, winTimer = 0, qTimer = 0;
  let drag = null, parts = [], rings = [], shake = 0, popup = null, tip = null;
  let quiz = null, statesUnion = null;

  const nm = s => lang === 'en' ? s.en : s.ar;
  const lmn = l => lang === 'en' ? l.en : l.ar;
  const lms = l => (lang === 'en' ? l.sen : l.sar) || '';
  const say = t => App.speak(t, lang === 'en' ? 'en' : 'ar');
  const dig = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const sp = (x, y) => [mx0 + x * k, my0 + y * k];
  const loadProg = () => { const p = store.get('sudanmapProg', null) || {}; return { stars: p.stars || {}, best: p.best || {}, en: p.en || 0 }; };
  const saveProg = p => store.set('sudanmapProg', p);

  /* ---------- رسم المعالم (أيقونات مرسومة داخل مربع 100×100 مركزه 0،0) ---------- */
  function lg(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function rg(c, x, y, r, stops) { const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function ground(c, col1, col2, y = 30) { c.fillStyle = lg(c, 0, y - 8, 0, y + 16, [col1, col2]); c.beginPath(); c.ellipse(0, y + 4, 44, 12, 0, 0, TAU); c.fill(); }
  function blob(c, x, y, r, a, b) { c.fillStyle = rg(c, x, y, r, [a, b]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  function tri(c, a, b, d) { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.closePath(); c.fill(); }
  function poly(c, pts) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); }
  function palm(c, x, y, h) {
    c.strokeStyle = '#9A6334'; c.lineWidth = 3.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 2, y - h * .5, x - 1, y - h); c.stroke();
    c.fillStyle = '#3FAE4A';
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .62; c.save(); c.translate(x - 1, y - h); c.rotate(a); c.beginPath(); c.ellipse(9, 0, 10, 3.4, 0, 0, TAU); c.fill(); c.restore(); }
  }
  const ICONS = {
    tower(c) {
      ground(c, '#8EDB7A', '#4FAF4A');
      c.fillStyle = '#BFC9D6'; c.beginPath(); c.roundRect(-26, 24, 52, 9, 3); c.fill();
      c.save(); c.beginPath(); c.moveTo(-22, 26); c.bezierCurveTo(-28, -6, -12, -40, 4, -46); c.bezierCurveTo(12, -40, 26, -8, 22, 26); c.closePath();
      c.fillStyle = lg(c, -24, 0, 24, 0, ['#BFEBFF', '#58B6F0', '#2F7FCB']); c.fill(); c.clip();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.6;
      for (let y = -40; y < 26; y += 6) { c.beginPath(); c.moveTo(-30, y); c.lineTo(30, y); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-10, -6, 4, 26, .15, 0, TAU); c.fill();
      c.restore();
      c.strokeStyle = '#2A6CB0'; c.lineWidth = 2; c.beginPath(); c.moveTo(-22, 26); c.bezierCurveTo(-28, -6, -12, -40, 4, -46); c.bezierCurveTo(12, -40, 26, -8, 22, 26); c.stroke();
    },
    confluence(c) {
      ground(c, '#F2D9A2', '#D9B676', 22); c.fillStyle = lg(c, 0, -40, 0, 40, ['#B9E58C', '#7CC75F']); c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill();
      c.lineCap = 'round'; c.lineJoin = 'round';
      const st = (col, w, pts) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
      st('#DDF4FF', 16, [[-34, 34], [-14, 10], [0, -4]]); st('#9CD9F5', 11, [[-34, 34], [-14, 10], [0, -4]]);
      st('#1F67C6', 16, [[34, 34], [14, 10], [0, -4]]); st('#3C8FEA', 11, [[34, 34], [14, 10], [0, -4]]);
      st('#2A78D0', 18, [[0, -4], [0, -40]]); st('#63B3F4', 12, [[0, -4], [0, -40]]);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -4, 5, 0, TAU); c.fill();
    },
    pyramids(c) {
      ground(c, '#F6DCA0', '#DDB46A');
      const pyr = (x, b, h) => { c.fillStyle = '#F4C77F'; tri(c, [x - b, 30], [x, 30 - h], [x, 30]); c.fillStyle = '#C98A45'; tri(c, [x, 30 - h], [x + b, 30], [x, 30]); c.fillStyle = 'rgba(255,255,255,.35)'; tri(c, [x - b * .3, 30 - h * .7], [x, 30 - h], [x - b * .05, 30 - h * .55]); };
      pyr(-22, 12, 46); pyr(22, 12, 50); pyr(0, 15, 64);
      c.fillStyle = '#A86A33'; c.fillRect(-4, 20, 8, 10);
      blob(c, 30, -32, 9, '#FFF3A0', '#FFC531');
    },
    barkal(c) {
      ground(c, '#F6DCA0', '#DDB46A');
      c.fillStyle = lg(c, 0, -30, 0, 30, ['#E59A62', '#B25F30']);
      poly(c, [[-42, 30], [-34, -4], [-24, -14], [16, -16], [22, -8], [26, -30], [33, -30], [36, -6], [42, 30]]);
      c.fillStyle = 'rgba(255,230,190,.5)'; poly(c, [[-34, -4], [-24, -14], [16, -16], [14, -10], [-22, -8]]);
      c.fillStyle = 'rgba(120,50,20,.25)'; poly(c, [[26, -30], [33, -30], [36, -6], [42, 30], [30, 30]]);
      palm(c, -30, 32, 30);
    },
    port(c) {
      c.fillStyle = lg(c, 0, 4, 0, 44, ['#6CC7F2', '#2D86CC']); c.beginPath(); c.ellipse(0, 26, 46, 16, 0, 0, TAU); c.fill();
      c.strokeStyle = '#F3B21E'; c.lineWidth = 4; c.lineCap = 'round';
      c.beginPath(); c.moveTo(30, 18); c.lineTo(30, -40); c.lineTo(4, -40); c.stroke(); c.lineWidth = 1.6; c.beginPath(); c.moveTo(8, -40); c.lineTo(8, -22); c.stroke();
      const cols = ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF'];
      for (let i = 0; i < 5; i++) { c.fillStyle = cols[i]; c.beginPath(); c.roundRect(-30 + i * 11, -2 - (i % 2) * 9, 10, 9, 1.5); c.fill(); if (i % 2) { c.fillStyle = cols[(i + 2) % 5]; c.beginPath(); c.roundRect(-30 + i * 11, -2, 10, 9, 1.5); c.fill(); } }
      c.fillStyle = '#E8473F'; poly(c, [[-38, 7], [26, 7], [20, 24], [-32, 24]]);
      c.fillStyle = '#1F3F7A'; poly(c, [[-35, 17], [23, 17], [20, 24], [-32, 24]]);
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(10, -10, 12, 17, 2); c.fill(); c.fillStyle = '#7FC6F2'; c.fillRect(13, -7, 6, 4);
      c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-40, 32); c.quadraticCurveTo(-30, 28, -20, 32); c.moveTo(16, 34); c.quadraticCurveTo(26, 30, 36, 34); c.stroke();
    },
    cotton(c) {
      ground(c, '#B9E58C', '#6FBF52');
      c.strokeStyle = '#7A5230'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 32); c.lineTo(0, -2); c.stroke();
      c.fillStyle = '#4FB548'; c.save(); c.translate(-6, 16); c.rotate(-.6); c.beginPath(); c.ellipse(-10, 0, 13, 6, 0, 0, TAU); c.fill(); c.restore();
      c.save(); c.translate(6, 10); c.rotate(.5); c.beginPath(); c.ellipse(10, 0, 13, 6, 0, 0, TAU); c.fill(); c.restore();
      c.fillStyle = '#8A5A2E'; poly(c, [[-18, -2], [0, 8], [18, -2], [10, 6], [0, 12], [-10, 6]]);
      for (const [x, y, r] of [[-14, -16, 13], [14, -16, 13], [0, -30, 14], [0, -12, 14]]) blob(c, x, y, r, '#FFFFFF', '#DCE3EA');
    },
    taka(c) {
      ground(c, '#B9E58C', '#6FBF52');
      const dome = (x, w, h, a, b) => { c.fillStyle = lg(c, x - w, 30 - h, x + w, 30, [a, b]); c.beginPath(); c.moveTo(x - w, 32); c.bezierCurveTo(x - w, 30 - h * 1.25, x + w, 30 - h * 1.25, x + w, 32); c.fill(); };
      dome(-20, 22, 46, '#E3C3BA', '#9C7469'); dome(18, 26, 62, '#EBCFC5', '#A27A6E'); dome(-2, 14, 26, '#D9B5AA', '#8C665C');
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(10, -14, 5, 14, -.3, 0, TAU); c.fill();
    },
    sorghum(c) {
      ground(c, '#E8D48A', '#C7A955');
      for (const [x, h, s] of [[-18, 52, -1], [2, 62, 1], [20, 48, 1]]) {
        c.strokeStyle = '#5BAF45'; c.lineWidth = 3.4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, 32); c.quadraticCurveTo(x + s * 3, 32 - h * .5, x, 32 - h); c.stroke();
        c.fillStyle = '#6CC452'; c.save(); c.translate(x, 32 - h * .45); c.rotate(s * .7); c.beginPath(); c.ellipse(s * 9, 0, 11, 3.5, 0, 0, TAU); c.fill(); c.restore();
        for (let i = 0; i < 9; i++) blob(c, x + (i % 3 - 1) * 4.5, 32 - h - 6 - Math.floor(i / 3) * 5, 3.6, '#F5A35C', '#B9561C');
      }
    },
    dam(c) {
      c.fillStyle = lg(c, 0, -30, 0, 10, ['#7FD0FA', '#2E8BD6']); c.beginPath(); c.roundRect(-44, -28, 88, 30, 10); c.fill();
      c.fillStyle = lg(c, 0, -6, 0, 30, ['#E7ECF1', '#9AA8B6']); poly(c, [[-46, -6], [46, -6], [40, 30], [-40, 30]]);
      c.fillStyle = '#5E6E80'; for (let i = -3; i <= 3; i++) { c.beginPath(); c.roundRect(i * 11 - 3.5, 2, 7, 12, 2); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = -3; i <= 3; i += 2) { c.beginPath(); c.moveTo(i * 11 - 3, 14); c.lineTo(i * 11 + 3, 14); c.lineTo(i * 11 + 5, 30); c.lineTo(i * 11 - 5, 30); c.fill(); }
      c.fillStyle = lg(c, 0, 26, 0, 40, ['#8ED8FA', '#3A95DE']); c.beginPath(); c.ellipse(0, 34, 44, 8, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(-44, -8, 88, 3);
    },
    sugar(c) {
      ground(c, '#B9E58C', '#6FBF52');
      for (const [x, h] of [[-16, 58], [0, 70], [16, 54]]) {
        c.fillStyle = lg(c, x - 4, 0, x + 4, 0, ['#C9E77A', '#7FB33A']); c.beginPath(); c.roundRect(x - 4, 32 - h, 8, h, 3); c.fill();
        c.fillStyle = '#6E9C2E'; for (let y = 32 - h + 12; y < 30; y += 12) c.fillRect(x - 4.5, y, 9, 2.4);
        c.fillStyle = '#4DB04A'; c.save(); c.translate(x, 32 - h); c.rotate(-.5); c.beginPath(); c.ellipse(-8, 0, 12, 3.2, 0, 0, TAU); c.fill(); c.rotate(1); c.beginPath(); c.ellipse(8, 0, 12, 3.2, 0, 0, TAU); c.fill(); c.restore();
      }
      c.fillStyle = '#fff'; c.strokeStyle = '#C9D3DC'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(22, 14, 18, 18, 3); c.fill(); c.stroke();
      c.fillStyle = '#E8EEF4'; c.fillRect(24, 26, 14, 4);
    },
    gum(c) {
      ground(c, '#F2D9A2', '#D9B676');
      c.strokeStyle = '#8A5A2E'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 32); c.lineTo(0, -6); c.moveTo(0, 4); c.lineTo(-14, -14); c.moveTo(0, 0); c.lineTo(14, -16); c.stroke();
      c.fillStyle = lg(c, 0, -40, 0, -10, ['#8FD66A', '#3E9B3A']); c.beginPath(); c.ellipse(0, -22, 42, 12, 0, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(-4, -30, 30, 9, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-12, -33, 14, 3, 0, 0, TAU); c.fill();
      for (const [x, y, r] of [[3, 12, 5.5], [-3, 22, 4.5], [5, 26, 3.5]]) { blob(c, x, y, r, '#FFD27A', '#D0761A'); }
    },
    nuba(c) {
      ground(c, '#B9E58C', '#6FBF52');
      const m = (x, w, h, a, b) => { c.fillStyle = lg(c, 0, 30 - h, 0, 30, [a, b]); poly(c, [[x - w, 32], [x - w * .25, 30 - h], [x + w * .2, 32 - h * 1.05], [x + w, 32]]); };
      m(-14, 28, 52, '#7CCB62', '#3E8F3C'); m(18, 26, 40, '#9AD873', '#4FA448');
      c.fillStyle = '#C98A45'; c.fillRect(-36, 18, 14, 13); c.fillStyle = '#E7B26A'; tri(c, [-40, 19], [-29, 4], [-18, 19]);
      c.fillStyle = '#5A3A1E'; c.fillRect(-31, 23, 4, 8);
    },
    oil(c) {
      ground(c, '#F2D9A2', '#D9B676');
      c.fillStyle = '#4A5568'; c.fillRect(-34, 24, 60, 7);
      c.strokeStyle = '#384152'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, 26); c.lineTo(2, -14); c.lineTo(12, 26); c.stroke();
      c.save(); c.translate(2, -14); c.rotate(-.18);
      c.fillStyle = '#F28C28'; c.beginPath(); c.roundRect(-34, -5, 56, 10, 4); c.fill();
      c.fillStyle = '#E2601E'; poly(c, [[-34, -9], [-26, -9], [-26, 14], [-34, 8]]);
      c.restore();
      c.strokeStyle = '#384152'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-30, 0); c.lineTo(-30, 24); c.stroke();
      blob(c, 22, 10, 9, '#6B7489', '#2D3442');
      c.fillStyle = '#222'; c.beginPath(); c.moveTo(34, 18); c.quadraticCurveTo(40, 26, 34, 30); c.quadraticCurveTo(28, 26, 34, 18); c.fill();
    },
    palace(c) {
      ground(c, '#F2D9A2', '#D9B676');
      c.fillStyle = lg(c, 0, -10, 0, 30, ['#FFFFFF', '#E3DCCF']); c.beginPath(); c.roundRect(-38, 0, 76, 32, 3); c.fill();
      c.beginPath(); c.roundRect(-16, -12, 32, 20, 2); c.fill();
      c.fillStyle = lg(c, -16, 0, 16, 0, ['#FFE48A', '#D9A21E']); c.beginPath(); c.arc(0, -12, 15, Math.PI, 0); c.fill();
      c.fillStyle = '#D9A21E'; c.fillRect(-1.5, -36, 3, 10); c.beginPath(); c.arc(0, -37, 3, 0, TAU); c.fill();
      c.fillStyle = '#8A5A2E';
      for (const x of [-28, -16, 16, 28]) { c.beginPath(); c.moveTo(x - 4, 26); c.lineTo(x - 4, 14); c.arc(x, 14, 4, Math.PI, 0); c.lineTo(x + 4, 26); c.fill(); }
      c.beginPath(); c.moveTo(-6, 32); c.lineTo(-6, 16); c.arc(0, 16, 6, Math.PI, 0); c.lineTo(6, 32); c.fill();
      c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(-38, 28, 76, 4);
    },
    marra(c) {
      ground(c, '#B9E58C', '#6FBF52');
      c.fillStyle = lg(c, 0, -30, 0, 32, ['#9C7A5C', '#5E7E3E', '#4F9A40']); poly(c, [[-46, 32], [-14, -26], [14, -26], [46, 32]]);
      c.fillStyle = 'rgba(255,255,255,.18)'; poly(c, [[-14, -26], [-4, -26], [-26, 32], [-46, 32]]);
      c.fillStyle = lg(c, 0, -30, 0, -20, ['#7FD3FA', '#2F8BD6']); c.beginPath(); c.ellipse(0, -26, 12, 4, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; for (const [x, y, r] of [[-30, -34, 8], [-22, -38, 9], [-14, -33, 7], [26, -20, 6], [33, -24, 8], [40, -20, 6]]) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
    },
    radom(c) {
      ground(c, '#C5E88C', '#77BF52');
      blob(c, 30, -32, 9, '#FFF3A0', '#FFC531');
      const tree = (x, h, r) => { c.fillStyle = '#7A5230'; c.fillRect(x - 2.5, 30 - h, 5, h); blob(c, x, 30 - h - r * .6, r, '#8EDB6A', '#2F8A35'); };
      tree(-20, 22, 16); tree(14, 30, 20);
      c.fillStyle = '#E2A04A'; c.save(); c.translate(-2, 22);
      c.beginPath(); c.ellipse(0, 0, 8, 4, 0, 0, TAU); c.fill(); c.fillRect(-6, 0, 2, 8); c.fillRect(4, 0, 2, 8);
      c.beginPath(); c.moveTo(6, -2); c.lineTo(11, -10); c.lineTo(13, -9); c.lineTo(9, -1); c.fill();
      c.strokeStyle = '#6B4420'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(11, -10); c.lineTo(9, -15); c.moveTo(12, -10); c.lineTo(13, -15); c.stroke(); c.restore();
    },
    city(c) {
      ground(c, '#C5E88C', '#77BF52');
      const house = (x, w, h, col, roof) => { c.fillStyle = col; c.fillRect(x - w / 2, 30 - h, w, h); c.fillStyle = roof; tri(c, [x - w / 2 - 3, 31 - h], [x, 18 - h], [x + w / 2 + 3, 31 - h]); c.fillStyle = '#7A5230'; c.fillRect(x - 3, 22, 6, 8); };
      house(-18, 22, 18, '#FFE3B0', '#E8734A'); house(10, 18, 24, '#FFF1D6', '#D9583C');
      c.fillStyle = '#7A5230'; c.fillRect(28, 6, 4, 24); blob(c, 30, -2, 14, '#8EDB6A', '#2F8A35');
      for (const [x, y] of [[24, 2], [34, -6], [36, 6]]) blob(c, x, y, 3.6, '#FFD84A', '#F08A1E');
    },
    cattle(c) {
      ground(c, '#C5E88C', '#77BF52');
      c.strokeStyle = '#E9E2D2'; c.lineWidth = 6; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-14, -18); c.quadraticCurveTo(-32, -26, -30, -44); c.moveTo(14, -18); c.quadraticCurveTo(32, -26, 30, -44); c.stroke();
      c.fillStyle = '#B9733A'; c.beginPath(); c.ellipse(-22, -8, 9, 5, -.5, 0, TAU); c.fill(); c.beginPath(); c.ellipse(22, -8, 9, 5, .5, 0, TAU); c.fill();
      c.fillStyle = rg(c, 0, -2, 24, ['#E79A5A', '#A85C2A']); c.beginPath(); c.ellipse(0, -2, 17, 22, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, -12, 6, 9, 0, 0, TAU); c.fill();
      c.fillStyle = '#F6C3B5'; c.beginPath(); c.ellipse(0, 14, 13, 9, 0, 0, TAU); c.fill();
      c.fillStyle = '#6B3A2A'; c.beginPath(); c.arc(-5, 14, 2.4, 0, TAU); c.arc(5, 14, 2.4, 0, TAU); c.fill();
      c.fillStyle = '#222'; c.beginPath(); c.arc(-8, -4, 3, 0, TAU); c.arc(8, -4, 3, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(-7, -5, 1, 0, TAU); c.arc(9, -5, 1, 0, TAU); c.fill();
    }
  };
  function drawIcon(c, ic, s) { c.save(); c.scale(s / 100, s / 100); c.lineJoin = 'round'; (ICONS[ic] || ICONS.tower)(c); c.restore(); }
  /* شارة: دائرة بيضاء سميكة بإطار ملوّن وعليها المَعلم */
  function drawBadge(c, l, R) {
    const col = l.st.col;
    c.save();
    c.fillStyle = 'rgba(40,40,80,.28)'; c.beginPath(); c.ellipse(0, R * .95, R * .85, R * .25, 0, 0, TAU); c.fill();
    c.fillStyle = shade(col, -.35); c.beginPath(); c.arc(0, R * .12, R, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, R * .84, 0, TAU); c.fill();
    c.fillStyle = rg(c, 0, 0, R * .74, ['#FFFFFF', '#EEF6FF']); c.beginPath(); c.arc(0, 0, R * .74, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(0, 0, R * .74, 0, TAU); c.clip();
    drawIcon(c, l.ic, R * 1.42); c.restore();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-R * .32, -R * .5, R * .32, R * .14, -.5, 0, TAU); c.fill();
    c.restore();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #sudanmap{background:#CDEFFF;overflow:hidden}
  #sudanmap canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #sudanmap .ib{color:#1C6F96}
  #sudanmap .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 #7CC3E0,0 8px 14px rgba(30,100,150,.2)}
  #sudanmap .lang button{padding:5px 14px;border-radius:99px;font-weight:900;font-size:17px;background:transparent;color:#2A7EA6;line-height:1.25;min-height:36px}
  #sudanmap .lang button.on{background:linear-gradient(#5FD0F0,#2A9BD0);color:#fff;box-shadow:0 3px 0 #1A6F9C;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #sudanmap .qcard{position:absolute;display:none;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#fff;border-radius:28px;border:5px solid #FFD25E;
    box-shadow:0 7px 0 #E9A92A,0 14px 26px rgba(40,90,130,.22);padding:10px 14px;text-align:center;z-index:3}
  #sudanmap .qcard.on{display:flex}
  #sudanmap .qcard .qk{font-size:13px;font-weight:800;color:#C08A1E;letter-spacing:.3px}
  #sudanmap .qcard .qt{font-size:clamp(22px,6.4vw,34px);font-weight:900;color:#1F4E79;line-height:1.2}
  #sudanmap .qcard .qt.en{direction:ltr;font-size:clamp(20px,5.6vw,30px)}
  #sudanmap .qcard canvas{width:84px;height:84px;display:none}
  #sudanmap .qcard.lm canvas{display:block}
  #sudanmap .qcard .say{position:absolute;bottom:-14px;left:-10px;width:58px;height:58px;flex-basis:58px;font-size:26px}
  #sudanmap .qcard .qs{font-size:14px;font-weight:800;color:#2A7EA6;opacity:.8}
  #sudanmap .overlay{background:rgba(20,70,110,.35)}
  #sudanmap .panel{border-color:#D6F1FF;box-shadow:0 8px 0 #8ACDE8,0 20px 40px rgba(10,50,90,.3);color:#1F4E79}
  #sudanmap .panel h3{color:#1C7FB0;text-shadow:0 3px 0 #D6F1FF}
  #sudanmap .btn{background:linear-gradient(#5FD0F0,#2A9BD0);box-shadow:0 5px 0 #1A6F9C}
  #sudanmap .btn:active{box-shadow:0 1px 0 #1A6F9C}
  #sudanmap .btn.alt{background:#fff;color:#1C7FB0;box-shadow:0 5px 0 #A9DCF0;border-color:#D6F1FF}
  #sudanmap .mp{width:min(94vw,440px);max-height:92vh;overflow-y:auto;touch-action:pan-y}
  #sudanmap .mp .lang{display:inline-flex;margin:4px auto 10px;box-shadow:0 3px 0 #A9DCF0}
  #sudanmap .mg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0 12px}
  #sudanmap .mb{position:relative;border-radius:24px;background:#fff;border:4px solid var(--c);box-shadow:0 6px 0 var(--cd),0 10px 16px rgba(20,70,110,.15);
    padding:10px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#1F4E79;transition:transform .14s var(--press)}
  #sudanmap .mb:active{transform:translateY(4px) scale(1.03,.95);box-shadow:0 2px 0 var(--cd)}
  #sudanmap .mb .e{font-size:38px;line-height:1.1;filter:drop-shadow(0 3px 0 rgba(0,0,0,.12))}
  #sudanmap .mb .t{font-size:18px;font-weight:900;line-height:1.2}
  #sudanmap .mb .d{font-size:12px;font-weight:700;opacity:.7;line-height:1.25;min-height:30px}
  #sudanmap .mb .s{font-size:16px;letter-spacing:1px}
  #sudanmap .mb .s i{font-style:normal}
  #sudanmap .mb .s i.off{filter:grayscale(1);opacity:.28}
  #sudanmap .hint{top:auto}
  #sudanmap .hint span{background:rgba(255,255,255,.95);color:#1F4E79}
  #sudanmap .wl{font-weight:800;margin:2px 0 10px;color:#2A7EA6}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib modebtn" aria-label="الأنماط">🗺️</button>
      <span class="grow"></span>
      <div class="lang top"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="qcard"><div class="qk"></div><canvas width="168" height="168"></canvas><div class="qt"></div><div class="qs"></div>
      <button class="ib yellow say" aria-label="أعد السؤال">🔊</button></div>
    <div class="overlay" id="smModes"><div class="panel mp"><h3>🗺️ خريطة السودان</h3>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
      <div class="mg"></div><button class="btn alt mclose" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="smWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p><div class="wl"></div>
      <button class="btn" data-a="again">🔄 مرة أخرى</button><br>
      <button class="btn alt" data-a="modes">🗺️ الأنماط</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const qcard = root.querySelector('.qcard'), qk = qcard.querySelector('.qk'), qt = qcard.querySelector('.qt'), qs = qcard.querySelector('.qs'), qic = qcard.querySelector('canvas');
  const mOv = root.querySelector('#smModes'), winOv = root.querySelector('#smWin');

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 10, pad = 10, bottom = H - 12;
    portrait = W / H < 1.12;
    const quizMode = mode === 'quiz' || mode === 'lmq';
    const pillT = 18, pillB = 22; // مساحة شارة العنوان وشريط التقدّم
    if (portrait) {
      const aw = Math.min(W - pad * 2, 640), ax = (W - aw) / 2, ah = bottom - top;
      const minTray = quizMode ? 150 : 170;
      let kk = (aw - 16 - 14) / (W0 + .6);
      let bh = Math.round(H0 * kk + 16 + pillT + pillB + 18);
      if (bh > ah - minTray - 14) { bh = ah - minTray - 14; kk = (bh - 16 - pillT - pillB - 18) / (H0 + .5); }
      board = { x: ax, y: top + 8, w: aw, h: bh };
      tray = { x: ax, y: top + 8 + bh + 18, w: aw, h: ah - bh - 26 };
      k = kk;
    } else {
      const ah = bottom - top - 8, maxW = Math.min(W - pad * 2, 1240);
      const tw = clamp(maxW * .3, 230, 380);
      let kk = (ah - 16 - pillT - pillB - 18) / (H0 + .5);
      let bw = W0 * kk + 30;
      if (bw > maxW - tw - 18) { bw = maxW - tw - 18; kk = (bw - 30) / (W0 + .6); }
      const tot = bw + 18 + tw, x0 = (W - tot) / 2;
      board = { x: x0, y: top + 8, w: bw, h: ah };
      tray = { x: x0 + bw + 18, y: top + 8, w: tw, h: ah };
      k = kk;
    }
    inner = { x: board.x + 7, y: board.y + 7, w: board.w - 14, h: board.h - 14 };
    mx0 = inner.x + (inner.w - W0 * k) / 2;
    my0 = inner.y + pillT + (inner.h - pillT - pillB - H0 * k) / 2;
    D = clamp(k * .26, 3.5, 9);
    buildPaths(); bakeBG(); bakePieces(); layoutTray(); labDirty = true;
    // بطاقة السؤال
    if (quizMode) {
      const cw = Math.min(tray.w - 8, 440), ch = Math.min(tray.h - 16, portrait ? 220 : 300);
      Object.assign(qcard.style, { left: (tray.x + (tray.w - cw) / 2) + 'px', top: (tray.y + (portrait ? Math.max(4, (tray.h - ch) / 2 - 4) : (tray.h - ch) / 2)) + 'px', width: cw + 'px', height: ch + 'px' });
    }
  }
  function buildPaths() {
    statesUnion = new Path2D();
    for (const s of STATES) {
      const pj = PJ[s.k];
      const w = (pj.x1 - pj.x0) * k, h = (pj.y1 - pj.y0) * k, cxm = (pj.x0 + pj.x1) / 2, cym = (pj.y0 + pj.y1) / 2;
      const loc = new Path2D(), scr = new Path2D();
      pj.r.forEach(([x, y], i) => {
        const lx = (x - cxm) * k, ly = (y - cym) * k; i ? loc.lineTo(lx, ly) : loc.moveTo(lx, ly);
        const [sx, sy] = sp(x, y); i ? scr.lineTo(sx, sy) : scr.moveTo(sx, sy);
      });
      loc.closePath(); scr.closePath(); statesUnion.addPath(scr);
      const [hx, hy] = sp(cxm, cym), [px, py] = sp(pj.pole[0], pj.pole[1]);
      P[s.k] = Object.assign(P[s.k] || {}, { loc, scr, w, h, hx, hy, px, py, areaPx: pj.area * k * k });
    }
  }

  /* ---------- الخلفية واللوح ---------- */
  function roundRectPath(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function bakeBG() {
    bgLayer = mk(W * dpr, H * dpr);
    const c = bgLayer.getContext('2d'); c.scale(dpr, dpr);
    // سماء ناعمة
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9FDDFB'); g.addColorStop(.55, '#D3F1FF'); g.addColorStop(1, '#EAF9FF');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,255,255,.35)';
    for (let y = 18; y < H; y += 34) for (let x = (y / 34 % 2) * 17 + 10; x < W; x += 34) { c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill(); }
    for (const [x, y, s] of [[.12, .1, 1], [.82, .16, .8], [.5, .93, 1.2], [.92, .7, .9], [.06, .62, .7]]) cloud(c, W * x, H * y, 34 * s);
    // اللوح: بطاقة بيضاء سميكة بإطار ملوّن
    const b = board;
    c.save(); c.shadowColor = 'rgba(30,90,140,.28)'; c.shadowBlur = 22; c.shadowOffsetY = 12;
    c.fillStyle = '#4FB0D3'; roundRectPath(c, b.x, b.y + 7, b.w, b.h, 30); c.fill(); c.restore();
    c.fillStyle = '#fff'; roundRectPath(c, b.x, b.y, b.w, b.h, 30); c.fill();
    c.lineWidth = 4; c.strokeStyle = '#7FD1EC'; roundRectPath(c, b.x + 2, b.y + 2, b.w - 4, b.h - 4, 28); c.stroke();
    // داخل اللوح: اليابسة المجاورة + البحر الأحمر
    c.save(); roundRectPath(c, inner.x, inner.y, inner.w, inner.h, 22); c.clip();
    g = c.createLinearGradient(0, inner.y, 0, inner.y + inner.h); g.addColorStop(0, '#FBF0D9'); g.addColorStop(1, '#F3E1BC');
    c.fillStyle = g; c.fillRect(inner.x, inner.y, inner.w, inner.h);
    // رمل منقّط خفيف
    c.fillStyle = 'rgba(190,150,90,.12)';
    for (let i = 0; i < inner.w * inner.h / 260; i++) { const x = inner.x + ((i * 97.13) % inner.w), y = inner.y + ((i * 57.71 + (i * i) % 13) % inner.h); c.beginPath(); c.arc(x, y, 1.1, 0, TAU); c.fill(); }
    // حدود الدول المجاورة (خطوط منقطة خفيفة) — نرسم البحر
    const rs = RINGS.redsea, coast = []; for (let i = 30; i >= 8; i--) coast.push(rs[i]);
    const sea = [[34.3, 27.5], [34.9, 25.0], [35.45, 23.95], ...coast, [38.9, 17.4], [39.25, 16.3], [39.45, 15.6], [40.2, 14.9], [41.6, 13.5], [43.3, 12.6], [50, 12], [50, 27.5]];
    c.beginPath(); sea.forEach(([lo, la], i) => { const [x, y] = sp(...proj0(lo, la)); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
    g = c.createLinearGradient(sp(...proj0(36, 20))[0], 0, sp(...proj0(40, 20))[0], 0); g.addColorStop(0, '#7ED3F5'); g.addColorStop(1, '#3FA6E0');
    c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.6; c.lineCap = 'round';
    for (let la = 14; la < 25; la += .9) for (let lo = 35 + (la * 7 % 1.4); lo < 41; lo += 1.4) {
      const [x, y] = sp(...proj0(lo, la)); c.beginPath(); c.arc(x, y + 3, k * .22, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    }
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; c.stroke();
    // الدول المجاورة
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const nfs = clamp(k * .5, 9, 16);
    c.font = `800 ${nfs}px ${FONT}`; c.direction = lang === 'en' ? 'ltr' : 'rtl';
    for (const n of NEIGH) {
      const [x, y] = sp(...proj0(n.at[0], n.at[1])), t = lang === 'en' ? n.en : n.ar;
      const tw = c.measureText(t).width;
      if (x - tw / 2 < inner.x + 4 || x + tw / 2 > inner.x + inner.w - 4 || y < inner.y + 22 || y > inner.y + inner.h - 26) continue;
      c.fillStyle = 'rgba(150,110,60,.45)'; c.fillText(t, x, y);
    }
    { const t = lang === 'en' ? 'Red Sea' : 'البحر الأحمر', [x, y] = sp(...proj0(38.25, 21.4));
      c.save(); c.translate(x, y); c.rotate(-1.15); c.font = `italic 800 ${nfs}px ${FONT}`; c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText(t, 0, 0); c.restore(); }
    // ظل السودان كله (تجويف اللغز)
    c.save(); c.translate(0, 3); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 6; c.lineJoin = 'round'; c.stroke(statesUnion); c.restore();
    c.fillStyle = '#E2CFAC'; c.fill(statesUnion);
    c.save(); c.clip(statesUnion);
    const hole = new Path2D(); hole.rect(-W, -H, W * 3, H * 3); hole.addPath(statesUnion);
    c.shadowColor = 'rgba(90,55,20,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 5; c.fillStyle = '#000'; c.fill(hole, 'evenodd');
    c.restore();
    c.strokeStyle = 'rgba(120,80,35,.55)'; c.lineWidth = 1.6; c.lineJoin = 'round'; c.stroke(statesUnion);
    // خطوط الولايات المنقطة
    c.save(); c.setLineDash([5, 4]); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 1.5;
    for (const s of STATES) c.stroke(P[s.k].scr);
    c.restore();
    // أسماء الولايات داخل الفراغات (السهل)
    if (mode === 'easy') {
      for (const s of STATES) { const p = P[s.k]; nameText(c, nm(s), p.px, p.py, fsFor(s, c) * .95, 'rgba(120,80,35,.72)', null); }
    }
    c.restore();
    // شارة العنوان أعلى اللوح
    const title = `${MODES[mode].ic} خريطة السودان · ${MODES[mode].t}`;
    c.font = `900 ${clamp(k * .62, 14, 19)}px ${FONT}`; c.direction = 'rtl';
    const tw = c.measureText(title).width + 30, th = clamp(k * 1.25, 28, 36), tx = b.x + b.w / 2 - tw / 2, ty = b.y - th / 2 + 2;
    c.fillStyle = '#4FB0D3'; roundRectPath(c, tx, ty + 4, tw, th, th / 2); c.fill();
    c.fillStyle = '#fff'; roundRectPath(c, tx, ty, tw, th, th / 2); c.fill();
    c.strokeStyle = '#BDE8F7'; c.lineWidth = 2.5; roundRectPath(c, tx + 1.5, ty + 1.5, tw - 3, th - 3, th / 2); c.stroke();
    c.fillStyle = '#1C6F96'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(title, b.x + b.w / 2, ty + th / 2 + 1);
    // بوصلة صغيرة
    { const [x, y] = [inner.x + inner.w - 22, inner.y + 30], r = clamp(k * .55, 10, 16);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(x, y, r + 4, 0, TAU); c.fill();
      c.fillStyle = '#E8473F'; tri(c, [x, y - r], [x - r * .38, y], [x + r * .38, y]); c.fillStyle = '#9AA8B6'; tri(c, [x, y + r], [x - r * .38, y], [x + r * .38, y]);
      c.fillStyle = '#1C6F96'; c.font = `900 ${r * .8}px ${FONT}`; c.fillText(lang === 'en' ? 'N' : 'ش', x, y - r - 9 < inner.y + 4 ? y + r + 9 : y - r - 9); }
    // صينية القطع
    if (mode === 'easy' || mode === 'normal') {
      const t = tray;
      c.save(); c.shadowColor = 'rgba(30,90,140,.25)'; c.shadowBlur = 18; c.shadowOffsetY = 10;
      c.fillStyle = '#F2B13C'; roundRectPath(c, t.x, t.y + 7, t.w, t.h - 7, 28); c.fill(); c.restore();
      c.fillStyle = '#fff'; roundRectPath(c, t.x, t.y, t.w, t.h - 7, 28); c.fill();
      c.lineWidth = 4; c.strokeStyle = '#FFD780'; roundRectPath(c, t.x + 2, t.y + 2, t.w - 4, t.h - 11, 26); c.stroke();
      c.fillStyle = '#FFF7E6'; roundRectPath(c, t.x + 9, t.y + 9, t.w - 18, t.h - 25, 20); c.fill();
    }
  }
  function cloud(c, x, y, s) {
    c.fillStyle = 'rgba(255,255,255,.75)';
    c.beginPath(); c.ellipse(x, y, s * 1.6, s * .55, 0, 0, TAU); c.fill();
    c.beginPath(); c.arc(x - s * .5, y - s * .3, s * .55, 0, TAU); c.arc(x + s * .3, y - s * .45, s * .7, 0, TAU); c.fill();
  }
  function fsFor(s, c) {
    const p = P[s.k]; let fs = clamp(Math.sqrt(p.areaPx) * .2, 8.5, lang === 'en' ? 15 : 16.5);
    c.font = `900 ${fs}px ${FONT}`;
    const tw = c.measureText(nm(s)).width, maxW = p.w * .9;
    if (tw > maxW) fs = Math.max(8, fs * maxW / tw);
    return fs;
  }
  function nameText(c, t, x, y, fs, fill, stroke) {
    c.save(); c.font = `900 ${fs}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = lang === 'en' ? 'ltr' : 'rtl';
    // نص طويل: سطران
    const words = t.split(' '), lines = (words.length > 1 && c.measureText(t).width > fs * 6.2) ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [t];
    lines.forEach((ln, i) => {
      const yy = y + (i - (lines.length - 1) / 2) * fs * 1.05;
      if (stroke) { c.lineJoin = 'round'; c.lineWidth = Math.max(2.5, fs * .32); c.strokeStyle = stroke; c.strokeText(ln, x, yy); }
      c.fillStyle = fill; c.fillText(ln, x, yy);
    });
    c.restore();
  }

  /* ---------- تجهيز القطع ثلاثية الأبعاد ---------- */
  function bakePieces() {
    for (const s of STATES) {
      const p = P[s.k], M = Math.ceil(D + 14), cw = p.w + M * 2, ch = p.h + M * 2;
      const body = mk(cw * dpr, ch * dpr), c = body.getContext('2d');
      c.scale(dpr, dpr); c.translate(cw / 2, ch / 2); c.lineJoin = 'round';
      // الجانب السميك
      const side = shade(s.col, -.32), sideD = shade(s.col, -.45);
      for (let i = D; i > 0; i -= .5) { c.save(); c.translate(0, i); c.fillStyle = i > D - 1 ? sideD : side; c.fill(p.loc); c.restore(); }
      c.save(); c.translate(0, D); c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.stroke(p.loc); c.restore();
      // الوجه العلوي
      c.save(); c.clip(p.loc);
      const g = c.createLinearGradient(-p.w / 2, -p.h / 2, p.w / 3, p.h / 2); g.addColorStop(0, shade(s.col, .28)); g.addColorStop(.35, s.col); g.addColorStop(1, shade(s.col, -.08));
      c.fillStyle = g; c.fill(p.loc);
      const R = Math.max(p.w, p.h) * .7, rgd = c.createRadialGradient(-p.w * .22, -p.h * .3, 0, -p.w * .22, -p.h * .3, R);
      rgd.addColorStop(0, 'rgba(255,255,255,.42)'); rgd.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = rgd; c.fillRect(-p.w, -p.h, p.w * 2, p.h * 2);
      c.save(); c.translate(1.4, 1.8); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 3; c.stroke(p.loc); c.restore();
      c.save(); c.translate(-1.3, -1.6); c.strokeStyle = 'rgba(0,0,0,.14)'; c.lineWidth = 3; c.stroke(p.loc); c.restore();
      c.restore();
      c.strokeStyle = shade(s.col, -.38); c.lineWidth = 1; c.stroke(p.loc);
      // الظل
      const sh = mk(cw * dpr, ch * dpr), sc = sh.getContext('2d');
      sc.scale(dpr, dpr); sc.translate(cw / 2, ch / 2);
      sc.shadowColor = 'rgba(30,50,80,.42)'; sc.shadowBlur = 7; sc.shadowOffsetX = cw * 3; sc.translate(-cw * 3, 0); sc.fillStyle = '#000'; sc.fill(p.loc);
      // توهّج التلميح
      const gl = mk(cw * dpr, ch * dpr), gc = gl.getContext('2d');
      gc.scale(dpr, dpr); gc.translate(cw / 2, ch / 2);
      gc.shadowColor = '#FFF27A'; gc.shadowBlur = 12; gc.fillStyle = 'rgba(255,240,120,.75)'; gc.fill(p.loc); gc.fill(p.loc);
      gc.shadowBlur = 0; gc.strokeStyle = '#FFD21E'; gc.lineWidth = 3; gc.stroke(p.loc);
      Object.assign(p, { body, shadow: sh, glow: gl, cw, ch });
    }
  }

  /* ---------- الصينية ---------- */
  function layoutTray() {
    cells = [];
    if (!(mode === 'easy' || mode === 'normal')) return;
    const t = { x: tray.x + 14, y: tray.y + 14, w: tray.w - 28, h: tray.h - 34 };
    let cols, rows;
    if (portrait) { rows = t.h > 300 ? 3 : 2; cols = 3; if (t.w > 520) cols = 4; }
    else { cols = 2; rows = t.h > 480 ? 4 : 3; }
    const cw = t.w / cols, ch = t.h / rows;
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) cells.push({ x: t.x + (q + .5) * cw, y: t.y + (r + .5) * ch, w: cw, h: ch });
    // RTL: نبدأ من اليمين
    for (let r = 0; r < rows; r++) { const row = cells.slice(r * cols, r * cols + cols).reverse(); for (let q = 0; q < cols; q++) cells[r * cols + q] = row[q]; }
    for (const pc of pieces) if (pc.cell >= 0) fitToCell(pc);
  }
  function fitToCell(pc) {
    const cl = cells[pc.cell]; if (!cl) return;
    const p = P[pc.s.k], lab = 22;
    pc.tsc = Math.min((cl.w - 14) / p.w, (cl.h - lab - 18 - D * 1.5) / p.h, 2.4);
    pc.homeX = cl.x; pc.homeY = cl.y - lab / 2 - D * .6;
  }

  /* ---------- بدء جولة ---------- */
  function start(m) {
    mode = m; over = false; mistakes = 0; parts = []; rings = []; popup = null; tip = null; drag = null;
    clearTimeout(winTimer); clearTimeout(qTimer);
    winOv.classList.remove('on'); mOv.classList.remove('on');
    pieces = STATES.map(s => ({ s, state: 'done', x: 0, y: 0, sc: 1, tsc: 1, lift: 0, rot: 0, pop: 0, flash: 0, errs: 0, hint: 0, cell: -1, ph: Math.random() * TAU, appear: 1, wob: 0 }));
    const quizMode = m === 'quiz' || m === 'lmq';
    qcard.classList.toggle('on', quizMode);
    layout();
    if (!quizMode) {
      const todo = pieces.filter(pc => !(m === 'easy' && EASY_PRE.includes(pc.s.k)));
      todo.forEach(pc => { pc.state = 'queue'; });
      // ترتيب عشوائي مع البدء بولايات كبيرة سهلة
      queue = shuffle(todo.slice()).sort((a, b) => (P[b.s.k].areaPx > 2500 ? 1 : 0) - (P[a.s.k].areaPx > 2500 ? 1 : 0) || 0);
      queue = interleave(queue);
      slots = cells.map(() => null);
      for (let i = 0; i < cells.length && queue.length; i++) fillSlot(i, i * .07);
      quiz = null;
    } else {
      const pool = m === 'quiz' ? shuffle(STATES.slice()).slice(0, QN) : shuffle(LANDMARKS.slice()).slice(0, QN);
      quiz = { pool, i: 0, score: 0, tries: 0, lock: false };
      setTimeout(() => ask(), 450);
    }
    for (const pc of pieces) if (pc.state === 'done') { pc.x = P[pc.s.k].hx; pc.y = P[pc.s.k].hy; }
    labDirty = true;
  }
  function interleave(q) { // نخلط الكبيرة والصغيرة حتى لا تبقى الصغيرة كلها للنهاية
    const big = q.filter(pc => P[pc.s.k].areaPx > 2500 * (k / 20) ** 2), small = q.filter(pc => !big.includes(pc)), out = [];
    while (big.length || small.length) { if (big.length) out.push(big.shift()); if (small.length) out.push(small.shift()); }
    return out;
  }
  function fillSlot(i, delay = 0) {
    const pc = queue.shift(); slots[i] = pc || null; if (!pc) return;
    pc.cell = i; pc.state = 'tray'; fitToCell(pc); pc.x = pc.homeX; pc.y = pc.homeY; pc.sc = pc.tsc; pc.appear = -delay * 4; pc.lift = 0;
  }

  /* ---------- الأسئلة ---------- */
  function ask() {
    if (!quiz || App.current !== ID) return;
    const it = quiz.pool[quiz.i]; quiz.tries = 0; quiz.lock = false;
    const isLm = mode === 'lmq';
    qcard.classList.toggle('lm', isLm);
    qk.textContent = `${isLm ? '🏛️ المعالم' : '❓ الولايات'} · السؤال ${dig(quiz.i + 1)} من ${dig(QN)}`;
    qt.classList.toggle('en', lang === 'en');
    qt.textContent = qText(it);
    qs.textContent = isLm ? lms(it) : '';
    if (isLm) { const c = qic.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 168, 168); c.translate(84, 80); drawBadge(c, it, 66); }
    qcard.animate([{ transform: 'scale(.85)', opacity: .3 }, { transform: 'scale(1.04)', opacity: 1 }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
    sayQ();
  }
  function qText(it) {
    if (mode === 'lmq') return lang === 'en' ? `${it.pl ? 'Where are the' : 'Where is'} ${it.en}?` : `أين ${it.ar}؟`;
    if (lang === 'en') return `Where is ${it.en}?`;
    return it.k === 'northern' ? 'أين الولاية الشمالية؟' : `أين ولاية ${it.ar}؟`;
  }
  function sayQ() { if (quiz && quiz.pool[quiz.i]) say(qText(quiz.pool[quiz.i])); }
  function answer(s) {
    if (!quiz || quiz.lock || over) return;
    const it = quiz.pool[quiz.i], target = mode === 'lmq' ? it.st : it, pc = pieces[s.i];
    if (s === target) {
      quiz.lock = true; if (quiz.tries === 0) quiz.score++;
      pc.pop = 1; pc.lift = 1; pc.hint = 0; Sound.pop(); Sound.star(); vibrate(20);
      const p = P[s.k]; sparkle(p.px, p.py, s.col); burstStars(p.px, p.py);
      const l = mode === 'lmq' ? it : s.lm[0];
      showPopup(s, l);
      say(App.g(lang === 'en' ? 'Well done!' : 'أحسنتِ!', lang === 'en' ? 'Well done!' : 'أحسنت!') + ' ' + (mode === 'lmq' ? lmn(l) : nm(s)));
      pieces.forEach(q => q.hint = 0);
      qTimer = setTimeout(() => { quiz.i++; if (quiz.i >= QN) finishQuiz(); else ask(); }, 2100);
    } else {
      quiz.tries++; mistakes++;
      pc.flash = 1; pc.wob = 1; Sound.error(); vibrate(35); shake = Math.max(shake, 3);
      tip = { s, t: 0 };
      if (quiz.tries >= 2) pieces[target.i].hint = 99;
      say(lang === 'en' ? 'Try again!' : App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'));
    }
  }
  function finishQuiz() {
    const sc = quiz.score, stars = sc >= 9 ? 3 : sc >= 6 ? 2 : 1;
    finish(stars, `${dig(sc)} من ${dig(QN)} ${sc >= 9 ? "🌟" : ""}`, mode === 'quiz' ? (sc >= QN ? 'sudanmap_quiz' : null) : (sc >= QN ? 'sudanmap_landmarks' : null));
  }

  /* ---------- الفوز ---------- */
  function finish(stars, line, ach) {
    over = true;
    const pr = loadProg(), prev = pr.stars[mode] || 0;
    if (stars > prev) pr.stars[mode] = stars;
    if (lang === 'en') pr.en = (pr.en || 0) + 1;
    saveProg(pr);
    confetti();
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      const quizMode = mode === 'quiz' || mode === 'lmq';
      root.querySelector('.wT').textContent = quizMode ? '🎉 ' + App.g('أحسنتِ!', 'أحسنت!') : '🎉 اكتملت خريطة السودان!';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = quizMode ? 'الإجابات الصحيحة من أول مرة' : (mistakes ? `الأخطاء: ${dig(mistakes)}` : 'بلا أي خطأ! 👏');
      root.querySelector('.wl').textContent = line || '';
      winOv.classList.add('on'); Sound.win();
      if (!quizMode) say(lang === 'en' ? 'The map of Sudan is complete!' : 'اكتملت خريطة السودان!');
      else say(lang === 'en' ? 'Well done!' : App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev + (mode === 'normal' || mode === 'lmq' ? 1 : 0));
      if (!quizMode) App.achieve('sudanmap_first');
      if (mode === 'normal' && !mistakes) App.achieve('sudanmap_perfect');
      if (ach) App.achieve(ach);
      if (lang === 'en') App.achieve('sudanmap_en');
    }, quizMode() ? 700 : 1500);
  }
  const quizMode = () => mode === 'quiz' || mode === 'lmq';

  /* ---------- النوافذ ---------- */
  function openModes() {
    const pr = loadProg();
    const cols = { easy: ['#7ED957', '#4E9E36'], normal: ['#FFB74A', '#D98712'], quiz: ['#5FD0F0', '#1F8FBF'], lmq: ['#C59BFF', '#8A5AD6'] };
    root.querySelector('.mg').innerHTML = Object.keys(MODES).map(m => {
      const st = pr.stars[m] || 0, M = MODES[m];
      return `<button class="mb" data-m="${m}" style="--c:${cols[m][0]};--cd:${cols[m][1]}"><span class="e">${M.ic}</span><span class="t">${M.t}</span><span class="d">${m === 'quiz' || m === 'lmq' ? App.g(M.d.replace('المس', 'المسي'), M.d) : M.d}</span>
        <span class="s">${[1, 2, 3].map(i => `<i class="${i <= st ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    root.querySelectorAll('.mg .mb').forEach(b => b.addEventListener('click', () => { Sound.tap(); start(b.dataset.m); }));
    syncLang();
    winOv.classList.remove('on'); mOv.classList.add('on');
  }
  function syncLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('sudanmapLang', l); syncLang(); Sound.tap();
    if (W) { bakeBG(); labDirty = true; }
    if (quiz && !over && quizMode()) { qt.classList.toggle('en', lang === 'en'); qt.textContent = qText(quiz.pool[quiz.i]); qs.textContent = mode === 'lmq' ? lms(quiz.pool[quiz.i]) : ''; sayQ(); }
    else say(lang === 'en' ? 'Sudan' : 'السودان');
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  root.querySelector('.modebtn').addEventListener('click', () => { Sound.tap(); openModes(); });
  root.querySelector('.say').addEventListener('click', () => { Sound.tap(); sayQ(); });
  root.querySelector('.mclose').addEventListener('click', () => { Sound.tap(); mOv.classList.remove('on'); if (over) winOv.classList.add('on'); });
  root.querySelectorAll('#smWin [data-a]').forEach(b => b.addEventListener('click', () => { Sound.tap(); b.dataset.a === 'again' ? start(mode) : openModes(); }));

  /* ---------- النافذة المنبثقة للمَعلم ---------- */
  function showPopup(s, l) { popup = { s, l, t: 0, life: s.lm.length > 1 && l === s.lm[0] ? 3.4 : 2.8, both: mode !== 'lmq' && s.lm.length > 1 }; }

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 18; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(4, 9), c: i % 2 ? '#FFE26B' : shade(col, -.15) });
    }
    rings.push({ x, y, age: 0, life: .5, r: 18 });
  }
  function burstStars(x, y) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35; parts.push({ t: 'star', x, y, vx: Math.cos(a) * 160, vy: Math.sin(a) * 200, rot: 0, vr: rand(-3, 3), life: .9, age: 0, s: 10, c: '#FFD21E' }); } }
  function confetti() {
    const cols = ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'];
    for (let i = 0; i < 90; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .3, -10), vx: rand(-40, 40), vy: rand(60, 200), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.2, 3.4), age: 0, s: rand(7, 12), c: cols[i % cols.length] });
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function stateAt(x, y, onlyDone) {
    // من الجنوب إلى الشمال (عكس ترتيب الرسم)
    const ord = drawOrder().slice().reverse();
    for (const pc of ord) { if (onlyDone && pc.state !== 'done') continue; if (ctx.isPointInPath(P[pc.s.k].scr, x * dpr, y * dpr)) return pc.s; }
    // تسامح للولايات الصغيرة
    let best = null, bd = 14;
    ctx.save(); ctx.lineWidth = 20;
    for (const pc of ord) { if (onlyDone && pc.state !== 'done') continue; if (ctx.isPointInStroke(P[pc.s.k].scr, x * dpr, y * dpr)) { const d = Math.hypot(x - P[pc.s.k].px, y - P[pc.s.k].py); if (!best || d < bd * 6) { best = pc.s; bd = d / 6; } } }
    ctx.restore();
    return best;
  }
  function emptyAt(x, y, except) {
    for (const pc of pieces) { if (pc.state === 'done' || pc === except) continue; if (ctx.isPointInPath(P[pc.s.k].scr, x * dpr, y * dpr)) return pc; }
    return null;
  }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || mOv.classList.contains('on');
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    Sound.ac && Sound.ac(true);
    const m = pos(e);
    if (quizMode()) { const s = stateAt(m.x, m.y, true); if (s) answer(s); return; }
    // قطعة في الصينية؟
    for (const pc of pieces) {
      if (pc.state !== 'tray' && pc.state !== 'back') continue;
      const cl = cells[pc.cell]; if (!cl) continue;
      if (Math.abs(m.x - cl.x) < cl.w / 2 && Math.abs(m.y - cl.y) < cl.h / 2) {
        try { cv.setPointerCapture(e.pointerId); } catch (er) {}
        drag = { pc, id: e.pointerId, sx: m.x, sy: m.y, tx: pc.x, ty: pc.y, ox: pc.x - m.x, oy: pc.y - m.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lastX: m.x, vx: 0 };
        pc.state = 'drag'; pc.wob = 0;
        Sound.tone(520, .08, 'sine', .1, 260); vibrate(10);
        return;
      }
    }
    // ولاية مكتملة: نطق الاسم والمَعلم
    const s = stateAt(m.x, m.y, true);
    if (s) {
      const pc = pieces[s.i]; pc.pop = 1; Sound.pop(); showPopup(s, s.lm[0]); say(nm(s) + ' ' + lmn(s.lm[0]));
      return;
    }
    const em = emptyAt(m.x, m.y);
    if (em && mode === 'easy') { em.flash = .35; say(nm(em.s)); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) {
      drag.moved = true;
      // نجعل القطعة تحت الإصبع (فوقه قليلًا عند اللمس)
      drag.ox = 0; drag.oy = drag.touch ? -Math.min(46, 16 + P[drag.pc.s.k].h * .25) : 0;
    }
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy;
    drag.vx = drag.vx * .6 + (m.x - drag.lastX) * .4; drag.lastX = m.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, pc = d.pc, p = P[pc.s.k]; drag = null;
    if (!d.moved && performance.now() - d.t0 < 400) { say(nm(pc.s)); pc.pop = 1; Sound.pop(); toTray(pc, false); return; }
    const tol = clamp(Math.min(p.w, p.h) * .35, 16, 34) + 8;
    if (Math.hypot(pc.x - p.hx, pc.y - p.hy) < tol) { snap(pc); return; }
    // داخل مكان ولاية أخرى فارغ = خطأ
    const lx = pc.x + (P[pc.s.k].px - p.hx), ly = pc.y + (P[pc.s.k].py - p.hy);
    const wrong = emptyAt(lx, ly, pc);
    if (wrong) {
      mistakes++; pc.errs++; wrong.flash = 1;
      Sound.error(); vibrate(35); shake = Math.max(shake, 4);
      if (pc.errs >= 2) pc.hint = 99;
      toTray(pc, true);
    } else { Sound.slide(); toTray(pc, false); }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  function toTray(pc, wob) { pc.state = 'back'; pc.a = 0; pc.fx = pc.x; pc.fy = pc.y; pc.fsc = pc.sc; pc.wob = wob ? 1 : 0; }
  function snap(pc) { pc.state = 'fly'; pc.a = 0; pc.fx = pc.x; pc.fy = pc.y; pc.fsc = pc.sc; }
  function placed(pc) {
    const s = pc.s, p = P[s.k];
    pc.state = 'done'; pc.x = p.hx; pc.y = p.hy; pc.sc = 1; pc.rot = 0; pc.lift = 0; pc.pop = 1; pc.hint = 0;
    Sound.thud(); Sound.pop(); vibrate(25); shake = Math.max(shake, 2.5);
    sparkle(p.px, p.py, s.col); labDirty = true;
    showPopup(s, s.lm[0]);
    say(nm(s) + ' ' + lmn(s.lm[0]));
    const ci = pc.cell; pc.cell = -1;
    if (ci >= 0) fillSlot(ci, .25);
    if (pieces.every(q => q.state === 'done')) {
      const st = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1;
      setTimeout(() => finish(st, `${dig(18)} ولاية 🇸🇩`, null), 1400);
    }
  }

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(mode); }
    else if (e.key === 'm' || e.key === 'M') { mOv.classList.contains('on') ? mOv.classList.remove('on') : openModes(); }
    else if (e.key === 'l' || e.key === 'L') setLang(lang === 'ar' ? 'en' : 'ar');
    else if ((e.key === 'r' || e.key === 'R') && quizMode()) sayQ();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    const kk = 1 - Math.exp(-dt * 26);
    for (const pc of pieces) {
      pc.pop = Math.max(0, pc.pop - dt * 2.4);
      pc.flash = Math.max(0, pc.flash - dt * 1.6);
      pc.wob = Math.max(0, pc.wob - dt * 2);
      pc.appear = Math.min(1, pc.appear + dt * 3.2);
      const p = P[pc.s.k];
      if (pc.state === 'drag' && drag && drag.pc === pc) {
        pc.x += (drag.tx - pc.x) * kk; pc.y += (drag.ty - pc.y) * kk;
        const tgt = drag.moved ? 1.06 : pc.tsc * 1.08;
        pc.sc += (tgt - pc.sc) * kk * .7; pc.lift += (1 - pc.lift) * kk * .6;
        pc.rot += (clamp(drag.vx * .015, -.22, .22) - pc.rot) * kk * .5;
      } else if (pc.state === 'fly') {
        pc.a += dt / .22; const t = Math.min(1, pc.a), e = ease.outCubic(t);
        pc.x = pc.fx + (p.hx - pc.fx) * e; pc.y = pc.fy + (p.hy - pc.fy) * e; pc.sc = pc.fsc + (1 - pc.fsc) * e;
        pc.rot *= 1 - kk; pc.lift = 1 - e;
        if (t >= 1) placed(pc);
      } else if (pc.state === 'back') {
        pc.a += dt / (pc.wob ? .6 : .4);
        const t = Math.min(1, pc.a), tm = pc.wob ? clamp((t - .3) / .7, 0, 1) : t, e = pc.wob ? ease.outCubic(tm) : ease.outBack(tm);
        pc.x = pc.fx + (pc.homeX - pc.fx) * e; pc.y = pc.fy + (pc.homeY - pc.fy) * e; pc.sc = pc.fsc + (pc.tsc - pc.fsc) * e;
        pc.rot = pc.wob ? Math.sin(t * 34) * .25 * (1 - t) : pc.rot * (1 - kk);
        pc.lift += (0 - pc.lift) * kk * .5;
        if (t >= 1) { pc.state = 'tray'; pc.rot = 0; }
      } else if (pc.state === 'tray') {
        pc.x = pc.homeX; pc.y = pc.homeY + Math.sin(T * 2 + pc.ph) * 1.4; pc.sc += (pc.tsc - pc.sc) * kk; pc.rot = 0; pc.lift *= 1 - kk;
      } else if (pc.state === 'done') {
        pc.lift += (0 - pc.lift) * kk * .25;
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    if (popup) { popup.t += dt; if (popup.t > popup.life) popup = null; }
    if (tip) { tip.t += dt; if (tip.t > 1.6) tip = null; }
    shake = Math.max(0, shake - dt * 16);
  }

  /* ---------- الرسم ---------- */
  function drawOrder() { return pieces.slice().sort((a, b) => P[a.s.k].py - P[b.s.k].py); }
  function drawPiece(pc, x, y, sc, rot, lift, squash) {
    const p = P[pc.s.k];
    ctx.save(); ctx.translate(x, y);
    if (lift > .01) {
      const so = 2 + lift * 14;
      ctx.save(); ctx.globalAlpha = .7 - lift * .25; ctx.translate(so * .3, so); ctx.rotate(rot); ctx.scale(sc * (1 + lift * .04), sc * (1 + lift * .04));
      ctx.drawImage(p.shadow, -p.cw / 2, -p.ch / 2, p.cw, p.ch); ctx.restore();
    } else {
      ctx.save(); ctx.globalAlpha = .55; ctx.translate(1, 2.5); ctx.scale(sc, sc); ctx.drawImage(p.shadow, -p.cw / 2, -p.ch / 2, p.cw, p.ch); ctx.restore();
    }
    ctx.rotate(rot); ctx.scale(sc * (1 + squash), sc * (1 - squash));
    ctx.translate(0, -lift * 4);
    ctx.drawImage(p.body, -p.cw / 2, -p.ch / 2, p.cw, p.ch);
    ctx.restore();
  }
  function bakeLabels() {
    labLayer = labLayer && labLayer.width === Math.ceil(W * dpr) && labLayer.height === Math.ceil(H * dpr) ? labLayer : mk(W * dpr, H * dpr);
    const c = labLayer.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, labLayer.width, labLayer.height); c.scale(dpr, dpr);
    const R = clamp(k * .42, 8, 15);
    for (const pc of pieces) {
      if (pc.state !== 'done') continue;
      const s = pc.s, p = P[s.k];
      const fs = fsFor(s, c);
      // الشارات الصغيرة للمعالم
      s.lm.forEach((l, i) => {
        let [bx, by] = sp(l.p[0], l.p[1]);
        if (s.lm.length > 1) bx += (i ? -1 : 1) * R * .95;
        const dy = by - p.py, dx = bx - p.px;
        if (Math.abs(dy) < fs + R && Math.abs(dx) < R * 2.5) by = p.py + (dy >= 0 ? 1 : -1) * (fs * .65 + R + 1) * (s.lm.length > 1 ? 1 : 1);
        if (s.k === 'khartoum') by = p.py + fs * .55 + R * .9;
        c.save(); c.translate(bx, by - D * .2); drawBadge(c, l, R); c.restore();
      });
      nameText(c, nm(s), p.px, p.py - (s.k === 'khartoum' ? R * .5 : 0), fs, '#fff', shade(s.col, -.5));
    }
    labDirty = false;
  }
  function render() {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    ctx.drawImage(bgLayer, 0, 0, W, H);
    // تلميحات الفراغات
    for (const pc of pieces) {
      if (pc.state === 'done') continue;
      const p = P[pc.s.k];
      let gA = 0;
      if (pc.hint > 0) gA = .45 + .4 * Math.sin(T * 7);
      if (drag && drag.moved && drag.pc === pc && pc.errs >= 1) gA = Math.max(gA, .35);
      if (gA > .01) { ctx.save(); ctx.globalAlpha = gA; ctx.drawImage(p.glow, p.hx - p.cw / 2, p.hy - p.ch / 2, p.cw, p.ch); ctx.restore(); }
      if (pc.flash > 0) { ctx.save(); ctx.globalAlpha = pc.flash * .7; ctx.fillStyle = pc.flash > .5 && pc.flash < 1 && mode === 'easy' && pc.flash < .4 ? '#FFF27A' : '#FF5A5A'; ctx.fill(p.scr); ctx.restore(); }
    }
    // القطع المثبّتة (من الشمال إلى الجنوب)
    const ord = drawOrder();
    for (const pc of ord) {
      if (pc.state !== 'done') continue;
      const p = P[pc.s.k];
      const sq = Math.sin((1 - pc.pop) * Math.PI * 3) * pc.pop * .07;
      const wob = pc.wob ? Math.sin(T * 40) * pc.wob * .04 : 0;
      drawPiece(pc, p.hx, p.hy, 1 + pc.lift * .05, wob, pc.lift, sq);
      if (pc.flash > 0) { ctx.save(); ctx.globalAlpha = pc.flash * .55; ctx.fillStyle = '#FF4B4B'; ctx.translate(0, -pc.lift * 4); ctx.fill(p.scr); ctx.restore(); }
      if (pc.hint > 0) { ctx.save(); ctx.globalAlpha = .4 + .35 * Math.sin(T * 7); ctx.drawImage(p.glow, p.hx - p.cw / 2, p.hy - p.ch / 2, p.cw, p.ch); ctx.restore(); }
    }
    drawRivers();
    if (labDirty) bakeLabels();
    ctx.drawImage(labLayer, 0, 0, W, H);
    // شريط التقدّم المقسّم
    drawProgress();
    // الصينية
    if (mode === 'easy' || mode === 'normal') {
      for (const pc of pieces) {
        if (pc.state !== 'tray' && pc.state !== 'back') continue;
        const a = clamp(pc.appear, 0, 1); if (a <= 0) continue;
        const cl = cells[pc.cell];
        const e = ease.outBack(a);
        // بطاقة الاسم تحت القطعة
        if (cl && pc.state === 'tray') {
          ctx.save(); ctx.globalAlpha = a; const fs = clamp(cl.w * .12, 11, 15); ctx.font = `900 ${fs}px ${FONT}`; ctx.direction = lang === 'en' ? 'ltr' : 'rtl';
          const t = nm(pc.s), tw = Math.min(cl.w - 6, ctx.measureText(t).width + 16), ly = cl.y + cl.h / 2 - fs * .9 - 4;
          ctx.fillStyle = shade(pc.s.col, -.3); roundRectPath(ctx, cl.x - tw / 2, ly - fs * .75 + 2, tw, fs * 1.5, fs * .75); ctx.fill();
          ctx.fillStyle = '#fff'; roundRectPath(ctx, cl.x - tw / 2, ly - fs * .75, tw, fs * 1.5, fs * .75); ctx.fill();
          ctx.fillStyle = shade(pc.s.col, -.5); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, cl.x, ly + 1, cl.w - 12); ctx.restore();
        }
        const sq = Math.sin((1 - pc.pop) * Math.PI * 3) * pc.pop * .1;
        drawPiece(pc, pc.x, pc.y, pc.sc * e, pc.rot, pc.lift, sq);
      }
      if (!pieces.some(pc => pc.state === 'tray' || pc.state === 'back' || pc.state === 'drag' || pc.state === 'fly') && !over) {
        ctx.save(); ctx.font = `900 18px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#C08A1E'; ctx.fillText('✨', tray.x + tray.w / 2, tray.y + tray.h / 2); ctx.restore();
      }
    }
    for (const pc of pieces) if (pc.state === 'fly') drawPiece(pc, pc.x, pc.y, pc.sc, pc.rot, pc.lift, 0);
    if (drag) drawPiece(drag.pc, drag.pc.x, drag.pc.y, drag.pc.sc, drag.pc.rot, drag.pc.lift, 0);
    // حلقات وجسيمات
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r + t * 40, 0, TAU); ctx.stroke(); ctx.restore();
    }
    drawTip();
    drawPopup();
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    ctx.restore();
  }
  function riverPath(r) { ctx.beginPath(); r.pts.forEach(([lo, la], i) => { const [x, y] = sp(...proj0(lo, la)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); }
  function drawRivers() {
    const w0 = clamp(k * .3, 3, 9);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    roundRectPath(ctx, inner.x, inner.y, inner.w, inner.h, 22); ctx.clip();
    // خارج السودان: باهت
    ctx.save(); ctx.globalAlpha = .45;
    for (const r of RIVERS) { riverPath(r); ctx.strokeStyle = r.c; ctx.lineWidth = w0 * r.w; ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.clip(statesUnion);
    for (const r of RIVERS) { riverPath(r); ctx.strokeStyle = r.d; ctx.lineWidth = w0 * r.w + 3; ctx.stroke(); }
    for (const r of RIVERS) { riverPath(r); ctx.strokeStyle = r.c; ctx.lineWidth = w0 * r.w; ctx.stroke(); }
    ctx.setLineDash([w0 * 1.2, w0 * 2.6]); ctx.lineDashOffset = -T * w0 * 3;
    for (const r of RIVERS) { riverPath(r); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = Math.max(1.2, w0 * r.w * .32); ctx.stroke(); }
    ctx.restore();
    // ملتقى النيلين
    const [cx, cy] = sp(...proj0(32.53, 15.61)), pr = w0 * .9 + Math.sin(T * 3) * 1.2;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1F5FB8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, pr, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function drawProgress() {
    let n, done;
    if (quizMode()) { n = QN; done = quiz ? quiz.i + (quiz.lock ? 1 : 0) : 0; }
    else { const todo = pieces.filter(pc => !(mode === 'easy' && EASY_PRE.includes(pc.s.k))); n = todo.length; done = todo.filter(pc => pc.state === 'done').length; }
    const sw = clamp((board.w - 120) / n - 4, 6, 18), sh = 9, gap = 4, tw = n * sw + (n - 1) * gap + 22, th = 22;
    const x0 = board.x + board.w / 2 - tw / 2, y0 = board.y + board.h - th / 2 - 2;
    ctx.save();
    ctx.fillStyle = '#4FB0D3'; roundRectPath(ctx, x0, y0 + 3, tw, th, th / 2); ctx.fill();
    ctx.fillStyle = '#fff'; roundRectPath(ctx, x0, y0, tw, th, th / 2); ctx.fill();
    for (let i = 0; i < n; i++) {
      const x = x0 + tw - 11 - (i + 1) * sw - i * gap; // من اليمين
      ctx.fillStyle = i < done ? '#FF9A2E' : '#DCE6EE';
      roundRectPath(ctx, x, y0 + (th - sh) / 2, sw, sh, sh / 2); ctx.fill();
      if (i < done) { ctx.fillStyle = 'rgba(255,255,255,.5)'; roundRectPath(ctx, x + 2, y0 + (th - sh) / 2 + 1.5, sw - 4, 2.5, 1.2); ctx.fill(); }
    }
    ctx.restore();
  }
  function drawTip() {
    if (!tip) return;
    const s = tip.s, p = P[s.k], a = Math.min(1, (1.6 - tip.t) * 3), e = ease.outBack(Math.min(1, tip.t * 4));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(p.px, p.py - 18 - e * 6); ctx.scale(e, e);
    ctx.font = `900 15px ${FONT}`; ctx.direction = lang === 'en' ? 'ltr' : 'rtl';
    const t = '✖ ' + nm(s), tw = ctx.measureText(t).width + 18;
    ctx.fillStyle = '#E04848'; roundRectPath(ctx, -tw / 2, -12, tw, 26, 13); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, 0, 1);
    ctx.restore();
  }
  function drawPopup() {
    if (!popup) return;
    const { s, t, life } = popup, p = P[s.k];
    const list = popup.both ? s.lm : [popup.l];
    const inA = ease.outBack(Math.min(1, t / .35)), outA = clamp((life - t) / .3, 0, 1);
    const R = clamp(k * 1.25, 26, 44);
    const fs = clamp(k * .62, 13, 19);
    ctx.save(); ctx.font = `900 ${fs}px ${FONT}`; ctx.direction = lang === 'en' ? 'ltr' : 'rtl';
    const widths = list.map(l => Math.max(ctx.measureText(lmn(l)).width, (ctx.font = `800 ${fs * .72}px ${FONT}`, ctx.measureText(lms(l)).width)) + (ctx.font = `900 ${fs}px ${FONT}`, 0));
    const cardW = Math.max(R * 2.4, ...widths.map(w => w + 28)) * (list.length > 1 ? 1 : 1);
    const totalW = list.length > 1 ? cardW * 2 + 10 : cardW;
    const hasSub = list.some(l => lms(l));
    const cardH = R * 2 + fs * (hasSub ? 2.6 : 1.7) + 18;
    let cx = clamp(p.px, inner.x + totalW / 2 + 4, inner.x + inner.w - totalW / 2 - 4);
    let cy = p.py - cardH * .5 - 18; if (cy - cardH / 2 < inner.y + 4) cy = p.py + cardH * .5 + 18;
    cy = clamp(cy, inner.y + cardH / 2 + 4, inner.y + inner.h - cardH / 2 - 4);
    ctx.globalAlpha = outA; ctx.translate(cx, cy); ctx.scale(inA, inA);
    list.forEach((l, i) => {
      const ox = list.length > 1 ? (i ? -1 : 1) * (cardW / 2 + 5) * (lang === 'en' ? -1 : 1) : 0;
      ctx.save(); ctx.translate(ox, 0);
      const x = -cardW / 2, y = -cardH / 2;
      ctx.fillStyle = shade(s.col, -.35); roundRectPath(ctx, x, y + 5, cardW, cardH, 22); ctx.fill();
      ctx.fillStyle = '#fff'; roundRectPath(ctx, x, y, cardW, cardH, 22); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = s.col; roundRectPath(ctx, x + 2, y + 2, cardW - 4, cardH - 4, 20); ctx.stroke();
      ctx.save(); ctx.translate(0, y + R + 9 + Math.sin(T * 4) * 1.5); drawBadge(ctx, l, R); ctx.restore();
      ctx.fillStyle = '#1F4E79'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${fs}px ${FONT}`;
      ctx.fillText(lmn(l), 0, y + R * 2 + 14 + fs * .55, cardW - 10);
      if (lms(l)) { ctx.font = `800 ${fs * .72}px ${FONT}`; ctx.fillStyle = shade(s.col, -.45); ctx.fillText(lms(l), 0, y + R * 2 + 14 + fs * 1.6, cardW - 10); }
      ctx.restore();
    });
    // سهم صغير يشير إلى الولاية
    ctx.restore();
  }

  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    update(dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }

  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID || !pieces.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => {
      if (drag) { const pc = drag.pc; drag = null; pc.state = 'tray'; }
      layout();
      for (const pc of pieces) { if (pc.state === 'done') { pc.x = P[pc.s.k].hx; pc.y = P[pc.s.k].hy; } else if (pc.cell >= 0) { pc.state = 'tray'; pc.x = pc.homeX; pc.y = pc.homeY; pc.sc = pc.tsc; } }
      render();
    }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#9FDDFB'); g.addColorStop(1, '#E2F6FF');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const kk = s * .78 / W0, ox = s * .11, oy = s * .1 + (s * .78 - H0 * kk) / 2;
    const tp = ([x, y]) => [ox + x * kk, oy + y * kk];
    // بحر
    c.fillStyle = '#5DBDF0'; c.beginPath(); c.moveTo(...tp(proj0(35.2, 24))); for (let i = 30; i >= 8; i--) c.lineTo(...tp(proj0(...RINGS.redsea[i]))); c.lineTo(s, s * .62); c.lineTo(s, 0); c.closePath(); c.fill();
    const ord = STATES.slice().sort((a, b) => PJ[a.k].pole[1] - PJ[b.k].pole[1]);
    for (const st of ord) {
      const path = () => { c.beginPath(); PJ[st.k].r.forEach((p, i) => i ? c.lineTo(...tp(p)) : c.moveTo(...tp(p))); c.closePath(); };
      c.save(); c.translate(0, s * .035); c.fillStyle = shade(st.col, -.4); path(); c.fill(); c.restore();
      c.save(); c.translate(0, s * .02); c.fillStyle = shade(st.col, -.3); path(); c.fill(); c.restore();
      c.fillStyle = st.col; path(); c.fill(); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1; c.stroke();
    }
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const r of RIVERS) { c.beginPath(); r.pts.forEach(([lo, la], i) => i ? c.lineTo(...tp(proj0(lo, la))) : c.moveTo(...tp(proj0(lo, la)))); c.strokeStyle = r.d; c.lineWidth = s * .03 * r.w; c.stroke(); c.strokeStyle = r.c; c.lineWidth = s * .018 * r.w; c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(s * .3, s * .2, s * .25, s * .07, -.3, 0, TAU); c.fill();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'خريطة السودان', icon2: '🗺️', isNew: true, music: 'shapes',
    desc: () => App.g('ركّبي ولايات السودان واكتشفي معالمها', 'ركّب ولايات السودان واكتشف معالمها'),
    help: () => [
      '🧩 ' + App.g('اسحبي', 'اسحب') + ' كل ولاية من الصينية إلى مكانها في خريطة السودان',
      '🏛️ عندما تستقرّ الولاية يظهر مَعلم مشهور فيها مع اسمه',
      '🔤 زر «عربي / English» يغيّر لغة الأسماء والصوت',
      '❓ في نمط «أين الولاية؟» ' + App.g('المسي', 'المس') + ' الولاية المطلوبة على الخريطة',
      '🔊 ' + App.g('المسي', 'المس') + ' أي ولاية ' + App.g('لتسمعي', 'لتسمع') + ' اسمها، وزر 🗺️ يفتح الأنماط'
    ],
    icon,
    best() {
      const pr = loadProg(), n = Object.values(pr.stars).reduce((a, b) => a + b, 0);
      return n ? `⭐ ${n} / ${Object.keys(MODES).length * 3}` : '';
    },
    enter() {
      paused = false;
      lang = store.get('sudanmapLang', 'ar') === 'en' ? 'en' : 'ar';
      syncLang();
      const pr = loadProg();
      start(pr.stars.easy ? 'normal' : 'easy');
      render(); startLoop();
      openModes();
    },
    leave() { stopLoop(); clearTimeout(winTimer); clearTimeout(qTimer); drag = null; winOv.classList.remove('on'); mOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const pc = drag.pc; drag = null; toTray(pc, false); } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (mOv.classList.contains('on')) { mOv.classList.remove('on'); if (over) winOv.classList.add('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { mode, lang, mistakes, over, k, quiz: quiz && { i: quiz.i, score: quiz.score, ask: quiz.pool[quiz.i] && (quiz.pool[quiz.i].k || quiz.pool[quiz.i].st.k) }, pieces: pieces.map(pc => ({ k: pc.s.k, state: pc.state, x: pc.x, y: pc.y, hx: P[pc.s.k].hx, hy: P[pc.s.k].hy, px: P[pc.s.k].px, py: P[pc.s.k].py, cell: pc.cell })) }; }
  });
})();
