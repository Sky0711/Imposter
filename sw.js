/* Imposter — offline service worker.
   Bump CACHE when you change any of the precached files. */
const CACHE = "imposter-v59";   /* keep in step with APP_VERSION in index.html */

/* relative URLs so this works at /imposter/ as well as at a domain root */
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* stash a response without letting a cache error break the response itself */
function stash(req, res){
  if(res && (res.ok || res.type === "opaque")){
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;

  /* the page itself: network first, so a redeploy is picked up next launch,
     but fall back to cache when there is no signal */
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(res => stash(req, res))
        .catch(() => caches.match(req).then(r => r || caches.match("index.html")))
    );
    return;
  }

  /* everything else (icons, google fonts): cache first, fill in on first use */
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => stash(req, res)).catch(() => hit)
    )
  );
});
