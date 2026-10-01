import { chromium } from 'playwright';
const OUT='/home/user/Games/playstore/raw/';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader']});
const p=await b.newPage({viewport:{width:430,height:860},deviceScaleFactor:3});
await p.goto('http://localhost:8412/index.html'); await p.waitForTimeout(2000);
const hub=async()=>{ await p.evaluate(()=>goHub()); await p.waitForTimeout(350); };
const open=async(g)=>{ await hub(); await p.evaluate(gg=>document.querySelector(`[data-game="${gg}"]`).click(),g); await p.waitForTimeout(300); };
const local=async()=>{ await p.evaluate(()=>document.getElementById('localBtn').click()); await p.waitForTimeout(400); };
const shot=async n=>{ await p.waitForTimeout(500); await p.screenshot({path:OUT+n+'.png'}); console.log('✔',n); };

await hub(); await shot('hub');

// نط الكلب — لوحة بعد عدة نقلات
await open('nut'); await local();
await p.click('#shapeGrid button:nth-child(1)'); await p.waitForTimeout(250);
await p.click('#shapeGrid button:nth-child(4)'); await p.waitForTimeout(900);
await shot('nut');

// ليدو — أحجار على الرقعة وزهر ظاهر
await open('ludo'); await local(); await p.click('#pgLocalStartBtn'); await p.waitForTimeout(900);
await p.evaluate(()=>{ lu.pos[0]=[6,6,19,-1]; lu.pos[1]=[14,-1,-1,-1]; lu.pos[2]=[31,31,-1,-1]; lu.pos[3]=[45,-1,-1,-1];
  lu.rolled=true; lu.dice=[{v:5,used:false},{v:3,used:false}]; luPaint(); });
await shot('ludo');

// السلم والثعبان
await open('snake'); await local(); await p.click('#pgLocalStartBtn'); await p.waitForTimeout(900);
await p.evaluate(()=>{ sn.pos=[37,63,12,88]; snPaint(); });
await shot('snake');

// أنا مِنو
await open('mn'); await p.evaluate(()=>document.getElementById('aiBtn').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('aiStartBtn').click()); await p.waitForTimeout(1400);
await p.evaluate(()=>{ [...document.querySelectorAll('.mnCard')].slice(0,11).forEach(c=>c.classList.add('out')); });
await shot('mino');

// السيجة الكبرى
await open('seega'); await local(); await p.waitForTimeout(900); await shot('seega');

// صفرجت
await open('sija'); await local(); await p.waitForTimeout(900); await shot('sija');

// شاشة العب ضد الجهاز
await open('nut'); await p.evaluate(()=>document.getElementById('aiBtn').click()); await p.waitForTimeout(500);
await shot('ai');

// كوز جوز
await open('kz'); await p.evaluate(()=>document.getElementById('aiBtn').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('aiStartBtn').click()); await p.waitForTimeout(1600);
await shot('kz');

// ولد بنت جماد نبات
await open('wbjn'); await local(); await p.waitForTimeout(1000); await shot('wbjn');
await b.close();
