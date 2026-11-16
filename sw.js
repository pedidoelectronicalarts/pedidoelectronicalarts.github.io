// Service worker: la app abre rapido y sigue mostrando el catalogo sin conexion
const V='ea-202611161933';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','./manifest.webmanifest','./icon-192.png'])))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  if(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html')){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&u.pathname.includes('/img/')){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
});
