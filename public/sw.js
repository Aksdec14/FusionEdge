var CACHE = "fusionedge-v1";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(["/", "/logo.png", "/Logo-yellow-color.jpg"]);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isFont(url) {
  return url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
}

function save(cache, request, response) {
  if (!response || response.status === 206) return response;
  if (response.ok || response.type === "opaque") cache.put(request, response.clone()).catch(function () {});
  return response;
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;
  var url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname === "/sw.js") return;
  var local = url.origin === self.location.origin;
  if (!local && !isFont(url)) return;

  var html = local && (request.mode === "navigate" || (request.headers.get("accept") || "").indexOf("text/html") !== -1);
  var asset = /\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|mp4)$/i.test(url.pathname) || url.pathname.indexOf("/_astro/") === 0;
  if (!html && !asset && !isFont(url)) return;

  event.respondWith(caches.open(CACHE).then(function (cache) {
    var cached = cache.match(request);
    var fetched = fetch(request).then(function (response) {
      return save(cache, request, response);
    });
    if (html) {
      var returning = /(?:^|;\s*)fe_visit=/.test(request.headers.get("cookie") || "");
      if (!returning) {
        return fetched.catch(function () {
          return cached.then(function (hit) { return hit || cache.match("/"); });
        });
      }
      return cached.then(function (hit) {
        var update = fetched.catch(function () { return hit; });
        return hit || update;
      });
    }
    if (url.pathname.indexOf("/_astro/") === 0) return cached.then(function (hit) { return hit || fetched; });
    return cached.then(function (hit) {
      var update = fetched.catch(function () { return hit; });
      return hit || update;
    });
  }));
});
