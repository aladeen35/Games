import { boot } from './app.js';
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot, boot); else boot();
if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.AndroidBridge) navigator.serviceWorker.register('sw.js').catch(() => {});
