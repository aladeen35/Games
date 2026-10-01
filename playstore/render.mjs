import { chromium } from 'playwright';
const OUT='/home/user/Games/playstore/out/';
const S=[
 {img:'hub',  t:'ثماني ألعاب سودانية<br><em>في تطبيق واحد</em>', s:'نط الكلب • صفرجت • السيجة • ليدو • السلم والثعبان • وأكثر', tags:'بلا إعلانات|مجاناً'},
 {img:'ai',   t:'العب <em>ضدّ الجهاز</em>', s:'سبع ألعاب بخصم إلكتروني بثلاثة مستويات — ما محتاج زول معاك', tags:'سهل|متوسط|صعب'},
 {img:'ludo', t:'ليدو <em>بالطريقة السودانية</em>', s:'تختار من زهرة إلى أربع زهرات، والدبل يتحرّك بنصف النتيجة ويسدّ الطريق', tags:'٢ — ٤ لاعبين|زهر ثلاثي الأبعاد'},
 {img:'nut',  t:'نط <em>الكلب</em>', s:'لوحة ٥×٥ و١٢ كلباً لكل لاعب — نُطّ فوق كلب خصمك وكُلو', tags:'لاعبان|عرض 3D'},
 {img:'snake',t:'السلم <em>والثعبان</em>', s:'مئة خانة وسلالم ترفع وثعابين تُنزل — من لاعبَين إلى أربعة', tags:'٢ — ٤ لاعبين'},
 {img:'mino', t:'أنا <em>مِنو</em>', s:'ثلاثون بطاقة وشخصية سرية — اسأل نعم/لا واستبعد وخمّن قبل خصمك', tags:'٣٠ شخصية|٢٨ سؤالاً'},
 {img:'seega',t:'السيجة <em>الكبرى</em>', s:'الشطرنج الشعبي السوداني — احصر حجر خصمك بين حجرين وكُلو', tags:'لاعبان|عرض 3D'},
 {img:'sija', t:'<em>صفرجت</em>', s:'كوّن ثلاثة على خط مستقيم وارفع حجراً من حجارة خصمك', tags:'لاعبان'},
 {img:'kz',   t:'كوز جوز <em>لوز موز</em>', s:'مرّر البطاقات بسرعة — وأول من يجمع أربعة متطابقة يصرخ: أنا فزت!', tags:'٣ — ٤ لاعبين'},
 {img:'wbjn', t:'ولد بنت <em>جماد نبات</em>', s:'حرف عشوائي وستّ فئات وسباق على زرّ ستوب — حتى خمسة لاعبين', tags:'٢ — ٥ لاعبين'},
];
const SIZES=[{w:1080,h:1920,dir:'phone'},{w:1200,h:1920,dir:'tablet7'},{w:1440,h:2304,dir:'tablet10'}];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--force-color-profile=srgb']});
import fs from 'fs';
for(const sz of SIZES){
  fs.mkdirSync(OUT+sz.dir,{recursive:true});
  const p=await b.newPage({viewport:{width:sz.w,height:sz.h}});
  let i=0;
  for(const s of S){
    i++;
    const u='http://localhost:8412/playstore/frame.html?img='+s.img+'&t='+encodeURIComponent(s.t)+'&s='+encodeURIComponent(s.s)+'&tags='+encodeURIComponent(s.tags);
    await p.goto(u);
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForFunction(()=>{const im=document.getElementById('shot');return im.complete&&im.naturalWidth>0;});
    await p.waitForTimeout(260);
    const name=String(i).padStart(2,'0')+'-'+s.img+'.png';
    await p.screenshot({path:OUT+sz.dir+'/'+name});
    if(sz.dir==='phone') console.log('✔',name);
  }
  await p.close();
  console.log('— أُنجز مقاس',sz.dir,sz.w+'×'+sz.h);
}
await b.close();
