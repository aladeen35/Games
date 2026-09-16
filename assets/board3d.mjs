/* =====================================================================
   مشهد ثلاثي الأبعاد للألعاب اللوحية — طابع سوداني عند الغروب
   طبقة عرض فقط: تقرأ حالة الرقعة من DOM وتعيد توجيه اللمسات إلى نفس
   منطق اللعبة، فلا تمسّ قوانين أي لعبة.
===================================================================== */
import * as T from './three.mjs';

const THEMES = {
  nut:   { slab:0x8f5526, slabTop:0xdda468, line:0x63380f, sky:[0x1b2a55,0xd9622c,0xf6cf87], sun:0xffb347, sand:0xc98c4e },
  sija:  { slab:0xb3946a, slabTop:0xe2cfa4, line:0x74542a, sky:[0x203366,0xdd7a3a,0xf8e0ad], sun:0xffc76b, sand:0xd4b483 },
  seega: { slab:0x5c5347, slabTop:0xb5a893, line:0x332c20, sky:[0x141f3f,0xc4562a,0xeab97c], sun:0xffab5e, sand:0xa4907a },
};
const SHAPE_TINT = {
  'dog-star.png':0x6f8f33, 'dog-spiral.png':0x2668b4, 'dog-diamond.png':0xb03124,
  'dog-circle.png':0xd18b18, 'dog-wave.png':0x22907f, 'dog-square.png':0x6d45ad,
};

let renderer, scene, camera, clock, raf = null;
let boardGroup, piecesGroup, fxGroup, sunLight;
let cellMeshes = [];
let hostEl = null, domBoard = null;
let theme = THEMES.nut, themeKey = 'nut', gridN = 5;
let prevMap = new Map();              // فهرس المربع -> مفتاح القطعة
const meshByCell = new Map();         // فهرس المربع -> مجسّم القطعة
const texCache = new Map();
const anims = [];
let dust, lanterns = [], sunMesh;
let started = false, visible = false;
let pieceGeo = null, ringGeo = null;
const highlights = [];

const CELL = 1.0, GAP = 0.07, REST_Y = 0.22;   // ارتفاع القطعة فوق سطح اللوح
const loader = new T.TextureLoader();

function tex(url) {
  if (texCache.has(url)) return texCache.get(url);
  const t = loader.load(url);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(url, t);
  return t;
}
const span = () => gridN * CELL + (gridN - 1) * GAP;
function cellPos(idx) {
  const r = Math.floor(idx / gridN), c = idx % gridN, s = span();
  return new T.Vector3(-s / 2 + CELL / 2 + c * (CELL + GAP), REST_Y, -s / 2 + CELL / 2 + r * (CELL + GAP));
}

/* ======================= بناء المشهد ======================= */
function buildSky() {
  const sky = new T.Mesh(
    new T.SphereGeometry(150, 32, 20),
    new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new T.Color(theme.sky[0]) },
        mid: { value: new T.Color(theme.sky[1]) },
        bot: { value: new T.Color(theme.sky[2]) },
      },
      vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform vec3 top,mid,bot; varying vec3 vP;',
        'void main(){',
        '  float h = clamp((normalize(vP).y+0.3)/1.3, 0.0, 1.0);',
        '  vec3 c = h < 0.45 ? mix(bot, mid, smoothstep(0.0,0.45,h)) : mix(mid, top, smoothstep(0.45,1.0,h));',
        '  gl_FragColor = vec4(c,1.0);',
        '}'
      ].join('\n')
    })
  );
  sky.name = 'sky';
  scene.add(sky);

  // الشمس تغرب خلف الكثبان: نصفها السفلي يحجبه الرمل فتبدو ملامسة للأفق
  sunMesh = new T.Mesh(new T.SphereGeometry(4.6, 28, 18),
    new T.MeshBasicMaterial({ color: 0xffe0a0, fog: false }));
  sunMesh.position.set(-13, -0.9, -46);
  scene.add(sunMesh);

  [[9.5, 0.22], [15, 0.12], [22, 0.07]].forEach(([r, o]) => {
    const halo = new T.Mesh(new T.SphereGeometry(r, 20, 14),
      new T.MeshBasicMaterial({ color: theme.sun, transparent: true, opacity: o, fog: false, depthWrite: false }));
    halo.position.copy(sunMesh.position);
    scene.add(halo);
  });
}

