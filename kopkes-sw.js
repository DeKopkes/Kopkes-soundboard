const CACHE='kopkes-shell-v1';
const FILES=['./kopkes-app.html','./kopkes-manifest.webmanifest','./kopkes-icon-180.png','./kopkes-icon-192.png','./kopkes-icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kopkes-shell-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(!FILES.some(f=>new URL(f,self.registration.scope).pathname===url.pathname))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
