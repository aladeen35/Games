(()=>{var kn={polypropylene:{tolerance:.9,release:1,maxPH:12,absorb:.55,dry:1.4,fast:.95,shrink:0,pile:.5,deep:.5,value:1},polyester:{tolerance:.8,release:.95,maxPH:11,absorb:.65,dry:1.2,fast:.9,shrink:0,pile:.65,deep:.6,value:1.1},cotton:{tolerance:.6,release:.85,maxPH:10,absorb:1,dry:.8,fast:.6,shrink:.3,pile:.12,deep:.35,value:1.2},wool:{tolerance:.45,release:.75,maxPH:8.6,absorb:1.2,dry:.6,fast:.55,shrink:.6,pile:.75,deep:.8,value:1.8,delicate:!0},handwoven:{tolerance:.32,release:.7,maxPH:8.2,absorb:1.1,dry:.6,fast:.35,shrink:.5,pile:.4,deep:.6,value:3,delicate:!0},shag:{tolerance:.7,release:.6,maxPH:11,absorb:1.4,dry:.5,fast:.9,shrink:0,pile:1.7,deep:1,value:1.4}},zn=["tea","grease","juice","ink","henna","protein","old"],ks={tea:{color:[.42,.25,.1],heatSets:!1,maxRemove:1},grease:{color:[.3,.27,.16],heatSets:!1,maxRemove:1,warmHelps:!0},juice:{color:[.75,.2,.35],heatSets:!1,maxRemove:1},ink:{color:[.1,.12,.4],heatSets:!1,maxRemove:.95},henna:{color:[.55,.22,.05],heatSets:!0,maxRemove:.85},protein:{color:[.62,.55,.4],heatSets:!0,maxRemove:1},old:{color:[.33,.28,.22],heatSets:!1,maxRemove:.75}},bn=["shampoo","alkaline","enzyme","solvent","oxy","acid"],Yt={shampoo:{ph:7,soil:1,foam:1,dwellOpt:4,dwellMax:1200,price:3e3,unlock:0,compat:{tea:.25,grease:.35,juice:.3,ink:.05,henna:.05,protein:.3,old:.15}},alkaline:{ph:11,soil:1.35,foam:.7,dwellOpt:6,dwellMax:45,price:4500,unlock:0,compat:{tea:.3,grease:.9,juice:.25,ink:.15,henna:.05,protein:.35,old:.4}},enzyme:{ph:8,soil:.5,foam:.2,dwellOpt:14,dwellMax:90,price:6e3,unlock:1,compat:{tea:.5,grease:.3,juice:.3,ink:.02,henna:.05,protein:.95,old:.5}},solvent:{ph:7,soil:.2,foam:0,dwellOpt:5,dwellMax:40,price:7e3,unlock:1,compat:{tea:.05,grease:.8,juice:.05,ink:.9,henna:.3,protein:.05,old:.3}},oxy:{ph:9.5,soil:.6,foam:.3,dwellOpt:10,dwellMax:50,price:6500,unlock:2,compat:{tea:.9,grease:.1,juice:.85,ink:.1,henna:.55,protein:.2,old:.5}},acid:{ph:4.5,soil:0,foam:0,dwellOpt:2,dwellMax:120,price:5e3,unlock:3,rinseAid:!0,compat:{tea:.1,grease:0,juice:.05,ink:0,henna:0,protein:0,old:.05}}},yu=[["oxy","acid"],["alkaline","acid"],["oxy","solvent"]],vu=1e3,on={beater:{slot:"dry",kind:"dry",radius:.16,power:.8,price:0,tier:0},vacuum:{slot:"dry",kind:"dry",radius:.2,power:2.2,price:6e4,tier:1,electric:!0},bucket:{slot:"spray",kind:"spray",radius:.2,flow:.35,rate:1.1,wash:0,price:0,tier:0},hose:{slot:"spray",kind:"spray",radius:.24,flow:.5,rate:1.8,wash:.05,price:35e3,tier:1},washer:{slot:"spray",kind:"spray",radius:.17,flow:.3,rate:1.6,wash:.5,price:22e4,tier:2,electric:!0},chem:{slot:"chem",kind:"chem",radius:.2,rate:1.4,mlps:22,price:0,tier:0},brush:{slot:"brush",kind:"agitate",radius:.13,power:.55,harsh:.55,deep:.25,price:0,tier:0},softbrush:{slot:"brush",kind:"agitate",radius:.15,power:.6,harsh:.25,deep:.25,price:4e4,tier:1},rotary:{slot:"rotary",kind:"agitate",radius:.24,power:1.5,harsh:.85,deep:1,price:18e4,tier:1,electric:!0,machine:!0},squeegee:{slot:"extract",kind:"extract",radius:.2,rate:1.6,floor:.38,price:0,tier:0},wetvac:{slot:"extract",kind:"extract",radius:.2,rate:2.4,floor:.14,price:15e4,tier:1,electric:!0},comb:{slot:"groom",kind:"groom",radius:.22,price:0,tier:0}},Yr=["dry","spray","chem","brush","rotary","extract","groom"],zs={meter:{price:3e4},fans:{price:9e4},trolley:{price:25e3},tuktuk:{price:65e4},generator:{price:26e4},tank:{price:7e4},loupe:{price:2e4}},Ke={startCash:6e4,jobBase:{S:8e3,M:15e3,L:25e3},delicateFee:5e3,rushPct:30,rentDeposit:5e5,premises:{home:{rent:0,deposit:0,jobsPerDay:2,indoor:!1},stall:{rent:6e4,deposit:2e5,jobsPerDay:3,indoor:!0,needRep:15},workshop:{rent:12e4,deposit:5e5,jobsPerDay:4,indoor:!0,needRep:40,racks:!0},centre:{rent:26e4,deposit:12e5,jobsPerDay:5,indoor:!0,needRep:90,racks:!0,showroom:!0}},rentEveryDays:10,fuelPerTrip:1200,electricityPerJob:600,machineService:15e3,helperWage:4500,helperHire:3e4,cleanerWage:9e3,cleanerHire:9e4,notes:[1e4,5e3,1e3,500],rebrandFee:5e3,insurance:8e3,calendarStep:3,dayStart:8,dayEnd:20},Gs=[0,10,25,45,75,110,160],Hs={prayer:{w:.7,h:1.1,cls:"S"},small:{w:1.2,h:1.7,cls:"S"},runner:{w:.8,h:2.6,cls:"M"},medium:{w:1.6,h:2.3,cls:"M"},large:{w:2,h:2.9,cls:"L"},hall:{w:2.5,h:3.4,cls:"L"}},Mu=["medallion","kilim","geo","prayer","stripes","bursh","floral"],Gn={budget:{track:"household",budget:.85,patience:.8,expect:65,sizes:["small","medium","runner"],mats:["polypropylene","polyester","cotton"],weight:5,minRep:0},family:{track:"household",budget:1.1,patience:.5,expect:75,sizes:["medium","large","hall"],mats:["polypropylene","polyester","shag","wool"],weight:4,minRep:0,rush:.6},professional:{track:"household",budget:1.25,patience:.4,expect:80,sizes:["small","medium","large"],mats:["polyester","shag","wool"],weight:3,minRep:5},repeat:{track:"community",budget:1,patience:.9,expect:70,sizes:["prayer","small","medium"],mats:["polypropylene","cotton","polyester"],weight:3,minRep:8},collector:{track:"premium",budget:2.2,patience:.6,expect:90,sizes:["prayer","small","medium"],mats:["handwoven","wool"],weight:2,minRep:20},office:{track:"commercial",budget:1.4,patience:.6,expect:75,sizes:["runner","large","hall"],mats:["polypropylene","polyester"],weight:2,minRep:30},hotel:{track:"commercial",budget:1.8,patience:.5,expect:85,sizes:["large","hall"],mats:["wool","polyester","shag"],weight:1.5,minRep:55},mosque:{track:"community",budget:1.2,patience:.8,expect:80,sizes:["runner","hall","prayer"],mats:["polypropylene","wool"],weight:1.5,minRep:35}},ai={m:["\u0639\u062B\u0645\u0627\u0646","\u0627\u0644\u0637\u064A\u0628","\u0645\u062D\u0645\u062F \u0623\u062D\u0645\u062F","\u0628\u0643\u0631\u064A","\u0627\u0644\u0635\u0627\u062F\u0642","\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u064A\u0645","\u0645\u062C\u062F\u064A","\u0647\u0627\u0634\u0645","\u0623\u0646\u0648\u0631","\u0625\u0628\u0631\u0627\u0647\u064A\u0645","\u062E\u0627\u0644\u062F","\u0627\u0644\u0641\u0627\u062A\u062D"],f:["\u0641\u0627\u0637\u0645\u0629","\u0622\u0645\u0646\u0629","\u0633\u0644\u0645\u0649","\u0625\u062E\u0644\u0627\u0635","\u0646\u0641\u064A\u0633\u0629","\u0647\u062F\u0649","\u0633\u0627\u0631\u0629","\u0645\u0647\u0627","\u0632\u064A\u0646\u0628","\u0631\u062D\u0627\u0628","\u0633\u0645\u064A\u0629","\u0639\u0648\u0627\u0637\u0641"],mEn:["Osman","Eltayeb","Mohamed Ahmed","Bakri","Elsadig","Abdelrahim","Magdi","Hashim","Anwar","Ibrahim","Khalid","Elfatih"],fEn:["Fatima","Amna","Salma","Ikhlas","Nafisa","Huda","Sara","Maha","Zeinab","Rihab","Sumaya","Awatif"]},$r={nakheel:{travel:.5,minRep:0},souq:{travel:.75,minRep:0},abraj:{travel:1,minRep:10},wersha:{travel:.75,minRep:20},daffa:{travel:1.25,minRep:30},atraf:{travel:1.5,minRep:0}},Vs={cool:{months:[11,12,1,2],temp:.9,humid:.2,rain:0,dust:.08,demand:1},hot:{months:[3,4],temp:1.25,humid:.15,rain:0,dust:.18,demand:.9},prerain:{months:[5,6],temp:1.4,humid:.35,rain:.08,dust:.3,demand:1},rainy:{months:[7,8,9,10],temp:1.05,humid:.75,rain:.4,dust:.1,demand:1.25}},cl={powercut:{p:.1},watercut:{p:.08},discount:{p:.08},referral:{p:.08},puncture:{p:.05,needs:"tuktuk"}},Su=["nochem","savewater","gentle","stainfree","dryfast","tidy"],Pi={fibre:{tree:"craft",cost:1},diagnosis:{tree:"craft",cost:1},acidrinse:{tree:"craft",cost:2},haggle:{tree:"business",cost:1},marketing:{tree:"business",cost:2},suppliers:{tree:"business",cost:1},upkeep:{tree:"ops",cost:1},drying:{tree:"ops",cost:2}},bu={buy:.35,sell:1},wu=9e3,Zr={nameAr:"\u0646\u0633\u064A\u062C \u0627\u0644\u062E\u0631\u0637\u0648\u0645",nameEn:"Khartoum Weave",icon:0,palette:0,sign:0},Li=[["#1c2452","#f1e3c6","#1fa6a0","#c47a3d"],["#5a1622","#f6e7cf","#d4a23a","#1d3b4f"],["#0f3d3a","#f3ecd9","#e08a2c","#7b2d26"],["#2b2b2b","#f4efe6","#c9a24b","#3d6b8c"]];function oi(n){let e=n>>>0,t=()=>{e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296};return t.int=i=>Math.floor(t()*i),t.pick=i=>i[Math.floor(t()*i.length)],t.range=(i,s)=>i+t()*(s-i),t.chance=i=>t()<i,t.weighted=(i,s)=>{let r=0;for(let o of i)r+=s(o);let a=t()*r;for(let o of i)if(a-=s(o),a<=0)return o;return i[i.length-1]},t}var mt=(n,e=0,t=1)=>n<e?e:n>t?t:n;var Tu=3,Eu="rugempire.save.v1",vf=864e5,Mf=Date.UTC(2027,0,1);function Kr(n=Date.now()&2147483647){let e={v:Tu,seed:n,rngState:n,cash:0,ledger:[],day:1,hour:Ke.dayStart,rep:{household:0,premium:0,commercial:0,community:0},xp:0,level:0,sp:0,skills:{},tools:{beater:1,bucket:1,chem:1,brush:1,squeegee:1,comb:1},gear:{},stock:{shampoo:1e3,alkaline:300},machine:{cond:1},premises:"home",rentDue:0,missedRent:0,insured:!1,staff:{},brand:{...Zr},orders:[],jobNo:0,rugs:[],market:[],offers:[],sandouq:null,today:{events:[],weather:"clear"},news:[],stats:{jobs:0,perfect:0,earned:0,damaged:0,sold:0,water:0,bestScore:0},ach:{},tutorial:0};return Pt(e,"start",Ke.startCash,"capital"),Ru(e,!0),e}function Pt(n,e,t,i=""){if(!Number.isInteger(t))throw new Error("SDG amounts must be integers");return n.cash+t<0?!1:(n.cash+=t,n.ledger.push({d:n.day,t:e,a:t,b:n.cash,r:i}),n.ledger.length>300&&n.ledger.splice(0,n.ledger.length-300),t>0&&e!=="start"&&e!=="sandouq"&&(n.stats.earned+=t),!0)}function hl(n){let e=oi(n.rngState);return n.rngState=n.rngState*1664525+1013904223>>>0,e}var li=n=>Math.max(0,n.rep.household+n.rep.premium+n.rep.commercial+n.rep.community);function Ws(n){let e=li(n),t=0;for(let i=0;i<Gs.length;i++)e>=Gs[i]&&(t=i);return t}var nn=(n,e)=>!!(n.tools[e]||n.gear[e]),ln=(n,e)=>!!n.skills[e];function ci(n){return new Date(Mf+(n-1)*Ke.calendarStep*vf)}var ul;function Qr(n){try{ul||(ul=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric",day:"numeric",year:"numeric",timeZone:"UTC"}));let e={};for(let t of ul.formatToParts(n))e[t.type]=parseInt(t.value,10);if(e.month)return{y:e.year,m:e.month,d:e.day}}catch{}return{y:1448,m:1,d:1}}function Di(n){let e=ci(n).getUTCMonth()+1;for(let t in Vs)if(Vs[t].months.includes(e))return t;return"cool"}function Xs(n){let e=Qr(ci(n));return e.m===9&&e.d>=15?"preEid":e.m===9?"ramadan":e.m===10&&e.d<=3?"eid":e.m===12&&e.d<=9?"preAdha":e.m===12&&e.d<=13?"eid":null}function Au(n){let e=Vs[Di(n.day)],t=n.today.weather;return{season:Di(n.day),weather:t,temp:e.temp*(t==="rain"?.85:1),humid:t==="rain"?.9:e.humid,indoor:Ke.premises[n.premises].indoor,power:!n.today.events.includes("powercut")||nn(n,"generator"),water:!n.today.events.includes("watercut")||nn(n,"tank")}}function Ru(n,e=!1){let t=hl(n),i=Vs[Di(n.day)];if(n.hour=Ke.dayStart,n.today={events:[],weather:t.chance(i.rain)?"rain":t.chance(i.dust)?"dust":"clear"},!e)for(let o in cl){let c=cl[o];(!c.needs||nn(n,c.needs))&&t.chance(c.p)&&n.today.events.push(o)}let s=Xs(n.day),r=i.demand*(s==="preEid"||s==="preAdha"?1.7:s==="ramadan"?.8:1)*(n.today.events.includes("referral")?1.5:1);n.orders=n.orders.filter(o=>(o.expires-=1)>0);let a=Math.round((Ke.premises[n.premises].jobsPerDay+(ln(n,"marketing")?1:0))*r*mt(.85+li(n)/150,.5,1.3));e&&(a=2);for(let o=0;o<a&&n.orders.length<7;o++)n.orders.push(Sf(n,t,e&&o===0));if(n.market=[],n.premises!=="home")for(let o=0;o<2+(s?1:0);o++)n.market.push(bf(n,t));n.offers=[];for(let o of n.rugs)if(o.status==="for-sale"){let c=qs(n,o),l=o.price/c,u=(Ke.premises[n.premises].showroom?.6:.35)*(s?1.4:1);if(!t.chance(u))continue;l<=.9||t.chance(mt(1.5-l))?n.offers.push({rugId:o.id,price:o.price,buyer:t.int(12),g:t.chance(.5)?"m":"f"}):l<1.6&&n.offers.push({rugId:o.id,price:Math.round(Math.min(o.price,c)*t.range(.8,.95)/500)*500,buyer:t.int(12),g:t.chance(.5)?"m":"f",haggle:!0})}}function Cu(n,e={}){let t=e.size||n.pick(Object.keys(Hs)),i=Hs[t],s=e.material||n.pick(Object.keys(kn)),r=e.stains??n.weighted([0,1,2,3],c=>[2,4,3,1][c]),a=[];for(let c=0;c<r;c++)a.push({type:n.weighted(zn,l=>l==="tea"||l==="grease"?3:l==="old"||l==="henna"?1:2),u:n.range(.15,.85),v:n.range(.12,.88),r:n.range(.14,.28),sev:n.range(.55,1)});let o={handwoven:.5,wool:.3,cotton:.25}[s]??.03;return{seed:n.int(1e9),sizeKey:t,w:i.w,h:i.h,material:s,pattern:e.pattern||(t==="prayer"?"prayer":n.pick(Mu)),dust:n.range(.25,.9),soil:n.range(.3,.85),deep:n.range(.15,.7),stains:a,unstable:n.chance(o)}}function Sf(n,e,t=!1){let i=li(n),s=t?"budget":e.weighted(Object.keys(Gn).filter(b=>Gn[b].minRep<=i),b=>Gn[b].weight),r=Gn[s],a=Cu(e,t?{size:"small",material:"polypropylene",stains:1}:{size:e.pick(r.sizes),material:e.pick(r.mats)});t&&(a.unstable=!1,a.stains[0].type="tea");let o=kn[a.material],c=Hs[a.sizeKey].cls,l=Xs(n.day),u=!t&&e.chance((r.rush||.15)+(l==="preEid"||l==="preAdha"?.35:0)),h=Ke.jobBase[c]+(o.delicate?Ke.delicateFee:0)+a.stains.length*800;h=Math.round(h*r.budget*(u?1+Ke.rushPct/100:1)/500)*500;let f=[];if(!t){let b=Su.filter(p=>(p!=="stainfree"||a.stains.length)&&(p!=="dryfast"||u));if(o.delicate&&e.chance(.6)&&f.push("gentle"),e.chance(.55)){let p=e.pick(b);f.includes(p)||f.push(p)}}let d=a.w*a.h,x=Object.keys($r).filter(b=>$r[b].minRep<=i);return{id:++n.jobNo,arch:s,g:e.chance(.5)?"m":"f",name:e.int(12),district:t?"nakheel":e.pick(x),spec:a,rush:u,fair:h,maxBudget:Math.round(h*e.range(1.05,1.35)/500)*500,requests:f,deadline:u?8:30,expires:u?1:3,par:dl(a),waterBudget:Math.round(d*9),value:Iu(a),price:0,inspected:!1,tested:!1}}function dl(n){return Math.round(n.w*n.h*60+n.stains.length*15+40)}function Iu(n){return Math.round(n.w*n.h*wu*kn[n.material].value/500)*500}function fl(n,e,t,i=!1){let s=Gn[e.arch],r=oi(e.id*7919+t+(i?13:0));if(t<=e.maxBudget)return{result:"accept",price:t};let a=t/e.maxBudget-1;if(i){let o=mt(s.patience*.6+li(n)/200-a*2.2);return r.chance(o)?{result:"accept",price:t}:{result:"leave"}}return a>.15&&r.chance(Math.min(.85,a*(1.6-s.patience)))?{result:"leave"}:{result:"counter",price:Math.round(e.fair*.95/500)*500}}function Jr(n,e){if(e.own||n.premises!=="home"&&!nn(n,"tuktuk"))return 0;let t=nn(n,"tuktuk")?.35:nn(n,"trolley")?.8:1;return Math.round($r[e.district].travel*2*t*(n.today.events.includes("puncture")?2:1)*4)/4}function Pu(n,e,t,i,s,r){let a=Gn[e.arch];for(let h in r.chemMl)n.stock[h]=Math.max(0,Math.round((n.stock[h]||0)-r.chemMl[h]));n.stats.water+=Math.round(r.waterL),r.machine&&(n.machine.cond=Math.max(0,n.machine.cond-(ln(n,"upkeep")?.012:.025))),n.hour+=Jr(n,e)+Math.max(.75,i/100),nn(n,"tuktuk")&&Jr(n,e)>0&&Pt(n,"fuel",-Math.min(n.cash,Ke.fuelPerTrip),"#"+e.id),r.electric&&Pt(n,"power",-Math.min(n.cash,Ke.electricityPerJob),"#"+e.id);let o=0,c=0,l=0;if(e.own){let h=n.rugs.find(f=>f.id===e.rugId);h&&(h.clean=!0,h.score=t.total,h.stars=t.stars,h.status="gallery",h.damaged=t.damaged)}else{let h=t.damaged?0:t.total>=70?100:t.total>=55?60:30;o=Math.round(e.price*h/100/500)*500,t.total>=85&&(l=Math.round(e.price*(t.total>=95?.15:.08)/500)*500),t.damaged&&(c=Math.round(e.value*.5*(n.insured?.3:1)/500)*500,n.stats.damaged++);let f=mt((t.total-a.expect)/(t.total<a.expect?5:8),-5,3.5)-(t.damaged?3:0)+(t.total>=70?.3:0);n.rep[a.track]=Math.max(-5,n.rep[a.track]+f)}n.stats.jobs++,t.total>=95&&n.stats.perfect++,n.stats.bestScore=Math.max(n.stats.bestScore,t.total),n.xp+=t.total;let u=!1;for(;n.xp>=150*(n.level+1);)n.xp-=150*(n.level+1),n.level++,n.sp++,u=!0;return n.orders=n.orders.filter(h=>h.id!==e.id),{pay:o,tip:l,claim:c,leveled:u,dryHours:s}}function jr(n,e,t){t.pay+t.tip>0&&Pt(n,"job",t.pay+t.tip,"#"+e.id),t.claim>0&&Pt(n,"claim",-Math.min(n.cash,t.claim),"#"+e.id)}function Lu(n){let e={wages:0,staffIncome:0,rent:0,evicted:!1,sandouq:0,payout:0,insurance:0},t=hl(n);for(let i of["helper","cleaner"])if(n.staff[i]){let s=Ke[i+"Wage"];if(Pt(n,"wage",-s,i)){e.wages+=s;let r=n.staff[i],a=mt(r.skill+t.range(-8,8),40,96),o=Math.round(Ke.jobBase[i==="helper"?"S":"M"]*(a>=70?1:.7)/500)*500;Pt(n,"staffjob",o,i),e.staffIncome+=o,n.rep.household=Math.max(-5,n.rep.household+(a-72)/40),r.skill=Math.min(92,r.skill+.4)}else delete n.staff[i],e.quit=i}if(n.day++,n.premises!=="home"&&n.day>=n.rentDue){let i=Ke.premises[n.premises];if(Pt(n,"rent",-i.rent,n.premises))e.rent=i.rent,n.missedRent=0;else if(++n.missedRent>=2){n.premises="home",n.staff={},n.missedRent=0,e.evicted=!0;for(let s of n.rugs)s.status==="for-sale"&&(s.status="gallery")}else e.rentMissed=!0;if(n.rentDue=n.day+Ke.rentEveryDays,n.insured&&(Pt(n,"insurance",-Ke.insurance,"")?e.insurance=Ke.insurance:n.insured=!1),n.sandouq&&n.sandouq.paid<n.sandouq.members){let s=n.sandouq;Pt(n,"sandouq",-s.share,"share "+(s.paid+1))?(s.paid++,e.sandouq=s.share):s.missed=(s.missed||0)+1,s.paid===s.turn&&!s.received&&(Pt(n,"sandouq",s.share*s.members,"payout"),s.received=!0,e.payout=s.share*s.members),s.paid>=s.members&&(n.sandouq=null)}}return Ru(n),e}function pl(n,e){return Math.round(Yt[e].price*(ln(n,"suppliers")?.85:1)*(n.today.events.includes("discount")?.75:1)/50)*50}function Ji(n,e){return n.level>=Yt[e].unlock&&(e!=="acid"||ln(n,"acidrinse"))}function Du(n,e){return!Ji(n,e)||!Pt(n,"supplies",-pl(n,e),e)?!1:(n.stock[e]=(n.stock[e]||0)+vu,!0)}function ml(n,e){let t=on[e]||zs[e];return!t||nn(n,e)||!Pt(n,"equipment",-t.price,e)?!1:(on[e]?n.tools[e]=1:n.gear[e]=1,!0)}function Nu(n){return Pt(n,"service",-Ke.machineService,"rotary")?(n.machine.cond=1,!0):!1}function Uu(n,e){let t=Ke.premises[e];return!t||e===n.premises||li(n)<(t.needRep||0)||!Pt(n,"deposit",-(t.deposit+t.rent),e)?!1:(n.premises=e,n.rentDue=n.day+Ke.rentEveryDays,n.missedRent=0,!0)}function Fu(n,e){return n.staff[e]||!Ke.premises[n.premises].racks||!Pt(n,"hire",-Ke[e+"Hire"],e)?!1:(n.staff[e]={skill:e==="helper"?62:76},!0)}function Ou(n,e){let t=Pi[e];return!t||n.skills[e]||n.sp<t.cost?!1:(n.sp-=t.cost,n.skills[e]=1,!0)}function Bu(n,e=5e4){if(n.sandouq||n.premises==="home")return!1;let t=hl(n);return n.sandouq={share:e,members:6,paid:0,turn:2+t.int(3),received:!1},!0}function ku(n){return n.insured=!n.insured,n.insured}function zu(n,e,t=!1){return!t&&!Pt(n,"brand",-Ke.rebrandFee,"rebrand")?!1:(n.brand={...n.brand,...e},!0)}function bf(n,e){let t=Cu(e);t.dust=Math.max(t.dust,.6),t.soil=Math.max(t.soil,.55);let i=Iu(t);return{id:"u"+n.day+"-"+e.int(1e6),spec:t,value:i,cost:Math.round(i*bu.buy*e.range(.8,1.2)/500)*500}}function Gu(n,e){let t=n.market.findIndex(s=>s.id===e);if(t<0)return!1;let i=n.market[t];return Pt(n,"stock",-i.cost,i.id)?(n.market.splice(t,1),n.rugs.push({id:i.id,spec:i.spec,value:i.value,cost:i.cost,clean:!1,status:"stock",ownership:"owned",day:n.day}),!0):!1}function qs(n,e){let t=Xs(n.day),i=e.damaged?.4:.55+(e.score||0)/100*.65;return Math.round(e.value*i*(t==="preEid"||t==="preAdha"?1.2:1)/500)*500}function gl(n,e,t){let i=n.rugs.find(s=>s.id===e);return!i||!i.clean||i.ownership!=="owned"||i.status==="sold"||!Number.isInteger(t)||t<=0?!1:(i.status="for-sale",i.price=t,!0)}function Hu(n,e){let t=n.offers[e];if(!t)return!1;let i=n.rugs.find(s=>s.id===t.rugId);return!i||i.status!=="for-sale"?!1:(Pt(n,"sale",t.price,i.id),i.status="sold",i.soldFor=t.price,n.stats.sold++,n.offers=n.offers.filter(s=>s.rugId!==t.rugId),n.rep.premium+=.3,!0)}function Vu(n,e){try{return e.setItem(Eu,JSON.stringify(n)),!0}catch{return!1}}function Wu(n){let e;try{e=n.getItem(Eu)}catch{return null}if(!e)return null;try{return wf(JSON.parse(e))}catch{return null}}function wf(n){if(!n||typeof n!="object"||!Number.isInteger(n.cash)||!Array.isArray(n.ledger))return null;let e=Kr(n.seed||1);for(let t in e)n[t]===void 0&&(n[t]=e[t]);for(let t in e.stats)n.stats[t]===void 0&&(n.stats[t]=e.stats[t]);for(let t in e.rep)typeof n.rep[t]!="number"&&(n.rep[t]=0);return n.v=Tu,n}var Hn=28,Ef=["dust","soil","deep","stain","setf","wet","soap","foam","slurry","stress","bleed","heat","dwell","pass","napX","napY"];function Xu(n,e,t){let i=new Float32Array(e*t);for(let s=0;s<i.length;s++)i[s]=n();return(s,r)=>{let a=s*(e-1),o=r*(t-1),c=Math.floor(a),l=Math.floor(o),u=Math.min(e-1,c+1),h=Math.min(t-1,l+1),f=a-c,d=o-l,x=i[l*e+c],b=i[l*e+u],p=i[h*e+c],m=i[h*e+u];return(x+(b-x)*f)*(1-d)+(p+(m-p)*f)*d}}function Ys(n){let e=Math.max(8,Math.round(n.w*Hn)),t=Math.max(8,Math.round(n.h*Hn)),i=e*t,s={spec:n,W:e,H:t,n:i,mat:kn[n.material],time:0,shrink:0,diffuseT:0,stainType:new Uint8Array(i),chem:new Uint8Array(i),stats:{waterL:0,spillL:0,chemMl:{},strokes:0,hot:!1,harshChem:!1}};for(let l of Ef)s[l]=new Float32Array(i);let r=oi(n.seed),a=Xu(r,6,8),o=Xu(r,14,18),c=r();for(let l=0;l<t;l++)for(let u=0;u<e;u++){let h=l*e+u,f=u/(e-1),d=l/(t-1),x=a(f,d)*.65+o(f,d)*.35,b=Math.exp(-Math.pow((f-.25-c*.5)*3,2));s.dust[h]=mt(n.dust*(.55+x*.9)),s.soil[h]=mt(n.soil*(.3+x*.6+b*.6)),s.deep[h]=mt(n.deep*s.mat.deep*(.3+b*.7+x*.3));let p=r()*6.283;s.napX[h]=Math.cos(p)*.6,s.napY[h]=Math.sin(p)*.6}for(let l of n.stains||[]){let u=zn.indexOf(l.type)+1,h=3+Math.floor(r()*3);for(let f=0;f<h;f++){let d=(l.u+(r()-.5)*l.r*.9/n.w)*(e-1),x=(l.v+(r()-.5)*l.r*.9/n.h)*(t-1),b=l.r*Hn*(.45+r()*.55);Ni(s,d,x,b,(p,m)=>{let y=l.sev*Math.min(1,m*2.2);y>s.stain[p]&&(s.stain[p]=y,s.stainType[p]=u)})}}return s.initial=Vn(s),s}function Ni(n,e,t,i,s){let r=Math.max(0,Math.floor(e-i)),a=Math.min(n.W-1,Math.ceil(e+i)),o=Math.max(0,Math.floor(t-i)),c=Math.min(n.H-1,Math.ceil(t+i)),l=i*i;for(let u=o;u<=c;u++)for(let h=r;h<=a;h++){let f=(h-e)*(h-e)+(u-t)*(u-t);f<l&&s(u*n.W+h,1-f/l,h,u)}}function xl(n,e){let t={};for(let i=0;i<n.n;i+=3)n.soap[i]>.15&&n.chem[i]&&(t[n.chem[i]]=(t[n.chem[i]]||0)+1);for(let[i,s]of yu){let r=i===e?s:s===e?i:null;if(r&&(t[bn.indexOf(r)+1]||0)>n.n/3*.02)return r}return null}function qu(n,e,t,i,s,r={}){let a=t*Hn,o=i*Hn,c=e.radius*Hn,l=n.mat,u=n.stats,h=r.pressure??.6,f=r.dx||0,d=r.dy||0,x=Math.hypot(f,d);x>1e-6&&(f/=x,d/=x);let b=mt((Math.min(a+c,n.W)-Math.max(a-c,0))/(2*c))*mt((Math.min(o+c,n.H)-Math.max(o-c,0))/(2*c));if(u.strokes+=s,e.kind==="dry")Ni(n,a,o,c,(p,m)=>{let y=n.wet[p]<.15?1:.08;n.dust[p]=Math.max(0,n.dust[p]-e.power*m*s*2.6*y),n.pass[p]+=m*s*.3});else if(e.kind==="spray"){let p=r.temp||0;u.waterL+=e.flow*s,u.spillL+=e.flow*s*(1-b),p===2&&(u.hot=!0),Ni(n,a,o,c,(m,y)=>{let w=e.rate*y*s;if(n.wet[m]=Math.min(1.5,n.wet[m]+w),n.dust[m]>.001){let C=Math.min(n.dust[m],w*4);n.dust[m]-=C,n.soil[m]=Math.min(1,n.soil[m]+C*.9)}let M=1-Math.min(.9,w*1.3);if(n.soap[m]*=M,n.slurry[m]*=M,n.foam[m]*=1-Math.min(.9,w*1.2),e.wash){let C=Math.min(n.soil[m],e.wash*y*s*l.release);n.soil[m]-=C,n.slurry[m]=Math.min(1,n.slurry[m]+C);let E=e.wash*1.5-l.tolerance;E>0&&(n.stress[m]=Math.min(1,n.stress[m]+E*y*s*.35))}p&&(n.heat[m]=Math.max(n.heat[m],p===2?1:.5))})}else if(e.kind==="chem"){let p=bn.indexOf(r.chem)+1;if(!p)return;let m=Yt[r.chem];u.chemMl[r.chem]=(u.chemMl[r.chem]||0)+e.mlps*s,m.ph>9&&(u.harshChem=!0),Ni(n,a,o,c,(y,w)=>{n.chem[y]!==p&&(n.chem[y]=p,n.dwell[y]=0,n.soap[y]*=.5),n.soap[y]=Math.min(1,n.soap[y]+e.rate*w*s),n.wet[y]=Math.min(1.5,n.wet[y]+.12*w*s)})}else if(e.kind==="agitate"){let p=r.fast?1.3:1,m=e.harsh*(r.fast?1.2:1)*(.4+h*.6);Ni(n,a,o,c,(y,w,M,C)=>{let E=Math.min(1,n.wet[y]*2),_=Math.min(1,n.soap[y]*1.6),T=n.chem[y]?Yt[bn[n.chem[y]-1]]:null,N=e.power*p*(.35+h*.9)*w*s,I=Math.min(n.soil[y],N*(.015+.985*E*(.2+.8*_*(T?T.soil:0)))*l.release*3.4);n.soil[y]-=I;let F=Math.min(n.deep[y],N*e.deep*E*_*(T?T.soil:0)*1.6);n.deep[y]-=F;let O=0;if(n.stain[y]>n.setf[y]&&T&&n.stainType[y]){let L=zn[n.stainType[y]-1],W=ks[L],Z=mt(n.dwell[y]/T.dwellOpt,.2,1),Y=W.warmHelps&&n.heat[y]>.3?1.4:1;O=Math.min(n.stain[y]-n.setf[y],N*T.compat[L]*Z*E*_*Y*6),n.stain[y]-=O}n.slurry[y]=Math.min(1,n.slurry[y]+(I+F+O)*.6),T&&(n.foam[y]=Math.min(1,n.foam[y]+N*_*E*T.foam*5)),n.dust[y]>0&&E<.15&&(n.dust[y]=Math.max(0,n.dust[y]-N*.15));let q=m-l.tolerance*(E>.25?1:.6);if(q>0&&(n.stress[y]=Math.min(1,n.stress[y]+q*w*s*1.2)),n.pass[y]+=w*s,e.machine){let L=M-a,W=C-o,Z=Math.hypot(L,W)||1;n.napX[y]+=(-W/Z-n.napX[y])*Math.min(1,w*s*6),n.napY[y]+=(L/Z-n.napY[y])*Math.min(1,w*s*6)}else x>1e-6&&(n.napX[y]+=(f-n.napX[y])*Math.min(1,w*s*8),n.napY[y]+=(d-n.napY[y])*Math.min(1,w*s*8))})}else e.kind==="extract"?Ni(n,a,o,c,(p,m)=>{let y=n.wet[p];if(y<=e.floor){_l(n,p,f,d,m,s,x);return}let w=Math.max(e.floor,y-e.rate*(.5+h*.7)*m*s),M=(y-w)/y;n.wet[p]=w,n.slurry[p]*=1-M,n.soap[p]*=1-M*.85,n.foam[p]*=1-Math.min(1,M*2.5),n.bleed[p]<.3&&(n.bleed[p]*=1-M*.6),_l(n,p,f,d,m,s,x)}):e.kind==="groom"&&Ni(n,a,o,c,(p,m)=>_l(n,p,f,d,m*1.5,s,x))}function _l(n,e,t,i,s,r,a){if(a<1e-6)return;let o=Math.min(1,s*r*9);n.napX[e]+=(t-n.napX[e])*o,n.napY[e]+=(i-n.napY[e])*o}function Yu(n,e){let t=n.mat,i=n.spec.unstable;n.time+=e;let s=Math.exp(-e*.12),r=Math.exp(-e/25),a=0;for(let o=0;o<n.n;o++){n.foam[o]*=s,n.heat[o]*=r;let c=n.wet[o];if(c>.1&&n.soap[o]>.05&&n.chem[o]){n.dwell[o]+=e;let l=Yt[bn[n.chem[o]-1]];if(n.dwell[o]>l.dwellMax&&(n.stress[o]=Math.min(1,n.stress[o]+e*.0025*n.soap[o]*(l.ph>8?1.5:1))),l.ph>t.maxPH){let u=(l.ph-t.maxPH)*n.soap[o];n.stress[o]=Math.min(1,n.stress[o]+u*e*.004),n.bleed[o]=Math.min(1,n.bleed[o]+u*(1-t.fast)*e*(i?.03:.008))}l.rinseAid&&n.bleed[o]<.5&&(n.bleed[o]=Math.max(0,n.bleed[o]-e*.01))}n.heat[o]>.7&&c>.2?(a++,n.stainType[o]&&ks[zn[n.stainType[o]-1]].heatSets&&(n.setf[o]=Math.min(n.stain[o],n.setf[o]+e*.25*n.stain[o])),n.bleed[o]=Math.min(1,n.bleed[o]+(1-t.fast)*e*(i?.05:.006))):i&&c>.6&&(n.bleed[o]=Math.min(1,n.bleed[o]+(1-t.fast)*e*.0012))}t.shrink&&a&&(n.shrink=Math.min(1,n.shrink+t.shrink*(a/n.n)*e*.03)),n.diffuseT+=e,n.diffuseT>.3&&(n.diffuseT=0,$u(n,n.bleed,.18,.2))}function $u(n,e,t,i){let{W:s,H:r,wet:a}=n;for(let o=1;o<r-1;o++)for(let c=1;c<s-1;c++){let l=o*s+c;if(a[l]<i)continue;let u=Math.max(e[l-1],e[l+1],e[l-s],e[l+s]);u>e[l]&&(e[l]+=(u-e[l])*t*.5)}}function yl(n,e){let t=Vn(n),i={sun:1.7,shade:1,fans:2.3,rack:1.5}[e.method]||1,s=e.temp*(1-e.humid*.65);return Math.max(.5,t.wet*n.mat.absorb*16/(i*s*n.mat.dry))}function vl(n,e,t,i){let s=1/(i-t),{W:r,H:a}=n,o=e.hours??yl(n,e);for(let c=0;c<a;c++)for(let l=0;l<r;l++){let u=c*r+l,h=Math.min(l,c,r-1-l,a-1-c)<3?1.6:1,f=n.wet[u],d=Math.max(0,f*(1-Math.min(1,s*h))),x=f-d,b=Math.min(n.deep[u],n.deep[u]*x*.75);n.deep[u]-=b,n.soil[u]=Math.min(1,n.soil[u]+b*.9);let p=n.slurry[u]*Math.min(1,s);n.slurry[u]-=p,n.soil[u]=Math.min(1,n.soil[u]+p*.75),n.foam[u]*=.5,n.spec.unstable&&f>.5&&o>8&&(n.bleed[u]=Math.min(1,n.bleed[u]+(1-n.mat.fast)*.02)),n.wet[u]=d}if(e.method==="sun"&&n.mat.fast<.5&&o>6&&(n.fade=Math.min(1,(n.fade||0)+.25/i)),e.dust&&t===i-1)for(let c=0;c<n.n;c++)n.dust[c]=Math.min(1,n.dust[c]+e.dust*.6);$u(n,n.bleed,.2,.3)}function Vn(n){let e={dust:0,soil:0,deep:0,stain:0,wet:0,soap:0,slurry:0,stress:0,bleed:0,foam:0,maxStress:0,dirt:0,edgeDirt:0,napX:0,napY:0,stainCells:0},{W:t,H:i,n:s}=n,r=0,a=4,o=6,c=new Float32Array(a*o),l=new Float32Array(a*o);for(let h=0;h<i;h++)for(let f=0;f<t;f++){let d=h*t+f;e.dust+=n.dust[d],e.soil+=n.soil[d],e.deep+=n.deep[d],e.stain+=n.stain[d],e.wet+=n.wet[d],e.soap+=n.soap[d],e.slurry+=n.slurry[d],e.stress+=n.stress[d],e.bleed+=n.bleed[d],e.foam+=n.foam[d],e.napX+=n.napX[d],e.napY+=n.napY[d],n.stress[d]>e.maxStress&&(e.maxStress=n.stress[d]),n.stain[d]>.12&&e.stainCells++;let x=Math.min(1,n.dust[d]+n.soil[d]+n.stain[d]*1.2);e.dirt+=x;let b=Math.min(o-1,Math.floor(h/i*o))*a+Math.min(a-1,Math.floor(f/t*a));c[b]+=x,l[b]++,Math.min(f,h,t-1-f,i-1-h)<3&&(e.edgeDirt+=x,r++)}for(let h of["dust","soil","deep","stain","wet","soap","slurry","stress","bleed","foam","dirt","napX","napY"])e[h]/=s;e.edgeDirt/=r||1,e.stainCells/=s;let u=0;for(let h=0;h<c.length;h++)u=Math.max(u,c[h]/(l[h]||1));return e.worstRegion=u,e.nap=Math.hypot(e.napX,e.napY),e.shrink=n.shrink,e.fade=n.fade||0,e}function Ml(n){let e=Vn(n);return mt(1-e.dirt/Math.max(.02,n.initial.dirt))}function Zu(n,e,t){let i=Vn(n),s=n.initial,r=mt(i.dirt/Math.max(.02,s.dirt)),a=s.stain>.002?mt(i.stain/s.stain):0,o=30*mt(1-r*.8-a*.35)**1.3,c=mt(i.stress*4+i.maxStress*.35+i.bleed*7+i.shrink*2.5+i.fade*.8),l=20*(1-c),h=15*(1-mt((i.worstRegion-i.dirt)*3.5+Math.max(0,i.edgeDirt-i.dirt)*2.5))*mt(1.15-r),f=mt(10*(1-mt((e.wet-.3)/.6))-mt(e.soap*12)*5-mt(e.slurry*10)*3,0,10),d=n.time/Math.max(1,t.par)-1,x=mt(10*(1-mt(d))-(t.late?5:0),0,10),b=10,p=[];for(let C of t.requests||[]){let E=!0;C==="nochem"?E=!n.stats.harshChem:C==="savewater"?E=n.stats.waterL<=t.waterBudget:C==="gentle"?E=i.stress<.01&&!n.stats.hot:C==="stainfree"?E=a<.12:C==="dryfast"?E=!t.late&&e.wet<.45:C==="tidy"&&(E=n.stats.spillL<3),E||(b-=10/t.requests.length,p.push(C))}let m=mt(5-mt(n.stats.spillL/12)*4-(1-mt(i.nap*1.4))*1.5,0,5),y=o+l+h+f+x+b+m;l<8?y=Math.min(y,54):l<14&&(y=Math.min(y,69)),y=Math.round(mt(y,0,100));let w=y>=95?5:y>=85?4:y>=70?3:y>=55?2:1,M=C=>Math.round(C*10)/10;return{total:y,stars:w,clean:M(o),safety:M(l),coverage:M(h),moisture:M(f),time:M(x),instr:M(Math.max(0,b)),site:M(m),failed:p,remain:r,stainLeft:a,harm:c,damaged:l<8,m:i}}var wh=0,Ql=1,Th=2;var Hi=1,Eh=2,Ts=3,bi=0,tn=1,Nn=2,Vi=0,Es=1,jl=2,ec=3,tc=4,Ah=5;var Wi=100,Rh=101,Ch=102,Ih=103,Ph=104,Lh=200,Dh=201,Nh=202,Uh=203,nc=204,ic=205,Fh=206,Oh=207,Bh=208,kh=209,zh=210,Gh=211,Hh=212,Vh=213,Wh=214,wa=0,Ta=1,Ea=2,hs=3,Aa=4,Ra=5,Ca=6,Ia=7,sc=0,Xh=1,qh=2,Un=0,rc=1,ac=2,oc=3,Er=4,lc=5,cc=6,uc=7;var hc=300,Xi=301,As=302,ja=303,eo=304,ds=1e3,Pn=1001,Pa=1002,Gt=1003,Yh=1004;var Ar=1005;var Wt=1006,to=1007;var ei=1008;var rn=1009,dc=1010,fc=1011,Rs=1012,no=1013,An=1014,Rn=1015,Cn=1016,io=1017,so=1018,qi=1020,pc=35902,mc=35899,gc=1021,_c=1022,gn=1023,Jn=1026,ti=1027,xc=1028,ro=1029,wi=1030,ao=1031;var oo=1033,Rr=33776,Cr=33777,Ir=33778,Pr=33779,lo=35840,co=35841,uo=35842,ho=35843,fo=36196,po=37492,mo=37496,go=37488,_o=37489,Lr=37490,xo=37491,yo=37808,vo=37809,Mo=37810,So=37811,bo=37812,wo=37813,To=37814,Eo=37815,Ao=37816,Ro=37817,Co=37818,Io=37819,Po=37820,Lo=37821,Do=36492,No=36494,Uo=36495,Fo=36283,Oo=36284,Dr=36285,Bo=36286;var tr=2300,La=2301,Sa=2302,Hl=2303,Vl=2400,Wl=2401,Xl=2402;var $h=3200;var ko=0,Zh=1,ni="",zt="srgb",nr="srgb-linear",ir="linear",gt="srgb";var ba=7680;var Jh=519,Kh=512,Qh=513,jh=514,yc=515,ed=516,td=517,vc=518,Mc=519,nd=35044;var Sc="300 es",vn=2e3,fs=2001;function Af(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Rf(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function sr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function id(){let n=sr("canvas");return n.style.display="block",n}var Ju={},ps=null;function bc(...n){let e="THREE."+n.shift();ps?ps("log",e,...n):console.log(e,...n)}function sd(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ge(...n){n=sd(n);let e="THREE."+n.shift();if(ps)ps("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ve(...n){n=sd(n);let e="THREE."+n.shift();if(ps)ps("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Qs(...n){let e=n.join(" ");e in Ju||(Ju[e]=!0,Ge(...n))}function rd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var ad={[wa]:wa,[Ea]:Ca,[Aa]:Aa,[hs]:Ra,[Ta]:Ta,[Ca]:Ea,[Ia]:Ia,[Ra]:hs},Ln=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},$t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ku=1234567,js=Math.PI/180,ki=180/Math.PI;function Cs(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]).toLowerCase()}function at(n,e,t){return Math.max(e,Math.min(t,n))}function wc(n,e){return(n%e+e)%e}function Cf(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function If(n,e,t){return n!==e?(t-n)/(e-n):0}function er(n,e,t){return(1-t)*n+t*e}function Pf(n,e,t,i){return er(n,e,1-Math.exp(-t*i))}function Lf(n,e=1){return e-Math.abs(wc(n,e*2)-e)}function Df(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Nf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Uf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Ff(n,e){return n+Math.random()*(e-n)}function Of(n){return n*(.5-Math.random())}function Bf(n){n!==void 0&&(Ku=n);let e=Ku+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kf(n){return n*js}function zf(n){return n*ki}function Gf(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Hf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Tc(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Vf(n,e,t,i,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+i)/2),u=a((e+i)/2),h=r((e-i)/2),f=a((e-i)/2),d=r((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(o*u,c*h,c*f,o*l);break;case"YZY":n.set(c*f,o*u,c*h,o*l);break;case"ZXZ":n.set(c*h,c*f,o*u,o*l);break;case"XZX":n.set(o*u,c*x,c*d,o*l);break;case"YXY":n.set(c*d,o*u,c*x,o*l);break;case"ZYZ":n.set(c*x,c*d,o*u,o*l);break;default:Ge("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ec(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function od(n,e){if(e.constructor===Float32Array)return n;let t=Ec(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function ld(n,e){if(e.constructor===Float32Array)return n;let t=Ec(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}var zo={DEG2RAD:js,RAD2DEG:ki,generateUUID:Cs,clamp:at,euclideanModulo:wc,mapLinear:Cf,inverseLerp:If,lerp:er,damp:Pf,pingpong:Lf,smoothstep:Df,smootherstep:Nf,randInt:Uf,randFloat:Ff,randFloatSpread:Of,seededRandom:Bf,degToRad:kf,radToDeg:zf,isPowerOfTwo:Gf,ceilPowerOfTwo:Hf,floorPowerOfTwo:Tc,setQuaternionFromProperEuler:Vf,normalize:ld,denormalize:od},Pc=class Pc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Pc.prototype.isVector2=!0;var Je=Pc,Dn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3],f=r[a+0],d=r[a+1],x=r[a+2],b=r[a+3];if(h!==b||c!==f||l!==d||u!==x){let p=c*f+l*d+u*x+h*b;p<0&&(f=-f,d=-d,x=-x,b=-b,p=-p);let m=1-o;if(p<.9995){let y=Math.acos(p),w=Math.sin(y);m=Math.sin(m*y)/w,o=Math.sin(o*y)/w,c=c*m+f*o,l=l*m+d*o,u=u*m+x*o,h=h*m+b*o}else{c=c*m+f*o,l=l*m+d*o,u=u*m+x*o,h=h*m+b*o;let y=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=y,l*=y,u*=y,h*=y}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[a],f=r[a+1],d=r[a+2],x=r[a+3];return e[t]=o*x+u*h+c*d-l*f,e[t+1]=c*x+u*f+l*h-o*d,e[t+2]=l*x+u*d+o*f-c*h,e[t+3]=u*x-o*h-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),h=o(r/2),f=c(i/2),d=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=f*u*h+l*d*x,this._y=l*d*h-f*u*x,this._z=l*u*x+f*d*h,this._w=l*u*h-f*d*x;break;case"YXZ":this._x=f*u*h+l*d*x,this._y=l*d*h-f*u*x,this._z=l*u*x-f*d*h,this._w=l*u*h+f*d*x;break;case"ZXY":this._x=f*u*h-l*d*x,this._y=l*d*h+f*u*x,this._z=l*u*x+f*d*h,this._w=l*u*h-f*d*x;break;case"ZYX":this._x=f*u*h-l*d*x,this._y=l*d*h+f*u*x,this._z=l*u*x-f*d*h,this._w=l*u*h+f*d*x;break;case"YZX":this._x=f*u*h+l*d*x,this._y=l*d*h+f*u*x,this._z=l*u*x-f*d*h,this._w=l*u*h-f*d*x;break;case"XZY":this._x=f*u*h-l*d*x,this._y=l*d*h-f*u*x,this._z=l*u*x+f*d*h,this._w=l*u*h+f*d*x;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=i+o+h;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(i>o&&i>h){let d=2*Math.sqrt(1+i-o-h);this._w=(u-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>h){let d=2*Math.sqrt(1+o-i-h);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+u)/d}else{let d=2*Math.sqrt(1+h-i-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Lc=class Lc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),u=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+c*l+a*h-o*u,this.y=i+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Sl.copy(this).projectOnVector(e),this.sub(Sl)}reflect(e){return this.sub(Sl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Lc.prototype.isVector3=!0;var k=Lc,Sl=new k,Qu=new Dn,Dc=class Dc{constructor(e,t,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l)}set(e,t,i,s,r,a,o,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],d=i[5],x=i[8],b=s[0],p=s[3],m=s[6],y=s[1],w=s[4],M=s[7],C=s[2],E=s[5],_=s[8];return r[0]=a*b+o*y+c*C,r[3]=a*p+o*w+c*E,r[6]=a*m+o*M+c*_,r[1]=l*b+u*y+h*C,r[4]=l*p+u*w+h*E,r[7]=l*m+u*M+h*_,r[2]=f*b+d*y+x*C,r[5]=f*p+d*w+x*E,r[8]=f*m+d*M+x*_,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*a-o*l,f=o*c-u*r,d=l*r-a*c,x=t*h+i*f+s*d;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/x;return e[0]=h*b,e[1]=(s*l-u*i)*b,e[2]=(o*i-s*a)*b,e[3]=f*b,e[4]=(u*t-s*c)*b,e[5]=(s*r-o*t)*b,e[6]=d*b,e[7]=(i*c-l*t)*b,e[8]=(a*t-i*r)*b,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Qs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(bl.makeScale(e,t)),this}rotate(e){return Qs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(bl.makeRotation(-e)),this}translate(e,t){return Qs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(bl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Dc.prototype.isMatrix3=!0;var qe=Dc,bl=new qe,ju=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),eh=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wf(){let n={enabled:!0,workingColorSpace:nr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===gt&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===gt&&(s.r=us(s.r),s.g=us(s.g),s.b=us(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ni?ir:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[nr]:{primaries:e,whitePoint:i,transfer:ir,toXYZ:ju,fromXYZ:eh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:e,whitePoint:i,transfer:gt,toXYZ:ju,fromXYZ:eh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}}),n}var rt=Wf();function Zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Ki,Da=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ki===void 0&&(Ki=sr("canvas")),Ki.width=e.width,Ki.height=e.height;let s=Ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ki}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=sr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Zn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zn(t[i]/255)*255):t[i]=Zn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Xf=0,ms=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=Cs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wl(s[a].image)):r.push(wl(s[a]))}else r=wl(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function wl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Da.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}var qf=0,Tl=new k,en=class n extends Ln{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Pn,s=Pn,r=Wt,a=ei,o=gn,c=rn,l=n.DEFAULT_ANISOTROPY,u=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=Cs(),this.name="",this.source=new ms(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Tl).x}get height(){return this.source.getSize(Tl).y}get depth(){return this.source.getSize(Tl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Ge(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==hc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ds:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case Pa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ds:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case Pa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=hc;en.DEFAULT_ANISOTROPY=1;var Nc=class Nc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],x=c[9],b=c[2],p=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-b)<.01&&Math.abs(x-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+b)<.1&&Math.abs(x+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(l+1)/2,M=(d+1)/2,C=(m+1)/2,E=(u+f)/4,_=(h+b)/4,T=(x+p)/4;return w>M&&w>C?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=E/i,r=_/i):M>C?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=E/s,r=T/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=_/r,s=T/r),this.set(i,s,r,t),this}let y=Math.sqrt((p-x)*(p-x)+(h-b)*(h-b)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-x)/y,this.y=(h-b)/y,this.z=(f-u)/y,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this.w=at(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this.w=at(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Nc.prototype.isVector4=!0;var Rt=Nc,Na=class extends Ln{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t),this.textures=[];let s=i.count;for(let r=0;r<s;r++)this.textures[r]=new en({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ms(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},pn=class extends Na{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},rr=class extends en{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ua=class extends en{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Qa=class Qa{constructor(e,t,i,s,r,a,o,c,l,u,h,f,d,x,b,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l,u,h,f,d,x,b,p)}set(e,t,i,s,r,a,o,c,l,u,h,f,d,x,b,p){let m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=u,m[10]=h,m[14]=f,m[3]=d,m[7]=x,m[11]=b,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qa().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/Qi.setFromMatrixColumn(e,0).length(),r=1/Qi.setFromMatrixColumn(e,1).length(),a=1/Qi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let f=a*u,d=a*h,x=o*u,b=o*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=d+x*l,t[5]=f-b*l,t[9]=-o*c,t[2]=b-f*l,t[6]=x+d*l,t[10]=a*c}else if(e.order==="YXZ"){let f=c*u,d=c*h,x=l*u,b=l*h;t[0]=f+b*o,t[4]=x*o-d,t[8]=a*l,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=d*o-x,t[6]=b+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*u,d=c*h,x=l*u,b=l*h;t[0]=f-b*o,t[4]=-a*h,t[8]=x+d*o,t[1]=d+x*o,t[5]=a*u,t[9]=b-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*u,d=a*h,x=o*u,b=o*h;t[0]=c*u,t[4]=x*l-d,t[8]=f*l+b,t[1]=c*h,t[5]=b*l+f,t[9]=d*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,d=a*l,x=o*c,b=o*l;t[0]=c*u,t[4]=b-f*h,t[8]=x*h+d,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=d*h+x,t[10]=f-b*h}else if(e.order==="XZY"){let f=a*c,d=a*l,x=o*c,b=o*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+b,t[5]=a*u,t[9]=d*h-x,t[2]=x*h-d,t[6]=o*u,t[10]=b*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yf,e,$f)}lookAt(e,t,i){let s=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),ui.crossVectors(i,cn),ui.lengthSq()===0&&(Math.abs(i.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),ui.crossVectors(i,cn)),ui.normalize(),ea.crossVectors(cn,ui),s[0]=ui.x,s[4]=ea.x,s[8]=cn.x,s[1]=ui.y,s[5]=ea.y,s[9]=cn.y,s[2]=ui.z,s[6]=ea.z,s[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],d=i[13],x=i[2],b=i[6],p=i[10],m=i[14],y=i[3],w=i[7],M=i[11],C=i[15],E=s[0],_=s[4],T=s[8],N=s[12],I=s[1],F=s[5],O=s[9],q=s[13],L=s[2],W=s[6],Z=s[10],Y=s[14],re=s[3],J=s[7],ie=s[11],se=s[15];return r[0]=a*E+o*I+c*L+l*re,r[4]=a*_+o*F+c*W+l*J,r[8]=a*T+o*O+c*Z+l*ie,r[12]=a*N+o*q+c*Y+l*se,r[1]=u*E+h*I+f*L+d*re,r[5]=u*_+h*F+f*W+d*J,r[9]=u*T+h*O+f*Z+d*ie,r[13]=u*N+h*q+f*Y+d*se,r[2]=x*E+b*I+p*L+m*re,r[6]=x*_+b*F+p*W+m*J,r[10]=x*T+b*O+p*Z+m*ie,r[14]=x*N+b*q+p*Y+m*se,r[3]=y*E+w*I+M*L+C*re,r[7]=y*_+w*F+M*W+C*J,r[11]=y*T+w*O+M*Z+C*ie,r[15]=y*N+w*q+M*Y+C*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],d=e[14],x=e[3],b=e[7],p=e[11],m=e[15],y=c*d-l*f,w=o*d-l*h,M=o*f-c*h,C=a*d-l*u,E=a*f-c*u,_=a*h-o*u;return t*(b*y-p*w+m*M)-i*(x*y-p*C+m*E)+s*(x*w-b*C+m*_)-r*(x*M-b*E+p*_)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-i*(r*u-o*c)+s*(r*l-a*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],d=e[11],x=e[12],b=e[13],p=e[14],m=e[15],y=t*o-i*a,w=t*c-s*a,M=t*l-r*a,C=i*c-s*o,E=i*l-r*o,_=s*l-r*c,T=u*b-h*x,N=u*p-f*x,I=u*m-d*x,F=h*p-f*b,O=h*m-d*b,q=f*m-d*p,L=y*q-w*O+M*F+C*I-E*N+_*T;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let W=1/L;return e[0]=(o*q-c*O+l*F)*W,e[1]=(s*O-i*q-r*F)*W,e[2]=(b*_-p*E+m*C)*W,e[3]=(f*E-h*_-d*C)*W,e[4]=(c*I-a*q-l*N)*W,e[5]=(t*q-s*I+r*N)*W,e[6]=(p*M-x*_-m*w)*W,e[7]=(u*_-f*M+d*w)*W,e[8]=(a*O-o*I+l*T)*W,e[9]=(i*I-t*O-r*T)*W,e[10]=(x*E-b*M+m*y)*W,e[11]=(h*M-u*E-d*y)*W,e[12]=(o*N-a*F-c*T)*W,e[13]=(t*F-i*N+s*T)*W,e[14]=(b*w-x*C-p*y)*W,e[15]=(u*C-h*w+f*y)*W,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,u=a+a,h=o+o,f=r*l,d=r*u,x=r*h,b=a*u,p=a*h,m=o*h,y=c*l,w=c*u,M=c*h,C=i.x,E=i.y,_=i.z;return s[0]=(1-(b+m))*C,s[1]=(d+M)*C,s[2]=(x-w)*C,s[3]=0,s[4]=(d-M)*E,s[5]=(1-(f+m))*E,s[6]=(p+y)*E,s[7]=0,s[8]=(x+w)*_,s[9]=(p-y)*_,s[10]=(1-(f+b))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Qi.set(s[0],s[1],s[2]).length(),o=Qi.set(s[4],s[5],s[6]).length(),c=Qi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),wn.copy(this);let l=1/a,u=1/o,h=1/c;return wn.elements[0]*=l,wn.elements[1]*=l,wn.elements[2]*=l,wn.elements[4]*=u,wn.elements[5]*=u,wn.elements[6]*=u,wn.elements[8]*=h,wn.elements[9]*=h,wn.elements[10]*=h,t.setFromRotationMatrix(wn),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,s,r,a,o=vn,c=!1){let l=this.elements,u=2*r/(t-e),h=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s),x,b;if(c)x=r/(a-r),b=a*r/(a-r);else if(o===vn)x=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===fs)x=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=b,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=vn,c=!1){let l=this.elements,u=2/(t-e),h=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s),x,b;if(c)x=1/(a-r),b=a/(a-r);else if(o===vn)x=-2/(a-r),b=-(a+r)/(a-r);else if(o===fs)x=-1/(a-r),b=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=x,l[14]=b,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Qa.prototype.isMatrix4=!0;var Tt=Qa,Qi=new k,wn=new Tt,Yf=new k(0,0,0),$f=new k(1,1,1),ui=new k,ea=new k,cn=new k,th=new Tt,nh=new Dn,Kn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(at(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-at(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(at(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-at(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return th.makeRotationFromQuaternion(e),this.setFromRotationMatrix(th,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nh.setFromEuler(this),this.setFromQuaternion(nh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Kn.DEFAULT_ORDER="XYZ";var gs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Zf=0,ih=new k,ji=new Dn,Wn=new Tt,ta=new k,$s=new k,Jf=new k,Kf=new Dn,sh=new k(1,0,0),rh=new k(0,1,0),ah=new k(0,0,1),oh={type:"added"},Qf={type:"removed"},es={type:"childadded",child:null},El={type:"childremoved",child:null},Nt=class n extends Ln{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=Cs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new k,t=new Kn,i=new Dn,s=new k(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new qe}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.multiply(ji),this}rotateOnWorldAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.premultiply(ji),this}rotateX(e){return this.rotateOnAxis(sh,e)}rotateY(e){return this.rotateOnAxis(rh,e)}rotateZ(e){return this.rotateOnAxis(ah,e)}translateOnAxis(e,t){return ih.copy(e).applyQuaternion(this.quaternion),this.position.add(ih.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sh,e)}translateY(e){return this.translateOnAxis(rh,e)}translateZ(e){return this.translateOnAxis(ah,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ta.copy(e):ta.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt($s,ta,this.up):Wn.lookAt(ta,$s,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),ji.setFromRotationMatrix(Wn),this.quaternion.premultiply(ji.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ve("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(oh),es.child=e,this.dispatchEvent(es),es.child=null):Ve("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qf),El.child=e,this.dispatchEvent(El),El.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(oh),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,e,Jf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,Kf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),d=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Nt.DEFAULT_UP=new k(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var dn=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},jf={type:"move"},_s=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let b of e.hand.values()){let p=t.getJointPose(b,i),m=this._getHandJoint(l,b);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,x=.005;l.inputState.pinching&&f>d+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jf)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new dn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},na={h:0,s:0,l:0};function Al(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var He=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=rt.workingColorSpace){if(e=wc(e,1),t=at(t,0,1),i=at(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Al(a,r,e+1/3),this.g=Al(a,r,e),this.b=Al(a,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=zt){function i(r){r!==void 0&&parseFloat(r)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ge("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zt){let i=cd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}copyLinearToSRGB(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return rt.workingToColorSpace(Zt.copy(this),e),Math.round(at(Zt.r*255,0,255))*65536+Math.round(at(Zt.g*255,0,255))*256+Math.round(at(Zt.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Zt.copy(this),t);let i=Zt.r,s=Zt.g,r=Zt.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=zt){rt.workingToColorSpace(Zt.copy(this),e);let t=Zt.r,i=Zt.g,s=Zt.b;return e!==zt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(hi),this.setHSL(hi.h+e,hi.s+t,hi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hi),e.getHSL(na);let i=er(hi.h,na.h,t),s=er(hi.s,na.s,t),r=er(hi.l,na.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Zt=new He;He.NAMES=cd;var ar=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new He(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},or=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kn,this.environmentIntensity=1,this.environmentRotation=new Kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Tn=new k,Xn=new k,Rl=new k,qn=new k,ts=new k,ns=new k,lh=new k,Cl=new k,Il=new k,Pl=new k,Ll=new Rt,Dl=new Rt,Nl=new Rt,mi=class n{constructor(e=new k,t=new k,i=new k){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Tn.subVectors(e,t),s.cross(Tn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Tn.subVectors(s,t),Xn.subVectors(i,t),Rl.subVectors(e,t);let a=Tn.dot(Tn),o=Tn.dot(Xn),c=Tn.dot(Rl),l=Xn.dot(Xn),u=Xn.dot(Rl),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;let f=1/h,d=(l*c-o*u)*f,x=(a*u-o*c)*f;return r.set(1-d-x,x,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qn.x),c.addScaledVector(a,qn.y),c.addScaledVector(o,qn.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return Ll.setScalar(0),Dl.setScalar(0),Nl.setScalar(0),Ll.fromBufferAttribute(e,t),Dl.fromBufferAttribute(e,i),Nl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ll,r.x),a.addScaledVector(Dl,r.y),a.addScaledVector(Nl,r.z),a}static isFrontFacing(e,t,i,s){return Tn.subVectors(i,t),Xn.subVectors(e,t),Tn.cross(Xn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Tn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),Tn.cross(Xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;ts.subVectors(s,i),ns.subVectors(r,i),Cl.subVectors(e,i);let c=ts.dot(Cl),l=ns.dot(Cl);if(c<=0&&l<=0)return t.copy(i);Il.subVectors(e,s);let u=ts.dot(Il),h=ns.dot(Il);if(u>=0&&h<=u)return t.copy(s);let f=c*h-u*l;if(f<=0&&c>=0&&u<=0&&c-u>0)return a=c/(c-u),t.copy(i).addScaledVector(ts,a);Pl.subVectors(e,r);let d=ts.dot(Pl),x=ns.dot(Pl);if(x>=0&&d<=x)return t.copy(r);let b=d*l-c*x;if(b<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(i).addScaledVector(ns,o);let p=u*x-d*h;if(p<=0&&h-u>=0&&d-x>=0)return lh.subVectors(r,s),o=(h-u)/(h-u+(d-x)),t.copy(s).addScaledVector(lh,o);let m=1/(p+b+f);return a=b*m,o=f*m,t.copy(i).addScaledVector(ts,a).addScaledVector(ns,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},gi=class{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,En):En.fromBufferAttribute(r,a),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ia.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ia.copy(i.boundingBox)),ia.applyMatrix4(e.matrixWorld),this.union(ia)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zs),sa.subVectors(this.max,Zs),is.subVectors(e.a,Zs),ss.subVectors(e.b,Zs),rs.subVectors(e.c,Zs),di.subVectors(ss,is),fi.subVectors(rs,ss),Ui.subVectors(is,rs);let t=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Ui.z,Ui.y,di.z,0,-di.x,fi.z,0,-fi.x,Ui.z,0,-Ui.x,-di.y,di.x,0,-fi.y,fi.x,0,-Ui.y,Ui.x,0];return!Ul(t,is,ss,rs,sa)||(t=[1,0,0,0,1,0,0,0,1],!Ul(t,is,ss,rs,sa))?!1:(ra.crossVectors(di,fi),t=[ra.x,ra.y,ra.z],Ul(t,is,ss,rs,sa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Yn=[new k,new k,new k,new k,new k,new k,new k,new k],En=new k,ia=new gi,is=new k,ss=new k,rs=new k,di=new k,fi=new k,Ui=new k,Zs=new k,sa=new k,ra=new k,Fi=new k;function Ul(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Fi.fromArray(n,r);let o=s.x*Math.abs(Fi.x)+s.y*Math.abs(Fi.y)+s.z*Math.abs(Fi.z),c=e.dot(Fi),l=t.dot(Fi),u=i.dot(Fi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var Dt=new k,aa=new Je,ep=0,fn=class extends Ln{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ep++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=nd,this.updateRanges=[],this.gpuType=Rn,this.version=0,this._normalizationScale=e!==void 0?Ec(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)aa.fromBufferAttribute(this,t),aa.applyMatrix3(e),this.setXY(t,aa.x,aa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):od(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):ld(e,this.array)}};var lr=class extends fn{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var cr=class extends fn{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var vt=class extends fn{constructor(e,t,i){super(new Float32Array(e),t,i)}},tp=new gi,Js=new k,Fl=new k,zi=class{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):tp.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Js.subVectors(e,this.center);let t=Js.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Js,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Js.copy(e.center).add(Fl)),this.expandByPoint(Js.copy(e.center).sub(Fl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},np=0,yn=new Tt,Ol=new Nt,as=new k,un=new gi,Ks=new gi,kt=new k,Kt=class n extends Ln{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Cs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Af(e)?cr:lr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new qe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,t,i){return yn.makeTranslation(e,t,i),this.applyMatrix4(yn),this}scale(e,t,i){return yn.makeScale(e,t,i),this.applyMatrix4(yn),this}lookAt(e){return Ol.lookAt(e),Ol.updateMatrix(),this.applyMatrix4(Ol.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new vt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];un.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ve('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){let i=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ks.setFromBufferAttribute(o),this.morphTargetsRelative?(kt.addVectors(un.min,Ks.min),un.expandByPoint(kt),kt.addVectors(un.max,Ks.max),un.expandByPoint(kt)):(un.expandByPoint(Ks.min),un.expandByPoint(Ks.max))}un.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)kt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(kt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)kt.fromBufferAttribute(o,l),c&&(as.fromBufferAttribute(e,l),kt.add(as)),s=Math.max(s,i.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ve('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ve("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new fn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));let o=[],c=[],l=new Uint8Array(i.count);for(let N=0;N<i.count;N++)o[N]=new k,c[N]=new k;let u=new k,h=new k,f=new k,d=new Je,x=new Je,b=new Je,p=new k,m=new k;function y(N,I,F){l[N]=l[I]=l[F]=1,u.fromBufferAttribute(i,N),h.fromBufferAttribute(i,I),f.fromBufferAttribute(i,F),d.fromBufferAttribute(r,N),x.fromBufferAttribute(r,I),b.fromBufferAttribute(r,F),h.sub(u),f.sub(u),x.sub(d),b.sub(d);let O=1/(x.x*b.y-b.x*x.y);isFinite(O)&&(p.copy(h).multiplyScalar(b.y).addScaledVector(f,-x.y).multiplyScalar(O),m.copy(f).multiplyScalar(x.x).addScaledVector(h,-b.x).multiplyScalar(O),o[N].add(p),o[I].add(p),o[F].add(p),c[N].add(m),c[I].add(m),c[F].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let N=0,I=w.length;N<I;++N){let F=w[N],O=F.start,q=F.count;for(let L=O,W=O+q;L<W;L+=3)y(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let M=new k,C=new k,E=new k,_=new k;function T(N){E.fromBufferAttribute(s,N),_.copy(E);let I=o[N];M.copy(I),M.sub(E.multiplyScalar(E.dot(I))).normalize(),C.crossVectors(_,I);let O=C.dot(c[N])<0?-1:1;a.setXYZW(N,M.x,M.y,M.z,O)}for(let N=0,I=i.count;N<I;++N)l[N]&&T(N);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new fn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let s=new k,r=new k,a=new k,o=new k,c=new k,l=new k,u=new k,h=new k;if(e)for(let f=0,d=e.count;f<d;f+=3){let x=e.getX(f+0),b=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,p),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,b),l.fromBufferAttribute(i,p),o.add(u),c.add(u),l.add(u),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(b,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(o,c){let l=o.array,u=o.itemSize,h=o.normalized,f=new l.constructor(c.length*u),d=0,x=0;for(let b=0,p=c.length;b<p;b++){o.isInterleavedBufferAttribute?d=c[b]*o.data.stride+o.offset:d=c[b]*u;for(let m=0;m<u;m++)f[x++]=l[d++]}return new fn(f,u,h)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,i);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){let f=l[u],d=e(f,i);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){let d=l[h];u.push(d.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],h=r[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,u=a.length;l<u;l++){let h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Bl=new k,ip=new k,sp=new qe,hn=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Bl.subVectors(i,t).cross(ip.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(Bl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||sp.getNormalMatrix(e),s=this.coplanarPoint(Bl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},rp=0,Qn=class extends Ln{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=Cs(),this.name="",this.type="Material",this.blending=Es,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=nc,this.blendDst=ic,this.blendEquation=Wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ba,this.stencilZFail=ba,this.stencilZPass=ba,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Ge(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new He().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new hn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Je().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Je().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var $n=new k,kl=new k,oa=new k,la=new k,xs=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($n.copy(this.origin).addScaledVector(this.direction,t),$n.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){kl.copy(e).add(t).multiplyScalar(.5),oa.copy(t).sub(e).normalize(),la.copy(this.origin).sub(kl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(oa),o=la.dot(this.direction),c=-la.dot(oa),l=la.lengthSq(),u=Math.abs(1-a*a),h,f,d,x;if(u>0)if(h=a*c-o,f=a*o-c,x=r*u,h>=0)if(f>=-x)if(f<=x){let b=1/u;h*=b,f*=b,d=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;else f<=-x?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l):f<=x?(h=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(kl).addScaledVector(oa,f),d}intersectSphere(e,t){if(e.radius<0)return null;$n.subVectors(e.center,this.origin);let i=$n.dot(this.direction),s=$n.dot($n)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,$n)!==null}intersectTriangle(e,t,i,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,h=e.x-a.x,f=e.y-a.y,d=e.z-a.z,x=t.x-a.x,b=t.y-a.y,p=t.z-a.z,m=i.x-a.x,y=i.y-a.y,w=i.z-a.z,M=Math.abs(c),C=Math.abs(l),E=Math.abs(u),_,T,N,I,F,O,q,L,W,Z,Y,re;if(M>=C&&M>=E?(N=c,O=h,W=x,re=m,c>=0?(_=l,T=u,I=f,F=d,q=b,L=p,Z=y,Y=w):(_=u,T=l,I=d,F=f,q=p,L=b,Z=w,Y=y)):C>=E?(N=l,O=f,W=b,re=y,l>=0?(_=u,T=c,I=d,F=h,q=p,L=x,Z=w,Y=m):(_=c,T=u,I=h,F=d,q=x,L=p,Z=m,Y=w)):(N=u,O=d,W=p,re=w,u>=0?(_=c,T=l,I=h,F=f,q=x,L=b,Z=m,Y=y):(_=l,T=c,I=f,F=h,q=b,L=x,Z=y,Y=m)),N===0)return null;let J=_/N,ie=T/N,se=1/N,Ie=I-J*O,We=F-ie*O,j=q-J*W,ye=L-ie*W,Ae=Z-J*re,ke=Y-ie*re,Se=Ae*ye-ke*j,Ye=Ie*ke-We*Ae,ut=j*We-ye*Ie;if(s){if(Se<0||Ye<0||ut<0)return null}else if((Se<0||Ye<0||ut<0)&&(Se>0||Ye>0||ut>0))return null;let ze=Se+Ye+ut;if(ze===0)return null;let ht=se*(Se*O+Ye*W+ut*re);return(ze>0?ht<0:ht>0)?null:this.at(ht/ze,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ys=class extends Qn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ch=new Tt,Oi=new xs,ca=new zi,uh=new k,ua=new k,ha=new k,da=new k,zl=new k,fa=new k,hh=new k,pa=new k,sn=class extends Nt{constructor(e=new Kt,t=new ys){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){fa.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],h=r[c];u!==0&&(zl.fromBufferAttribute(h,e),a?fa.addScaledVector(zl,u):fa.addScaledVector(zl.sub(t),u))}t.add(fa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ca.copy(i.boundingSphere),ca.applyMatrix4(r),Oi.copy(e.ray).recast(e.near),!(ca.containsPoint(Oi.origin)===!1&&(Oi.intersectSphere(ca,uh)===null||Oi.origin.distanceToSquared(uh)>(e.far-e.near)**2))&&(ch.copy(r).invert(),Oi.copy(e.ray).applyMatrix4(ch),!(i.boundingBox!==null&&Oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Oi)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,b=f.length;x<b;x++){let p=f[x],m=a[p.materialIndex],y=Math.max(p.start,d.start),w=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let M=y,C=w;M<C;M+=3){let E=o.getX(M),_=o.getX(M+1),T=o.getX(M+2);s=ma(this,m,e,i,l,u,h,E,_,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,d.start),b=Math.min(o.count,d.start+d.count);for(let p=x,m=b;p<m;p+=3){let y=o.getX(p),w=o.getX(p+1),M=o.getX(p+2);s=ma(this,a,e,i,l,u,h,y,w,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,b=f.length;x<b;x++){let p=f[x],m=a[p.materialIndex],y=Math.max(p.start,d.start),w=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let M=y,C=w;M<C;M+=3){let E=M,_=M+1,T=M+2;s=ma(this,m,e,i,l,u,h,E,_,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let x=Math.max(0,d.start),b=Math.min(c.count,d.start+d.count);for(let p=x,m=b;p<m;p+=3){let y=p,w=p+1,M=p+2;s=ma(this,a,e,i,l,u,h,y,w,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function ap(n,e,t,i,s,r,a,o){let c;if(e.side===tn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===bi,o),c===null)return null;pa.copy(o),pa.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(pa);return l<t.near||l>t.far?null:{distance:l,point:pa.clone(),object:n}}function ma(n,e,t,i,s,r,a,o,c,l){n.getVertexPosition(o,ua),n.getVertexPosition(c,ha),n.getVertexPosition(l,da);let u=ap(n,e,t,i,ua,ha,da,hh);if(u){let h=new k;mi.getBarycoord(hh,ua,ha,da,h),s&&(u.uv=mi.getInterpolatedAttribute(s,o,c,l,h,new Je)),r&&(u.uv1=mi.getInterpolatedAttribute(r,o,c,l,h,new Je)),a&&(u.normal=mi.getInterpolatedAttribute(a,o,c,l,h,new k),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new k,materialIndex:0};mi.getNormal(ua,ha,da,f.normal),u.face=f,u.barycoord=h}return u}var vs=class extends en{constructor(e=null,t=1,i=1,s,r,a,o,c,l=Gt,u=Gt,h,f){super(null,a,o,c,l,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Bi=new zi,op=new Je(.5,.5),ga=new k,_i=class{constructor(e=new hn,t=new hn,i=new hn,s=new hn,r=new hn,a=new hn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=vn,i=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],d=r[7],x=r[8],b=r[9],p=r[10],m=r[11],y=r[12],w=r[13],M=r[14],C=r[15];if(s[0].setComponents(l-a,d-u,m-x,C-y).normalize(),s[1].setComponents(l+a,d+u,m+x,C+y).normalize(),s[2].setComponents(l+o,d+h,m+b,C+w).normalize(),s[3].setComponents(l-o,d-h,m-b,C-w).normalize(),i)s[4].setComponents(c,f,p,M).normalize(),s[5].setComponents(l-c,d-f,m-p,C-M).normalize();else if(s[4].setComponents(l-c,d-f,m-p,C-M).normalize(),t===vn)s[5].setComponents(l+c,d+f,m+p,C+M).normalize();else if(t===fs)s[5].setComponents(c,f,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bi)}intersectsSprite(e){Bi.center.set(0,0,0);let t=op.distanceTo(e.center);return Bi.radius=.7071067811865476+t,Bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bi)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ga.x=s.normal.x>0?e.max.x:e.min.x,ga.y=s.normal.y>0?e.max.y:e.min.y,ga.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ga)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},dh=new Tt,Fa=class n{constructor(){this.coordinateSystem=vn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];dh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new _i),i[s].setFromProjectionMatrix(dh,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new _i),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new n().copy(this)}};var Ms=class extends Qn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new He(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},fh=new Tt,ql=new xs,_a=new zi,xa=new k,ur=class extends Nt{constructor(e=new Kt,t=new Ms){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_a.copy(i.boundingSphere),_a.applyMatrix4(s),_a.radius+=r,e.ray.intersectsSphere(_a)===!1)return;fh.copy(s).invert(),ql.copy(e.ray).applyMatrix4(fh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,h=i.attributes.position;if(l!==null){let f=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let x=f,b=d;x<b;x++){let p=l.getX(x);xa.fromBufferAttribute(h,p),ph(xa,p,c,s,e,t,this)}}else{let f=Math.max(0,a.start),d=Math.min(h.count,a.start+a.count);for(let x=f,b=d;x<b;x++)xa.fromBufferAttribute(h,x),ph(xa,x,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function ph(n,e,t,i,s,r,a){let o=ql.distanceSqToPoint(n);if(o<t){let c=new k;ql.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var hr=class extends en{constructor(e=[],t=Xi,i,s,r,a,o,c,l,u){super(e,t,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Gi=class extends en{constructor(e,t,i,s,r,a,o,c,l){super(e,t,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var jn=class extends en{constructor(e,t,i=An,s,r,a,o=Gt,c=Gt,l,u=Jn,h=1){if(u!==Jn&&u!==ti)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:h};super(f,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ms(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},dr=class extends jn{constructor(e,t=An,i=Xi,s,r,a=Gt,o=Gt,c,l=Jn){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,a,o,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},fr=class extends en{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},xi=class n extends Kt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],h=[],f=0,d=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new vt(l,3)),this.setAttribute("normal",new vt(u,3)),this.setAttribute("uv",new vt(h,2));function x(b,p,m,y,w,M,C,E,_,T,N){let I=M/_,F=C/T,O=M/2,q=C/2,L=E/2,W=_+1,Z=T+1,Y=0,re=0,J=new k;for(let ie=0;ie<Z;ie++){let se=ie*F-q;for(let Ie=0;Ie<W;Ie++){let We=Ie*I-O;J[b]=We*y,J[p]=se*w,J[m]=L,l.push(J.x,J.y,J.z),J[b]=0,J[p]=0,J[m]=E>0?1:-1,u.push(J.x,J.y,J.z),h.push(Ie/_),h.push(1-ie/T),Y+=1}}for(let ie=0;ie<T;ie++)for(let se=0;se<_;se++){let Ie=f+se+W*ie,We=f+se+W*(ie+1),j=f+(se+1)+W*(ie+1),ye=f+(se+1)+W*ie;c.push(Ie,We,ye),c.push(We,j,ye),re+=6}o.addGroup(d,re,N),d+=re,f+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var pr=class n extends Kt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],f=[],d=[],x=0,b=[],p=i/2,m=0;y(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new vt(h,3)),this.setAttribute("normal",new vt(f,3)),this.setAttribute("uv",new vt(d,2));function y(){let M=new k,C=new k,E=0,_=(t-e)/i;for(let T=0;T<=r;T++){let N=[],I=T/r,F=I*(t-e)+e;for(let O=0;O<=s;O++){let q=O/s,L=q*c+o,W=Math.sin(L),Z=Math.cos(L);C.x=F*W,C.y=-I*i+p,C.z=F*Z,h.push(C.x,C.y,C.z),M.set(W,_,Z).normalize(),f.push(M.x,M.y,M.z),d.push(q,1-I),N.push(x++)}b.push(N)}for(let T=0;T<s;T++)for(let N=0;N<r;N++){let I=b[N][T],F=b[N+1][T],O=b[N+1][T+1],q=b[N][T+1];(e>0||N!==0)&&(u.push(I,F,q),E+=3),(t>0||N!==r-1)&&(u.push(F,O,q),E+=3)}l.addGroup(m,E,0),m+=E}function w(M){let C=x,E=new Je,_=new k,T=0,N=M===!0?e:t,I=M===!0?1:-1;for(let O=1;O<=s;O++)h.push(0,p*I,0),f.push(0,I,0),d.push(.5,.5),x++;let F=x;for(let O=0;O<=s;O++){let L=O/s*c+o,W=Math.cos(L),Z=Math.sin(L);_.x=N*Z,_.y=p*I,_.z=N*W,h.push(_.x,_.y,_.z),f.push(0,I,0),E.x=W*.5+.5,E.y=Z*.5*I+.5,d.push(E.x,E.y),x++}for(let O=0;O<s;O++){let q=C+O,L=F+O;M===!0?u.push(L,L+1,q):u.push(L+1,L,q),T+=3}l.addGroup(m,T,M===!0?1:2),m+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Oa=class n extends Kt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],a=[];o(s),l(i),u(),this.setAttribute("position",new vt(r,3)),this.setAttribute("normal",new vt(r.slice(),3)),this.setAttribute("uv",new vt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let w=new k,M=new k,C=new k;for(let E=0;E<t.length;E+=3)d(t[E+0],w),d(t[E+1],M),d(t[E+2],C),c(w,M,C,y)}function c(y,w,M,C){let E=C+1,_=[];for(let T=0;T<=E;T++){_[T]=[];let N=y.clone().lerp(M,T/E),I=w.clone().lerp(M,T/E),F=E-T;for(let O=0;O<=F;O++)O===0&&T===E?_[T][O]=N:_[T][O]=N.clone().lerp(I,O/F)}for(let T=0;T<E;T++)for(let N=0;N<2*(E-T)-1;N++){let I=Math.floor(N/2);N%2===0?(f(_[T][I+1]),f(_[T+1][I]),f(_[T][I])):(f(_[T][I+1]),f(_[T+1][I+1]),f(_[T+1][I]))}}function l(y){let w=new k;for(let M=0;M<r.length;M+=3)w.x=r[M+0],w.y=r[M+1],w.z=r[M+2],w.normalize().multiplyScalar(y),r[M+0]=w.x,r[M+1]=w.y,r[M+2]=w.z}function u(){let y=new k;for(let w=0;w<r.length;w+=3){y.x=r[w+0],y.y=r[w+1],y.z=r[w+2];let M=p(y)/2/Math.PI+.5,C=m(y)/Math.PI+.5;a.push(M,1-C)}x(),h()}function h(){for(let y=0;y<a.length;y+=6){let w=a[y+0],M=a[y+2],C=a[y+4],E=Math.max(w,M,C),_=Math.min(w,M,C);E>.9&&_<.1&&(w<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),C<.2&&(a[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,w){let M=y*3;w.x=e[M+0],w.y=e[M+1],w.z=e[M+2]}function x(){let y=new k,w=new k,M=new k,C=new k,E=new Je,_=new Je,T=new Je;for(let N=0,I=0;N<r.length;N+=9,I+=6){y.set(r[N+0],r[N+1],r[N+2]),w.set(r[N+3],r[N+4],r[N+5]),M.set(r[N+6],r[N+7],r[N+8]),E.set(a[I+0],a[I+1]),_.set(a[I+2],a[I+3]),T.set(a[I+4],a[I+5]),C.copy(y).add(w).add(M).divideScalar(3);let F=p(C);b(E,I+0,y,F),b(_,I+2,w,F),b(T,I+4,M,F)}}function b(y,w,M,C){C<0&&y.x===1&&(a[w]=y.x-1),M.x===0&&M.z===0&&(a[w]=C/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var mr=class n extends Oa{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var yi=class n extends Kt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,h=e/o,f=t/c,d=[],x=[],b=[],p=[];for(let m=0;m<u;m++){let y=m*f-a;for(let w=0;w<l;w++){let M=w*h-r;x.push(M,-y,0),b.push(0,0,1),p.push(w/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let y=0;y<o;y++){let w=y+l*m,M=y+l*(m+1),C=y+1+l*(m+1),E=y+1+l*m;d.push(w,M,E),d.push(M,C,E)}this.setIndex(d),this.setAttribute("position",new vt(x,3)),this.setAttribute("normal",new vt(b,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var gr=class n extends Kt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),l=0,u=[],h=new k,f=new k,d=[],x=[],b=[],p=[];for(let m=0;m<=i;m++){let y=[],w=m/i,M=a+w*o,C=e*Math.cos(M),E=Math.sqrt(e*e-C*C),_=0;m===0&&a===0?_=.5/t:m===i&&c===Math.PI&&(_=-.5/t);for(let T=0;T<=t;T++){let N=T/t,I=s+N*r;h.x=-E*Math.cos(I),h.y=C,h.z=E*Math.sin(I),x.push(h.x,h.y,h.z),f.copy(h).normalize(),b.push(f.x,f.y,f.z),p.push(N+_,1-w),y.push(l++)}u.push(y)}for(let m=0;m<i;m++)for(let y=0;y<t;y++){let w=u[m][y+1],M=u[m][y],C=u[m+1][y],E=u[m+1][y+1];(m!==0||a>0)&&d.push(w,M,E),(m!==i-1||c<Math.PI)&&d.push(M,C,E)}this.setIndex(d),this.setAttribute("position",new vt(x,3)),this.setAttribute("normal",new vt(b,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _r=class n extends Kt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),s=Math.floor(s);let c=[],l=[],u=[],h=[],f=new k,d=new k,x=new k;for(let b=0;b<=i;b++){let p=a+b/i*o;for(let m=0;m<=s;m++){let y=m/s*r;d.x=(e+t*Math.cos(p))*Math.cos(y),d.y=(e+t*Math.cos(p))*Math.sin(y),d.z=t*Math.sin(p),l.push(d.x,d.y,d.z),f.x=e*Math.cos(y),f.y=e*Math.sin(y),x.subVectors(d,f).normalize(),u.push(x.x,x.y,x.z),h.push(m/s),h.push(b/i)}}for(let b=1;b<=i;b++)for(let p=1;p<=s;p++){let m=(s+1)*b+p-1,y=(s+1)*(b-1)+p-1,w=(s+1)*(b-1)+p,M=(s+1)*b+p;c.push(m,y,M),c.push(y,w,M)}this.setIndex(c),this.setAttribute("position",new vt(l,3)),this.setAttribute("normal",new vt(u,3)),this.setAttribute("uv",new vt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Yi(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(mh(s))s.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(mh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Qt(n){let e={};for(let t=0;t<n.length;t++){let i=Yi(n[t]);for(let s in i)e[s]=i[s]}return e}function mh(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function lp(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ac(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var ud={clone:Yi,merge:Qt},cp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,up=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends Qn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cp,this.fragmentShader=up,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=lp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new He().setHex(s.value);break;case"v2":this.uniforms[i].value=new Je().fromArray(s.value);break;case"v3":this.uniforms[i].value=new k().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Rt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new qe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Tt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ba=class extends Mn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ss=class extends Qn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ko,this.normalScale=new Je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var ka=class extends Qn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$h,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},za=class extends Qn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function os(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function ya(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var vi=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ga=class extends vi{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vl,endingEnd:Vl}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Wl:r=e,o=2*t-i;break;case Xl:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Wl:a=e,c=2*i-t;break;case Xl:a=1,c=i+s[1]-s[0];break;default:a=e-1,c=t}let l=(i-t)*.5,u=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,x=(i-t)/(s-t),b=x*x,p=b*x,m=-f*p+2*f*b-f*x,y=(1+f)*p+(-1.5-2*f)*b+(-.5+f)*x+1,w=(-1-d)*p+(1.5+d)*b+.5*x,M=d*p-d*b;for(let C=0;C!==o;++C)r[C]=m*a[u+C]+y*a[l+C]+w*a[c+C]+M*a[h+C];return r}},Ha=class extends vi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=(i-t)/(s-t),h=1-u;for(let f=0;f!==o;++f)r[f]=a[l+f]*h+a[c+f]*u;return r}},Va=class extends vi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Wa=class extends vi{interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this.inTangents,h=this.outTangents;if(!u||!h){let x=(i-t)/(s-t),b=1-x;for(let p=0;p!==o;++p)r[p]=a[l+p]*b+a[c+p]*x;return r}let f=o*2,d=e-1;for(let x=0;x!==o;++x){let b=a[l+x],p=a[c+x],m=d*f+x*2,y=h[m],w=h[m+1],M=e*f+x*2,C=u[M],E=u[M+1],_=dp(i,t,y,C,s);r[x]=hd(_,b,w,E,p)}return r}};function hd(n,e,t,i,s){let r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function hp(n,e,t,i,s){let r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function dp(n,e,t,i,s){let r=(n-e)/(s-e);for(let a=0;a<8;a++){let o=hd(r,e,t,i,s)-n;if(Math.abs(o)<1e-10)break;let c=hp(r,e,t,i,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var mn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=os(t,this.TimeBufferType),this.values=os(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:os(e.times,Array),values:os(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),ya(e.settings)&&(i.settings={inTangents:os(e.settings.inTangents,Array),outTangents:os(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ga(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Wa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case tr:t=this.InterpolantFactoryMethodDiscrete;break;case La:t=this.InterpolantFactoryMethodLinear;break;case Sa:t=this.InterpolantFactoryMethodSmooth;break;case Hl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ge("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return tr;case this.InterpolantFactoryMethodLinear:return La;case this.InterpolantFactoryMethodSmooth:return Sa;case this.InterpolantFactoryMethodBezier:return Hl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;ya(this.settings)&&(gh(this.settings.inTangents,e),gh(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;ya(this.settings)&&(_h(this.settings.inTangents,e),_h(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ve("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Ve("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){Ve("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){Ve("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Rf(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){Ve("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Sa,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],u=e[o+1];if(l!==u&&(o!==1||l!==e[0]))if(s)c=!0;else{let h=o*i,f=h-i,d=h+i;for(let x=0;x!==i;++x){let b=t[h+x];if(b!==t[f+x]||b!==t[d+x]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let h=o*i,f=a*i;for(let d=0;d!==i;++d)t[f+d]=t[h+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,c=a*i,l=0;l!==i;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,ya(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function gh(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function _h(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}mn.prototype.ValueTypeName="";mn.prototype.TimeBufferType=Float32Array;mn.prototype.ValueBufferType=Float32Array;mn.prototype.DefaultInterpolation=La;var Mi=class extends mn{constructor(e,t,i){super(e,t,i)}};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=tr;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var Xa=class extends mn{constructor(e,t,i,s){super(e,t,i,s)}};Xa.prototype.ValueTypeName="color";var qa=class extends mn{constructor(e,t,i,s){super(e,t,i,s)}};qa.prototype.ValueTypeName="number";var Ya=class extends vi{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-t)/(s-t),l=e*o;for(let u=l+o;l!==u;l+=4)Dn.slerpFlat(r,0,a,l-o,a,l,c);return r}},xr=class extends mn{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Ya(this.times,this.values,this.getValueSize(),e)}};xr.prototype.ValueTypeName="quaternion";xr.prototype.InterpolantFactoryMethodSmooth=void 0;var Si=class extends mn{constructor(e,t,i){super(e,t,i)}};Si.prototype.ValueTypeName="string";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=tr;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends mn{constructor(e,t,i,s){super(e,t,i,s)}};$a.prototype.ValueTypeName="vector";var Za=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=l.length;h<f;h+=2){let d=l[h],x=l[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},dd=new Za,Ja=class{constructor(e){this.manager=e!==void 0?e:dd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Ja.DEFAULT_MATERIAL_NAME="__DEFAULT";var bs=class extends Nt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},yr=class extends bs{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Gl=new Tt,xh=new k,yh=new k,vr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.mapType=rn,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _i,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;xh.setFromMatrixPosition(e.matrixWorld),t.position.copy(xh),yh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(yh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Gl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Gl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===fs||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Gl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},va=new k,Ma=new Dn,In=new k,Mr=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(va,Ma,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,Ma,In.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(va,Ma,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,Ma,In.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},pi=new k,vh=new Je,Mh=new Je,Jt=class extends Mr{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ki*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(js*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ki*2*Math.atan(Math.tan(js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(pi.x,pi.y).multiplyScalar(-e/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(pi.x,pi.y).multiplyScalar(-e/pi.z)}getViewSize(e,t){return this.getViewBounds(e,vh,Mh),t.subVectors(Mh,vh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(js*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Yl=class extends vr{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=ki*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Sr=class extends bs{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Yl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}};var br=class extends Mr{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},$l=class extends vr{constructor(){super(new br(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},wr=class extends bs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new $l}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var ls=-90,cs=1,ws=class extends Nt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(ls,cs,e,t);s.layers=this.layers,this.add(s);let r=new Jt(ls,cs,e,t);r.layers=this.layers,this.add(r);let a=new Jt(ls,cs,e,t);a.layers=this.layers,this.add(a);let o=new Jt(ls,cs,e,t);o.layers=this.layers,this.add(o);let c=new Jt(ls,cs,e,t);c.layers=this.layers,this.add(c);let l=new Jt(ls,cs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===vn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===fs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;let b=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=b,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}},Ka=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var Rc="\\[\\]\\.:\\/",fp=new RegExp("["+Rc+"]","g"),Cc="[^"+Rc+"]",pp="[^"+Rc.replace("\\.","")+"]",mp=/((?:WC+[\/:])*)/.source.replace("WC",Cc),gp=/(WCOD+)?/.source.replace("WCOD",pp),_p=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Cc),xp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Cc),yp=new RegExp("^"+mp+gp+_p+xp+"$"),vp=["material","materials","bones","map"],Zl=class{constructor(e,t,i){let s=i||At.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},At=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fp,"")}static parseTrackName(e){let t=yp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);vp.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=i(o.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ge("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ve("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ve("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ve("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ve("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){Ve("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;Ve("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};At.Composite=Zl;At.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};At.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};At.prototype.GetterByBindingType=[At.prototype._getValue_direct,At.prototype._getValue_array,At.prototype._getValue_arrayElement,At.prototype._getValue_toArray];At.prototype.SetterByBindingTypeAndVersioning=[[At.prototype._setValue_direct,At.prototype._setValue_direct_setNeedsUpdate,At.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[At.prototype._setValue_array,At.prototype._setValue_array_setNeedsUpdate,At.prototype._setValue_array_setMatrixWorldNeedsUpdate],[At.prototype._setValue_arrayElement,At.prototype._setValue_arrayElement_setNeedsUpdate,At.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[At.prototype._setValue_fromArray,At.prototype._setValue_fromArray_setNeedsUpdate,At.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Jx=new Float32Array(1);var Sh=new Tt,Tr=class{constructor(e,t,i=0,s=1/0){this.ray=new xs(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new gs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ve("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Sh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Sh),this}intersectObject(e,t=!0,i=[]){return Jl(e,this,i,t),i.sort(bh),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Jl(e[s],this,i,t);return i.sort(bh),i}};function bh(n,e){return n.distance-e.distance}function Jl(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let a=0,o=r.length;a<o;a++)Jl(r[a],e,t,!0)}}var Uc=class Uc{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};Uc.prototype.isMatrix2=!0;var Kl=Uc;function Ic(n,e,t,i){let s=Mp(i);switch(t){case gc:return n*e;case xc:return n*e/s.components*s.byteLength;case ro:return n*e/s.components*s.byteLength;case wi:return n*e*2/s.components*s.byteLength;case ao:return n*e*2/s.components*s.byteLength;case _c:return n*e*3/s.components*s.byteLength;case gn:return n*e*4/s.components*s.byteLength;case oo:return n*e*4/s.components*s.byteLength;case Rr:case Cr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ir:case Pr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case co:case ho:return Math.max(n,16)*Math.max(e,8)/4;case lo:case uo:return Math.max(n,8)*Math.max(e,8)/2;case fo:case po:case go:case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case mo:case Lr:case xo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Mo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case So:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case bo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case wo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case To:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ao:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ro:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Co:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Io:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Po:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Lo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Do:case No:case Uo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Fo:case Oo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Dr:case Bo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Mp(n){switch(n){case rn:case dc:return{byteLength:1,components:1};case Rs:case fc:case Cn:return{byteLength:2,components:1};case io:case so:return{byteLength:2,components:4};case An:case no:case Rn:return{byteLength:4,components:1};case pc:case mc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Nd(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function bp(n){let e=new WeakMap;function t(o,c){let l=o.array,u=o.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),o.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){let u=c.array,h=c.updateRanges;if(n.bindBuffer(l,o),h.length===0)n.bufferSubData(l,0,u);else{h.sort((d,x)=>d.start-x.start);let f=0;for(let d=1;d<h.length;d++){let x=h[f],b=h[d];b.start<=x.start+x.count+1?x.count=Math.max(x.count,b.start+b.count-x.start):(++f,h[f]=b)}h.length=f+1;for(let d=0,x=h.length;d<x;d++){let b=h[d];n.bufferSubData(l,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var wp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ap=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ip=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Pp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Dp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Np=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Up=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Op=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Bp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,qp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Yp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$p=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Kp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jp="gl_FragColor = linearToOutputTexel( gl_FragColor );",em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,im=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,am=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,om=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,um=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,hm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,mm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,gm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_m=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ym=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Mm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Sm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tm=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Am=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Im=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Dm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Om=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,km=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,zm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Hm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Vm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ym=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$m=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Km=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,e0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,n0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,i0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,s0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,r0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,a0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,o0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,l0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,c0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,u0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,h0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,d0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,f0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,p0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,m0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,g0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,x0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,M0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,S0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,b0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,w0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,T0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E0=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,I0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,P0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,L0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,D0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,N0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,F0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,O0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,B0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,z0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,H0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,W0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,X0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,J0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Q0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,j0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:wp,alphahash_pars_fragment:Tp,alphamap_fragment:Ep,alphamap_pars_fragment:Ap,alphatest_fragment:Rp,alphatest_pars_fragment:Cp,aomap_fragment:Ip,aomap_pars_fragment:Pp,batching_pars_vertex:Lp,batching_vertex:Dp,begin_vertex:Np,beginnormal_vertex:Up,bsdfs:Fp,iridescence_fragment:Op,bumpmap_pars_fragment:Bp,clipping_planes_fragment:kp,clipping_planes_pars_fragment:zp,clipping_planes_pars_vertex:Gp,clipping_planes_vertex:Hp,color_fragment:Vp,color_pars_fragment:Wp,color_pars_vertex:Xp,color_vertex:qp,common:Yp,defaultnormal_vertex:$p,displacementmap_pars_vertex:Zp,displacementmap_vertex:Jp,emissivemap_fragment:Kp,emissivemap_pars_fragment:Qp,colorspace_fragment:jp,colorspace_pars_fragment:em,envmap_fragment:tm,envmap_common_pars_fragment:nm,envmap_pars_fragment:im,envmap_pars_vertex:sm,envmap_physical_pars_fragment:mm,envmap_vertex:rm,fog_vertex:am,fog_pars_vertex:om,fog_fragment:lm,fog_pars_fragment:cm,gradientmap_pars_fragment:um,lightmap_pars_fragment:hm,lights_lambert_fragment:dm,lights_lambert_pars_fragment:fm,lights_pars_begin:pm,lights_toon_fragment:gm,lights_toon_pars_fragment:_m,lights_phong_fragment:xm,lights_phong_pars_fragment:ym,lights_physical_fragment:vm,lights_physical_pars_fragment:Mm,lights_fragment_begin:Sm,lights_fragment_maps:bm,lights_fragment_end:wm,lightprobes_pars_fragment:Tm,logdepthbuf_fragment:Em,logdepthbuf_pars_fragment:Am,logdepthbuf_pars_vertex:Rm,logdepthbuf_vertex:Cm,map_fragment:Im,map_pars_fragment:Pm,map_particle_fragment:Lm,map_particle_pars_fragment:Dm,metalnessmap_fragment:Nm,metalnessmap_pars_fragment:Um,morphinstance_vertex:Fm,morphcolor_vertex:Om,morphnormal_vertex:Bm,morphtarget_pars_vertex:km,morphtarget_vertex:zm,normal_fragment_begin:Gm,normal_fragment_maps:Hm,normal_pars_fragment:Vm,normal_pars_vertex:Wm,normal_vertex:Xm,normalmap_pars_fragment:qm,clearcoat_normal_fragment_begin:Ym,clearcoat_normal_fragment_maps:$m,clearcoat_pars_fragment:Zm,iridescence_pars_fragment:Jm,opaque_fragment:Km,packing:Qm,premultiplied_alpha_fragment:jm,project_vertex:e0,dithering_fragment:t0,dithering_pars_fragment:n0,roughnessmap_fragment:i0,roughnessmap_pars_fragment:s0,shadowmap_pars_fragment:r0,shadowmap_pars_vertex:a0,shadowmap_vertex:o0,shadowmask_pars_fragment:l0,skinbase_vertex:c0,skinning_pars_vertex:u0,skinning_vertex:h0,skinnormal_vertex:d0,specularmap_fragment:f0,specularmap_pars_fragment:p0,tonemapping_fragment:m0,tonemapping_pars_fragment:g0,transmission_fragment:_0,transmission_pars_fragment:x0,uv_pars_fragment:y0,uv_pars_vertex:v0,uv_vertex:M0,worldpos_vertex:S0,background_vert:b0,background_frag:w0,backgroundCube_vert:T0,backgroundCube_frag:E0,cube_vert:A0,cube_frag:R0,depth_vert:C0,depth_frag:I0,distance_vert:P0,distance_frag:L0,equirect_vert:D0,equirect_frag:N0,linedashed_vert:U0,linedashed_frag:F0,meshbasic_vert:O0,meshbasic_frag:B0,meshlambert_vert:k0,meshlambert_frag:z0,meshmatcap_vert:G0,meshmatcap_frag:H0,meshnormal_vert:V0,meshnormal_frag:W0,meshphong_vert:X0,meshphong_frag:q0,meshphysical_vert:Y0,meshphysical_frag:$0,meshtoon_vert:Z0,meshtoon_frag:J0,points_vert:K0,points_frag:Q0,shadow_vert:j0,shadow_frag:eg,sprite_vert:tg,sprite_frag:ng},we={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},On={basic:{uniforms:Qt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:Qt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new He(0)},envMapIntensity:{value:1}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:Qt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:Qt([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:Qt([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new He(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:Qt([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:Qt([we.points,we.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:Qt([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:Qt([we.common,we.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:Qt([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:Qt([we.sprite,we.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distance:{uniforms:Qt([we.common,we.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distance_vert,fragmentShader:et.distance_frag},shadow:{uniforms:Qt([we.lights,we.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};On.physical={uniforms:Qt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};var Go={r:0,b:0,g:0},ig=new Tt,Ud=new qe;Ud.set(-1,0,0,0,1,0,0,0,1);function sg(n,e,t,i,s,r){let a=new He(0),o=s===!0?0:1,c,l,u=null,h=0,f=null;function d(y){let w=y.isScene===!0?y.background:null;if(w&&w.isTexture){let M=y.backgroundBlurriness>0;w=e.get(w,M)}return w}function x(y){let w=!1,M=d(y);M===null?p(a,o):M&&M.isColor&&(p(M,1),w=!0);let C=n.xr.getEnvironmentBlendMode();C==="additive"?t.buffers.color.setClear(0,0,0,1,r):C==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function b(y,w){let M=d(w);M&&M.isCubeTexture?(l===void 0&&(l=new sn(new xi(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Yi(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,E,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ig.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ud),l.material.toneMapped=rt.getTransfer(M.colorSpace)!==gt,(u!==M||h!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new sn(new yi(2,2),new Mn({name:"BackgroundMaterial",uniforms:Yi(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=rt.getTransfer(M.colorSpace)!==gt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,w){y.getRGB(Go,Ac(n)),t.buffers.color.setClear(Go.r,Go.g,Go.b,w,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,w=1){a.set(y),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:x,addToRenderList:b,dispose:m}}function rg(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,a=!1;function o(F,O,q,L,W){let Z=!1,Y=h(F,L,q,O);r!==Y&&(r=Y,l(r.object)),Z=d(F,L,q,W),Z&&x(F,L,q,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,M(F,O,q,L),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return n.createVertexArray()}function l(F){return n.bindVertexArray(F)}function u(F){return n.deleteVertexArray(F)}function h(F,O,q,L){let W=L.wireframe===!0,Z=i[O.id];Z===void 0&&(Z={},i[O.id]=Z);let Y=F.isInstancedMesh===!0?F.id:0,re=Z[Y];re===void 0&&(re={},Z[Y]=re);let J=re[q.id];J===void 0&&(J={},re[q.id]=J);let ie=J[W];return ie===void 0&&(ie=f(c()),J[W]=ie),ie}function f(F){let O=[],q=[],L=[];for(let W=0;W<t;W++)O[W]=0,q[W]=0,L[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:q,attributeDivisors:L,object:F,attributes:{},index:null}}function d(F,O,q,L){let W=r.attributes,Z=O.attributes,Y=0,re=q.getAttributes();for(let J in re)if(re[J].location>=0){let se=W[J],Ie=Z[J];if(Ie===void 0&&(J==="instanceMatrix"&&F.instanceMatrix&&(Ie=F.instanceMatrix),J==="instanceColor"&&F.instanceColor&&(Ie=F.instanceColor)),se===void 0||se.attribute!==Ie||Ie&&se.data!==Ie.data)return!0;Y++}return r.attributesNum!==Y||r.index!==L}function x(F,O,q,L){let W={},Z=O.attributes,Y=0,re=q.getAttributes();for(let J in re)if(re[J].location>=0){let se=Z[J];se===void 0&&(J==="instanceMatrix"&&F.instanceMatrix&&(se=F.instanceMatrix),J==="instanceColor"&&F.instanceColor&&(se=F.instanceColor));let Ie={};Ie.attribute=se,se&&se.data&&(Ie.data=se.data),W[J]=Ie,Y++}r.attributes=W,r.attributesNum=Y,r.index=L}function b(){let F=r.newAttributes;for(let O=0,q=F.length;O<q;O++)F[O]=0}function p(F){m(F,0)}function m(F,O){let q=r.newAttributes,L=r.enabledAttributes,W=r.attributeDivisors;q[F]=1,L[F]===0&&(n.enableVertexAttribArray(F),L[F]=1),W[F]!==O&&(n.vertexAttribDivisor(F,O),W[F]=O)}function y(){let F=r.newAttributes,O=r.enabledAttributes;for(let q=0,L=O.length;q<L;q++)O[q]!==F[q]&&(n.disableVertexAttribArray(q),O[q]=0)}function w(F,O,q,L,W,Z,Y){Y===!0?n.vertexAttribIPointer(F,O,q,W,Z):n.vertexAttribPointer(F,O,q,L,W,Z)}function M(F,O,q,L){b();let W=L.attributes,Z=q.getAttributes(),Y=O.defaultAttributeValues;for(let re in Z){let J=Z[re];if(J.location>=0){let ie=W[re];if(ie===void 0&&(re==="instanceMatrix"&&F.instanceMatrix&&(ie=F.instanceMatrix),re==="instanceColor"&&F.instanceColor&&(ie=F.instanceColor)),ie!==void 0){let se=ie.normalized,Ie=ie.itemSize,We=e.get(ie);if(We===void 0)continue;let j=We.buffer,ye=We.type,Ae=We.bytesPerElement,ke=ye===n.INT||ye===n.UNSIGNED_INT||ie.gpuType===no;if(ie.isInterleavedBufferAttribute){let Se=ie.data,Ye=Se.isInterleavedBuffer===!0?Se.stride:Se.itemSize,ut=ie.offset;if(Se.isInstancedInterleavedBuffer||Se.isInstancedBufferAttribute){for(let ze=0;ze<J.locationSize;ze++)m(J.location+ze,Se.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let ze=0;ze<J.locationSize;ze++)p(J.location+ze);n.bindBuffer(n.ARRAY_BUFFER,j);for(let ze=0;ze<J.locationSize;ze++)w(J.location+ze,Ie/J.locationSize,ye,se,Ye*Ae,(ut+Ie/J.locationSize*ze)*Ae,ke)}else{if(ie.isInstancedBufferAttribute){for(let Se=0;Se<J.locationSize;Se++)m(J.location+Se,ie.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Se=0;Se<J.locationSize;Se++)p(J.location+Se);n.bindBuffer(n.ARRAY_BUFFER,j);for(let Se=0;Se<J.locationSize;Se++)w(J.location+Se,Ie/J.locationSize,ye,se,Ie*Ae,Ie/J.locationSize*Se*Ae,ke)}}else if(Y!==void 0){let se=Y[re];if(se!==void 0)switch(se.length){case 2:n.vertexAttrib2fv(J.location,se);break;case 3:n.vertexAttrib3fv(J.location,se);break;case 4:n.vertexAttrib4fv(J.location,se);break;default:n.vertexAttrib1fv(J.location,se)}}}}y()}function C(){N();for(let F in i){let O=i[F];for(let q in O){let L=O[q];for(let W in L){let Z=L[W];for(let Y in Z)u(Z[Y].object),delete Z[Y];delete L[W]}}delete i[F]}}function E(F){if(i[F.id]===void 0)return;let O=i[F.id];for(let q in O){let L=O[q];for(let W in L){let Z=L[W];for(let Y in Z)u(Z[Y].object),delete Z[Y];delete L[W]}}delete i[F.id]}function _(F){for(let O in i){let q=i[O];for(let L in q){let W=q[L];if(W[F.id]===void 0)continue;let Z=W[F.id];for(let Y in Z)u(Z[Y].object),delete Z[Y];delete W[F.id]}}}function T(F){for(let O in i){let q=i[O],L=F.isInstancedMesh===!0?F.id:0,W=q[L];if(W!==void 0){for(let Z in W){let Y=W[Z];for(let re in Y)u(Y[re].object),delete Y[re];delete W[Z]}delete q[L],Object.keys(q).length===0&&delete i[O]}}}function N(){I(),a=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:N,resetDefaultState:I,dispose:C,releaseStatesOfGeometry:E,releaseStatesOfObject:T,releaseStatesOfProgram:_,initAttributes:b,enableAttribute:p,disableUnusedAttributes:y}}function ag(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let f=0;for(let d=0;d<u;d++)f+=l[d];t.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function og(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let _=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==gn&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){let T=_===Cn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==rn&&_!==Rn&&!T&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Ge("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&Ge("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&Ge("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:x,maxTextureSize:b,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:w,maxFragmentUniforms:M,maxSamples:C,samples:E}}function lg(n){let e=this,t=null,i=0,s=!1,r=!1,a=new hn,o=new qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let d=h.length!==0||f||i!==0||s;return s=f,i=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){let x=h.clippingPlanes,b=h.clipIntersection,p=h.clipShadows,m=n.get(h);if(!s||x===null||x.length===0||r&&!p)r?u(null):l();else{let y=r?0:i,w=y*4,M=m.clippingState||null;c.value=M,M=u(x,f,w,d);for(let C=0;C!==w;++C)M[C]=t[C];m.clippingState=M,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,x){let b=h!==null?h.length:0,p=null;if(b!==0){if(p=c.value,x!==!0||p===null){let m=d+b*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,M=d;w!==b;++w,M+=4)a.copy(h[w]).applyMatrix4(y,o),a.normal.toArray(p,M),p[M+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,p}}var Fr=class extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new hr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xi(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:Yi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:tn,blending:Vi});r.uniforms.tEquirect.value=t;let a=new sn(s,r),o=t.minFilter;return t.minFilter===ei&&(t.minFilter=Wt),new ws(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},fd=256,cg=3,ug=20,Fd=256,Od=16,hg=3,dg=new k,fg=new He,Vo=class n{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ws(1,10,null),this._boxMesh=new sn(new xi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:a=256,position:o=dg}=r,c=this._renderer;this._setSize(a);let l=this._allocateTarget(),u=this._getSourceTarget(!0);t>0&&(u.texture.mipmapsAutoUpdate=!1);let h=c.autoClear,f=c.autoClearColor,d=c.autoClearDepth,x=c.autoClearStencil,b=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,b===null&&(e.background=c.getClearColor(fg));let p=new ws(i,s,u);return p.position.copy(o),p.update(c,e),c.autoClear=h,c.autoClearColor=f,c.autoClearDepth=d,c.autoClearStencil=x,e.background=b,t>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=md(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(fd,Tc(e))}_fromTexture(e,t){e.mapping===Xi||e.mapping===As?this._setSize(e.image.length===0?fd:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){let e=this._cubeSize,t=pd(e,!1,!1),i=Math.log2(e)-cg;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=pd(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){let s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Xi||e.mapping===As?(this._cubemapMaterial===null&&(this._cubemapMaterial=gd()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=md()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=pg(),this._integrationMaterial=mg());let t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Od);for(let a=0;a<=i;a++){let o=n.lodToRoughness(a,i);if(a>i-hg)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{let c=o>0?Math.log2(t)+.5*Math.log2(6/(Fd*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=c,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=gg());let i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}};function pd(n,e,t){return new Fr(n,{minFilter:ei,generateMipmaps:e,type:Cn,colorSpace:nr,depthBuffer:t})}function Or(n,e,t){return new Mn({name:n,uniforms:e,vertexShader:et.cube_vert,fragmentShader:t,side:tn,blending:Vi,depthTest:!1,depthWrite:!1})}function pg(){return Or("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Fd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function mg(){return Or("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Od}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function gg(){return Or("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ug}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function md(){return Or("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function gd(){return Or("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function _g(n){let e=new WeakMap,t=new WeakMap,i=null;function s(f,d=!1){return f==null?null:d?a(f):r(f)}function r(f){if(f&&f.isTexture){let d=f.mapping;if(d===ja||d===eo)if(e.has(f)){let x=e.get(f).texture;return o(x,f.mapping)}else{let x=f.image;if(x&&x.height>0){let b=new Fr(x.height);return b.fromEquirectangularTexture(n,f),e.set(f,b),f.addEventListener("dispose",l),o(b.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,x=d===ja||d===eo,b=d===Xi||d===As;if(x||b){let p=t.get(f),m=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return i===null&&(i=new Vo(n)),p=x?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{let y=f.image;return x&&y&&y.height>0||b&&y&&c(y)?(i===null&&(i=new Vo(n)),p=x?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,d){return d===ja?f.mapping=Xi:d===eo&&(f.mapping=As),f}function c(f){let d=0,x=6;for(let b=0;b<x;b++)f[b]!==void 0&&d++;return d===x}function l(f){let d=f.target;d.removeEventListener("dispose",l);let x=e.get(d);x!==void 0&&(e.delete(d),x.dispose())}function u(f){let d=f.target;d.removeEventListener("dispose",u);let x=t.get(d);x!==void 0&&(t.delete(d),x.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function xg(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Qs("WebGLRenderer: "+i+" extension not supported."),s}}}function yg(n,e,t,i){let s={},r=new WeakMap,a=new FinalizationRegistry(x=>delete s[x]);function o(x){c(x.target)}function c(x){x.index!==null&&e.remove(x.index);for(let p in x.attributes)e.remove(x.attributes[p]);x.removeEventListener("dispose",o),delete s[x.id],a.unregister(x);let b=r.get(x);b&&(e.remove(b),r.delete(x)),i.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,t.memory.geometries--}function l(x,b){return s[b.id]!==void 0||(b.addEventListener("dispose",o),s[b.id]=new WeakRef(b),a.register(b,b.id,b),t.memory.geometries++),b}function u(x){let b=x.attributes;for(let p in b)e.update(b[p],n.ARRAY_BUFFER)}function h(x){let b=x.index,p=x.attributes.position,m=0;if(p===void 0)return;let y=b!==null?b.array.length:p.array.length/3-1,w=p.count>=65535?cr:lr,M=new w(Math.ceil(y/3)*6,1),C=M.array;if(b!==null){let _=b.array;m=b.version;for(let T=0,N=0;T<y;T+=3){let I=_[T+0],F=_[T+1],O=_[T+2];C[N++]=I,C[N++]=F,C[N++]=F,C[N++]=O,C[N++]=O,C[N++]=I}}else{m=p.version;for(let _=0,T=0;_<y;_+=3){let N=_+0,I=_+1,F=_+2;C[T++]=N,C[T++]=I,C[T++]=I,C[T++]=F,C[T++]=F,C[T++]=N}}M.version=m;let E=r.get(x);E&&e.remove(E),r.set(x,M)}function f(x){let b=r.get(x);if(b){let p=x.index;p!==null&&b.version<p.version&&h(x)}else h(x);return r.get(x)}function d(){for(let x in s){let b=s[x].deref();b!==void 0&&c(b)}}return{get:l,update:u,getWireframeAttribute:f,dispose:d}}function vg(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function c(h,f){n.drawElements(i,f,r,h*a),t.update(f,i,1)}function l(h,f,d){d!==0&&(n.drawElementsInstanced(i,f,r,h*a,d),t.update(f,i,d))}function u(h,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,h,0,d);let b=0;for(let p=0;p<d;p++)b+=f[p];t.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Mg(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Ve("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Sg(n,e,t){let i=new WeakMap,s=new Rt;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(o);if(f===void 0||f.count!==h){let N=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",N)};f!==void 0&&f.texture.dispose();let d=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],w=0;d===!0&&(w=1),x===!0&&(w=2),b===!0&&(w=3);let M=o.attributes.position.count*w,C=1;M>e.maxTextureSize&&(C=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let E=new Float32Array(M*C*4*h),_=new rr(E,M,C,h);_.type=Rn,_.needsUpdate=!0;let T=w*4;for(let I=0;I<h;I++){let F=p[I],O=m[I],q=y[I],L=M*C*4*I;for(let W=0;W<F.count;W++){let Z=W*T;d===!0&&(s.fromBufferAttribute(F,W),E[L+Z+0]=s.x,E[L+Z+1]=s.y,E[L+Z+2]=s.z,E[L+Z+3]=0),x===!0&&(s.fromBufferAttribute(O,W),E[L+Z+4]=s.x,E[L+Z+5]=s.y,E[L+Z+6]=s.z,E[L+Z+7]=0),b===!0&&(s.fromBufferAttribute(q,W),E[L+Z+8]=s.x,E[L+Z+9]=s.y,E[L+Z+10]=s.z,E[L+Z+11]=q.itemSize===4?s.w:1)}}f={count:h,texture:_,size:new Je(M,C)},i.set(o,f),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let d=0;for(let b=0;b<l.length;b++)d+=l[b];let x=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function bg(n,e,t,i,s){let r=new WeakMap;function a(l){let u=s.render.frame,h=l.geometry,f=e.get(l,h);if(r.get(f)!==u&&(e.update(f),r.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return f}function o(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var wg={[rc]:"LINEAR_TONE_MAPPING",[ac]:"REINHARD_TONE_MAPPING",[oc]:"CINEON_TONE_MAPPING",[Er]:"ACES_FILMIC_TONE_MAPPING",[cc]:"AGX_TONE_MAPPING",[uc]:"NEUTRAL_TONE_MAPPING",[lc]:"CUSTOM_TONE_MAPPING"};function Tg(n,e,t,i,s,r){let a=new pn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=null,u=new Kt;u.setAttribute("position",new vt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new vt([0,2,0,0,2,0],2));let h=new Ba({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new sn(u,h),d=new br(-1,1,1,-1,0,1),x=null,b=null,p=!1,m,y=null,w=[],M=!1;this.setSize=function(C,E){a.setSize(C,E),o!==null&&o.setSize(C,E),c!==null&&c.setSize(C,E);for(let _=0;_<w.length;_++){let T=w[_];T.setSize&&T.setSize(C,E)}},this.setEffects=function(C){w=C,M=w.length>0&&w[0].isRenderPass===!0;let E=a.width,_=a.height;w.length>0&&o===null&&(o=new pn(E,_,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),c=new pn(E,_,{type:Cn,depthBuffer:!1,stencilBuffer:!1}));let T=s===!0&&w.some(N=>N.needsDepthTexture===!0);T!==(a.depthTexture!==null)&&(T===!0&&l===null&&(l=new jn(E,_),r===!0&&(l.format=ti,l.type=qi)),a.dispose(),a.depthTexture=T?l:null,a.resolveDepthBuffer=T,a.storeMultisampledDepthBuffer=T);for(let N=0;N<w.length;N++){let I=w[N];I.setSize&&I.setSize(E,_),T&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(l)}},this.begin=function(C,E){if(p||C.toneMapping===Un&&w.length===0)return!1;if(y=E,E!==null){let _=E.width,T=E.height;(a.width!==_||a.height!==T)&&this.setSize(_,T)}return M===!1&&C.setRenderTarget(a),m=C.toneMapping,C.toneMapping=Un,!0},this.hasRenderPass=function(){return M},this.end=function(C,E){C.toneMapping=m,p=!0;let _=a,T=o;for(let N=0;N<w.length;N++){let I=w[N];I.enabled!==!1&&(I.render(C,T,_,E),I.needsSwap!==!1&&(_=T,T=T===o?c:o))}if(x!==C.outputColorSpace||b!==C.toneMapping){x=C.outputColorSpace,b=C.toneMapping,h.defines={},rt.getTransfer(x)===gt&&(h.defines.SRGB_TRANSFER="");let N=wg[b];N&&(h.defines[N]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=_.texture,C.setRenderTarget(y),C.render(f,d),y=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),u.dispose(),h.dispose()}}var Bd=new en,kd=new jn(1,1),zd=new dr(1),Gd=new rr,Hd=new Ua,Vd=new hr,_d=[],xd=[],yd=new Float32Array(16),vd=new Float32Array(9),Md=new Float32Array(4);function Ps(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=_d[s];if(r===void 0&&(r=new Float32Array(s),_d[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Ut(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ft(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Xo(n,e){let t=xd[e];t===void 0&&(t=new Int32Array(e),xd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Eg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ag(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2fv(this.addr,e),Ft(t,e)}}function Rg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;n.uniform3fv(this.addr,e),Ft(t,e)}}function Cg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4fv(this.addr,e),Ft(t,e)}}function Ig(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,i))return;Md.set(i),n.uniformMatrix2fv(this.addr,!1,Md),Ft(t,i)}}function Pg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,i))return;vd.set(i),n.uniformMatrix3fv(this.addr,!1,vd),Ft(t,i)}}function Lg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,i))return;yd.set(i),n.uniformMatrix4fv(this.addr,!1,yd),Ft(t,i)}}function Dg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ng(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2iv(this.addr,e),Ft(t,e)}}function Ug(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3iv(this.addr,e),Ft(t,e)}}function Fg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4iv(this.addr,e),Ft(t,e)}}function Og(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Bg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2uiv(this.addr,e),Ft(t,e)}}function kg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3uiv(this.addr,e),Ft(t,e)}}function zg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4uiv(this.addr,e),Ft(t,e)}}function qo(n){return n.version===0&&(n.compareFunction=Mc,n.needsUpdate=!0),n}function Gg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=qo(kd):r=Bd,t.setTexture2D(e||r,s)}function Hg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Hd,s)}function Vg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=qo(zd):r=Vd,t.setTextureCube(e||r,s)}function Wg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Gd,s)}function Xg(n){switch(n){case 5126:return Eg;case 35664:return Ag;case 35665:return Rg;case 35666:return Cg;case 35674:return Ig;case 35675:return Pg;case 35676:return Lg;case 5124:case 35670:return Dg;case 35667:case 35671:return Ng;case 35668:case 35672:return Ug;case 35669:case 35673:return Fg;case 5125:return Og;case 36294:return Bg;case 36295:return kg;case 36296:return zg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Wg}}function qg(n,e){n.uniform1fv(this.addr,e)}function Yg(n,e){let t=Ps(e,this.size,2);n.uniform2fv(this.addr,t)}function $g(n,e){let t=Ps(e,this.size,3);n.uniform3fv(this.addr,t)}function Zg(n,e){let t=Ps(e,this.size,4);n.uniform4fv(this.addr,t)}function Jg(n,e){let t=Ps(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Kg(n,e){let t=Ps(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Qg(n,e){let t=Ps(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function jg(n,e){n.uniform1iv(this.addr,e)}function e_(n,e){n.uniform2iv(this.addr,e)}function t_(n,e){n.uniform3iv(this.addr,e)}function n_(n,e){n.uniform4iv(this.addr,e)}function i_(n,e){n.uniform1uiv(this.addr,e)}function s_(n,e){n.uniform2uiv(this.addr,e)}function r_(n,e){n.uniform3uiv(this.addr,e)}function a_(n,e){n.uniform4uiv(this.addr,e)}function o_(n,e,t){let i=this.cache,s=e.length,r=Xo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Ft(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=qo(kd):a=Bd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function l_(n,e,t){let i=this.cache,s=e.length,r=Xo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Ft(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Hd,r[a])}function c_(n,e,t){let i=this.cache,s=e.length,r=Xo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Ft(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=qo(zd):a=Vd;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function u_(n,e,t){let i=this.cache,s=e.length,r=Xo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Ft(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Gd,r[a])}function h_(n){switch(n){case 5126:return qg;case 35664:return Yg;case 35665:return $g;case 35666:return Zg;case 35674:return Jg;case 35675:return Kg;case 35676:return Qg;case 5124:case 35670:return jg;case 35667:case 35671:return e_;case 35668:case 35672:return t_;case 35669:case 35673:return n_;case 5125:return i_;case 36294:return s_;case 36295:return r_;case 36296:return a_;case 35678:case 36198:case 36298:case 36306:case 35682:return o_;case 35679:case 36299:case 36307:return l_;case 35680:case 36300:case 36308:case 36293:return c_;case 36289:case 36303:case 36311:case 36292:return u_}}var Bc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Xg(t.type)}},kc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=h_(t.type)}},zc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},Fc=/(\w+)(\])?(\[|\.)?/g;function Sd(n,e){n.seq.push(e),n.map[e.id]=e}function d_(n,e,t){let i=n.name,s=i.length;for(Fc.lastIndex=0;;){let r=Fc.exec(i),a=Fc.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Sd(t,l===void 0?new Bc(o,n,e):new kc(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new zc(o),Sd(t,h)),t=h}}}var Is=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){let o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);d_(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function bd(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var f_=37297,p_=0;function m_(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var wd=new qe;function g_(n){rt._getMatrix(wd,rt.workingColorSpace,n);let e=`mat3( ${wd.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(n)){case ir:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Td(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+m_(n.getShaderSource(e),o)}else return r}function __(n,e){let t=g_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var x_={[rc]:"Linear",[ac]:"Reinhard",[oc]:"Cineon",[Er]:"ACESFilmic",[cc]:"AgX",[uc]:"Neutral",[lc]:"Custom"};function y_(n,e){let t=x_[e];return t===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ho=new k;function v_(){rt.getLuminanceCoefficients(Ho);let n=Ho.x.toFixed(4),e=Ho.y.toFixed(4),t=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function M_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ur).join(`
`)}function S_(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function b_(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ur(n){return n!==""}function Ed(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Ad(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var w_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gc(n){return n.replace(w_,T_)}function T_(n,e){let t=et[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Gc(t)}var E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rd(n){return n.replace(E_,A_)}function A_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Cd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var R_={[Hi]:"SHADOWMAP_TYPE_PCF",[Ts]:"SHADOWMAP_TYPE_VSM"};function C_(n){return R_[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var I_={[As]:"ENVMAP_MODE_REFRACTION"};function P_(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":I_[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var L_={[sc]:"ENVMAP_BLENDING_MULTIPLY",[Xh]:"ENVMAP_BLENDING_MIX",[qh]:"ENVMAP_BLENDING_ADD"};function D_(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":L_[n.combine]||"ENVMAP_BLENDING_NONE"}function N_(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=C_(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=P_(t),h=D_(t),f=M_(t),d=S_(r),x=s.createProgram(),b,p,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(b=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ur).join(`
`),b.length>0&&(b+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ur).join(`
`),p.length>0&&(p+=`
`)):(b=[Cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ur).join(`
`),p=[Cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Un?"#define TONE_MAPPING":"",t.toneMapping!==Un?et.tonemapping_pars_fragment:"",t.toneMapping!==Un?y_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,__("linearToOutputTexel",t.outputColorSpace),v_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ur).join(`
`)),a=Gc(a),a=Ed(a,t),a=Ad(a,t),o=Gc(o),o=Ed(o,t),o=Ad(o,t),a=Rd(a),o=Rd(o),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,b=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+b,p=["#define varying in",t.glslVersion===Sc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=m+b+a,w=m+p+o,M=bd(s,s.VERTEX_SHADER,y),C=bd(s,s.FRAGMENT_SHADER,w);s.attachShader(x,M),s.attachShader(x,C),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(I){if(n.debug.checkShaderErrors){let F=s.getProgramInfoLog(x)||"",O=s.getShaderInfoLog(M)||"",q=s.getShaderInfoLog(C)||"",L=F.trim(),W=O.trim(),Z=q.trim(),Y=!0,re=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,M,C);else{let J=Td(s,M,"vertex"),ie=Td(s,C,"fragment");Ve("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+L+`
`+J+`
`+ie)}else L!==""?Ge("WebGLProgram: Program Info Log:",L):(W===""||Z==="")&&(re=!1);re&&(I.diagnostics={runnable:Y,programLog:L,vertexShader:{log:W,prefix:b},fragmentShader:{log:Z,prefix:p}})}s.deleteShader(M),s.deleteShader(C),_=new Is(s,x),T=b_(s,x)}let _;this.getUniforms=function(){return _===void 0&&E(this),_};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(x,f_)),N},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=p_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=M,this.fragmentShader=C,this}var U_=0,Hc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Vc(e),t.set(e,i)),i}},Vc=class{constructor(e){this.id=U_++,this.code=e,this.usedTimes=0}};function F_(n){return n===wi||n===Lr||n===Dr}function O_(n,e,t,i,s,r){let a=new gs,o=new Hc,c=new Set,l=[],u=new Map,h=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return c.add(_),_===0?"uv":`uv${_}`}function x(_,T,N,I,F,O){let q=I.fog,L=F.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,Z=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Y=e.get(_.envMap||W,Z),re=f[_.type],J=i.precision;_.precision!==null&&(J=i.getMaxPrecision(_.precision),J!==_.precision&&Ge("WebGLProgram.getParameters:",_.precision,"not supported, using",J,"instead."));let ie=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,se=ie!==void 0?ie.length:0,Ie=0;L.morphAttributes.position!==void 0&&(Ie=1),L.morphAttributes.normal!==void 0&&(Ie=2),L.morphAttributes.color!==void 0&&(Ie=3);let We,j,ye,Ae;if(re){let be=On[re];We=be.vertexShader,j=be.fragmentShader}else{We=_.vertexShader,j=_.fragmentShader;let be=o.getVertexShaderStage(_),yt=o.getFragmentShaderStage(_);o.update(_,be,yt),ye=be.id,Ae=yt.id}let ke=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),Ye=F.isInstancedMesh===!0,ut=F.isBatchedMesh===!0,ze=!!_.map,ht=!!_.matcap,_t=!!Y,$=_t&&Y.isPMREMTexture===!0,ce=!!_.aoMap,Me=!!_.lightMap,Ee=!!_.bumpMap&&_.wireframe===!1,ve=!!_.normalMap,de=!!_.displacementMap,Ue=!!_.emissiveMap,nt=!!_.metalnessMap,Ze=!!_.roughnessMap,Et=_.anisotropy>0,D=_.clearcoat>0,dt=_.diffuseRoughness>0,lt=_.dispersion>0,xt=_.retroreflectivity>0,me=_.iridescence>0,It=_.sheen>0,Fe=_.transmission>0,Xe=Et&&!!_.anisotropyMap,R=D&&!!_.clearcoatMap,v=D&&!!_.clearcoatNormalMap,B=D&&!!_.clearcoatRoughnessMap,ae=dt&&!!_.diffuseRoughnessMap,ne=me&&!!_.iridescenceMap,ue=me&&!!_.iridescenceThicknessMap,_e=It&&!!_.sheenColorMap,Q=It&&!!_.sheenRoughnessMap,ee=!!_.specularMap,fe=!!_.specularColorMap,P=!!_.specularIntensityMap,te=Fe&&!!_.transmissionMap,K=Fe&&!!_.thicknessMap,pe=!!_.gradientMap,le=!!_.alphaMap,he=_.alphaTest>0,Ne=!!_.alphaHash,je=!!_.extensions,oe=Un;_.toneMapped&&(ke===null||ke.isXRRenderTarget===!0)&&(oe=n.toneMapping);let Be=$?Y.isCompressedCubeTexture?Y.image[0].mipmaps:Y.mipmaps:null,Qe={shaderID:re,shaderType:_.type,shaderName:_.name,vertexShader:We,fragmentShader:j,defines:_.defines,customVertexShaderID:ye,customFragmentShaderID:Ae,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:J,batching:ut,batchingColor:ut&&F._colorsTexture!==null,instancing:Ye,instancingColor:Ye&&F.instanceColor!==null,instancingMorph:Ye&&F.morphTexture!==null,outputColorSpace:ke===null?n.outputColorSpace:ke.isXRRenderTarget===!0?ke.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:ze,matcap:ht,envMap:_t,envMapMode:_t&&Y.mapping,envMapPMREM:$,envMapMaxLod:$?Be.length-1:null,envMapSize:$?Be[0].width:null,aoMap:ce,lightMap:Me,bumpMap:Ee,normalMap:ve,displacementMap:de,emissiveMap:Ue,normalMapObjectSpace:ve&&_.normalMapType===Zh,normalMapTangentSpace:ve&&_.normalMapType===ko,packedNormalMap:ve&&_.normalMapType===ko&&F_(_.normalMap.format),metalnessMap:nt,roughnessMap:Ze,anisotropy:Et,anisotropyMap:Xe,clearcoat:D,clearcoatMap:R,clearcoatNormalMap:v,clearcoatRoughnessMap:B,diffuseRoughness:dt,diffuseRoughnessMap:ae,dispersion:lt,retroreflection:xt,iridescence:me,iridescenceMap:ne,iridescenceThicknessMap:ue,sheen:It,sheenColorMap:_e,sheenRoughnessMap:Q,specularMap:ee,specularColorMap:fe,specularIntensityMap:P,transmission:Fe,transmissionMap:te,thicknessMap:K,gradientMap:pe,opaque:_.transparent===!1&&_.blending===Es&&_.alphaToCoverage===!1,alphaMap:le,alphaTest:he,alphaHash:Ne,combine:_.combine,mapUv:ze&&d(_.map.channel),aoMapUv:ce&&d(_.aoMap.channel),lightMapUv:Me&&d(_.lightMap.channel),bumpMapUv:Ee&&d(_.bumpMap.channel),normalMapUv:ve&&d(_.normalMap.channel),displacementMapUv:de&&d(_.displacementMap.channel),emissiveMapUv:Ue&&d(_.emissiveMap.channel),metalnessMapUv:nt&&d(_.metalnessMap.channel),roughnessMapUv:Ze&&d(_.roughnessMap.channel),anisotropyMapUv:Xe&&d(_.anisotropyMap.channel),clearcoatMapUv:R&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:v&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ae&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:ne&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:Q&&d(_.sheenRoughnessMap.channel),specularMapUv:ee&&d(_.specularMap.channel),specularColorMapUv:fe&&d(_.specularColorMap.channel),specularIntensityMapUv:P&&d(_.specularIntensityMap.channel),transmissionMapUv:te&&d(_.transmissionMap.channel),thicknessMapUv:K&&d(_.thicknessMap.channel),alphaMapUv:le&&d(_.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ve||Et),vertexNormals:!!L.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!L.attributes.uv&&(ze||le),fog:!!q,useFog:_.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||L.attributes.normal===void 0&&ve===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Se,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Ie,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:O.filter(be=>be.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:ze&&_.map.isVideoTexture===!0&&rt.getTransfer(_.map.colorSpace)===gt,decodeVideoTextureEmissive:Ue&&_.emissiveMap.isVideoTexture===!0&&rt.getTransfer(_.emissiveMap.colorSpace)===gt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Nn,flipSided:_.side===tn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:je&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&_.extensions.multiDraw===!0||ut)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function b(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let N in _.defines)T.push(N),T.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(p(T,_),m(T,_),T.push(n.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapPMREM),_.push(T.envMapMaxLod),_.push(T.envMapSize),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.diffuseRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.numLightProbeGrids),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function m(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.diffuseRoughness&&a.enable(25),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function y(_){let T=f[_.type],N;if(T){let I=On[T];N=ud.clone(I.uniforms)}else N=_.uniforms;return N}function w(_,T){let N=u.get(T);return N!==void 0?++N.usedTimes:(N=new N_(n,T,_,s),l.push(N),u.set(T,N)),N}function M(_){if(--_.usedTimes===0){let T=l.indexOf(_);l[T]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function C(_){o.remove(_)}function E(){o.dispose()}return{getParameters:x,getProgramCacheKey:b,getUniforms:y,acquireProgram:w,releaseProgram:M,releaseShaderCache:C,programs:l,dispose:E}}function B_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function k_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Id(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Pd(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,x,b,p,m){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:d,material:x,materialVariant:a(f),groupOrder:b,renderOrder:f.renderOrder,z:p,group:m},n[e]=y):(y.id=f.id,y.object=f,y.geometry=d,y.material=x,y.materialVariant=a(f),y.groupOrder=b,y.renderOrder=f.renderOrder,y.z=p,y.group=m),e++,y}function c(f,d,x,b,p,m,y){y.reversedDepth===!0&&(p=-p);let w=o(f,d,x,b,p,m);x.transmission>0?i.push(w):x.transparent===!0?s.push(w):t.push(w)}function l(f,d,x,b,p,m){let y=o(f,d,x,b,p,m);x.transmission>0?i.unshift(y):x.transparent===!0?s.unshift(y):t.unshift(y)}function u(f,d){t.length>1&&t.sort(f||k_),i.length>1&&i.sort(d||Id),s.length>1&&s.sort(d||Id)}function h(){for(let f=e,d=n.length;f<d;f++){let x=n[f];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:h,sort:u}}function z_(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new Pd,n.set(i,[a])):s>=r.length?(a=new Pd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function G_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new k,color:new He};break;case"SpotLight":t={position:new k,direction:new k,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new k,halfWidth:new k,halfHeight:new k};break}return n[e.id]=t,t}}}function H_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var V_=0;function W_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function X_(n){let e=new G_,t=H_(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new k);let s=new k,r=new Tt,a=new Tt;function o(l){let u=0,h=0,f=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let d=0,x=0,b=0,p=0,m=0,y=0,w=0,M=0,C=0,E=0,_=0,T=0,N=0,I=0;l.sort(W_);for(let O=0,q=l.length;O<q;O++){let L=l[O],W=L.color,Z=L.intensity,Y=L.distance,re=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===wi?re=L.shadow.map.texture:re=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=W.r*Z,h+=W.g*Z,f+=W.b*Z;else if(L.isLightProbe){for(let J=0;J<9;J++)i.probe[J].addScaledVector(L.sh.coefficients[J],Z);I++}else if(L.isSunLight){let J=e.get(L);if(J.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let ie=L.shadow,se=t.get(L);se.shadowIntensity=ie.intensity,se.shadowBias=ie.bias,se.shadowNormalBias=ie.normalBias,se.shadowRadius=ie.radius,se.shadowMapSize.copy(ie.mapSize).multiply(ie.getFrameExtents()),i.sunShadow[x]=se,i.sunShadowMap[x]=re;let Ie=ie.getViewportCount();for(let We=0;We<Ie;We++)i.sunShadowMatrix[b+We]=ie.getMatrix(We),i.sunShadowCascade[b+We]=ie._cascadeData[We];b+=Ie,x++}i.sun[d]=J,d++}else if(L.isDirectionalLight){let J=e.get(L);if(J.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let ie=L.shadow,se=t.get(L);se.shadowIntensity=ie.intensity,se.shadowBias=ie.bias,se.shadowNormalBias=ie.normalBias,se.shadowRadius=ie.radius,se.shadowMapSize=ie.mapSize,i.directionalShadow[p]=se,i.directionalShadowMap[p]=re,i.directionalShadowMatrix[p]=L.shadow.matrix,C++}i.directional[p]=J,p++}else if(L.isSpotLight){let J=e.get(L);J.position.setFromMatrixPosition(L.matrixWorld),J.color.copy(W).multiplyScalar(Z),J.distance=Y,J.coneCos=Math.cos(L.angle),J.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),J.decay=L.decay,i.spot[y]=J;let ie=L.shadow;if(L.map&&(i.spotLightMap[T]=L.map,T++,ie.updateMatrices(L),L.castShadow&&N++),i.spotLightMatrix[y]=ie.matrix,L.castShadow){let se=t.get(L);se.shadowIntensity=ie.intensity,se.shadowBias=ie.bias,se.shadowNormalBias=ie.normalBias,se.shadowRadius=ie.radius,se.shadowMapSize=ie.mapSize,i.spotShadow[y]=se,i.spotShadowMap[y]=re,_++}y++}else if(L.isRectAreaLight){let J=e.get(L);J.color.copy(W).multiplyScalar(Z),J.halfWidth.set(L.width*.5,0,0),J.halfHeight.set(0,L.height*.5,0),i.rectArea[w]=J,w++}else if(L.isPointLight){let J=e.get(L);if(J.color.copy(L.color).multiplyScalar(L.intensity),J.distance=L.distance,J.decay=L.decay,L.castShadow){let ie=L.shadow,se=t.get(L);se.shadowIntensity=ie.intensity,se.shadowBias=ie.bias,se.shadowNormalBias=ie.normalBias,se.shadowRadius=ie.radius,se.shadowMapSize=ie.mapSize,se.shadowCameraNear=ie.camera.near,se.shadowCameraFar=ie.camera.far,i.pointShadow[m]=se,i.pointShadowMap[m]=re,i.pointShadowMatrix[m]=L.shadow.matrix,E++}i.point[m]=J,m++}else if(L.isHemisphereLight){let J=e.get(L);J.skyColor.copy(L.color).multiplyScalar(Z),J.groundColor.copy(L.groundColor).multiplyScalar(Z),i.hemi[M]=J,M++}}w>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=we.LTC_FLOAT_1,i.rectAreaLTC2=we.LTC_FLOAT_2):(i.rectAreaLTC1=we.LTC_HALF_1,i.rectAreaLTC2=we.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let F=i.hash;(F.sunLength!==d||F.directionalLength!==p||F.pointLength!==m||F.spotLength!==y||F.rectAreaLength!==w||F.hemiLength!==M||F.numSunShadows!==x||F.numDirectionalShadows!==C||F.numPointShadows!==E||F.numSpotShadows!==_||F.numSpotMaps!==T||F.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=p,i.spot.length=y,i.rectArea.length=w,i.point.length=m,i.hemi.length=M,i.sunShadow.length=x,i.sunShadowMap.length=x,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=C,i.directionalShadowMap.length=C,i.directionalShadowMatrix.length=C,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+T-N,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=N,i.numLightProbes=I,F.sunLength=d,F.directionalLength=p,F.pointLength=m,F.spotLength=y,F.rectAreaLength=w,F.hemiLength=M,F.numSunShadows=x,F.numDirectionalShadows=C,F.numPointShadows=E,F.numSpotShadows=_,F.numSpotMaps=T,F.numLightProbes=I,i.version=V_++)}function c(l,u){let h=0,f=0,d=0,x=0,b=0,p=0,m=u.matrixWorldInverse;for(let y=0,w=l.length;y<w;y++){let M=l[y];if(M.isSunLight){let C=i.sun[h];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(m),h++}else if(M.isDirectionalLight){let C=i.directional[f];C.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(m),f++}else if(M.isSpotLight){let C=i.spot[x];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),C.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(m),x++}else if(M.isRectAreaLight){let C=i.rectArea[b];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),C.halfWidth.set(M.width*.5,0,0),C.halfHeight.set(0,M.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),b++}else if(M.isPointLight){let C=i.point[d];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let C=i.hemi[p];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(m),p++}}}return{setup:o,setupView:c,state:i}}function Ld(n){let e=new X_(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function a(h){h.isLightProbeGrid?s.push(h):t.push(h)}function o(h){i.push(h)}function c(){e.setup(t),s.sort((h,f)=>h.priority-f.priority||h.id-f.id)}function l(h){e.setupView(t,h)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function q_(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Ld(n),e.set(s,[o])):r>=a.length?(o=new Ld(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var Y_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Z_=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)],J_=[new k(0,-1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1),new k(0,-1,0),new k(0,-1,0)],Dd=new Tt,Nr=new k,Oc=new k;function K_(n,e,t){let i=new _i,s=new Je,r=new Je,a=new Rt,o=new ka,c=new za,l={},u=t.maxTextureSize,h={[bi]:tn,[tn]:bi,[Nn]:Nn},f=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:Y_,fragmentShader:$_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let x=new Kt;x.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new sn(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hi;let m=this.type;this.render=function(E,_,T){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===Eh&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Hi);let N=n.getRenderTarget(),I=n.getActiveCubeFace(),F=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Vi),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let q=m!==this.type;q&&_.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(W=>W.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,W=E.length;L<W;L++){let Z=E[L],Y=Z.shadow;if(Y===void 0){Ge("WebGLShadowMap:",Z,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let re=Y.getFrameExtents();s.multiply(re),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/re.x),s.x=r.x*re.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/re.y),s.y=r.y*re.y,Y.mapSize.y=r.y));let J=n.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=J,Y.map===null||q===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Ts){if(Z.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new pn(s.x,s.y,{format:wi,type:Cn,minFilter:Wt,magFilter:Wt,generateMipmaps:!1}),Y.map.texture.name=Z.name+".shadowMap",Y.map.depthTexture=new jn(s.x,s.y,Rn),Y.map.depthTexture.name=Z.name+".shadowMapDepth",Y.map.depthTexture.format=Jn,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Gt,Y.map.depthTexture.magFilter=Gt}else Z.isPointLight?(Y.map=new Fr(s.x),Y.map.depthTexture=new dr(s.x,An)):(Y.map=new pn(s.x,s.y),Y.map.depthTexture=new jn(s.x,s.y,An)),Y.map.depthTexture.name=Z.name+".shadowMap",Y.map.depthTexture.format=Jn,this.type===Hi?(Y.map.depthTexture.compareFunction=J?vc:yc,Y.map.depthTexture.minFilter=Wt,Y.map.depthTexture.magFilter=Wt):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Gt,Y.map.depthTexture.magFilter=Gt);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);let ie=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();Z.isPointLight!==!0&&Y.updateMatrices(Z,T);let se=(Y.camera.layers.mask&4294967294)!==0?Y.camera.layers:T.layers;for(let Ie=0;Ie<ie;Ie++){let We=Y.getCamera(Ie);if(Z.isPointLight){let j=Y.camera,ye=Y.matrix,Ae=Z.distance||j.far;Ae!==j.far&&(j.far=Ae,j.updateProjectionMatrix()),Nr.setFromMatrixPosition(Z.matrixWorld),j.position.copy(Nr),Oc.copy(j.position),Oc.add(Z_[Ie]),j.up.copy(J_[Ie]),j.lookAt(Oc),j.updateMatrixWorld(),ye.makeTranslation(-Nr.x,-Nr.y,-Nr.z),Dd.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Dd,j.coordinateSystem,j.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)n.setRenderTarget(Y.map,Ie),n.clear();else{Ie===0&&(n.setRenderTarget(Y.map),n.clear());let j=Y.getViewport(Ie);a.set(r.x*j.x,r.y*j.y,r.x*j.z,r.y*j.w),O.viewport(a)}i=Y.getFrustum(Ie),M(_,T,We,Z,se,this.type)}Y.isPointLightShadow!==!0&&this.type===Ts&&y(Y,T),Y.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(N,I,F)};function y(E,_){let T=e.update(b);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new pn(s.x,s.y,{format:wi,type:Cn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(_,null,T,f,b,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(_,null,T,d,b,null)}function w(E,_,T,N){let I=null,F=T.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(F!==void 0)I=F;else if(I=T.isPointLight===!0?c:o,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let O=I.uuid,q=_.uuid,L=l[O];L===void 0&&(L={},l[O]=L);let W=L[q];W===void 0&&(W=I.clone(),L[q]=W,_.addEventListener("dispose",C)),I=W}if(I.visible=_.visible,I.wireframe=_.wireframe,N===Ts?I.side=_.shadowSide!==null?_.shadowSide:_.side:I.side=_.shadowSide!==null?_.shadowSide:h[_.side],I.alphaMap=_.alphaMap,I.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,I.map=_.map,I.clipShadows=_.clipShadows,I.clippingPlanes=_.clippingPlanes,I.clipIntersection=_.clipIntersection,I.displacementMap=_.displacementMap,I.displacementScale=_.displacementScale,I.displacementBias=_.displacementBias,I.wireframeLinewidth=_.wireframeLinewidth,I.linewidth=_.linewidth,T.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let O=n.properties.get(I);O.light=T}return I}function M(E,_,T,N,I,F){if(E.visible===!1)return;if(E.layers.test(I)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&F===Ts)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,E.matrixWorld);let L=e.update(E),W=E.material;if(Array.isArray(W)){let Z=L.groups;for(let Y=0,re=Z.length;Y<re;Y++){let J=Z[Y],ie=W[J.materialIndex];if(ie&&ie.visible){let se=w(E,ie,N,F);E.onBeforeShadow(n,E,_,T,L,se,J),n.renderBufferDirect(T,null,L,se,E,J),E.onAfterShadow(n,E,_,T,L,se,J)}}}else if(W.visible){let Z=w(E,W,N,F);E.onBeforeShadow(n,E,_,T,L,Z,null),n.renderBufferDirect(T,null,L,Z,E,null),E.onAfterShadow(n,E,_,T,L,Z,null)}}let q=E.children;for(let L=0,W=q.length;L<W;L++)M(q[L],_,T,N,I,F)}function C(E){E.target.removeEventListener("dispose",C);for(let T in l){let N=l[T],I=E.target.uuid;I in N&&(N[I].dispose(),delete N[I])}}}function Q_(n,e){function t(){let P=!1,te=new Rt,K=null,pe=new Rt(0,0,0,0);return{setMask:function(le){K!==le&&!P&&(n.colorMask(le,le,le,le),K=le)},setLocked:function(le){P=le},setClear:function(le,he,Ne,je,oe){oe===!0&&(le*=je,he*=je,Ne*=je),te.set(le,he,Ne,je),pe.equals(te)===!1&&(n.clearColor(le,he,Ne,je),pe.copy(te))},reset:function(){P=!1,K=null,pe.set(-1,0,0,0)}}}function i(){let P=!1,te=!1,K=null,pe=null,le=null;return{setReversed:function(he){if(te!==he){let Ne=e.get("EXT_clip_control");he?Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.ZERO_TO_ONE_EXT):Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.NEGATIVE_ONE_TO_ONE_EXT),te=he;let je=le;le=null,this.setClear(je)}},getReversed:function(){return te},setTest:function(he){he?Se(n.DEPTH_TEST):Ye(n.DEPTH_TEST)},setMask:function(he){K!==he&&!P&&(n.depthMask(he),K=he)},setFunc:function(he){if(te&&(he=ad[he]),pe!==he){switch(he){case wa:n.depthFunc(n.NEVER);break;case Ta:n.depthFunc(n.ALWAYS);break;case Ea:n.depthFunc(n.LESS);break;case hs:n.depthFunc(n.LEQUAL);break;case Aa:n.depthFunc(n.EQUAL);break;case Ra:n.depthFunc(n.GEQUAL);break;case Ca:n.depthFunc(n.GREATER);break;case Ia:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=he}},setLocked:function(he){P=he},setClear:function(he){le!==he&&(le=he,te&&(he=1-he),n.clearDepth(he))},reset:function(){P=!1,K=null,pe=null,le=null,te=!1}}}function s(){let P=!1,te=null,K=null,pe=null,le=null,he=null,Ne=null,je=null,oe=null;return{setTest:function(Be){P||(Be?Se(n.STENCIL_TEST):Ye(n.STENCIL_TEST))},setMask:function(Be){te!==Be&&!P&&(n.stencilMask(Be),te=Be)},setFunc:function(Be,Qe,be){(K!==Be||pe!==Qe||le!==be)&&(n.stencilFunc(Be,Qe,be),K=Be,pe=Qe,le=be)},setOp:function(Be,Qe,be){(he!==Be||Ne!==Qe||je!==be)&&(n.stencilOp(Be,Qe,be),he=Be,Ne=Qe,je=be)},setLocked:function(Be){P=Be},setClear:function(Be){oe!==Be&&(n.clearStencil(Be),oe=Be)},reset:function(){P=!1,te=null,K=null,pe=null,le=null,he=null,Ne=null,je=null,oe=null}}}let r=new t,a=new i,o=new s,c={},l=new WeakMap,u={},h={},f={},d=new WeakMap,x=[],b=null,p=!1,m=null,y=null,w=null,M=null,C=null,E=null,_=null,T=new He(0,0,0),N=0,I=!1,F=null,O=null,q=null,L=null,W=null,Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,re=0,J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(J)[1]),Y=re>=1):J.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),Y=re>=2);let ie=null,se={},Ie=n.getParameter(n.SCISSOR_BOX),We=n.getParameter(n.VIEWPORT),j=new Rt().fromArray(Ie),ye=new Rt().fromArray(We);function Ae(P,te,K,pe){let le=new Uint8Array(4),he=n.createTexture();n.bindTexture(P,he),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ne=0;Ne<K;Ne++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(te,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(te+Ne,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return he}let ke={};ke[n.TEXTURE_2D]=Ae(n.TEXTURE_2D,n.TEXTURE_2D,1),ke[n.TEXTURE_CUBE_MAP]=Ae(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ke[n.TEXTURE_2D_ARRAY]=Ae(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ke[n.TEXTURE_3D]=Ae(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Se(n.DEPTH_TEST),a.setFunc(hs),Ee(!1),ve(Ql),Se(n.CULL_FACE),ce(Vi);function Se(P){u[P]!==!0&&(n.enable(P),u[P]=!0)}function Ye(P){u[P]!==!1&&(n.disable(P),u[P]=!1)}function ut(P,te){return f[P]!==te?(n.bindFramebuffer(P,te),f[P]=te,P===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=te),P===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=te),!0):!1}function ze(P,te){let K=x,pe=!1;if(P){K=d.get(te),K===void 0&&(K=[],d.set(te,K));let le=P.textures;if(K.length!==le.length||K[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Ne=le.length;he<Ne;he++)K[he]=n.COLOR_ATTACHMENT0+he;K.length=le.length,pe=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,pe=!0);pe&&n.drawBuffers(K)}function ht(P){return b!==P?(n.useProgram(P),b=P,!0):!1}let _t={[Wi]:n.FUNC_ADD,[Rh]:n.FUNC_SUBTRACT,[Ch]:n.FUNC_REVERSE_SUBTRACT};_t[Ih]=n.MIN,_t[Ph]=n.MAX;let $={[Lh]:n.ZERO,[Dh]:n.ONE,[Nh]:n.SRC_COLOR,[nc]:n.SRC_ALPHA,[zh]:n.SRC_ALPHA_SATURATE,[Bh]:n.DST_COLOR,[Fh]:n.DST_ALPHA,[Uh]:n.ONE_MINUS_SRC_COLOR,[ic]:n.ONE_MINUS_SRC_ALPHA,[kh]:n.ONE_MINUS_DST_COLOR,[Oh]:n.ONE_MINUS_DST_ALPHA,[Gh]:n.CONSTANT_COLOR,[Hh]:n.ONE_MINUS_CONSTANT_COLOR,[Vh]:n.CONSTANT_ALPHA,[Wh]:n.ONE_MINUS_CONSTANT_ALPHA};function ce(P,te,K,pe,le,he,Ne,je,oe,Be){if(P===Vi){p===!0&&(Ye(n.BLEND),p=!1);return}if(p===!1&&(Se(n.BLEND),p=!0),P!==Ah){if(P!==m||Be!==I){if((y!==Wi||C!==Wi)&&(n.blendEquation(n.FUNC_ADD),y=Wi,C=Wi),Be)switch(P){case Es:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jl:n.blendFunc(n.ONE,n.ONE);break;case ec:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case tc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ve("WebGLState: Invalid blending: ",P);break}else switch(P){case Es:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ec:Ve("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case tc:Ve("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ve("WebGLState: Invalid blending: ",P);break}w=null,M=null,E=null,_=null,T.set(0,0,0),N=0,m=P,I=Be}return}le=le||te,he=he||K,Ne=Ne||pe,(te!==y||le!==C)&&(n.blendEquationSeparate(_t[te],_t[le]),y=te,C=le),(K!==w||pe!==M||he!==E||Ne!==_)&&(n.blendFuncSeparate($[K],$[pe],$[he],$[Ne]),w=K,M=pe,E=he,_=Ne),(je.equals(T)===!1||oe!==N)&&(n.blendColor(je.r,je.g,je.b,oe),T.copy(je),N=oe),m=P,I=!1}function Me(P,te){P.side===Nn?Ye(n.CULL_FACE):Se(n.CULL_FACE);let K=P.side===tn;te&&(K=!K),Ee(K),P.blending===Es&&P.transparent===!1?ce(Vi):ce(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),r.setMask(P.colorWrite);let pe=P.stencilWrite;o.setTest(pe),pe&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ue(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Se(n.SAMPLE_ALPHA_TO_COVERAGE):Ye(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ee(P){F!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),F=P)}function ve(P){P!==wh?(Se(n.CULL_FACE),P!==O&&(P===Ql?n.cullFace(n.BACK):P===Th?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ye(n.CULL_FACE),O=P}function de(P){P!==q&&(Y&&n.lineWidth(P),q=P)}function Ue(P,te,K){P?(Se(n.POLYGON_OFFSET_FILL),(L!==te||W!==K)&&(L=te,W=K,a.getReversed()&&(te=-te,K=-K),n.polygonOffset(te,K))):Ye(n.POLYGON_OFFSET_FILL)}function nt(P){P?Se(n.SCISSOR_TEST):Ye(n.SCISSOR_TEST)}function Ze(P){P===void 0&&(P=n.TEXTURE0+Z-1),ie!==P&&(n.activeTexture(P),ie=P)}function Et(P,te,K){K===void 0&&(ie===null?K=n.TEXTURE0+Z-1:K=ie);let pe=se[K];pe===void 0&&(pe={type:void 0,texture:void 0},se[K]=pe),(pe.type!==P||pe.texture!==te)&&(ie!==K&&(n.activeTexture(K),ie=K),n.bindTexture(P,te||ke[P]),pe.type=P,pe.texture=te)}function D(){let P=se[ie];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function dt(){try{n.compressedTexImage2D(...arguments)}catch(P){Ve("WebGLState:",P)}}function lt(){try{n.compressedTexImage3D(...arguments)}catch(P){Ve("WebGLState:",P)}}function xt(){try{n.texSubImage2D(...arguments)}catch(P){Ve("WebGLState:",P)}}function me(){try{n.texSubImage3D(...arguments)}catch(P){Ve("WebGLState:",P)}}function It(){try{n.compressedTexSubImage2D(...arguments)}catch(P){Ve("WebGLState:",P)}}function Fe(){try{n.compressedTexSubImage3D(...arguments)}catch(P){Ve("WebGLState:",P)}}function Xe(){try{n.texStorage2D(...arguments)}catch(P){Ve("WebGLState:",P)}}function R(){try{n.texStorage3D(...arguments)}catch(P){Ve("WebGLState:",P)}}function v(){try{n.texImage2D(...arguments)}catch(P){Ve("WebGLState:",P)}}function B(){try{n.texImage3D(...arguments)}catch(P){Ve("WebGLState:",P)}}function ae(P){return h[P]!==void 0?h[P]:n.getParameter(P)}function ne(P,te){h[P]!==te&&(n.pixelStorei(P,te),h[P]=te)}function ue(P){j.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),j.copy(P))}function _e(P){ye.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),ye.copy(P))}function Q(P,te){let K=l.get(te);K===void 0&&(K=new WeakMap,l.set(te,K));let pe=K.get(P);pe===void 0&&(pe=n.getUniformBlockIndex(te,P.name),n.uniformBlockBinding(te,pe,pe),K.set(P,pe))}function ee(P,te,K){let le=l.get(te).get(P);c[le]!==K&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,K),c[le]=K)}function fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},ie=null,se={},f={},c={},d=new WeakMap,x=[],b=null,p=!1,m=null,y=null,w=null,M=null,C=null,E=null,_=null,T=new He(0,0,0),N=0,I=!1,F=null,O=null,q=null,L=null,W=null,j.set(0,0,n.canvas.width,n.canvas.height),ye.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Se,disable:Ye,bindFramebuffer:ut,drawBuffers:ze,useProgram:ht,setBlending:ce,setMaterial:Me,setFlipSided:Ee,setCullFace:ve,setLineWidth:de,setPolygonOffset:Ue,setScissorTest:nt,activeTexture:Ze,bindTexture:Et,unbindTexture:D,compressedTexImage2D:dt,compressedTexImage3D:lt,texImage2D:v,texImage3D:B,pixelStorei:ne,getParameter:ae,updateUBOMapping:Q,uniformBlockBinding:ee,texStorage2D:Xe,texStorage3D:R,texSubImage2D:xt,texSubImage3D:me,compressedTexSubImage2D:It,compressedTexSubImage3D:Fe,scissor:ue,viewport:_e,reset:fe}}function j_(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Je,u=new WeakMap,h=new Set,f,d=new WeakMap,x=new Set,b=new FinalizationRegistry(R=>x.delete(R)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,v){return p?new OffscreenCanvas(R,v):sr("canvas")}function y(R,v,B){let ae=1,ne=Xe(R);if((ne.width>B||ne.height>B)&&(ae=B/Math.max(ne.width,ne.height)),ae<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ue=Math.floor(ae*ne.width),_e=Math.floor(ae*ne.height);f===void 0&&(f=m(ue,_e));let Q=v?m(ue,_e):f;return Q.width=ue,Q.height=_e,Q.getContext("2d").drawImage(R,0,0,ue,_e),Ge("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ue+"x"+_e+")."),Q}else return"data"in R&&Ge("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function w(R){return R.generateMipmaps}function M(R){n.generateMipmap(R)}function C(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(R,v,B,ae,ne,ue=!1){if(R!==null){if(n[R]!==void 0)return n[R];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let _e;ae&&(_e=e.get("EXT_texture_norm16"),_e||Ge("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=v;if(v===n.RED&&(B===n.FLOAT&&(Q=n.R32F),B===n.HALF_FLOAT&&(Q=n.R16F),B===n.UNSIGNED_BYTE&&(Q=n.R8),B===n.UNSIGNED_SHORT&&_e&&(Q=_e.R16_EXT),B===n.SHORT&&_e&&(Q=_e.R16_SNORM_EXT)),v===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.R8UI),B===n.UNSIGNED_SHORT&&(Q=n.R16UI),B===n.UNSIGNED_INT&&(Q=n.R32UI),B===n.BYTE&&(Q=n.R8I),B===n.SHORT&&(Q=n.R16I),B===n.INT&&(Q=n.R32I)),v===n.RG&&(B===n.FLOAT&&(Q=n.RG32F),B===n.HALF_FLOAT&&(Q=n.RG16F),B===n.UNSIGNED_BYTE&&(Q=n.RG8),B===n.UNSIGNED_SHORT&&_e&&(Q=_e.RG16_EXT),B===n.SHORT&&_e&&(Q=_e.RG16_SNORM_EXT)),v===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RG8UI),B===n.UNSIGNED_SHORT&&(Q=n.RG16UI),B===n.UNSIGNED_INT&&(Q=n.RG32UI),B===n.BYTE&&(Q=n.RG8I),B===n.SHORT&&(Q=n.RG16I),B===n.INT&&(Q=n.RG32I)),v===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),B===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),B===n.UNSIGNED_INT&&(Q=n.RGB32UI),B===n.BYTE&&(Q=n.RGB8I),B===n.SHORT&&(Q=n.RGB16I),B===n.INT&&(Q=n.RGB32I)),v===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),B===n.UNSIGNED_INT&&(Q=n.RGBA32UI),B===n.BYTE&&(Q=n.RGBA8I),B===n.SHORT&&(Q=n.RGBA16I),B===n.INT&&(Q=n.RGBA32I)),v===n.RGB&&(B===n.UNSIGNED_SHORT&&_e&&(Q=_e.RGB16_EXT),B===n.SHORT&&_e&&(Q=_e.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&(Q=n.R11F_G11F_B10F)),v===n.RGBA){let ee=ue?ir:rt.getTransfer(ne);B===n.FLOAT&&(Q=n.RGBA32F),B===n.HALF_FLOAT&&(Q=n.RGBA16F),B===n.UNSIGNED_BYTE&&(Q=ee===gt?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&_e&&(Q=_e.RGBA16_EXT),B===n.SHORT&&_e&&(Q=_e.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function _(R,v){let B;return R?v===null||v===An||v===qi?B=n.DEPTH24_STENCIL8:v===Rn?B=n.DEPTH32F_STENCIL8:v===Rs&&(B=n.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===An||v===qi?B=n.DEPTH_COMPONENT24:v===Rn?B=n.DEPTH_COMPONENT32F:v===Rs&&(B=n.DEPTH_COMPONENT16),B}function T(R,v){return w(R)===!0||R.isFramebufferTexture&&R.minFilter!==Gt&&R.minFilter!==Wt?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function N(R){let v=new WeakRef(R);i.get(R).__ref=v,x.add(v),b.register(R,v,v)}function I(R){let v=i.get(R).__ref;v!==void 0&&(x.delete(v),b.unregister(v))}function F(R){q(R.target)}function O(R){L(R.target)}function q(R){R.removeEventListener("dispose",F),I(R),Z(R),R.isVideoTexture&&u.delete(R),R.isHTMLTexture&&h.delete(R)}function L(R){R.removeEventListener("dispose",O),I(R),re(R)}function W(){for(let R of x){let v=R.deref();v!==void 0&&(v.isRenderTarget===!0?L(v):q(v))}x.clear(),h.clear()}function Z(R){let v=i.get(R);if(v.__webglInit===void 0)return;let B=R.source,ae=d.get(B);if(ae){let ne=ae[v.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&Y(R),Object.keys(ae).length===0&&d.delete(B)}i.remove(R)}function Y(R){let v=i.get(R);n.deleteTexture(v.__webglTexture);let B=R.source,ae=d.get(B);delete ae[v.__cacheKey],a.memory.textures--}function re(R){let v=i.get(R);v.__depthDisposeCallback&&v.__depthDisposeCallback();let B=R.depthTexture;if(B&&B.renderTarget===R&&q(B),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(v.__webglFramebuffer[ne]))for(let ue=0;ue<v.__webglFramebuffer[ne].length;ue++)n.deleteFramebuffer(v.__webglFramebuffer[ne][ue]);else n.deleteFramebuffer(v.__webglFramebuffer[ne]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[ne])}else{if(Array.isArray(v.__webglFramebuffer))for(let ne=0;ne<v.__webglFramebuffer.length;ne++)n.deleteFramebuffer(v.__webglFramebuffer[ne]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let ne=0;ne<v.__webglColorRenderbuffer.length;ne++)v.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[ne]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let ae=R.textures;for(let ne=0,ue=ae.length;ne<ue;ne++){let _e=i.get(ae[ne]);_e.__webglTexture&&(n.deleteTexture(_e.__webglTexture),a.memory.textures--),i.remove(ae[ne])}i.remove(R)}let J=0;function ie(){J=0}function se(){return J}function Ie(R){J=R}function We(){let R=J;return R>=s.maxTextures&&Ge("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),J+=1,R}function j(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.mipmapsAutoUpdate),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function ye(R,v){let B=i.get(R);if(R.isVideoTexture&&It(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&B.__version!==R.version){let ae=R.image;if(ae===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{Me(B,R,v);return}}else R.isExternalTexture&&(B.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+v)}function Ae(R,v){let B=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&B.__version!==R.version){Me(B,R,v);return}else R.isExternalTexture&&(B.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+v)}function ke(R,v){let B=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&B.__version!==R.version){Me(B,R,v);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+v)}function Se(R,v){let B=i.get(R);if(R.version>0&&B.__version!==R.version){Ee(B,R,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+v)}let Ye={[ds]:n.REPEAT,[Pn]:n.CLAMP_TO_EDGE,[Pa]:n.MIRRORED_REPEAT},ut={[Gt]:n.NEAREST,[Yh]:n.NEAREST_MIPMAP_NEAREST,[Ar]:n.NEAREST_MIPMAP_LINEAR,[Wt]:n.LINEAR,[to]:n.LINEAR_MIPMAP_NEAREST,[ei]:n.LINEAR_MIPMAP_LINEAR},ze={[Kh]:n.NEVER,[Mc]:n.ALWAYS,[Qh]:n.LESS,[yc]:n.LEQUAL,[jh]:n.EQUAL,[vc]:n.GEQUAL,[ed]:n.GREATER,[td]:n.NOTEQUAL};function ht(R,v){if(v.type===Rn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Wt||v.magFilter===to||v.magFilter===Ar||v.magFilter===ei||v.minFilter===Wt||v.minFilter===to||v.minFilter===Ar||v.minFilter===ei)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Ye[v.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Ye[v.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Ye[v.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ut[v.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ut[v.minFilter]),v.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,ze[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Gt||v.minFilter!==Ar&&v.minFilter!==ei||v.type===Rn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function _t(R,v){let B=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",F),N(v));let ae=v.source,ne=d.get(ae);ne===void 0&&(ne={},d.set(ae,ne));let ue=j(v);if(ue!==R.__cacheKey){ne[ue]===void 0&&(ne[ue]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),ne[ue].usedTimes++;let _e=ne[R.__cacheKey];_e!==void 0&&(ne[R.__cacheKey].usedTimes--,_e.usedTimes===0&&Y(v)),R.__cacheKey=ue,R.__webglTexture=ne[ue].texture}return B}function $(R,v,B){return Math.floor(Math.floor(R/B)/v)}function ce(R,v,B,ae){let ue=R.updateRanges;if(ue.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,B,ae,v.data);else{ue.sort((P,te)=>P.start-te.start);let _e=0;for(let P=1;P<ue.length;P++){let te=ue[_e],K=ue[P],pe=te.start+te.count,le=$(K.start,v.width,4),he=$(te.start,v.width,4);K.start<=pe+1&&le===he&&$(K.start+K.count-1,v.width,4)===le?te.count=Math.max(te.count,K.start+K.count-te.start):(++_e,ue[_e]=K)}ue.length=_e+1;let Q=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),fe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let P=0,te=ue.length;P<te;P++){let K=ue[P],pe=Math.floor(K.start/4),le=Math.ceil(K.count/4),he=pe%v.width,Ne=Math.floor(pe/v.width),je=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ne),t.texSubImage2D(n.TEXTURE_2D,0,he,Ne,je,oe,B,ae,v.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Q),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,fe)}}function Me(R,v,B){let ae=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(ae=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(ae=n.TEXTURE_3D);let ne=_t(R,v),ue=v.source;t.bindTexture(ae,R.__webglTexture,n.TEXTURE0+B);let _e=i.get(ue);if(ue.version!==_e.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let oe=rt.getPrimaries(rt.workingColorSpace),Be=v.colorSpace===ni?null:rt.getPrimaries(v.colorSpace),Qe=v.colorSpace===ni||oe===Be?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe)}t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment);let ee=y(v.image,!1,s.maxTextureSize);ee=Fe(v,ee);let fe=r.convert(v.format,v.colorSpace),P=r.convert(v.type),te=E(v.internalFormat,fe,P,v.normalized,v.colorSpace,v.isVideoTexture);ht(ae,v);let K,pe=v.mipmaps,le=v.isVideoTexture!==!0,he=_e.__version===void 0||ne===!0,Ne=ue.dataReady,je=T(v,ee);if(v.isDepthTexture)te=_(v.format===ti,v.type),he&&(le?t.texStorage2D(n.TEXTURE_2D,1,te,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,fe,P,null));else if(v.isDataTexture)if(pe.length>0){le&&he&&t.texStorage2D(n.TEXTURE_2D,je,te,pe[0].width,pe[0].height);for(let oe=0,Be=pe.length;oe<Be;oe++)K=pe[oe],le?Ne&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,P,K.data):t.texImage2D(n.TEXTURE_2D,oe,te,K.width,K.height,0,fe,P,K.data);v.generateMipmaps=!1}else le?(he&&t.texStorage2D(n.TEXTURE_2D,je,te,ee.width,ee.height),Ne&&ce(v,ee,fe,P)):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,fe,P,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){le&&he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,je,te,pe[0].width,pe[0].height,ee.depth);for(let oe=0,Be=pe.length;oe<Be;oe++)if(K=pe[oe],v.format!==gn)if(fe!==null)if(le){if(Ne)if(v.layerUpdates.size>0){let Qe=Ic(K.width,K.height,v.format,v.type);for(let be of v.layerUpdates){let yt=K.data.subarray(be*Qe/K.data.BYTES_PER_ELEMENT,(be+1)*Qe/K.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,be,K.width,K.height,1,fe,yt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,K.width,K.height,ee.depth,fe,K.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,te,K.width,K.height,ee.depth,0,K.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Ne&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,K.width,K.height,ee.depth,fe,P,K.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,te,K.width,K.height,ee.depth,0,fe,P,K.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{le&&he&&t.texStorage2D(n.TEXTURE_2D,je,te,pe[0].width,pe[0].height);for(let oe=0,Be=pe.length;oe<Be;oe++)K=pe[oe],v.format!==gn?fe!==null?le?Ne&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,K.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,te,K.width,K.height,0,K.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Ne&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,P,K.data):t.texImage2D(n.TEXTURE_2D,oe,te,K.width,K.height,0,fe,P,K.data)}else if(v.isDataArrayTexture)if(le){if(he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,je,te,ee.width,ee.height,ee.depth),Ne)if(v.layerUpdates.size>0){let oe=Ic(ee.width,ee.height,v.format,v.type);for(let Be of v.layerUpdates){let Qe=ee.data.subarray(Be*oe/ee.data.BYTES_PER_ELEMENT,(Be+1)*oe/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Be,ee.width,ee.height,1,fe,P,Qe)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,fe,P,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,te,ee.width,ee.height,ee.depth,0,fe,P,ee.data);else if(v.isData3DTexture)le?(he&&t.texStorage3D(n.TEXTURE_3D,je,te,ee.width,ee.height,ee.depth),Ne&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,fe,P,ee.data)):t.texImage3D(n.TEXTURE_3D,0,te,ee.width,ee.height,ee.depth,0,fe,P,ee.data);else if(v.isFramebufferTexture){if(he)if(le)t.texStorage2D(n.TEXTURE_2D,je,te,ee.width,ee.height);else{let oe=ee.width,Be=ee.height;for(let Qe=0;Qe<je;Qe++)t.texImage2D(n.TEXTURE_2D,Qe,te,oe,Be,0,fe,P,null),oe>>=1,Be>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in n){let oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),ee.parentNode!==oe){oe.appendChild(ee),h.add(v),oe.onpaint=Be=>{let Qe=Be.changedElements;for(let be of h)Qe.includes(be.image)&&(be.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{let Qe=n.RGBA,be=n.RGBA,yt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Qe,be,yt,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(pe.length>0){if(le&&he){let oe=Xe(pe[0]);t.texStorage2D(n.TEXTURE_2D,je,te,oe.width,oe.height)}for(let oe=0,Be=pe.length;oe<Be;oe++)K=pe[oe],le?Ne&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,fe,P,K):t.texImage2D(n.TEXTURE_2D,oe,te,fe,P,K);v.generateMipmaps=!1}else if(le){if(he){let oe=Xe(ee);t.texStorage2D(n.TEXTURE_2D,je,te,oe.width,oe.height)}Ne&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe,P,ee)}else t.texImage2D(n.TEXTURE_2D,0,te,fe,P,ee);w(v)&&v.mipmapsAutoUpdate===!0&&M(ae),_e.__version=ue.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Ee(R,v,B){if(v.image.length!==6)return;let ae=_t(R,v),ne=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+B);let ue=i.get(ne);if(ne.version!==ue.__version||ae===!0){t.activeTexture(n.TEXTURE0+B);let _e=rt.getPrimaries(rt.workingColorSpace),Q=v.colorSpace===ni?null:rt.getPrimaries(v.colorSpace),ee=v.colorSpace===ni||_e===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let fe=v.isCompressedTexture||v.image[0].isCompressedTexture,P=v.image[0]&&v.image[0].isDataTexture,te=[];for(let be=0;be<6;be++)!fe&&!P?te[be]=y(v.image[be],!0,s.maxCubemapSize):te[be]=P?v.image[be].image:v.image[be],te[be]=Fe(v,te[be]);let K=te[0],pe=r.convert(v.format,v.colorSpace),le=r.convert(v.type),he=E(v.internalFormat,pe,le,v.normalized,v.colorSpace),Ne=v.isVideoTexture!==!0,je=ue.__version===void 0||ae===!0,oe=ne.dataReady,Be=T(v,K);ht(n.TEXTURE_CUBE_MAP,v);let Qe;if(v.isDepthTexture){if(he=_(v.format===ti,v.type),je)if(Ne)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,he,K.width,K.height);else for(let be=0;be<6;be++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,he,K.width,K.height,0,pe,le,null)}else if(fe){Ne&&je&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Be,he,K.width,K.height);for(let be=0;be<6;be++){Qe=te[be].mipmaps;for(let yt=0;yt<Qe.length;yt++){let Ot=Qe[yt];v.format!==gn?pe!==null?Ne?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt,0,0,Ot.width,Ot.height,pe,Ot.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt,he,Ot.width,Ot.height,0,Ot.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt,0,0,Ot.width,Ot.height,pe,le,Ot.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt,he,Ot.width,Ot.height,0,pe,le,Ot.data)}}}else{if(Qe=v.mipmaps,Ne&&je){Qe.length>0&&Be++;let be=Xe(te[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Be,he,be.width,be.height)}for(let be=0;be<6;be++)if(P){Ne?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,te[be].width,te[be].height,pe,le,te[be].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,he,te[be].width,te[be].height,0,pe,le,te[be].data);for(let yt=0;yt<Qe.length;yt++){let si=Qe[yt].image[be].image;Ne?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt+1,0,0,si.width,si.height,pe,le,si.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt+1,he,si.width,si.height,0,pe,le,si.data)}}else{Ne?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,pe,le,te[be]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,he,pe,le,te[be]);for(let yt=0;yt<Qe.length;yt++){let Ot=Qe[yt];Ne?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt+1,0,0,pe,le,Ot.image[be]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,yt+1,he,pe,le,Ot.image[be])}}}w(v)&&v.mipmapsAutoUpdate===!0&&M(n.TEXTURE_CUBE_MAP),ue.__version=ne.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function ve(R,v,B,ae,ne,ue){let _e=r.convert(B.format,B.colorSpace),Q=r.convert(B.type),ee=E(B.internalFormat,_e,Q,B.normalized,B.colorSpace),fe=i.get(v),P=i.get(B);if(P.__renderTarget=v,!fe.__hasExternalTextures){let te=Math.max(1,v.width>>ue),K=Math.max(1,v.height>>ue);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ue,ee,te,K,v.depth,0,_e,Q,null):t.texImage2D(ne,ue,ee,te,K,0,_e,Q,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),me(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ae,ne,P.__webglTexture,0,xt(v)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ae,ne,P.__webglTexture,ue),t.bindFramebuffer(n.FRAMEBUFFER,null)}function de(R,v,B){if(n.bindRenderbuffer(n.RENDERBUFFER,R),v.depthBuffer){let ae=v.depthTexture,ne=ae&&ae.isDepthTexture?ae.type:null,ue=_(v.stencilBuffer,ne),_e=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;me(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(v),ue,v.width,v.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(v),ue,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ue,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,R)}else{let ae=v.textures;for(let ne=0;ne<ae.length;ne++){let ue=ae[ne],_e=r.convert(ue.format,ue.colorSpace),Q=r.convert(ue.type),ee=E(ue.internalFormat,_e,Q,ue.normalized,ue.colorSpace);me(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(v),ee,v.width,v.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(v),ee,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ee,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ue(R,v,B){let ae=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ne=i.get(v.depthTexture);ne.__renderTarget=v;let ue=ae?v.depthTexture.image[0]:v.depthTexture.image;(!ne.__webglTexture||ue.width!==v.width||ue.height!==v.height)&&(ue.width=v.width,ue.height=v.height,v.depthTexture.needsUpdate=!0),ae?Se(v.depthTexture,0):ye(v.depthTexture,0);let _e=ne.__webglTexture,Q=xt(v),ee=ae?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,fe=v.depthTexture.format===ti?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===Jn)me(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,ee,_e,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,fe,ee,_e,0);else if(v.depthTexture.format===ti)me(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,ee,_e,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,fe,ee,_e,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function nt(R){let v=i.get(R),B=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let ae=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),ae){let ne=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,ae.removeEventListener("dispose",ne)};ae.addEventListener("dispose",ne),v.__depthDisposeCallback=ne}v.__boundDepthTexture=ae}if(R.depthTexture&&!v.__autoAllocateDepthBuffer)if(B)for(let ae=0;ae<6;ae++)Ue(v.__webglFramebuffer[ae],R,ae);else R.texture.mipmaps.length>0?Ue(v.__webglFramebuffer[0],R,0):Ue(v.__webglFramebuffer,R,0);else if(B){v.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[ae]),v.__webglDepthbuffer[ae]===void 0)v.__webglDepthbuffer[ae]=n.createRenderbuffer(),de(v.__webglDepthbuffer[ae],R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=v.__webglDepthbuffer[ae];n.bindRenderbuffer(n.RENDERBUFFER,ue),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ue)}}else if(R.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),de(v.__webglDepthbuffer,R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ue),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ue)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ze(R,v,B){let ae=i.get(R);v!==void 0&&ve(ae.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&nt(R)}function Et(R){let v=R.texture,B=i.get(R),ae=i.get(v);R.addEventListener("dispose",O),N(R);let ne=R.textures,ue=R.isWebGLCubeRenderTarget===!0,_e=ne.length>1;if(_e||(ae.__webglTexture===void 0&&(ae.__webglTexture=n.createTexture()),ae.__version=v.version,a.memory.textures++),ue){B.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(v.mipmaps.length>0){B.__webglFramebuffer[Q]=[];for(let ee=0;ee<v.mipmaps.length;ee++)B.__webglFramebuffer[Q][ee]=n.createFramebuffer()}else B.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(v.mipmaps.length>0){B.__webglFramebuffer=[];for(let Q=0;Q<v.mipmaps.length;Q++)B.__webglFramebuffer[Q]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(_e)for(let Q=0,ee=ne.length;Q<ee;Q++){let fe=i.get(ne[Q]);fe.__webglTexture===void 0&&(fe.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&me(R)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Q=0;Q<ne.length;Q++){let ee=ne[Q];B.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[Q]);let fe=r.convert(ee.format,ee.colorSpace),P=r.convert(ee.type),te=E(ee.internalFormat,fe,P,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),K=xt(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,K,te,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,B.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),de(B.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ue){t.bindTexture(n.TEXTURE_CUBE_MAP,ae.__webglTexture),ht(n.TEXTURE_CUBE_MAP,v);for(let Q=0;Q<6;Q++)if(v.mipmaps.length>0)for(let ee=0;ee<v.mipmaps.length;ee++)ve(B.__webglFramebuffer[Q][ee],R,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ee);else ve(B.__webglFramebuffer[Q],R,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);w(v)?M(n.TEXTURE_CUBE_MAP):v.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}else if(_e){for(let Q=0,ee=ne.length;Q<ee;Q++){let fe=ne[Q],P=i.get(fe),te=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(te=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,P.__webglTexture),ht(te,fe),ve(B.__webglFramebuffer,R,fe,n.COLOR_ATTACHMENT0+Q,te,0),w(fe)&&M(te)}t.unbindTexture()}else{let Q=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Q=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,ae.__webglTexture),ht(Q,v),v.mipmaps.length>0)for(let ee=0;ee<v.mipmaps.length;ee++)ve(B.__webglFramebuffer[ee],R,v,n.COLOR_ATTACHMENT0,Q,ee);else ve(B.__webglFramebuffer,R,v,n.COLOR_ATTACHMENT0,Q,0);w(v)?M(Q):v.mipmaps.length>0&&n.texParameteri(Q,n.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}R.depthBuffer&&nt(R)}function D(R){let v=R.textures;for(let B=0,ae=v.length;B<ae;B++){let ne=v[B];if(w(ne)&&ne.mipmapsAutoUpdate===!0){let ue=C(R),_e=i.get(ne).__webglTexture;t.bindTexture(ue,_e),M(ue),t.unbindTexture()}}}let dt=[];function lt(R){if(R.samples>0){if(me(R)===!1){let v=R.textures,B=R.width,ae=R.height,ne=n.COLOR_BUFFER_BIT,ue=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(R),Q=v.length>1;if(Q)for(let fe=0;fe<v.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),R.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let fe=0;fe<v.length;fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[fe]);let P=i.get(v[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,P,0)}n.blitFramebuffer(0,0,B,ae,0,0,B,ae,ne,n.NEAREST),c===!0&&(dt.length=0,dt.push(n.COLOR_ATTACHMENT0+fe),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&dt.push(ue),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,dt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let fe=0;fe<v.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,_e.__webglColorRenderbuffer[fe]);let P=i.get(v[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,P,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&c){let v=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function xt(R){return Math.min(s.maxSamples,R.samples)}function me(R){let v=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function It(R){let v=a.render.frame;u.get(R)!==v&&(u.set(R,v),R.update())}function Fe(R,v){let B=R.colorSpace,ae=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||B!==nr&&B!==ni&&(rt.getTransfer(B)===gt?(ae!==gn||ne!==rn)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ve("WebGLTextures: Unsupported texture color space:",B)),v}function Xe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=We,this.resetTextureUnits=ie,this.getTextureUnits=se,this.setTextureUnits=Ie,this.setTexture2D=ye,this.setTexture2DArray=Ae,this.setTexture3D=ke,this.setTextureCube=Se,this.rebindTextures=Ze,this.setupRenderTarget=Et,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=me,this.dispose=W}function ex(n,e){function t(i,s=ni){let r,a=rt.getTransfer(s);if(i===rn)return n.UNSIGNED_BYTE;if(i===io)return n.UNSIGNED_SHORT_4_4_4_4;if(i===so)return n.UNSIGNED_SHORT_5_5_5_1;if(i===pc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===mc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===dc)return n.BYTE;if(i===fc)return n.SHORT;if(i===Rs)return n.UNSIGNED_SHORT;if(i===no)return n.INT;if(i===An)return n.UNSIGNED_INT;if(i===Rn)return n.FLOAT;if(i===Cn)return n.HALF_FLOAT;if(i===gc)return n.ALPHA;if(i===_c)return n.RGB;if(i===gn)return n.RGBA;if(i===Jn)return n.DEPTH_COMPONENT;if(i===ti)return n.DEPTH_STENCIL;if(i===xc)return n.RED;if(i===ro)return n.RED_INTEGER;if(i===wi)return n.RG;if(i===ao)return n.RG_INTEGER;if(i===oo)return n.RGBA_INTEGER;if(i===Rr||i===Cr||i===Ir||i===Pr)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Rr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Rr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ir)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===lo||i===co||i===uo||i===ho)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===lo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===co)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===uo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ho)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fo||i===po||i===mo||i===go||i===_o||i===Lr||i===xo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===fo||i===po)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===mo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===go)return r.COMPRESSED_R11_EAC;if(i===_o)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Lr)return r.COMPRESSED_RG11_EAC;if(i===xo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===yo||i===vo||i===Mo||i===So||i===bo||i===wo||i===To||i===Eo||i===Ao||i===Ro||i===Co||i===Io||i===Po||i===Lo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===yo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===vo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Mo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===So)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===bo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===To)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Eo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ao)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ro)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Co)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Io)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Po)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Lo)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Do||i===No||i===Uo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Do)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===No)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Uo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fo||i===Oo||i===Dr||i===Bo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Fo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Oo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Dr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Bo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===qi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var tx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Wc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new fr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Mn({vertexShader:tx,fragmentShader:nx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new sn(new yi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xc=class extends Ln{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,x=null,b=typeof XRWebGLBinding<"u",p=new Wc,m={},y=t.getContextAttributes(),w=null,M=null,C=[],E=[],_=new Je,T=null,N=null,I=new Jt;I.viewport=new Rt;let F=new Jt;F.viewport=new Rt;let O=[I,F],q=new Ka,L=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ye=C[j];return ye===void 0&&(ye=new _s,C[j]=ye),ye.getTargetRaySpace()},this.getControllerGrip=function(j){let ye=C[j];return ye===void 0&&(ye=new _s,C[j]=ye),ye.getGripSpace()},this.getHand=function(j){let ye=C[j];return ye===void 0&&(ye=new _s,C[j]=ye),ye.getHandSpace()};function Z(j){let ye=E.indexOf(j.inputSource);if(ye===-1)return;let Ae=C[ye];Ae!==void 0&&(Ae.update(j.inputSource,j.frame,l||a),Ae.dispatchEvent({type:j.type,data:j.inputSource}))}function Y(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",re);for(let j=0;j<C.length;j++){let ye=E[j];ye!==null&&(E[j]=null,C[j].disconnect(ye))}L=null,W=null,p.reset();for(let j in m)delete m[j];if(e.setRenderTarget(w),d=null,f=null,h=null,s=null,M=null,We.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(_.width,_.height,!1),N!==null){let j=N.camera;j.fov=N.fov,j.zoom=N.zoom,j.updateProjectionMatrix(),N=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&b&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",re),y.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(_),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,ke=null,Se=null;y.depth&&(Se=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=y.stencil?ti:Jn,ke=y.stencil?qi:An);let Ye={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(Ye),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new pn(f.textureWidth,f.textureHeight,{format:gn,type:rn,depthTexture:new jn(f.textureWidth,f.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let Ae={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new pn(d.framebufferWidth,d.framebufferHeight,{format:gn,type:rn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),We.setContext(s),We.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function re(j){for(let ye=0;ye<j.removed.length;ye++){let Ae=j.removed[ye],ke=E.indexOf(Ae);ke>=0&&(E[ke]=null,C[ke].disconnect(Ae))}for(let ye=0;ye<j.added.length;ye++){let Ae=j.added[ye],ke=E.indexOf(Ae);if(ke===-1){for(let Ye=0;Ye<C.length;Ye++)if(Ye>=E.length){E.push(Ae),ke=Ye;break}else if(E[Ye]===null){E[Ye]=Ae,ke=Ye;break}if(ke===-1)break}let Se=C[ke];Se&&Se.connect(Ae)}}function J(j,ye){ye===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ye.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ye=j.near,Ae=j.far;p.texture!==null&&(p.depthNear>0&&(ye=p.depthNear),p.depthFar>0&&(Ae=p.depthFar)),q.near=F.near=I.near=ye,q.far=F.far=I.far=Ae,(L!==q.near||W!==q.far)&&(s.updateRenderState({depthNear:q.near,depthFar:q.far}),L=q.near,W=q.far),q.layers.mask=j.layers.mask|6,I.layers.mask=q.layers.mask&-5,F.layers.mask=q.layers.mask&-3;let ke=j.parent,Se=q.cameras;J(q,ke);for(let Ye=0;Ye<Se.length;Ye++)J(Se[Ye],ke);q.projectionMatrix.copy(I.projectionMatrix),q.projectionMatrixInverse.copy(I.projectionMatrixInverse),N===null&&j.isPerspectiveCamera&&(N={camera:j,fov:j.fov,zoom:j.zoom}),ie(j,q,ke)};function ie(j,ye,Ae){Ae===null?j.matrix.copy(ye.matrixWorld):(j.matrix.copy(Ae.matrixWorld),j.matrix.invert(),j.matrix.multiply(ye.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ye.projectionMatrix),j.projectionMatrixInverse.copy(ye.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=ki*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(q)},this.getCameraTexture=function(j){return m[j]};let se=null;function Ie(j,ye){if(u=ye.getViewerPose(l||a),x=ye,u!==null){let Ae=u.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let ke=!1;Ae.length!==q.cameras.length&&(q.cameras.length=0,ke=!0);for(let ze=0;ze<Ae.length;ze++){let ht=Ae[ze],_t=null;if(d!==null)_t=d.getViewport(ht);else{let ce=h.getViewSubImage(f,ht);_t=ce.viewport,ze===0&&(e.setRenderTargetTextures(M,ce.colorTexture,ce.depthStencilTexture),e.setRenderTarget(M))}let $=O[ze];$===void 0&&($=new Jt,$.layers.enable(ze),$.viewport=new Rt,O[ze]=$),$.matrix.fromArray(ht.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(ht.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(_t.x,_t.y,_t.width,_t.height),ze===0&&(q.matrix.copy($.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),ke===!0&&q.cameras.push($)}let Se=s.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){h=i.getBinding();let ze=h.getDepthInformation(Ae[0]);ze&&ze.isValid&&ze.texture&&p.init(ze,s.renderState)}if(Se&&Se.includes("camera-access")&&b){e.state.unbindTexture(),h=i.getBinding();for(let ze=0;ze<Ae.length;ze++){let ht=Ae[ze].camera;if(ht){let _t=m[ht];_t||(_t=new fr,m[ht]=_t);let $=h.getCameraImage(ht);_t.sourceTexture=$}}}}for(let Ae=0;Ae<C.length;Ae++){let ke=E[Ae],Se=C[Ae];ke!==null&&Se!==void 0&&Se.update(ke,ye,l||a)}se&&se(j,ye),ye.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ye}),x=null}let We=new Nd;We.setAnimationLoop(Ie),this.setAnimationLoop=function(j){se=j},this.dispose=function(){}}},ix=new Tt,Wd=new qe;Wd.set(-1,0,0,0,1,0,0,0,1);function sx(n,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Ac(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,y,w,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),h(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,M)):m.isMeshMatcapMaterial?(r(p,m),x(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),b(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,y,w):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===tn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===tn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let y=e.get(m),w=y.envMap,M=y.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(ix.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Wd),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,y,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,y){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===tn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,m){m.matcap&&(p.matcap.value=m.matcap)}function b(p,m){let y=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function rx(n,e,t,i){let s={},r={};function a(y,w){let M=w.program;i.uniformBlockBinding(y,M,s[y.id])}function o(y,w){let M=s[y.id];M===void 0&&(x(y),M=c(y),s[y.id]=M,y.addEventListener("dispose",p));let C=w.program;i.updateUBOMapping(y,C);let E=e.render.frame;r[y.id]!==E&&(l(y),r[y.id]=E)}function c(y){let w=n.createBuffer(),M=y.__size,C=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,M,C),n.bindBuffer(n.UNIFORM_BUFFER,null),w}function l(y){let w=s[y.id],M=y.uniforms,C=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let E=0,_=M.length;E<_;E++){let T=M[E];if(Array.isArray(T))for(let N=0,I=T.length;N<I;N++)u(T[N],E,N,C);else u(T,E,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,w,M,C){if(f(y,w,M,C)===!0){let E=y.__offset,_=y.value;if(Array.isArray(_)){let T=0;for(let N=0;N<_.length;N++){let I=_[N],F=b(I,!0);h(I,y.__data,T),T+=F.storage/Float32Array.BYTES_PER_ELEMENT}}else h(_,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,E,y.__data)}}function h(y,w,M){typeof y=="number"||typeof y=="boolean"?w[M]=y:y.isMatrix3?(w[M]=y.elements[0],w[M+1]=y.elements[1],w[M+2]=y.elements[2],w[M+3]=0,w[M+4]=y.elements[3],w[M+5]=y.elements[4],w[M+6]=y.elements[5],w[M+7]=0,w[M+8]=y.elements[6],w[M+9]=y.elements[7],w[M+10]=y.elements[8],w[M+11]=0):ArrayBuffer.isView(y)?w.set(y.subarray(0,w.length-M),M):y.toArray(w,M)}function f(y,w,M,C){let E=y.value,_=w+"_"+M;if(Array.isArray(E)){C[_]===void 0&&(C[_]=[]);let T=C[_],N=!1;for(let I=0;I<E.length;I++)d(E[I],T,I)===!0&&(N=!0);return N}return d(E,C,_)}function d(y,w,M){if(w[M]===void 0)return typeof y=="number"||typeof y=="boolean"?w[M]=y:ArrayBuffer.isView(y)?w[M]=y.slice():w[M]=y.clone(),!0;{let C=w[M];if(typeof y=="number"||typeof y=="boolean"){if(C!==y)return w[M]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(C.equals(y)===!1)return C.copy(y),!0}}return!1}function x(y){let w=y.uniforms,M=0,C=16;for(let _=0,T=w.length;_<T;_++){let N=Array.isArray(w[_])?w[_]:[w[_]];for(let I=0,F=N.length;I<F;I++){let O=N[I],q=Array.isArray(O.value)?O.value:[O.value],L=Array.isArray(w[_])||Array.isArray(O.value),W=M;for(let Y=0,re=q.length;Y<re;Y++){let J=q[Y],ie=b(J,L),se=M%C,Ie=se%ie.boundary,We=se+Ie;M+=Ie,We!==0&&C-We<ie.storage&&(M+=C-We),Y===0&&(W=M),M+=ie.storage}let Z=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new Z((M-W)/Float32Array.BYTES_PER_ELEMENT),O.__offset=W}}let E=M%C;return E>0&&(M+=C-E),y.__size=M,y.__cache={},this}function b(y,w){let M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=16,M.storage=48):y.isMatrix4?(M.boundary=16,M.storage=64):y.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(M.boundary=16,M.storage=y.byteLength):Ge("WebGLRenderer: Unsupported uniform value type.",y),w===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function p(y){let w=y.target;w.removeEventListener("dispose",p),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function m(){for(let y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:a,update:o,dispose:m}}var ax=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Fn=null;function ox(){return Fn===null&&(Fn=new vs(ax,16,16,wi,Cn),Fn.name="DFG_LUT",Fn.minFilter=Wt,Fn.magFilter=Wt,Fn.wrapS=Pn,Fn.wrapT=Pn,Fn.generateMipmaps=!1,Fn.needsUpdate=!0),Fn}var Wo=class{constructor(e={}){let{canvas:t=id(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:d=rn}=e;this.isWebGLRenderer=!0;let x;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=i.getContextAttributes().alpha}else x=a;let b=d,p=new Set([oo,ao,ro]),m=new Set([rn,An,Rs,qi,io,so]),y=new Uint32Array(4),w=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]},C=null,E=null,_=[],T=[],N=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Un,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,F=!1,O=null,q=null,L=null,W=null;this._outputColorSpace=zt;let Z=0,Y=0,re=null,J=-1,ie=null,se=new Rt,Ie=new Rt,We=null,j=new He(0),ye=0,Ae=t.width,ke=t.height,Se=1,Ye=null,ut=null,ze=new Rt(0,0,Ae,ke),ht=new Rt(0,0,Ae,ke),_t=!1,$=new _i,ce=new Fa,Me=!1,Ee=!1,ve=new Tt,de=new k,Ue=new Rt,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ze=!1;function Et(){return re===null?Se:1}let D=i;function dt(S,U){return t.getContext(S,U)}let lt,xt,me,It,Fe,Xe,R,v,B,ae,ne,ue,_e,Q,ee,fe,P,te,K,pe,le,he,Ne;try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Be,!1),t.addEventListener("webglcontextrestored",Qe,!1),t.addEventListener("webglcontextcreationerror",be,!1),D===null){let U="webgl2";if(D=dt(U,S),D===null)throw dt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}je()}catch(S){throw t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",be,!1),Ve("WebGLRenderer: "+S.message),S}function je(){lt=new xg(D),lt.init(),le=new ex(D,lt),xt=new og(D,lt,e,le),me=new Q_(D,lt),xt.reversedDepthBuffer&&f&&me.buffers.depth.setReversed(!0),q=D.createFramebuffer(),L=D.createFramebuffer(),W=D.createFramebuffer(),It=new Mg(D),Fe=new B_,Xe=new j_(D,lt,me,Fe,xt,le,It),R=new _g(I),v=new bp(D),he=new rg(D,v),B=new yg(D,v,It,he),ae=new bg(D,B,v,he,It),te=new Sg(D,xt,Xe),ee=new lg(Fe),ne=new O_(I,R,lt,xt,he,ee),ue=new sx(I,Fe),_e=new z_,Q=new q_(lt),P=new sg(I,R,me,ae,x,c),fe=new K_(I,ae,xt),Ne=new rx(D,It,xt,me),K=new ag(D,lt,It),pe=new vg(D,lt,It),It.programs=ne.programs,I.capabilities=xt,I.extensions=lt,I.properties=Fe,I.renderLists=_e,I.shadowMap=fe,I.state=me,I.info=It}b!==rn&&(N=new Tg(b,t.width,t.height,o,s,r));let oe=new Xc(I,D);this.xr=oe,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let S=lt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=lt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Se},this.setPixelRatio=function(S){S!==void 0&&(Se=S,this.setSize(Ae,ke,!1))},this.getSize=function(S){return S.set(Ae,ke)},this.setSize=function(S,U,X=!0){if(oe.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}Ae=S,ke=U,t.width=Math.floor(S*Se),t.height=Math.floor(U*Se),X===!0&&(t.style.width=S+"px",t.style.height=U+"px"),N!==null&&N.setSize(t.width,t.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(Ae*Se,ke*Se).floor()},this.setDrawingBufferSize=function(S,U,X){Ae=S,ke=U,Se=X,t.width=Math.floor(S*X),t.height=Math.floor(U*X),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(b===rn){Ve("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){Ge("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}N.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(se)},this.getViewport=function(S){return S.copy(ze)},this.setViewport=function(S,U,X,z){S.isVector4?ze.set(S.x,S.y,S.z,S.w):ze.set(S,U,X,z),me.viewport(se.copy(ze).multiplyScalar(Et()).round())},this.getScissor=function(S){return S.copy(ht)},this.setScissor=function(S,U,X,z){S.isVector4?ht.set(S.x,S.y,S.z,S.w):ht.set(S,U,X,z),me.scissor(Ie.copy(ht).multiplyScalar(Et()).round())},this.getScissorTest=function(){return _t},this.setScissorTest=function(S){me.setScissorTest(_t=S)},this.setOpaqueSort=function(S){Ye=S},this.setTransparentSort=function(S){ut=S},this.getClearColor=function(S){return S.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,X=!0){let z=0;if(S){let H=!1;if(re!==null){let xe=re.texture.format;H=p.has(xe)}if(H){let xe=re.texture.type,Re=m.has(xe),ge=P.getClearColor(),Te=P.getClearAlpha(),De=ge.r,$e=ge.g,it=ge.b;Re?(y[0]=De,y[1]=$e,y[2]=it,y[3]=Te,D.clearBufferuiv(D.COLOR,0,y)):(w[0]=De,w[1]=$e,w[2]=it,w[3]=Te,D.clearBufferiv(D.COLOR,0,w))}else z|=D.COLOR_BUFFER_BIT}U&&(z|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(z|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&D.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),O=S},this.dispose=function(){t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",be,!1),P.dispose(),_e.dispose(),Q.dispose(),Xe.dispose(),Fe.dispose(),R.dispose(),ae.dispose(),B.dispose(),he.dispose(),Ne.dispose(),ne.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",cu),oe.removeEventListener("sessionend",uu),Ri.stop()};function Be(S){S.preventDefault(),bc("WebGLRenderer: Context Lost."),F=!0}function Qe(){bc("WebGLRenderer: Context Restored."),F=!1;let S=It.autoReset,U=fe.enabled,X=fe.autoUpdate,z=fe.needsUpdate,H=fe.type;je(),It.autoReset=S,fe.enabled=U,fe.autoUpdate=X,fe.needsUpdate=z,fe.type=H}function be(S){Ve("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function yt(S){let U=S.target;U.removeEventListener("dispose",yt),Ot(U)}function Ot(S){si(S),Fe.remove(S)}function si(S){let U=Fe.get(S).programs;U!==void 0&&(U.forEach(function(X){ne.releaseProgram(X)}),S.isShaderMaterial&&ne.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,X,z,H,xe){U===null&&(U=nt);let Re=H.isMesh&&H.matrixWorld.determinantAffine()<0,ge=_f(S,U,X,z,H);me.setMaterial(z,Re);let Te=X.index,De=1;if(z.wireframe===!0){if(Te=B.getWireframeAttribute(X),Te===void 0)return;De=2}let $e=X.drawRange,it=X.attributes.position,Pe=$e.start*De,st=($e.start+$e.count)*De;xe!==null&&(Pe=Math.max(Pe,xe.start*De),st=Math.min(st,(xe.start+xe.count)*De)),Te!==null?(Pe=Math.max(Pe,0),st=Math.min(st,Te.count)):it!=null&&(Pe=Math.max(Pe,0),st=Math.min(st,it.count));let Lt=st-Pe;if(Lt<0||Lt===1/0)return;he.setup(H,z,ge,X,Te);let wt,Mt=K;if(Te!==null&&(wt=v.get(Te),Mt=pe,Mt.setIndex(wt)),H.isMesh)z.wireframe===!0?(me.setLineWidth(z.wireframeLinewidth*Et()),Mt.setMode(D.LINES)):Mt.setMode(D.TRIANGLES);else if(H.isLine){let Xt=z.linewidth;Xt===void 0&&(Xt=1),me.setLineWidth(Xt*Et()),H.isLineSegments?Mt.setMode(D.LINES):H.isLineLoop?Mt.setMode(D.LINE_LOOP):Mt.setMode(D.LINE_STRIP)}else H.isPoints?Mt.setMode(D.POINTS):H.isSprite&&Mt.setMode(D.TRIANGLES);if(H.isBatchedMesh)if(lt.get("WEBGL_multi_draw"))Mt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Xt=H._multiDrawStarts,Le=H._multiDrawCounts,jt=H._multiDrawCount,ft=Te?v.get(Te).bytesPerElement:1,Ci=Fe.get(z).currentProgram.getUniforms();for(let qt=0;qt<jt;qt++)Ci.setValue(D,"_gl_DrawID",qt),Mt.render(Xt[qt]/ft,Le[qt])}else if(H.isInstancedMesh)Mt.renderInstances(Pe,Lt,H.count);else if(X.isInstancedBufferGeometry){let Xt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Le=Math.min(X.instanceCount,Xt);Mt.renderInstances(Pe,Lt,Le)}else Mt.render(Pe,Lt)};function lu(S,U,X,z){O!==null&&S.isNodeMaterial&&O.setObject(z,S),Me===!0&&ee.setState(S,X,!1),S.transparent===!0&&S.side===Nn&&S.forceSinglePass===!1?(S.side=tn,S.needsUpdate=!0,Bs(S,U,z),S.side=bi,S.needsUpdate=!0,Bs(S,U,z),S.side=Nn):Bs(S,U,z)}this.compile=function(S,U,X=null){X===null&&(X=S),O!==null&&O.renderStart(S,U,X),E=Q.get(X),E.init(U),T.push(E),X.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),S!==X&&S.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),E.setupLights(),O!==null&&O.updateLights(E.state.lightsArray),Ee=this.localClippingEnabled,Me=ee.init(this.clippingPlanes,Ee),Me===!0&&ee.setGlobalState(this.clippingPlanes,U),O!==null&&fe.render(E.state.shadowsArray,X,U);let z=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let xe=H.material;if(xe)if(Array.isArray(xe))for(let Re=0;Re<xe.length;Re++){let ge=xe[Re];lu(ge,X,U,H),z.add(ge)}else lu(xe,X,U,H),z.add(xe)}),E=T.pop(),O!==null&&O.renderEnd(),z},this.compileAsync=function(S,U,X=null){let z=this.compile(S,U,X);return new Promise(H=>{function xe(){if(z.forEach(function(Re){let Te=Fe.get(Re).currentProgram;(Te===void 0||Te.isReady())&&z.delete(Re)}),z.size===0){H(S);return}setTimeout(xe,10)}lt.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let ol=null;function mf(S){ol&&ol(S)}function cu(){Ri.stop()}function uu(){Ri.start()}let Ri=new Nd;Ri.setAnimationLoop(mf),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(S){ol=S,oe.setAnimationLoop(S),S===null?Ri.stop():Ri.start()},oe.addEventListener("sessionstart",cu),oe.addEventListener("sessionend",uu),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Ve("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;O!==null&&O.renderStart(S,U);let X=oe.enabled===!0&&oe.isPresenting===!0,z=N!==null&&(re===null||X)&&N.begin(I,re);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(U),U=oe.getCamera()),S.isScene===!0&&S.onBeforeRender(I,S,U,re),E=Q.get(S,T.length),E.init(U),E.state.textureUnits=Xe.getTextureUnits(),T.push(E),ve.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?ce.setFromArrayCamera(U):$.setFromProjectionMatrix(ve,vn,U.reversedDepth),Ee=this.localClippingEnabled,Me=ee.init(this.clippingPlanes,Ee),C=_e.get(S,_.length),C.init(),_.push(C),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){let Re=I.xr.getDepthSensingMesh();Re!==null&&ll(Re,U,-1/0,I.sortObjects)}ll(S,U,0,I.sortObjects),C.finish(),O!==null&&O.updateLights(E.state.lightsArray),I.sortObjects===!0&&C.sort(Ye,ut),Ze=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,Ze&&P.addToRenderList(C,S),this.info.autoReset===!0&&this.info.reset(),Me===!0&&ee.beginShadows();let H=E.state.shadowsArray;if(fe.render(H,S,U),Me===!0&&ee.endShadows(),(z&&N.hasRenderPass())===!1){let Re=C.opaque,ge=C.transmissive;if(E.setupLights(),U.isArrayCamera){let Te=U.cameras;if(ge.length>0)for(let De=0,$e=Te.length;De<$e;De++){let it=Te[De];du(Re,ge,S,it)}Ze&&P.render(S);for(let De=0,$e=Te.length;De<$e;De++){let it=Te[De];hu(C,S,it,it.viewport)}}else ge.length>0&&du(Re,ge,S,U),Ze&&P.render(S),hu(C,S,U)}re!==null&&Y===0&&(Xe.updateMultisampleRenderTarget(re),Xe.updateRenderTargetMipmap(re)),z&&N.end(I),S.isScene===!0&&S.onAfterRender(I,S,U),he.resetDefaultState(),J=-1,ie=null,T.pop(),T.length>0?(E=T[T.length-1],Xe.setTextureUnits(E.state.textureUnits),Me===!0&&ee.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,_.pop(),_.length>0?C=_[_.length-1]:C=null,O!==null&&O.renderEnd()};function ll(S,U,X,z){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)E.pushLight(S),S.castShadow&&E.pushShadow(S);else if(S.isSprite){let Re=U.isArrayCamera?ce:$;if(!S.frustumCulled||S.intersectsFrustum(Re)){z&&Ue.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ve);let ge=ae.update(S),Te=S.material;Te.visible&&C.push(S,ge,Te,X,Ue.z,null,U)}}else if(S.isMesh||S.isLine||S.isPoints){let Re=U.isArrayCamera?ce:$;if(!S.frustumCulled||S.intersectsFrustum(Re)){let ge=ae.update(S),Te=S.material;if(z&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ue.copy(S.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ue.copy(ge.boundingSphere.center)),Ue.applyMatrix4(S.matrixWorld).applyMatrix4(ve)),Array.isArray(Te)){let De=ge.groups;for(let $e=0,it=De.length;$e<it;$e++){let Pe=De[$e],st=Te[Pe.materialIndex];st&&st.visible&&C.push(S,ge,st,X,Ue.z,Pe,U)}}else Te.visible&&C.push(S,ge,Te,X,Ue.z,null,U)}}}let xe=S.children;for(let Re=0,ge=xe.length;Re<ge;Re++)ll(xe[Re],U,X,z)}function hu(S,U,X,z){let{opaque:H,transmissive:xe,transparent:Re}=S;E.setupLightsView(X),Me===!0&&ee.setGlobalState(I.clippingPlanes,X),z&&me.viewport(se.copy(z)),H.length>0&&Xr(H,U,X),xe.length>0&&Xr(xe,U,X),Re.length>0&&Xr(Re,U,X),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function du(S,U,X,z){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[z.id]===void 0){let Pe=lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[z.id]=new pn(1,1,{generateMipmaps:!0,type:Pe?Cn:rn,minFilter:ei,samples:Math.max(4,xt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}let xe=E.state.transmissionRenderTarget[z.id],Re=z.viewport||se;xe.setSize(Re.z*I.transmissionResolutionScale,Re.w*I.transmissionResolutionScale);let ge=I.getRenderTarget(),Te=I.getActiveCubeFace(),De=I.getActiveMipmapLevel();I.setRenderTarget(xe),I.getClearColor(j),ye=I.getClearAlpha(),ye<1&&I.setClearColor(16777215,.5),I.clear(),Ze&&P.render(X);let $e=I.toneMapping;I.toneMapping=Un;let it=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),E.setupLightsView(z),Me===!0&&ee.setGlobalState(I.clippingPlanes,z),Xr(S,X,z),Xe.updateMultisampleRenderTarget(xe),Xe.updateRenderTargetMipmap(xe),lt.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let st=0,Lt=U.length;st<Lt;st++){let wt=U[st],{object:Mt,geometry:Xt,material:Le,group:jt}=wt;if(Le.side===Nn&&Mt.layers.test(z.layers)){let ft=Le.side;Le.side=tn,Le.needsUpdate=!0,fu(Mt,X,z,Xt,Le,jt),Le.side=ft,Le.needsUpdate=!0,Pe=!0}}Pe===!0&&(Xe.updateMultisampleRenderTarget(xe),Xe.updateRenderTargetMipmap(xe))}I.setRenderTarget(ge,Te,De),I.setClearColor(j,ye),it!==void 0&&(z.viewport=it),I.toneMapping=$e}function Xr(S,U,X){let z=U.isScene===!0?U.overrideMaterial:null;for(let H=0,xe=S.length;H<xe;H++){let Re=S[H],{object:ge,geometry:Te,group:De}=Re,$e=Re.material;$e.allowOverride===!0&&z!==null&&($e=z),ge.layers.test(X.layers)&&fu(ge,U,X,Te,$e,De)}}function fu(S,U,X,z,H,xe){O!==null&&H.isNodeMaterial&&O.setObject(S,H),S.onBeforeRender(I,U,X,z,H,xe),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(I,U,X,z,S,xe),H.transparent===!0&&H.side===Nn&&H.forceSinglePass===!1?(H.side=tn,H.needsUpdate=!0,I.renderBufferDirect(X,U,z,H,S,xe),H.side=bi,H.needsUpdate=!0,I.renderBufferDirect(X,U,z,H,S,xe),H.side=Nn):I.renderBufferDirect(X,U,z,H,S,xe),S.onAfterRender(I,U,X,z,H,xe)}function pu(S){let U=0;for(let X of S)X.texture!==null&&U++;return U}function Bs(S,U,X){U.isScene!==!0&&(U=nt);let z=Fe.get(S),H=E.state.lights,xe=E.state.shadowsArray,Re=H.state.version,ge=ne.getParameters(S,H.state,xe,U,X,E.state.lightProbeGridArray),Te=ne.getProgramCacheKey(ge),De=z.programs;z.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,z.fog=U.fog;let $e=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;z.envMap=R.get(S.envMap||z.environment,$e),z.envMapRotation=z.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,De===void 0&&(S.addEventListener("dispose",yt),De=new Map,z.programs=De,z.programVariants=new Map);let it=De.get(Te);if(it!==void 0){if(z.currentProgram===it&&z.lightsStateVersion===Re)return gu(S,ge),it}else ge.uniforms=ne.getUniforms(S),O!==null&&S.isNodeMaterial&&O.build(S,X,ge),S.onBeforeCompile(ge,I),it=ne.acquireProgram(ge,Te),De.set(Te,it),z.uniforms=ge.uniforms;let Pe=z.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pe.clippingPlanes=ee.uniform),gu(S,ge),z.needsLights=yf(S),z.lightsStateVersion=Re,z.needsLights&&(Pe.ambientLightColor.value=H.state.ambient,Pe.lightProbe.value=H.state.probe,Pe.sunLights.value=H.state.sun,Pe.sunLightShadows.value=H.state.sunShadow,Pe.directionalLights.value=H.state.directional,Pe.directionalLightShadows.value=H.state.directionalShadow,Pe.spotLights.value=H.state.spot,Pe.spotLightShadows.value=H.state.spotShadow,Pe.rectAreaLights.value=H.state.rectArea,Pe.ltc_1.value=H.state.rectAreaLTC1,Pe.ltc_2.value=H.state.rectAreaLTC2,Pe.pointLights.value=H.state.point,Pe.pointLightShadows.value=H.state.pointShadow,Pe.hemisphereLights.value=H.state.hemi,Pe.sunShadowMatrix.value=H.state.sunShadowMatrix,Pe.sunShadowCascade.value=H.state.sunShadowCascade,Pe.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Pe.spotLightMatrix.value=H.state.spotLightMatrix,Pe.spotLightMap.value=H.state.spotLightMap,Pe.pointShadowMatrix.value=H.state.pointShadowMatrix),z.numLightProbeGrids=pu(E.state.lightProbeGridArray),z.currentProgram=it,z.uniformsList=null,it}function gf(S,U,X,z,H){let xe=Fe.get(S),Re=xe.currentProgram.id+","+z+","+H,ge=xe.programVariants.get(Re);return ge===void 0?(ge=Bs(S,U,X),xe.programVariants.set(Re,ge)):(xe.currentProgram=ge,xe.uniformsList=null,xe.outputColorSpace=z,xe.toneMapping=H),ge}function mu(S){if(S.uniformsList===null){let U=S.currentProgram.getUniforms();S.uniformsList=Is.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function gu(S,U){let X=Fe.get(S);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function _f(S,U,X,z,H){U.isScene!==!0&&(U=nt),Xe.resetTextureUnits();let xe=U.fog,Re=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?U.environment:null,ge=re===null?I.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:rt.workingColorSpace,Te=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,De=R.get(z.envMap||Re,Te),$e=z.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,it=!!X.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Pe=!!X.morphAttributes.position,st=!!X.morphAttributes.normal,Lt=!!X.morphAttributes.color,wt=Un;z.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(wt=I.toneMapping);let Mt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Xt=Mt!==void 0?Mt.length:0,Le=Fe.get(z),jt=E.state.lights;if(Me===!0&&(Ee===!0||S!==ie)){let Ct=S===ie&&z.id===J;ee.setState(z,S,Ct)}let ft=!1,Ci=!1;z.version===Le.__version?Le.needsLights&&Le.lightsStateVersion!==jt.state.version||H.isBatchedMesh&&Le.batching===!1||!H.isBatchedMesh&&Le.batching===!0||H.isBatchedMesh&&Le.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Le.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Le.instancing===!1||!H.isInstancedMesh&&Le.instancing===!0||H.isSkinnedMesh&&Le.skinning===!1||!H.isSkinnedMesh&&Le.skinning===!0||H.isInstancedMesh&&Le.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Le.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Le.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Le.instancingMorph===!1&&H.morphTexture!==null||Le.envMap!==De||z.fog===!0&&Le.fog!==xe||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==ee.numPlanes||Le.numIntersection!==ee.numIntersection)||Le.vertexAlphas!==$e||Le.vertexTangents!==it||Le.morphTargets!==Pe||Le.morphNormals!==st||Le.morphColors!==Lt||Le.morphTargetsCount!==Xt||Le.numLightProbeGrids!==pu(E.state.lightProbeGridArray)?ft=!0:(Le.outputColorSpace!==ge||Le.toneMapping!==wt)&&(Ci=!0):(ft=!0,Le.__version=z.version);let qt=Le.currentProgram;(ft===!0||Ci===!0)&&(qt=Ci===!0?gf(z,U,H,ge,wt):Bs(z,U,H),O&&z.isNodeMaterial&&O.onUpdateProgram(z,qt,Le));let qr=!1,ri=!1,Ii=!1,ct=qt.getUniforms(),Vt=Le.uniforms;if(me.useProgram(qt.program)&&(qr=!0,ri=!0,Ii=!0),z.id!==J&&(J=z.id,ri=!0),qr||ie!==S){me.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ct.setValue(D,"projectionMatrix",S.projectionMatrix),ct.setValue(D,"viewMatrix",S.matrixWorldInverse);let Bt=ct.map.cameraPosition;Bt!==void 0&&Bt.setValue(D,de.setFromMatrixPosition(S.matrixWorld)),xt.logarithmicDepthBuffer&&ct.setValue(D,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ct.setValue(D,"isOrthographic",S.isOrthographicCamera===!0),ie!==S&&(ie=S,ri=!0,Ii=!0)}if(Le.needsLights&&(jt.state.sunShadowMap.length>0&&ct.setValue(D,"sunShadowMap",jt.state.sunShadowMap,Xe),jt.state.directionalShadowMap.length>0&&ct.setValue(D,"directionalShadowMap",jt.state.directionalShadowMap,Xe),jt.state.spotShadowMap.length>0&&ct.setValue(D,"spotShadowMap",jt.state.spotShadowMap,Xe),jt.state.pointShadowMap.length>0&&ct.setValue(D,"pointShadowMap",jt.state.pointShadowMap,Xe)),H.isSkinnedMesh){ct.setOptional(D,H,"bindMatrix"),ct.setOptional(D,H,"bindMatrixInverse");let Ct=H.skeleton;Ct&&(Ct.boneTexture===null&&Ct.computeBoneTexture(),ct.setValue(D,"boneTexture",Ct.boneTexture,Xe))}H.isBatchedMesh&&(ct.setOptional(D,H,"batchingTexture"),ct.setValue(D,"batchingTexture",H._matricesTexture,Xe),ct.setOptional(D,H,"batchingIdTexture"),ct.setValue(D,"batchingIdTexture",H._indirectTexture,Xe),ct.setOptional(D,H,"batchingColorTexture"),H._colorsTexture!==null&&ct.setValue(D,"batchingColorTexture",H._colorsTexture,Xe));let Sn=X.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&te.update(H,X,qt),(ri||Le.receiveShadow!==H.receiveShadow)&&(Le.receiveShadow=H.receiveShadow,ct.setValue(D,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&U.environment!==null&&(Vt.envMapIntensity.value=U.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=ox()),ri){if(ct.setValue(D,"toneMappingExposure",I.toneMappingExposure),Le.needsLights&&xf(Vt,Ii),xe&&z.fog===!0&&ue.refreshFogUniforms(Vt,xe),ue.refreshMaterialUniforms(Vt,z,Se,ke,E.state.transmissionRenderTarget[S.id]),Le.needsLights&&Le.numLightProbeGrids>0){let Ct=M,Bt=0;for(let Bn of E.state.lightProbeGridArray)Bn.texture!==null&&(Ct.textures[Bt]=Bn.texture,Ct.min[Bt]=Bn.boundingBox.min,Ct.max[Bt]=Bn.boundingBox.max,Ct.resolution[Bt]=Bn.resolution,Bt++);for(let Bn in Ct)Ct[Bn].length=Bt;Vt.probesSH.value=Ct.textures,Vt.probesMin.value=Ct.min,Vt.probesMax.value=Ct.max,Vt.probesResolution.value=Ct.resolution}Is.upload(D,mu(Le),Vt,Xe)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Is.upload(D,mu(Le),Vt,Xe),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ct.setValue(D,"center",H.center),ct.setValue(D,"modelViewMatrix",H.modelViewMatrix),ct.setValue(D,"normalMatrix",H.normalMatrix),ct.setValue(D,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){let Ct=z.uniformsGroups;for(let Bt=0,Bn=Ct.length;Bt<Bn;Bt++){let xu=Ct[Bt];Ne.update(xu,qt),Ne.bind(xu,qt)}}return qt}function xf(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.sunLights.needsUpdate=U,S.sunLightShadows.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function yf(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return re},this.setRenderTargetTextures=function(S,U,X){let z=Fe.get(S);z.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),Fe.get(S.texture).__webglTexture=U,Fe.get(S.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:X,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){let X=Fe.get(S);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,X=0){re=S,Z=U,Y=X;let z=null,H=!1,xe=!1;if(S){let ge=Fe.get(S);if(ge.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(D.FRAMEBUFFER,ge.__webglFramebuffer),se.copy(S.viewport),Ie.copy(S.scissor),We=S.scissorTest,me.viewport(se),me.scissor(Ie),me.setScissorTest(We),J=-1;return}else if(ge.__webglFramebuffer===void 0)Xe.setupRenderTarget(S);else if(ge.__hasExternalTextures)Xe.rebindTextures(S,Fe.get(S.texture).__webglTexture,Fe.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let $e=S.depthTexture;if(ge.__boundDepthTexture!==$e){if($e!==null&&Fe.has($e)&&(S.width!==$e.image.width||S.height!==$e.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Xe.setupDepthRenderbuffer(S)}}let Te=S.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(xe=!0);let De=Fe.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(De[U])?z=De[U][X]:z=De[U],H=!0):S.samples>0&&Xe.useMultisampledRTT(S)===!1?z=Fe.get(S).__webglMultisampledFramebuffer:Array.isArray(De)?z=De[X]:z=De,se.copy(S.viewport),Ie.copy(S.scissor),We=S.scissorTest}else se.copy(ze).multiplyScalar(Se).floor(),Ie.copy(ht).multiplyScalar(Se).floor(),We=_t;if(X!==0&&(z=q),me.bindFramebuffer(D.FRAMEBUFFER,z)&&me.drawBuffers(S,z),me.viewport(se),me.scissor(Ie),me.setScissorTest(We),H){let ge=Fe.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,X)}else if(xe){let ge=U;for(let Te=0;Te<S.textures.length;Te++){let De=Fe.get(S.textures[Te]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Te,De.__webglTexture,X,ge)}}else if(S!==null&&X!==0){let ge=Fe.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ge.__webglTexture,X)}J=-1};function _u(S){let U=Fe.get(S);return(U.__readFormat!==S.format||U.__readType!==S.type)&&(U.__readFormat=S.format,U.__readType=S.type,U.__formatReadable=xt.textureFormatReadable(S.format),U.__typeReadable=xt.textureTypeReadable(S.type)),U}this.readRenderTargetPixels=function(S,U,X,z,H,xe,Re,ge=0){if(!(S&&S.isWebGLRenderTarget)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Fe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Re!==void 0&&(Te=Te[Re],Array.isArray(Te)&&(Te=Te[0])),Te){me.bindFramebuffer(D.FRAMEBUFFER,Te);try{let De=S.textures[ge],$e=De.format,it=De.type;S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ge);let Pe=_u(De);if(Pe.__formatReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pe.__typeReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-z&&X>=0&&X<=S.height-H&&D.readPixels(U,X,z,H,le.convert($e),le.convert(it),xe)}finally{let De=re!==null?Fe.get(re).__webglFramebuffer:null;me.bindFramebuffer(D.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(S,U,X,z,H,xe,Re,ge=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=Fe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Re!==void 0&&(Te=Te[Re],Array.isArray(Te)&&(Te=Te[0])),Te)if(U>=0&&U<=S.width-z&&X>=0&&X<=S.height-H){me.bindFramebuffer(D.FRAMEBUFFER,Te);let De=S.textures[ge],$e=De.format,it=De.type;S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ge);let Pe=_u(De);if(Pe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let st=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,st),D.bufferData(D.PIXEL_PACK_BUFFER,xe.byteLength,D.STREAM_READ),D.readPixels(U,X,z,H,le.convert($e),le.convert(it),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Lt=re!==null?Fe.get(re).__webglFramebuffer:null;me.bindFramebuffer(D.FRAMEBUFFER,Lt);let wt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await rd(D,wt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,st),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,xe),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(st),D.deleteSync(wt),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,X=0){let z=Math.pow(2,-X),H=Math.floor(S.image.width*z),xe=Math.floor(S.image.height*z),Re=U!==null?U.x:0,ge=U!==null?U.y:0;Xe.setTexture2D(S,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Re,ge,H,xe),me.unbindTexture()},this.copyTextureToTexture=function(S,U,X=null,z=null,H=0,xe=0){let Re,ge,Te,De,$e,it,Pe,st,Lt,wt=S.isCompressedTexture?S.mipmaps[xe]:S.image;if(X!==null)Re=X.max.x-X.min.x,ge=X.max.y-X.min.y,Te=X.isBox3?X.max.z-X.min.z:1,De=X.min.x,$e=X.min.y,it=X.isBox3?X.min.z:0;else{let ct=Math.pow(2,-H);Re=Math.floor(wt.width*ct),ge=Math.floor(wt.height*ct),S.isDataArrayTexture?Te=wt.depth:S.isData3DTexture?Te=Math.floor(wt.depth*ct):Te=1,De=0,$e=0,it=0}z!==null?(Pe=z.x,st=z.y,Lt=z.z):(Pe=0,st=0,Lt=0);let Mt=le.convert(U.format),Xt=le.convert(U.type),Le;U.isData3DTexture?(Xe.setTexture3D(U,0),Le=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Xe.setTexture2DArray(U,0),Le=D.TEXTURE_2D_ARRAY):(Xe.setTexture2D(U,0),Le=D.TEXTURE_2D),me.activeTexture(D.TEXTURE0),me.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),me.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),me.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);let jt=me.getParameter(D.UNPACK_ROW_LENGTH),ft=me.getParameter(D.UNPACK_IMAGE_HEIGHT),Ci=me.getParameter(D.UNPACK_SKIP_PIXELS),qt=me.getParameter(D.UNPACK_SKIP_ROWS),qr=me.getParameter(D.UNPACK_SKIP_IMAGES);me.pixelStorei(D.UNPACK_ROW_LENGTH,wt.width),me.pixelStorei(D.UNPACK_IMAGE_HEIGHT,wt.height),me.pixelStorei(D.UNPACK_SKIP_PIXELS,De),me.pixelStorei(D.UNPACK_SKIP_ROWS,$e),me.pixelStorei(D.UNPACK_SKIP_IMAGES,it);let ri=S.isDataArrayTexture||S.isData3DTexture,Ii=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){let ct=Fe.get(S),Vt=Fe.get(U),Sn=Fe.get(ct.__renderTarget),Ct=Fe.get(Vt.__renderTarget);me.bindFramebuffer(D.READ_FRAMEBUFFER,Sn.__webglFramebuffer),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let Bt=0;Bt<Te;Bt++)ri&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Fe.get(S).__webglTexture,H,it+Bt),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Fe.get(U).__webglTexture,xe,Lt+Bt)),D.blitFramebuffer(De,$e,De+Re,$e+ge,Pe,st,Pe+Re,st+ge,D.DEPTH_BUFFER_BIT,D.NEAREST);me.bindFramebuffer(D.READ_FRAMEBUFFER,null),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(H!==0||S.isRenderTargetTexture||Fe.has(S)){let ct=Fe.get(S),Vt=Fe.get(U);me.bindFramebuffer(D.READ_FRAMEBUFFER,L),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,W);for(let Sn=0;Sn<Te;Sn++)ri?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ct.__webglTexture,H,it+Sn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ct.__webglTexture,H),Ii?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Vt.__webglTexture,xe,Lt+Sn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Vt.__webglTexture,xe),H!==0?D.blitFramebuffer(De,$e,De+Re,$e+ge,Pe,st,Pe+Re,st+ge,D.COLOR_BUFFER_BIT,D.NEAREST):Ii?D.copyTexSubImage3D(Le,xe,Pe,st,Lt+Sn,De,$e,Re,ge):D.copyTexSubImage2D(Le,xe,Pe,st,De,$e,Re,ge);me.bindFramebuffer(D.READ_FRAMEBUFFER,null),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Ii?S.isDataTexture||S.isData3DTexture?D.texSubImage3D(Le,xe,Pe,st,Lt,Re,ge,Te,Mt,Xt,wt.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(Le,xe,Pe,st,Lt,Re,ge,Te,Mt,wt.data):D.texSubImage3D(Le,xe,Pe,st,Lt,Re,ge,Te,Mt,Xt,wt):S.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,xe,Pe,st,Re,ge,Mt,Xt,wt.data):S.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,xe,Pe,st,wt.width,wt.height,Mt,wt.data):D.texSubImage2D(D.TEXTURE_2D,xe,Pe,st,Re,ge,Mt,Xt,wt);me.pixelStorei(D.UNPACK_ROW_LENGTH,jt),me.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ft),me.pixelStorei(D.UNPACK_SKIP_PIXELS,Ci),me.pixelStorei(D.UNPACK_SKIP_ROWS,qt),me.pixelStorei(D.UNPACK_SKIP_IMAGES,qr),xe===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&D.generateMipmap(Le),me.unbindTexture()},this.initRenderTarget=function(S){Fe.get(S).__webglFramebuffer===void 0&&Xe.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Xe.setTextureCube(S,0):S.isData3DTexture?Xe.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Xe.setTexture2DArray(S,0):Xe.setTexture2D(S,0),me.unbindTexture()},this.resetState=function(){Z=0,Y=0,re=null,me.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};var Xd=[["#8e1b1b","#1d2f6f","#e9d8a6","#d4a23a","#f4efe2"],["#1f3a6e","#b8322a","#f1e3c6","#2a9d8f","#e9c46a"],["#6b2737","#e08e45","#f8f4e3","#1b4965","#bcd4de"],["#264653","#e76f51","#f4e9cd","#2a9d8f","#e9c46a"],["#7a1f3d","#f2c14e","#fbf5e6","#3d5a80","#98c1d9"],["#3b2a1a","#c8553d","#f0e2c0","#588157","#dda15e"]];function Ls(n,e=512){let t=oi(n.seed^2654435769),i=e,s=Math.min(1024,Math.round(e*n.h/n.w)),r=document.createElement("canvas");r.width=i,r.height=s;let a=r.getContext("2d",{willReadFrequently:!0}),o=Xd[t.int(Xd.length)].slice();t.chance(.5)&&([o[0],o[1]]=[o[1],o[0]]);let[c,l,u,h,f]=o,d=i*.09;a.fillStyle=c,a.fillRect(0,0,i,s);let x=(w,M,C,E,_,T)=>{a.beginPath(),a.moveTo(w,M-E),a.lineTo(w+C,M),a.lineTo(w,M+E),a.lineTo(w-C,M),a.closePath(),_&&(a.fillStyle=_,a.fill()),T&&(a.strokeStyle=T,a.lineWidth=i*.008,a.stroke())},b=(w,M,C,E)=>{if(a.strokeStyle=C,a.lineWidth=M,a.strokeRect(w+M/2,w+M/2,i-2*w-M,s-2*w-M),!E)return;let _=M*1.15,T=Math.floor((i-2*w)/_),N=Math.floor((s-2*w)/_);for(let I=0;I<T;I++)for(let F of[w+M/2,s-w-M/2])x(w+(I+.5)*(i-2*w)/T,F,M*.3,M*.3,E);for(let I=0;I<N;I++)for(let F of[w+M/2,i-w-M/2])x(F,w+(I+.5)*(s-2*w)/N,M*.3,M*.3,E)},p=n.pattern;if(p==="stripes"||p==="bursh"){let w=p==="bursh"?22:9+t.int(5),M=0,C=0;for(;M<s;){let E=s/w*t.range(.6,1.4);if(a.fillStyle=o[C++%(p==="bursh"?3:5)],a.fillRect(0,M,i,E+1),p==="bursh"){a.fillStyle="rgba(0,0,0,.12)";for(let _=0;_<i;_+=8)a.fillRect(_,M,3,E)}M+=E}p==="stripes"&&b(0,d*.5,l,f)}else if(p==="kilim"){a.fillStyle=u,a.fillRect(d,d,i-2*d,s-2*d);let w=Math.round(7*s/i),M=4,C=(i-2*d)/M,E=(s-2*d)/w;for(let _=0;_<w;_++)for(let T=0;T<M;T++){let N=d+(T+.5)*C,I=d+(_+.5)*E;x(N,I,C*.48,E*.48,o[(T+_)%2?0:1]),x(N,I,C*.3,E*.3,h),x(N,I,C*.13,E*.13,f)}b(0,d,l,h),b(d*.85,d*.15,f)}else if(p==="geo"){a.fillStyle=f,a.fillRect(0,0,i,s);let w=i/6;for(let M=0,C=0;M<s;M+=w,C++)for(let E=0,_=0;E<i;E+=w,_++)a.fillStyle=o[(_*7+C*3+t.int(2))%4],a.beginPath(),(_+C)%2?(a.moveTo(E,M),a.lineTo(E+w,M),a.lineTo(E,M+w)):(a.moveTo(E+w,M),a.lineTo(E+w,M+w),a.lineTo(E,M+w)),a.closePath(),a.fill();b(0,d*.45,c)}else if(p==="prayer")a.fillStyle=l,a.fillRect(d,d,i-2*d,s-2*d),a.fillStyle=u,a.beginPath(),a.moveTo(d*2,s-d*2),a.lineTo(d*2,s*.36),a.quadraticCurveTo(d*2,s*.16,i/2,s*.1),a.quadraticCurveTo(i-d*2,s*.16,i-d*2,s*.36),a.lineTo(i-d*2,s-d*2),a.closePath(),a.fill(),a.strokeStyle=h,a.lineWidth=i*.015,a.stroke(),x(i/2,s*.55,i*.12,s*.09,c,h),x(i/2,s*.55,i*.05,s*.04,f),b(0,d,c,h);else{if(a.fillStyle=c,a.fillRect(d,d,i-2*d,s-2*d),p==="floral")for(let w=0;w<60;w++){let M=t.range(d*1.4,i-d*1.4),C=t.range(d*1.4,s-d*1.4),E=i*t.range(.012,.028);for(let _=0;_<6;_++)a.fillStyle=_%2?h:f,a.beginPath(),a.arc(M+Math.cos(_)*E,C+Math.sin(_)*E,E*.6,0,7),a.fill();a.fillStyle=l,a.beginPath(),a.arc(M,C,E*.5,0,7),a.fill()}else for(let w=0;w<9;w++)for(let M=0;M<6;M++)x(d*1.6+M*(i-d*3.2)/5,d*1.8+w*(s-d*3.6)/8,i*.012,i*.012,h);x(i/2,s/2,i*.34,s*.3,l,f),x(i/2,s/2,i*.24,s*.21,u,h),x(i/2,s/2,i*.12,s*.1,c,f);for(let[w,M]of[[0,0],[1,0],[0,1],[1,1]]){a.fillStyle=l,a.beginPath();let C=w?i-d:d,E=M?s-d:d,_=i*.2;a.moveTo(C,E),a.lineTo(C+(w?-_:_),E),a.lineTo(C,E+(M?-_:_)),a.closePath(),a.fill()}b(0,d,l,h),b(d*.8,d*.2,f)}let m=a.getImageData(0,0,i,s),y=m.data;for(let w=0;w<y.length;w+=4){let M=(t()-.5)*22;y[w]+=M,y[w+1]+=M,y[w+2]+=M}return a.putImageData(m,0,0),r}var cx={500:["#2a9d8f","#e8f6f3"],1e3:["#c47a3d","#fbf0e3"],5e3:["#3d5a80","#e6eef7"],1e4:["#8e1b4a","#fbe9f1"]};function Yo(n,e=t=>String(t)){let t=document.createElement("canvas");t.width=220,t.height=104;let i=t.getContext("2d"),[s,r]=cx[n]||["#555","#eee"];i.fillStyle=r,i.fillRect(0,0,220,104),i.strokeStyle=s,i.lineWidth=5,i.strokeRect(5,5,210,94),i.lineWidth=1;for(let a=0;a<9;a++)i.beginPath(),i.arc(165,52,8+a*5,0,7),i.globalAlpha=.25,i.stroke();return i.globalAlpha=1,i.fillStyle=s,i.beginPath(),i.moveTo(165,26),i.lineTo(190,52),i.lineTo(165,78),i.lineTo(140,52),i.closePath(),i.fill(),i.fillStyle=r,i.beginPath(),i.moveTo(165,38),i.lineTo(179,52),i.lineTo(165,66),i.lineTo(151,52),i.closePath(),i.fill(),i.fillStyle=s,i.textAlign="left",i.textBaseline="middle",i.font="900 34px Cairo, sans-serif",i.fillText(e(n),16,44),i.font="700 13px Cairo, sans-serif",i.fillText("SDG",16,72),i.font="700 10px Cairo, sans-serif",i.textAlign="center",i.fillText("\u0639\u0645\u0644\u0629 \u0644\u0639\u0628\u0629 \u2022 GAME PROP",110,90),t}var Br=["\u{1F4A7}","\u{1F9F5}","\u2728","\u{1F54C}","\u{1F319}","\u{1FAA3}"];function Ds(n,e=256,t="ar"){let i=document.createElement("canvas");i.width=e*2,i.height=e;let s=i.getContext("2d"),r=Li[n.palette%Li.length];s.fillStyle=r[0];let a=n.sign===1?e*.5:n.sign===2?0:e*.16;s.beginPath(),s.roundRect(4,4,e*2-8,e-8,a),s.fill(),s.strokeStyle=r[3],s.lineWidth=e*.035,s.stroke();let o=e*.36,c=e*.5,l=e*.26;s.fillStyle=r[2],s.beginPath(),s.moveTo(o,c-l*1.25),s.bezierCurveTo(o+l*1.3,c,o+l,c+l,o,c+l),s.bezierCurveTo(o-l,c+l,o-l*1.3,c,o,c-l*1.25),s.fill(),s.fillStyle=r[1],s.font=`${e*.26}px sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(Br[n.icon%Br.length],o,c+l*.15);let u=(t==="en"?n.nameEn||n.nameAr:n.nameAr||n.nameEn)||"";s.fillStyle=r[1];let h=e*.2;for(s.font=`900 ${h}px Cairo, sans-serif`;s.measureText(u).width>e*1.15&&h>10;)h-=2,s.font=`900 ${h}px Cairo, sans-serif`;return s.fillText(u,e*1.3,c),i}function qd(n){let e=document.createElement("canvas");e.width=e.height=512;let t=e.getContext("2d"),i=oi(n==="shop"?5:9),s=n==="yard"?4:8,r=512/s;for(let a=0;a<s;a++)for(let o=0;o<s;o++){let c=i.range(-8,8);t.fillStyle=n==="yard"?`rgb(${196+c},${172+c},${138+c})`:n==="hall"?(o+a)%2?`rgb(${52+c},${44+c},${40+c})`:`rgb(${92+c},${74+c},${58+c})`:`rgb(${226+c},${228+c},${226+c})`,t.fillRect(o*r,a*r,r,r),t.strokeStyle=n==="yard"?"rgba(90,70,50,.5)":"rgba(60,70,80,.35)",t.lineWidth=2,t.strokeRect(o*r,a*r,r,r)}for(let a=0;a<2500;a++)t.fillStyle=`rgba(${i.chance(.5)?0:255},${i.chance(.5)?0:255},200,${i.range(.01,.05)})`,t.fillRect(i.int(512),i.int(512),2,2);return e}var ux=`
attribute float aLayer; varying vec2 vUv; varying float vLayer; varying vec3 vWorld;
uniform float uPile;
void main(){ vUv = uv; vLayer = aLayer; vec3 p = position; p.y += aLayer * uPile;
  vec4 w = modelMatrix * vec4(p,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,hx=`
precision highp float;
varying vec2 vUv; varying float vLayer; varying vec3 vWorld;
uniform sampler2D tPattern, tA, tB, tC, tD;
uniform vec2 uSize; uniform float uDensity, uPile, uTime, uOverlay, uFade, uShells;
uniform vec3 uSun, uSunCol, uAmb, uTool, uDye;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
void main(){
  vec4 C = texture2D(tC, vUv); vec2 nap = C.xy*2.0-1.0;
  vec4 A0 = texture2D(tA, vUv); float wet0 = min(1.0, A0.a*1.5);
  // strands lean with the nap and mat down when wet
  vec2 uv = vUv - nap * vLayer * uPile * (0.8 + wet0) / uSize;
  vec4 A = texture2D(tA, uv), B = texture2D(tB, uv); vec3 stainCol = texture2D(tD, uv).rgb;
  float dust=A.r, soil=A.g, stain=A.b, wet=min(1.0,A.a*1.5), foam=B.r, soap=B.g, bleed=B.b, stress=B.a, slurry=C.b;
  vec2 cell = uv * uSize * uDensity; float h = hash(floor(cell));
  float foamN = noise(uv*uSize*38.0 + uTime*0.15) * 0.6 + noise(uv*uSize*90.0 - uTime*0.1) * 0.4;
  float foamA = smoothstep(0.42, 0.75, foam*1.35 + (foamN-0.5)*0.7) ;
  if (uShells > 1.5 && vLayer > 0.001) {
    float keep = h * (1.0 - stress*0.7) * (1.0 - wet*0.35);
    vec2 f = fract(cell)-0.5;
    bool strand = keep > vLayer && length(f) < 0.5*(1.15 - vLayer*0.7);
    bool bubble = foamA > 0.05 && vLayer < foamA*1.0 && foamN > vLayer*0.9;
    if (!strand && !bubble) discard;
    if (!strand) h = -1.0;
  }
  vec3 col = texture2D(tPattern, uv).rgb;
  col = mix(col, vec3(dot(col, vec3(0.3,0.5,0.2))) * 1.1, uFade*0.6);
  col = mix(col, mix(col, uDye, 0.75), smoothstep(0.03, 0.5, bleed));       // dye that ran
  col = mix(col, col*vec3(0.34,0.27,0.2), clamp(soil*1.25,0.0,1.0));          // ground-in soil
  col = mix(col, stainCol, clamp(stain*0.9,0.0,1.0));
  col = mix(col, vec3(0.62,0.53,0.4), clamp(dust*0.85,0.0,1.0) * (0.75+0.25*noise(uv*uSize*30.0)));
  col *= mix(1.0, 0.6, wet);
  col = mix(col, col*vec3(0.5,0.42,0.33), clamp(slurry*1.2,0.0,1.0)*wet);     // dirty water sitting in the pile
  float ao = uShells > 1.5 ? 0.55 + 0.45*vLayer : 1.0;
  vec3 V = normalize(cameraPosition - vWorld);
  float sheen = dot(normalize(nap + 1e-4), normalize(V.xz + 1e-4)) * length(nap) * 0.13;
  float fibre = 0.9 + 0.2*hash(floor(cell)+7.0);
  col *= ao * fibre * (1.0 + sheen);
  vec3 light = uAmb + uSunCol * max(uSun.y, 0.0);
  float sh = 1.0 - 0.45 * smoothstep(uTool.z*1.25, uTool.z*0.5, distance(vWorld.xz, uTool.xy));
  col *= light * sh;
  vec3 H = normalize(normalize(uSun) + V);
  col += uSunCol * pow(max(H.y,0.0), 60.0) * wet * 0.35 * step(0.6, vLayer + (uShells<1.5?1.0:0.0));
  if (foamA > 0.02) {
    vec3 fcol = mix(vec3(0.97,0.98,1.0), vec3(0.72,0.63,0.5), clamp(slurry*1.6,0.0,1.0));
    float b = 0.82 + 0.18*noise(uv*uSize*140.0 + uTime*0.4);
    float fa = h < 0.0 ? 1.0 : foamA * 0.9;
    col = mix(col, fcol * b * (uAmb + uSunCol*0.9) , fa);
  }
  if (uOverlay > 0.5 && uOverlay < 1.5) { float d = clamp(dust+soil+stain,0.0,1.0); col = mix(col*0.35, mix(vec3(0.1,0.75,0.3), vec3(0.95,0.15,0.1), d), 0.75); }
  if (uOverlay > 1.5 && uOverlay < 2.5) col = mix(col*0.35, mix(vec3(0.95,0.85,0.2), vec3(0.1,0.3,0.95), wet), 0.75);
  if (uOverlay > 2.5) col = mix(col*0.3, mix(vec3(0.15,0.15,0.2), vec3(0.6,0.3,1.0), clamp(soap*1.5,0.0,1.0)), 0.8);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function Yd(n){let e=new Wo({canvas:n,antialias:!0,powerPreference:"high-performance"});e.toneMapping=Er,e.toneMappingExposure=1.05,e.shadowMap.enabled=!0,e.shadowMap.type=Hi;let t=new or,i=new Jt(42,1,.05,80),s=new yr(13625087,9071173,.9);t.add(s);let r=new wr(16773336,2.4);r.castShadow=!0,r.shadow.mapSize.set(1024,1024),r.shadow.camera.left=-6,r.shadow.camera.right=6,r.shadow.camera.top=6,r.shadow.camera.bottom=-6,r.shadow.bias=-.0015,t.add(r),t.add(r.target);let a=new Sr(16769712,0,12,.5,.6,1);a.position.set(0,5,1.5),t.add(a),t.add(a.target);let o={renderer:e,scene:t,camera:i,quality:1,view:"work",envKind:null,rug:null,time:0,toolPos:new k(0,0,-99),sunDir:new k(.4,.8,.3),sunCol:new He(1,.95,.85),amb:new He(.45,.47,.5),hud:{top:120,bottom:210}},c=new dn;t.add(c);let l=new dn;t.add(l);let u=new dn;t.add(u);let h=($,ce=.85,Me=0)=>new Ss({color:$,roughness:ce,metalness:Me}),f=($,ce,Me=0,Ee=0,ve=0,de=!0)=>{let Ue=new sn($,ce);return Ue.position.set(Me,Ee,ve),Ue.castShadow=de,Ue.receiveShadow=!0,Ue},d=($,ce,Me,Ee,ve,de,Ue)=>f(new xi($,ce,Me),Ee,ve,de,Ue),x=($,ce,Me,Ee,ve,de,Ue,nt=20)=>f(new pr($,ce,Me,nt),Ee,ve,de,Ue);function b($){if(o.envKind===$)return;o.envKind=$,c.traverse(Ee=>{Ee.geometry&&Ee.geometry.dispose()}),c.clear();let ce=new Gi(qd($));ce.wrapS=ce.wrapT=ds,ce.repeat.set(8,8),ce.colorSpace=zt,ce.anisotropy=4;let Me=f(new yi(30,30),new Ss({map:ce,roughness:$==="yard"?.95:.35,metalness:0}),0,0,0,!1);if(Me.rotation.x=-Math.PI/2,c.add(Me),$==="yard"){let Ee=h(14268810),ve=h(2074272,.5,.3);c.add(d(14,2.6,.25,Ee,0,1.3,-5.2),d(.25,2.6,12,Ee,-6.2,1.3,0),d(.25,2.6,12,Ee,6.2,1.3,0)),c.add(d(14.1,.12,.32,h(12096618),0,2.66,-5.2)),c.add(d(1.9,2.2,.08,ve,3.4,1.1,-5.05),d(.08,2.2,.1,h(1011562),3.4,1.1,-5)),c.add(d(1.2,1,.06,h(7049134,.3),-3.2,1.6,-5.05),d(1.3,.08,.1,h(8018490),-3.2,1.05,-5)),c.add(x(.38,.38,1,h(3108784,.5,.2),-5.3,.5,-4.2),x(.4,.4,.04,h(2051968),-5.3,1.02,-4.2)),c.add(x(.16,.2,2.2,h(7031339),5,1.1,-3.8,8));for(let[de,Ue,nt,Ze]of[[5,2.7,-3.8,1.2],[4.4,2.3,-3.3,.8],[5.6,2.4,-4.2,.9]])c.add(f(new mr(Ze,1),h(5209402,1),de,Ue,nt));for(let de of[-1.2,-.5])c.add(f(new gr(.3,16,12),h(11887946,.9),de-4,.42,-4.5),x(.2,.26,.12,h(5913130),de-4,.06,-4.5));c.add(x(.02,.02,9,h(4473924),0,2.2,-4.6,6).rotateZ(Math.PI/2));for(let[de,Ue]of[[-1.5,12071466],[.2,2046574],[1.6,15320170]])c.add(d(.9,1.1,.03,h(Ue,1),de,1.62,-4.6))}else if($==="shop"){let Ee=h(15659246),ve=h(1844306,.6);c.add(d(14,3.2,.2,Ee,0,1.6,-4.6),d(.2,3.2,12,Ee,-5.6,1.6,0),d(.2,3.2,12,Ee,5.6,1.6,0)),c.add(d(14,.9,.22,ve,0,.45,-4.58),d(.22,.9,12,ve,-5.58,.45,0),d(.22,.9,12,ve,5.58,.45,0)),c.add(d(2.6,.9,.7,h(8018490,.6),-3.6,.45,-3.9),d(2.7,.06,.8,h(12876349,.4),-3.6,.93,-3.9));for(let de=0;de<4;de++)c.add(x(.16,.16,1.5,h([9313051,2046574,15320170,2792847][de],1),2.2+de*.42,.85,-4.2,14));c.add(d(2.2,.06,.5,h(10066329,.4,.6),2.85,.08,-4.2),d(3,.5,.05,h(2074272,.5),0,2.6,-4.48)),c.add(x(.3,.3,.9,h(3108784,.5),4.9,.45,-3.9))}else{let Ee=h(2761520),ve=h(13214283,.35,.8);c.add(d(16,5,.3,Ee,0,2.5,-5),d(.3,5,14,Ee,-6.5,2.5,0),d(.3,5,14,Ee,6.5,2.5,0));for(let de of[-4.2,-1.4,1.4,4.2])c.add(x(.16,.2,4.2,h(15260868,.5),de,2.1,-4.5),d(.5,.12,.5,ve,de,4.25,-4.5));c.add(x(1.9,2,.16,h(3813183,.4),0,.08,0,40),f(new _r(1.95,.03,8,60),ve,0,.17,0).rotateX(Math.PI/2))}}let p=null;function m($,ce){if(l.traverse(R=>{R.geometry&&R.geometry.dispose(),R.material&&R.material.dispose&&R.material.dispose()}),l.clear(),p)for(let R of p.tex)R.dispose();if(o.rug=$,!$)return;let{w:Me,h:Ee}=$.spec,ve=$.mat.pile,de=o.quality===0?1:ve>1?o.quality===2?20:12:ve>.3?o.quality===2?10:7:4,Ue=[],nt=[],Ze=[],Et=[];for(let R=0;R<de;R++){let v=de===1?0:R/(de-1),B=R*4;Ue.push(-Me/2,0,-Ee/2,Me/2,0,-Ee/2,Me/2,0,Ee/2,-Me/2,0,Ee/2),nt.push(0,0,1,0,1,1,0,1),Ze.push(v,v,v,v),Et.push(B,B+2,B+1,B,B+3,B+2)}let D=new Kt;D.setAttribute("position",new vt(Ue,3)),D.setAttribute("uv",new vt(nt,2)),D.setAttribute("aLayer",new vt(Ze,1)),D.setIndex(Et);let dt=()=>{let R=new vs(new Uint8Array($.n*4),$.W,$.H,gn);return R.magFilter=R.minFilter=Wt,R.needsUpdate=!0,R};p={tex:[dt(),dt(),dt(),dt()]};let lt=p.tex[3].image.data;for(let R=0;R<$.n;R++){let v=$.stainType[R]?ks[zn[$.stainType[R]-1]].color:[.4,.3,.2];lt[R*4]=v[0]*255,lt[R*4+1]=v[1]*255,lt[R*4+2]=v[2]*255,lt[R*4+3]=255}let xt=new Gi(ce);xt.colorSpace=zt,xt.anisotropy=4,xt.flipY=!1;let me=ce.getContext("2d").getImageData(ce.width>>1,ce.height>>3,1,1).data,It=new Mn({vertexShader:ux,fragmentShader:hx,uniforms:{tPattern:{value:xt},tA:{value:p.tex[0]},tB:{value:p.tex[1]},tC:{value:p.tex[2]},tD:{value:p.tex[3]},uSize:{value:new Je(Me,Ee)},uDensity:{value:ve>1?230:420},uPile:{value:.004+ve*.011},uTime:{value:0},uOverlay:{value:0},uFade:{value:0},uShells:{value:de},uSun:{value:o.sunDir},uSunCol:{value:o.sunCol},uAmb:{value:o.amb},uTool:{value:new k(0,-99,.2)},uDye:{value:new He().setRGB(me[0]/255,me[1]/255,me[2]/255,zt)}}}),Fe=new sn(D,It);Fe.position.y=.022,Fe.frustumCulled=!1,l.add(Fe),l.add(d(Me+.01,.02,Ee+.01,h(10126694,1),0,.011,0));let Xe=h(15656658,1);for(let R of[-Ee/2-.035,Ee/2+.035])for(let v=-Me/2+.015;v<Me/2;v+=.03)l.add(d(.012,.006,.07,Xe,v,.006,R));o.rugMat=It,l.rotation.y=0,l.position.set(0,o.envKind==="hall"?.17:0,0),y(),ie()}function y(){let $=o.rug;if(!$)return;let[ce,Me,Ee]=p.tex.map(ve=>ve.image.data);for(let ve=0,de=0;ve<$.n;ve++,de+=4)ce[de]=$.dust[ve]*255,ce[de+1]=$.soil[ve]*255,ce[de+2]=$.stain[ve]*255,ce[de+3]=$.wet[ve]*170,Me[de]=$.foam[ve]*255,Me[de+1]=$.soap[ve]*255,Me[de+2]=$.bleed[ve]*255,Me[de+3]=$.stress[ve]*255,Ee[de]=$.napX[ve]*127+128,Ee[de+1]=$.napY[ve]*127+128,Ee[de+2]=$.slurry[ve]*255,Ee[de+3]=255;p.tex[0].needsUpdate=p.tex[1].needsUpdate=p.tex[2].needsUpdate=!0,o.rugMat.uniforms.uFade.value=$.fade||0}let w={},M=null;function C(){let $=h(10134445,.35,.8),ce=h(3159098,.6),Me=h(1855392,.45,.1),Ee=h(9067051,.7),ve=h(2763306,1),de=h(15317321,.6),Ue=(...D)=>{let dt=new dn;return dt.add(...D),dt.visible=!1,u.add(dt),dt},nt=(D,dt=$)=>{let lt=x(.014,.014,D,dt,0,0,0,8);return lt.rotation.x=-.6,lt.position.set(0,D*.41,D*.28),lt};w.dry=Ue(d(.3,.02,.2,h(13214059,.9),0,.03,0),d(.02,.02,.2,Ee,-.1,.045,0),d(.02,.02,.2,Ee,.1,.045,0),nt(.9,Ee)),w.spray=Ue(x(.02,.012,.22,de,0,.32,.08).rotateX(-.9),x(.012,.012,.6,h(3046706,.7),0,.5,.42,8).rotateX(-.7)),w.chem=Ue(x(.05,.055,.16,h(16777215,.3),0,.3,.1),x(.02,.02,.05,h(14235198,.4),0,.4,.1),d(.03,.02,.09,h(14235198,.4),0,.43,.06)),w.brush=Ue(d(.2,.035,.085,Ee,0,.07,0),d(.19,.045,.075,ve,0,.03,0),d(.03,.03,.14,Ee,0,.1,.08));let Ze=new dn;Ze.add(x(.235,.235,.035,ve,0,.022,0,28));for(let D=0;D<10;D++){let dt=D/10*6.283;Ze.add(d(.05,.012,.012,h(6710886),Math.cos(dt)*.16,.042,Math.sin(dt)*.16))}M=Ze,w.rotary=Ue(Ze,x(.25,.25,.05,$,0,.07,0,28),x(.12,.15,.2,Me,0,.19,0,20),d(.2,.12,.14,h(12107462,.4,.5),0,.33,.02),x(.045,.045,.06,ce,-.2,.05,.22,12).rotateZ(1.57),x(.045,.045,.06,ce,.2,.05,.22,12).rotateZ(1.57),(()=>{let D=x(.018,.018,1.05,$,0,0,0,8);return D.rotation.x=-.55,D.position.set(0,.72,.36),D})(),x(.016,.016,.44,ce,0,1.17,.63,8).rotateZ(1.57)),w.extract=Ue(d(.4,.05,.02,ce,0,.03,0),d(.4,.02,.05,$,0,.06,0),nt(1));let Et=[d(.44,.02,.03,Ee,0,.07,0),nt(.9,Ee)];for(let D=0;D<12;D++)Et.push(d(.008,.06,.008,$,-.2+D*.0364,.035,0));w.groom=Ue(...Et)}C();let E=null,_=0;function T($,ce,Me,Ee,ve=0,de=0,Ue=0){for(let nt in w)w[nt].visible=nt===$;if(E=$?w[$]:null,!E){o.toolPos.set(0,0,-99),o.rugMat&&o.rugMat.uniforms.uTool.value.set(0,-99,.2);return}if(o.toolPos.set(ce,Ee?.03:.1,Me),E.position.lerp(o.toolPos,.6),$!=="rotary"&&$!=="chem"&&$!=="spray"&&Math.hypot(ve,de)>.002){let Ze=Math.atan2(ve,de)-_;for(;Ze>Math.PI;)Ze-=6.283;for(;Ze<-Math.PI;)Ze+=6.283;_+=Ze*.25}else($==="rotary"||$==="chem"||$==="spray")&&(_=0);E.rotation.y=_,M&&$==="rotary"&&(M.rotation.y+=Ue),o.rugMat&&o.rugMat.uniforms.uTool.value.set(ce,Me,$==="rotary"?.34:.2)}let N=260,I=new Float32Array(N*3),F=new Float32Array(N*3),O=new Float32Array(N*3),q=new Float32Array(N),L=new Kt;L.setAttribute("position",new fn(I,3)),L.setAttribute("color",new fn(F,3));let W=new ur(L,new Ms({size:.028,vertexColors:!0,transparent:!0,opacity:.85,depthWrite:!1}));W.frustumCulled=!1,t.add(W);let Z=0;for(let $=0;$<N;$++)I[$*3+1]=-5;function Y($,ce,Me,Ee=3){for(let ve=0;ve<Ee;ve++){let de=Z=(Z+1)%N,Ue=Math.random()*6.283,nt=Me==="water"?.25:.7;I[de*3]=$+Math.cos(Ue)*.05,I[de*3+1]=Me==="water"?.3:.05,I[de*3+2]=ce+Math.sin(Ue)*.05,O[de*3]=Math.cos(Ue)*nt*Math.random(),O[de*3+1]=Me==="water"?-.6:.5+Math.random()*.6,O[de*3+2]=Math.sin(Ue)*nt*Math.random();let Ze=Me==="water"?[.6,.8,1]:Me==="dust"?[.75,.62,.45]:Me==="chem"?[.7,1,.8]:[1,1,1];F[de*3]=Ze[0],F[de*3+1]=Ze[1],F[de*3+2]=Ze[2],q[de]=.5+Math.random()*.4}}function re($){for(let ce=0;ce<N;ce++)q[ce]<=0||(q[ce]-=$,O[ce*3+1]-=2.2*$,I[ce*3]+=O[ce*3]*$,I[ce*3+1]+=O[ce*3+1]*$,I[ce*3+2]+=O[ce*3+2]*$,(q[ce]<=0||I[ce*3+1]<0)&&(q[ce]=0,I[ce*3+1]=-5));L.attributes.position.needsUpdate=!0,L.attributes.color.needsUpdate=!0}function J(){let $=n.clientWidth||innerWidth,ce=n.clientHeight||innerHeight,Me=Math.min(devicePixelRatio||1,o.quality===0?1:o.quality===1?1.5:2);e.setPixelRatio(Me),e.setSize($,ce,!1),i.aspect=$/ce,i.updateProjectionMatrix(),ie()}function ie(){let $=o.rug,ce=$?$.spec.w:2,Me=$?$.spec.h:3,Ee=n.clientHeight||innerHeight,ve=Math.max(.35,1-(o.hud.top+o.hud.bottom)/Ee),de=zo.degToRad(i.fov),Ue=2*Math.atan(Math.tan(de/2)*i.aspect);if(o.view==="top"){let D=Math.max(Me*1.12/(2*Math.tan(de/2)),ce*1.12/(2*Math.tan(Ue/2)));i.position.set(0,D,.001),i.up.set(0,0,-1),i.lookAt(0,0,0);return}if(i.up.set(0,1,0),o.view==="show"){i.position.set(0,2.6,4.6),i.lookAt(0,.3,0);return}let nt=1,Ze=Math.max(Me*Math.sin(nt)*1.1/(2*Math.tan(de/2)*ve),ce*1.18/(2*Math.tan(Ue/2))),Et=(o.hud.bottom-o.hud.top)/Ee*Ze*Math.tan(de/2)*1;i.position.set(0,Ze*Math.sin(nt),Ze*Math.cos(nt)+Et),i.lookAt(0,0,Et)}function se($){o.view=$,ie()}function Ie($,ce,Me){let Ee=($-6)/12,ve=Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,Ee)))),de=$<5.5||$>18.5,Ue=Math.max(.12,ve),nt=(Ee-.5)*2.2;o.sunDir.set(Math.sin(nt)*.8,Ue*1.1,.45).normalize();let Ze=1-ve;o.sunCol.setRGB(1,.93-Ze*.25,.8-Ze*.4).multiplyScalar(de?.12:(ce==="clear"?1.05:.55)*(.5+ve*.6));let Et=ce==="dust"?new He(.85,.66,.42):ce==="rain"?new He(.5,.55,.62):new He(.55,.75,.98),D=o.envKind==="hall"?new He(.05,.04,.06):de?new He(.04,.06,.14):Et.clone().lerp(new He(.98,.62,.35),Ze*.7);if(t.background=D,t.fog=ce==="dust"&&o.envKind==="yard"?new ar(D,3,16):null,o.envKind==="hall")o.amb.setRGB(.3,.27,.25),o.sunCol.setRGB(1.1,.95,.75),o.sunDir.set(0,1,.25).normalize(),a.intensity=60,s.intensity=.25,r.intensity=.2;else{a.intensity=de||Me?25:0;let dt=de?.3:Me?.62:.42+ve*.12;o.amb.setRGB(dt,dt*(de?1.02:1),dt*(de?1.25:1.05)),Me&&!de&&o.sunCol.multiplyScalar(.55),s.intensity=de?.35:.95,r.intensity=de?.25:(ce==="clear"?2.5:1.2)*(Me?.5:1)*(.4+ve*.7)}r.color.copy(o.sunCol).multiplyScalar(1/Math.max(.2,Math.max(o.sunCol.r,o.sunCol.g,o.sunCol.b))),r.position.copy(o.sunDir).multiplyScalar(9)}let We=new Tr,j=new hn(new k(0,1,0),-.03),ye=new k,Ae=new Je;function ke($,ce){let Me=n.getBoundingClientRect();return Ae.set(($-Me.left)/Me.width*2-1,-((ce-Me.top)/Me.height)*2+1),We.setFromCamera(Ae,i),!We.ray.intersectPlane(j,ye)||!o.rug?null:{x:ye.x,z:ye.z,mx:ye.x+o.rug.spec.w/2,my:ye.z+o.rug.spec.h/2}}function Se($=.016){o.time+=$,o.rugMat&&(o.rugMat.uniforms.uTime.value=o.time),o.view==="show"&&(l.rotation.y+=$*.25),re($),e.render(t,i)}function Ye($=256){let ce=o.view,Me=u.visible,Ee=o.rugMat.uniforms.uOverlay.value,ve=e.getSize(new Je),de=e.getPixelRatio(),Ue=i.aspect,nt=$,Ze=Math.round($*o.rug.spec.h/o.rug.spec.w);u.visible=!1,W.visible=!1,o.rugMat.uniforms.uOverlay.value=0,o.rugMat.uniforms.uTool.value.set(0,-99,.2),e.setPixelRatio(1),e.setSize(nt,Ze,!1),i.aspect=nt/Ze,i.updateProjectionMatrix();let Et=o.rug.spec.h*1.02/(2*Math.tan(zo.degToRad(i.fov)/2));i.position.set(0,Et,.001),i.up.set(0,0,-1),i.lookAt(0,0,0),e.render(t,i);let D="";try{D=n.toDataURL("image/webp",.8),D.startsWith("data:image/webp")||(D=n.toDataURL("image/jpeg",.8))}catch{}return u.visible=Me,W.visible=!0,o.rugMat.uniforms.uOverlay.value=Ee,e.setPixelRatio(de),e.setSize(ve.x,ve.y,!1),i.aspect=Ue,i.updateProjectionMatrix(),o.view=ce,ie(),D}let ut=null;function ze($){if(ut&&(t.remove(ut),ut.material.map.dispose(),ut.material.dispose(),ut.geometry.dispose(),ut=null),!$||!o.rug)return;let ce=new Gi($);ce.colorSpace=zt;let Me=Math.min(.7,o.rug.spec.w*.42);ut=new sn(new yi(Me,Me/2),new ys({map:ce,transparent:!0,opacity:.92,toneMapped:!1})),ut.rotation.x=-Math.PI/2,ut.position.set(o.rug.spec.w/2-Me/2-.03,.09,o.rug.spec.h/2-Me/4-.03),t.add(ut)}let ht=$=>{o.rugMat&&(o.rugMat.uniforms.uOverlay.value=$)},_t=$=>{o.quality=$,e.shadowMap.enabled=$>0,J()};return b("yard"),Ie(10,"clear",!1),Object.assign(o,{setEnv:b,setRug:m,updateMasks:y,setTool:T,emit:Y,resize:J,fit:ie,setView:se,setLight:Ie,pick:ke,render:Se,snapshot:Ye,setOverlay:ht,setQuality:_t,setMark:ze,rugGroup:l})}var $d={ok:["\u062D\u0633\u0646\u0627\u064B","\u062A\u0645\u0627\u0645","OK"],cancel:["\u0625\u0644\u063A\u0627\u0621","\u062E\u0644\u0651\u064A\u0647\u0627","Cancel"],back:["\u0631\u062C\u0648\u0639","\u0627\u0631\u062C\u0639","Back"],continue:["\u0645\u062A\u0627\u0628\u0639\u0629","\u0648\u0627\u0635\u0644","Continue"],save:["\u062D\u0641\u0638","\u0627\u062D\u0641\u0638","Save"],accept:["\u0642\u0628\u0648\u0644","\u0645\u0648\u0627\u0641\u0642","Accept"],decline:["\u0631\u0641\u0636","\u0645\u0627 \u062F\u0627\u064A\u0631","Decline"],"unit.l":["\u0644\u062A\u0631",null,"L"],"unit.ml":["\u0645\u0644",null,"ml"],"unit.m":["\u0645",null,"m"],"unit.cm":["\u0633\u0645",null,"cm"],"unit.min":["\u062F\u0642\u064A\u0642\u0629",null,"min"],"days.one":["\u064A\u0648\u0645 \u0648\u0627\u062D\u062F",null,"{n} day"],"days.two":["\u064A\u0648\u0645\u0627\u0646","\u064A\u0648\u0645\u064A\u0646","{n} days"],"days.few":["{n} \u0623\u064A\u0627\u0645",null,"{n} days"],"days.many":["{n} \u064A\u0648\u0645\u0627\u064B","{n} \u064A\u0648\u0645","{n} days"],"stains.one":["\u0628\u0642\u0639\u0629 \u0648\u0627\u062D\u062F\u0629",null,"{n} stain"],"stains.two":["\u0628\u0642\u0639\u062A\u0627\u0646","\u0628\u0642\u0639\u062A\u064A\u0646","{n} stains"],"stains.few":["{n} \u0628\u0642\u0639",null,"{n} stains"],"stains.many":["{n} \u0628\u0642\u0639\u0629",null,"{n} stains"],"rugs.one":["\u0633\u062C\u0627\u062F\u0629 \u0648\u0627\u062D\u062F\u0629",null,"{n} rug"],"rugs.two":["\u0633\u062C\u0627\u062F\u062A\u0627\u0646","\u0633\u062C\u0627\u062F\u062A\u064A\u0646","{n} rugs"],"rugs.few":["{n} \u0633\u062C\u0627\u062F\u0627\u062A",null,"{n} rugs"],"rugs.many":["{n} \u0633\u062C\u0627\u062F\u0629",null,"{n} rugs"],"menu.start":["\u0627\u0628\u062F\u0623 \u0627\u0644\u0644\u0639\u0628","\u064A\u0644\u0627 \u0646\u0628\u062F\u0623","Start"],"menu.continue":["\u0645\u062A\u0627\u0628\u0639\u0629","\u0648\u0627\u0635\u0644","Continue"],"menu.new":["\u0644\u0639\u0628\u0629 \u062C\u062F\u064A\u062F\u0629","\u0644\u0639\u0628\u0629 \u062C\u062F\u064A\u062F\u0629","New game"],"menu.newq":["\u0628\u062F\u0621 \u0644\u0639\u0628\u0629 \u062C\u062F\u064A\u062F\u0629\u061F",null,"Start a new game?"],"menu.newwarn":["\u0633\u064A\u064F\u0633\u062A\u0628\u062F\u0644 \u0645\u0644\u0641 \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u062D\u0627\u0644\u064A. \u0635\u0627\u0644\u0629 \u0627\u0644\u0639\u0631\u0636 \u062A\u0628\u0642\u0649 \u0643\u0645\u0627 \u0647\u064A.",null,"This replaces the current save. Your showroom is kept."],"menu.showroom":["\u0635\u0627\u0644\u0629 \u0627\u0644\u0639\u0631\u0636","\u0635\u0627\u0644\u0629 \u0644\u064E\u0645\u0652\u0639\u0629","Showroom"],"menu.settings":["\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",null,"Settings"],"menu.note":["\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0642\u064A\u0645 \u0644\u0639\u0628 \u062E\u064A\u0627\u0644\u064A\u0629 \u0628\u0627\u0644\u062C\u0646\u064A\u0647 \u0627\u0644\u0633\u0648\u062F\u0627\u0646\u064A\u060C \u0648\u0627\u0644\u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0645\u062C\u0633\u0651\u0645\u0627\u062A \u0644\u0639\u0628\u0629.",null,"Prices are fictional game values in SDG; banknotes are game props."],"intro.title":["\u0645\u0646 \u0627\u0644\u062D\u0648\u0634 \u0625\u0644\u0649 \u0627\u0644\u0625\u0645\u0628\u0631\u0627\u0637\u0648\u0631\u064A\u0629",null,"From a courtyard to an empire"],"npc.tayeb":["\u0639\u0645 \u0627\u0644\u0637\u064A\u0628 \u2014 \u0627\u0644\u0623\u0633\u0637\u0649",null,"Uncle Eltayeb \u2014 the master"],"intro.tayeb":["\u064A\u0627 \u0628\u0646\u064A\u060C \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062A\u064F\u0641\u0647\u0645 \u0642\u0628\u0644 \u0623\u0646 \u062A\u064F\u063A\u0633\u0644. \u0627\u0646\u0641\u0636 \u063A\u0628\u0627\u0631\u0647\u0627 \u0648\u0647\u064A \u062C\u0627\u0641\u0629\u060C \u062B\u0645 \u0628\u0644\u0651\u0644\u0647\u0627\u060C \u062B\u0645 \u0627\u0644\u0635\u0627\u0628\u0648\u0646 \u0648\u0627\u0644\u0641\u0631\u0643\u060C \u062B\u0645 \u0627\u0634\u0637\u0641 \u0648\u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621.","\u064A\u0627 \u0648\u0644\u062F\u064A\u060C \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0628\u062A\u062A\u0641\u0647\u0645 \u0642\u0628\u0644 \u0645\u0627 \u062A\u062A\u063A\u0633\u0644. \u0627\u0646\u0641\u0636 \u063A\u0628\u0627\u0631\u0647\u0627 \u0648\u0647\u064A \u0646\u0627\u0634\u0641\u0629\u060C \u0628\u0639\u062F\u064A\u0646 \u0628\u0644\u0651\u0647\u0627\u060C \u0628\u0639\u062F\u064A\u0646 \u0627\u0644\u0635\u0627\u0628\u0648\u0646 \u0648\u0627\u0644\u0641\u0631\u0643\u060C \u0648\u0628\u0639\u062F\u0647\u0627 \u0627\u0634\u0637\u0641 \u0648\u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0648\u064A\u0629.","Son, you read a rug before you wash it. Beat the dust out dry, then wet it, soap and scrub, then rinse and pull the water out."],"intro.body":["\u062A\u0628\u062F\u0623 \u0628\u0639\u064F\u062F\u0651\u0629 \u064A\u062F\u0648\u064A\u0629 \u0648\u0632\u064A\u0627\u0631\u0627\u062A \u0645\u0646\u0632\u0644\u064A\u0629. \u0627\u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\u060C \u0627\u0641\u062D\u0635 \u0627\u0644\u0633\u062C\u0627\u062F\u0629\u060C \u0627\u062A\u0641\u0642 \u0639\u0644\u0649 \u0627\u0644\u0633\u0639\u0631\u060C \u0648\u0627\u063A\u0633\u0644 \u0628\u0625\u062A\u0642\u0627\u0646. \u0627\u062F\u0651\u062E\u0631 \u0644\u0627\u0633\u062A\u0626\u062C\u0627\u0631 \u0645\u062D\u0644\u060C \u062B\u0645 \u0627\u0634\u062A\u0631\u0650 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0648\u0627\u0628\u0646\u0650 \u0635\u0627\u0644\u0629 \u0639\u0631\u0636\u0643.",null,"You start with a hand kit and home visits. Take bookings, inspect the rug, agree a price and clean with care. Save up to rent a shop, then buy machines and build your showroom."],"intro.go":["\u0647\u064A\u0627 \u0628\u0646\u0627","\u064A\u0644\u0627","Let's go"],"set.ui":["\u0644\u063A\u0629 \u0627\u0644\u0648\u0627\u062C\u0647\u0629",null,"Interface language"],"set.dlg":["\u0644\u063A\u0629 \u0627\u0644\u062D\u0648\u0627\u0631",null,"Dialogue language"],"set.sub":["\u062A\u0631\u062C\u0645\u0629 \u0633\u0641\u0644\u064A\u0629 \u0644\u0644\u062D\u0648\u0627\u0631",null,"Dialogue subtitles"],"set.digits":["\u0627\u0644\u0623\u0631\u0642\u0627\u0645",null,"Digits"],"set.sound":["\u0627\u0644\u0635\u0648\u062A",null,"Sound"],"set.quality":["\u062C\u0648\u062F\u0629 \u0627\u0644\u0631\u0633\u0648\u0645",null,"Graphics quality"],"set.on":["\u0645\u0641\u0639\u0651\u0644",null,"On"],"set.off":["\u0628\u062F\u0648\u0646",null,"Off"],"set.q0":["\u062E\u0641\u064A\u0641\u0629",null,"Low"],"set.q1":["\u0645\u062A\u0648\u0633\u0637\u0629",null,"Medium"],"set.q2":["\u0639\u0627\u0644\u064A\u0629",null,"High"],"set.sample":["\u0645\u062B\u0627\u0644 \u0639\u0644\u0649 \u0627\u0644\u062D\u0648\u0627\u0631:",null,"Dialogue sample:"],"hub.day":["\u0627\u0644\u064A\u0648\u0645",null,"Day"],"hub.endday":["\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u064A\u0648\u0645","\u0646\u0642\u0641\u0644 \u0627\u0644\u064A\u0648\u0645","End the day"],"hub.endq":["\u062A\u064F\u062F\u0641\u0639 \u0627\u0644\u0623\u062C\u0648\u0631 \u0648\u064A\u0628\u062F\u0623 \u064A\u0648\u0645 \u062C\u062F\u064A\u062F \u0628\u0637\u0644\u0628\u0627\u062A \u062C\u062F\u064A\u062F\u0629.",null,"Wages are paid and a new day starts with new bookings."],"hub.sleep":["\u0625\u0644\u0649 \u0627\u0644\u063A\u062F","\u0644\u064A \u0628\u0643\u0631\u0629","Next day"],"hub.sp":["{n} \u0646\u0642\u0637\u0629 \u0645\u0647\u0627\u0631\u0629",null,"{n} skill point(s)"],"tab.orders":["\u0627\u0644\u0637\u0644\u0628\u0627\u062A",null,"Bookings"],"tab.shop":["\u0627\u0644\u0645\u062A\u062C\u0631","\u0627\u0644\u062F\u0643\u0627\u0646","Store"],"tab.market":["\u0633\u0648\u0642 \u0627\u0644\u0633\u062C\u0627\u062F",null,"Rug market"],"tab.business":["\u0627\u0644\u0645\u062D\u0644",null,"Business"],"orders.title":["\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u064A\u0648\u0645",null,"Today's bookings"],"orders.none":["\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0622\u0646. \u0623\u0646\u0647\u0650 \u0627\u0644\u064A\u0648\u0645 \u0644\u062A\u0635\u0644 \u0637\u0644\u0628\u0627\u062A \u062C\u062F\u064A\u062F\u0629.",null,"No bookings right now. End the day for new ones."],"orders.offer":["\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u0639\u062A\u0627\u062F",null,"Usual price"],"orders.offers":["\u0645\u0634\u062A\u0631\u0648\u0646 \u0641\u064A \u0627\u0644\u0645\u062D\u0644",null,"Buyers in the shop"],"job.rush":["\u0645\u0633\u062A\u0639\u062C\u0644",null,"Rush"],"job.size":["\u0627\u0644\u0645\u0642\u0627\u0633",null,"Size"],"job.material":["\u0627\u0644\u062E\u0627\u0645\u0629",null,"Fibre"],"job.stains":["\u0627\u0644\u0628\u0642\u0639",null,"Stains"],"job.nostains":["\u0644\u0627 \u0628\u0642\u0639 \u0638\u0627\u0647\u0631\u0629",null,"None visible"],"job.dye":["\u062B\u0628\u0627\u062A \u0627\u0644\u0644\u0648\u0646",null,"Colourfastness"],"job.stable":["\u062B\u0627\u0628\u062A",null,"Stable"],"job.unstable":["\u063A\u064A\u0631 \u062B\u0627\u0628\u062A!",null,"Unstable!"],"job.unstablewarn":["\u0627\u0644\u0635\u0628\u063A\u0629 \u063A\u064A\u0631 \u062B\u0627\u0628\u062A\u0629: \u0645\u0627\u0621 \u0628\u0627\u0631\u062F \u0641\u0642\u0637\u060C \u0645\u0646\u0638\u0641 \u0645\u062A\u0639\u0627\u062F\u0644\u060C \u0648\u0634\u0637\u0641 \u0648\u0633\u062D\u0628 \u0633\u0631\u064A\u0639\u0627\u0646.",null,"Unstable dye: cold water only, neutral detergent, rinse and extract quickly."],"job.deadline":["\u0645\u0647\u0644\u0629 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",null,"Deadline"],"job.hours":["{n} \u0633\u0627\u0639\u0629",null,"{n} h"],"job.travel":["\u0627\u0644\u0645\u0634\u0648\u0627\u0631",null,"Travel"],"job.test":["\u0627\u062E\u062A\u0628\u0627\u0631 \u062B\u0628\u0627\u062A \u0627\u0644\u0644\u0648\u0646 (\u0631\u0628\u0639 \u0633\u0627\u0639\u0629)",null,"Spot-test the dye (15 min)"],"job.quote":["\u0639\u0631\u0636 \u0627\u0644\u0633\u0639\u0631",null,"Your quote"],"job.fair":["\u0627\u0644\u0645\u0639\u062A\u0627\u062F: {n}",null,"Usual: {n}"],"job.budget":["\u0623\u0642\u0635\u0649 \u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0644\u0644\u0632\u0628\u0648\u0646: {n}",null,"Customer's ceiling: {n}"],"job.offer":["\u0627\u0639\u0631\u0636 \u0627\u0644\u0633\u0639\u0631",null,"Make offer"],"job.toolate":["\u0627\u0644\u0648\u0642\u062A \u062A\u0623\u062E\u0631\u060C \u0623\u0646\u0647\u0650 \u0627\u0644\u064A\u0648\u0645 \u0648\u0627\u0628\u062F\u0623 \u063A\u062F\u0627\u064B.",null,"It is too late today. End the day and start tomorrow."],"job.takecounter":["\u0627\u0642\u0628\u0644 {n}",null,"Take {n}"],"job.firm":["\u0623\u0635\u0631\u0651 \u0639\u0644\u0649 {n}",null,"Hold at {n}"],"hud.cleanliness":["\u0646\u0633\u0628\u0629 \u0627\u0644\u0646\u0638\u0627\u0641\u0629","\u0627\u0644\u0646\u0636\u0627\u0641\u0629","Cleanliness"],"hud.time":["\u0627\u0644\u0648\u0642\u062A",null,"Time"],"hud.water":["\u0627\u0633\u062A\u0647\u0644\u0627\u0643 \u0627\u0644\u0645\u0627\u0621","\u0627\u0644\u0645\u0648\u064A\u0629","Water"],"hud.help":["\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u063A\u0633\u064A\u0644",null,"Washing steps"],"hud.dirtview":["\u062E\u0631\u064A\u0637\u0629 \u0627\u0644\u0623\u0648\u0633\u0627\u062E",null,"Dirt map"],"hud.wetview":["\u062E\u0631\u064A\u0637\u0629 \u0627\u0644\u0631\u0637\u0648\u0628\u0629",null,"Moisture map"],"hud.soapview":["\u0628\u0642\u0627\u064A\u0627 \u0627\u0644\u0645\u0646\u0638\u0641",null,"Detergent residue"],"hud.camera":["\u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627",null,"Camera"],"hud.coach":["\u0646\u0635\u0627\u0626\u062D \u0627\u0644\u0623\u0633\u0637\u0649",null,"Master tips"],"opt.pressure":["\u0627\u0644\u0636\u063A\u0637",null,"Pressure"],"opt.light":["\u062E\u0641\u064A\u0641",null,"Light"],"opt.medium":["\u0645\u062A\u0648\u0633\u0637",null,"Medium"],"opt.hard":["\u0642\u0648\u064A",null,"Hard"],"opt.speed":["\u0627\u0644\u0633\u0631\u0639\u0629",null,"Speed"],"opt.slow":["\u0647\u0627\u062F\u0626\u0629",null,"Low"],"opt.fast":["\u0639\u0627\u0644\u064A\u0629",null,"High"],"opt.heat":["\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u062D\u0631\u0643",null,"Motor heat"],"opt.temp":["\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u0627\u0621","\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u064A\u0629","Water"],"opt.cold":["\u0628\u0627\u0631\u062F",null,"Cold"],"opt.warm":["\u062F\u0627\u0641\u0626",null,"Warm"],"opt.hot":["\u062D\u0627\u0631",null,"Hot"],"hint.dry":["\u0627\u0633\u062D\u0628 \u0639\u0644\u0649 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0648\u0647\u064A \u062C\u0627\u0641\u0629 \u0644\u0625\u062E\u0631\u0627\u062C \u0627\u0644\u063A\u0628\u0627\u0631.",null,"Drag over the dry rug to lift loose dust."],"hint.groom":["\u0645\u0634\u0651\u0637 \u0627\u0644\u0648\u0628\u0631 \u0643\u0644\u0647 \u0641\u064A \u0627\u062A\u062C\u0627\u0647 \u0648\u0627\u062D\u062F \u0644\u0644\u0651\u0645\u0633\u0629 \u0627\u0644\u0623\u062E\u064A\u0631\u0629.",null,"Comb the whole pile one way for the finish."],"tool.locked":["{name}: \u062A\u064F\u0634\u062A\u0631\u0649 \u0645\u0646 \u0627\u0644\u0645\u062A\u062C\u0631.",null,"{name}: buy it in the store."],"slot.dry":["\u0646\u0641\u0636",null,"Dust"],"slot.spray":["\u0645\u0627\u0621","\u0645\u0648\u064A\u0629","Water"],"slot.chem":["\u0645\u0646\u0638\u0641",null,"Detergent"],"slot.brush":["\u0641\u0631\u0634\u0627\u0629",null,"Brush"],"slot.rotary":["\u0627\u0644\u0645\u0627\u0643\u064A\u0646\u0629","\u0627\u0644\u0645\u0643\u0646\u0629","Rotary"],"slot.extract":["\u0633\u062D\u0628",null,"Extract"],"slot.groom":["\u062A\u0645\u0634\u064A\u0637",null,"Groom"],"tool.beater":["\u0645\u0646\u0641\u0636\u0629",null,"Beater"],"tool.vacuum":["\u0645\u0643\u0646\u0633\u0629",null,"Vacuum"],"tool.bucket":["\u062C\u0631\u062F\u0644",null,"Bucket"],"tool.hose":["\u062E\u0631\u0637\u0648\u0645",null,"Hose"],"tool.washer":["\u0636\u063A\u0637 \u0639\u0627\u0644\u064D",null,"Jet washer"],"tool.chem":["\u0628\u062E\u0651\u0627\u062E",null,"Sprayer"],"tool.brush":["\u0641\u0631\u0634\u0627\u0629 \u064A\u062F",null,"Hand brush"],"tool.softbrush":["\u0641\u0631\u0634\u0627\u0629 \u0646\u0627\u0639\u0645\u0629",null,"Soft brush"],"tool.rotary":["\u0645\u0627\u0643\u064A\u0646\u0629 \u062F\u0648\u0651\u0627\u0631\u0629","\u0627\u0644\u0645\u0643\u0646\u0629","Rotary"],"tool.squeegee":["\u0645\u0633\u0651\u0627\u062D\u0629",null,"Squeegee"],"tool.wetvac":["\u0634\u0641\u0651\u0627\u0637 \u0645\u0627\u0621","\u0634\u0641\u0651\u0627\u0637 \u0645\u0648\u064A\u0629","Wet vac"],"tool.comb":["\u0645\u0634\u0637 \u0648\u0628\u0631",null,"Pile comb"],"toold.vacuum":["\u062A\u0633\u062D\u0628 \u0627\u0644\u063A\u0628\u0627\u0631 \u0623\u0633\u0631\u0639 \u0628\u062B\u0644\u0627\u062B \u0645\u0631\u0627\u062A \u0645\u0646 \u0627\u0644\u0645\u0646\u0641\u0636\u0629.",null,"Lifts dry soil about three times faster than the beater."],"toold.hose":["\u0645\u0627\u0621 \u0623\u063A\u0632\u0631 \u0648\u0645\u0633\u0627\u062D\u0629 \u0631\u0634 \u0623\u0648\u0633\u0639.",null,"More flow and a wider spray."],"toold.washer":["\u064A\u062E\u0644\u0639 \u0627\u0644\u0623\u0648\u0633\u0627\u062E \u0628\u0642\u0648\u0629 \u0627\u0644\u0645\u0627\u0621 \u0648\u064A\u0633\u062A\u0647\u0644\u0643 \u0645\u0627\u0621 \u0623\u0642\u0644\u060C \u0644\u0643\u0646\u0647 \u0642\u0627\u0633\u064D \u0639\u0644\u0649 \u0627\u0644\u0635\u0648\u0641 \u0648\u0627\u0644\u064A\u062F\u0648\u064A.",null,"Knocks soil loose with less water, but is harsh on wool and handwoven rugs."],"toold.softbrush":["\u0634\u0639\u064A\u0631\u0627\u062A \u0646\u0627\u0639\u0645\u0629 \u0644\u0644\u0635\u0648\u0641 \u0648\u0627\u0644\u0633\u062C\u0627\u062F \u0627\u0644\u064A\u062F\u0648\u064A \u062F\u0648\u0646 \u0625\u062C\u0647\u0627\u062F \u0627\u0644\u0623\u0644\u064A\u0627\u0641.",null,"Soft bristles for wool and handwoven rugs without stressing fibres."],"toold.rotary":["\u0641\u0631\u0634\u0627\u0629 \u062F\u0648\u0651\u0627\u0631\u0629 \u0639\u0631\u064A\u0636\u0629 \u062A\u0635\u0644 \u0644\u0644\u0623\u0648\u0633\u0627\u062E \u0627\u0644\u0639\u0645\u064A\u0642\u0629. \u062A\u062D\u062A\u0627\u062C \u0643\u0647\u0631\u0628\u0627\u0621 \u0648\u062A\u0633\u062E\u0646 \u0645\u0639 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u062A\u0648\u0627\u0635\u0644.",null,"Wide rotary brush that reaches deep soil. Needs power and heats up in continuous use."],"toold.wetvac":["\u064A\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621 \u062D\u062A\u0649 \u064A\u0643\u0627\u062F \u0627\u0644\u0648\u0628\u0631 \u064A\u062C\u0641\u060C \u0641\u064A\u0642\u0635\u0631 \u0627\u0644\u062A\u062C\u0641\u064A\u0641 \u0648\u064A\u0645\u0646\u0639 \u0639\u0648\u062F\u0629 \u0627\u0644\u0628\u0642\u0639.",null,"Pulls water out until the pile is nearly dry: faster drying, no wick-back."],"chem.shampoo":["\u0634\u0627\u0645\u0628\u0648 \u0645\u062A\u0639\u0627\u062F\u0644",null,"Neutral shampoo"],"chem.alkaline":["\u0645\u0632\u064A\u0644 \u062F\u0647\u0648\u0646 \u0642\u0644\u0648\u064A",null,"Alkaline degreaser"],"chem.enzyme":["\u0645\u0646\u0638\u0641 \u0625\u0646\u0632\u064A\u0645\u064A",null,"Enzyme cleaner"],"chem.solvent":["\u0645\u0630\u064A\u0628 \u0628\u0642\u0639",null,"Solvent spotter"],"chem.oxy":["\u0645\u0624\u0643\u0633\u062F \u0644\u0637\u064A\u0641",null,"Oxygen booster"],"chem.acid":["\u0634\u0637\u0641 \u062D\u0645\u0636\u064A",null,"Acid rinse"],"chemd.shampoo":["\u0622\u0645\u0646 \u0644\u0643\u0644 \u0627\u0644\u062E\u0627\u0645\u0627\u062A. \u062C\u064A\u062F \u0644\u0644\u0623\u0648\u0633\u0627\u062E \u0627\u0644\u0639\u0627\u0645\u0629 \u0648\u0636\u0639\u064A\u0641 \u0639\u0644\u0649 \u0627\u0644\u0628\u0642\u0639.",null,"Safe on every fibre. Good on general soil, weak on stains."],"chemd.alkaline":["\u0642\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u062F\u0647\u0648\u0646 \u0648\u0627\u0644\u0637\u064A\u0646. \u064A\u0636\u0631 \u0627\u0644\u0635\u0648\u0641 \u0648\u0627\u0644\u064A\u062F\u0648\u064A \u0648\u064A\u062D\u0631\u0651\u0643 \u0627\u0644\u0623\u0644\u0648\u0627\u0646.",null,"Strong on grease and mud. Damages wool and handwoven rugs and moves dye."],"chemd.enzyme":["\u0644\u0628\u0642\u0639 \u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0627\u0644\u0637\u0639\u0627\u0645. \u064A\u062D\u062A\u0627\u062C \u0648\u0642\u062A \u0645\u0643\u0648\u062B \u0642\u0628\u0644 \u0627\u0644\u0641\u0631\u0643.",null,"For milk and food stains. Needs dwell time before scrubbing."],"chemd.solvent":["\u0644\u0644\u062D\u0628\u0631 \u0648\u0627\u0644\u062F\u0647\u0648\u0646. \u0628\u0644\u0627 \u0631\u063A\u0648\u0629.",null,"For ink and grease. No foam."],"chemd.oxy":["\u0644\u0644\u0634\u0627\u064A \u0648\u0627\u0644\u0639\u0635\u064A\u0631 \u0648\u0627\u0644\u062D\u0646\u0651\u0629. \u062E\u0637\u0631 \u0639\u0644\u0649 \u0627\u0644\u0635\u0628\u063A\u0627\u062A \u063A\u064A\u0631 \u0627\u0644\u062B\u0627\u0628\u062A\u0629.",null,"For tea, juice and henna. Risky on unstable dyes."],"chemd.acid":["\u0634\u0637\u0641 \u0623\u062E\u064A\u0631 \u064A\u0639\u064A\u062F \u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0623\u0644\u064A\u0627\u0641 \u0648\u064A\u062B\u0628\u0651\u062A \u0627\u0644\u0644\u0648\u0646.",null,"Final rinse that rebalances fibres and settles dye."],"safety.title":["\u062A\u0646\u0628\u064A\u0647 \u0633\u0644\u0627\u0645\u0629",null,"Safety notice"],"safety.mix":["\u0644\u0627 \u062A\u0636\u0639 \xAB{a}\xBB \u0641\u0648\u0642 \xAB{b}\xBB. \u0627\u0634\u0637\u0641 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0648\u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621 \u0623\u0648\u0644\u0627\u064B.",null,"Never put \u201C{a}\u201D on top of \u201C{b}\u201D. Rinse and extract the rug first."],"help.title":["\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u063A\u0633\u064A\u0644",null,"Washing steps"],"help.s1":["\u0627\u0646\u0641\u0636 \u0627\u0644\u063A\u0628\u0627\u0631 \u0648\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062C\u0627\u0641\u0629. \u0627\u0644\u063A\u0628\u0627\u0631 \u0627\u0644\u0645\u0628\u0644\u0648\u0644 \u064A\u0635\u064A\u0631 \u0637\u064A\u0646\u0627\u064B.",null,"Remove dust while the rug is dry. Wet dust turns to mud."],"help.s2":["\u0628\u0644\u0651\u0644 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0628\u0627\u0644\u0645\u0627\u0621. \u0627\u0644\u0641\u0631\u0643 \u0639\u0644\u0649 \u0627\u0644\u062C\u0627\u0641 \u064A\u0624\u0630\u064A \u0627\u0644\u0623\u0644\u064A\u0627\u0641.",null,"Wet the rug. Scrubbing dry fibres damages them."],"help.s3":["\u0636\u0639 \u0627\u0644\u0645\u0646\u0638\u0641 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u062E\u0627\u0645\u0629 \u0648\u0627\u0644\u0628\u0642\u0639\u0629 \u0648\u0627\u062A\u0631\u0643\u0647 \u064A\u0645\u0643\u062B \u062B\u0648\u0627\u0646\u064A\u064E.",null,"Apply chemistry that suits the fibre and stain, and let it dwell."],"help.s4":["\u0627\u0641\u0631\u0643 \u0628\u062A\u063A\u0637\u064A\u0629 \u0645\u062A\u062F\u0627\u062E\u0644\u0629 \u062A\u0634\u0645\u0644 \u0627\u0644\u0623\u0637\u0631\u0627\u0641. \u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0642\u0648\u064A \u0644\u0644\u0635\u0646\u0627\u0639\u064A \u0641\u0642\u0637.",null,"Scrub in overlapping passes including the edges. Hard pressure is for synthetics only."],"help.s5":["\u0627\u0634\u0637\u0641 \u0628\u0627\u0644\u0645\u0627\u0621 \u0644\u062A\u062E\u0641\u064A\u0641 \u0627\u0644\u0631\u063A\u0648\u0629 \u0648\u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u0645\u062A\u0633\u062E.",null,"Rinse to dilute foam and dirty water."],"help.s6":["\u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621 \u0628\u0627\u0644\u0645\u0633\u0651\u0627\u062D\u0629 \u0623\u0648 \u0627\u0644\u0634\u0641\u0651\u0627\u0637 \u062D\u062A\u0649 \u064A\u062E\u0641 \u0627\u0644\u0628\u0644\u0644.",null,"Pull the water out with the squeegee or wet vac."],"help.s7":["\u0645\u0634\u0651\u0637 \u0627\u0644\u0648\u0628\u0631 \u0641\u064A \u0627\u062A\u062C\u0627\u0647 \u0648\u0627\u062D\u062F\u060C \u062B\u0645 \u0627\u0636\u063A\u0637 \u2713 \u0648\u0627\u062E\u062A\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062A\u062C\u0641\u064A\u0641.",null,"Comb the pile one way, then press \u2713 and choose how to dry."],"help.note":["\u0627\u0644\u0633\u0631\u0639\u0629 \u0644\u0627 \u062A\u0632\u064A\u062F \u0627\u0644\u062A\u0646\u0638\u064A\u0641: \u0627\u0644\u0623\u062B\u0631 \u0628\u062D\u0633\u0628 \u0627\u0644\u0648\u0642\u062A \u062A\u062D\u062A \u0627\u0644\u0623\u062F\u0627\u0629.",null,"Moving faster does not clean more: the effect depends on time under the tool."],"coach.dust":["\u0627\u0646\u0641\u0636 \u0627\u0644\u063A\u0628\u0627\u0631 \u0623\u0648\u0644\u0627\u064B \u0648\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062C\u0627\u0641\u0629.","\u0627\u0646\u0641\u0636 \u0627\u0644\u063A\u0628\u0627\u0631 \u0623\u0648\u0644 \u0648\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0646\u0627\u0634\u0641\u0629.","Beat the dust out first, while it is dry."],"coach.wet":["\u0628\u0644\u0651\u0644\u0647\u0627 \u0628\u0627\u0644\u0645\u0627\u0621 \u0642\u0628\u0644 \u0623\u064A \u0641\u0631\u0643.","\u0628\u0644\u0651\u0647\u0627 \u0628\u0627\u0644\u0645\u0648\u064A\u0629 \u0642\u0628\u0644 \u0623\u064A \u0641\u0631\u0643.","Wet it before any scrubbing."],"coach.soap":["\u0636\u0639 \u0627\u0644\u0645\u0646\u0638\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0648\u0633\u0627\u062E.","\u062E\u062A \u0627\u0644\u0645\u0646\u0638\u0641 \u0639\u0644\u0649 \u0627\u0644\u0648\u0633\u062E.","Put detergent on the soil."],"coach.spot":["\u0639\u0627\u0644\u062C \u0627\u0644\u0628\u0642\u0639 \u0628\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0648\u062F\u0639\u0647\u0627 \u062A\u0645\u0643\u062B.","\u0639\u0627\u0644\u062C \u0627\u0644\u0628\u0642\u0639 \u0628\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0635\u0627\u062D \u0648\u062E\u0644\u0651\u064A\u0647\u0627 \u062A\u0642\u0639\u062F \u0634\u0648\u064A\u0629.","Treat the stains with the right product and let it dwell."],"coach.scrub":["\u0627\u0641\u0631\u0643 \u0628\u062A\u062F\u0627\u062E\u0644 \u0648\u0644\u0627 \u062A\u0646\u0633\u064E \u0627\u0644\u0623\u0637\u0631\u0627\u0641.","\u0627\u0641\u0631\u0643 \u0648\u0645\u0627 \u062A\u0646\u0633\u0649 \u0627\u0644\u0623\u0637\u0631\u0627\u0641.","Scrub with overlap and do not miss the edges."],"coach.rinse":["\u0627\u0634\u0637\u0641 \u062B\u0645 \u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u0645\u062A\u0633\u062E.","\u0627\u0634\u0637\u0641 \u0648\u0628\u0639\u062F\u064A\u0646 \u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0648\u064A\u0629 \u0627\u0644\u0648\u0633\u062E\u0627\u0646\u0629.","Rinse, then pull the dirty water out."],"coach.extract":["\u0645\u0627 \u0632\u0627\u0644\u062A \u0645\u0628\u0644\u0644\u0629\u060C \u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621.","\u0644\u0633\u0647 \u0645\u0628\u0644\u0648\u0644\u0629\u060C \u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0648\u064A\u0629.","Still too wet: extract."],"coach.groom":["\u0645\u0634\u0651\u0637 \u0627\u0644\u0648\u0628\u0631 \u0641\u064A \u0627\u062A\u062C\u0627\u0647 \u0648\u0627\u062D\u062F.","\u0645\u0634\u0651\u0637 \u0627\u0644\u0648\u0628\u0631 \u0641\u064A \u0627\u062A\u062C\u0627\u0647 \u0648\u0627\u062D\u062F.","Comb the pile one way."],"coach.done":["\u0645\u0645\u062A\u0627\u0632. \u0627\u0636\u063A\u0637 \u2713 \u0644\u0644\u062A\u062C\u0641\u064A\u0641.","\u0633\u0645\u062D. \u0627\u0636\u063A\u0637 \u2713 \u0644\u0644\u062A\u0646\u0634\u064A\u0641.","Well done. Press \u2713 to dry."],"warn.nopower":["\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0645\u0642\u0637\u0648\u0639\u0629: \u0627\u0644\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0645\u062A\u0648\u0642\u0641\u0629 \u0627\u0644\u064A\u0648\u0645 (\u0627\u0644\u0645\u0648\u0644\u0651\u062F \u064A\u062D\u0644\u0651\u0647\u0627).",null,"Power cut: electric tools are off today (a generator solves this)."],"warn.nowater":["\u0627\u0644\u0645\u0627\u0621 \u0645\u0642\u0637\u0648\u0639: \u0644\u062F\u064A\u0643 {n} \u0644\u062A\u0631\u0627\u064B \u0645\u062E\u0632\u0651\u0646\u0627\u064B \u0641\u0642\u0637 (\u0627\u0644\u062E\u0632\u0627\u0646 \u064A\u062D\u0644\u0651\u0647\u0627).","\u0627\u0644\u0645\u0648\u064A\u0629 \u0642\u0627\u0637\u0639\u0629: \u0639\u0646\u062F\u0643 {n} \u0644\u062A\u0631 \u0628\u0633.","Water cut: only {n} L of stored water (a tank solves this)."],"warn.haboob":["\u0647\u0628\u0648\u0628 \u0627\u0644\u064A\u0648\u0645: \u0627\u0644\u062A\u062C\u0641\u064A\u0641 \u0641\u064A \u0627\u0644\u062E\u0627\u0631\u062C \u0633\u064A\u062C\u0644\u0628 \u063A\u0628\u0627\u0631\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0633\u062C\u0627\u062F\u0629.",null,"Dust storm today: drying outdoors will put dust back on the rug."],"warn.heatset":["\u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u062D\u0627\u0631 \u064A\u062B\u0628\u0651\u062A \u0628\u0642\u0639 \u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0627\u0644\u062D\u0646\u0651\u0629!",null,"Hot water sets protein and henna stains!"],"warn.shrink":["\u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u062D\u0627\u0631 \u0642\u062F \u064A\u0643\u0645\u0651\u0634 \u0647\u0630\u0647 \u0627\u0644\u062E\u0627\u0645\u0629.",null,"Hot water can shrink this fibre."],"warn.overheat":["\u0627\u0644\u0645\u062D\u0631\u0643 \u0633\u062E\u0646 \u0648\u062A\u0648\u0642\u0641. \u062F\u0639\u0647 \u064A\u0628\u0631\u062F.","\u0627\u0644\u0645\u0643\u0646\u0629 \u0633\u062E\u0646\u062A \u0648\u0648\u0642\u0641\u062A. \u062E\u0644\u0651\u064A\u0647\u0627 \u062A\u0628\u0631\u062F.","The motor overheated and cut out. Let it cool."],"warn.heat":["\u0627\u0644\u0645\u062D\u0631\u0643 \u064A\u0633\u062E\u0646\u060C \u0623\u0631\u0650\u062D\u0647 \u0642\u0644\u064A\u0644\u0627\u064B.",null,"The motor is getting hot. Give it a rest."],"warn.nostock":["\u0646\u0641\u062F \xAB{name}\xBB. \u0627\u0634\u062A\u0631\u0650 \u0645\u0646 \u0627\u0644\u0645\u062A\u062C\u0631.",null,"\u201C{name}\u201D has run out. Buy more in the store."],"warn.mix":["\u0644\u0627 \u062A\u062E\u0644\u0637 \u0647\u0630\u0647 \u0627\u0644\u0645\u0627\u062F\u0629 \u0645\u0639 \u0645\u0627 \u0639\u0644\u0649 \u0627\u0644\u0633\u062C\u0627\u062F\u0629. \u0627\u0634\u0637\u0641 \u0623\u0648\u0644\u0627\u064B.",null,"Do not mix this with what is on the rug. Rinse first."],"warn.dry":["\u062A\u0641\u0631\u0643 \u0639\u0644\u0649 \u0627\u0644\u062C\u0627\u0641: \u0628\u0644\u0651\u0644 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0623\u0648\u0644\u0627\u064B.","\u0628\u062A\u0641\u0631\u0643 \u0639\u0644\u0649 \u0627\u0644\u0646\u0627\u0634\u0641: \u0628\u0644\u0651\u0647\u0627 \u0623\u0648\u0644.","You are scrubbing dry fibres: wet the rug first."],"warn.stress":["\u0627\u0644\u0623\u0644\u064A\u0627\u0641 \u062A\u062A\u0623\u0630\u0649: \u062E\u0641\u0641 \u0627\u0644\u0636\u063A\u0637 \u0623\u0648 \u0627\u0633\u062A\u0639\u0645\u0644 \u0623\u062F\u0627\u0629 \u0623\u0646\u0639\u0645.",null,"Fibres are being damaged: ease the pressure or use a softer tool."],"warn.bleed":["\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u062A\u0633\u064A\u0644! \u0627\u0634\u0637\u0641 \u0628\u0645\u0627\u0621 \u0628\u0627\u0631\u062F \u0648\u0627\u0633\u062D\u0628 \u0627\u0644\u0645\u0627\u0621 \u0641\u0648\u0631\u0627\u064B.","\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0628\u062A\u0633\u064A\u0644! \u0627\u0634\u0637\u0641 \u0628\u0645\u0648\u064A\u0629 \u0628\u0627\u0631\u062F\u0629 \u0648\u0627\u0633\u062D\u0628 \u0633\u0631\u064A\u0639.","Dye is bleeding! Rinse cold and extract right away."],"warn.overwet":["\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0645\u0634\u0628\u0639\u0629 \u0628\u0627\u0644\u0645\u0627\u0621: \u0627\u0644\u062A\u062C\u0641\u064A\u0641 \u0633\u064A\u0637\u0648\u0644 \u0648\u0627\u0644\u0623\u0648\u0633\u0627\u062E \u0627\u0644\u0639\u0645\u064A\u0642\u0629 \u0633\u062A\u0635\u0639\u062F.",null,"The rug is flooded: drying will take long and deep soil will wick up."],"warn.chem":["\u0645\u0646\u0638\u0641 \u0632\u0627\u0626\u062F: \u0633\u064A\u0635\u0639\u0628 \u0634\u0637\u0641\u0647 \u0648\u064A\u062A\u0631\u0643 \u0628\u0642\u0627\u064A\u0627.",null,"Too much detergent: it will be hard to rinse and will leave residue."],"warn.mud":["\u0628\u0644\u0651\u0644\u062A \u0627\u0644\u063A\u0628\u0627\u0631 \u0641\u0635\u0627\u0631 \u0637\u064A\u0646\u0627\u064B. \u0627\u0646\u0641\u0636 \u0627\u0644\u062C\u0627\u0641 \u0623\u0648\u0644\u0627\u064B \u0641\u064A \u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629.",null,"You wetted loose dust and made mud. Dust dry first next time."],"finish.title":["\u062C\u0627\u0647\u0632\u0629 \u0644\u0644\u062A\u062C\u0641\u064A\u0641\u061F",null,"Ready to dry?"],"finish.clean":["\u0627\u0644\u0646\u0638\u0627\u0641\u0629",null,"Cleanliness"],"finish.wet":["\u0627\u0644\u0631\u0637\u0648\u0628\u0629 \u0627\u0644\u0628\u0627\u0642\u064A\u0629",null,"Moisture left"],"finish.residue":["\u0628\u0642\u0627\u064A\u0627 \u0645\u0646\u0638\u0641 \u0648\u0645\u0627\u0621 \u0645\u062A\u0633\u062E",null,"Residue and dirty water"],"finish.edges":["\u0627\u0644\u0623\u0637\u0631\u0627\u0641",null,"Edges"],"finish.pick":["\u0627\u062E\u062A\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062A\u062C\u0641\u064A\u0641:",null,"Choose how to dry it:"],"finish.back":["\u0623\u0643\u0645\u0644 \u0627\u0644\u063A\u0633\u064A\u0644",null,"Keep cleaning"],"lvl.good":["\u062C\u064A\u062F",null,"Good"],"lvl.mid":["\u0645\u0642\u0628\u0648\u0644",null,"Fair"],"lvl.bad":["\u0633\u064A\u0626",null,"Poor"],"dry.sun":["\u0641\u064A \u0627\u0644\u0634\u0645\u0633",null,"In the sun"],"dry.shade":["\u0641\u064A \u0627\u0644\u0638\u0644",null,"In the shade"],"dry.fans":["\u0628\u0627\u0644\u0645\u0631\u0627\u0648\u062D",null,"With fans"],"dry.rack":["\u0639\u0644\u0649 \u062D\u0627\u0645\u0644 \u0627\u0644\u062A\u062C\u0641\u064A\u0641",null,"On the drying rack"],"dryd.sun":["\u0627\u0644\u0623\u0633\u0631\u0639\u060C \u0648\u0642\u062F \u062A\u0628\u0647\u062A \u0627\u0644\u0635\u0628\u063A\u0627\u062A \u0627\u0644\u0636\u0639\u064A\u0641\u0629.",null,"Fastest; weak dyes may fade."],"dryd.shade":["\u0622\u0645\u0646 \u0648\u0628\u0637\u064A\u0621.",null,"Safe and slow."],"dryd.fans":["\u0633\u0631\u064A\u0639 \u0648\u0622\u0645\u0646\u060C \u064A\u0633\u062A\u0647\u0644\u0643 \u0643\u0647\u0631\u0628\u0627\u0621.",null,"Fast and safe; uses power."],"dryd.rack":["\u0627\u0644\u0647\u0648\u0627\u0621 \u064A\u0645\u0631 \u0645\u0646 \u0627\u0644\u062C\u0647\u062A\u064A\u0646.",null,"Air reaches both sides."],"dry.forecast":["\u0646\u062D\u0648 {n} \u0633\u0627\u0639\u0629",null,"About {n} h"],"dry.late":["\u0633\u064A\u062A\u062C\u0627\u0648\u0632 \u0645\u0647\u0644\u0629 \u0627\u0644\u0632\u0628\u0648\u0646",null,"Misses the customer's deadline"],"dry.running":["\u0627\u0644\u062A\u062C\u0641\u064A\u0641\u2026","\u0627\u0644\u062A\u0646\u0634\u064A\u0641\u2026","Drying\u2026"],"band.5":["\u062A\u062D\u0641\u0629",null,"Masterpiece"],"band.4":["\u0645\u0645\u062A\u0627\u0632",null,"Excellent"],"band.3":["\u062C\u064A\u062F",null,"Good"],"band.2":["\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646\u0627\u064B",null,"Needs improvement"],"band.1":["\u0641\u0634\u0644",null,"Failed"],"sc.clean":["\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u062A\u0646\u0638\u064A\u0641",null,"Cleaning result"],"sc.safety":["\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u062E\u0627\u0645\u0629",null,"Material safety"],"sc.coverage":["\u0627\u0644\u062A\u063A\u0637\u064A\u0629 \u0648\u0627\u0644\u062A\u062C\u0627\u0646\u0633",null,"Coverage"],"sc.moisture":["\u0627\u0644\u0631\u0637\u0648\u0628\u0629 \u0648\u0627\u0644\u0633\u062D\u0628",null,"Moisture control"],"sc.time":["\u0627\u0644\u0648\u0642\u062A",null,"Time"],"sc.instr":["\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0632\u0628\u0648\u0646",null,"Instructions"],"sc.site":["\u0646\u0638\u0627\u0641\u0629 \u0645\u0648\u0642\u0639 \u0627\u0644\u0639\u0645\u0644",null,"Work-area care"],"why.wick":["\u0628\u0642\u064A \u0645\u0627\u0621 \u0643\u062B\u064A\u0631 \u0641\u0635\u0639\u062F\u062A \u0627\u0644\u0623\u0648\u0633\u0627\u062E \u0627\u0644\u0639\u0645\u064A\u0642\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0637\u062D \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062C\u0641\u064A\u0641.",null,"Too much water was left, so deep soil wicked up to the surface while drying."],"why.redeposit":["\u0645\u0627\u0621 \u0645\u062A\u0633\u062E \u0644\u0645 \u064A\u064F\u0633\u062D\u0628 \u0641\u062C\u0641\u0651 \u062F\u0627\u062E\u0644 \u0627\u0644\u0648\u0628\u0631.",null,"Dirty water was not extracted and dried back into the pile."],"why.residue":["\u0628\u0642\u0627\u064A\u0627 \u0645\u0646\u0638\u0641 \u0641\u064A \u0627\u0644\u0623\u0644\u064A\u0627\u0641: \u062A\u062C\u0630\u0628 \u0627\u0644\u0623\u0648\u0633\u0627\u062E \u0644\u0627\u062D\u0642\u0627\u064B.",null,"Detergent residue in the fibres: it will attract soil later."],"why.bleed":["\u0633\u0627\u0644\u062A \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0628\u0633\u0628\u0628 \u0645\u0627\u062F\u0629 \u0642\u0648\u064A\u0629 \u0623\u0648 \u0645\u0627\u0621 \u062D\u0627\u0631 \u0623\u0648 \u0628\u0644\u0644 \u0637\u0648\u064A\u0644.",null,"Dye ran because of strong chemistry, hot water or long wetting."],"why.stress":["\u062A\u0636\u0631\u0631\u062A \u0627\u0644\u0623\u0644\u064A\u0627\u0641 \u0645\u0646 \u0636\u063A\u0637 \u0623\u0648 \u0623\u062F\u0627\u0629 \u0623\u0642\u0633\u0649 \u0645\u0645\u0627 \u062A\u062A\u062D\u0645\u0644\u0647 \u0627\u0644\u062E\u0627\u0645\u0629.",null,"Fibres were damaged by more pressure or a harsher tool than the material tolerates."],"why.shrink":["\u0627\u0646\u0643\u0645\u0634\u062A \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0628\u0633\u0628\u0628 \u0627\u0644\u0645\u0627\u0621 \u0627\u0644\u062D\u0627\u0631.",null,"The rug shrank because of hot water."],"why.fade":["\u0628\u0647\u062A\u062A \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0645\u0646 \u0634\u0645\u0633 \u0637\u0648\u064A\u0644\u0629 \u0639\u0644\u0649 \u0635\u0628\u063A\u0629 \u0636\u0639\u064A\u0641\u0629.",null,"Colours faded from long sun on a weak dye."],"why.late":["\u062A\u0623\u062E\u0631 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0639\u0646 \u0645\u0647\u0644\u0629 \u0627\u0644\u0632\u0628\u0648\u0646.",null,"Delivery missed the customer's deadline."],"why.haboob":["\u0627\u0644\u0647\u0628\u0648\u0628 \u0623\u0639\u0627\u062F \u0627\u0644\u063A\u0628\u0627\u0631 \u0639\u0644\u0649 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0648\u0647\u064A \u062A\u062C\u0641 \u0641\u064A \u0627\u0644\u062E\u0627\u0631\u062C.",null,"The dust storm put dust back on the rug as it dried outside."],"why.stains":["\u0628\u0642\u0639 \u0644\u0645 \u062A\u064F\u0639\u0627\u0644\u062C \u0628\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629.",null,"Stains were not treated with the right product."],"result.collect":["\u0627\u0633\u062A\u0644\u0645 \u0627\u0644\u0645\u0628\u0644\u063A","\u0627\u0633\u062A\u0644\u0645 \u0627\u0644\u0642\u0631\u0648\u0634","Collect payment"],"result.own":["\u0633\u062C\u0627\u062F\u062A\u0643 \u062C\u0627\u0647\u0632\u0629 \u0644\u0644\u0639\u0631\u0636 \u0623\u0648 \u0627\u0644\u0628\u064A\u0639.",null,"Your rug is ready to display or sell."],"result.level":["\u0627\u0631\u062A\u0642\u064A\u062A \u0625\u0644\u0649 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 {n} \u0648\u0643\u0633\u0628\u062A \u0646\u0642\u0637\u0629 \u0645\u0647\u0627\u0631\u0629.",null,"Level {n}: you earned a skill point."],"result.gallery":["\u0623\u064F\u0636\u064A\u0641\u062A \u0625\u0644\u0649 \u0635\u0627\u0644\u0629 \u0627\u0644\u0639\u0631\u0636.",null,"Added to your showroom."],"pay.title":["\u0627\u0644\u062F\u0641\u0639",null,"Payment"],"pay.due":["\u0627\u0644\u0645\u0637\u0644\u0648\u0628",null,"Amount due"],"pay.tip":["\u064A\u0634\u0645\u0644 \u0625\u0643\u0631\u0627\u0645\u064A\u0629 {n}",null,"Includes a {n} tip"],"pay.handed":["\u0627\u0644\u0632\u0628\u0648\u0646 \u0633\u0644\u0651\u0645\u0643 {n}","\u0627\u0644\u0632\u0628\u0648\u0646 \u0623\u062F\u0651\u0627\u0643 {n}","The customer hands you {n}"],"pay.given":["\u0623\u0639\u0637\u064A\u062A\u064E {n}",null,"You gave {n}"],"pay.drawer":["\u0627\u0636\u063A\u0637 \u0627\u0644\u0623\u0648\u0631\u0627\u0642 \u0645\u0646 \u0627\u0644\u062F\u0631\u062C \u0644\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0628\u0627\u0642\u064A:",null,"Tap notes from the drawer to give change:"],"pay.auto":["\u0639\u062F\u0651 \u062A\u0644\u0642\u0627\u0626\u064A",null,"Auto count"],"pay.confirm":["\u0633\u0644\u0651\u0645 \u0627\u0644\u0628\u0627\u0642\u064A","\u0633\u0644\u0651\u0645 \u0627\u0644\u0628\u0627\u0642\u064A","Hand over change"],"pay.take":["\u0627\u0633\u062A\u0644\u0645",null,"Take it"],"pay.over":["\u0623\u0639\u0637\u064A\u062A {n} \u0632\u064A\u0627\u062F\u0629!",null,"You gave {n} too much!"],"cash.change":["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062A\u0628\u0642\u064A","\u0627\u0644\u0628\u0627\u0642\u064A","Change"],"rc.no":["\u0631\u0642\u0645 \u0627\u0644\u0639\u0645\u0644\u064A\u0629",null,"Job no."],"rc.service":["\u0627\u0644\u062E\u062F\u0645\u0629",null,"Service"],"rc.wash":["\u063A\u0633\u064A\u0644 \u0633\u062C\u0627\u062F\u0629 \u2014 {size}",null,"Rug wash \u2014 {size}"],"rc.date":["\u0627\u0644\u062A\u0627\u0631\u064A\u062E",null,"Date"],"rc.total":["\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A",null,"Total"],"rc.tip":["\u0625\u0643\u0631\u0627\u0645\u064A\u0629",null,"Tip"],"rc.paid":["\u0627\u0644\u0645\u062F\u0641\u0648\u0639",null,"Paid"],"rc.claim":["\u062A\u0639\u0648\u064A\u0636 \u062A\u0644\u0641",null,"Damage compensation"],"rc.thanks":["\u0633\u062C\u0627\u062F \u0646\u0638\u064A\u0641\u2026 \u0648\u0628\u064A\u062A \u0623\u062C\u0645\u0644",null,"Clean rugs. Fresh homes."],"claim.note":["\u062F\u0641\u0639\u062A\u064E \u062A\u0639\u0648\u064A\u0636\u0627\u064B \u0639\u0646 \u062A\u0644\u0641 \u0627\u0644\u0633\u062C\u0627\u062F\u0629: {n}",null,"You paid compensation for the damaged rug: {n}"],"dlg.ask":["\u064A\u0627 \u0623\u062E\u064A\u060C \u0623\u0631\u064A\u062F \u063A\u0633\u0644 \u0647\u0630\u0647 \u0627\u0644\u0633\u062C\u0627\u062F\u0629\u060C \u0643\u0645 \u0627\u0644\u0633\u0639\u0631\u061F","\u064A\u0627 \u0632\u0648\u0644\u060C \u062F\u0627\u064A\u0631 \u0623\u063A\u0633\u0644 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062F\u064A\u060C \u0628\u064A \u0643\u0645\u061F","Hey, I want this rug washed. How much?"],"dlg.rush":["\u0623\u0631\u062C\u0648\u0643 \u0623\u0646\u0647\u0650\u0647\u0627 \u0642\u0628\u0644 \u0627\u0644\u0645\u063A\u0631\u0628\u060C \u0639\u0646\u062F\u0646\u0627 \u0636\u064A\u0648\u0641.","\u0639\u0644\u064A\u0643 \u0627\u0644\u0644\u0647 \u062E\u0644\u0651\u0635\u0647\u0627 \u0642\u0628\u0644 \u0627\u0644\u0645\u063A\u0631\u0628\u060C \u0639\u0646\u062F\u0646\u0627 \u0636\u064A\u0648\u0641.","Please finish it before sunset, we have guests coming."],"dlg.delicate":["\u0647\u0630\u0647 \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u063A\u0627\u0644\u064A\u0629 \u0639\u0644\u064A\u0651\u060C \u0627\u0631\u0641\u0642 \u0628\u0647\u0627.","\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062F\u064A \u063A\u0627\u0644\u064A\u0629 \u0639\u0644\u064A\u0651 \u0634\u062F\u064A\u062F\u060C \u0623\u0631\u0641\u0642 \u0628\u064A\u0647\u0627.","This rug is dear to me. Be gentle with it."],"dlg.counter":["\u0623\u0646\u0642\u0635 \u0627\u0644\u0633\u0639\u0631 \u0642\u0644\u064A\u0644\u0627\u064B\u060C \u0625\u0646\u0647\u0627 \u063A\u0627\u0644\u064A\u0629 \u062C\u062F\u0627\u064B! \u0623\u062F\u0641\u0639 {n}.","\u0632\u064A\u062F \u0644\u064A \u0634\u0648\u064A\u0629\u060C \u062F\u064A \u063A\u0627\u0644\u064A\u0629 \u0634\u062F\u064A\u062F! \u0628\u062F\u0641\u0639 {n}.","Come on, knock a bit off \u2014 that's too much! I'll pay {n}."],"dlg.fine":["\u062D\u0633\u0646\u0627\u064B\u060C \u0627\u062A\u0641\u0642\u0646\u0627.","\u062E\u0644\u0627\u0635\u060C \u0627\u062A\u0641\u0642\u0646\u0627.","All right, deal."],"dlg.leave":["\u0648\u0627\u0644\u0644\u0647 \u0644\u0627 \u064A\u0635\u062D\u060C \u0633\u0623\u0628\u062D\u062B \u0639\u0646 \u063A\u064A\u0631\u0643.","\u0648\u0627\u0644\u0644\u0647 \u0645\u0627 \u0628\u062A\u062C\u064A\u060C \u0628\u0634\u0648\u0641 \u0644\u064A \u0632\u0648\u0644 \u062A\u0627\u0646\u064A.","I swear that won't do. I'll find someone else."],"dlg.happy":["\u0631\u0627\u0626\u0639\u0629 \u062C\u062F\u0627\u064B! \u0643\u0623\u0646\u0647\u0627 \u062C\u062F\u064A\u062F\u0629\u060C \u0628\u0627\u0631\u0643 \u0627\u0644\u0644\u0647 \u0641\u064A\u0643.","\u0633\u0645\u062D\u0629 \u0634\u062F\u064A\u062F! \u0643\u0623\u0646\u0647\u0627 \u062C\u062F\u064A\u062F\u0629\u060C \u0627\u0644\u0644\u0647 \u064A\u062F\u064A\u0643 \u0627\u0644\u0639\u0627\u0641\u064A\u0629.","Beautiful! Like brand new \u2014 bless you."],"dlg.ok":["\u0639\u0645\u0644 \u062C\u064A\u062F\u060C \u0634\u0643\u0631\u0627\u064B \u0644\u0643.","\u0634\u063A\u0644 \u0643\u0648\u064A\u0633\u060C \u062A\u0633\u0644\u0645.","Good work, thank you."],"dlg.unhappy":["\u0645\u0627 \u0632\u0627\u0644\u062A \u0641\u064A \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0628\u0642\u0639\u060C \u0644\u0646 \u0623\u062F\u0641\u0639 \u0627\u0644\u0645\u0628\u0644\u063A \u0643\u0627\u0645\u0644\u0627\u064B.","\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0644\u0633\u0647 \u0641\u064A\u0647\u0627 \u0628\u0642\u0639\u060C \u0645\u0627 \u062D \u0623\u062F\u0641\u0639 \u0643\u0627\u0645\u0644.","There are still stains on it. I'm not paying full price."],"dlg.angry":["\u0647\u0630\u0627 \u0644\u064A\u0633 \u063A\u0633\u064A\u0644\u0627\u064B! \u0644\u0646 \u0623\u062F\u0641\u0639 \u0625\u0644\u0627 \u0627\u0644\u0642\u0644\u064A\u0644.","\u062F\u0627 \u0645\u0627 \u063A\u0633\u064A\u0644! \u0645\u0627 \u0628\u062F\u0641\u0639 \u0625\u0644\u0627 \u0634\u0648\u064A\u0629.","You call this washed? You get a fraction."],"dlg.damaged":["\u0644\u0642\u062F \u0623\u062A\u0644\u0641\u062A \u0633\u062C\u0627\u062F\u062A\u064A! \u0623\u0631\u064A\u062F \u062A\u0639\u0648\u064A\u0636\u0627\u064B.","\u062E\u0631\u0651\u0628\u062A \u0644\u064A \u0633\u062C\u0627\u062F\u062A\u064A! \u062F\u0627\u064A\u0631 \u062A\u0639\u0648\u064A\u0636.","You ruined my rug! I want compensation."],"dlg.pay":["\u062A\u0641\u0636\u0644 \u062D\u0633\u0627\u0628\u0643.","\u0647\u0627\u0643 \u0642\u0631\u0648\u0634\u0643.","Here is your money."],"dlg.tip":["\u062A\u0633\u062A\u0627\u0647\u0644\u060C \u0648\u0647\u0630\u0647 \u0632\u064A\u0627\u062F\u0629 \u0645\u0646\u064A.","\u062A\u0633\u062A\u0627\u0647\u0644\u060C \u0648\u062F\u064A \u0632\u064A\u0627\u062F\u0629 \u0645\u0646\u064A.","You earned it \u2014 and a little extra from me."],"dlg.shortchange":["\u0627\u0644\u0628\u0627\u0642\u064A \u0646\u0627\u0642\u0635 \u064A\u0627 \u0623\u062E\u064A.","\u0627\u0644\u0628\u0627\u0642\u064A \u0646\u0627\u0642\u0635 \u064A\u0627 \u0632\u0648\u0644.","That change is short, my friend."],"dlg.buy":["\u0623\u0639\u062C\u0628\u062A\u0646\u064A \u0647\u0630\u0647 \u0627\u0644\u0633\u062C\u0627\u062F\u0629\u060C \u0622\u062E\u0630\u0647\u0627 \u0628\u0640 {n}.","\u0639\u062C\u0628\u062A\u0646\u064A \u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u062F\u064A\u060C \u0628\u0634\u064A\u0644\u0647\u0627 \u0628\u0640 {n}.","I like this rug. I'll take it for {n}."],"dlg.buyhaggle":["\u062C\u0645\u064A\u0644\u0629\u060C \u0644\u0643\u0646 \u0623\u062F\u0641\u0639 {n} \u0641\u0642\u0637.","\u0633\u0645\u062D\u0629\u060C \u0644\u0643\u0646 \u0628\u062F\u0641\u0639 {n} \u0628\u0633.","Lovely, but {n} is my offer."],"shop.supplies":["\u0627\u0644\u0645\u0648\u0627\u062F",null,"Supplies"],"shop.tools":["\u0627\u0644\u0623\u062F\u0648\u0627\u062A",null,"Tools"],"shop.gear":["\u0627\u0644\u062A\u062C\u0647\u064A\u0632\u0627\u062A",null,"Equipment"],"shop.stock":["\u0627\u0644\u0645\u062E\u0632\u0648\u0646 {n} \u0645\u0644",null,"{n} ml in stock"],"shop.owned":["\u062A\u0645\u0644\u0643\u0647","\u0639\u0646\u062F\u0643","Owned"],"shop.nocash":["\u0627\u0644\u0645\u0628\u0644\u063A \u0644\u0627 \u064A\u0643\u0641\u064A.","\u0627\u0644\u0642\u0631\u0648\u0634 \u0645\u0627 \u0628\u062A\u0643\u0641\u064A.","Not enough cash."],"shop.needlevel":["\u0627\u0644\u0645\u0633\u062A\u0648\u0649 {n}",null,"Level {n}"],"shop.needskill":["\u0645\u0647\u0627\u0631\u0629 \u0627\u0644\u0634\u0637\u0641 \u0627\u0644\u062D\u0645\u0636\u064A",null,"Acid-rinse skill"],"shop.service":["\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u0645\u0627\u0643\u064A\u0646\u0629",null,"Machine service"],"shop.serviced":["\u0627\u0644\u0645\u0627\u0643\u064A\u0646\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0629 \u062A\u0636\u0639\u0641 \u0642\u0648\u062A\u0647\u0627.",null,"A neglected machine loses power."],"gear.meter":["\u0645\u0642\u064A\u0627\u0633 \u0631\u0637\u0648\u0628\u0629",null,"Moisture meter"],"gear.fans":["\u0645\u0631\u0627\u0648\u062D \u062A\u062C\u0641\u064A\u0641",null,"Drying fans"],"gear.trolley":["\u0639\u0631\u0628\u0629 \u064A\u062F",null,"Hand trolley"],"gear.tuktuk":["\u0631\u0643\u0634\u0629 \u0628\u0636\u0627\u0639\u0629",null,"Cargo tuk-tuk"],"gear.generator":["\u0645\u0648\u0644\u0651\u062F \u0643\u0647\u0631\u0628\u0627\u0621",null,"Generator"],"gear.tank":["\u062E\u0632\u0627\u0646 \u0645\u0627\u0621","\u062E\u0632\u0627\u0646 \u0645\u0648\u064A\u0629","Water tank"],"gear.loupe":["\u0639\u062F\u0633\u0629 \u0645\u0643\u0628\u0651\u0631\u0629",null,"Loupe"],"geard.meter":["\u064A\u0641\u062A\u062D \u062E\u0631\u064A\u0637\u062A\u064A \u0627\u0644\u0631\u0637\u0648\u0628\u0629 \u0648\u0628\u0642\u0627\u064A\u0627 \u0627\u0644\u0645\u0646\u0638\u0641 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u063A\u0633\u064A\u0644.",null,"Unlocks moisture and residue views while cleaning."],"geard.fans":["\u062A\u062C\u0641\u064A\u0641 \u0633\u0631\u064A\u0639 \u0648\u0622\u0645\u0646 \u0641\u064A \u0623\u064A \u0637\u0642\u0633.",null,"Fast, safe drying in any weather."],"geard.trolley":["\u064A\u0642\u0635\u0651\u0631 \u0645\u0634\u0648\u0627\u0631 \u0627\u0644\u0632\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644\u064A\u0629.",null,"Shortens home-visit trips."],"geard.tuktuk":["\u0645\u0634\u0627\u0648\u064A\u0631 \u0623\u0633\u0631\u0639 \u0628\u0643\u062B\u064A\u0631 \u0648\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646 \u0627\u0644\u0632\u0628\u0627\u0626\u0646. \u062A\u062F\u0641\u0639 \u0648\u0642\u0648\u062F\u0627\u064B \u0644\u0643\u0644 \u0645\u0634\u0648\u0627\u0631.",null,"Much faster trips and customer pickup. You pay fuel per trip."],"geard.generator":["\u062A\u0639\u0645\u0644 \u0623\u062F\u0648\u0627\u062A\u0643 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0639\u0646\u062F \u0627\u0646\u0642\u0637\u0627\u0639 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621.",null,"Electric tools keep working during power cuts."],"geard.tank":["\u0645\u0627\u0621 \u0643\u0627\u0641\u064D \u0639\u0646\u062F \u0627\u0646\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0627\u0621.",null,"Enough water during water cuts."],"geard.loupe":["\u062A\u0639\u0631\u0641 \u0627\u0644\u062E\u0627\u0645\u0629 \u0628\u062F\u0642\u0629 \u0639\u0646\u062F \u0627\u0644\u0641\u062D\u0635.",null,"Identifies the exact fibre on inspection."],"market.locked":["\u0633\u0648\u0642 \u0627\u0644\u0633\u062C\u0627\u062F \u064A\u062D\u062A\u0627\u062C \u0645\u062D\u0644\u0627\u064B",null,"The rug market needs premises"],"market.lockedd":["\u0627\u0633\u062A\u0623\u062C\u0631 \u0643\u0634\u0643\u0627\u064B \u0623\u0648 \u0648\u0631\u0634\u0629 \u0644\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0633\u062C\u0627\u062F \u0627\u0644\u0645\u0633\u062A\u0639\u0645\u0644 \u0648\u063A\u0633\u0644\u0647 \u0648\u0628\u064A\u0639\u0647.",null,"Rent a stall or workshop to store, clean and sell used rugs."],"market.buy":["\u0633\u062C\u0627\u062F \u0645\u0633\u062A\u0639\u0645\u0644 \u0644\u0644\u0628\u064A\u0639 \u0627\u0644\u064A\u0648\u0645",null,"Used rugs on offer today"],"market.none":["\u0644\u0627 \u0639\u0631\u0648\u0636 \u0627\u0644\u064A\u0648\u0645.",null,"Nothing on offer today."],"market.value":["\u0642\u064A\u0645\u062A\u0647\u0627 \u0646\u0638\u064A\u0641\u0629 \u0646\u062D\u0648 {n}",null,"Worth about {n} when clean"],"market.mine":["\u0633\u062C\u0627\u062F\u064A",null,"My rugs"],"market.empty":["\u0644\u0627 \u062A\u0645\u0644\u0643 \u0633\u062C\u0627\u062F\u0627\u064B \u0628\u0639\u062F.",null,"You own no rugs yet."],"market.clean":["\u0627\u063A\u0633\u0644\u0647\u0627",null,"Clean it"],"market.unlist":["\u0627\u0633\u062D\u0628 \u0627\u0644\u0639\u0631\u0636",null,"Unlist"],"market.listed":["\u0645\u0639\u0631\u0648\u0636\u0629 \u0628\u0640 {n}",null,"Listed at {n}"],"market.suggest":["\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u0642\u062A\u0631\u062D {n}",null,"Suggested {n}"],"market.dirty":["\u0645\u062A\u0633\u062E\u0629 \u2022 \u0627\u0634\u062A\u0631\u064A\u062A\u0647\u0627 \u0628\u0640 {n}",null,"Dirty \u2022 bought for {n}"],"biz.rank":["\u0627\u0644\u0631\u062A\u0628\u0629",null,"Rank"],"biz.level":["\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0648\u0627\u0644\u062E\u0628\u0631\u0629",null,"Level / XP"],"biz.brand":["\u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0634\u0639\u0627\u0631",null,"Name and logo"],"biz.premises":["\u0627\u0644\u0645\u0642\u0631",null,"Premises"],"biz.rent":["\u0625\u064A\u062C\u0627\u0631 {r} \u0643\u0644 {n} \u0623\u064A\u0627\u0645 \u2022 \u0639\u0631\u0628\u0648\u0646 {d}",null,"Rent {r} every {n} days \u2022 deposit {d}"],"biz.here":["\u0645\u0642\u0631\u0643 \u0627\u0644\u062D\u0627\u0644\u064A",null,"Current"],"biz.due":["\u0627\u0644\u0625\u064A\u062C\u0627\u0631 \u0628\u0639\u062F {n} \u064A\u0648\u0645",null,"rent due in {n} d"],"biz.needrep":["\u0633\u0645\u0639\u0629 {n}",null,"Reputation {n}"],"biz.staff":["\u0627\u0644\u0639\u0645\u0627\u0644",null,"Staff"],"biz.finance":["\u0627\u0644\u062A\u0645\u0648\u064A\u0644",null,"Finance"],"biz.skills":["\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A",null,"Skills"],"biz.nosp":["\u0644\u0627 \u062A\u0643\u0641\u064A \u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u0647\u0627\u0631\u0629.",null,"Not enough skill points."],"biz.ach":["\u0627\u0644\u0625\u0646\u062C\u0627\u0632\u0627\u062A",null,"Achievements"],"biz.ledger":["\u062F\u0641\u062A\u0631 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A",null,"Ledger"],"prem.home":["\u0632\u064A\u0627\u0631\u0627\u062A \u0645\u0646\u0632\u0644\u064A\u0629",null,"Home visits"],"prem.stall":["\u0643\u0634\u0643 \u0641\u064A \u0627\u0644\u0633\u0648\u0642",null,"Market stall"],"prem.workshop":["\u0648\u0631\u0634\u0629 \u063A\u0633\u064A\u0644",null,"Wash workshop"],"prem.centre":["\u0645\u0631\u0643\u0632 \u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0628\u0627\u0644\u0633\u062C\u0627\u062F",null,"Rug-care centre"],"premd.home":["\u062A\u063A\u0633\u0644 \u0641\u064A \u062D\u0648\u0634 \u0627\u0644\u0632\u0628\u0648\u0646. \u0637\u0644\u0628\u0627\u0646 \u0641\u064A \u0627\u0644\u064A\u0648\u0645.",null,"You work in the customer's courtyard. Two bookings a day."],"premd.stall":["\u0645\u0643\u0627\u0646 \u0645\u0633\u0642\u0648\u0641 \u0648\u062A\u062E\u0632\u064A\u0646\u060C \u0648\u064A\u0641\u062A\u062D \u0633\u0648\u0642 \u0627\u0644\u0633\u062C\u0627\u062F. \u062B\u0644\u0627\u062B\u0629 \u0637\u0644\u0628\u0627\u062A.",null,"Covered space with storage; opens the rug market. Three bookings."],"premd.workshop":["\u062D\u0648\u0636 \u063A\u0633\u064A\u0644 \u0648\u062D\u0648\u0627\u0645\u0644 \u062A\u062C\u0641\u064A\u0641 \u0648\u0639\u0645\u0627\u0644. \u0623\u0631\u0628\u0639\u0629 \u0637\u0644\u0628\u0627\u062A.",null,"Wash bay, drying racks and staff. Four bookings."],"premd.centre":["\u0635\u0627\u0644\u0629 \u0639\u0631\u0636 \u062A\u062C\u0630\u0628 \u0645\u0634\u062A\u0631\u064A\u0646 \u0623\u0643\u062B\u0631. \u062E\u0645\u0633\u0629 \u0637\u0644\u0628\u0627\u062A.",null,"A showroom that draws more buyers. Five bookings."],"staff.helper":["\u0635\u0628\u064A \u0645\u0633\u0627\u0639\u062F",null,"Apprentice"],"staff.cleaner":["\u063A\u0633\u0651\u0627\u0644 \u0645\u062A\u0645\u0631\u0633",null,"Trained cleaner"],"staffd.helper":["\u064A\u0646\u062C\u0632 \u0637\u0644\u0628\u0627\u064B \u0635\u063A\u064A\u0631\u0627\u064B \u0643\u0644 \u064A\u0648\u0645 \u0648\u064A\u062A\u0639\u0644\u0645 \u0645\u0639 \u0627\u0644\u0648\u0642\u062A. \u0627\u0644\u0623\u062C\u0631 {w} \u064A\u0648\u0645\u064A\u0627\u064B.",null,"Does one small job a day and learns over time. Wage {w} a day."],"staffd.cleaner":["\u064A\u0646\u062C\u0632 \u0637\u0644\u0628\u0627\u064B \u0645\u062A\u0648\u0633\u0637\u0627\u064B \u0643\u0644 \u064A\u0648\u0645 \u0628\u062C\u0648\u062F\u0629 \u0623\u0639\u0644\u0649. \u0627\u0644\u0623\u062C\u0631 {w} \u064A\u0648\u0645\u064A\u0627\u064B.",null,"Does one medium job a day at higher quality. Wage {w} a day."],"staff.fire":["\u0627\u0633\u062A\u063A\u0646\u0627\u0621",null,"Let go"],"staff.need":["\u064A\u062D\u062A\u0627\u062C \u0648\u0631\u0634\u0629",null,"Needs a workshop"],"fin.sandouq":["\u0627\u0644\u0635\u0646\u062F\u0648\u0642",null,"Sandouq (savings circle)"],"fin.sandouqd":["{m} \u062A\u062C\u0627\u0631 \u064A\u062F\u0641\u0639 \u0643\u0644\u064C\u0651 {n} \u0645\u0639 \u0643\u0644 \u0625\u064A\u062C\u0627\u0631\u060C \u0648\u064A\u0633\u062A\u0644\u0645 \u0648\u0627\u062D\u062F \u0645\u0646\u0647\u0645 {tot} \u0641\u064A \u062F\u0648\u0631\u0647. \u062A\u0645\u0648\u064A\u0644 \u0628\u0644\u0627 \u0641\u0648\u0627\u0626\u062F.",null,"{m} traders each pay {n} every rent period; one member collects {tot} on their turn. Interest-free finance."],"fin.sandouqs":["\u062F\u0641\u0639\u062A {p} \u0645\u0646 {m} \u2022 \u062F\u0648\u0631\u0643 \u0639\u0646\u062F \u0627\u0644\u0642\u0633\u0637 {k}",null,"Paid {p} of {m} \u2022 your turn at share {k}"],"fin.join":["\u0627\u0646\u0636\u0645",null,"Join"],"fin.received":["\u0627\u0633\u062A\u0644\u0645\u062A \u062F\u0648\u0631\u0643",null,"Collected"],"fin.insurance":["\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0633\u062C\u0627\u062F \u0641\u064A \u0627\u0644\u0639\u0647\u062F\u0629",null,"Rugs-in-care insurance"],"fin.insuranced":["{n} \u0645\u0639 \u0643\u0644 \u0625\u064A\u062C\u0627\u0631\u060C \u0648\u064A\u063A\u0637\u064A \u0667\u0660\u066A \u0645\u0646 \u062A\u0639\u0648\u064A\u0636\u0627\u062A \u0627\u0644\u062A\u0644\u0641.",null,"{n} every rent period; covers 70% of damage claims."],"fin.buy":["\u0627\u0634\u062A\u0631\u0643",null,"Insure"],"fin.cancel":["\u0623\u0644\u063A\u0650",null,"Cancel"],"brand.ar":["\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629",null,"Arabic name"],"brand.en":["\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",null,"English name"],"brand.icon":["\u0627\u0644\u0631\u0645\u0632",null,"Icon"],"brand.palette":["\u0627\u0644\u0623\u0644\u0648\u0627\u0646",null,"Colours"],"brand.sign":["\u0634\u0643\u0644 \u0627\u0644\u0644\u0627\u0641\u062A\u0629",null,"Sign shape"],"skill.fibre":["\u062A\u0645\u064A\u064A\u0632 \u0627\u0644\u0623\u0644\u064A\u0627\u0641",null,"Fibre identification"],"skill.diagnosis":["\u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u0628\u0642\u0639",null,"Stain diagnosis"],"skill.acidrinse":["\u0627\u0644\u0634\u0637\u0641 \u0627\u0644\u062D\u0645\u0636\u064A",null,"Acid rinse"],"skill.haggle":["\u0627\u0644\u0645\u0633\u0627\u0648\u0645\u0629",null,"Negotiation"],"skill.marketing":["\u0627\u0644\u062A\u0633\u0648\u064A\u0642",null,"Marketing"],"skill.suppliers":["\u0639\u0644\u0627\u0642\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u0651\u062F\u064A\u0646",null,"Supplier relations"],"skill.upkeep":["\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u0645\u0639\u062F\u0627\u062A",null,"Equipment upkeep"],"skill.drying":["\u062A\u0642\u062F\u064A\u0631 \u0627\u0644\u062A\u062C\u0641\u064A\u0641",null,"Drying forecast"],"skilld.fibre":["\u062A\u0639\u0631\u0641 \u0627\u0644\u062E\u0627\u0645\u0629 \u0628\u062F\u0642\u0629 \u0642\u0628\u0644 \u0642\u0628\u0648\u0644 \u0627\u0644\u0637\u0644\u0628.",null,"See the exact fibre before you accept a job."],"skilld.diagnosis":["\u062A\u0639\u0631\u0641 \u0646\u0648\u0639 \u0643\u0644 \u0628\u0642\u0639\u0629 \u0648\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0647\u0627.",null,"See each stain type and the best product for it."],"skilld.acidrinse":["\u064A\u0641\u062A\u062D \u0645\u0627\u062F\u0629 \u0627\u0644\u0634\u0637\u0641 \u0627\u0644\u062D\u0645\u0636\u064A \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631.",null,"Unlocks the acid rinse in the store."],"skilld.haggle":["\u062A\u0631\u0649 \u0623\u0642\u0635\u0649 \u0645\u0627 \u064A\u062F\u0641\u0639\u0647 \u0627\u0644\u0632\u0628\u0648\u0646.",null,"See the customer's real ceiling."],"skilld.marketing":["\u0637\u0644\u0628 \u0625\u0636\u0627\u0641\u064A \u0643\u0644 \u064A\u0648\u0645.",null,"One extra booking every day."],"skilld.suppliers":["\u062E\u0635\u0645 \u0661\u0665\u066A \u0639\u0644\u0649 \u0627\u0644\u0645\u0648\u0627\u062F.",null,"15% off supplies."],"skilld.upkeep":["\u0627\u0644\u0645\u0627\u0643\u064A\u0646\u0629 \u062A\u0633\u062E\u0646 \u0648\u062A\u062A\u0622\u0643\u0644 \u0623\u0628\u0637\u0623.",null,"The machine heats and wears more slowly."],"skilld.drying":["\u062A\u0631\u0649 \u0633\u0627\u0639\u0627\u062A \u0627\u0644\u062A\u062C\u0641\u064A\u0641 \u0627\u0644\u0645\u062A\u0648\u0642\u0639\u0629 \u0644\u0643\u0644 \u0637\u0631\u064A\u0642\u0629.",null,"See expected drying hours for each method."],"track.household":["\u0627\u0644\u0623\u0633\u0631",null,"Households"],"track.premium":["\u0623\u0635\u062D\u0627\u0628 \u0627\u0644\u0633\u062C\u0627\u062F \u0627\u0644\u062B\u0645\u064A\u0646",null,"Premium owners"],"track.commercial":["\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0648\u0646",null,"Commercial clients"],"track.community":["\u0623\u0647\u0644 \u0627\u0644\u062D\u064A",null,"Neighbourhood"],"rank.0":["\u0645\u0628\u062A\u062F\u0626",null,"Beginner"],"rank.1":["\u0635\u0628\u064A",null,"Apprentice"],"rank.2":["\u063A\u0633\u0651\u0627\u0644",null,"Washer"],"rank.3":["\u0623\u0633\u0637\u0649",null,"Craftsman"],"rank.4":["\u0645\u0639\u0644\u0651\u0645",null,"Master"],"rank.5":["\u062A\u0627\u062C\u0631",null,"Merchant"],"rank.6":["\u0643\u0628\u064A\u0631 \u0627\u0644\u062A\u062C\u0627\u0631","\u0634\u064A\u062E \u0627\u0644\u0633\u0648\u0642","Market Master"],"ach.first":["\u0623\u0648\u0644 \u0633\u062C\u0627\u062F\u0629",null,"First rug"],"ach.five":["\u062A\u062D\u0641\u0629: 95 \u0641\u0623\u0643\u062B\u0631",null,"Masterpiece: 95 or more"],"ach.ten":["\u0639\u0634\u0631 \u0633\u062C\u0627\u062F\u0627\u062A",null,"Ten rugs"],"ach.shop":["\u0623\u0648\u0644 \u0645\u0642\u0631",null,"First premises"],"ach.sold":["\u0623\u0648\u0644 \u0628\u064A\u0639\u0629",null,"First sale"],"ach.master":["\u0634\u064A\u062E \u0627\u0644\u0633\u0648\u0642",null,"Market Master"],"tx.start":["\u0631\u0623\u0633 \u0627\u0644\u0645\u0627\u0644",null,"Starting capital"],"tx.job":["\u063A\u0633\u064A\u0644",null,"Job"],"tx.claim":["\u062A\u0639\u0648\u064A\u0636",null,"Claim"],"tx.fuel":["\u0648\u0642\u0648\u062F",null,"Fuel"],"tx.power":["\u0643\u0647\u0631\u0628\u0627\u0621",null,"Power"],"tx.wage":["\u0623\u062C\u0631",null,"Wage"],"tx.staffjob":["\u0634\u063A\u0644 \u0627\u0644\u0639\u0645\u0627\u0644",null,"Staff job"],"tx.rent":["\u0625\u064A\u062C\u0627\u0631",null,"Rent"],"tx.insurance":["\u062A\u0623\u0645\u064A\u0646",null,"Insurance"],"tx.sandouq":["\u0627\u0644\u0635\u0646\u062F\u0648\u0642",null,"Sandouq"],"tx.supplies":["\u0645\u0648\u0627\u062F",null,"Supplies"],"tx.equipment":["\u0645\u0639\u062F\u0627\u062A",null,"Equipment"],"tx.service":["\u0635\u064A\u0627\u0646\u0629",null,"Service"],"tx.deposit":["\u0639\u0631\u0628\u0648\u0646 \u0648\u0625\u064A\u062C\u0627\u0631",null,"Deposit + rent"],"tx.hire":["\u062A\u0648\u0638\u064A\u0641",null,"Hiring"],"tx.brand":["\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0647\u0648\u064A\u0629",null,"Rebrand"],"tx.stock":["\u0634\u0631\u0627\u0621 \u0633\u062C\u0627\u062F",null,"Rug stock"],"tx.sale":["\u0628\u064A\u0639 \u0633\u062C\u0627\u062F\u0629",null,"Rug sale"],"tx.change":["\u0628\u0627\u0642\u064D \u0632\u0627\u0626\u062F",null,"Over-change"],"rep.staff":["\u062F\u062E\u0644 \u0627\u0644\u0639\u0645\u0627\u0644",null,"Staff income"],"rep.wages":["\u0627\u0644\u0623\u062C\u0648\u0631",null,"Wages"],"rep.rent":["\u0627\u0644\u0625\u064A\u062C\u0627\u0631",null,"Rent"],"rep.insurance":["\u0627\u0644\u062A\u0623\u0645\u064A\u0646",null,"Insurance"],"rep.sandouq":["\u0642\u0633\u0637 \u0627\u0644\u0635\u0646\u062F\u0648\u0642",null,"Sandouq share"],"rep.payout":["\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0635\u0646\u062F\u0648\u0642",null,"Sandouq payout"],"rep.missed":["\u0644\u0645 \u062A\u062F\u0641\u0639 \u0627\u0644\u0625\u064A\u062C\u0627\u0631! \u0625\u0646 \u062A\u0643\u0631\u0631 \u0630\u0644\u0643 \u0633\u062A\u064F\u062E\u0644\u064A \u0627\u0644\u0645\u062D\u0644.",null,"Rent unpaid! Miss it again and you lose the premises."],"rep.evicted":["\u0623\u064F\u062E\u0644\u064A\u062A \u0645\u0646 \u0627\u0644\u0645\u062D\u0644 \u0648\u0639\u062F\u062A \u0644\u0644\u0632\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644\u064A\u0629.",null,"You were evicted and are back to home visits."],"rep.quit":["\u062A\u0631\u0643 \u0623\u062D\u062F \u0627\u0644\u0639\u0645\u0627\u0644 \u0627\u0644\u0639\u0645\u0644 \u0644\u0623\u0646\u0643 \u0644\u0645 \u062A\u062F\u0641\u0639 \u0623\u062C\u0631\u0647.",null,"A worker left because you could not pay the wage."],"season.cool":["\u0634\u062A\u0627\u0621 \u062C\u0627\u0641",null,"Cool dry season"],"season.hot":["\u0635\u064A\u0641 \u062C\u0627\u0641",null,"Hot dry season"],"season.prerain":["\u062D\u0631 \u0645\u0627 \u0642\u0628\u0644 \u0627\u0644\u062E\u0631\u064A\u0641",null,"Pre-rain heat"],"season.rainy":["\u0627\u0644\u062E\u0631\u064A\u0641 (\u0645\u0648\u0633\u0645 \u0627\u0644\u0623\u0645\u0637\u0627\u0631)",null,"Rainy season"],"weather.clear":["\u0635\u062D\u0648",null,"Clear"],"weather.dust":["\u0647\u0628\u0648\u0628",null,"Dust storm"],"weather.rain":["\u0645\u0637\u0631",null,"Rain"],"weatherd.dust":["\u0627\u0644\u0647\u0628\u0648\u0628 \u064A\u0639\u064A\u062F \u0627\u0644\u063A\u0628\u0627\u0631 \u0639\u0644\u0649 \u0645\u0627 \u064A\u062C\u0641 \u0641\u064A \u0627\u0644\u062E\u0627\u0631\u062C.",null,"A dust storm puts dust back on anything drying outside."],"weatherd.rain":["\u0627\u0644\u0645\u0637\u0631 \u064A\u0645\u0646\u0639 \u0627\u0644\u0634\u0645\u0633 \u0648\u064A\u0637\u064A\u0644 \u0627\u0644\u062A\u062C\u0641\u064A\u0641.",null,"Rain rules out sun drying and slows everything."],"occ.preEid":["\u0632\u062D\u0645\u0629 \u0645\u0627 \u0642\u0628\u0644 \u0627\u0644\u0639\u064A\u062F",null,"Pre-Eid rush"],"occ.ramadan":["\u0631\u0645\u0636\u0627\u0646",null,"Ramadan"],"occ.eid":["\u0627\u0644\u0639\u064A\u062F",null,"Eid"],"occ.preAdha":["\u0642\u0628\u0644 \u0639\u064A\u062F \u0627\u0644\u0623\u0636\u062D\u0649",null,"Before Eid al-Adha"],"ev.powercut":["\u0642\u0637\u0639 \u0643\u0647\u0631\u0628\u0627\u0621 \u0627\u0644\u064A\u0648\u0645: \u0627\u0644\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0645\u062A\u0648\u0642\u0641\u0629 \u062F\u0648\u0646 \u0645\u0648\u0644\u0651\u062F.",null,"Power cut today: electric tools are off without a generator."],"ev.watercut":["\u0642\u0637\u0639 \u0645\u0627\u0621 \u0627\u0644\u064A\u0648\u0645: \u0662\u0665 \u0644\u062A\u0631\u0627\u064B \u0641\u0642\u0637 \u0644\u0643\u0644 \u0633\u062C\u0627\u062F\u0629 \u062F\u0648\u0646 \u062E\u0632\u0627\u0646.",null,"Water cut today: only 25 L per rug without a tank."],"ev.discount":["\u0623\u0633\u0628\u0648\u0639 \u062E\u0635\u0645 \u0639\u0646\u062F \u0627\u0644\u0645\u0648\u0631\u0651\u062F: \u0627\u0644\u0645\u0648\u0627\u062F \u0623\u0631\u062E\u0635 \u0662\u0665\u066A \u0627\u0644\u064A\u0648\u0645.",null,"Supplier discount: supplies are 25% cheaper today."],"ev.referral":["\u062C\u0627\u0631 \u0645\u062F\u062D \u0634\u063A\u0644\u0643: \u0637\u0644\u0628\u0627\u062A \u0623\u0643\u062B\u0631 \u0627\u0644\u064A\u0648\u0645.",null,"A neighbour praised your work: more bookings today."],"ev.puncture":["\u0625\u0637\u0627\u0631 \u0627\u0644\u0631\u0643\u0634\u0629 \u0645\u062B\u0642\u0648\u0628: \u0627\u0644\u0645\u0634\u0627\u0648\u064A\u0631 \u062A\u0623\u062E\u0630 \u0636\u0639\u0641 \u0627\u0644\u0648\u0642\u062A.",null,"Tuk-tuk puncture: trips take twice as long."],"req.nochem":["\u0628\u0644\u0627 \u0645\u0648\u0627\u062F \u0642\u0644\u0648\u064A\u0629 \u0642\u0648\u064A\u0629",null,"No strong alkaline products"],"req.savewater":["\u0627\u0642\u062A\u0635\u062F \u0641\u064A \u0627\u0644\u0645\u0627\u0621","\u0627\u0642\u062A\u0635\u062F \u0641\u064A \u0627\u0644\u0645\u0648\u064A\u0629","Go easy on water"],"req.gentle":["\u063A\u0633\u064A\u0644 \u0631\u0641\u064A\u0642 \u0628\u0644\u0627 \u0645\u0627\u0621 \u062D\u0627\u0631",null,"Gentle wash, no hot water"],"req.stainfree":["\u0623\u0632\u0644 \u0627\u0644\u0628\u0642\u0639 \u062A\u0645\u0627\u0645\u0627\u064B",null,"Remove the stains completely"],"req.dryfast":["\u062A\u062C\u0641\u064A\u0641 \u0633\u0631\u064A\u0639",null,"Dry it fast"],"req.tidy":["\u0644\u0627 \u062A\u0631\u0634\u0651 \u0627\u0644\u0623\u0631\u0636\u064A\u0629",null,"Keep the floor dry"],"mat.polypropylene":["\u0628\u0648\u0644\u064A \u0628\u0631\u0648\u0628\u0644\u064A\u0646",null,"Polypropylene"],"mat.polyester":["\u0628\u0648\u0644\u064A\u0633\u062A\u0631",null,"Polyester"],"mat.cotton":["\u0642\u0637\u0646 \u0645\u0646\u0633\u0648\u062C",null,"Cotton flatweave"],"mat.wool":["\u0635\u0648\u0641",null,"Wool"],"mat.handwoven":["\u064A\u062F\u0648\u064A \u062A\u0642\u0644\u064A\u062F\u064A",null,"Handwoven"],"mat.shag":["\u0648\u0628\u0631 \u0637\u0648\u064A\u0644",null,"Shag pile"],"matguess.syn":["\u0635\u0646\u0627\u0639\u064A \u0639\u0644\u0649 \u0627\u0644\u0623\u063A\u0644\u0628",null,"Probably synthetic"],"matguess.nat":["\u0637\u0628\u064A\u0639\u064A \u0639\u0644\u0649 \u0627\u0644\u0623\u063A\u0644\u0628",null,"Probably natural fibre"],"stain.tea":["\u0634\u0627\u064A",null,"Tea"],"stain.grease":["\u062F\u0647\u0648\u0646",null,"Grease"],"stain.juice":["\u0639\u0635\u064A\u0631",null,"Juice"],"stain.ink":["\u062D\u0628\u0631",null,"Ink"],"stain.henna":["\u062D\u0646\u0651\u0629",null,"Henna"],"stain.protein":["\u062D\u0644\u064A\u0628 \u0648\u0637\u0639\u0627\u0645",null,"Milk / food"],"stain.old":["\u0628\u0642\u0639\u0629 \u0642\u062F\u064A\u0645\u0629",null,"Old stain"],"size.prayer":["\u0633\u062C\u0627\u062F\u0629 \u0635\u0644\u0627\u0629",null,"Prayer rug"],"size.small":["\u0635\u063A\u064A\u0631\u0629",null,"Small"],"size.runner":["\u0645\u0645\u0631",null,"Runner"],"size.medium":["\u0645\u062A\u0648\u0633\u0637\u0629",null,"Medium"],"size.large":["\u0643\u0628\u064A\u0631\u0629",null,"Large"],"size.hall":["\u0635\u0627\u0644\u0629",null,"Hall rug"],"pat.medallion":["\u0646\u0642\u0634 \u0627\u0644\u062C\u0627\u0645\u0629",null,"Medallion"],"pat.kilim":["\u0643\u0644\u064A\u0645",null,"Kilim"],"pat.geo":["\u0647\u0646\u062F\u0633\u064A \u062D\u062F\u064A\u062B",null,"Modern geometric"],"pat.prayer":["\u0645\u062D\u0631\u0627\u0628",null,"Mihrab"],"pat.stripes":["\u0645\u0642\u0644\u0651\u0645",null,"Striped"],"pat.bursh":["\u0628\u064F\u0631\u0634",null,"Bursh mat"],"pat.floral":["\u0645\u0634\u062C\u0651\u0631",null,"Floral"],"arch.budget":["\u0623\u0633\u0631\u0629 \u0645\u0642\u062A\u0635\u062F\u0629",null,"Budget household"],"arch.family":["\u0623\u0633\u0631\u0629 \u062A\u0633\u062A\u0639\u062F \u0644\u0645\u0646\u0627\u0633\u0628\u0629",null,"Family before a gathering"],"arch.professional":["\u0645\u0648\u0638\u0641 \u0645\u0634\u063A\u0648\u0644",null,"Busy professional"],"arch.repeat":["\u0632\u0628\u0648\u0646 \u062F\u0627\u0626\u0645",null,"Regular customer"],"arch.collector":["\u0645\u0642\u062A\u0646\u064A \u0633\u062C\u0627\u062F",null,"Collector"],"arch.office":["\u0645\u062F\u064A\u0631 \u0645\u0643\u062A\u0628",null,"Office manager"],"arch.hotel":["\u0645\u062F\u064A\u0631 \u0646\u064F\u0632\u0644",null,"Guesthouse manager"],"arch.mosque":["\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u0633\u062C\u062F",null,"Mosque committee"],"story.budget":["\u0633\u062C\u0627\u062F\u0629 \u063A\u0631\u0641\u0629 \u0627\u0644\u0645\u0639\u064A\u0634\u0629 \u0644\u0623\u0633\u0631\u0629 \u062A\u062D\u0633\u0628 \u0643\u0644 \u062C\u0646\u064A\u0647.",null,"The living-room rug of a family that counts every pound."],"story.family":["\u0641\u064F\u0631\u0634\u062A \u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0636\u064A\u0648\u0641.",null,"Laid out to welcome guests."],"story.professional":["\u0633\u062C\u0627\u062F\u0629 \u0634\u0642\u0629 \u062D\u062F\u064A\u062B\u0629 \u0644\u0635\u0627\u062D\u0628 \u0648\u0642\u062A\u0647 \u0636\u064A\u0642.",null,"From a modern flat whose owner has no time."],"story.repeat":["\u0632\u0628\u0648\u0646 \u064A\u0639\u0648\u062F \u0625\u0644\u064A\u0643 \u0644\u0623\u0646\u0647 \u064A\u062B\u0642 \u0628\u0634\u063A\u0644\u0643.",null,"A customer who returns because they trust your work."],"story.collector":["\u0642\u0637\u0639\u0629 \u062B\u0645\u064A\u0646\u0629 \u0645\u0646 \u0645\u062C\u0645\u0648\u0639\u0629 \u062E\u0627\u0635\u0629.",null,"A valued piece from a private collection."],"story.office":["\u0633\u062C\u0627\u062F\u0629 \u0645\u062F\u062E\u0644 \u0645\u0643\u062A\u0628 \u064A\u0645\u0631 \u0639\u0644\u064A\u0647\u0627 \u0627\u0644\u0646\u0627\u0633 \u0637\u0648\u0627\u0644 \u0627\u0644\u064A\u0648\u0645.",null,"An office entrance rug walked on all day."],"story.hotel":["\u0645\u0646 \u0628\u0647\u0648 \u0646\u064F\u0632\u0644 \u064A\u0633\u062A\u0642\u0628\u0644 \u0627\u0644\u0645\u0633\u0627\u0641\u0631\u064A\u0646.",null,"From a guesthouse lobby."],"story.mosque":["\u0645\u0646 \u0633\u062C\u0627\u062F \u0627\u0644\u0645\u0633\u062C\u062F\u060C \u063A\u064F\u0633\u0644\u062A \u0628\u0639\u0646\u0627\u064A\u0629.",null,"From the mosque, washed with care."],"dist.nakheel":["\u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644",null,"Al-Nakheel quarter"],"dist.souq":["\u0633\u0648\u0642 \u0627\u0644\u0638\u0644\u0627\u0644",null,"Shade Market"],"dist.abraj":["\u0623\u0628\u0631\u0627\u062C \u0627\u0644\u0645\u0644\u062A\u0642\u0649",null,"Confluence Towers"],"dist.wersha":["\u062D\u064A \u0627\u0644\u0648\u0631\u0634",null,"Workshop district"],"dist.daffa":["\u0636\u0641\u0629 \u0627\u0644\u0646\u0647\u0631",null,"Riverside"],"dist.atraf":["\u0627\u0644\u0623\u0637\u0631\u0627\u0641",null,"The outskirts"],"showroom.title":["\u0635\u0627\u0644\u0629 \u0644\u064E\u0645\u0652\u0639\u0629 \u0644\u0644\u0639\u0631\u0636","\u0635\u0627\u0644\u0629 \u0644\u064E\u0645\u0652\u0639\u0629","Lamaa Showroom"],"showroom.myWork":["\u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644\u064A","\u0634\u063A\u0644\u064A","My Work"],"showroom.market":["\u0633\u0648\u0642 \u0627\u0644\u0635\u0627\u0644\u0629","\u0627\u0644\u0633\u0648\u0642","Market"],"showroom.wardrobe":["\u0627\u0644\u062E\u0632\u0627\u0646\u0629","\u0627\u0644\u062F\u0648\u0644\u0627\u0628","Wardrobe"],"showroom.community":["\u0645\u0639\u0631\u0636 \u0627\u0644\u0645\u062C\u062A\u0645\u0639","\u0634\u063A\u0644 \u0627\u0644\u0646\u0627\u0633","Community"],"showroom.before":["\u0642\u0628\u0644",null,"Before"],"showroom.after":["\u0628\u0639\u062F",null,"After"],"showroom.watch":["\u0634\u0627\u0647\u062F \u0627\u0644\u062A\u0627\u064A\u0645 \u0644\u0627\u0628\u0633","\u0634\u0648\u0641 \u0627\u0644\u063A\u0633\u064A\u0644","Watch time-lapse"],"showroom.sell":["\u0627\u0639\u0631\u0636\u0647\u0627 \u0644\u0644\u0628\u064A\u0639","\u0628\u064A\u0639\u0647\u0627","List for sale"],"showroom.sold":["\u0628\u0650\u064A\u0639\u062A","\u0627\u062A\u0628\u0627\u0639\u062A","Sold"],"showroom.golden":["\u0627\u0644\u062C\u0646\u0627\u062D \u0627\u0644\u0630\u0647\u0628\u064A","\u0627\u0644\u062C\u0646\u0627\u062D \u0627\u0644\u062F\u0647\u0628\u064A","Golden Wing"],"showroom.empty":["\u0644\u0645 \u062A\u064F\u0643\u0645\u0644 \u0623\u064A \u0633\u062C\u0627\u062F\u0629 \u0628\u0639\u062F\u060C \u0644\u0646\u0628\u062F\u0623!","\u0644\u0633\u0647 \u0645\u0627 \u063A\u0633\u0644\u062A \u0648\u0644\u0627 \u0633\u062C\u0627\u062F\u0629\u060C \u064A\u0644\u0627 \u0646\u0628\u062F\u0623!","No rugs finished yet \u2014 let's get started!"],"showroom.nomarket":["\u0627\u0634\u062A\u0631\u0650 \u0633\u062C\u0627\u062F\u0629 \u0645\u0633\u062A\u0639\u0645\u0644\u0629 \u0648\u0627\u063A\u0633\u0644\u0647\u0627 \u0644\u062A\u0639\u0631\u0636\u0647\u0627 \u0647\u0646\u0627.",null,"Buy a used rug and clean it to list it here."],"showroom.wardrobed":["\u0623\u0632\u064A\u0627\u0621 \u0648\u0623\u0644\u0648\u0627\u0646 \u0644\u0644\u0623\u062F\u0648\u0627\u062A. \u0645\u062E\u0637\u0637 \u0644\u0625\u0635\u062F\u0627\u0631 \u0642\u0627\u062F\u0645.",null,"Outfits and tool colours. Planned for a later release."],"showroom.communityd":["\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0644\u0627\u0639\u0628\u064A\u0646 \u0627\u0644\u0622\u062E\u0631\u064A\u0646 \u0648\u0627\u0644\u0633\u062C\u0627\u062F\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629. \u064A\u062D\u062A\u0627\u062C \u062D\u0641\u0638\u0627\u064B \u0633\u062D\u0627\u0628\u064A\u0627\u064B\u060C \u0645\u062E\u0637\u0637 \u0644\u0625\u0635\u062F\u0627\u0631 \u0642\u0627\u062F\u0645.",null,"Other players' work and the daily rug. Needs cloud saves; planned for a later release."],"showroom.score":["\u0627\u0644\u062F\u0631\u062C\u0629 {n}",null,"Score {n}"],"showroom.customer":["\u0627\u0644\u0632\u0628\u0648\u0646",null,"Customer"],"showroom.owned":["\u0645\u0646 \u0645\u062E\u0632\u0648\u0646\u0643",null,"From your own stock"],"tl.export":["\u062A\u0635\u062F\u064A\u0631 \u0641\u064A\u062F\u064A\u0648",null,"Export video"],"tl.recording":["\u064A\u064F\u0633\u062C\u064E\u0651\u0644 \u0627\u0644\u0641\u064A\u062F\u064A\u0648\u2026",null,"Recording\u2026"],"tl.saved":["\u062D\u064F\u0641\u0638 \u0627\u0644\u0641\u064A\u062F\u064A\u0648.",null,"Video saved."],"tl.unsupported":["\u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632.",null,"Export is not supported on this device."]};var Yc=["ar","ar-SD","en"];var dx={ar:[0,2],"ar-SD":[1,0,2],en:[2,0]},St={ui:"ar",dlg:"ar-SD",sub:"off",digits:"latn"};function kr(n){Object.assign(St,n),typeof document<"u"&&(document.documentElement.lang=St.ui,document.documentElement.dir=St.ui==="en"?"ltr":"rtl")}function fx(n,e){let t=$d[n];if(!t)return null;for(let i of dx[e])if(t[i])return t[i];return null}function px(n,e){return e?n.replace(/\{(\w+)\}/g,(t,i)=>e[i]!==void 0?e[i]:t):n}function qc(n,e,t){let i=fx(e,n);return i===null?e:px(i,t)}var A=(n,e)=>qc(St.ui,n,e);function _n(n,e){let t=qc(St.dlg,n,e),i=St.sub!=="off"&&St.sub!==St.dlg?qc(St.sub,n,e):null;return{text:t,sub:i&&i!==t?i:null,rtl:St.dlg!=="en"}}var mx="\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";function Oe(n,e=0){let t=Number(n).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e});return St.ui!=="en"&&St.digits==="arab"&&(t=t.replace(/\d/g,i=>mx[i]).replace(/,/g,"\u066C").replace(".","\u066B")),t}var tt=n=>St.ui==="en"?`SDG ${Oe(n)}`:`${Oe(n)} \u062C.\u0633`;function $o(n,e){let t="many";return St.ui==="en"?t=n===1?"one":"many":n===1?t="one":n===2?t="two":n%100>=3&&n%100<=10&&(t="few"),A(`${e}.${t}`,{n:Oe(n)})}function Zd(n){let e=St.ui==="en"?"en-GB":"ar-EG",t=St.ui!=="en"&&St.digits==="arab"?"arab":"latn";try{let i=new Intl.DateTimeFormat(`${e}-u-nu-${t}`,{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(n),s=new Intl.DateTimeFormat(`${St.ui==="en"?"en":"ar-SA"}-u-ca-islamic-umalqura-nu-${t}`,{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(n);return{g:i,h:s}}catch{return{g:n.toISOString().slice(0,10),h:""}}}var ot=null,Ti,$c;var Jd,Kd,zr,Gr;var Qd,Jo,Qo=null,jo=!0,Ko=0,Zo=[220,261.6,293.7,329.6,392,440,523.3,587.3];function jd(){if(ot||!jo)return;let n=window.AudioContext||window.webkitAudioContext;if(!n)return;ot=new n,Ti=ot.createGain(),Ti.gain.value=.7,Ti.connect(ot.destination),$c=ot.createBuffer(1,ot.sampleRate*2,ot.sampleRate);let e=$c.getChannelData(0);for(let s=0;s<e.length;s++)e[s]=Math.random()*2-1;let t=(s,r,a)=>{let o=ot.createBufferSource();o.buffer=$c,o.loop=!0;let c=ot.createBiquadFilter();c.type=s,c.frequency.value=r,c.Q.value=a;let l=ot.createGain();return l.gain.value=0,o.connect(c),c.connect(l),l.connect(Ti),o.start(),[c,l]};[Kd,Jd]=t("bandpass",1800,.8),[,Qd]=t("highpass",3500,.5),zr=ot.createOscillator(),zr.type="sawtooth",zr.frequency.value=55;let i=ot.createBiquadFilter();i.type="lowpass",i.frequency.value=320,Gr=ot.createGain(),Gr.gain.value=0,zr.connect(i),i.connect(Gr),Gr.connect(Ti),zr.start(),Jo=ot.createGain(),Jo.gain.value=.12,Jo.connect(Ti)}function Jc(n){jo=n,ot&&(Ti.gain.value=n?.7:0)}function Kc(){ot&&ot.state==="suspended"&&ot.resume()}var Zc=(n,e)=>{ot&&n.gain.setTargetAtTime(e,ot.currentTime,.06)};function Hr(n,e=0,t=0){ot&&(Zc(Jd,n==="scrub"||n==="motor"?.16:n==="squeegee"?.1:0),Zc(Gr,n==="motor"?.09:0),Zc(Qd,n==="water"?.12:0),n&&Kd.frequency.setTargetAtTime(n==="squeegee"?700+e*900:2600-e*1300-t*700,ot.currentTime,.1))}function Ns(n=660,e=.12,t="sine",i=.18){if(!ot||!jo)return;let s=ot.createOscillator(),r=ot.createGain();s.type=t,s.frequency.value=n,r.gain.setValueAtTime(i,ot.currentTime),r.gain.exponentialRampToValueAtTime(.001,ot.currentTime+e),s.connect(r),r.connect(Ti),s.start(),s.stop(ot.currentTime+e)}var Ht={tap:()=>Ns(520,.06,"triangle",.1),coin:()=>{Ns(880,.08),setTimeout(()=>Ns(1320,.14),70)},bad:()=>Ns(160,.25,"sawtooth",.12),good:()=>[523,659,784,1046].forEach((n,e)=>setTimeout(()=>Ns(n,.22),e*110)),note:()=>Ns(300+Math.random()*80,.05,"square",.05)};function Qc(n){Ko=n}function ef(){if(!ot||Qo)return;let n=0;Qo=setInterval(()=>{if(!jo||ot.state!=="running")return;n++;let e=(t,i,s,r="sine")=>{let a=ot.createOscillator(),o=ot.createGain();a.type=r,a.frequency.value=t,o.gain.setValueAtTime(1e-4,ot.currentTime),o.gain.linearRampToValueAtTime(s,ot.currentTime+.03),o.gain.exponentialRampToValueAtTime(.001,ot.currentTime+i),a.connect(o),o.connect(Jo),a.start(),a.stop(ot.currentTime+i)};n%4===0&&e(Zo[0]/2,1.2,.5,"triangle"),Ko>.25&&n%2===0&&e(Zo[n*3%5],.5,.25),Ko>.55&&e(Zo[(n*5+2)%8],.3,.18,"triangle"),Ko>.85&&n%4===2&&e(Zo[7]*2,.8,.12)},300)}function tf(){clearInterval(Qo),Qo=null}var pt=(n,e=document)=>e.querySelector(n);function g(n,e,...t){let[i,...s]=n.split("."),[r,a]=i.split("#"),o=document.createElement(r||"div");a&&(o.id=a),s.length&&(o.className=s.join(" ")),e&&(typeof e!="object"||e instanceof Node||Array.isArray(e))&&(t.unshift(e),e=null);for(let l in e||{}){let u=e[l];u==null||u===!1||(l.startsWith("on")?o.addEventListener(l.slice(2),l==="onclick"?h=>{Ht.tap(),u(h)}:u):l==="style"&&typeof u=="object"?Object.assign(o.style,u):l in o&&l!=="list"?o[l]=u:o.setAttribute(l,u))}let c=l=>{l==null||l===!1||(Array.isArray(l)?l.forEach(c):o.append(l instanceof Node?l:String(l)))};return t.forEach(c),o}function xn(n,e={}){let t=g("div.modal-wrap"+(e.cls?"."+e.cls:""),g("div.modal",n));return e.dismiss&&t.addEventListener("click",i=>{i.target===t&&(t.remove(),e.onclose&&e.onclose())}),document.getElementById("ui").append(t),{el:t,close:()=>t.remove()}}var el;function bt(n,e="",t=3200){el=document.getElementById("toasts");let i=g("div.toast"+(e?"."+e:""),n);for(el.append(i);el.children.length>3;)el.firstChild.remove();setTimeout(()=>i.classList.add("out"),t-400),setTimeout(()=>i.remove(),t)}var ii=(n,e="")=>g("div.bar"+(e?"."+e:""),g("i",{style:{width:Math.round(Math.max(0,Math.min(1,n))*100)+"%"}}));var Us=1/30,gx={dry:"\u{1F9F9}",spray:"\u{1F4A6}",chem:"\u{1F9F4}",brush:"\u{1FAA5}",rotary:"\u2699\uFE0F",extract:"\u{1F9FD}",groom:"\u224B"};function eu(n,e,t){if(t){let i=e.last?t[0]-e.last[0]:0,s=e.last?t[1]-e.last[1]:0;qu(n,e.tools[e.slot],t[0],t[1],Us,{pressure:e.set.pressure,temp:e.set.temp,chem:e.set.chem,fast:e.set.fast,dx:i,dy:s}),e.last=t}else e.last=null;Yu(n,Us)}function _x(n){let e={};for(let t of Yr){let i=null;for(let s in on)on[s].slot===t&&n.tools[s]&&(!i||on[s].tier>on[i].tier)&&(i=s);i&&(e[t]={...on[i],id:i},i==="rotary"&&n.machine.cond<.3&&(e[t].power*=.65))}return e}var G=null,rf=()=>G;function Vr(n){let e=V.state,t=Au(e),i=Ys(n.spec),s=_x(e);G={job:n,rug:i,e:t,c:{tools:s,slot:"dry",set:{pressure:.6,temp:0,chem:"shampoo",fast:!1},last:null},rec:{tools:s,ev:[],dry:null},heat:0,locked:!1,acc:0,down:!1,pt:null,prev:null,paused:!1,hudT:0,warnT:{},lastM:Vn(i),overlay:0,used:{machine:!1,electric:!1},waterCap:t.water?1/0:25,coach:e.stats.jobs<3||V.settings.coach},Fs("slot","dry"),V.scene.setEnv(n.own||e.premises!=="home"?"shop":"yard"),V.scene.setLight(Math.min(19,e.hour),t.weather,e.premises!=="home"),V.scene.hud={top:118,bottom:214},V.scene.setView("work"),V.scene.setRug(i,Ls(n.spec)),V.scene.render(0),G.before=V.scene.snapshot(256),V.mode="clean",yx(),ef(),Qc(0),t.power||bt(A("warn.nopower"),"warn",5e3),t.water||bt(A("warn.nowater",{n:Oe(25)}),"warn",5e3),t.weather==="dust"&&e.premises==="home"&&bt(A("warn.haboob"),"warn",5e3)}function Fs(n,e){G.rec.ev.push({[n]:e})}function xx(n){let e=G.rec.ev;n?e.push([Math.round(n[0]*100),Math.round(n[1]*100)]):typeof e[e.length-1]=="number"?e[e.length-1]++:e.push(1)}function yx(){let n=pt("#ui");n.replaceChildren();let e=G.job,t=g("div.hud-top",g("div.hud-row",g("div.stat",g("small",A("hud.cleanliness")),g("b#h-clean","0%"),ii(0,"clean")),g("div.stat",g("small",A("hud.time")),g("b#h-time","0:00")),g("div.stat",g("small",A("hud.water")),g("b#h-water","0")),g("button.icon-btn",{onclick:Sx,title:A("hud.help")},"?"),g("button.icon-btn.go",{onclick:Ex},"\u2713")),g("div.chips",e.requests.map(r=>g("span.chip","\u{1F4CC} "+A("req."+r))),e.rush?g("span.chip.hot","\u23F1 "+A("job.rush")):null,g("span.chip",V.matLabel(e))),g("div#coach.coach",{style:{display:G.coach?"":"none"}})),i=g("div.hud-side",g("button.icon-btn",{id:"ov-dirt",onclick:()=>jc(G.overlay===1?0:1),title:A("hud.dirtview")},"\u{1F50D}"),nn(V.state,"meter")?g("button.icon-btn",{id:"ov-wet",onclick:()=>jc(G.overlay===2?0:2),title:A("hud.wetview")},"\u{1F4A7}"):null,nn(V.state,"meter")?g("button.icon-btn",{id:"ov-soap",onclick:()=>jc(G.overlay===3?0:3),title:A("hud.soapview")},"\u{1FAE7}"):null,g("button.icon-btn",{onclick:()=>{V.scene.setView(V.scene.view==="top"?"work":"top")},title:A("hud.camera")},"\u{1F3A5}"),g("button.icon-btn",{onclick:()=>{G.coach=!G.coach,V.settings.coach=G.coach,V.saveSettings(),pt("#coach").style.display=G.coach?"":"none"},title:A("hud.coach")},"\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F")),s=g("div.hud-bottom",g("div#tool-opts.tool-opts"),g("div.toolbar",Yr.map(r=>{let a=G.c.tools[r];return g("button.tool"+(a?"":".locked"),{id:"tool-"+r,onclick:()=>a?tl(r):bt(A("tool.locked",{name:A("slot."+r)}))},g("span.ti",gx[r]),g("span.tn",a?A("tool."+a.id):A("slot."+r)))})));n.append(t,i,s,g("div#toasts.toasts")),tl("dry"),lf(!0)}function jc(n){G.overlay=n,V.scene.setOverlay(n);for(let[e,t]of[["ov-dirt",1],["ov-wet",2],["ov-soap",3]]){let i=pt("#"+e);i&&i.classList.toggle("on",n===t)}}function tl(n){G.c.slot=n,Fs("slot",n);for(let r of Yr)pt("#tool-"+r).classList.toggle("on",r===n);let e=pt("#tool-opts");e.replaceChildren();let t=G.c.tools[n],i=G.c.set,s=(r,a,o,c)=>g("div.seg",g("small",r),a.map(([l,u])=>g("button"+(l===o?".on":""),{onclick:()=>{c(l),tl(n)}},u)));(t.kind==="agitate"||t.kind==="extract")&&e.append(s(A("opt.pressure"),[[.3,A("opt.light")],[.6,A("opt.medium")],[1,A("opt.hard")]],i.pressure,r=>{i.pressure=r,Fs("pressure",r)})),t.machine&&(e.append(s(A("opt.speed"),[[!1,A("opt.slow")],[!0,A("opt.fast")]],i.fast,r=>{i.fast=r,Fs("fast",r)})),e.append(g("div.seg",g("small",A("opt.heat")),g("div#h-heat",ii(G.heat,"heat"))))),t.kind==="spray"&&e.append(s(A("opt.temp"),[[0,"\u2744 "+A("opt.cold")],[1,A("opt.warm")],[2,"\u{1F525} "+A("opt.hot")]],i.temp,r=>{i.temp=r,Fs("temp",r),r===2&&Mx()})),t.kind==="chem"&&e.append(g("div.chems",bn.filter(r=>Ji(V.state,r)).map(r=>{let a=Math.max(0,(V.state.stock[r]||0)-(G.rug.stats.chemMl[r]||0));return g("button.chem"+(r===i.chem?".on":"")+(a<=0?".empty":""),{onclick:()=>vx(r)},g("b",A("chem."+r)),g("small",`pH ${Oe(Yt[r].ph,Yt[r].ph%1?1:0)} \u2022 ${Oe(Math.round(a))} ${A("unit.ml")}`))}))),(t.kind==="dry"||t.kind==="groom")&&e.append(g("div.hint",A("hint."+t.kind)))}function vx(n){let e=xl(G.rug,n);if(e){Ht.bad(),xn([g("h3","\u26A0\uFE0F "+A("safety.title")),g("p",A("safety.mix",{a:A("chem."+n),b:A("chem."+e)})),g("button.btn",{onclick:t=>t.target.closest(".modal-wrap").remove()},A("ok"))]);return}G.c.set.chem=n,Fs("chem",n),tl("chem")}function Mx(){let n=new Set(G.job.spec.stains.map(e=>e.type));(n.has("protein")||n.has("henna"))&&(ln(V.state,"diagnosis")||G.job.inspected)?bt(A("warn.heatset"),"warn",5e3):G.rug.mat.shrink>.4&&bt(A("warn.shrink"),"warn",5e3)}function Sx(){G.paused=!0;let n=xn([g("h3",A("help.title")),g("ol.steps",[1,2,3,4,5,6,7].map(e=>g("li",A("help.s"+e)))),g("p.muted",A("help.note")),g("button.btn",{onclick:()=>{n.close(),G.paused=!1}},A("ok"))])}function af(n,e,t){if(!G||V.mode!=="clean"||G.paused)return;if(n==="up"){G.down=!1;return}let i=V.scene.pick(e,t);i&&(G.pt=i,n==="down"&&(G.down=!0))}function bx(){let n=G.c.tools[G.c.slot],e=G.rug.stats,t=(i,s)=>(G.warnT[i]>G.rug.time||(G.warnT[i]=G.rug.time+6,bt(A("warn."+i,s),"warn"),Ht.bad()),!1);if(n.electric&&!G.e.power)return t("nopower");if(n.machine&&G.locked)return t("overheat");if(n.kind==="spray"&&e.waterL>=G.waterCap)return t("nowater",{n:Oe(25)});if(n.kind==="chem"){let i=G.c.set.chem;if((V.state.stock[i]||0)-(e.chemMl[i]||0)<=0)return t("nostock",{name:A("chem."+i)});if(xl(G.rug,i))return t("mix")}return!0}function of(n){if(!G)return;let e=V.scene,t=G.c.tools[G.c.slot];if(!G.paused&&V.mode==="clean"){for(G.acc+=Math.min(n,.1);G.acc>=Us;){G.acc-=Us;let i=null;if(G.down&&G.pt&&bx()){let{w:s,h:r}=G.rug.spec,a=t.radius;G.pt.mx>-a&&G.pt.my>-a&&G.pt.mx<s+a&&G.pt.my<r+a&&(i=[Math.round(G.pt.mx*100)/100,Math.round(G.pt.my*100)/100])}i&&t.machine?(G.heat=Math.min(1,G.heat+Us/(ln(V.state,"upkeep")?70:42)),G.heat>=1&&(G.locked=!0),G.used.machine=!0):(G.heat=Math.max(0,G.heat-Us/22),G.locked&&G.heat<.45&&(G.locked=!1)),i&&t.electric&&(G.used.electric=!0),eu(G.rug,G.c,i),xx(i),G.active=!!i}e.updateMasks()}if(G.pt&&V.mode==="clean"){let i=G.prev||G.pt,s=G.down&&G.active;if(e.setTool(G.c.slot,G.pt.x,G.pt.z,s,G.pt.x-i.x,G.pt.z-i.z,s?G.c.set.fast?.9:.55:0),s){let r=t.kind,a=wx(G.pt.mx,G.pt.my),o=a<0?0:Math.min(1,G.rug.wet[a]),c=a<0?0:G.rug.foam[a];if(r==="spray"?e.emit(G.pt.x,G.pt.z,"water",4):r==="chem"?e.emit(G.pt.x,G.pt.z,"chem",2):r==="dry"&&a>=0&&G.rug.dust[a]>.05?e.emit(G.pt.x,G.pt.z,"dust",2):r==="agitate"&&c>.3&&e.emit(G.pt.x+(Math.random()-.5)*t.radius,G.pt.z+(Math.random()-.5)*t.radius,"foam",1),Hr(r==="spray"||r==="chem"?"water":t.machine?"motor":r==="extract"?"squeegee":"scrub",o,c),r==="agitate"&&o<.15&&a>=0&&G.rug.soil[a]+G.rug.stain[a]>.2&&$i("dry"),t.machine&&V.settings.haptics!==!1&&window.AndroidBridge&&Math.random()<.1)try{window.AndroidBridge.vibrate(15)}catch{}}else Hr(null);G.prev=G.pt}else Hr(null);G.hudT-=n,G.hudT<=0&&V.mode==="clean"&&(G.hudT=.3,lf())}function wx(n,e){let t=Math.floor(n*Hn),i=Math.floor(e*Hn);return t<0||i<0||t>=G.rug.W||i>=G.rug.H?-1:i*G.rug.W+t}function $i(n,e=4200){G.warnT[n]>G.rug.time||(G.warnT[n]=G.rug.time+9,bt(A("warn."+n),"warn",e))}function lf(n){let e=Vn(G.rug),t=G.lastM,i=Ml(G.rug);pt("#h-clean").textContent=Oe(Math.round(i*100))+"%",pt(".bar.clean i").style.width=i*100+"%";let s=Math.floor(G.rug.time);pt("#h-time").textContent=`${Oe(Math.floor(s/60))}:${String(s%60).padStart(2,"0")}`,pt("#h-time").classList.toggle("late",G.rug.time>G.job.par),pt("#h-water").textContent=Oe(Math.round(G.rug.stats.waterL))+" "+A("unit.l");let r=pt("#h-heat i");r&&(r.style.width=G.heat*100+"%",r.parentElement.classList.toggle("hot",G.locked)),Qc(i),n||(e.stress-t.stress>8e-4&&$i("stress"),e.bleed>.004&&e.bleed-t.bleed>4e-4&&$i("bleed",6e3),e.wet>1.05&&$i("overwet"),e.soap>.7&&$i("chem"),t.dust-e.dust>.01&&e.soil>t.soil+.005&&$i("mud",6e3),G.heat>.82&&!G.locked&&$i("heat")),G.lastM=e,G.coach&&(pt("#coach").textContent="\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F "+_n("coach."+Tx(e)).text)}function Tx(n){let e=G.rug.stats;return n.dust>.06&&n.wet<.1?"dust":n.dirt>G.rug.initial.dirt*.25||n.stain>G.rug.initial.stain*.3?n.wet<.35?"wet":n.soap<.18&&n.soil+n.stain>.05?n.stain>.03&&n.soil<.08?"spot":"soap":"scrub":n.slurry>.03||n.soap>.06?e.waterL<1?"wet":"rinse":n.wet>.45?"extract":n.nap<.6?"groom":"done"}function Ex(){G.paused=!0,Hr(null);let n=V.state,e=G.e,t=Vn(G.rug),i=Ml(G.rug),s=n.premises==="home"&&!G.job.own,r=[];e.weather!=="rain"&&n.hour<17.5&&r.push("sun"),r.push("shade"),nn(n,"fans")&&e.power&&r.push("fans"),Ke.premises[n.premises].racks&&r.push("rack");let a=(l,u,h)=>l<u?"good":l<h?"mid":"bad",o=(l,u,h)=>g("div.check."+u,g("span",l),g("b",h)),c=xn([g("h3",A("finish.title")),o(A("finish.clean"),a(1-i,.08,.25),Oe(Math.round(i*100))+"%"),o(A("finish.wet"),a(t.wet,.4,.75),A("lvl."+a(t.wet,.4,.75))),o(A("finish.residue"),a(t.soap+t.slurry,.05,.15),A("lvl."+a(t.soap+t.slurry,.05,.15))),o(A("finish.edges"),a(t.edgeDirt-t.dirt,.04,.12),A("lvl."+a(t.edgeDirt-t.dirt,.04,.12))),g("p.muted",A("finish.pick")),g("div.methods",r.map(l=>{let u=yl(G.rug,{method:l,temp:e.temp,humid:e.humid});return g("button.method",{onclick:()=>{c.close(),Ax(l,u)}},g("b",A("dry."+l)),g("small",ln(n,"drying")?A("dry.forecast",{n:Oe(u,1)}):A("dryd."+l)),G.job.own?null:g("small"+(u>G.job.deadline?".bad":""),ln(n,"drying")&&u>G.job.deadline?A("dry.late"):""))})),g("button.btn.ghost",{onclick:()=>{c.close(),G.paused=!1}},A("finish.back"))])}function Ax(n,e){let t=V.state,i=G.e,s=V.scene;V.mode="drying",pt("#ui").replaceChildren(g("div.banner",g("b",A("dry.running")),g("span",A("dry."+n))),g("div#toasts.toasts")),s.setTool(null),s.setOverlay(0),s.setView("top");let r=Vn(G.rug),a=24,o=t.premises==="home"&&!G.job.own&&n!=="fans",c={method:n,temp:i.temp,humid:i.humid,hours:e,dust:o&&i.weather==="dust"?.3:0};G.rec.dry=c;let l=0,u=setInterval(()=>{vl(G.rug,c,l,a),s.updateMasks(),l++,l>=a&&(clearInterval(u),setTimeout(()=>Rx(r,e,n),500))},120)}function Rx(n,e,t){let i=V.state,s=G.job,r=V.scene,a=!s.own&&e>s.deadline,o=Zu(G.rug,n,{par:s.par,requests:s.requests,waterBudget:s.waterBudget,late:a});r.render(0);let c=r.snapshot(256);tf(),(o.total>=70?Ht.good:Ht.bad)();let l=Pu(i,s,o,G.rug.time,e,{chemMl:G.rug.stats.chemMl,waterL:G.rug.stats.waterL,machine:G.used.machine,electric:G.used.electric}),u=V.addGallery(s,o,G.rug,G.before,c,G.rec,a);V.mode="result";let h=[];n.wet>.6&&G.rug.initial.deep>.1&&h.push("wick"),n.slurry>.04&&h.push("redeposit"),n.soap>.08&&h.push("residue"),o.m.bleed>.01&&h.push("bleed"),o.m.stress>.02&&h.push("stress"),o.m.shrink>.03&&h.push("shrink"),o.m.fade>.05&&h.push("fade"),a&&h.push("late"),G.rec.dry.dust&&h.push("haboob"),o.stainLeft>.3&&h.push("stains");let f=[["clean",30],["safety",20],["coverage",15],["moisture",10],["time",10],["instr",10],["site",5]],d=s.own?null:_n("dlg."+(o.damaged?"damaged":o.total>=85?"happy":o.total>=70?"ok":o.total>=55?"unhappy":"angry"));pt("#ui").replaceChildren(g("div.panel.result",g("div.score",g("div.ring",{style:{"--p":o.total}},g("b",Oe(o.total))),g("div",g("div.stars","\u2605".repeat(o.stars)+"\u2606".repeat(5-o.stars)),g("h2",A("band."+o.stars)))),tu(G.before,c,s.spec),g("div.cats",f.map(([x,b])=>g("div.cat",g("span",A("sc."+x)),ii(o[x]/b,o[x]/b>.75?"good":o[x]/b>.45?"mid":"bad"),g("b",`${Oe(o[x],1)}/${Oe(b)}`)))),o.failed.length?g("div.notes",o.failed.map(x=>g("div.note.bad","\u2717 "+A("req."+x)))):null,h.length?g("div.notes",h.map(x=>g("div.note","\u2022 "+A("why."+x)))):null,d?Ei(s,d):g("p.muted",A("result.own")),l.leveled?g("div.note.good","\u2B06 "+A("result.level",{n:Oe(i.level)})):null,u?g("div.note.good","\u{1F5BC} "+A("result.gallery")):null,g("button.btn",{onclick:()=>s.own?nu(l):Cx(l,o)},s.own?A("continue"):l.pay+l.tip>0?A("result.collect"):A("continue"))),g("div#toasts.toasts"))}function Ei(n,e){let t=(St.ui==="en"?ai[n.g+"En"]:ai[n.g])[n.name];return g("div.speech",g("span.av",n.g==="m"?"\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F":"\u{1F9D5}\u{1F3FE}"),g("div",g("small",t),g("p",{dir:e.rtl?"rtl":"ltr"},e.text),e.sub?g("p.sub",e.sub):null))}function tu(n,e,t){let i=g("div.ba",{style:{aspectRatio:`${t.w} / ${t.h}`}},g("img",{src:e,draggable:!1}),g("img.ba-top",{src:n,draggable:!1}),g("div.ba-knob"),g("span.ba-l",A("showroom.before")),g("span.ba-r",A("showroom.after"))),s=r=>{let a=i.getBoundingClientRect();i.style.setProperty("--f",Math.max(0,Math.min(1,(r.clientX-a.left)/a.width))*100+"%"),r.preventDefault()};return i.addEventListener("pointerdown",r=>{i.setPointerCapture(r.pointerId),s(r),i.onpointermove=s}),i.addEventListener("pointerup",()=>{i.onpointermove=null}),i}function nf(n){let e=[];for(let t of Ke.notes)for(;n>=t;)e.push(t),n-=t;return e}function Cx(n,e){let t=V.state,i=G.job,s=n.pay+n.tip;if(s<=0)return jr(t,i,n),nu(n);let r=i.id*2654435761>>>0,a=r%3===0?s:Math.ceil(s/(r%2?1e4:5e3))*(r%2?1e4:5e3),o=a-s,c=[],l=h=>Oe(h),u=()=>{let h=c.reduce((f,d)=>f+d,0);pt("#ui").replaceChildren(g("div.panel.pay",g("h2",A("pay.title")),Ei(i,_n(n.tip?"dlg.tip":"dlg.pay")),g("div.due",g("span",A("pay.due")),g("b",tt(s)),n.tip?g("small",A("pay.tip",{n:tt(n.tip)})):null),g("small.muted",A("pay.handed",{n:tt(a)})),g("div.notes-row",nf(a).map(f=>Yo(f,l))),o>0?[g("div.due",g("span",A("cash.change")),g("b",tt(o)),g("small",A("pay.given",{n:tt(h)}))),g("div.notes-row.given",c.map((f,d)=>{let x=Yo(f,l);return x.onclick=()=>{c.splice(d,1),u()},x})),g("small.muted",A("pay.drawer")),g("div.notes-row.drawer",Ke.notes.slice().reverse().map(f=>{let d=Yo(f,l);return d.onclick=()=>{Ht.note(),c.push(f),u()},d})),g("div.row",g("button.btn.ghost",{onclick:()=>{c=nf(o),u()}},A("pay.auto")),g("button.btn",{onclick:()=>{if(h<o){Ht.bad(),bt(_n("dlg.shortchange").text,"warn");return}jr(t,i,n),h>o?(Pt(t,"change",-Math.min(t.cash,h-o),"#"+i.id),bt(A("pay.over",{n:tt(h-o)}),"warn",4500)):c.length&&(t.rep.community+=.1),sf(n,a,o)}},A("pay.confirm")))]:g("button.btn",{onclick:()=>{jr(t,i,n),sf(n,a,0)}},A("pay.take"))),g("div#toasts.toasts"))};u()}function sf(n,e,t){let i=V.state,s=G.job;Ht.coin();let r=ci(i.day),a=St.ui==="en"?"en":"ar";pt("#ui").replaceChildren(g("div.panel.pay",g("div.receipt",g("img",{src:Ds(i.brand,128,a).toDataURL(),alt:""}),g("div.rl",g("span",A("rc.no")),g("b","#"+Oe(s.id))),g("div.rl",g("span",A("rc.service")),g("b",A("rc.wash",{size:A("size."+s.spec.sizeKey)}))),g("div.rl",g("span",A("rc.date")),g("b",V.dateLabel(r))),g("div.rl",g("span",A("rc.total")),g("b",tt(n.pay))),n.tip?g("div.rl",g("span",A("rc.tip")),g("b",tt(n.tip))):null,g("div.rl",g("span",A("rc.paid")),g("b",tt(e))),g("div.rl",g("span",A("cash.change")),g("b",tt(t))),n.claim?g("div.rl.bad",g("span",A("rc.claim")),g("b","\u2212"+tt(n.claim))):null,g("small",A("rc.thanks"))),g("button.btn",{onclick:()=>nu(n)},A("continue"))),g("div#toasts.toasts"))}function nu(n){let e=V.state,t=G.job,i=G.rec,s=t.spec;G=null,V.scene.setTool(null),V.saveGame(),V.checkAchievements(),V.showHub("orders"),n.claim&&bt(A("claim.note",{n:tt(n.claim)}),"warn",6e3),V.lastReplay={spec:s,rec:i}}var Ce=null;function iu(n,e,t){let i=V.scene,s=V.state,r=e.ev.reduce((c,l)=>c+(typeof l=="number"?l:Array.isArray(l)?1:0),0);Ce={spec:n,rec:e,i:0,idle:0,total:r,done:0,c:null,rug:null,speed:Math.max(4,Math.ceil(r/1080)),mul:1,dryK:-1,recorder:null,onClose:t},document.body.classList.add("tl"),V.mode="timelapse",i.setEnv("shop"),i.setLight(11,"clear",!0),i.hud={top:0,bottom:0};let a=()=>{Ce.rug=Ys(n),Ce.c={tools:e.tools,slot:"dry",set:{pressure:.6,temp:0,chem:"shampoo",fast:!1},last:null},Ce.i=0,Ce.idle=0,Ce.done=0,Ce.dryK=-1,Ce.hold=0,i.setView("top"),i.setRug(Ce.rug,Ls(n)),i.resize()};Ce.restart=a,a(),i.setMark(Ds(s&&s.brand||Zr,128,St.ui==="en"?"en":"ar"));let o=!!(window.MediaRecorder&&i.renderer.domElement.captureStream);pt("#ui").replaceChildren(g("div.tl-ui",g("div.tl-bar",ii(0,"clean")),g("div.tl-ctl",g("button.btn.ghost",{onclick:()=>{Ce.mul=Ce.mul===1?2:Ce.mul===2?.5:1,pt("#tl-speed").textContent="\xD7"+Oe(Ce.mul,Ce.mul<1?1:0)},id:"tl-speed"},"\xD71"),g("button.btn.ghost",{onclick:a},"\u21BA"),o?g("button.btn",{id:"tl-rec",onclick:Ix},"\u2B07 "+A("tl.export")):null,g("button.btn.ghost",{onclick:su},"\u2715"))),g("div#toasts.toasts"))}function cf(){if(!Ce)return;let n=V.scene,e=Ce.rec.ev,t=Math.max(1,Math.round(Ce.speed*Ce.mul));for(;t-- >0&&Ce.i<e.length;){let s=e[Ce.i];if(typeof s=="number")eu(Ce.rug,Ce.c,null),Ce.done++,++Ce.idle>=s&&(Ce.idle=0,Ce.i++);else if(Array.isArray(s)){let r=[s[0]/100,s[1]/100];eu(Ce.rug,Ce.c,r),Ce.done++,Ce.i++,Ce.pt=r}else{let r=Object.keys(s)[0];r==="slot"?Ce.c.slot=s[r]:Ce.c.set[r]=s[r],Ce.i++}}if(Ce.i>=e.length)Ce.rec.dry&&Ce.dryK<24?(Ce.dryK>=0&&Ce.hold++%4===0&&vl(Ce.rug,Ce.rec.dry,Ce.dryK,24),(Ce.hold%4===1||Ce.dryK<0)&&Ce.dryK++,n.setTool(null)):Ce.recorder&&Ce.hold++>150&&uf();else if(Ce.pt){let s=Ce.spec.w,r=Ce.spec.h;n.setTool(Ce.c.slot,Ce.pt[0]-s/2,Ce.pt[1]-r/2,!0,0,0,.8)}n.updateMasks();let i=pt(".tl-bar i");i&&(i.style.width=Math.min(100,Ce.done/Math.max(1,Ce.total)*100)+"%")}function Ix(){let n=V.scene.renderer.domElement;try{let e=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"].find(r=>MediaRecorder.isTypeSupported(r)),t=n.captureStream(30),i=[],s=new MediaRecorder(t,{mimeType:e,videoBitsPerSecond:4e6});s.ondataavailable=r=>{r.data.size&&i.push(r.data)},s.onstop=()=>V.download(new Blob(i,{type:e.split(";")[0]}),`rug-empire-timelapse.${e.includes("mp4")?"mp4":"webm"}`),Ce.recorder=s,Ce.restart(),s.start(),pt("#tl-rec").disabled=!0,bt(A("tl.recording"))}catch{bt(A("tl.unsupported"),"warn")}}function uf(){let n=Ce.recorder;Ce.recorder=null;try{n.stop()}catch{}let e=pt("#tl-rec");e&&(e.disabled=!1),bt(A("tl.saved"))}function su(){if(!Ce)return;Ce.recorder&&uf();let n=Ce.onClose;Ce=null,V.scene.setMark(null),document.body.classList.remove("tl"),V.scene.setTool(null),V.scene.resize(),n&&n()}var ff="rugempire.settings",hf="rugempire.gallery",nl="rugempire.replay.",Ai={get(n){try{return localStorage.getItem(n)}catch{return null}},set(n,e){try{return localStorage.setItem(n,e),!0}catch{return!1}},del(n){try{localStorage.removeItem(n)}catch{}}},Px=["first","five","ten","shop","sold","master"],V={state:null,scene:null,mode:"menu",tab:"orders",lastReplay:null,settings:{ui:"ar",dlg:"ar-SD",sub:"off",digits:"latn",sound:!0,quality:1,coach:!0,first:!0},saveSettings(){Ai.set(ff,JSON.stringify(V.settings))},saveGame(){V.state&&Vu(V.state,localStorage)},dateLabel(n){let e=Zd(n);return e.h?`${e.g} \u2022 ${e.h}`:e.g},matLabel(n){return n.inspected||ln(V.state,"fibre")||nn(V.state,"loupe")?A("mat."+n.spec.material):A(kn[n.spec.material].delicate||n.spec.material==="cotton"?"matguess.nat":"matguess.syn")},gallery(){try{return JSON.parse(Ai.get(hf)||"[]")}catch{return[]}},setGallery(n){for(;!Ai.set(hf,JSON.stringify(n))&&n.length>1;)n.splice(n.findIndex(e=>e.score.stars<5)>=0?n.findIndex(e=>e.score.stars<5):0,1)},addGallery(n,e,t,i,s,r,a){if(e.stars<3)return null;let o=V.state,c=ci(o.day),l=V.gallery(),u={id:"r"+Date.now().toString(36),seed:n.spec.seed,spec:n.spec,pattern:n.spec.pattern,material:n.spec.material,sizeCm:{w:Math.round(n.spec.w*100),h:Math.round(n.spec.h*100)},ownership:n.own?"owned":"customer",rugId:n.rugId||null,before:i,after:s,score:{total:e.total,stars:e.stars,clean:e.clean,safety:e.safety,coverage:e.coverage,time:e.time,resources:e.moisture,instr:e.instr,site:e.site},stats:{minutes:Math.round(t.time/6)/10,waterL:Math.round(t.stats.waterL),late:a},customer:n.own?null:{g:n.g,name:n.name,arch:n.arch},completedAt:{gameDay:o.day,season:Di(o.day),gregorian:c.toISOString().slice(0,10),hijri:Qr(c)},status:"gallery"};for(l.push(u);l.length>36;)l.splice(l.findIndex(f=>f.score.stars<5),1);V.setGallery(l);let h=JSON.stringify(r);if(h.length<4e5&&Ai.set(nl+u.id,h)){let f=l.filter(d=>Ai.get(nl+d.id)).map(d=>d.id);for(;f.length>4;)Ai.del(nl+f.shift())}return u},download(n,e){if(window.AndroidBridge&&window.AndroidBridge.saveFile){let i=new FileReader;i.onload=()=>{try{window.AndroidBridge.saveFile(String(i.result).split(",")[1],e,n.type)}catch{bt(A("tl.unsupported"),"warn")}},i.readAsDataURL(n);return}let t=g("a",{href:URL.createObjectURL(n),download:e});document.body.append(t),t.click(),setTimeout(()=>{URL.revokeObjectURL(t.href),t.remove()},2e3)},checkAchievements(){let n=V.state,e=n.ach,t=i=>{e[i]||(e[i]=n.day,bt("\u{1F3C6} "+A("ach."+i),"good",4500),Ht.good())};n.stats.jobs>=1&&t("first"),n.stats.bestScore>=95&&t("five"),n.stats.jobs>=10&&t("ten"),n.premises!=="home"&&t("shop"),n.stats.sold>=1&&t("sold"),Ws(n)>=6&&t("master")},showHub(n){V.mode="hub",n&&(V.tab=n),an()}};function rl(){try{Object.assign(V.settings,JSON.parse(Ai.get(ff)||"{}"))}catch{}kr(V.settings),Jc(V.settings.sound);let n=pt("#gl");try{V.scene=Yd(n),V.scene.setQuality(V.settings.quality)}catch(r){pt("#ui").replaceChildren(g("div.panel",g("h2","WebGL"),g("p",String(r))));return}addEventListener("resize",()=>V.scene.resize());let e=r=>a=>{V.mode==="clean"&&(r==="down"&&(Kc(),n.setPointerCapture(a.pointerId)),af(r,a.clientX,a.clientY),a.preventDefault())};n.addEventListener("pointerdown",e("down")),n.addEventListener("pointermove",e("move")),n.addEventListener("pointerup",e("up")),n.addEventListener("pointercancel",e("up")),document.addEventListener("pointerdown",()=>{jd(),Kc()},{once:!1,passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden&&V.saveGame()}),window.onAndroidBack=()=>{let r=document.querySelector(".modal-wrap");if(r){r.remove();let a=rf();return a&&(a.paused=!1),!0}return V.mode==="timelapse"?(su(),!0):V.mode==="hub"||V.mode==="showroom"||V.mode==="settings"?(Os(),!0):V.mode!=="menu"};let t=performance.now(),i=0,s=r=>{let a=Math.min(.1,(r-t)/1e3);if(t=r,V.mode==="clean"||V.mode==="drying"||V.mode==="result"||V.mode==="timelapse"||V.mode==="show3d"){try{V.mode==="timelapse"?cf():of(a),V.scene.render(a)}catch(o){console.error(o)}V.mode==="clean"&&(i=a>.045?i+1:Math.max(0,i-2),i>90&&V.scene.quality>0&&(i=0,V.settings.quality=V.scene.quality-1,V.scene.setQuality(V.settings.quality),V.saveSettings()))}requestAnimationFrame(s)};requestAnimationFrame(s),V.settings.first?Lx():Os()}function Lx(){V.mode="menu";let n=(e,t,i)=>{Object.assign(V.settings,{ui:e,dlg:t,sub:i,first:!1}),kr(V.settings),V.saveSettings(),Os()};pt("#ui").replaceChildren(g("div.panel.menu",g("img.logo",{src:"logo.webp",alt:"Rug Empire"}),g("h2","\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u063A\u0629 \u2022 Choose language"),g("button.btn",{onclick:()=>n("ar","ar-SD","off")},"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 + \u062D\u0648\u0627\u0631 \u0633\u0648\u062F\u0627\u0646\u064A"),g("button.btn",{onclick:()=>n("ar-SD","ar-SD","off")},"\u0633\u0648\u062F\u0627\u0646\u064A \u0643\u0627\u0645\u0644"),g("button.btn",{onclick:()=>n("ar","ar","off")},"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649"),g("button.btn",{onclick:()=>n("en","ar-SD","en")},"English + Sudanese dialogue (subtitled)"),g("button.btn",{onclick:()=>n("en","en","off")},"English")))}function Os(){V.mode="menu";let n=Wu(localStorage),e=t=>{V.state=t,V.saveGame(),V.showHub("orders"),t.stats.jobs===0&&t.day===1&&Dx()};pt("#ui").replaceChildren(g("div.panel.menu",g("img.logo",{src:"logo.webp",alt:"Rug Empire"}),n?g("button.btn",{onclick:()=>e(n)},A("menu.continue")):null,g("button.btn"+(n?".ghost":""),{onclick:()=>{if(!n)return e(Kr());let t=xn([g("h3",A("menu.newq")),g("p",A("menu.newwarn")),g("div.row",g("button.btn.ghost",{onclick:()=>t.close()},A("cancel")),g("button.btn",{onclick:()=>{t.close(),e(Kr())}},A("menu.start")))])}},n?A("menu.new"):A("menu.start")),g("button.btn.ghost",{onclick:()=>al("work")},"\u{1F5BC} "+A("menu.showroom")),g("button.btn.ghost",{onclick:au},"\u2699 "+A("menu.settings")),g("small.muted",A("menu.note"))),g("div#toasts.toasts"))}function Dx(){let n=xn([g("h3",A("intro.title")),g("div.speech",g("span.av","\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F"),g("div",g("small",A("npc.tayeb")),(()=>{let e=_n("intro.tayeb");return[g("p",{dir:e.rtl?"rtl":"ltr"},e.text),e.sub?g("p.sub",e.sub):null]})())),g("p",A("intro.body")),g("button.btn",{onclick:()=>n.close()},A("intro.go"))])}function au(){V.mode="settings";let n=V.settings,e=()=>{kr(n),V.saveSettings(),V.state&&V.prev==="hub"?V.showHub():Os()},t=(s,r,a)=>g("label.field",g("span",s),g("select",{onchange:o=>{let c=o.target.value;r==="quality"&&(c=+c),r==="sound"&&(c=c==="true"),n[r]=c,kr(n),Jc(n.sound),r==="quality"&&V.scene.setQuality(c),V.saveSettings(),au()}},a.map(([o,c])=>g("option",{value:String(o),selected:String(n[r])===String(o)},c)))),i={ar:"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649","ar-SD":"\u0627\u0644\u0633\u0648\u062F\u0627\u0646\u064A\u0629",en:"English"};pt("#ui").replaceChildren(g("div.panel",g("h2","\u2699 "+A("menu.settings")),t(A("set.ui"),"ui",Yc.map(s=>[s,i[s]])),t(A("set.dlg"),"dlg",Yc.map(s=>[s,i[s]])),t(A("set.sub"),"sub",[["off",A("set.off")],["ar",i.ar],["en",i.en]]),t(A("set.digits"),"digits",[["latn","123"],["arab","\u0661\u0662\u0663"]]),t(A("set.sound"),"sound",[[!0,A("set.on")],[!1,A("set.off")]]),t(A("set.quality"),"quality",[[0,A("set.q0")],[1,A("set.q1")],[2,A("set.q2")]]),g("p.muted",A("set.sample")),Ei({g:"f",name:0},_n("dlg.ask")),g("button.btn",{onclick:e},A("back"))),g("div#toasts.toasts"))}var ou={clear:"\u2600\uFE0F",dust:"\u{1F32A}\uFE0F",rain:"\u{1F327}\uFE0F"};function an(){let n=V.state;V.prev="hub";let e=[["orders","\u{1F4CB}"],["shop","\u{1F6D2}"],["market","\u{1F9F6}"],["business","\u{1F3EA}"]],t=g("div.hub-body");({orders:Fx,shop:Bx,market:kx,business:zx})[V.tab](t,n),pt("#ui").replaceChildren(g("div.hub",g("div.hub-top",g("div.cash","\u{1F4B5} "+tt(n.cash)),g("div.meta",g("span",`${A("hub.day")} ${Oe(n.day)}`),g("span",`${ou[n.today.weather]} ${A("season."+Di(n.day))}`),g("span","\u2B50 "+A("rank."+Ws(n)))),g("div.hub-btns",g("button.icon-btn",{onclick:()=>al("work")},"\u{1F5BC}"),g("button.icon-btn",{onclick:au},"\u2699"),g("button.icon-btn",{onclick:()=>{V.saveGame(),Os()}},"\u23CF"))),t,g("div.tabs",e.map(([i,s])=>g("button"+(i===V.tab?".on":""),{onclick:()=>V.showHub(i)},g("span",s),g("small",A("tab."+i)))))),g("div#toasts.toasts"))}var Nx=n=>(St.ui==="en"?ai[n.g+"En"]:ai[n.g])[n.name],Wr=(n,e=72)=>{let t=Ls(n,96);return t.className="thumb",t.style.width=e+"px",t},il=n=>`${A("size."+n.sizeKey)} ${Oe(n.w,1)}\xD7${Oe(n.h,1)} ${A("unit.m")}`,Ux=n=>`${Oe(Math.floor(n))}:${String(Math.round(n%1*60)).padStart(2,"0")}`;function Fx(n,e){let t=ci(e.day),i=Xs(e.day),s=e.hour>=Ke.dayEnd-1;n.append(g("div.card.day",g("b",V.dateLabel(t)),g("div.chips",g("span.chip","\u{1F550} "+Ux(Math.min(e.hour,23.75))),g("span.chip",ou[e.today.weather]+" "+A("weather."+e.today.weather)),i?g("span.chip.hot","\u{1F319} "+A("occ."+i)):null,e.sp>0?g("span.chip.hot",{onclick:()=>V.showHub("business")},"\u{1F393} "+A("hub.sp",{n:Oe(e.sp)})):null),e.today.weather!=="clear"?g("small",A("weatherd."+e.today.weather)):null,e.today.events.map(r=>g("small.ev","\u2022 "+A("ev."+r))))),e.offers.length&&n.append(g("h3",A("orders.offers")),e.offers.map((r,a)=>{let o=e.rugs.find(c=>c.id===r.rugId);return g("div.card.row",Wr(o.spec,56),g("div.grow",Ei({g:r.g,name:r.buyer},_n(r.haggle?"dlg.buyhaggle":"dlg.buy",{n:tt(r.price)})),g("small.muted",A("market.listed",{n:tt(o.price)}))),g("div.col",g("button.btn.sm",{onclick:()=>{Hu(e,a),Ht.coin(),sl(o),V.saveGame(),V.checkAchievements(),an()}},A("accept")),g("button.btn.sm.ghost",{onclick:()=>{e.offers.splice(a,1),an()}},A("decline"))))})),n.append(g("h3",A("orders.title"))),e.orders.length||n.append(g("p.muted",A("orders.none")));for(let r of e.orders)n.append(g("div.card.row.order",{onclick:()=>ru(r)},Wr(r.spec),g("div.grow",g("b",`${r.g==="m"?"\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F":"\u{1F9D5}\u{1F3FE}"} ${Nx(r)}`),g("small",`${A("arch."+r.arch)} \u2022 ${A("dist."+r.district)}`),g("small",il(r.spec)),g("div.chips",r.rush?g("span.chip.hot","\u23F1 "+A("job.rush")):null,g("span.chip",$o(r.expires,"days")))),g("div.price",g("small",A("orders.offer")),g("b",tt(r.fair)))));n.append(g("button.btn.end",{onclick:Ox},(s?"\u{1F319} ":"")+A("hub.endday"))),V.lastReplay&&n.append(g("button.btn.ghost",{onclick:()=>iu(V.lastReplay.spec,V.lastReplay.rec,()=>V.showHub())},"\u{1F3AC} "+A("showroom.watch")))}function ru(n){let e=V.state,t=kn[n.spec.material],i=Jr(e,n),s=n.fair,r=ln(e,"diagnosis"),a=u=>bn.filter(h=>Ji(e,h)).sort((h,f)=>Yt[f].compat[u]-Yt[h].compat[u])[0],o=_n(n.rush?"dlg.rush":t.delicate?"dlg.delicate":"dlg.ask"),c=g("b",tt(s)),l=xn([Ei(n,o),g("div.info",Wr(n.spec,84),g("div.grow",g("div.rl",g("span",A("job.size")),g("b",il(n.spec))),g("div.rl",g("span",A("job.material")),g("b",V.matLabel(n))),g("div.rl",g("span",A("job.stains")),g("b",n.spec.stains.length?r?n.spec.stains.map(u=>`${A("stain."+u.type)} \u2192 ${A("chem."+a(u.type))}`).join("\u060C "):$o(n.spec.stains.length,"stains"):A("job.nostains"))),g("div.rl",g("span",A("job.dye")),g("b"+(n.tested&&n.spec.unstable?".bad":""),n.tested?A(n.spec.unstable?"job.unstable":"job.stable"):"\u061F")),g("div.rl",g("span",A("job.deadline")),g("b",A("job.hours",{n:Oe(n.deadline)}))),i?g("div.rl",g("span",A("job.travel")),g("b",A("job.hours",{n:Oe(i,2)}))):null)),n.requests.length?g("div.chips",n.requests.map(u=>g("span.chip","\u{1F4CC} "+A("req."+u)))):null,n.tested?null:g("button.btn.ghost.sm",{onclick:()=>{n.tested=!0,n.inspected=!0,e.hour+=.25,l.close(),ru(n),n.spec.unstable&&(Ht.bad(),bt(A("job.unstablewarn"),"warn",6e3))}},"\u{1F9EA} "+A("job.test")),g("div.quote",g("span",A("job.quote")),c,ln(e,"haggle")?g("small",A("job.budget",{n:tt(n.maxBudget)})):g("small",A("job.fair",{n:tt(n.fair)}))),g("input",{type:"range",min:Math.round(n.fair*.6/500)*500,max:Math.round(n.fair*1.7/500)*500,step:500,value:s,oninput:u=>{s=+u.target.value,c.textContent=tt(s)}}),g("div.row",g("button.btn.ghost",{onclick:()=>l.close()},A("back")),g("button.btn.ghost",{onclick:()=>{e.orders=e.orders.filter(u=>u!==n),l.close(),an()}},A("decline")),g("button.btn",{onclick:()=>{if(e.hour>=Ke.dayEnd-1){bt(A("job.toolate"),"warn");return}let u=fl(e,n,s);if(l.close(),u.result==="accept")n.price=u.price,Vr(n);else if(u.result==="leave")df(n);else{let h=xn([Ei(n,_n("dlg.counter",{n:tt(u.price)})),g("div.col",g("button.btn",{onclick:()=>{h.close(),n.price=u.price,Vr(n)}},A("job.takecounter",{n:tt(u.price)})),g("button.btn.ghost",{onclick:()=>{h.close(),fl(e,n,s,!0).result==="accept"?(bt(_n("dlg.fine").text,"good"),n.price=s,Vr(n)):df(n)}},A("job.firm",{n:tt(s)})),g("button.btn.ghost",{onclick:()=>{h.close(),ru(n)}},A("back")))])}}},A("job.offer")))],{dismiss:!0})}function df(n){let e=V.state;e.orders=e.orders.filter(t=>t!==n),e.rep[Gn[n.arch].track]-=.3,Ht.bad(),an(),xn([Ei(n,_n("dlg.leave")),g("button.btn",{onclick:t=>t.target.closest(".modal-wrap").remove()},A("ok"))]),V.saveGame()}function Ox(){let n=V.state,e=xn([g("h3",A("hub.endday")),g("p",A("hub.endq")),g("div.row",g("button.btn.ghost",{onclick:()=>e.close()},A("cancel")),g("button.btn",{onclick:()=>{e.close();let t=Lu(n);V.saveGame(),V.checkAchievements(),an();let i=[];t.staffIncome&&i.push(["rep.staff",t.staffIncome]),t.wages&&i.push(["rep.wages",-t.wages]),t.rent&&i.push(["rep.rent",-t.rent]),t.insurance&&i.push(["rep.insurance",-t.insurance]),t.sandouq&&i.push(["rep.sandouq",-t.sandouq]),t.payout&&i.push(["rep.payout",t.payout]);let s=xn([g("h3",`${A("hub.day")} ${Oe(n.day)}`),g("p",V.dateLabel(ci(n.day))),i.map(([r,a])=>g("div.rl"+(a<0?".bad":""),g("span",A(r)),g("b",(a<0?"\u2212":"+")+tt(Math.abs(a))))),t.rentMissed?g("div.note.bad",A("rep.missed")):null,t.evicted?g("div.note.bad",A("rep.evicted")):null,t.quit?g("div.note.bad",A("rep.quit")):null,g("div.chips",g("span.chip",ou[n.today.weather]+" "+A("weather."+n.today.weather))),n.today.events.map(r=>g("small.ev","\u2022 "+A("ev."+r))),g("button.btn",{onclick:()=>s.close()},A("continue"))])}},A("hub.sleep")))])}function Zi(n,e,t,i){let s=V.state;return g("button.btn.sm"+(s.cash>=n&&e?"":".off"),{onclick:()=>{e&&(t()?(Ht.coin(),V.saveGame(),V.checkAchievements(),an()):(Ht.bad(),bt(A("shop.nocash"),"warn")))}},i||tt(n))}function Bx(n,e){n.append(g("h3",A("shop.supplies")),e.today.events.includes("discount")?g("div.note.good",A("ev.discount")):null);for(let t of bn){let i=Ji(e,t);n.append(g("div.card.row",g("span.big","\u{1F9F4}"),g("div.grow",g("b",A("chem."+t)),g("small",A("chemd."+t)),g("small.muted",`pH ${Oe(Yt[t].ph,Yt[t].ph%1?1:0)} \u2022 ${A("shop.stock",{n:Oe(Math.round(e.stock[t]||0))})}`)),i?Zi(pl(e,t),!0,()=>Du(e,t)):g("small.lock","\u{1F512} "+(t==="acid"?A("shop.needskill"):A("shop.needlevel",{n:Oe(Yt[t].unlock)})))))}n.append(g("h3",A("shop.tools")));for(let t in on)on[t].price&&n.append(g("div.card.row",g("span.big","\u{1F6E0}"),g("div.grow",g("b",A("tool."+t)),g("small",A("toold."+t))),e.tools[t]?g("small.own","\u2713 "+A("shop.owned")):Zi(on[t].price,!0,()=>ml(e,t))));e.tools.rotary&&n.append(g("div.card.row",g("span.big","\u{1F527}"),g("div.grow",g("b",A("shop.service")),ii(e.machine.cond,e.machine.cond>.5?"good":e.machine.cond>.3?"mid":"bad"),g("small",A("shop.serviced"))),Zi(Ke.machineService,e.machine.cond<.95,()=>Nu(e)))),n.append(g("h3",A("shop.gear")));for(let t in zs)n.append(g("div.card.row",g("span.big","\u{1F4E6}"),g("div.grow",g("b",A("gear."+t)),g("small",A("geard."+t))),e.gear[t]?g("small.own","\u2713 "+A("shop.owned")):Zi(zs[t].price,!0,()=>ml(e,t))))}function sl(n){let e=V.gallery(),t=e.find(i=>i.rugId===n.id);t&&(t.status=n.status,t.price=n.soldFor||n.price,V.setGallery(e))}function kx(n,e){if(e.premises==="home"){n.append(g("div.card",g("b",A("market.locked")),g("small",A("market.lockedd"))));return}n.append(g("h3",A("market.buy"))),e.market.length||n.append(g("p.muted",A("market.none")));for(let i of e.market)n.append(g("div.card.row",Wr(i.spec,56),g("div.grow",g("b",`${A("pat."+i.spec.pattern)} \u2022 ${A("mat."+i.spec.material)}`),g("small",il(i.spec)),g("small.muted",A("market.value",{n:tt(i.value)}))),Zi(i.cost,!0,()=>Gu(e,i.id))));n.append(g("h3",A("market.mine")));let t=e.rugs.filter(i=>i.status!=="sold");t.length||n.append(g("p.muted",A("market.empty")));for(let i of t){let s;if(!i.clean)s=g("button.btn.sm",{onclick:()=>{if(e.hour>=Ke.dayEnd-1)return bt(A("job.toolate"),"warn");let r=i.spec.w*i.spec.h;Vr({id:++e.jobNo,own:!0,rugId:i.id,spec:i.spec,requests:[],rush:!1,par:dl(i.spec),waterBudget:Math.round(r*9),deadline:99,value:i.value,arch:"budget",g:"m",name:0,district:"nakheel",inspected:!0})}},A("market.clean"));else if(i.status==="for-sale")s=g("button.btn.sm.ghost",{onclick:()=>{i.status="gallery",sl(i),V.saveGame(),an()}},A("market.unlist"));else{let r=qs(e,i),a=r,o=g("input.price-in",{type:"number",step:500,min:500,value:r,oninput:c=>{a=Math.round(+c.target.value/500)*500}});s=g("div.col",o,g("button.btn.sm",{onclick:()=>{gl(e,i.id,a)&&(sl(i),V.saveGame(),an())}},A("showroom.sell")))}n.append(g("div.card.row",Wr(i.spec,56),g("div.grow",g("b",`${A("pat."+i.spec.pattern)} \u2022 ${A("mat."+i.spec.material)}`),g("small",il(i.spec)),g("small.muted",i.clean?`${"\u2605".repeat(i.stars||1)} \u2022 ${i.status==="for-sale"?A("market.listed",{n:tt(i.price)}):A("market.suggest",{n:tt(qs(e,i))})}`:A("market.dirty",{n:tt(i.cost)}))),s))}}function zx(n,e){let t=St.ui==="en"?"en":"ar",i=g("img.brand",{src:Ds(e.brand,128,t).toDataURL(),alt:""});n.append(g("div.card",i,g("div.rl",g("span",A("biz.rank")),g("b",A("rank."+Ws(e)))),ii(li(e)/(Gs[Math.min(6,Ws(e)+1)]||1)),["household","premium","commercial","community"].map(a=>g("div.rl",g("span",A("track."+a)),g("b",Oe(e.rep[a],1)))),g("div.rl",g("span",A("biz.level")),g("b",`${Oe(e.level)} \u2022 ${Oe(e.xp)}/${Oe(150*(e.level+1))}`)),g("button.btn.sm.ghost",{onclick:Gx},"\u{1F3A8} "+A("biz.brand")))),n.append(g("h3",A("biz.premises")));for(let a in Ke.premises){let o=Ke.premises[a],c=a===e.premises,l=li(e)>=(o.needRep||0);n.append(g("div.card.row",g("span.big",a==="home"?"\u{1F3E0}":a==="stall"?"\u{1F3DA}":a==="workshop"?"\u{1F3ED}":"\u{1F3EC}"),g("div.grow",g("b",A("prem."+a)),g("small",A("premd."+a)),o.rent?g("small.muted",A("biz.rent",{r:tt(o.rent),d:tt(o.deposit),n:Oe(Ke.rentEveryDays)})):null),c?g("small.own","\u2713 "+A("biz.here")+(o.rent?` \u2022 ${A("biz.due",{n:Oe(Math.max(0,e.rentDue-e.day))})}`:"")):a==="home"?null:l?Zi(o.deposit+o.rent,!0,()=>Uu(e,a)):g("small.lock","\u{1F512} "+A("biz.needrep",{n:Oe(o.needRep)}))))}n.append(g("h3",A("biz.staff")));let s=Ke.premises[e.premises].racks;for(let a of["helper","cleaner"])n.append(g("div.card.row",g("span.big",a==="helper"?"\u{1F9D1}\u{1F3FE}\u200D\u{1F527}":"\u{1F477}\u{1F3FE}"),g("div.grow",g("b",A("staff."+a)),g("small",A("staffd."+a,{w:tt(Ke[a+"Wage"])})),e.staff[a]?ii(e.staff[a].skill/100,"good"):null),e.staff[a]?g("button.btn.sm.ghost",{onclick:()=>{delete e.staff[a],V.saveGame(),an()}},A("staff.fire")):s?Zi(Ke[a+"Hire"],!0,()=>Fu(e,a)):g("small.lock","\u{1F512} "+A("staff.need"))));n.append(g("h3",A("biz.finance")));let r=e.sandouq;n.append(g("div.card.row",g("span.big","\u{1F91D}"),g("div.grow",g("b",A("fin.sandouq")),g("small",A("fin.sandouqd",{n:tt(5e4),m:Oe(6),tot:tt(3e5)})),r?g("small.muted",A("fin.sandouqs",{p:Oe(r.paid),m:Oe(r.members),k:Oe(r.turn)})):null),r?g("small.own",r.received?"\u2713 "+A("fin.received"):"\u23F3"):e.premises==="home"?g("small.lock","\u{1F512} "+A("staff.need")):g("button.btn.sm",{onclick:()=>{Bu(e),V.saveGame(),an()}},A("fin.join")))),n.append(g("div.card.row",g("span.big","\u{1F6E1}"),g("div.grow",g("b",A("fin.insurance")),g("small",A("fin.insuranced",{n:tt(Ke.insurance)}))),e.premises==="home"?g("small.lock","\u{1F512} "+A("staff.need")):g("button.btn.sm"+(e.insured?".ghost":""),{onclick:()=>{ku(e),V.saveGame(),an()}},e.insured?A("fin.cancel"):A("fin.buy")))),n.append(g("h3",`${A("biz.skills")} (${Oe(e.sp)})`));for(let a in Pi)n.append(g("div.card.row",g("span.big",{craft:"\u{1F9F5}",business:"\u{1F4BC}",ops:"\u2699\uFE0F"}[Pi[a].tree]),g("div.grow",g("b",A("skill."+a)),g("small",A("skilld."+a))),e.skills[a]?g("small.own","\u2713"):g("button.btn.sm"+(e.sp>=Pi[a].cost?"":".off"),{onclick:()=>{Ou(e,a)?(Ht.good(),V.saveGame(),an()):bt(A("biz.nosp"),"warn")}},"\u{1F393} "+Oe(Pi[a].cost))));n.append(g("h3",A("biz.ach")),g("div.card",Px.map(a=>g("div.rl"+(e.ach[a]?"":".dim"),g("span",(e.ach[a]?"\u{1F3C6} ":"\u25AB ")+A("ach."+a)),g("b",e.ach[a]?`${A("hub.day")} ${Oe(e.ach[a])}`:""))))),n.append(g("h3",A("biz.ledger")),g("div.card.ledger",e.ledger.slice(-25).reverse().map(a=>g("div.rl"+(a.a<0?".bad":""),g("span",`${Oe(a.d)} \u2022 ${A("tx."+a.t)} ${a.r&&a.r[0]==="#"?a.r:""}`),g("b",(a.a<0?"\u2212":"+")+Oe(Math.abs(a.a))),g("small",Oe(a.b))))))}function Gx(){let n=V.state,e={...n.brand},t=g("img.brand"),i=()=>{t.src=Ds(e,128,St.ui==="en"?"en":"ar").toDataURL()},s=(o,c,l,u)=>g("div.seg",g("small",o),Array.from({length:c},(h,f)=>g("button"+(e[l]===f?".on":""),{onclick:d=>{e[l]=f,[...d.target.parentElement.querySelectorAll("button")].forEach((x,b)=>x.classList.toggle("on",b===f)),i()}},u(f))));i();let r=n.stats.jobs===0,a=xn([g("h3","\u{1F3A8} "+A("biz.brand")),t,g("label.field",g("span",A("brand.ar")),g("input",{value:e.nameAr,maxLength:24,dir:"rtl",oninput:o=>{e.nameAr=o.target.value,i()}})),g("label.field",g("span",A("brand.en")),g("input",{value:e.nameEn,maxLength:24,dir:"ltr",oninput:o=>{e.nameEn=o.target.value,i()}})),s(A("brand.icon"),Br.length,"icon",o=>Br[o]),s(A("brand.palette"),Li.length,"palette",o=>g("i.sw",{style:{background:`linear-gradient(135deg, ${Li[o][0]} 50%, ${Li[o][2]} 50%)`}})),s(A("brand.sign"),3,"sign",o=>["\u25A2","\u2B2D","\u25AD"][o]),g("div.row",g("button.btn.ghost",{onclick:()=>a.close()},A("cancel")),g("button.btn",{onclick:()=>{zu(n,e,r)?(a.close(),V.saveGame(),an()):bt(A("shop.nocash"),"warn")}},r?A("save"):`${A("save")} \u2022 ${tt(Ke.rebrandFee)}`))])}function al(n){V.mode="showroom";let e=V.gallery().reverse(),t=()=>V.state&&V.prev==="hub"?V.showHub():Os(),i=["work","market","wardrobe","community"],s=g("div.hub-body");if(n==="work"||n==="market"){let r=n==="market"?e.filter(l=>l.ownership==="owned"):e,a=r.filter(l=>l.score.stars===5),o=r.filter(l=>l.score.stars<5),c=l=>g("button.gcard"+(l.score.stars===5?".gold":""),{onclick:()=>pf(l,n)},g("img",{src:l.after,alt:""}),g("span.stars","\u2605".repeat(l.score.stars)),l.status==="sold"?g("span.sold",A("showroom.sold")):l.status==="for-sale"?g("span.sale",tt(l.price)):null);r.length||s.append(g("p.muted.center",A(n==="market"?"showroom.nomarket":"showroom.empty"))),a.length&&s.append(g("h3.goldh","\u2726 "+A("showroom.golden")),g("div.grid",a.map(c))),o.length&&s.append(a.length?g("h3",A("showroom.myWork")):null,g("div.grid",o.map(c)))}else s.append(g("div.card",g("b",A("showroom."+n)),g("small",A("showroom."+n+"d"))));pt("#ui").replaceChildren(g("div.hub.hall",g("div.hub-top",g("div.cash","\u{1F5BC} "+A("showroom.title")),g("div.meta",g("span",$o(e.length,"rugs"))),g("div.hub-btns",g("button.icon-btn",{onclick:t},"\u2715"))),s,g("div.tabs",i.map(r=>g("button"+(r===n?".on":""),{onclick:()=>al(r)},g("span",{work:"\u{1F5BC}",market:"\u{1F4B0}",wardrobe:"\u{1F454}",community:"\u{1F30D}"}[r]),g("small",A("showroom."+(r==="work"?"myWork":r))))))),g("div#toasts.toasts"))}function pf(n,e){let t=V.scene;V.mode="show3d";let i=Ys({...n.spec,dust:0,soil:0,deep:0,stains:[]});for(let u=0;u<i.n;u++)i.napX[u]=0,i.napY[u]=.8;t.setEnv("hall"),t.setLight(12,"clear",!0),t.setView("show"),t.setTool(null),t.setRug(i,Ls(n.spec)),t.resize();let s=Ai.get(nl+n.id),r=V.state,a=r&&n.rugId?r.rugs.find(u=>u.id===n.rugId):null,o=n.customer?(St.ui==="en"?ai[n.customer.g+"En"]:ai[n.customer.g])[n.customer.name]:null,c=new Date(n.completedAt.gregorian+"T00:00:00Z"),l=()=>al(e);pt("#ui").replaceChildren(g("div.show-card",g("div.row",g("b.grow",`${A("pat."+n.pattern)} \u2022 ${A("mat."+n.material)}`),g("span.stars","\u2605".repeat(n.score.stars)),g("button.icon-btn",{onclick:l},"\u2715")),g("small",`${Oe(n.sizeCm.w)}\xD7${Oe(n.sizeCm.h)} ${A("unit.cm")} \u2022 ${A("showroom.score",{n:Oe(n.score.total)})} \u2022 ${Oe(n.stats.minutes,1)} ${A("unit.min")} \u2022 ${Oe(n.stats.waterL)} ${A("unit.l")}`),g("small.muted",`${V.dateLabel(c)} \u2022 ${A("hub.day")} ${Oe(n.completedAt.gameDay)} \u2022 ${A("season."+n.completedAt.season)}`),o?g("small",`${A("showroom.customer")}: ${o} \u2014 ${A("story."+n.customer.arch)}`):g("small",A("showroom.owned")),tu(n.before,n.after,n.spec),g("div.row",s?g("button.btn.sm",{onclick:()=>{try{iu(n.spec,JSON.parse(s),()=>pf(n,e))}catch{bt(A("tl.unsupported"),"warn")}}},"\u{1F3AC} "+A("showroom.watch")):null,a&&a.clean&&a.status==="gallery"?g("button.btn.sm",{onclick:()=>{gl(r,a.id,qs(r,a)),sl(a),V.saveGame(),bt(A("market.listed",{n:tt(a.price)}),"good"),l()}},"\u{1F4B0} "+A("showroom.sell")):null,n.status==="sold"?g("span.sold",A("showroom.sold")):null)),g("div#toasts.toasts"))}document.fonts&&document.fonts.ready?document.fonts.ready.then(rl,rl):rl();"serviceWorker"in navigator&&location.protocol==="https:"&&!window.AndroidBridge&&navigator.serviceWorker.register("sw.js").catch(()=>{});})();
