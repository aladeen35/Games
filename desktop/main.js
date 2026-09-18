/* ============================================================
   ألعاب أبو جنان — نسخة سطح المكتب (Electron)
   تُقدَّم ملفات اللعبة عبر خادم محلي على 127.0.0.1 ليعمل كل شيء
   تماماً كما في المتصفح: وحدات ES، وعامل الخدمة، واللعب أونلاين.
   ============================================================ */
'use strict';
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.join(__dirname, 'app');
const TYPES = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.webmanifest':'application/manifest+json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml',
  '.ttf':'font/ttf', '.woff2':'font/woff2', '.mp3':'audio/mpeg', '.wav':'audio/wav',
  '.ico':'image/x-icon',
};

function serve(){
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let p;
      try{ p = decodeURIComponent(new url.URL(req.url, 'http://x').pathname); }
      catch(e){ res.writeHead(400); return res.end(); }
      if(p === '/' || p === '') p = '/index.html';
      const file = path.join(ROOT, path.normalize(p).replace(/^([/\\])+/, ''));
      if(!file.startsWith(ROOT)){ res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, data) => {
        if(err){ res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('غير موجود'); }
        res.writeHead(200, {
          'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

let win = null;

async function createWindow(){
  let port;
  try{ port = await serve(); }
  catch(e){
    dialog.showErrorBox('تعذّر التشغيل', 'لم نتمكّن من تشغيل الخادم المحلي:\n' + (e && e.message || e));
    return app.quit();
  }

  win = new BrowserWindow({
    width: 520, height: 940, minWidth: 380, minHeight: 620,
    backgroundColor: '#2b1a0e',
    title: 'ألعاب أبو جنان',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false,
    },
  });

  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => win.show());
  win.loadURL('http://127.0.0.1:' + port + '/index.html');

  /* الروابط الخارجية تُفتح في المتصفح لا داخل اللعبة */
  win.webContents.setWindowOpenHandler(({ url: u }) => {
    if(/^https?:/.test(u)) shell.openExternal(u);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, u) => {
    if(!u.startsWith('http://127.0.0.1:' + port)){ e.preventDefault(); shell.openExternal(u); }
  });

  /* اختصارات: F11 ملء الشاشة · Ctrl+R إعادة تحميل · Ctrl+Q/Esc خروج من ملء الشاشة */
  win.webContents.on('before-input-event', (e, input) => {
    if(input.type !== 'keyDown') return;
    const k = (input.key || '').toLowerCase();
    if(k === 'f11'){ win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    else if(k === 'escape' && win.isFullScreen()){ win.setFullScreen(false); e.preventDefault(); }
    else if(input.control && k === 'r'){ win.reload(); e.preventDefault(); }
    else if(input.control && k === 'q'){ app.quit(); e.preventDefault(); }
  });
}

/* نسخة واحدة فقط تعمل في آن واحد */
if(!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if(win){ if(win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => { if(process.platform !== 'darwin') app.quit(); });
  app.on('activate', () => { if(BrowserWindow.getAllWindows().length === 0) createWindow(); });
}
