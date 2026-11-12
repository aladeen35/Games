// All game content and balance values live here (data only, no logic).
// Prices are fictional game-economy values in SDG, not real market prices.

export const MATERIALS = {
  polypropylene: { tolerance: 0.9, release: 1.0, maxPH: 12, absorb: 0.55, dry: 1.4, fast: 0.95, shrink: 0, pile: 0.5, deep: 0.5, value: 1 },
  polyester: { tolerance: 0.8, release: 0.95, maxPH: 11, absorb: 0.65, dry: 1.2, fast: 0.9, shrink: 0, pile: 0.65, deep: 0.6, value: 1.1 },
  cotton: { tolerance: 0.6, release: 0.85, maxPH: 10, absorb: 1.0, dry: 0.8, fast: 0.6, shrink: 0.3, pile: 0.12, deep: 0.35, value: 1.2 },
  wool: { tolerance: 0.45, release: 0.75, maxPH: 8.6, absorb: 1.2, dry: 0.6, fast: 0.55, shrink: 0.6, pile: 0.75, deep: 0.8, value: 1.8, delicate: true },
  handwoven: { tolerance: 0.32, release: 0.7, maxPH: 8.2, absorb: 1.1, dry: 0.6, fast: 0.35, shrink: 0.5, pile: 0.4, deep: 0.6, value: 3, delicate: true },
  shag: { tolerance: 0.7, release: 0.6, maxPH: 11, absorb: 1.4, dry: 0.5, fast: 0.9, shrink: 0, pile: 1.7, deep: 1.0, value: 1.4 },
};

// id order matters: index is stored in the sim's per-cell stain type map (1-based).
export const STAIN_IDS = ['tea', 'grease', 'juice', 'ink', 'henna', 'protein', 'old'];
export const STAINS = {
  tea: { color: [0.42, 0.25, 0.1], heatSets: false, maxRemove: 1 },
  grease: { color: [0.3, 0.27, 0.16], heatSets: false, maxRemove: 1, warmHelps: true },
  juice: { color: [0.75, 0.2, 0.35], heatSets: false, maxRemove: 1 },
  ink: { color: [0.1, 0.12, 0.4], heatSets: false, maxRemove: 0.95 },
  henna: { color: [0.55, 0.22, 0.05], heatSets: true, maxRemove: 0.85 },
  protein: { color: [0.62, 0.55, 0.4], heatSets: true, maxRemove: 1 },
  old: { color: [0.33, 0.28, 0.22], heatSets: false, maxRemove: 0.75 },
};

// id order matters: index is stored per cell (1-based).
export const CHEM_IDS = ['shampoo', 'alkaline', 'enzyme', 'solvent', 'oxy', 'acid'];
export const CHEMS = {
  shampoo: { ph: 7, soil: 1.0, foam: 1.0, dwellOpt: 4, dwellMax: 200, price: 3000, unlock: 0,
    compat: { tea: 0.25, grease: 0.35, juice: 0.3, ink: 0.05, henna: 0.05, protein: 0.3, old: 0.15 } },
  alkaline: { ph: 11, soil: 1.35, foam: 0.7, dwellOpt: 6, dwellMax: 45, price: 4500, unlock: 0,
    compat: { tea: 0.3, grease: 0.9, juice: 0.25, ink: 0.15, henna: 0.05, protein: 0.35, old: 0.4 } },
  enzyme: { ph: 8, soil: 0.5, foam: 0.2, dwellOpt: 14, dwellMax: 90, price: 6000, unlock: 1,
    compat: { tea: 0.5, grease: 0.3, juice: 0.3, ink: 0.02, henna: 0.05, protein: 0.95, old: 0.5 } },
  solvent: { ph: 7, soil: 0.2, foam: 0, dwellOpt: 5, dwellMax: 40, price: 7000, unlock: 1,
    compat: { tea: 0.05, grease: 0.8, juice: 0.05, ink: 0.9, henna: 0.3, protein: 0.05, old: 0.3 } },
  oxy: { ph: 9.5, soil: 0.6, foam: 0.3, dwellOpt: 10, dwellMax: 50, price: 6500, unlock: 2,
    compat: { tea: 0.9, grease: 0.1, juice: 0.85, ink: 0.1, henna: 0.55, protein: 0.2, old: 0.5 } },
  acid: { ph: 4.5, soil: 0, foam: 0, dwellOpt: 2, dwellMax: 120, price: 5000, unlock: 3, rinseAid: true,
    compat: { tea: 0.1, grease: 0, juice: 0.05, ink: 0, henna: 0, protein: 0, old: 0.05 } },
};
// Pairs that must never be on the rug together; the game blocks them with a safety notice.
export const NO_MIX = [['oxy', 'acid'], ['alkaline', 'acid'], ['oxy', 'solvent']];
export const BOTTLE_ML = 1000;

