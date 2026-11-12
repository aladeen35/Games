// Procedural WebAudio: no audio files. Scrub noise follows wetness/foam, motor hum follows the machine,
// and a layered pentatonic loop adds voices as the rug gets cleaner.
let ctx = null, master, noiseBuf, scrub, scrubGain, scrubFilter, motor, motorGain, water, waterGain, musicGain, musicTimer = null, enabled = true, level = 0;
const SCALE = [220, 261.6, 293.7, 329.6, 392, 440, 523.3, 587.3];
export function initAudio() {
  if (ctx || !enabled) return;
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const loop = (type, freq, q) => { const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true; const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; src.connect(f); f.connect(g); g.connect(master); src.start(); return [f, g]; };
  [scrubFilter, scrubGain] = loop('bandpass', 1800, 0.8); [, waterGain] = loop('highpass', 3500, 0.5);
  motor = ctx.createOscillator(); motor.type = 'sawtooth'; motor.frequency.value = 55; const mf = ctx.createBiquadFilter(); mf.type = 'lowpass'; mf.frequency.value = 320;
  motorGain = ctx.createGain(); motorGain.gain.value = 0; motor.connect(mf); mf.connect(motorGain); motorGain.connect(master); motor.start();
  musicGain = ctx.createGain(); musicGain.gain.value = 0.12; musicGain.connect(master);
}
export function setSound(on) { enabled = on; if (ctx) master.gain.value = on ? 0.7 : 0; }
export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
const ramp = (g, v) => { if (ctx) g.gain.setTargetAtTime(v, ctx.currentTime, 0.06); };
// kind: null | 'scrub' | 'motor' | 'water' | 'squeegee'; wet/foam 0..1 shape the timbre
export function toolSound(kind, wet = 0, foam = 0) {
  if (!ctx) return;
  ramp(scrubGain, kind === 'scrub' || kind === 'motor' ? 0.16 : kind === 'squeegee' ? 0.1 : 0);
  ramp(motorGain, kind === 'motor' ? 0.09 : 0); ramp(waterGain, kind === 'water' ? 0.12 : 0);
  if (kind) scrubFilter.frequency.setTargetAtTime(kind === 'squeegee' ? 700 + wet * 900 : 2600 - wet * 1300 - foam * 700, ctx.currentTime, 0.1);
}
export function blip(freq = 660, dur = 0.12, type = 'sine', vol = 0.18) {
  if (!ctx || !enabled) return;
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + dur);
}
export const sfx = {
  tap: () => blip(520, 0.06, 'triangle', 0.1), coin: () => { blip(880, 0.08); setTimeout(() => blip(1320, 0.14), 70); },
  bad: () => blip(160, 0.25, 'sawtooth', 0.12), good: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.22), i * 110)),
  note: () => blip(300 + Math.random() * 80, 0.05, 'square', 0.05),
};
// Music layers: more voices as cleanliness (0..1) rises.
export function setMusicLevel(v) { level = v; }
export function startMusic() {
  if (!ctx || musicTimer) return; let beat = 0;
  musicTimer = setInterval(() => {
    if (!enabled || ctx.state !== 'running') return; beat++;
    const voice = (f, d, v, type = 'sine') => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.03); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d); o.connect(g); g.connect(musicGain); o.start(); o.stop(ctx.currentTime + d); };
    if (beat % 4 === 0) voice(SCALE[0] / 2, 1.2, 0.5, 'triangle');
    if (level > 0.25 && beat % 2 === 0) voice(SCALE[(beat * 3) % 5], 0.5, 0.25);
    if (level > 0.55) voice(SCALE[(beat * 5 + 2) % 8], 0.3, 0.18, 'triangle');
    if (level > 0.85 && beat % 4 === 2) voice(SCALE[7] * 2, 0.8, 0.12);
  }, 300);
}
export function stopMusic() { clearInterval(musicTimer); musicTimer = null; }
