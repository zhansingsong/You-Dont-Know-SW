// cache polyfill
// importScripts('/cache-polyfill.js');
// version
const VERSION = 1;
// cache name
const CACHE_NAME = `view-img-static-v${VERSION}`;

// install
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles/app.css',
                '/scripts/app.js',
                '/images/husky.jpg',
                '/images/wolf.jpg',
            ]);
        })
    );
});

// inercept
self.addEventListener('fetch', function (event) {
    // 获取请求
    let request = event.request;
    // 解析URL
    const url = new URL(request.url);
    
    // 如果请求的是'/images/wolf.jpg'，响应 '/images/husky.jpg'。
    if(url.origin === location.origin && url.pathname === '/images/wolf.jpg'){
        request = new Request('/images/husky.jpg');
    }

    event.respondWith(
        // 如果本地存在请求资源就直接响应，否则从网络获取。即缓存优先策略
        caches.match(request).then(function (response) {
            return response || fetch(request);
        })
    );
});
