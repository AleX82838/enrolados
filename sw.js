self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("enrolados-v1").then(cache => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/script.js", "/logo.png"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