// Tools. `slot` is the toolbar slot; the best owned tool in a slot is used.
export const TOOLS = {
  beater: { slot: 'dry', kind: 'dry', radius: 0.16, power: 0.8, price: 0, tier: 0 },
  vacuum: { slot: 'dry', kind: 'dry', radius: 0.2, power: 2.2, price: 60000, tier: 1, electric: true },
  bucket: { slot: 'spray', kind: 'spray', radius: 0.2, flow: 0.35, rate: 1.1, wash: 0, price: 0, tier: 0 },
  hose: { slot: 'spray', kind: 'spray', radius: 0.24, flow: 0.5, rate: 1.8, wash: 0.05, price: 35000, tier: 1 },
  washer: { slot: 'spray', kind: 'spray', radius: 0.17, flow: 0.3, rate: 1.6, wash: 0.5, price: 220000, tier: 2, electric: true },
  chem: { slot: 'chem', kind: 'chem', radius: 0.2, rate: 1.4, mlps: 22, price: 0, tier: 0 },
  brush: { slot: 'brush', kind: 'agitate', radius: 0.13, power: 0.55, harsh: 0.55, deep: 0.25, price: 0, tier: 0 },
  softbrush: { slot: 'brush', kind: 'agitate', radius: 0.15, power: 0.6, harsh: 0.25, deep: 0.25, price: 40000, tier: 1 },
  rotary: { slot: 'rotary', kind: 'agitate', radius: 0.24, power: 1.5, harsh: 0.85, deep: 1, price: 180000, tier: 1, electric: true, machine: true },
  squeegee: { slot: 'extract', kind: 'extract', radius: 0.2, rate: 1.6, floor: 0.38, price: 0, tier: 0 },
  wetvac: { slot: 'extract', kind: 'extract', radius: 0.2, rate: 2.4, floor: 0.14, price: 150000, tier: 1, electric: true },
  comb: { slot: 'groom', kind: 'groom', radius: 0.22, price: 0, tier: 0 },
};
export const SLOTS = ['dry', 'spray', 'chem', 'brush', 'rotary', 'extract', 'groom'];

// Non-tool equipment that unlocks capabilities (never a bare stat number).
export const GEAR = {
  meter: { price: 30000 }, // moisture view
  fans: { price: 90000 }, // fan drying
  trolley: { price: 25000 }, // carry medium rugs, less travel time
  tuktuk: { price: 650000 }, // large rugs + pickup, fast travel (fuel per trip)
  generator: { price: 260000 }, // work through power cuts
  tank: { price: 70000 }, // work through water cuts
  loupe: { price: 20000 }, // fibre + knot inspection without guessing
};

export const ECON = {
  startCash: 60000,
  jobBase: { S: 8000, M: 15000, L: 25000 },
  delicateFee: 5000,
  rushPct: 30,
  rentDeposit: 500000,
  premises: {
    home: { rent: 0, deposit: 0, jobsPerDay: 2, indoor: false },
    stall: { rent: 60000, deposit: 200000, jobsPerDay: 3, indoor: true, needRep: 15 },
    workshop: { rent: 120000, deposit: 500000, jobsPerDay: 4, indoor: true, needRep: 40, racks: true },
    centre: { rent: 260000, deposit: 1200000, jobsPerDay: 5, indoor: true, needRep: 90, racks: true, showroom: true },
  },
  rentEveryDays: 10,
  fuelPerTrip: 1200,
  electricityPerJob: 600,
  machineService: 15000,
  helperWage: 4500,
  helperHire: 30000,
  cleanerWage: 9000,
  cleanerHire: 90000,
  notes: [10000, 5000, 1000, 500],
  rebrandFee: 5000,
  insurance: 8000, // per rent period, covers 70% of damage claims
  calendarStep: 3, // calendar days that pass per working day
  dayStart: 8, dayEnd: 20,
};

export const RANKS = [0, 10, 25, 45, 75, 110, 160]; // total reputation thresholds, 7 ranks

export const SIZES = {
  prayer: { w: 0.7, h: 1.1, cls: 'S' },
  small: { w: 1.2, h: 1.7, cls: 'S' },
  runner: { w: 0.8, h: 2.6, cls: 'M' },
  medium: { w: 1.6, h: 2.3, cls: 'M' },
  large: { w: 2.0, h: 2.9, cls: 'L' },
  hall: { w: 2.5, h: 3.4, cls: 'L' },
};

export const PATTERNS = ['medallion', 'kilim', 'geo', 'prayer', 'stripes', 'bursh', 'floral'];

