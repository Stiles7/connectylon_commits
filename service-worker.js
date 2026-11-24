const CACHE_NAME = 'connect-ylon-shell-v5';
const APP_SHELL = [
	'./',
	'./index.html',
	'./pages/tecnico.html',
	'./pages/login.html',
	'./pages/cliente.html',
	'./pages/gerencia.html',
	'./pages/auditoria.html',
	'./pages/usuario.html',
	'./manifest.webmanifest',
	'./assets/css/base.css',
	'./assets/css/dashboard.css',
	'./assets/css/clients.css',
	'./assets/css/manage-clients.css',
	'./assets/css/audit.css',
	'./assets/css/users.css',
	'./assets/css/login.css',
	'./assets/technician-app.css',
	'./assets/technician-app.js',
	'./assets/pwa.js',
	'./assets/client-data.js',
	'./assets/sidebar.js',
	'./assets/row-selection.js',
	'./assets/dialog-scroll-lock.js',
	'./assets/manage-clients.js',
	'./assets/login.js',
	'./assets/clients-page.js',
	'./assets/audit-page.js',
	'./assets/users-page.js',
	'./assets/img/connect-ylon-app-icon.svg',
	'./assets/img/connect-ylon-icon.svg',
	'./assets/img/connect-ylon-stacked-dark.svg',
	'./assets/img/camera-security.png',
	'./assets/img/alarm-shield-lock.png'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(APP_SHELL))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((cacheNames) => Promise.all(
				cacheNames
					.filter((cacheName) => cacheName.startsWith('connect-ylon-shell-') && cacheName !== CACHE_NAME)
					.map((cacheName) => caches.delete(cacheName))
			))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
		return;
	}

	event.respondWith(
		caches.match(event.request, { ignoreSearch: true })
			.then((cachedResponse) => cachedResponse || fetch(event.request))
			.catch((error) => {
				console.error('Falha ao carregar o recurso solicitado.', error);
				if (event.request.mode === 'navigate') {
					return caches.match('./pages/tecnico.html');
				}
				throw error;
			})
	);
});