function buildGround() {
  const g = new T.PlaneGeometry(340, 340, 44, 44);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), d = Math.hypot(x, y);
    const n = Math.sin(x * 0.07) * Math.cos(y * 0.06) * 1.3 + Math.sin(x * 0.021 + y * 0.03) * 2.6;
    p.setZ(i, d > 13 ? n * Math.min(1, (d - 13) / 24) : 0);
  }
  g.computeVertexNormals();
  const ground = new T.Mesh(g, new T.MeshStandardMaterial({ color: theme.sand, roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.62;
  ground.receiveShadow = true;
  scene.add(ground);
}

function acacia(x, z, s) {
  const gp = new T.Group();
  const trunk = new T.Mesh(new T.CylinderGeometry(0.1 * s, 0.24 * s, 2.2 * s, 6),
    new T.MeshStandardMaterial({ color: 0x1e1409, roughness: 1 }));
  trunk.position.y = 1.1 * s;
  gp.add(trunk);
  const canopyMat = new T.MeshStandardMaterial({ color: 0x241a0b, roughness: 1 });
  [[0, 2.5, 0, 1.6], [0.95, 2.25, 0.3, 1.05], [-0.9, 2.3, -0.25, 0.95]].forEach(([dx, dy, dz, r]) => {
    const c = new T.Mesh(new T.SphereGeometry(r * s, 8, 6), canopyMat);
    c.position.set(dx * s, dy * s, dz * s);
    c.scale.y = 0.4;
    gp.add(c);
  });
  gp.position.set(x, -0.62, z);
  scene.add(gp);
}

function tukul(x, z, s) {
  const gp = new T.Group();
  const wall = new T.Mesh(new T.CylinderGeometry(0.85 * s, 0.95 * s, 1.1 * s, 10),
    new T.MeshStandardMaterial({ color: 0x8a6230, roughness: 1 }));
  wall.position.y = 0.55 * s;
  const roof = new T.Mesh(new T.ConeGeometry(1.15 * s, 1.15 * s, 10),
    new T.MeshStandardMaterial({ color: 0x5b3c17, roughness: 1 }));
  roof.position.y = 1.65 * s;
  gp.add(wall); gp.add(roof);
  gp.position.set(x, -0.62, z);
  gp.castShadow = true;
  scene.add(gp);
}

function buildScenery() {
  // أشجار سنط قريبة تؤطّر الرقعة
  acacia(-10.5, -14.5, 1.35); acacia(11.5, -16.5, 1.6); acacia(-15, -7.5, 1.05);
  acacia(15, -6.5, 0.95); acacia(-21, -23, 2.0); acacia(23, -27, 2.3);
  // قطاطي سودانية في الخلفية
  tukul(-14.5, -16, 1.3); tukul(-11.5, -18.5, 1.05); tukul(16, -19, 1.2);
  const dm = new T.MeshStandardMaterial({ color: theme.sand, roughness: 1 });
  [[-34, -46, 26, 11], [26, -54, 30, 13], [58, -44, 24, 9], [-62, -40, 26, 10],
   [-48, -74, 36, 12], [32, -84, 42, 14]].forEach(([x, z, rx, ry]) => {
    const d = new T.Mesh(new T.SphereGeometry(1, 16, 10), dm);
    d.scale.set(rx, ry, rx * 0.6);
    d.position.set(x, -0.62 - ry * 0.45, z);
    scene.add(d);
  });
  const rm = new T.MeshStandardMaterial({ color: 0x8a7150, roughness: 1 });
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2, d = 5.8 + Math.random() * 7.5, s = 0.11 + Math.random() * 0.22;
    const st = new T.Mesh(new T.DodecahedronGeometry(s, 0), rm);
    st.position.set(Math.cos(a) * d, -0.56, Math.sin(a) * d);
    st.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    st.castShadow = true;
    scene.add(st);
  }
}

function buildBoard() {
  if (boardGroup) scene.remove(boardGroup);
  boardGroup = new T.Group();
  cellMeshes = [];
  const s = span(), pad = 0.5;

  const base = new T.Mesh(new T.BoxGeometry(s + pad * 2, 0.6, s + pad * 2),
    new T.MeshStandardMaterial({ color: theme.slab, roughness: 0.95, metalness: 0.02 }));
  base.position.y = -0.32;
  base.castShadow = true; base.receiveShadow = true;
  boardGroup.add(base);

  const rim = new T.Mesh(new T.BoxGeometry(s + pad * 2 - 0.16, 0.08, s + pad * 2 - 0.16),
    new T.MeshStandardMaterial({ color: theme.line, roughness: 1 }));
  rim.position.y = 0.0;
  boardGroup.add(rim);

  const cellMat = new T.MeshStandardMaterial({ color: theme.slabTop, roughness: 0.88, metalness: 0.02 });
  for (let i = 0; i < gridN * gridN; i++) {
    const c = new T.Mesh(new T.BoxGeometry(CELL, 0.14, CELL), cellMat.clone());
    c.position.copy(cellPos(i));
    c.position.y = 0.05;
    c.receiveShadow = true;
    c.userData.cell = i;
    boardGroup.add(c);
    cellMeshes.push(c);
  }
  scene.add(boardGroup);
}

function buildFx() {
  fxGroup = new T.Group();
  scene.add(fxGroup);

  const N = 240, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 28;
    pos[i * 3 + 1] = Math.random() * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3));
  dust = new T.Points(g, new T.PointsMaterial({
    color: 0xffd9a0, size: 0.08, transparent: true, opacity: 0.6,
    blending: T.AdditiveBlending, depthWrite: false
  }));
  fxGroup.add(dust);

  lanterns = [];
  for (let i = 0; i < 6; i++) {
    const l = new T.Mesh(new T.SphereGeometry(0.11, 10, 8),
      new T.MeshBasicMaterial({ color: 0xffc46b, transparent: true, opacity: 0.9, fog: false }));
    const glow = new T.Mesh(new T.SphereGeometry(0.3, 10, 8),
      new T.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.18, depthWrite: false, fog: false }));
    l.add(glow);
    const a = (i / 6) * Math.PI * 2;
    l.userData = { a, r: 4.6 + Math.random() * 2.2, y: 1.6 + Math.random() * 1.8, sp: 0.09 + Math.random() * 0.07 };
    fxGroup.add(l);
    lanterns.push(l);
  }
}

