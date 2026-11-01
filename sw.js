const V='followup-v1',SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.pathname.startsWith('/api/'))return;           // لا نخزّن بيانات الخادم
  if(u.origin===location.origin){                                         // الصفحة: الشبكة أولاً ثم النسخة المخزنة (للعمل بدون إنترنت)
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x;}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  }else if(CDN.includes(u.hostname)){                                     // الخطوط والأيقونات: من الذاكرة ثم تحديث
    e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x;}).catch(()=>m);return m||n;}));
  }
});
