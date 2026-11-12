// Bundles src/ into one classic script (www/game.js) so the game also runs inside the Android WebView.
import { build, context } from 'esbuild';
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const opts = { entryPoints: [join(root, 'src/main.js')], bundle: true, format: 'iife', target: ['es2020'], outfile: join(root, 'www/game.js'), minify: !process.argv.includes('--serve'), legalComments: 'none', logLevel: 'info' };
mkdirSync(join(root, 'www/fonts'), { recursive: true });
for (const w of [400, 700, 900]) for (const s of ['arabic', 'latin']) {
  const f = `cairo-${s}-${w}-normal.woff2`, src = join(root, 'node_modules/@fontsource/cairo/files', f);
  if (existsSync(src)) cpSync(src, join(root, 'www/fonts', f));
}
if (process.argv.includes('--serve')) {
  const ctx = await context(opts); await ctx.watch();
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
  const port = +process.env.PORT || 5173;
  createServer(async (req, res) => {
    const p = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    try { const data = await readFile(join(root, 'www', p === '/' ? 'index.html' : p)); res.writeHead(200, { 'Content-Type': mime[extname(p)] || (p === '/' ? mime['.html'] : 'application/octet-stream'), 'Cache-Control': 'no-store' }); res.end(data); }
    catch { res.writeHead(404); res.end('not found'); }
  }).listen(port, () => console.log(`Rug Empire: http://localhost:${port}`));
} else await build(opts);