function buildLights() {
  scene.add(new T.HemisphereLight(0xffcf96, 0x7a5326, 1.0));
  sunLight = new T.DirectionalLight(0xffb463, 2.9);
  sunLight.position.set(-6.5, 8.5, -5.5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1536, 1536);
  const d = 6.5;
  Object.assign(sunLight.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 0.5, far: 40 });
  sunLight.shadow.bias = -0.0015;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);
  const rim = new T.DirectionalLight(0x5f8fff, 0.95);
  rim.position.set(8, 4.5, 9);
  scene.add(rim);
}

/* ======================= القطع ======================= */
function makePiece(shapeFile) {
  if (!pieceGeo) pieceGeo = new T.CylinderGeometry(0.4, 0.44, 0.19, 30);
  const tint = SHAPE_TINT[shapeFile] || 0x999999;
  const side = new T.MeshStandardMaterial({ color: tint, roughness: 0.62, metalness: 0.05 });
  const top = new T.MeshStandardMaterial({ map: tex('assets/' + shapeFile), roughness: 0.6, metalness: 0.04 });
  const bottom = new T.MeshStandardMaterial({ color: tint, roughness: 0.9 });
  const m = new T.Mesh(pieceGeo, [side, top, bottom]);
  m.castShadow = true;
  m.receiveShadow = false;
  m.userData.shape = shapeFile;
  return m;
}

function makeHighlight(color, dashed) {
  if (!ringGeo) ringGeo = new T.TorusGeometry(0.33, 0.045, 8, 26);
  const m = new T.Mesh(ringGeo, new T.MeshBasicMaterial({
    color, transparent: true, opacity: 0.95, depthWrite: false, fog: false
  }));
  m.rotation.x = -Math.PI / 2;
  m.userData.dashed = !!dashed;
  return m;
}

