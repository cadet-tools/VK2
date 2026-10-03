const STATIC_CACHE='vk2026-static-v21';
const RUNTIME_CACHE='vk2026-runtime-v21';
const LOCAL_STATIC=[
  './',
  './index.html',
  './lof-map.jpg',
  './supabase-config.js'
,
  './CADET_LV_LOGO.png',
  './CADET_LV.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './site.webmanifest',
  './admin.html'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache=>cache.addAll(LOCAL_STATIC))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys
      .filter(k=>k.startsWith('vk2026-') && ![STATIC_CACHE,RUNTIME_CACHE].includes(k))
      .map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

function isSupabase(url){
  return /supabase\.co$/i.test(url.hostname) || /\.supabase\.co$/i.test(url.hostname);
}
function isRuntimeCacheable(url){
  return url.hostname==='tile.openstreetmap.org'
    || url.hostname==='server.arcgisonline.com'
    || url.hostname==='unpkg.com'
    || url.hostname==='cdn.jsdelivr.net';
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);

  // Piekļuves ON/OFF un citi Supabase dati nekad netiek atbildēti no cache.
  if(isSupabase(url))return;

  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(req);
        const cache=await caches.open(STATIC_CACHE);
        cache.put('./index.html',fresh.clone()).catch(()=>{});
        return fresh;
      }catch(_){
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  if(url.origin===self.location.origin){
    event.respondWith((async()=>{
      const cached=await caches.match(req);
      if(cached)return cached;
      try{
        const fresh=await fetch(req);
        const cache=await caches.open(STATIC_CACHE);
        cache.put(req,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(_){
        return cached || Response.error();
      }
    })());
    return;
  }

  if(isRuntimeCacheable(url)){
    event.respondWith((async()=>{
      const cache=await caches.open(RUNTIME_CACHE);
      const cached=await cache.match(req);
      if(cached)return cached;
      try{
        const fresh=await fetch(req);
        cache.put(req,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(_){
        return cached || Response.error();
      }
    })());
  }
});

self.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type!=='CACHE_URLS' || !Array.isArray(data.urls))return;

  const port=event.ports && event.ports[0];
  event.waitUntil((async()=>{
    const cache=await caches.open(RUNTIME_CACHE);
    let done=0,ok=0,failed=0;
    const urls=[...new Set(data.urls)].filter(Boolean);
    const total=urls.length;

    // Nelielas paralēlas pakas, lai nenoslogotu telefonu/tīklu.
    const concurrency=6;
    let cursor=0;

    async function worker(){
      while(cursor<total){
        const i=cursor++;
        const url=urls[i];
        try{
          const u=new URL(url,self.location.href);
          if(isSupabase(u))throw new Error('Supabase netiek kešots');

          const same=u.origin===self.location.origin;
          const req=new Request(u.href,{
            method:'GET',
            mode:same?'same-origin':'no-cors',
            credentials:same?'same-origin':'omit',
            cache:'reload'
          });
          const resp=await fetch(req);
          if(resp.ok || resp.type==='opaque'){
            await cache.put(req,resp.clone());
            ok++;
          }else failed++;
        }catch(_){
          failed++;
        }finally{
          done++;
          port?.postMessage({type:'progress',done,total,ok,failed});
        }
      }
    }

    await Promise.all(Array.from({length:concurrency},()=>worker()));
    port?.postMessage({type:'done',done,total,ok,failed});
  })().catch(err=>{
    port?.postMessage({type:'error',message:err?.message||String(err)});
  }));
});
