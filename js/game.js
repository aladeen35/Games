/* ============================================================
   الخرطوم — عالم مفتوح 🇸🇩
   لعبة ثلاثية الأبعاد بشخصية «علاء الدين» تتجول في مدينة الخرطوم:
   المقرن، جزيرة توتي، برج الفاتح، أم درمان، بحري وغيرها.
   التحكم: لمس على الهاتف، أسهم/WASD على الحاسوب.
   ============================================================ */
(function () {
  'use strict';

  // ================= أدوات مساعدة =================
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(19560101); // تاريخ استقلال السودان كبذرة عشوائية
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function lerpAngle(a, b, t) {
    let d = (b - a) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return a + d * t;
  }
  const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // ================= المشهد والكاميرا =================
  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xefcb9c, 140, 950);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2200);

  // إضاءة عصر ذهبي خرطومي
  const hemi = new THREE.HemisphereLight(0xd8e8f5, 0xc09a68, 1.0);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe3b3, 1.5);
  sun.position.set(220, 300, 140);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -150; sun.shadow.camera.right = 150;
  sun.shadow.camera.top = 150; sun.shadow.camera.bottom = -150;
  sun.shadow.camera.near = 30; sun.shadow.camera.far = 800;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  scene.add(sun);
  scene.add(sun.target);
  scene.add(new THREE.AmbientLight(0x6a5238, 0.5));

  // رياح مشتركة لتحريك الماء وأوراق الشجر (عبر إزاحة رؤوس في الـ GPU)
  const windU = { value: 0 };
  function addWaterWind(mat, amp) {
    mat.onBeforeCompile = sh => {
      sh.uniforms.uT = windU;
      sh.vertexShader = 'uniform float uT;\n' + sh.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' +
        // إزاحة موجبة فقط حتى لا يهبط الماء تحت مستوى الأرض
        'transformed.z += (sin(uT*1.4 + position.x*0.12 + position.y*0.2) + sin(uT*2.3 + position.y*0.31) + 2.0) * ' + amp + ';'
      );
    };
  }
  function addLeafWind(mat, amp, weightExpr) {
    mat.onBeforeCompile = sh => {
      sh.uniforms.uT = windU;
      sh.vertexShader = 'uniform float uT;\n' + sh.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' +
        'vec4 iw = instanceMatrix * vec4(position, 1.0);\n' +
        'float wamt = ' + weightExpr + ';\n' +
        'transformed.x += sin(uT*1.8 + iw.x*0.2 + iw.z*0.17) * ' + amp + ' * wamt;\n' +
        'transformed.z += cos(uT*1.5 + iw.x*0.15 + iw.z*0.11) * ' + amp + ' * 0.7 * wamt;'
      );
    };
  }

  // قبة السماء المتدرجة
  (function makeSky() {
    const geo = new THREE.SphereGeometry(1900, 24, 12);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(0x6fa8cf) },
        mid: { value: new THREE.Color(0xf3cf9d) },
        bot: { value: new THREE.Color(0xe9b87e) }
      },
      vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader:
        'varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;\n' +
        'void main(){ float h=normalize(vP).y; vec3 c = h>0.12 ? mix(mid,top,smoothstep(0.12,0.65,h)) : mix(bot,mid,smoothstep(-0.15,0.12,h)); gl_FragColor=vec4(c,1.0); }'
    });
    scene.add(new THREE.Mesh(geo, mat));
    // قرص الشمس
    const sunBall = new THREE.Mesh(
      new THREE.SphereGeometry(38, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff0c8, fog: false })
    );
    sunBall.position.set(900, 520, 620);
    scene.add(sunBall);
  })();

  // غيوم بسيطة تنجرف
  const clouds = [];
  (function makeClouds() {
    const mat = new THREE.MeshBasicMaterial({ color: 0xfff6e8, transparent: true, opacity: 0.85, fog: false });
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      const n = 3 + Math.floor(rng() * 3);
      for (let j = 0; j < n; j++) {
        const s = 14 + rng() * 22;
        const m = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 6), mat);
        m.position.set((rng() - 0.5) * 60, (rng() - 0.5) * 8, (rng() - 0.5) * 26);
        m.scale.y = 0.42;
        g.add(m);
      }
      g.position.set((rng() - 0.5) * 1600, 260 + rng() * 120, (rng() - 0.5) * 1600);
      scene.add(g);
      clouds.push(g);
    }
  })();

  // ================= خامات مرسومة (Canvas) =================
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  // رمل
  const sandTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#d8bd92'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const v = 165 + (rng() * 50 | 0);
      g.fillStyle = 'rgba(' + v + ',' + (v - 35) + ',' + (v - 75) + ',0.35)';
      g.fillRect(rng() * w, rng() * h, 1.4, 1.4);
    }
  });
  sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping;
  sandTex.repeat.set(160, 160);

  // ماء (لمعان متحرك)
  function waterTex() {
    const t = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 240; i++) {
        g.strokeStyle = 'rgba(210,235,250,' + (0.10 + rng() * 0.25) + ')';
        g.lineWidth = 1 + rng() * 2;
        const y = rng() * h;
        g.beginPath(); g.moveTo(rng() * w, y); g.lineTo(rng() * w, y + (rng() - 0.5) * 6); g.stroke();
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  const waterTextures = [];
  function waterMat(color, rx, ry) {
    const t = waterTex();
    t.repeat.set(rx, ry);
    waterTextures.push(t);
    return new THREE.MeshStandardMaterial({ color, map: t, roughness: 0.35, metalness: 0.08 });
  }

  // نسيج قماش الجلابية (خيوط رأسية دقيقة وحبيبات)
  const clothTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 3) {
      g.strokeStyle = 'rgba(120,110,100,' + (0.05 + rng() * 0.06) + ')';
      g.beginPath(); g.moveTo(x + rng() * 2, 0); g.lineTo(x + rng() * 2, h); g.stroke();
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = 'rgba(90,80,70,' + (rng() * 0.07) + ')';
      g.fillRect(rng() * w, rng() * h, 1.6, 1.6);
    }
  });
  clothTex.wrapS = clothTex.wrapT = THREE.RepeatWrapping;
  clothTex.repeat.set(2.5, 2.5);

  // نوافذ المباني
  const buildingTexCache = {};
  function buildingTex(base, cols, rows, lit) {
    const key = base + '_' + cols + '_' + rows;
    if (buildingTexCache[key]) return buildingTexCache[key];
    const t = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      const cw = w / cols, ch = h / rows;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        g.fillStyle = (rng() < (lit === undefined ? 0.16 : lit)) ? '#ffd47e' : 'rgba(88,104,126,0.8)';
        g.fillRect(i * cw + cw * 0.24, j * ch + ch * 0.22, cw * 0.52, ch * 0.5);
        // إطار نافذة فاتح
        g.strokeStyle = 'rgba(250,245,230,0.5)';
        g.lineWidth = 2;
        g.strokeRect(i * cw + cw * 0.24, j * ch + ch * 0.22, cw * 0.52, ch * 0.5);
      }
    });
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    buildingTexCache[key] = t;
    return t;
  }

  // طاقية علاء الدين: بيضاء بنقاط وشريط مزخرف وشعار
  const taqiyahTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#f7f2e6'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c9ad7d';
    for (let y = 14; y < h - 74; y += 17) {
      const off = ((y / 17) | 0) % 2 ? 8 : 0;
      for (let x = off; x < w; x += 17) { g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); }
    }
    // شريط مربعات أسفل الطاقية
    for (let x = 0; x < w; x += 16) {
      g.fillStyle = (x / 16) % 2 ? '#b3925e' : '#e8dcc2';
      g.fillRect(x, h - 58, 16, 14);
      g.fillStyle = (x / 16) % 2 ? '#e8dcc2' : '#b3925e';
      g.fillRect(x, h - 44, 16, 14);
    }
    // شعار درع صغير في الأمام
    g.strokeStyle = '#a8895a'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(256, 30); g.quadraticCurveTo(288, 34, 288, 62);
    g.quadraticCurveTo(288, 92, 256, 106); g.quadraticCurveTo(224, 92, 224, 62);
    g.quadraticCurveTo(224, 34, 256, 30); g.stroke();
    g.lineWidth = 3;
    g.beginPath(); g.arc(256, 64, 14, 0, 7); g.stroke();
    g.beginPath(); g.arc(256, 64, 7, 0, 7); g.stroke();
  });

  // علم السودان
  const flagTex = canvasTex(300, 200, (g, w, h) => {
    g.fillStyle = '#d21034'; g.fillRect(0, 0, w, h / 3);
    g.fillStyle = '#ffffff'; g.fillRect(0, h / 3, w, h / 3);
    g.fillStyle = '#000000'; g.fillRect(0, 2 * h / 3, w, h / 3);
    g.fillStyle = '#007229';
    g.beginPath(); g.moveTo(w, 0); g.lineTo(w - 110, h / 2); g.lineTo(w, h); g.closePath(); g.fill(); // المثلث جهة السارية (يمين لأن الخامة ستُعكس)
  });

  // مظلات السوق المخططة
  function canopyTex(c1, c2) {
    const t = canvasTex(128, 128, (g, w, h) => {
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? c1 : c2; g.fillRect(i * 16, 0, 16, h); }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  // ================= تخطيط المدينة: الماء والكباري =================
  // النيل الأزرق يفصل الخرطوم عن بحري، والنيل الأبيض يفصلها عن أم درمان،
  // ويلتقيان عند المقرن حول جزيرة توتي ثم يتجه النيل شمالاً (قطرياً).
  const BRIDGES = [
    { x1: -205, x2: -95, z1: 92, z2: 108, name: 'كبري النيل الأبيض' },
    { x1: 92, x2: 108, z1: -205, z2: -95, name: 'كبري المك نمر' },
    { x1: -405, x2: -195, z1: -308, z2: -292, name: 'كبري شمبات' }
  ];
  const TUTI = { x: -150, z: -150, r: 52 };
  // كبري توتي: قطري من الجزيرة إلى ضفة الخرطوم عند المقرن
  // المعادلة: نطاق (x+z) على طول الجسر، و|x−z| نصف عرضه
  const TUTI_BR = { sMin: -242, sMax: -158, dMax: 10 };

  function onBridge(x, z) {
    const s = x + z, d = Math.abs(x - z);
    if (s >= TUTI_BR.sMin && s <= TUTI_BR.sMax && d <= TUTI_BR.dMax) return true;
    for (let i = 0; i < BRIDGES.length; i++) {
      const b = BRIDGES[i];
      if (x >= b.x1 && x <= b.x2 && z >= b.z1 && z <= b.z2) return true;
    }
    return false;
  }
  function isWater(x, z) {
    if (onBridge(x, z)) return false;
    if (Math.hypot(x - TUTI.x, z - TUTI.z) < TUTI.r) return false;       // جزيرة توتي يابسة
    if (x >= -195 && x <= -105 && z >= -195 && z <= 705) return true;    // النيل الأبيض
    if (z >= -195 && z <= -105 && x >= -195 && x <= 705) return true;    // النيل الأزرق
    if (Math.hypot(x + 150, z + 150) <= 85) return true;                 // بحيرة المقرن حول توتي
    if (x + z <= -290 && Math.abs(x - z) <= 90 && x + z >= -1500) return true; // النيل الموحد شمالاً
    return false;
  }

  // مجسمات الماء
  const blueNile = waterMat(0x3d88b0, 24, 3);
  const whiteNile = waterMat(0x84a5b0, 3, 24);
  const mainNile = waterMat(0x5b93af, 20, 4);
  // موجات خفيفة على سطح النيل
  addWaterWind(whiteNile, 0.035);
  addWaterWind(blueNile, 0.035);
  addWaterWind(mainNile, 0.035);
  (function buildWater() {
    // الماء أعلى من الأرض بقليل (طبقات مرتبة لتفادي التذبذب البصري)
    let m = new THREE.Mesh(new THREE.PlaneGeometry(90, 900, 5, 50), whiteNile);
    m.rotation.x = -Math.PI / 2; m.position.set(-150, 0.03, 255); scene.add(m);
    m = new THREE.Mesh(new THREE.PlaneGeometry(900, 90, 50, 5), blueNile);
    m.rotation.x = -Math.PI / 2; m.position.set(255, 0.032, -150); scene.add(m);
    m = new THREE.Mesh(new THREE.CircleGeometry(85, 48), mainNile);
    m.rotation.x = -Math.PI / 2; m.position.set(-150, 0.045, -150); scene.add(m);
    m = new THREE.Mesh(new THREE.PlaneGeometry(128, 800, 7, 45), mainNile);
    m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI / 4;
    m.position.set(-425, 0.02, -425); scene.add(m);
  })();

  // الأرض الرملية (لوح واحد كبير)
  (function buildGround() {
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshStandardMaterial({ map: sandTex, color: 0xdec49b, roughness: 1 })
    );
    g.rotation.x = -Math.PI / 2;
    g.position.y = 0;
    scene.add(g);
  })();

  // جزيرة توتي: خضراء بمزارع
  (function buildTuti() {
    const isl = new THREE.Mesh(
      new THREE.CircleGeometry(TUTI.r, 36),
      new THREE.MeshStandardMaterial({ color: 0x8aa85e, roughness: 1 })
    );
    isl.rotation.x = -Math.PI / 2; isl.position.set(TUTI.x, 0.07, TUTI.z);
    scene.add(isl);
    // حقول خضراء
    for (let i = 0; i < 6; i++) {
      const f = new THREE.Mesh(
        new THREE.PlaneGeometry(10 + rng() * 8, 7 + rng() * 6),
        new THREE.MeshStandardMaterial({ color: [0x5d8f3d, 0x6da04a, 0x4f7f35][i % 3], roughness: 1 })
      );
      f.rotation.x = -Math.PI / 2;
      f.rotation.z = rng() * Math.PI;
      const a = rng() * Math.PI * 2, d = 14 + rng() * 26;
      f.position.set(TUTI.x + Math.cos(a) * d, 0.1, TUTI.z + Math.sin(a) * d);
      scene.add(f);
    }
  })();

  // ================= الطرق =================
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x7d7870, roughness: 0.9 });
  const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xd8cfa8 });
  function addRoad(x, z, w, len, horizontal) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(horizontal ? len : w, horizontal ? w : len), roadMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.08, z);
    scene.add(m);
    // خط منتصف متقطع
    const n = Math.floor(len / 14);
    for (let i = 0; i < n; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(horizontal ? 6 : 0.5, horizontal ? 0.5 : 6), roadLineMat);
      s.rotation.x = -Math.PI / 2;
      const off = -len / 2 + 7 + i * 14;
      s.position.set(horizontal ? x + off : x, 0.095, horizontal ? z : z + off);
      scene.add(s);
    }
  }
  (function buildRoads() {
    // شبكة الخرطوم (من شارعي الضفتين وحتى شرق المدينة)
    for (let i = 0; i <= 4; i++) addRoad(226, i * 100, 12, 648, true);   // أفقية z=0..400
    for (let i = 0; i <= 4; i++) addRoad(i * 100, 226, 12, 648, false);  // رأسية x=0..400
    addRoad(275, -98, 10, 760, true);    // شارع النيل (ضفة النيل الأزرق)
    addRoad(-98, 300, 10, 810, false);   // شارع ضفة النيل الأبيض
    // أم درمان
    addRoad(-445, 0, 12, 460, true);
    addRoad(-445, 100, 12, 460, true);
    addRoad(-330, 100, 12, 420, false);
    addRoad(-480, 60, 12, 340, false);
    // بحري
    addRoad(157, -300, 12, 706, true);
    addRoad(100, -370, 12, 350, false);
    addRoad(-300, -370, 10, 150, false); // وصلة شمبات جنوب بحري الغربية
  })();

  // ================= التصادم =================
  const colliders = []; // {x, z, hw, hd}
  function addCollider(x, z, hw, hd) { colliders.push({ x, z, hw, hd }); }
  function collideCircle(x, z, r) {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (Math.abs(x - c.x) < c.hw + r && Math.abs(z - c.z) < c.hd + r) return true;
    }
    return false;
  }
  function tryMove(pos, dx, dz, r) {
    // محاولة الحركة محورًا محورًا للانزلاق على الجدران
    let nx = pos.x + dx;
    if (!collideCircle(nx, pos.z, r) && !isWater(nx, pos.z) && Math.abs(nx) < 690) pos.x = nx;
    let nz = pos.z + dz;
    if (!collideCircle(pos.x, nz, r) && !isWater(pos.x, nz) && Math.abs(nz) < 690) pos.z = nz;
  }

  // ================= الكباري (مجسمات) =================
  (function buildBridges() {
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x9a958b, roughness: 0.9 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x7fa8c0, roughness: 0.5, metalness: 0.45 });
    const pierMat = new THREE.MeshStandardMaterial({ color: 0xa8a198, roughness: 1 });
    BRIDGES.forEach(b => {
      const w = b.x2 - b.x1, d = b.z2 - b.z1;
      const cx = (b.x1 + b.x2) / 2, cz = (b.z1 + b.z2) / 2;
      const horizontal = w > d;
      const len = horizontal ? w : d, wid = horizontal ? d : w;
      const deck = new THREE.Mesh(new THREE.BoxGeometry(horizontal ? len : wid, 0.6, horizontal ? wid : len), deckMat);
      deck.position.set(cx, 0.05, cz);
      scene.add(deck);
      // درابزين نحيف
      for (const s of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(horizontal ? len : 0.22, 0.5, horizontal ? 0.22 : len), railMat);
        rail.position.set(
          horizontal ? cx : cx + s * (wid / 2 - 0.3),
          0.95,
          horizontal ? cz + s * (wid / 2 - 0.3) : cz
        );
        scene.add(rail);
      }
      // أعمدة تحت السطح
      const n = Math.max(2, Math.floor(len / 34));
      for (let i = 1; i < n; i++) {
        const t = -len / 2 + (len / n) * i;
        const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 4, 8), pierMat);
        pier.position.set(horizontal ? cx + t : cx, -1.6, horizontal ? cz : cz + t);
        scene.add(pier);
      }
    });

    // ---- كبري توتي القطري (معلّق نحو ضفة الخرطوم) ----
    const cX = (TUTI_BR.sMin + TUTI_BR.sMax) / 4; // مركز الجسر عند x=z=-100
    const tLen = (TUTI_BR.sMax - TUTI_BR.sMin) / Math.SQRT2 + 6;
    const dirX = Math.SQRT1_2, dirZ = Math.SQRT1_2;       // اتجاه الجسر
    const perpX = Math.SQRT1_2, perpZ = -Math.SQRT1_2;    // العمودي عليه
    const tDeck = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, tLen), deckMat);
    tDeck.rotation.y = Math.PI / 4;
    tDeck.position.set(cX, 0.05, cX);
    scene.add(tDeck);
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, tLen), railMat);
      rail.rotation.y = Math.PI / 4;
      rail.position.set(cX + s * perpX * 6.6, 0.95, cX + s * perpZ * 6.6);
      scene.add(rail);
      // برج كوابل في المنتصف
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 19, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.5, roughness: 0.4 }));
      pylon.position.set(cX + s * perpX * 7.3, 9.5, cX + s * perpZ * 7.3);
      scene.add(pylon);
      const cableMat2 = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.4, roughness: 0.4 });
      for (let i = 1; i <= 3; i++) {
        for (const dd of [-1, 1]) {
          const ax = cX + s * perpX * 7.3, az = cX + s * perpZ * 7.3;
          const bx = ax + dd * dirX * i * 9, bz = az + dd * dirZ * i * 9;
          const a = new THREE.Vector3(ax, 18.2, az), b = new THREE.Vector3(bx, 1.1, bz);
          const cl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, a.distanceTo(b), 4), cableMat2);
          cl.position.copy(a).add(b).multiplyScalar(0.5);
          cl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
          scene.add(cl);
        }
      }
    }
  })();

  // ================= لافتات المعالم =================
  function makeLabel(text, x, y, z, scale) {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 220;
    const g = c.getContext('2d');
    g.font = 'bold 96px "Segoe UI", Tahoma, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 14; g.strokeStyle = 'rgba(30,20,8,0.9)';
    g.strokeText(text, 512, 110);
    g.fillStyle = '#ffe9bd';
    g.fillText(text, 512, 110);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true }));
    sp.scale.set((scale || 1) * 26, (scale || 1) * 5.6, 1);
    sp.position.set(x, y, z);
    sp.renderOrder = 5;
    scene.add(sp);
    return sp;
  }

  // ================= المعالم =================
  const LANDMARKS = [
    { name: 'المقرن — ملتقى النيلين', x: -35, z: -35, r: 48 },
    { name: 'برج الفاتح', x: 45, z: -62, r: 42 },
    { name: 'القصر الجمهوري', x: 160, z: -62, r: 40 },
    { name: 'جامعة الخرطوم', x: 310, z: -62, r: 40 },
    { name: 'الجامع الكبير', x: 150, z: 150, r: 45 },
    { name: 'السوق العربي', x: 50, z: 150, r: 42 },
    { name: 'جزيرة توتي', x: -150, z: -150, r: 55 },
    { name: 'مسجد النيلين', x: -240, z: -120, r: 40 },
    { name: 'قبة الإمام المهدي', x: -350, z: -40, r: 42 },
    { name: 'سوق أم درمان', x: -390, z: 60, r: 45 },
    { name: 'استاد المريخ', x: -310, z: 190, r: 45 },
    { name: 'استاد الهلال', x: -450, z: 190, r: 45 }
  ];

  // ---- برج الفاتح (شكل بيضاوي زجاجي) ----
  (function fatehTower() {
    const pts = [];
    const prof = [[0.5, 0], [10, 3], [13.5, 14], [12.5, 34], [8.5, 52], [3.5, 64], [0.6, 70]];
    prof.forEach(p => pts.push(new THREE.Vector2(p[0], p[1])));
    const tower = new THREE.Mesh(
      new THREE.LatheGeometry(pts, 26),
      new THREE.MeshStandardMaterial({ color: 0xa8cce4, roughness: 0.25, metalness: 0.2 })
    );
    tower.position.set(45, 0, -62);
    scene.add(tower);
    const podium = new THREE.Mesh(new THREE.CylinderGeometry(17, 18, 4, 20),
      new THREE.MeshStandardMaterial({ color: 0xd9cdb8, roughness: 0.8 }));
    podium.position.set(45, 2, -62);
    scene.add(podium);
    addCollider(45, -62, 16, 16);
    makeLabel('برج الفاتح', 45, 78, -62, 1.1);
  })();

  // ---- القصر الجمهوري + علم ----
  const flags = [];
  function addFlag(x, z, h) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, h, 6),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.4 }));
    pole.position.set(x, h / 2, z);
    scene.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3),
      new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide }));
    flag.position.set(x - 2.3, h - 1.8, z);
    scene.add(flag);
    flags.push(flag);
  }
  (function palace() {
    const mat = new THREE.MeshStandardMaterial({ map: buildingTex('#f2ece0', 12, 3), roughness: 0.8 });
    const main = new THREE.Mesh(new THREE.BoxGeometry(52, 13, 20), mat);
    main.position.set(160, 6.5, -62);
    scene.add(main);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(6, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x3f7f5f, roughness: 0.4, metalness: 0.3 }));
    dome.position.set(160, 13, -62);
    scene.add(dome);
    addCollider(160, -62, 27, 11);
    addFlag(160, -78, 14);
    makeLabel('القصر الجمهوري', 160, 25, -62, 0.9);
  })();

  // ---- جامعة الخرطوم (طوب أحمر وبرج ساعة) ----
  (function university() {
    const brick = new THREE.MeshStandardMaterial({ map: buildingTex('#9c4f38', 10, 3), roughness: 0.9 });
    const main = new THREE.Mesh(new THREE.BoxGeometry(50, 11, 18), brick);
    main.position.set(310, 5.5, -62);
    scene.add(main);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xa85a40, roughness: 0.9 });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(8, 26, 8), towerMat);
    tower.position.set(310, 13, -62);
    scene.add(tower);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(6.4, 5, 4),
      new THREE.MeshStandardMaterial({ color: 0x6d4a3a, roughness: 0.9 }));
    roof.position.set(310, 28.5, -62);
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);
    // ساعة
    const clockT = canvasTex(128, 128, (g) => {
      g.fillStyle = '#f6f1e2'; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.fill();
      g.strokeStyle = '#3a2f22'; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 24); g.stroke();
      g.beginPath(); g.moveTo(64, 64); g.lineTo(92, 72); g.stroke();
    });
    for (const [dx, dz, ry] of [[0, 4.05, 0], [0, -4.05, Math.PI], [4.05, 0, Math.PI / 2], [-4.05, 0, -Math.PI / 2]]) {
      const cm = new THREE.Mesh(new THREE.PlaneGeometry(5, 5),
        new THREE.MeshBasicMaterial({ map: clockT, transparent: true }));
      cm.position.set(310 + dx, 21, -62 + dz);
      cm.rotation.y = ry;
      scene.add(cm);
    }
    addCollider(310, -62, 26, 10);
    makeLabel('جامعة الخرطوم', 310, 36, -62, 0.95);
  })();

  // ---- الجامع الكبير ----
  function crescent(x, y, z, s) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(s, s * 0.16, 6, 16, Math.PI * 1.6),
      new THREE.MeshStandardMaterial({ color: 0xe8c25a, metalness: 0.35, roughness: 0.3, emissive: 0x6a4a10, emissiveIntensity: 0.4 }));
    c.position.set(x, y, z);
    c.rotation.z = Math.PI * 0.7;
    scene.add(c);
  }
  (function grandMosque() {
    const stone = new THREE.MeshStandardMaterial({ color: 0xe3d3b0, roughness: 0.85 });
    const hall = new THREE.Mesh(new THREE.BoxGeometry(42, 10, 28), stone);
    hall.position.set(150, 5, 150);
    scene.add(hall);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x2f8f63, roughness: 0.35, metalness: 0.25 }));
    dome.position.set(150, 10, 150);
    scene.add(dome);
    crescent(150, 22.5, 150, 1.4);
    // مئذنة
    const minaret = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.4, 30, 10), stone);
    minaret.position.set(175, 15, 138);
    scene.add(minaret);
    const balc = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 1.4, 10), stone);
    balc.position.set(175, 26, 138);
    scene.add(balc);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4, 10),
      new THREE.MeshStandardMaterial({ color: 0x2f8f63, roughness: 0.4 }));
    cap.position.set(175, 32.5, 138);
    scene.add(cap);
    crescent(175, 35.6, 138, 0.9);
    addCollider(150, 150, 22, 15);
    addCollider(175, 138, 3, 3);
    makeLabel('الجامع الكبير', 150, 30, 150, 0.95);
  })();

  // ---- مسجد النيلين (القبة المضلعة الشهيرة) ----
  (function nilainMosque() {
    // مقطع دوراني متموج يعطي شكل القبة المتفتحة
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = 16 * Math.sin(Math.PI * 0.5 + t * Math.PI * 0.5) * (1 + 0.06 * Math.sin(t * 26));
      pts.push(new THREE.Vector2(Math.max(0.2, r), t * 14));
    }
    const dome = new THREE.Mesh(new THREE.LatheGeometry(pts, 36),
      new THREE.MeshStandardMaterial({ color: 0xf3efe6, roughness: 0.55 }));
    dome.position.set(-240, 0, -120);
    scene.add(dome);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(17.5, 18, 2.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xd8cbb2, roughness: 0.9 }));
    base.position.set(-240, 1.2, -120);
    scene.add(base);
    crescent(-240, 16.5, -120, 1.1);
    addCollider(-240, -120, 17, 17);
    makeLabel('مسجد النيلين', -240, 24, -120, 0.95);
  })();

  // ---- قبة الإمام المهدي (الفضية المدببة) ----
  (function mahdiTomb() {
    const tan = new THREE.MeshStandardMaterial({ color: 0xd9c49a, roughness: 0.9 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(24, 9, 24), tan);
    base.position.set(-350, 4.5, -40);
    scene.add(base);
    // بصلة مدببة
    const pts = [];
    const prof = [[0.2, 0], [8.5, 2], [10.5, 7], [8, 14], [4, 20], [1.2, 26], [0.2, 29]];
    prof.forEach(p => pts.push(new THREE.Vector2(p[0], p[1])));
    const dome = new THREE.Mesh(new THREE.LatheGeometry(pts, 24),
      new THREE.MeshStandardMaterial({ color: 0xd5dce2, metalness: 0.3, roughness: 0.3 }));
    dome.position.set(-350, 9, -40);
    scene.add(dome);
    crescent(-350, 40, -40, 1.0);
    // قباب صغيرة بالأركان
    for (const [sx, sz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      const mini = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xd5dce2, metalness: 0.3, roughness: 0.3 }));
      mini.position.set(-350 + sx * 10.5, 9, -40 + sz * 10.5);
      scene.add(mini);
    }
    addCollider(-350, -40, 13, 13);
    makeLabel('قبة الإمام المهدي', -350, 45, -40, 1.0);
  })();

  // ---- الأسواق (العربي وأم درمان) ----
  const canopies = [
    canopyTex('#d24a3a', '#f2e6d0'), canopyTex('#2f7f5f', '#f2e6d0'),
    canopyTex('#3a5f9f', '#f2e6d0'), canopyTex('#d2953a', '#f2e6d0')
  ];
  function buildSouq(cx, cz, rows, cols, label) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 1 });
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const x = cx - (cols - 1) * 6 / 2 + j * 6 + (rng() - 0.5) * 1.5;
      const z = cz - (rows - 1) * 8 / 2 + i * 8 + (rng() - 0.5) * 1.5;
      const table = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 2.2), woodMat);
      table.position.set(x, 0.5, z);
      scene.add(table);
      // بضائع ملونة
      for (let k = 0; k < 3; k++) {
        const goods = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8),
          new THREE.MeshStandardMaterial({ color: [0xd24a3a, 0xe2b13a, 0x2f7f5f, 0x8f4fa0, 0xd2703a][(rng() * 5) | 0], roughness: 0.9 }));
        goods.position.set(x - 1.1 + k * 1.1, 1.25, z);
        scene.add(goods);
      }
      // مظلة مخططة
      const canopy = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.2),
        new THREE.MeshStandardMaterial({ map: canopies[(i + j) % 4], side: THREE.DoubleSide, roughness: 1 }));
      canopy.rotation.x = -Math.PI / 2 + 0.18;
      canopy.position.set(x, 3, z);
      scene.add(canopy);
      for (const s of [-1, 1]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3, 5), woodMat);
        pole.position.set(x + s * 1.9, 1.5, z + 1.2);
        scene.add(pole);
      }
      addCollider(x, z, 2.1, 1.4);
    }
    makeLabel(label, cx, 14, cz, 0.9);
  }
  buildSouq(50, 150, 4, 5, 'السوق العربي');
  buildSouq(-390, 60, 5, 5, 'سوق أم درمان');

  // ---- الاستادات: المريخ والهلال ----
  function stadium(x, z, color, label) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(20, 5, 8, 28),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    ring.rotation.x = Math.PI / 2;
    ring.scale.set(1.25, 1, 1);
    ring.position.set(x, 3, z);
    scene.add(ring);
    const pitch = new THREE.Mesh(new THREE.CircleGeometry(17, 24),
      new THREE.MeshStandardMaterial({ color: 0x3f8f3f, roughness: 1 }));
    pitch.rotation.x = -Math.PI / 2;
    pitch.scale.x = 1.25;
    pitch.position.set(x, 0.12, z);
    scene.add(pitch);
    addCollider(x, z, 26, 22);
    makeLabel(label, x, 16, z, 0.85);
  }
  stadium(-310, 190, 0xb33030, 'استاد المريخ');
  stadium(-450, 190, 0x2857a8, 'استاد الهلال');

  // ---- حديقة المقرن وعجلة دوارة ----
  let ferrisWheel = null;
  const ferrisGondolas = [];
  (function mogranPark() {
    const grass = new THREE.Mesh(new THREE.CircleGeometry(42, 30),
      new THREE.MeshStandardMaterial({ color: 0x7fa055, roughness: 1 }));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(-35, 0.06, -35);
    scene.add(grass);
    // العجلة
    const g = new THREE.Group();
    g.position.set(-30, 0, -28);
    g.rotation.y = Math.PI / 5;
    const steel = new THREE.MeshStandardMaterial({ color: 0xd25050, metalness: 0.5, roughness: 0.5 });
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.7, 16, 0.7), steel);
      leg.position.set(s * 2.6, 7, 0);
      leg.rotation.z = s * 0.28;
      scene.add(leg); g.add(leg);
    }
    const wheel = new THREE.Group();
    wheel.position.y = 13.5;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.35, 8, 30), steel);
    wheel.add(rim);
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(19, 0.28, 0.28), steel);
      spoke.rotation.z = i * Math.PI / 4;
      wheel.add(spoke);
    }
    const gondolaColors = [0xd24a3a, 0xe2b13a, 0x2f7f5f, 0x3a5f9f, 0x8f4fa0, 0xd2703a, 0x40a0a0, 0xc05080];
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const gon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 1.2),
        new THREE.MeshStandardMaterial({ color: gondolaColors[i], roughness: 0.7 }));
      gon.position.set(Math.cos(a) * 9.5, Math.sin(a) * 9.5, 0);
      wheel.add(gon);
      ferrisGondolas.push(gon);
    }
    g.add(wheel);
    ferrisWheel = wheel;
    scene.add(g);
    addCollider(-30, -28, 4, 2.5);
    makeLabel('المقرن — ملتقى النيلين', -35, 30, -35, 1.05);
    addFlag(-52, -50, 16);
  })();

  makeLabel('جزيرة توتي', TUTI.x, 20, TUTI.z, 0.95);
  makeLabel('أم درمان', -440, 34, 130, 1.15);
  makeLabel('بحري', 200, 34, -340, 1.15);

  // ---- صوامع بحري ----
  (function silos() {
    const mat = new THREE.MeshStandardMaterial({ color: 0xcfc4ae, roughness: 0.85 });
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 24, 12), mat);
      s.position.set(330 + (i % 3) * 10, 12, -420 - Math.floor(i / 3) * 10);
      scene.add(s);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(4.2, 3, 12), mat);
      cap.position.set(s.position.x, 25.5, s.position.z);
      scene.add(cap);
    }
    addCollider(340, -425, 16, 12);
  })();

  // ================= المباني السكنية =================
  const buildingPalette = ['#d9c6a5', '#cbb391', '#e4d5b8', '#b8a184', '#dfd0c0', '#c4a877', '#d8b28e'];
  function addBuilding(x, z, w, h, d, colorIdx) {
    const base = buildingPalette[colorIdx % buildingPalette.length];
    const cols = clamp(Math.round(w / 3), 2, 8);
    const rows = clamp(Math.round(h / 3), 1, 7);
    const sideMat = new THREE.MeshStandardMaterial({ map: buildingTex(base, cols, rows), roughness: 0.9 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8f7f68, roughness: 1 });
    const mats = [sideMat, sideMat, roofMat, roofMat, sideMat, sideMat];
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
    m.position.set(x, h / 2, z);
    scene.add(m);
    addCollider(x, z, w / 2, d / 2);
    // خزان مياه على بعض الأسطح — لمسة سودانية أصيلة
    if (rng() < 0.4) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.7 }));
      tank.position.set(x + (rng() - 0.5) * w * 0.4, h + 0.7, z + (rng() - 0.5) * d * 0.4);
      scene.add(tank);
    }
  }
  (function fillCity() {
    // مربعات الخرطوم (نتجنب مربعي الجامع والسوق العربي وشريط المعالم)
    for (let bx = 0; bx < 4; bx++) for (let bz = 0; bz < 4; bz++) {
      if (bx === 1 && bz === 1) continue; // الجامع الكبير
      if (bx === 0 && bz === 1) continue; // السوق العربي
      const n = 3 + (rng() * 3 | 0);
      for (let i = 0; i < n; i++) {
        const w = 10 + rng() * 14, d = 10 + rng() * 14;
        const x = bx * 100 + 15 + rng() * (70 - w);
        const z = bz * 100 + 15 + rng() * (70 - d);
        const h = 6 + rng() * (bz === 0 ? 18 : 10);
        addBuilding(x + w / 2, z + d / 2, w, h, d, (rng() * 7) | 0);
      }
    }
    // امتداد شرق الخرطوم
    for (let i = 0; i < 16; i++) {
      const x = 430 + rng() * 220, z = 10 + rng() * 380;
      addBuilding(x, z, 9 + rng() * 9, 4 + rng() * 7, 9 + rng() * 9, (rng() * 7) | 0);
    }
    // أم درمان: بيوت طينية منخفضة بأفنية
    for (let i = 0; i < 34; i++) {
      const x = -640 + rng() * 400, z = -85 + rng() * 240;
      if (Math.hypot(x + 350, z + 40) < 30) continue;   // قبة المهدي
      if (Math.hypot(x + 390, z - 60) < 34) continue;   // السوق
      if (Math.hypot(x + 310, z - 190) < 42) continue;  // المريخ
      if (Math.hypot(x + 450, z - 190) < 42) continue;  // الهلال
      if (Math.hypot(x + 240, z + 120) < 26) continue;  // مسجد النيلين
      if (Math.abs(z - 0) < 9 || Math.abs(z - 100) < 9 || Math.abs(x + 330) < 9 || Math.abs(x + 480) < 9) continue;
      addBuilding(x, z, 8 + rng() * 8, 3.5 + rng() * 4, 8 + rng() * 8, 5 + ((rng() * 2) | 0));
    }
    // بحري
    for (let i = 0; i < 26; i++) {
      const x = -80 + rng() * 540, z = -540 + rng() * 290;
      if (Math.abs(z + 300) < 9 || Math.abs(x - 100) < 9) continue;
      if (Math.hypot(x - 340, z + 425) < 26) continue; // الصوامع
      addBuilding(x, z, 9 + rng() * 10, 4 + rng() * 8, 9 + rng() * 10, (rng() * 7) | 0);
    }
    // بيوت توتي الصغيرة
    for (let i = 0; i < 7; i++) {
      const a = rng() * Math.PI * 2, d = 8 + rng() * 24;
      const x = TUTI.x + Math.cos(a) * d, z = TUTI.z + Math.sin(a) * d;
      addBuilding(x, z, 4.5, 3, 4.5, 5);
    }
  })();

  // ================= الأشجار والإنارة =================
  (function vegetation() {
    // نخيل: جذوع + سعف — Instanced
    const palmSpots = [];
    for (let x = -80; x <= 640; x += 32) palmSpots.push([x, -102 - rng() * 1]);           // ضفة النيل الأزرق
    for (let z = -60; z <= 640; z += 36) palmSpots.push([-102, z]);                        // ضفة النيل الأبيض
    for (let z = -80; z <= 400; z += 40) palmSpots.push([-200 - rng() * 4, z]);            // ضفة أم درمان
    for (let i = 0; i < 14; i++) {                                                          // توتي والمقرن
      const a = rng() * Math.PI * 2;
      palmSpots.push([TUTI.x + Math.cos(a) * (30 + rng() * 16), TUTI.z + Math.sin(a) * (30 + rng() * 16)]);
    }
    for (let i = 0; i < 10; i++) palmSpots.push([-35 + (rng() - 0.5) * 66, -35 + (rng() - 0.5) * 66]);
    const valid = palmSpots.filter(p => !isWater(p[0], p[1]) && !collideCircle(p[0], p[1], 1));

    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.45, 7, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 1 });
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, valid.length);
    // تاج النخلة: سعفات مشعّة تنحني للأسفل
    const frondGeo = (function () {
      const pos = [];
      const n = 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const dx = Math.cos(a), dz = Math.sin(a);
        const mid = [dx * 1.5, 0.55, dz * 1.5];
        const tip = [dx * 3.3, -1.0, dz * 3.3];
        const w = 0.45, px = -dz * w, pz = dx * w;
        pos.push(0, 0.15, 0, mid[0] + px, mid[1], mid[2] + pz, mid[0] - px, mid[1], mid[2] - pz);
        pos.push(mid[0] + px, mid[1], mid[2] + pz, tip[0], tip[1], tip[2], mid[0] - px, mid[1], mid[2] - pz);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      return g;
    })();
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x4a8a3c, roughness: 1, side: THREE.DoubleSide });
    addLeafWind(frondMat, 0.14, 'max(0.0, position.y + 1.2)'); // السعف يتمايل مع الهواء
    const fronds = new THREE.InstancedMesh(frondGeo, frondMat, valid.length);
    const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1);
    valid.forEach((p, i) => {
      const s = 0.85 + rng() * 0.5;
      S.set(s, s, s);
      P.set(p[0], 3.5 * s, p[1]);
      Q.setFromEuler(new THREE.Euler(0, rng() * Math.PI, (rng() - 0.5) * 0.08));
      M.compose(P, Q, S); trunks.setMatrixAt(i, M);
      P.set(p[0], 7.4 * s, p[1]);
      M.compose(P, Q, S); fronds.setMatrixAt(i, M);
    });
    scene.add(trunks, fronds);

    // أشجار نيم في الأحياء
    const neemSpots = [];
    for (let i = 0; i < 60; i++) {
      const q = rng();
      let x, z;
      if (q < 0.5) { x = rng() * 420; z = rng() * 420; }
      else if (q < 0.8) { x = -640 + rng() * 400; z = -85 + rng() * 240; }
      else { x = -60 + rng() * 500; z = -540 + rng() * 290; }
      if (!isWater(x, z) && !collideCircle(x, z, 1.5)) neemSpots.push([x, z]);
    }
    const neemTrunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.34, 3, 5),
      trunkMat, neemSpots.length);
    const neemTopMat = new THREE.MeshStandardMaterial({ color: 0x4c8a3f, roughness: 1 });
    addLeafWind(neemTopMat, 0.1, '(position.y * 0.2 + 0.7)'); // تمايل تاج النيم
    const neemTop = new THREE.InstancedMesh(new THREE.SphereGeometry(2.4, 10, 8), neemTopMat, neemSpots.length);
    neemSpots.forEach((p, i) => {
      const s = 0.8 + rng() * 0.7;
      S.set(s, s, s); Q.identity();
      P.set(p[0], 1.5 * s, p[1]); M.compose(P, Q, S); neemTrunk.setMatrixAt(i, M);
      P.set(p[0], 4.2 * s, p[1]); S.set(s, s * 0.8, s); M.compose(P, Q, S); neemTop.setMatrixAt(i, M);
    });
    scene.add(neemTrunk, neemTop);

    // أعمدة إنارة شارع النيل
    const lampSpots = [];
    for (let x = -60; x <= 620; x += 55) lampSpots.push([x, -92]);
    for (let z = 20; z <= 380; z += 60) lampSpots.push([-92, z]);
    const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.14, 6, 5),
      new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6 }), lampSpots.length);
    const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.35, 6, 5),
      new THREE.MeshStandardMaterial({ color: 0xfff2cc, emissive: 0xaa8844, roughness: 0.4 }), lampSpots.length);
    lampSpots.forEach((p, i) => {
      S.set(1, 1, 1); Q.identity();
      P.set(p[0], 3, p[1]); M.compose(P, Q, S); poles.setMatrixAt(i, M);
      P.set(p[0], 6.1, p[1]); M.compose(P, Q, S); heads.setMatrixAt(i, M);
    });
    scene.add(poles, heads);
  })();

  // ================= بناء الشخصية السودانية =================
  // شخصية «علاء الدين»: جلابية رمادية فاتحة، طاقية بيضاء مزخرفة،
  // نظارة، لحية سوداء، ساعة يد سوداء، صندل جلد.
  function buildCharacter(opts) {
    opts = opts || {};
    const hd = !!opts.hd; // دقة عالية للشخصية الرئيسية
    const seg = hd ? 24 : 12;
    const skin = new THREE.MeshStandardMaterial({ color: opts.skin || 0x6f4530, roughness: hd ? 0.62 : 0.75 });
    const cloth = new THREE.MeshStandardMaterial({
      color: opts.cloth || 0xb9b0a8, roughness: 0.9,
      map: hd ? clothTex : null
    });
    const dark = new THREE.MeshStandardMaterial({ color: 0x17120e, roughness: 0.55 });

    const root = new THREE.Group();
    const parts = { root };

    // تنورة الجلابية (تتسع للأسفل قليلاً)
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.44, 1.06, seg), cloth);
    skirt.position.y = 0.56;
    root.add(skirt);
    parts.skirt = skirt;

    // الجذع
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.35, 0.58, seg), cloth);
    torso.position.y = 1.33;
    root.add(torso);

    // جيب الصدر وأزرار (كما في الصورة)
    if (opts.details !== false) {
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.15, 0.02), cloth.clone());
      pocket.material.color.offsetHSL(0, 0, -0.04);
      pocket.position.set(0.14, 1.36, 0.285);
      root.add(pocket);
      for (let i = 0; i < 3; i++) {
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5),
          new THREE.MeshStandardMaterial({ color: 0xd8cfc6, roughness: 0.5 }));
        btn.position.set(0, 1.52 - i * 0.12, 0.315 - i * 0.012);
        root.add(btn);
      }
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.028, 6, 14), cloth);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 1.63;
      root.add(collar);
    }

    // الرأس
    const head = new THREE.Group();
    head.position.y = 1.8;
    root.add(head);
    parts.head = head;
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.205, hd ? 30 : 16, hd ? 24 : 14), skin);
    skull.scale.set(0.94, 1.06, 0.96);
    head.add(skull);
    if (hd) {
      // أنف مجسّم
      const noseB = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.06, 0.035), skin);
      noseB.position.set(0, -0.015, 0.195);
      noseB.rotation.x = 0.18;
      head.add(noseB);
      const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), skin);
      noseTip.position.set(0, -0.045, 0.207);
      head.add(noseTip);
      // العينان: بياض + قزحية بنية داكنة
      for (const s of [-1, 1]) {
        const white = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0xf2ede2, roughness: 0.25 }));
        white.scale.set(1.25, 0.85, 0.5);
        white.position.set(s * 0.075, 0.035, 0.183);
        head.add(white);
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6),
          new THREE.MeshStandardMaterial({ color: 0x241408, roughness: 0.15 }));
        iris.position.set(s * 0.075, 0.033, 0.196);
        head.add(iris);
        // حاجب
        const brow = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.014, 0.012), dark);
        brow.position.set(s * 0.078, 0.095, 0.188);
        brow.rotation.z = s * -0.12;
        head.add(brow);
      }
    } else {
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), skin);
      nose.position.set(0, -0.03, 0.2);
      head.add(nose);
    }
    const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, hd ? 10 : 6, hd ? 8 : 5), skin);
    ear1.position.set(0.19, -0.01, 0); head.add(ear1);
    const ear2 = ear1.clone(); ear2.position.x = -0.19; head.add(ear2);

    // اللحية (نصف كرة سفلي أسود) + شارب
    if (opts.beard !== false) {
      // لحية على الفك والذقن فقط (لا تغطي الخدود)
      const beard = new THREE.Mesh(
        new THREE.SphereGeometry(0.212, hd ? 26 : 14, hd ? 16 : 10, 0, Math.PI * 2, Math.PI * 0.62, Math.PI * 0.38), dark);
      beard.scale.set(0.9, 1.0, 0.94);
      beard.position.set(0, -0.025, 0.02);
      head.add(beard);
      const mus = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.026, 0.028), dark);
      mus.position.set(0, -0.082, 0.188);
      head.add(mus);
      if (hd) {
        // ذقن ممتلئة وسوالف رفيعة
        const chin = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), dark);
        chin.scale.set(1.1, 0.85, 0.75);
        chin.position.set(0, -0.185, 0.1);
        head.add(chin);
        for (const s of [-1, 1]) {
          const sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.045), dark);
          sideburn.position.set(s * 0.172, 0.02, 0.06);
          head.add(sideburn);
        }
      }
    }

    // النظارة
    if (opts.glasses) {
      const fr = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.4 });
      function bar(w, h, x, y, z) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), fr);
        b.position.set(x, y, z);
        head.add(b);
        return b;
      }
      for (const s of [-1, 1]) {
        bar(0.105, 0.012, s * 0.085, 0.075, 0.195);   // أعلى العدسة
        bar(0.105, 0.012, s * 0.085, -0.005, 0.195);  // أسفل العدسة
        bar(0.012, 0.09, s * 0.135, 0.035, 0.195);    // خارجي
        bar(0.012, 0.09, s * 0.035, 0.035, 0.195);    // داخلي
        // ذراع النظارة
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.19), fr);
        arm.position.set(s * 0.17, 0.04, 0.1);
        head.add(arm);
        // عدسة شفافة خفيفة
        const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.075),
          new THREE.MeshStandardMaterial({ color: 0x9db8c8, transparent: true, opacity: 0.28, roughness: 0.1 }));
        lens.position.set(s * 0.085, 0.035, 0.19);
        head.add(lens);
      }
      bar(0.06, 0.012, 0, 0.055, 0.2); // جسر الأنف
    }

    // غطاء الرأس: طاقية مزخرفة أو عمّة أو طرحة
    if (opts.headwear === 'taqiyah') {
      const capMat = new THREE.MeshStandardMaterial({ map: taqiyahTex, roughness: 0.85 });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.215, 0.17, 16, 1, true), capMat);
      cap.position.y = 0.19;
      cap.rotation.y = Math.PI; // شعار الدرع نحو الأمام
      head.add(cap);
      const capTop = new THREE.Mesh(new THREE.CircleGeometry(0.205, 16),
        new THREE.MeshStandardMaterial({ color: 0xf5efe2, roughness: 0.85 }));
      capTop.rotation.x = -Math.PI / 2;
      capTop.position.y = 0.275;
      head.add(capTop);
    } else if (opts.headwear === 'turban') {
      const tMat = new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.95 });
      for (let i = 0; i < 3; i++) {
        const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.19 - i * 0.02, 0.055, 8, 16), tMat);
        wrap.rotation.x = Math.PI / 2 + (rng() - 0.5) * 0.2;
        wrap.position.y = 0.13 + i * 0.055;
        head.add(wrap);
      }
      const tTop = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), tMat);
      tTop.position.y = 0.24;
      head.add(tTop);
    } else if (opts.headwear === 'scarf') {
      // طرحة/توب يغطي الرأس بلون الثوب
      const sMat = new THREE.MeshStandardMaterial({ color: opts.cloth, roughness: 0.95 });
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.235, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), sMat);
      hood.position.y = 0.03;
      head.add(hood);
      const drape = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.35, 10, 1, true), sMat);
      drape.position.y = -0.22;
      head.add(drape);
    }

    // الذراعان (كمّا الجلابية) واليدان
    parts.arms = [];
    for (const s of [-1, 1]) {
      const armPivot = new THREE.Group();
      armPivot.position.set(s * 0.33, 1.56, 0);
      root.add(armPivot);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.115, 0.52, hd ? 14 : 8), cloth);
      sleeve.position.y = -0.26;
      armPivot.add(sleeve);
      if (hd) {
        // سوار الكم (كما في لوحة التصميم)
        const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 8, 16), cloth);
        cuff.rotation.x = Math.PI / 2;
        cuff.position.y = -0.5;
        armPivot.add(cuff);
      }
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, hd ? 12 : 8, hd ? 10 : 6), skin);
      if (hd) hand.scale.set(1, 0.82, 1.18);
      hand.position.y = -0.57;
      armPivot.add(hand);
      // ساعة اليد اليسرى: سير أسود وميناء
      if (opts.watch && s === -1) {
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 8, 18),
          new THREE.MeshStandardMaterial({ color: 0x181410, roughness: 0.45 }));
        band.rotation.x = Math.PI / 2;
        band.position.y = -0.485;
        armPivot.add(band);
        const face = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.018, 14),
          new THREE.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.55, roughness: 0.25 }));
        face.rotation.z = Math.PI / 2;
        face.position.set(-0.1, -0.485, 0);
        armPivot.add(face);
      }
      parts.arms.push(armPivot);
    }

    // القدمان (صنادل تظهر أسفل الجلابية)
    parts.feet = [];
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x4a3323, roughness: 0.9 });
    for (const s of [-1, 1]) {
      const foot = new THREE.Group();
      foot.position.set(s * 0.14, 0.05, 0.06);
      root.add(foot);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.32), soleMat);
      foot.add(sole);
      const toes = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.2), skin);
      toes.position.set(0, 0.05, 0.02);
      foot.add(toes);
      if (hd) {
        // سيور الصندل الجلدية
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.035), soleMat);
        strap.position.set(0, 0.075, 0.07);
        foot.add(strap);
        const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.03), soleMat);
        strap2.position.set(0, 0.075, -0.05);
        strap2.rotation.x = 0.3;
        foot.add(strap2);
      }
      parts.feet.push(foot);
    }

    // ظل دائري خفيف (الظل الحقيقي من الشمس)
    const blob = new THREE.Mesh(new THREE.CircleGeometry(0.55, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.13 }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.015;
    root.add(blob);

    parts.animate = function (t, moveAmount) {
      // moveAmount: 0 ساكن — 1 مشي — 2 جري
      const swing = Math.sin(t * 8) * 0.55 * Math.min(moveAmount, 1.3);
      parts.arms[0].rotation.x = swing;
      parts.arms[1].rotation.x = -swing;
      parts.feet[0].position.z = 0.06 + Math.sin(t * 8) * 0.16 * Math.min(moveAmount, 1.3);
      parts.feet[1].position.z = 0.06 - Math.sin(t * 8) * 0.16 * Math.min(moveAmount, 1.3);
      skirt.rotation.z = Math.sin(t * 8) * 0.05 * moveAmount;
      skirt.rotation.x = moveAmount * 0.06;
      root.position.y = Math.abs(Math.sin(t * 8)) * 0.05 * moveAmount;
      if (moveAmount < 0.05) {
        // تنفّس خفيف عند الوقوف
        torso.scale.setScalar(1 + Math.sin(t * 2) * 0.012);
        parts.arms[0].rotation.x = Math.sin(t * 2) * 0.04;
        parts.arms[1].rotation.x = -Math.sin(t * 2) * 0.04;
      } else {
        torso.scale.setScalar(1);
      }
      head.rotation.y = Math.sin(t * 0.7) * 0.06 * (moveAmount < 0.05 ? 1 : 0);
    };

    return parts;
  }

  // اللاعب: علاء الدين
  const player = buildCharacter({
    skin: 0x6f4530, cloth: 0xafa69c, hd: true,
    headwear: 'taqiyah', glasses: true, watch: true, beard: true
  });
  // نقطة بداية آمنة (خالية من المباني والماء)
  (function safeSpawn() {
    let x = 60, z = 60, t = 0;
    while ((collideCircle(x, z, 1.0) || isWater(x, z)) && ++t < 80) {
      x = 60 + (rng() - 0.5) * 70;
      z = 60 + (rng() - 0.5) * 70;
    }
    player.root.position.set(x, 0, z);
  })();
  scene.add(player.root);
  const playerState = { yaw: 0, walkTime: 0, moveAmt: 0, heading: 0 };

  // ================= السكان (NPC) =================
  const npcs = [];
  const NPC_AREAS = [
    { x1: 10, x2: 390, z1: 10, z2: 390 },      // الخرطوم
    { x1: -630, x2: -230, z1: -80, z2: 150 },  // أم درمان
    { x1: -60, x2: 620, z1: -95, z2: -70 },    // شارع النيل
    { x1: -60, x2: 480, z1: -520, z2: -240 }   // بحري
  ];
  (function spawnNpcs() {
    const menCloth = [0xf2ede2, 0xe8e2d2, 0xdcd5c2, 0xf5f2ea];
    const womenCloth = [0xc23a6f, 0xd2703a, 0x2f8f8f, 0x8f4fa0, 0xe2b13a];
    for (let i = 0; i < 26; i++) {
      const isWoman = rng() < 0.4;
      const ch = buildCharacter({
        skin: [0x6f4530, 0x5a3524, 0x7c4f36][(rng() * 3) | 0],
        cloth: isWoman ? womenCloth[(rng() * womenCloth.length) | 0] : menCloth[(rng() * menCloth.length) | 0],
        headwear: isWoman ? 'scarf' : (rng() < 0.6 ? 'turban' : 'taqiyah'),
        glasses: false, watch: false, beard: !isWoman && rng() < 0.6, details: false
      });
      const area = NPC_AREAS[(rng() * NPC_AREAS.length) | 0];
      let x, z, tries = 0;
      do {
        x = area.x1 + rng() * (area.x2 - area.x1);
        z = area.z1 + rng() * (area.z2 - area.z1);
      } while ((isWater(x, z) || collideCircle(x, z, 0.6)) && ++tries < 30);
      ch.root.position.set(x, 0, z);
      const s = 0.92 + rng() * 0.12;
      ch.root.scale.setScalar(s);
      scene.add(ch.root);
      npcs.push({ ch, area, target: null, wait: rng() * 3, t: rng() * 10, speed: 1.4 + rng() * 0.8 });
    }
    // سكان توتي
    for (let i = 0; i < 5; i++) {
      const ch = buildCharacter({
        skin: 0x6f4530, cloth: 0xf2ede2, headwear: 'turban',
        glasses: false, watch: false, beard: rng() < 0.5, details: false
      });
      const a = rng() * Math.PI * 2, d = 10 + rng() * 25;
      ch.root.position.set(TUTI.x + Math.cos(a) * d, 0, TUTI.z + Math.sin(a) * d);
      scene.add(ch.root);
      npcs.push({
        ch, area: { x1: TUTI.x - 30, x2: TUTI.x + 30, z1: TUTI.z - 30, z2: TUTI.z + 30 },
        target: null, wait: rng() * 3, t: rng() * 10, speed: 1.2
      });
    }
  })();

  // ================= ست الشاي =================
  function teaLady(x, z, color) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    scene.add(g);
    const cMat = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 10), cMat);
    body.position.y = 0.5;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0x6f4530, roughness: 0.75 }));
    head.position.y = 1.15;
    g.add(head);
    const scarf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), cMat);
    scarf.position.y = 1.17;
    g.add(scarf);
    // طاولة وبراريد
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 1 }));
    table.position.set(0.9, 0.25, 0);
    g.add(table);
    const kettleMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.3, roughness: 0.35 });
    for (let i = 0; i < 3; i++) {
      const k = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.16, 8), kettleMat);
      k.position.set(0.75 + (i % 2) * 0.28, 0.58, -0.15 + (i > 1 ? 0.3 : 0));
      g.add(k);
    }
    // موقد فحم متوهج
    const stove = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x552211, emissive: 0xcc3300, emissiveIntensity: 0.7, roughness: 0.8 }));
    stove.position.set(0.5, 0.1, 0.6);
    g.add(stove);
    // بنابر ملونة للزباين
    const stoolColors = [0xd24a3a, 0x2f7f5f, 0x3a5f9f, 0xe2b13a];
    for (let i = 0; i < 4; i++) {
      const a = -0.7 + i * 0.55;
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: stoolColors[i], roughness: 0.9 }));
      st.position.set(Math.cos(a) * 1.8, 0.15, Math.sin(a) * 1.8);
      g.add(st);
    }
    addCollider(x, z, 1.2, 1.2);
  }
  teaLady(20, -88, 0xc23a6f);
  teaLady(-48, -18, 0xd2703a);
  teaLady(-368, 44, 0x2f8f8f);

  // ================= المركبات =================
  const vehicles = [];
  function follower(group, waypoints, speed, yOffset) {
    return {
      g: group, wp: waypoints, i: 0, speed, y: yOffset || 0,
      update(dt) {
        const t = this.wp[this.i];
        const dx = t[0] - this.g.position.x, dz = t[1] - this.g.position.z;
        const d = Math.hypot(dx, dz);
        if (d < 1.5) { this.i = (this.i + 1) % this.wp.length; return; }
        const vx = dx / d * this.speed * dt, vz = dz / d * this.speed * dt;
        this.g.position.x += vx; this.g.position.z += vz;
        this.g.rotation.y = lerpAngle(this.g.rotation.y, Math.atan2(dx, dz), 0.12);
        if (this.g.userData.wheels) {
          for (const w of this.g.userData.wheels) w.rotation.x += this.speed * dt / 0.38;
        }
      }
    };
  }

  // ---- سيارة (سيدان) — للمرور وللركوب ----
  function buildCar(color, isTaxi) {
    const g = new THREE.Group();
    const paint = new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.35 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 4.2), paint);
    body.position.y = 0.72;
    g.add(body);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.18, 4.15), paint);
    hood.position.y = 1.05;
    g.add(hood);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.55, 2.15),
      new THREE.MeshStandardMaterial({ color: 0x35485a, metalness: 0.3, roughness: 0.18 }));
    cabin.position.set(0, 1.4, -0.25);
    g.add(cabin);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.08, 2.2), paint);
    roof.position.set(0, 1.7, -0.25);
    g.add(roof);
    // مصابيح
    const lampF = new THREE.MeshStandardMaterial({ color: 0xfff2cc, emissive: 0x776633, roughness: 0.3 });
    const lampR = new THREE.MeshStandardMaterial({ color: 0xaa2222, emissive: 0x551111, roughness: 0.3 });
    for (const s of [-1, 1]) {
      const lf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.06), lampF);
      lf.position.set(s * 0.65, 0.85, 2.11); g.add(lf);
      const lr = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.06), lampR);
      lr.position.set(s * 0.65, 0.85, -2.11); g.add(lr);
    }
    // عجلات
    const wheels = [];
    const wGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 12);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.9 });
    for (const [sx, sz] of [[-1, 1.35], [1, 1.35], [-1, -1.35], [1, -1.35]]) {
      const w = new THREE.Mesh(wGeo, wMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(sx * 0.88, 0.38, sz);
      g.add(w);
      wheels.push(w);
    }
    g.userData.wheels = wheels;
    if (isTaxi) {
      // لافتة تاكسي على السقف
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 }));
      sign.position.set(0, 1.86, -0.25);
      g.add(sign);
      // حزام مربعات أسود على الجانبين
      const checker = canvasTex(128, 32, (cg, w, h) => {
        cg.fillStyle = '#f5c518'; cg.fillRect(0, 0, w, h);
        for (let i = 0; i < w / 8; i++) for (let j = 0; j < 2; j++) {
          if ((i + j) % 2 === 0) { cg.fillStyle = '#111111'; cg.fillRect(i * 8, j * 16, 8, 16); }
        }
      });
      checker.wrapS = THREE.RepeatWrapping; checker.repeat.set(3, 1);
      for (const s of [-1, 1]) {
        const band = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.22),
          new THREE.MeshBasicMaterial({ map: checker }));
        band.position.set(s * 0.96, 0.95, 0);
        band.rotation.y = s * Math.PI / 2;
        g.add(band);
      }
    }
    scene.add(g);
    return g;
  }

  // سيارات مرور تجوب الطرق
  function trafficCar(color, waypoints, speed) {
    const g = buildCar(color, false);
    g.position.set(waypoints[0][0], 0, waypoints[0][1]);
    vehicles.push(follower(g, waypoints, speed));
  }
  trafficCar(0xe8e4da, [[3, 97], [297, 97], [297, 303], [3, 303]], 13);
  trafficCar(0x8f1f1f, [[103, 3], [397, 3], [397, 203], [103, 203]], 12);
  trafficCar(0x3f6f4f, [[203, 103], [397, 103], [397, 397], [203, 397]], 11);
  trafficCar(0xb8b8c0, [[-236, 97], [-627, 97], [-627, 3], [-236, 3]], 12);
  trafficCar(0x4a4a52, [[97, -297], [497, -297], [497, -303], [97, -303]], 14);

  // ---- تاكسيات صفراء قابلة للركوب ----
  const rideables = [];
  function parkedTaxi(x, z, ry) {
    // إزاحة الموقف إن صادف مبنى أو ماء
    let px = x, pz = z, tries = 0;
    while ((collideCircle(px, pz, 1.8) || isWater(px, pz)) && ++tries < 24) {
      px = x + (rng() - 0.5) * 28;
      pz = z + (rng() - 0.5) * 28;
    }
    const g = buildCar(0xf5c518, true);
    g.position.set(px, 0, pz);
    g.rotation.y = ry;
    rideables.push({ g, vel: 0, heading: ry });
  }
  parkedTaxi(70, 12, Math.PI / 2);      // وسط الخرطوم
  parkedTaxi(252, -90, Math.PI / 2);    // شارع النيل
  parkedTaxi(-330, -25, Math.PI / 2);   // أم درمان قرب قبة المهدي
  parkedTaxi(112, -288, 0);             // بحري
  let driving = null;

  // ركشة (توك توك سوداني)
  function rickshaw(color, waypoints, speed) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.55, 1.9),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 }));
    body.position.y = 0.55;
    g.add(body);
    // مظلة نصف أسطوانية
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 10, 1, true, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8, side: THREE.DoubleSide }));
    canopy.rotation.z = Math.PI / 2;
    canopy.rotation.y = Math.PI / 2;
    canopy.position.y = 1.25;
    g.add(canopy);
    const front = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }));
    front.position.set(0, 0.5, 1.05);
    g.add(front);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 10);
    const positions = [[0, 0.28, 1.05], [-0.55, 0.28, -0.6], [0.55, 0.28, -0.6]];
    positions.forEach(p => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(p[0], p[1], p[2]);
      g.add(w);
    });
    // السائق
    const driver = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.35, 3, 6),
      new THREE.MeshStandardMaterial({ color: 0xf2ede2, roughness: 0.9 }));
    driver.position.set(0, 1.0, 0.55);
    g.add(driver);
    const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x6f4530, roughness: 0.75 }));
    dHead.position.set(0, 1.4, 0.55);
    g.add(dHead);
    g.position.set(waypoints[0][0], 0, waypoints[0][1]);
    scene.add(g);
    vehicles.push(follower(g, waypoints, speed));
  }
  rickshaw(0x2266cc, [[3, 3], [197, 3], [197, 197], [3, 197]], 9);
  rickshaw(0xddaa22, [[203, 203], [397, 203], [397, 397], [203, 397]], 8);
  rickshaw(0x22aa66, [[3, 203], [197, 203], [197, 397], [3, 397]], 8.5);
  rickshaw(0xcc4433, [[-236, 3], [-627, 3], [-627, 97], [-236, 97]], 7.5);

  // حافلة «كوستر» زرقاء وبيضاء كما في الصورة المرجعية
  function bus(bottomColor, waypoints, speed) {
    const g = new THREE.Group();
    // أسفل ملوّن
    const lower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.45, metalness: 0.25 }));
    lower.position.y = 1.0;
    g.add(lower);
    // أعلى أبيض بنوافذ
    const upper = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 8),
      new THREE.MeshStandardMaterial({ map: buildingTex('#f0ede4', 6, 1, 0), roughness: 0.4, metalness: 0.2 }));
    upper.position.y = 2.2;
    g.add(upper);
    // شبك السقف (شنطة السطح)
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6, roughness: 0.4 });
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 7), rackMat);
      rail.position.set(s * 1.05, 2.95, 0);
      g.add(rail);
    }
    for (let i = 0; i < 4; i++) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.06, 0.06), rackMat);
      cross.position.set(0, 2.98, -2.6 + i * 1.75);
      g.add(cross);
    }
    // زجاج أمامي
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x8fb8cc, roughness: 0.15, metalness: 0.5 }));
    windshield.position.set(0, 2.2, 4.01);
    g.add(windshield);
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 10);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    for (const [x, z] of [[-1.1, 2.6], [1.1, 2.6], [-1.1, -2.6], [1.1, -2.6]]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.45, z);
      g.add(w);
    }
    g.position.set(waypoints[0][0], 0, waypoints[0][1]);
    scene.add(g);
    vehicles.push(follower(g, waypoints, speed));
  }
  bus(0x3565b0, [[-60, -97], [610, -97], [610, -99], [-60, -99]], 12);
  bus(0x2f8f6f, [[500, -96], [-40, -96], [-40, -100], [500, -100]], 11);

  // ---- درابزين كورنيش النيل (كما في الصورة المرجعية) ----
  (function corniche() {
    const posts = [];
    // ضفة النيل الأزرق (مع فتحة عند مدخل كبري المك نمر x≈100)
    for (let x = -66; x <= 640; x += 6) {
      if (x > 88 && x < 112) continue;
      posts.push([x, -104.5]);
    }
    // ضفة النيل الأبيض (مع فتحة عند مدخل كبري النيل الأبيض z≈100)
    for (let z = -60; z <= 400; z += 6) {
      if (z > 88 && z < 112) continue;
      posts.push([-104.5, z]);
    }
    const postMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.8 });
    const postMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.11, 1.0, 6), postMat, posts.length);
    const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1);
    Q.identity();
    posts.forEach((p, i) => {
      P.set(p[0], 0.5, p[1]);
      M.compose(P, Q, S);
      postMesh.setMatrixAt(i, M);
    });
    scene.add(postMesh);
    // قضبان أفقية (مقسومة عند مداخل الكباري)
    const railMat = new THREE.MeshStandardMaterial({ color: 0xdcd5c4, roughness: 0.7 });
    function railSeg(x1, x2, z1, z2) {
      const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
      const len = horizontal ? x2 - x1 : z2 - z1;
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? len : 0.08, 0.08, horizontal ? 0.08 : len), railMat);
      rail.position.set((x1 + x2) / 2, 0.95, (z1 + z2) / 2);
      scene.add(rail);
    }
    railSeg(-66, 88, -104.5, -104.5);
    railSeg(112, 640, -104.5, -104.5);
    railSeg(-104.5, -104.5, -60, 88);
    railSeg(-104.5, -104.5, 112, 400);
  })();

  // ---- لافتات الشوارع الزرقاء ----
  function streetSign(text, x, z, ry) {
    const t = canvasTex(512, 160, (g, w, h) => {
      g.fillStyle = '#2a4a6a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#e8e8e8'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
      g.fillStyle = '#f5f5f5';
      g.font = 'bold 84px "Segoe UI", Tahoma, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text, w / 2, h / 2 + 4);
    });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 }));
    pole.position.set(x, 2.1, z);
    scene.add(pole);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.05),
      new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.5 }));
    sign.position.set(x, 3.8, z);
    sign.rotation.y = ry || 0;
    scene.add(sign);
  }
  streetSign('الخرطوم', 55, -90, 0);
  streetSign('شارع النيل', 250, -90, 0);
  streetSign('أم درمان', -230, 8, Math.PI / 2);
  streetSign('بحري', 110, -290, Math.PI / 2);
  streetSign('شارع الجامعة', 8, 8, Math.PI / 4);

  // ---- كوابل كبري المك نمر (جسر معلّق كما في الصورة) ----
  (function cableBridge() {
    const steel = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.7, roughness: 0.35 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.5, roughness: 0.4 });
    function cable(x1, y1, z1, x2, y2, z2) {
      const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2);
      const len = a.distanceTo(b);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 4), cableMat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      scene.add(m);
    }
    // برجان على جانبي منتصف الكبري (x=100, z=-150)
    for (const s of [-1, 1]) {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 26, 0.9), steel);
      pylon.position.set(100 + s * 7.4, 13, -150);
      scene.add(pylon);
      // مراوح كوابل نحو طرفي الجسر
      for (let i = 1; i <= 4; i++) {
        cable(100 + s * 7.4, 25, -150, 100 + s * 7.4, 1.2, -150 - i * 12);
        cable(100 + s * 7.4, 25, -150, 100 + s * 7.4, 1.2, -150 + i * 12);
      }
    }
  })();

  // كارو (عربة حمار)
  (function donkeyCart() {
    const g = new THREE.Group();
    const grey = new THREE.MeshStandardMaterial({ color: 0x8f8a85, roughness: 1 });
    const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.0), grey);
    dBody.position.set(0, 0.85, 1.3);
    g.add(dBody);
    const dHead = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.5), grey);
    dHead.position.set(0, 1.15, 1.95);
    g.add(dHead);
    for (const [x, z] of [[-0.18, 0.95], [0.18, 0.95], [-0.18, 1.65], [0.18, 1.65]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.6, 0.09), grey);
      leg.position.set(x, 0.3, z);
      g.add(leg);
    }
    const wood = new THREE.MeshStandardMaterial({ color: 0x7a5c3a, roughness: 1 });
    const cart = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 1.8), wood);
    cart.position.set(0, 0.7, -0.4);
    g.add(cart);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 10),
      new THREE.MeshStandardMaterial({ color: 0x3a6f9f, roughness: 0.7 }));
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 1.15, -0.4);
    g.add(barrel);
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 12);
    for (const s of [-1, 1]) {
      const w = new THREE.Mesh(wheelGeo, wood);
      w.rotation.z = Math.PI / 2;
      w.position.set(s * 0.72, 0.55, -0.4);
      g.add(w);
    }
    g.position.set(-620, 0, 0);
    scene.add(g);
    vehicles.push(follower(g, [[-620, 2], [-240, 2], [-240, -2], [-620, -2]], 2.2));
  })();

  // مراكب شراعية (فلوكة) على النيل
  const boats = [];
  function felucca(waypoints, speed) {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 5),
      new THREE.MeshStandardMaterial({ color: 0x6a4a2a, roughness: 0.8 }));
    hull.position.y = 0.1;
    g.add(hull);
    const prow = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 4), hull.material);
    prow.rotation.x = Math.PI / 2;
    prow.rotation.y = Math.PI / 4;
    prow.position.set(0, 0.1, 3.1);
    g.add(prow);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 5.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 1 }));
    mast.position.y = 2.9;
    g.add(mast);
    // شراع مثلث
    const sailGeo = new THREE.BufferGeometry();
    sailGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0.6, 0, 0, 5.3, 0, 0, 1.3, -3.4
    ], 3));
    sailGeo.computeVertexNormals();
    const sail = new THREE.Mesh(sailGeo,
      new THREE.MeshStandardMaterial({ color: 0xf5f2e8, side: THREE.DoubleSide, roughness: 0.9 }));
    sail.position.x = 0.1;
    g.add(sail);
    g.position.set(waypoints[0][0], 0.12, waypoints[0][1]);
    scene.add(g);
    const f = follower(g, waypoints, speed);
    vehicles.push(f);
    boats.push(g);
  }
  felucca([[-20, -135], [600, -135], [600, -165], [-20, -165]], 4.5);
  felucca([[-135, 620], [-135, 30], [-165, 30], [-165, 620]], 4);

  // ماعز في أم درمان
  const goats = [];
  (function spawnGoats() {
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      const col = rng() < 0.5 ? 0xf0ead8 : 0x9a7a55;
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 1 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 0.6), mat);
      body.position.y = 0.42;
      g.add(body);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.24), mat);
      head.position.set(0, 0.62, 0.38);
      g.add(head);
      for (const [x, z] of [[-0.1, 0.2], [0.1, 0.2], [-0.1, -0.2], [0.1, -0.2]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), mat);
        leg.position.set(x, 0.16, z);
        g.add(leg);
      }
      const hx = -500 + rng() * 200, hz = 20 + rng() * 100;
      g.position.set(hx, 0, hz);
      scene.add(g);
      goats.push({ g, hx, hz, a: rng() * 7, t: rng() * 5 });
    }
  })();

  // ================= التحكم =================
  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyE' && !e.repeat) toggleRide();
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  // ---- ركوب التاكسي والنزول منه ----
  const rideBtn = document.getElementById('rideBtn');
  function nearestTaxi() {
    const p = player.root.position;
    let best = null, bd = 4.5;
    for (const r of rideables) {
      const d = Math.hypot(r.g.position.x - p.x, r.g.position.z - p.z);
      if (d < bd) { bd = d; best = r; }
    }
    return best;
  }
  function toggleRide() {
    if (driving) {
      // النزول: ابحث عن موضع فارغ بجانب السيارة
      const g = driving.g;
      for (const [ox, oz] of [[2.6, 0], [-2.6, 0], [0, 3.4], [0, -3.4]]) {
        const wx = g.position.x + Math.cos(g.rotation.y) * ox + Math.sin(g.rotation.y) * oz;
        const wz = g.position.z - Math.sin(g.rotation.y) * ox + Math.cos(g.rotation.y) * oz;
        if (!isWater(wx, wz) && !collideCircle(wx, wz, 0.5)) {
          player.root.position.set(wx, 0, wz);
          break;
        }
      }
      player.root.visible = true;
      driving = null;
      showToast('🚶 نزلت من التاكسي');
    } else {
      const t = nearestTaxi();
      if (!t) return;
      driving = t;
      driving.vel = 0;
      driving.heading = t.g.rotation.y;
      player.root.visible = false;
      showToast('🚕 انطلق! التاكسي أسرع بكثير');
    }
    rideBtn.textContent = driving ? '🚶 نزول' : '🚕 ركوب';
  }
  rideBtn.addEventListener('touchstart', e => {
    e.preventDefault(); e.stopPropagation();
    toggleRide();
  }, { passive: false });
  rideBtn.addEventListener('click', () => { if (!IS_TOUCH) toggleRide(); });

  const cam = { yaw: Math.PI * 0.25, pitch: 0.42, dist: 8.5 };

  // فأرة: سحب لتدوير الكاميرا
  let mouseDown = false, lastMX = 0, lastMY = 0;
  canvas.addEventListener('mousedown', e => { mouseDown = true; lastMX = e.clientX; lastMY = e.clientY; });
  window.addEventListener('mouseup', () => { mouseDown = false; });
  window.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    cam.yaw -= (e.clientX - lastMX) * 0.0055;
    cam.pitch = clamp(cam.pitch + (e.clientY - lastMY) * 0.004, 0.12, 1.15);
    lastMX = e.clientX; lastMY = e.clientY;
  });
  canvas.addEventListener('wheel', e => {
    cam.dist = clamp(cam.dist + e.deltaY * 0.01, 4.5, 16);
  }, { passive: true });
  window.addEventListener('contextmenu', e => e.preventDefault());

  // لمس: عصا افتراضية (النصف الأيسر) + كاميرا (النصف الأيمن)
  const joy = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 };
  let camTouch = { id: null, x: 0, y: 0 };
  const joyBase = document.getElementById('joyBase');
  const joyStick = document.getElementById('joyStick');
  const runBtn = document.getElementById('runBtn');
  let runToggle = false;
  if (IS_TOUCH) {
    document.body.classList.add('touch');
    document.getElementById('ctrlsDesktop').style.display = 'none';
    document.getElementById('ctrlsTouch').style.display = 'block';
  }
  runBtn.addEventListener('touchstart', e => {
    e.preventDefault(); e.stopPropagation();
    runToggle = !runToggle;
    runBtn.classList.toggle('on', runToggle);
  }, { passive: false });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.clientX < window.innerWidth * 0.5 && !joy.active) {
        joy.active = true; joy.id = t.identifier;
        joy.cx = t.clientX; joy.cy = t.clientY; joy.dx = 0; joy.dy = 0;
        joyBase.style.display = 'block';
        joyBase.style.left = (joy.cx - 60) + 'px';
        joyBase.style.top = (joy.cy - 60) + 'px';
        joyStick.style.left = '34px'; joyStick.style.top = '34px';
      } else if (camTouch.id === null) {
        camTouch.id = t.identifier; camTouch.x = t.clientX; camTouch.y = t.clientY;
      }
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (joy.active && t.identifier === joy.id) {
        let dx = t.clientX - joy.cx, dy = t.clientY - joy.cy;
        const d = Math.hypot(dx, dy), max = 50;
        if (d > max) { dx = dx / d * max; dy = dy / d * max; }
        joy.dx = dx / max; joy.dy = dy / max;
        joyStick.style.left = (34 + dx) + 'px';
        joyStick.style.top = (34 + dy) + 'px';
      } else if (t.identifier === camTouch.id) {
        cam.yaw -= (t.clientX - camTouch.x) * 0.008;
        cam.pitch = clamp(cam.pitch + (t.clientY - camTouch.y) * 0.006, 0.12, 1.15);
        camTouch.x = t.clientX; camTouch.y = t.clientY;
      }
    }
  }, { passive: false });
  function endTouch(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joy.id) {
        joy.active = false; joy.id = null; joy.dx = 0; joy.dy = 0;
        joyBase.style.display = 'none';
      }
      if (t.identifier === camTouch.id) camTouch.id = null;
    }
  }
  canvas.addEventListener('touchend', endTouch);
  canvas.addEventListener('touchcancel', endTouch);

  // ================= الصوت (نغمات خماسية سودانية هادئة) =================
  let audioOn = false, audioCtx = null, audioTimer = null;
  const soundBtn = document.getElementById('soundBtn');
  const PENTA = [146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0];
  function pluck() {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const gn = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = PENTA[(Math.random() * PENTA.length) | 0];
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(0.08, t0 + 0.02);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
    o.connect(gn).connect(audioCtx.destination);
    o.start(t0); o.stop(t0 + 1.7);
  }
  soundBtn.addEventListener('click', () => {
    audioOn = !audioOn;
    soundBtn.textContent = audioOn ? '🔊' : '🔇';
    if (audioOn) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume();
      // طبلة إيقاع خفيفة عبر نبضات منخفضة
      audioTimer = setInterval(() => { if (Math.random() < 0.75) pluck(); }, 900);
    } else if (audioTimer) {
      clearInterval(audioTimer); audioTimer = null;
    }
  });

  // ================= الخريطة المصغرة =================
  const mmCanvas = document.getElementById('minimap');
  const mmCtx = mmCanvas.getContext('2d');
  const mmStatic = document.createElement('canvas');
  mmStatic.width = mmStatic.height = 264;
  (function drawStaticMap() {
    const g = mmStatic.getContext('2d');
    const s = 264 / 1400;
    const X = wx => (wx + 700) * s, Z = wz => (wz + 700) * s;
    g.fillStyle = '#d9bd8e';
    g.fillRect(0, 0, 264, 264);
    g.fillStyle = '#4a7f97';
    g.fillRect(X(-195), Z(-195), 90 * s, 900 * s);          // النيل الأبيض
    g.fillRect(X(-195), Z(-195), 900 * s, 90 * s);          // النيل الأزرق
    g.beginPath(); g.arc(X(-150), Z(-150), 85 * s, 0, 7); g.fill(); // المقرن
    g.save();
    g.translate(X(-425), Z(-425));
    g.rotate(-Math.PI / 4);
    g.fillRect(-64 * s, -400 * s, 128 * s, 800 * s);        // النيل الموحد
    g.restore();
    g.fillStyle = '#7fa055';
    g.beginPath(); g.arc(X(TUTI.x), Z(TUTI.z), TUTI.r * s, 0, 7); g.fill(); // توتي
    // الكباري
    g.fillStyle = '#c9c0b0';
    BRIDGES.forEach(b => g.fillRect(X(b.x1), Z(b.z1), (b.x2 - b.x1) * s, (b.z2 - b.z1) * s));
    // كبري توتي القطري
    g.save();
    g.translate(X(-100), Z(-100));
    g.rotate(-Math.PI / 4);
    g.fillRect(-7 * s, -32 * s, 14 * s, 64 * s);
    g.restore();
    // طرق رئيسية
    g.strokeStyle = 'rgba(80,76,70,0.75)'; g.lineWidth = 1.4;
    for (let i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(X(-150 + 100), Z(i * 100)); g.lineTo(X(550), Z(i * 100)); g.stroke();
      g.beginPath(); g.moveTo(X(i * 100), Z(-100)); g.lineTo(X(i * 100), Z(550)); g.stroke();
    }
    g.beginPath(); g.moveTo(X(-675), Z(0)); g.lineTo(X(-215), Z(0)); g.stroke();
    g.beginPath(); g.moveTo(X(-675), Z(100)); g.lineTo(X(-215), Z(100)); g.stroke();
    g.beginPath(); g.moveTo(X(-210), Z(-300)); g.lineTo(X(510), Z(-300)); g.stroke();
  })();
  const mmScale = 264 / 1400;
  let mmPulse = 0;
  function drawMinimap() {
    mmCtx.drawImage(mmStatic, 0, 0);
    // المعالم
    LANDMARKS.forEach(l => {
      mmCtx.fillStyle = visited.has(l.name) ? '#3fbf6f' : '#ffcf5e';
      mmCtx.beginPath();
      mmCtx.arc((l.x + 700) * mmScale, (l.z + 700) * mmScale, 3, 0, 7);
      mmCtx.fill();
    });
    // هدف المهمة الحالية (ماسة ذهبية نابضة)
    if (missionIdx < MISSIONS.length) {
      mmPulse += 0.09;
      const m = MISSIONS[missionIdx];
      const mx = (m.x + 700) * mmScale, mz = (m.z + 700) * mmScale;
      const r = 5.5 + Math.sin(mmPulse) * 1.5;
      mmCtx.save();
      mmCtx.translate(mx, mz);
      mmCtx.rotate(Math.PI / 4);
      mmCtx.fillStyle = '#ffcf3e';
      mmCtx.strokeStyle = '#7a5410';
      mmCtx.lineWidth = 1.5;
      mmCtx.fillRect(-r / 2, -r / 2, r, r);
      mmCtx.strokeRect(-r / 2, -r / 2, r, r);
      mmCtx.restore();
    }
    // اللاعب (سهم)
    const px = (player.root.position.x + 700) * mmScale;
    const pz = (player.root.position.z + 700) * mmScale;
    mmCtx.save();
    mmCtx.translate(px, pz);
    mmCtx.rotate(Math.PI - playerState.heading);
    mmCtx.fillStyle = '#e03030';
    mmCtx.beginPath();
    mmCtx.moveTo(0, -7); mmCtx.lineTo(4.5, 5.5); mmCtx.lineTo(-4.5, 5.5);
    mmCtx.closePath(); mmCtx.fill();
    mmCtx.restore();
    // مؤشر الشمال أعلى الدائرة
    mmCtx.fillStyle = 'rgba(20,14,8,0.8)';
    mmCtx.beginPath();
    mmCtx.arc(132, 16, 11, 0, 7);
    mmCtx.fill();
    mmCtx.fillStyle = '#ffe4b0';
    mmCtx.font = 'bold 14px Tahoma, sans-serif';
    mmCtx.textAlign = 'center';
    mmCtx.textBaseline = 'middle';
    mmCtx.fillText('N', 132, 17);
  }

  // ================= اكتشاف المعالم =================
  const visited = new Set();
  const toast = document.getElementById('locToast');
  const counterEl = document.getElementById('counter');
  let toastTimer = null;
  function showToast(txt, long) {
    toast.textContent = txt;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), long ? 6000 : 3200);
  }
  function checkLandmarks() {
    const p = player.root.position;
    for (const l of LANDMARKS) {
      if (!visited.has(l.name) && Math.hypot(p.x - l.x, p.z - l.z) < l.r) {
        visited.add(l.name);
        counterEl.textContent = 'المعالم: ' + visited.size + '/' + LANDMARKS.length;
        showToast('📍 ' + l.name);
        if (visited.size === LANDMARKS.length) {
          setTimeout(() => showToast('🇸🇩 مبروك يا علاء الدين! اكتشفت كل معالم الخرطوم', true), 3400);
        }
        break;
      }
    }
  }

  // ================= نظام المهام =================
  // سلسلة مهام تقود اللاعب عبر معالم الخرطوم — مع مؤشر ماسي متوهج
  const MISSIONS = [
    { title: 'إلى النيل', x: 20, z: -88, r: 15 },
    { title: 'المقرن — ملتقى النيلين', x: -35, z: -35, r: 26 },
    { title: 'برج الفاتح', x: 45, z: -62, r: 28 },
    { title: 'جزيرة توتي', x: -150, z: -150, r: 30 },
    { title: 'مسجد النيلين', x: -240, z: -120, r: 28 },
    { title: 'قبة الإمام المهدي', x: -350, z: -40, r: 28 },
    { title: 'سوق أم درمان', x: -390, z: 60, r: 30 },
    { title: 'بحري عبر كبري شمبات', x: -100, z: -300, r: 24 },
    { title: 'الجامع الكبير', x: 150, z: 150, r: 32 },
    { title: 'السوق العربي', x: 50, z: 150, r: 30 }
  ];
  let missionIdx = 0;
  const missionEl = document.getElementById('mission');

  // مؤشر المهمة: ماسة ذهبية متوهجة تدور فوق حلقة أرضية
  const waypoint = new THREE.Group();
  const wpDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.3),
    new THREE.MeshStandardMaterial({
      color: 0xffd35e, emissive: 0xcc8a1a, emissiveIntensity: 0.9,
      metalness: 0.4, roughness: 0.25
    }));
  wpDiamond.position.y = 3.2;
  waypoint.add(wpDiamond);
  const wpRing = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.3, 26),
    new THREE.MeshBasicMaterial({ color: 0xffcf5e, transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
  wpRing.rotation.x = -Math.PI / 2;
  wpRing.position.y = 0.15;
  waypoint.add(wpRing);
  const wpBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 5.5, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
  wpBeam.position.y = 2.75;
  waypoint.add(wpBeam);
  scene.add(waypoint);

  function setMission(i) {
    if (i < MISSIONS.length) {
      const m = MISSIONS[i];
      missionEl.textContent = 'مهمة: ' + m.title;
      waypoint.visible = true;
      waypoint.position.set(m.x, 0, m.z);
    } else {
      missionEl.textContent = '🇸🇩 استكشاف حر — الخرطوم كلها ليك';
      waypoint.visible = false;
    }
  }
  function checkMission() {
    if (missionIdx >= MISSIONS.length) return;
    const m = MISSIONS[missionIdx];
    const p = player.root.position;
    if (Math.hypot(p.x - m.x, p.z - m.z) < m.r) {
      showToast('✅ تمت المهمة: ' + m.title);
      missionIdx++;
      setTimeout(() => setMission(missionIdx), 1200);
      if (missionIdx >= MISSIONS.length) {
        setTimeout(() => showToast('🇸🇩 أنجزت كل المهام! واصل الاستكشاف الحر', true), 4800);
      }
    }
  }
  setMission(0);

  // ================= البداية والحلقة =================
  const hintEl = document.getElementById('hint');
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startOverlay').style.display = 'none';
    hintEl.textContent = IS_TOUCH
      ? 'المس يسار الشاشة للحركة — اسحب يمينها للكاميرا — «ركوب» قرب التاكسي'
      : 'الأسهم/WASD للحركة — Shift للجري — E لركوب التاكسي — الفأرة للكاميرا';
    setTimeout(() => { hintEl.style.opacity = '0'; hintEl.style.transition = 'opacity 2s'; }, 9000);
    if (IS_TOUCH && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  let elapsed = 0;

  // ---- تفعيل الظلال على المشهد كله ----
  // المجسمات الصلبة تُلقي ظلالاً وتستقبلها؛ الأسطح المستوية تستقبل فقط،
  // والمواد الأساسية (سماء/غيوم/توهجات) خارج نظام الظلال
  scene.traverse(o => {
    if (!(o.isMesh || o.isInstancedMesh)) return;
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (m.isMeshBasicMaterial || m.isShaderMaterial) {
      o.castShadow = false; o.receiveShadow = false;
      return;
    }
    const gt = (o.geometry && o.geometry.type) || '';
    o.castShadow = !/Plane|Circle|Ring/.test(gt);
    o.receiveShadow = true;
  });
  wpDiamond.castShadow = false;

  // نقطة وصول للتصحيح والاختبار
  window.__khartoum = { player: player.root, cam, rideables };

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;

    // ---- مدخلات الحركة ----
    let ix = 0, iy = 0;
    if (keys['ArrowUp'] || keys['KeyW']) iy += 1;
    if (keys['ArrowDown'] || keys['KeyS']) iy -= 1;
    if (keys['ArrowLeft'] || keys['KeyA']) ix -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) ix += 1;
    if (joy.active) { ix += joy.dx; iy += -joy.dy; }
    const inLen = Math.hypot(ix, iy);
    if (inLen > 1) { ix /= inLen; iy /= inLen; }
    const running = keys['ShiftLeft'] || keys['ShiftRight'] || runToggle;
    const speed = running ? 9.5 : 4.4;

    // اتجاهات نسبية للكاميرا
    const fx = -Math.sin(cam.yaw), fz = -Math.cos(cam.yaw);
    const rx = -fz, rz = fx;
    const mvx = fx * iy + rx * ix;
    const mvz = fz * iy + rz * ix;
    const mvLen = Math.hypot(mvx, mvz);

    if (driving) {
      // قيادة التاكسي: أسرع مع دوران سلس
      const carTop = 26;
      const targetVel = mvLen > 0.01 ? carTop : 0;
      driving.vel = lerp(driving.vel, targetVel, dt * (targetVel ? 1.15 : 3.2));
      if (mvLen > 0.01) {
        driving.heading = lerpAngle(driving.heading, Math.atan2(mvx, mvz), 0.06);
      }
      if (driving.vel > 0.3) {
        const hx = Math.sin(driving.heading), hz = Math.cos(driving.heading);
        tryMove(driving.g.position, hx * driving.vel * dt, hz * driving.vel * dt, 1.15);
        for (const w of driving.g.userData.wheels) w.rotation.x += driving.vel * dt / 0.38;
      }
      driving.g.rotation.y = driving.heading;
      player.root.position.copy(driving.g.position);
      playerState.heading = driving.heading;
      playerState.moveAmt = lerp(playerState.moveAmt, 0, 0.2);
    } else if (mvLen > 0.01) {
      tryMove(player.root.position, mvx / mvLen * speed * dt, mvz / mvLen * speed * dt, 0.5);
      playerState.heading = lerpAngle(playerState.heading, Math.atan2(mvx, mvz), 0.18);
      player.root.rotation.y = playerState.heading;
      playerState.moveAmt = lerp(playerState.moveAmt, running ? 1.8 : 1, 0.1);
      playerState.walkTime += dt * (running ? 1.5 : 1);
    } else {
      playerState.moveAmt = lerp(playerState.moveAmt, 0, 0.15);
      playerState.walkTime += dt * 0.3;
    }
    if (!driving) player.animate(playerState.walkTime, playerState.moveAmt);

    // إظهار زر الركوب عند القرب من تاكسي
    rideBtn.style.display = (driving || nearestTaxi()) ? 'flex' : 'none';

    // ---- الكاميرا (مع تقريبها إن اعترض مبنى) ----
    const p = player.root.position;
    const cd = cam.dist + (driving ? 4.5 : 0);
    const cy = Math.sin(cam.pitch) * cd + 1.6;
    const ch = Math.cos(cam.pitch) * cd;
    const ox = Math.sin(cam.yaw) * ch, oz = Math.cos(cam.yaw) * ch;
    let camT = 1;
    for (let tt = 0.18; tt <= 1.001; tt += 0.06) {
      if (collideCircle(p.x + ox * tt, p.z + oz * tt, 0.35)) { camT = Math.max(0.15, tt - 0.06); break; }
    }
    camera.position.set(
      p.x + ox * camT,
      p.y + 1.6 + (cy - 1.6) * camT,
      p.z + oz * camT
    );
    camera.lookAt(p.x, p.y + (driving ? 2.3 : 1.7), p.z);

    // الشمس تتبع اللاعب (لظلال حادة حوله دائماً) والرياح تتقدم
    windU.value = elapsed;
    sun.position.set(p.x + 180, 260, p.z + 120);
    sun.target.position.set(p.x, 0, p.z);

    // ---- السكان ----
    for (const n of npcs) {
      n.t += dt;
      if (n.wait > 0) {
        n.wait -= dt;
        n.ch.animate(n.t, 0);
      } else {
        if (!n.target) {
          let tries = 0, tx, tz;
          do {
            tx = n.area.x1 + rng() * (n.area.x2 - n.area.x1);
            tz = n.area.z1 + rng() * (n.area.z2 - n.area.z1);
          } while ((isWater(tx, tz) || collideCircle(tx, tz, 0.6)) && ++tries < 12);
          n.target = tries < 12 ? [tx, tz] : null;
          if (!n.target) { n.wait = 2; continue; }
        }
        const dx = n.target[0] - n.ch.root.position.x;
        const dz = n.target[1] - n.ch.root.position.z;
        const d = Math.hypot(dx, dz);
        if (d < 1.2) {
          n.target = null;
          n.wait = 1.5 + rng() * 4;
        } else {
          const ox = n.ch.root.position.x, oz = n.ch.root.position.z;
          tryMove(n.ch.root.position, dx / d * n.speed * dt, dz / d * n.speed * dt, 0.45);
          // إن علِق اختر هدفاً جديداً
          if (Math.abs(n.ch.root.position.x - ox) < 0.001 && Math.abs(n.ch.root.position.z - oz) < 0.001) {
            n.target = null; n.wait = 0.5;
          }
          n.ch.root.rotation.y = lerpAngle(n.ch.root.rotation.y, Math.atan2(dx, dz), 0.1);
          n.ch.animate(n.t, 1);
        }
      }
    }

    // ---- المركبات والقوارب ----
    for (const v of vehicles) v.update(dt);
    for (const b of boats) {
      b.position.y = 0.12 + Math.sin(elapsed * 1.3 + b.position.x * 0.05) * 0.08;
      b.rotation.z = Math.sin(elapsed * 0.9 + b.position.x * 0.03) * 0.03;
    }

    // ---- العجلة الدوارة ----
    if (ferrisWheel) {
      ferrisWheel.rotation.z += dt * 0.22;
      const a = ferrisWheel.rotation.z;
      ferrisGondolas.forEach((gon, i) => {
        gon.rotation.z = -a; // تبقى الكبائن معتدلة
      });
    }

    // ---- الماعز ----
    for (const gt of goats) {
      gt.t -= dt;
      if (gt.t <= 0) { gt.a = rng() * Math.PI * 2; gt.t = 2 + rng() * 5; }
      const nx = gt.g.position.x + Math.sin(gt.a) * 0.5 * dt;
      const nz = gt.g.position.z + Math.cos(gt.a) * 0.5 * dt;
      if (Math.hypot(nx - gt.hx, nz - gt.hz) < 14 && !isWater(nx, nz) && !collideCircle(nx, nz, 0.3)) {
        gt.g.position.x = nx; gt.g.position.z = nz;
        gt.g.rotation.y = gt.a;
      } else { gt.t = 0; }
    }

    // ---- الأعلام والغيوم والماء ----
    for (const f of flags) {
      f.rotation.y = Math.sin(elapsed * 2.2) * 0.22;
      f.rotation.x = Math.sin(elapsed * 3.1) * 0.05;
    }
    for (const c of clouds) {
      c.position.x += dt * 2.2;
      if (c.position.x > 900) c.position.x = -900;
    }
    for (const t of waterTextures) t.offset.x += dt * 0.018;

    // ---- مؤشر المهمة ----
    if (waypoint.visible) {
      wpDiamond.rotation.y += dt * 2.2;
      wpDiamond.position.y = 3.2 + Math.sin(elapsed * 2.5) * 0.35;
      wpRing.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.12);
      wpRing.material.opacity = 0.55 + Math.sin(elapsed * 3) * 0.2;
    }

    checkLandmarks();
    checkMission();
    drawMinimap();
    renderer.render(scene, camera);
  }
  animate();
})();