// Customer archetypes. `track` is the reputation track they feed.
export const ARCHETYPES = {
  budget: { track: 'household', budget: 0.85, patience: 0.8, expect: 65, sizes: ['small', 'medium', 'runner'], mats: ['polypropylene', 'polyester', 'cotton'], weight: 5, minRep: 0 },
  family: { track: 'household', budget: 1.1, patience: 0.5, expect: 75, sizes: ['medium', 'large', 'hall'], mats: ['polypropylene', 'polyester', 'shag', 'wool'], weight: 4, minRep: 0, rush: 0.6 },
  professional: { track: 'household', budget: 1.25, patience: 0.4, expect: 80, sizes: ['small', 'medium', 'large'], mats: ['polyester', 'shag', 'wool'], weight: 3, minRep: 5 },
  repeat: { track: 'community', budget: 1.0, patience: 0.9, expect: 70, sizes: ['prayer', 'small', 'medium'], mats: ['polypropylene', 'cotton', 'polyester'], weight: 3, minRep: 8 },
  collector: { track: 'premium', budget: 2.2, patience: 0.6, expect: 90, sizes: ['prayer', 'small', 'medium'], mats: ['handwoven', 'wool'], weight: 2, minRep: 20 },
  office: { track: 'commercial', budget: 1.4, patience: 0.6, expect: 75, sizes: ['runner', 'large', 'hall'], mats: ['polypropylene', 'polyester'], weight: 2, minRep: 30 },
  hotel: { track: 'commercial', budget: 1.8, patience: 0.5, expect: 85, sizes: ['large', 'hall'], mats: ['wool', 'polyester', 'shag'], weight: 1.5, minRep: 55 },
  mosque: { track: 'community', budget: 1.2, patience: 0.8, expect: 80, sizes: ['runner', 'hall', 'prayer'], mats: ['polypropylene', 'wool'], weight: 1.5, minRep: 35 },
};

export const NAMES = {
  m: ['عثمان', 'الطيب', 'محمد أحمد', 'بكري', 'الصادق', 'عبد الرحيم', 'مجدي', 'هاشم', 'أنور', 'إبراهيم', 'خالد', 'الفاتح'],
  f: ['فاطمة', 'آمنة', 'سلمى', 'إخلاص', 'نفيسة', 'هدى', 'سارة', 'مها', 'زينب', 'رحاب', 'سمية', 'عواطف'],
  mEn: ['Osman', 'Eltayeb', 'Mohamed Ahmed', 'Bakri', 'Elsadig', 'Abdelrahim', 'Magdi', 'Hashim', 'Anwar', 'Ibrahim', 'Khalid', 'Elfatih'],
  fEn: ['Fatima', 'Amna', 'Salma', 'Ikhlas', 'Nafisa', 'Huda', 'Sara', 'Maha', 'Zeinab', 'Rihab', 'Sumaya', 'Awatif'],
};

// Fictional districts (no real addresses). `travel` is hours each way on foot.
export const DISTRICTS = {
  nakheel: { travel: 0.5, minRep: 0 },
  souq: { travel: 0.75, minRep: 0 },
  abraj: { travel: 1.0, minRep: 10 },
  wersha: { travel: 0.75, minRep: 20 },
  daffa: { travel: 1.25, minRep: 30 },
  atraf: { travel: 1.5, minRep: 0 },
};

// Simplified Khartoum-inspired seasons (a game system, not a forecast).
export const SEASONS = {
  cool: { months: [11, 12, 1, 2], temp: 0.9, humid: 0.2, rain: 0, dust: 0.08, demand: 1.0 },
  hot: { months: [3, 4], temp: 1.25, humid: 0.15, rain: 0, dust: 0.18, demand: 0.9 },
  prerain: { months: [5, 6], temp: 1.4, humid: 0.35, rain: 0.08, dust: 0.3, demand: 1.0 },
  rainy: { months: [7, 8, 9, 10], temp: 1.05, humid: 0.75, rain: 0.4, dust: 0.1, demand: 1.25 },
};

export const EVENTS = {
  powercut: { p: 0.1 }, watercut: { p: 0.08 }, discount: { p: 0.08 }, referral: { p: 0.08 },
  puncture: { p: 0.05, needs: 'tuktuk' },
};

export const REQUESTS = ['nochem', 'savewater', 'gentle', 'stainfree', 'dryfast', 'tidy'];

export const SKILLS = {
  fibre: { tree: 'craft', cost: 1 }, // exact fibre shown on inspection
  diagnosis: { tree: 'craft', cost: 1 }, // stain types + best chemistry hint
  acidrinse: { tree: 'craft', cost: 2 }, // unlocks acid rinse
  haggle: { tree: 'business', cost: 1 }, // see the customer's real budget
  marketing: { tree: 'business', cost: 2 }, // +1 booking per day
  suppliers: { tree: 'business', cost: 1 }, // 15% off supplies
  upkeep: { tree: 'ops', cost: 1 }, // machine wears and heats slower
  drying: { tree: 'ops', cost: 2 }, // drying forecast before choosing
};

export const USED_RUG_MARKUP = { buy: 0.35, sell: 1.0 }; // of a clean rug's reference value
export const RUG_VALUE_PER_M2 = 9000;

export const BRAND_DEFAULT = {
  nameAr: 'نسيج الخرطوم', nameEn: 'Khartoum Weave', icon: 0, palette: 0, sign: 0,
};
export const BRAND_PALETTES = [
  ['#1c2452', '#f1e3c6', '#1fa6a0', '#c47a3d'],
  ['#5a1622', '#f6e7cf', '#d4a23a', '#1d3b4f'],
  ['#0f3d3a', '#f3ecd9', '#e08a2c', '#7b2d26'],
  ['#2b2b2b', '#f4efe6', '#c9a24b', '#3d6b8c'],
];
