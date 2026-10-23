/* Soligref — офлайн-кэш. Страницы и шрифты открываются без интернета. */
const V='soligref-v4';
const CORE=['./','index.html','sostav.html','shop.html','support.html','report.html','form.html','admin.html','style.css','app.js','logo.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(!(u.origin===location.origin||/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname)))return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;
    if(res)return res;
    return r.mode==='navigate'?(await c.match('index.html'))||Response.error():Response.error();
  }))
});