/* ======================= مزامنة الحالة من DOM ======================= */
function readDom() {
  const cells = domBoard ? domBoard.children : [];
  const n = Math.round(Math.sqrt(cells.length)) || gridN;
  const state = { n, pieces: new Map(), moves: [], jumps: [], last: [], win: [] };
  for (let i = 0; i < cells.length; i++) {
    const el = cells[i];
    const cl = el.classList;
    if (cl.contains('moveTarget') || cl.contains('placeTarget')) state.moves.push(i);
    if (cl.contains('jumpTarget') || cl.contains('eatTarget')) state.jumps.push(i);
    if (cl.contains('lastMove')) state.last.push(i);
    if (cl.contains('winLine')) state.win.push(i);
    const img = el.querySelector('.piece img');
    if (img) {
      const file = (img.getAttribute('src') || '').split('/').pop();
      state.pieces.set(i, {
        file,
        selected: el.querySelector('.piece').classList.contains('selected')
      });
    }
  }
  return state;
}

function clearHighlights() {
  highlights.forEach(h => { scene.remove(h); h.geometry && null; h.material.dispose(); });
  highlights.length = 0;
}

function applyHighlights(st) {
  clearHighlights();
  st.moves.forEach(i => {
    const h = makeHighlight(0xffd766);
    h.position.copy(cellPos(i)); h.position.y = 0.15;
    scene.add(h); highlights.push(h);
  });
  st.jumps.forEach(i => {
    const h = makeHighlight(0xff5a45, true);
    h.position.copy(cellPos(i)); h.position.y = 0.15;
    h.scale.setScalar(1.25);
    scene.add(h); highlights.push(h);
  });
  cellMeshes.forEach((c, i) => {
    const lit = st.last.includes(i), win = st.win.includes(i);
    c.material.emissive = new T.Color(win ? 0xffb300 : (lit ? 0x7a4a10 : 0x000000));
    c.material.emissiveIntensity = win ? 0.75 : (lit ? 0.5 : 0);
  });
}

function sync() {
  if (!started || !visible || !domBoard) return;
  const st = readDom();
  if (st.n !== gridN && st.n > 0) {
    gridN = st.n;
    buildBoard();
    meshByCell.forEach(m => piecesGroup.remove(m));
    meshByCell.clear();
    prevMap.clear();
    fitCamera();
  }
  const now = new Map();
  st.pieces.forEach((v, i) => now.set(i, v.file));

  const removed = [], added = [];
  prevMap.forEach((file, i) => { if (now.get(i) !== file) removed.push([i, file]); });
  now.forEach((file, i) => { if (prevMap.get(i) !== file) added.push([i, file]); });

  // مطابقة انتقال قطعة واحدة (خطوة أو نطّة)
  const used = new Set();
  added.forEach(([toIdx, file]) => {
    const src = removed.find(([fi, ff], k) => ff === file && !used.has(k));
    if (src) {
      const k = removed.indexOf(src);
      used.add(k);
      const mesh = meshByCell.get(src[0]);
      if (mesh) {
        meshByCell.delete(src[0]);
        meshByCell.set(toIdx, mesh);
        const from = mesh.position.clone(), to = cellPos(toIdx);
        const dist = Math.max(Math.abs(Math.floor(toIdx / gridN) - Math.floor(src[0] / gridN)),
          Math.abs((toIdx % gridN) - (src[0] % gridN)));
        anims.push({ mesh, from, to, t: 0, dur: dist > 1 ? 0.5 : 0.34, arc: dist > 1 ? 1.15 : 0.25, kind: 'move' });
        return;
      }
    }
    // قطعة جديدة (إنزال/رصّ)
    const m = makePiece(file);
    m.position.copy(cellPos(toIdx));
    m.position.y = REST_Y + 2.4;
    piecesGroup.add(m);
    meshByCell.set(toIdx, m);
    anims.push({ mesh: m, from: m.position.clone(), to: cellPos(toIdx), t: 0, dur: 0.38, arc: 0, kind: 'drop' });
  });

  // قطع أُكلت
  removed.forEach(([fi], k) => {
    if (used.has(k)) return;
    const mesh = meshByCell.get(fi);
    if (mesh && !now.has(fi)) {
      meshByCell.delete(fi);
      anims.push({ mesh, t: 0, dur: 0.45, kind: 'poof' });
      burst(mesh.position.clone());
    } else if (mesh) {
      meshByCell.delete(fi);
      piecesGroup.remove(mesh);
    }
  });

  // تصحيح أي فروق متبقية
  now.forEach((file, i) => {
    if (!meshByCell.has(i)) {
      const m = makePiece(file);
      m.position.copy(cellPos(i));
      piecesGroup.add(m);
      meshByCell.set(i, m);
    }
  });
  meshByCell.forEach((m, i) => {
    if (!now.has(i)) { piecesGroup.remove(m); meshByCell.delete(i); }
  });

  // الاختيار: رفع القطعة قليلاً
  meshByCell.forEach((m, i) => {
    const info = st.pieces.get(i);
    m.userData.sel = !!(info && info.selected);
  });

  prevMap = now;
  applyHighlights(st);
}

