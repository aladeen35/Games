// Three.js scene: shell-textured rug driven by the simulation masks, tool models, particles,
// three environments (courtyard, workshop, showroom) and day/night lighting.
import * as THREE from 'three';
import { groundCanvas } from './patterns.js';
import { STAINS, STAIN_IDS } from './content.js';

const RUG_VERT = /* glsl */`
attribute float aLayer; varying vec2 vUv; varying float vLayer; varying vec3 vWorld;
uniform float uPile;
void main(){ vUv = uv; vLayer = aLayer; vec3 p = position; p.y += aLayer * uPile;
  vec4 w = modelMatrix * vec4(p,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const RUG_FRAG = /* glsl */`
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
}`;

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
  const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a6a45, 0.9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.4); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -6; sun.shadow.camera.right = 6; sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6; sun.shadow.bias = -0.0015;
  scene.add(sun); scene.add(sun.target);
  const spot = new THREE.SpotLight(0xffe2b0, 0, 12, 0.5, 0.6, 1); spot.position.set(0, 5, 1.5); scene.add(spot); scene.add(spot.target);

  const S = { renderer, scene, camera, quality: 1, view: 'work', envKind: null, rug: null, time: 0, toolPos: new THREE.Vector3(0, 0, -99),
    sunDir: new THREE.Vector3(0.4, 0.8, 0.3), sunCol: new THREE.Color(1, 0.95, 0.85), amb: new THREE.Color(0.45, 0.47, 0.5), hud: { top: 120, bottom: 210 } };
  const env = new THREE.Group(); scene.add(env);
  const rugGroup = new THREE.Group(); scene.add(rugGroup);
  const toolGroup = new THREE.Group(); scene.add(toolGroup);
  const std = (color, rough = 0.85, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const mesh = (geo, mat, x = 0, y = 0, z = 0, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; return m; };
  const box = (w, h, d, mat, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const cyl = (r1, r2, h, mat, x, y, z, seg = 20) => mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat, x, y, z);

  // ---- environments -------------------------------------------------------------------------
  function setEnv(kind) {
    if (S.envKind === kind) return; S.envKind = kind;
    env.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); env.clear();
    const tex = new THREE.CanvasTexture(groundCanvas(kind)); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(8, 8); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const ground = mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: tex, roughness: kind === 'yard' ? 0.95 : 0.35, metalness: 0 }), 0, 0, 0, false);
    ground.rotation.x = -Math.PI / 2; env.add(ground);
    if (kind === 'yard') { // a family courtyard (hosh): plaster walls, metal gate, water barrel, neem tree, zeer pots
      const wall = std(0xd9b98a), trim = std(0x1fa6a0, 0.5, 0.3);
      env.add(box(14, 2.6, 0.25, wall, 0, 1.3, -5.2), box(0.25, 2.6, 12, wall, -6.2, 1.3, 0), box(0.25, 2.6, 12, wall, 6.2, 1.3, 0));
      env.add(box(14.1, 0.12, 0.32, std(0xb8946a), 0, 2.66, -5.2));
      env.add(box(1.9, 2.2, 0.08, trim, 3.4, 1.1, -5.05), box(0.08, 2.2, 0.1, std(0x0f6f6a), 3.4, 1.1, -5.0));
      env.add(box(1.2, 1.0, 0.06, std(0x6b8fae, 0.3), -3.2, 1.6, -5.05), box(1.3, 0.08, 0.1, std(0x7a5a3a), -3.2, 1.05, -5.0));
      env.add(cyl(0.38, 0.38, 1.0, std(0x2f6fb0, 0.5, 0.2), -5.3, 0.5, -4.2), cyl(0.4, 0.4, 0.04, std(0x1f4f80), -5.3, 1.02, -4.2));
      env.add(cyl(0.16, 0.2, 2.2, std(0x6b4a2b), 5.0, 1.1, -3.8, 8));
      for (const [x, y, z, r] of [[5, 2.7, -3.8, 1.2], [4.4, 2.3, -3.3, 0.8], [5.6, 2.4, -4.2, 0.9]]) env.add(mesh(new THREE.IcosahedronGeometry(r, 1), std(0x4f7d3a, 1), x, y, z));
      for (const x of [-1.2, -0.5]) { env.add(mesh(new THREE.SphereGeometry(0.3, 16, 12), std(0xb5654a, 0.9), x - 4, 0.42, -4.5), cyl(0.2, 0.26, 0.12, std(0x5a3a2a), x - 4, 0.06, -4.5)); }
      env.add(cyl(0.02, 0.02, 9, std(0x444444), 0, 2.2, -4.6, 6).rotateZ(Math.PI / 2));
      for (const [x, c] of [[-1.5, 0xb8322a], [0.2, 0x1f3a6e], [1.6, 0xe9c46a]]) env.add(box(0.9, 1.1, 0.03, std(c, 1), x, 1.62, -4.6));
    } else if (kind === 'shop') { // rented workshop: white tile, drain, racks, counter, shutters
      const wall = std(0xeef0ee), blue = std(0x1c2452, 0.6);
      env.add(box(14, 3.2, 0.2, wall, 0, 1.6, -4.6), box(0.2, 3.2, 12, wall, -5.6, 1.6, 0), box(0.2, 3.2, 12, wall, 5.6, 1.6, 0));
      env.add(box(14, 0.9, 0.22, blue, 0, 0.45, -4.58), box(0.22, 0.9, 12, blue, -5.58, 0.45, 0), box(0.22, 0.9, 12, blue, 5.58, 0.45, 0));
      env.add(box(2.6, 0.9, 0.7, std(0x7a5a3a, 0.6), -3.6, 0.45, -3.9), box(2.7, 0.06, 0.8, std(0xc47a3d, 0.4), -3.6, 0.93, -3.9));
      for (let k = 0; k < 4; k++) env.add(cyl(0.16, 0.16, 1.5, std([0x8e1b1b, 0x1f3a6e, 0xe9c46a, 0x2a9d8f][k], 1), 2.2 + k * 0.42, 0.85, -4.2, 14));
      env.add(box(2.2, 0.06, 0.5, std(0x999999, 0.4, 0.6), 2.85, 0.08, -4.2), box(3.0, 0.5, 0.05, std(0x1fa6a0, 0.5), 0, 2.6, -4.48));
      env.add(cyl(0.3, 0.3, 0.9, std(0x2f6fb0, 0.5), 4.9, 0.45, -3.9));
    } else { // showroom hall: dark polished floor, arches, hanging rugs
      const wall = std(0x2a2330), gold = std(0xc9a24b, 0.35, 0.8);
      env.add(box(16, 5, 0.3, wall, 0, 2.5, -5), box(0.3, 5, 14, wall, -6.5, 2.5, 0), box(0.3, 5, 14, wall, 6.5, 2.5, 0));
      for (const x of [-4.2, -1.4, 1.4, 4.2]) { env.add(cyl(0.16, 0.2, 4.2, std(0xe8dcc4, 0.5), x, 2.1, -4.5), box(0.5, 0.12, 0.5, gold, x, 4.25, -4.5)); }
      env.add(cyl(1.9, 2.0, 0.16, std(0x3a2f3f, 0.4), 0, 0.08, 0, 40), mesh(new THREE.TorusGeometry(1.95, 0.03, 8, 60), gold, 0, 0.17, 0).rotateX(Math.PI / 2));
    }
  }

  // ---- rug ----------------------------------------------------------------------------------
  let masks = null;
  function setRug(rug, patternCanvas) {
    rugGroup.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); }); rugGroup.clear();
    if (masks) for (const t of masks.tex) t.dispose();
    S.rug = rug; if (!rug) return;
    const { w, h } = rug.spec, pile = rug.mat.pile;
    const shells = S.quality === 0 ? 1 : pile > 1 ? (S.quality === 2 ? 20 : 12) : pile > 0.3 ? (S.quality === 2 ? 10 : 7) : 4;
    const pos = [], uv = [], lay = [], idx = [];
    for (let k = 0; k < shells; k++) {
      const l = shells === 1 ? 0 : k / (shells - 1), o = k * 4;
      pos.push(-w / 2, 0, -h / 2, w / 2, 0, -h / 2, w / 2, 0, h / 2, -w / 2, 0, h / 2);
      uv.push(0, 0, 1, 0, 1, 1, 0, 1); lay.push(l, l, l, l); idx.push(o, o + 2, o + 1, o, o + 3, o + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('aLayer', new THREE.Float32BufferAttribute(lay, 1)); geo.setIndex(idx);
    const mk = () => { const t = new THREE.DataTexture(new Uint8Array(rug.n * 4), rug.W, rug.H, THREE.RGBAFormat); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; };
    masks = { tex: [mk(), mk(), mk(), mk()] };
    const D = masks.tex[3].image.data;
    for (let i = 0; i < rug.n; i++) { const c = rug.stainType[i] ? STAINS[STAIN_IDS[rug.stainType[i] - 1]].color : [0.4, 0.3, 0.2]; D[i * 4] = c[0] * 255; D[i * 4 + 1] = c[1] * 255; D[i * 4 + 2] = c[2] * 255; D[i * 4 + 3] = 255; }
    // spread stain colour into neighbours so linear filtering has no dark fringe
    const pat = new THREE.CanvasTexture(patternCanvas); pat.colorSpace = THREE.SRGBColorSpace; pat.anisotropy = 4; pat.flipY = false;
    const g2 = patternCanvas.getContext('2d').getImageData(patternCanvas.width >> 1, patternCanvas.height >> 3, 1, 1).data;
    const mat = new THREE.ShaderMaterial({ vertexShader: RUG_VERT, fragmentShader: RUG_FRAG, uniforms: {
      tPattern: { value: pat }, tA: { value: masks.tex[0] }, tB: { value: masks.tex[1] }, tC: { value: masks.tex[2] }, tD: { value: masks.tex[3] },
      uSize: { value: new THREE.Vector2(w, h) }, uDensity: { value: pile > 1 ? 230 : 420 }, uPile: { value: 0.004 + pile * 0.011 }, uTime: { value: 0 }, uOverlay: { value: 0 },
      uFade: { value: 0 }, uShells: { value: shells }, uSun: { value: S.sunDir }, uSunCol: { value: S.sunCol }, uAmb: { value: S.amb }, uTool: { value: new THREE.Vector3(0, -99, 0.2) },
      uDye: { value: new THREE.Color().setRGB(g2[0] / 255, g2[1] / 255, g2[2] / 255, THREE.SRGBColorSpace) } } });
    const m = new THREE.Mesh(geo, mat); m.position.y = 0.022; m.frustumCulled = false; rugGroup.add(m);
    rugGroup.add(box(w + 0.01, 0.02, h + 0.01, std(0x9a8566, 1), 0, 0.011, 0));
    const fr = std(0xeee6d2, 1); // fringes on the short ends
    for (const z of [-h / 2 - 0.035, h / 2 + 0.035]) for (let x = -w / 2 + 0.015; x < w / 2; x += 0.03) rugGroup.add(box(0.012, 0.006, 0.07, fr, x, 0.006, z));
    S.rugMat = mat; rugGroup.rotation.y = 0; rugGroup.position.set(0, S.envKind === 'hall' ? 0.17 : 0, 0);
    updateMasks(); fit();
  }
  function updateMasks() {
    const rug = S.rug; if (!rug) return;
    const [A, B, C] = masks.tex.map((t) => t.image.data);
    for (let i = 0, j = 0; i < rug.n; i++, j += 4) {
      A[j] = rug.dust[i] * 255; A[j + 1] = rug.soil[i] * 255; A[j + 2] = rug.stain[i] * 255; A[j + 3] = rug.wet[i] * 170;
      B[j] = rug.foam[i] * 255; B[j + 1] = rug.soap[i] * 255; B[j + 2] = rug.bleed[i] * 255; B[j + 3] = rug.stress[i] * 255;
      C[j] = rug.napX[i] * 127 + 128; C[j + 1] = rug.napY[i] * 127 + 128; C[j + 2] = rug.slurry[i] * 255; C[j + 3] = 255;
    }
    masks.tex[0].needsUpdate = masks.tex[1].needsUpdate = masks.tex[2].needsUpdate = true;
    S.rugMat.uniforms.uFade.value = rug.fade || 0;
  }

  // ---- tools --------------------------------------------------------------------------------
  const tools = {}; let spinner = null;
  function buildTools() {
    const metal = std(0x9aa3ad, 0.35, 0.8), dark = std(0x30343a, 0.6), blue = std(0x1c4fa0, 0.45, 0.1), wood = std(0x8a5a2b, 0.7), brist = std(0x2a2a2a, 1), yellow = std(0xe9b949, 0.6);
    const G = (...parts) => { const g = new THREE.Group(); g.add(...parts); g.visible = false; toolGroup.add(g); return g; };
    const pole = (len, mat = metal) => { const p = cyl(0.014, 0.014, len, mat, 0, 0, 0, 8); p.rotation.x = -0.6; p.position.set(0, len * 0.41, len * 0.28); return p; };
    tools.dry = G(box(0.3, 0.02, 0.2, std(0xc9a16b, 0.9), 0, 0.03, 0), box(0.02, 0.02, 0.2, wood, -0.1, 0.045, 0), box(0.02, 0.02, 0.2, wood, 0.1, 0.045, 0), pole(0.9, wood));
    tools.spray = G(cyl(0.02, 0.012, 0.22, yellow, 0, 0.32, 0.08).rotateX(-0.9), cyl(0.012, 0.012, 0.6, std(0x2e7d32, 0.7), 0, 0.5, 0.42, 8).rotateX(-0.7));
    tools.chem = G(cyl(0.05, 0.055, 0.16, std(0xffffff, 0.3), 0, 0.3, 0.1), cyl(0.02, 0.02, 0.05, std(0xd9363e, 0.4), 0, 0.4, 0.1), box(0.03, 0.02, 0.09, std(0xd9363e, 0.4), 0, 0.43, 0.06));
    tools.brush = G(box(0.2, 0.035, 0.085, wood, 0, 0.07, 0), box(0.19, 0.045, 0.075, brist, 0, 0.03, 0), box(0.03, 0.03, 0.14, wood, 0, 0.1, 0.08));
    const disc = new THREE.Group();
    disc.add(cyl(0.235, 0.235, 0.035, brist, 0, 0.022, 0, 28));
    for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; disc.add(box(0.05, 0.012, 0.012, std(0x666666), Math.cos(a) * 0.16, 0.042, Math.sin(a) * 0.16)); }
    spinner = disc;
    tools.rotary = G(disc, cyl(0.25, 0.25, 0.05, metal, 0, 0.07, 0, 28), cyl(0.12, 0.15, 0.2, blue, 0, 0.19, 0, 20), box(0.2, 0.12, 0.14, std(0xb8bec6, 0.4, 0.5), 0, 0.33, 0.02),
      cyl(0.045, 0.045, 0.06, dark, -0.2, 0.05, 0.22, 12).rotateZ(1.57), cyl(0.045, 0.045, 0.06, dark, 0.2, 0.05, 0.22, 12).rotateZ(1.57),
      (() => { const p = cyl(0.018, 0.018, 1.05, metal, 0, 0, 0, 8); p.rotation.x = -0.55; p.position.set(0, 0.72, 0.36); return p; })(), cyl(0.016, 0.016, 0.44, dark, 0, 1.17, 0.63, 8).rotateZ(1.57));
    tools.extract = G(box(0.4, 0.05, 0.02, dark, 0, 0.03, 0), box(0.4, 0.02, 0.05, metal, 0, 0.06, 0), pole(1.0));
    const comb = [box(0.44, 0.02, 0.03, wood, 0, 0.07, 0), pole(0.9, wood)];
    for (let k = 0; k < 12; k++) comb.push(box(0.008, 0.06, 0.008, metal, -0.2 + k * 0.0364, 0.035, 0));
    tools.groom = G(...comb);
  }
  buildTools();
  let curTool = null, toolYaw = 0;
  function setTool(slot, x, z, active, dx = 0, dz = 0, spin = 0) {
    for (const k in tools) tools[k].visible = k === slot;
    curTool = slot ? tools[slot] : null;
    if (!curTool) { S.toolPos.set(0, 0, -99); if (S.rugMat) S.rugMat.uniforms.uTool.value.set(0, -99, 0.2); return; }
    S.toolPos.set(x, active ? 0.03 : 0.1, z);
    curTool.position.lerp(S.toolPos, 0.6);
    if (slot !== 'rotary' && slot !== 'chem' && slot !== 'spray' && Math.hypot(dx, dz) > 0.002) { const t = Math.atan2(dx, dz); let d = t - toolYaw; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; toolYaw += d * 0.25; }
    else if (slot === 'rotary' || slot === 'chem' || slot === 'spray') toolYaw = 0;
    curTool.rotation.y = toolYaw;
    if (spinner && slot === 'rotary') spinner.rotation.y += spin;
    if (S.rugMat) S.rugMat.uniforms.uTool.value.set(x, z, slot === 'rotary' ? 0.34 : 0.2);
  }

  // ---- particles ----------------------------------------------------------------------------
  const PN = 260, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 3), pVel = new Float32Array(PN * 3), pLife = new Float32Array(PN);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false }));
  points.frustumCulled = false; scene.add(points); let pNext = 0;
  for (let i = 0; i < PN; i++) pPos[i * 3 + 1] = -5;
  function emit(x, z, kind, count = 3) {
    for (let k = 0; k < count; k++) {
      const i = pNext = (pNext + 1) % PN, a = Math.random() * 6.283, sp = kind === 'water' ? 0.25 : 0.7;
      pPos[i * 3] = x + Math.cos(a) * 0.05; pPos[i * 3 + 1] = kind === 'water' ? 0.3 : 0.05; pPos[i * 3 + 2] = z + Math.sin(a) * 0.05;
      pVel[i * 3] = Math.cos(a) * sp * Math.random(); pVel[i * 3 + 1] = kind === 'water' ? -0.6 : 0.5 + Math.random() * 0.6; pVel[i * 3 + 2] = Math.sin(a) * sp * Math.random();
      const c = kind === 'water' ? [0.6, 0.8, 1] : kind === 'dust' ? [0.75, 0.62, 0.45] : kind === 'chem' ? [0.7, 1, 0.8] : [1, 1, 1];
      pCol[i * 3] = c[0]; pCol[i * 3 + 1] = c[1]; pCol[i * 3 + 2] = c[2]; pLife[i] = 0.5 + Math.random() * 0.4;
    }
  }
  function stepParticles(dt) {
    for (let i = 0; i < PN; i++) { if (pLife[i] <= 0) continue; pLife[i] -= dt; pVel[i * 3 + 1] -= 2.2 * dt;
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      if (pLife[i] <= 0 || pPos[i * 3 + 1] < 0) { pLife[i] = 0; pPos[i * 3 + 1] = -5; } }
    pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
  }

  // ---- camera, light, sizing ----------------------------------------------------------------
  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    const pr = Math.min(devicePixelRatio || 1, S.quality === 0 ? 1 : S.quality === 1 ? 1.5 : 2);
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); fit();
  }
  function fit() {
    const rug = S.rug, w = rug ? rug.spec.w : 2, h = rug ? rug.spec.h : 3;
    const ch = canvas.clientHeight || innerHeight, usable = Math.max(0.35, 1 - (S.hud.top + S.hud.bottom) / ch);
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    if (S.view === 'top') {
      const d = Math.max((h * 1.12) / (2 * Math.tan(vf / 2)), (w * 1.12) / (2 * Math.tan(hf / 2)));
      camera.position.set(0, d, 0.001); camera.up.set(0, 0, -1); camera.lookAt(0, 0, 0); return;
    }
    camera.up.set(0, 1, 0);
    if (S.view === 'show') { camera.position.set(0, 2.6, 4.6); camera.lookAt(0, 0.3, 0); return; }
    const tilt = 1.0; // radians above the horizon
    const d = Math.max((h * Math.sin(tilt) * 1.1) / (2 * Math.tan(vf / 2) * usable), (w * 1.18) / (2 * Math.tan(hf / 2)));
    const off = (S.hud.bottom - S.hud.top) / ch * d * Math.tan(vf / 2) * 1.0;
    camera.position.set(0, d * Math.sin(tilt), d * Math.cos(tilt) + off); camera.lookAt(0, 0, off);
  }
  function setView(v) { S.view = v; fit(); }
  function setLight(hour, weather, indoor) {
    const t = (hour - 6) / 12; // 0 sunrise .. 1 sunset
    const day = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, t))));
    const night = hour < 5.5 || hour > 18.5;
    const el = Math.max(0.12, day), az = (t - 0.5) * 2.2;
    S.sunDir.set(Math.sin(az) * 0.8, el * 1.1, 0.45).normalize();
    const warm = 1 - day; // warmer near the horizon
    S.sunCol.setRGB(1.0, 0.93 - warm * 0.25, 0.8 - warm * 0.4).multiplyScalar(night ? 0.12 : (weather === 'clear' ? 1.05 : 0.55) * (0.5 + day * 0.6));
    const haze = weather === 'dust' ? new THREE.Color(0.85, 0.66, 0.42) : weather === 'rain' ? new THREE.Color(0.5, 0.55, 0.62) : new THREE.Color(0.55, 0.75, 0.98);
    const sky = S.envKind === 'hall' ? new THREE.Color(0.05, 0.04, 0.06) : night ? new THREE.Color(0.04, 0.06, 0.14) : haze.clone().lerp(new THREE.Color(0.98, 0.62, 0.35), warm * 0.7);
    scene.background = sky; scene.fog = weather === 'dust' && S.envKind === 'yard' ? new THREE.Fog(sky, 3, 16) : null;
    if (S.envKind === 'hall') { S.amb.setRGB(0.3, 0.27, 0.25); S.sunCol.setRGB(1.1, 0.95, 0.75); S.sunDir.set(0, 1, 0.25).normalize(); spot.intensity = 60; hemi.intensity = 0.25; sun.intensity = 0.2; }
    else {
      spot.intensity = night || indoor ? 25 : 0;
      const a = night ? 0.3 : indoor ? 0.62 : 0.42 + day * 0.12;
      S.amb.setRGB(a, a * (night ? 1.02 : 1), a * (night ? 1.25 : 1.05));
      if (indoor && !night) S.sunCol.multiplyScalar(0.55);
      hemi.intensity = night ? 0.35 : 0.95; sun.intensity = night ? 0.25 : (weather === 'clear' ? 2.5 : 1.2) * (indoor ? 0.5 : 1) * (0.4 + day * 0.7);
    }
    sun.color.copy(S.sunCol).multiplyScalar(1 / Math.max(0.2, Math.max(S.sunCol.r, S.sunCol.g, S.sunCol.b)));
    sun.position.copy(S.sunDir).multiplyScalar(9);
  }

  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.03), hit = new THREE.Vector3(), ndc = new THREE.Vector2();
  // Screen point -> metres from the rug's corner (may be outside the rug) + world x/z.
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(plane, hit) || !S.rug) return null;
    return { x: hit.x, z: hit.z, mx: hit.x + S.rug.spec.w / 2, my: hit.z + S.rug.spec.h / 2 };
  }
  function render(dt = 0.016) {
    S.time += dt; if (S.rugMat) S.rugMat.uniforms.uTime.value = S.time;
    if (S.view === 'show') rugGroup.rotation.y += dt * 0.25;
    stepParticles(dt); renderer.render(scene, camera);
  }
  // Top-down picture of the rug only (used for before/after thumbnails).
  function snapshot(px = 256) {
    const prev = S.view, vis = toolGroup.visible, ov = S.rugMat.uniforms.uOverlay.value, sz = renderer.getSize(new THREE.Vector2()), pr = renderer.getPixelRatio(), asp = camera.aspect;
    const w = px, h = Math.round(px * S.rug.spec.h / S.rug.spec.w);
    toolGroup.visible = false; points.visible = false; S.rugMat.uniforms.uOverlay.value = 0; S.rugMat.uniforms.uTool.value.set(0, -99, 0.2);
    renderer.setPixelRatio(1); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const d = (S.rug.spec.h * 1.02) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    camera.position.set(0, d, 0.001); camera.up.set(0, 0, -1); camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    let url = ''; try { url = canvas.toDataURL('image/webp', 0.8); if (!url.startsWith('data:image/webp')) url = canvas.toDataURL('image/jpeg', 0.8); } catch { /* ignore */ }
    toolGroup.visible = vis; points.visible = true; S.rugMat.uniforms.uOverlay.value = ov;
    renderer.setPixelRatio(pr); renderer.setSize(sz.x, sz.y, false); camera.aspect = asp; camera.updateProjectionMatrix(); S.view = prev; fit();
    return url;
  }
  // Brand watermark laid on the rug's corner so it is part of the recorded time-lapse frames.
  let mark = null;
  function setMark(cv) {
    if (mark) { scene.remove(mark); mark.material.map.dispose(); mark.material.dispose(); mark.geometry.dispose(); mark = null; }
    if (!cv || !S.rug) return;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const w = Math.min(0.7, S.rug.spec.w * 0.42);
    mark = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92, toneMapped: false }));
    mark.rotation.x = -Math.PI / 2; mark.position.set(S.rug.spec.w / 2 - w / 2 - 0.03, 0.09, S.rug.spec.h / 2 - w / 4 - 0.03); scene.add(mark);
  }
  const setOverlay = (m) => { if (S.rugMat) S.rugMat.uniforms.uOverlay.value = m; };
  const setQuality = (q) => { S.quality = q; renderer.shadowMap.enabled = q > 0; resize(); };
  setEnv('yard'); setLight(10, 'clear', false);
  return Object.assign(S, { setEnv, setRug, updateMasks, setTool, emit, resize, fit, setView, setLight, pick, render, snapshot, setOverlay, setQuality, setMark, rugGroup });
}
