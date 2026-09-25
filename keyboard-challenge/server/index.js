// نقطة تشغيل الخادم: PORT و DB_PATH و STATIC_DIR من متغيرات البيئة.
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT) || 8080;
const dbPath = process.env.DB_PATH || join(ROOT, 'data', 'keyboard.db');
const staticDir = process.env.STATIC_DIR ? resolve(process.env.STATIC_DIR) : null;

const staticDirs = staticDir
  ? [['/', staticDir]]
  : [['/shared/', join(ROOT, 'shared')], ['/', join(ROOT, 'public')]];

const { server } = createApp({ dbPath, staticDirs });
server.listen(port, () => {
  console.log(`⌨️  تحدي الـ Keyboard مع أبو جنان يعمل على http://localhost:${port}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)));