/* انفجار غبار عند الأكل */
const bursts = [];
function burst(pos) {
  const N = 26, arr = new Float32Array(N * 3), vel = [];
  for (let i = 0; i < N; i++) {
    arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y + 0.1; arr[i * 3 + 2] = pos.z;
    const a = Math.random() * Math.PI * 2, sp = 0.6 + Math.random() * 1.6;
    vel.push(new T.Vector3(Math.cos(a) * sp, 1.2 + Math.random() * 1.8, Math.sin(a) * sp));
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(arr, 3));
  const pts = new T.Points(g, new T.PointsMaterial({
    color: 0xe8c28a, size: 0.13, transparent: true, opacity: 0.95, depthWrite: false
  }));
  scene.add(pts);
  bursts.push({ pts, vel, t: 0 });
}

/* ======================= الكاميرا واللمس ======================= */
function fitCamera() {
  const s = span();
  const dist = s * 1.36 + 2.1;
  camera.position.set(0, dist * 0.58, dist * 0.90);
  camera.lookAt(0, 1.0, -0.45);
}

const ray = new T.Raycaster(), ndc = new T.Vector2();
function onTap(ev) {
  if (!visible || !domBoard) return;
  const t = ev.changedTouches ? ev.changedTouches[0] : ev;
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
  ray.setFromCamera(ndc, camera);
  const targets = cellMeshes.concat(Array.from(meshByCell.values()));
  const hits = ray.intersectObjects(targets, false);
  if (!hits.length) return;
  let idx = hits[0].object.userData.cell;
  if (idx === undefined) {
    // لمس قطعة: ابحث عن مربعها
    meshByCell.forEach((m, i) => { if (m === hits[0].object) idx = i; });
  }
  if (idx === undefined) return;
  const cellEl = domBoard.children[idx];
  if (cellEl) cellEl.click();
}

