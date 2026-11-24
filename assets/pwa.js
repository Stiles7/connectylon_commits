if ('serviceWorker' in navigator) {
	const serviceWorkerUrl = new URL('../service-worker.js', document.currentScript.src);
	navigator.serviceWorker.register(serviceWorkerUrl)
		.catch((error) => {
			console.error('Não foi possível registrar o service worker do Connect Ylon.', error);
		});
}