/* ======================= الحلقة ======================= */
function loop() {
  raf = requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05), et = clock.elapsedTime;

  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i];
    a.t += dt;
    const k = Math.min(1, a.t / a.dur);
    if (a.kind === 'poof') {
      a.mesh.scale.setScalar(Math.max(0.001, 1 - k));
      a.mesh.position.y = REST_Y + k * 0.75;
      a.mesh.rotation.z = k * 2.2;
      if (k >= 1) { piecesGroup.remove(a.mesh); anims.splice(i, 1); }
      continue;
    }
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    a.mesh.position.lerpVectors(a.from, a.to, e);
    a.mesh.position.y = REST_Y + (a.kind === 'drop' ? (a.from.y - REST_Y) * (1 - e) : 0) + Math.sin(Math.PI * k) * a.arc;
    if (a.kind === 'move' && a.arc > 0.5) a.mesh.rotation.x = Math.sin(Math.PI * k) * 0.5;
    if (k >= 1) { a.mesh.position.copy(a.to); a.mesh.rotation.x = 0; anims.splice(i, 1); }
  }

  meshByCell.forEach(m => {
    const busy = anims.some(a => a.mesh === m);
    if (busy) return;
    const target = REST_Y + (m.userData.sel ? 0.34 : 0);
    m.position.y += (target - m.position.y) * Math.min(1, dt * 12);
    if (m.userData.sel) m.rotation.y += dt * 1.1;
  });

  highlights.forEach((h, i) => {
    const s = 1 + Math.sin(et * 3.4 + i) * 0.12;
    h.scale.set(s * (h.userData.dashed ? 1.25 : 1), s * (h.userData.dashed ? 1.25 : 1), s);
    h.material.opacity = 0.65 + Math.sin(et * 3.4 + i) * 0.3;
  });

  if (dust) {
    dust.rotation.y = et * 0.012;
    const p = dust.geometry.attributes.position;
    for (let i = 1; i < p.count * 3; i += 3) {
      p.array[i] += dt * 0.12;
      if (p.array[i] > 8) p.array[i] = 0;
    }
    p.needsUpdate = true;
  }
  lanterns.forEach((l, i) => {
    const d = l.userData;
    l.position.set(Math.cos(d.a + et * d.sp) * d.r, d.y + Math.sin(et * 0.8 + i) * 0.28, Math.sin(d.a + et * d.sp) * d.r);
  });

  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.t += dt;
    const p = b.pts.geometry.attributes.position;
    for (let j = 0; j < b.vel.length; j++) {
      p.array[j * 3] += b.vel[j].x * dt;
      p.array[j * 3 + 1] += b.vel[j].y * dt;
      p.array[j * 3 + 2] += b.vel[j].z * dt;
      b.vel[j].y -= dt * 3.4;
    }
    p.needsUpdate = true;
    b.pts.material.opacity = Math.max(0, 0.95 - b.t / 0.75);
    if (b.t > 0.8) { scene.remove(b.pts); b.pts.geometry.dispose(); b.pts.material.dispose(); bursts.splice(i, 1); }
  }

  const sway = Math.sin(et * 0.22) * 0.05;
  camera.position.x = sway * span() * 0.35;
  camera.lookAt(0, 1.0, -0.45);

  renderer.render(scene, camera);
}

function resize() {
  if (!hostEl || !renderer) return;
  const w = hostEl.clientWidth, h = hostEl.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ======================= الواجهة العامة ======================= */
function start(host, dom, key) {
  hostEl = host; domBoard = dom;
  themeKey = key || 'nut';
  theme = THEMES[themeKey] || THEMES.nut;
  if (started) { rebuildTheme(); return; }

  renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.id = 'c3d';
  host.appendChild(renderer.domElement);

  scene = new T.Scene();
  scene.fog = new T.Fog(theme.sky[2], 26, 115);
  camera = new T.PerspectiveCamera(50, 1, 0.1, 400);
  clock = new T.Clock();

  buildSky(); buildGround(); buildScenery(); buildLights();
  piecesGroup = new T.Group(); scene.add(piecesGroup);
  buildBoard(); buildFx();
  fitCamera(); resize();

  renderer.domElement.addEventListener('pointerdown', onTap);
  window.addEventListener('resize', resize);
  started = true;
  loop();
}

function rebuildTheme() {
  const sky = scene.getObjectByName('sky');
  if (sky) {
    sky.material.uniforms.top.value.set(theme.sky[0]);
    sky.material.uniforms.mid.value.set(theme.sky[1]);
    sky.material.uniforms.bot.value.set(theme.sky[2]);
  }
  if (sunMesh) sunMesh.material.color.set(theme.sun);
  scene.fog.color.set(theme.sky[2]);
  scene.traverse(o => {
    if (o.isMesh && o.material && o.material.color && o.userData.cell !== undefined) o.material.color.set(theme.slabTop);
  });
  if (boardGroup) {
    boardGroup.children.forEach(c => {
      if (c.userData.cell === undefined && c.material) {
        c.material.color.set(c.geometry.parameters.height > 0.3 ? theme.slab : theme.line);
      }
    });
  }
}

export default {
  start,
  sync,
  show(host, dom, key) {
    start(host, dom, key);
    visible = true;
    renderer.domElement.style.display = 'block';
    prevMap.clear();
    meshByCell.forEach(m => piecesGroup.remove(m));
    meshByCell.clear();
    resize();
    sync();
  },
  hide() {
    visible = false;
    if (renderer) renderer.domElement.style.display = 'none';
  },
  isOn: () => visible,
  resize,
};
