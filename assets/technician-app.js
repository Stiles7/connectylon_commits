const appScreens = [...document.querySelectorAll('[data-screen]')];
const clients = window.connectYlonClients;
const recentClientCodes = ['999003', '999004', '999005'];
const loginForm = document.querySelector('#tech-login-form');
const usernameInput = document.querySelector('#tech-username');
const passwordInput = document.querySelector('#tech-password');
const loginFeedback = document.querySelector('#tech-login-feedback');
const passwordToggle = document.querySelector('#tech-password-toggle');
const recentList = document.querySelector('#tech-recent-list');
const resultsList = document.querySelector('#tech-results-list');
const resultsTitle = document.querySelector('#tech-results-title');
const emptyState = document.querySelector('#tech-empty-state');
const equipmentList = document.querySelector('#tech-equipment-list');
const copyFeedback = document.querySelector('#tech-copy-feedback');
const searchInputs = [...document.querySelectorAll('[data-search-form] input[name="query"]')];
let currentQuery = '';
let activeScreen = 'login';
let clientReturnScreen = 'results';
let copyFeedbackTimer;
let copiedRowTimer;
let copiedRow;

function showScreen(name) {
	activeScreen = name;
	appScreens.forEach((screen) => {
		screen.hidden = screen.dataset.screen !== name;
	});
}

function pushRoute(route) {
	const hash = `#${route}`;
	if (window.location.hash !== hash) {
		window.history.pushState({ technicianApp: true }, '', hash);
	}
}

function replaceRoute(route) {
	const hash = `#${route}`;
	if (window.location.hash !== hash) {
		window.history.replaceState({ technicianApp: true }, '', hash);
	}
}

function showFeedback(element, message) {
	element.textContent = message;
	element.hidden = false;
}

function findClient(code) {
	return Array.isArray(clients) ? clients.find((client) => client.code === code) : undefined;
}

function createClientRow(client) {
	const button = document.createElement('button');
	button.className = 'tech-client-row';
	button.type = 'button';
	button.setAttribute('aria-label', `${client.name}, código ${client.code}`);

	const copy = document.createElement('span');
	copy.className = 'tech-client-row-copy';
	const name = document.createElement('strong');
	name.textContent = client.name;
	const code = document.createElement('small');
	code.textContent = `Código ${client.code}`;
	copy.append(name, code);

	const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	arrow.setAttribute('viewBox', '0 0 24 24');
	arrow.setAttribute('aria-hidden', 'true');
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'm9 5 7 7-7 7');
	arrow.append(path);

	button.append(copy, arrow);
	button.addEventListener('click', () => openClient(client));
	return button;
}

function renderRecentClients() {
	recentList.replaceChildren();
	recentClientCodes
		.map(findClient)
		.filter(Boolean)
		.forEach((client) => recentList.append(createClientRow(client)));
}

function renderResults(query) {
	const normalizedQuery = normalize(query.trim());
	const matches = clients.filter((client) => (
		normalize(client.name).startsWith(normalizedQuery)
		|| client.code.startsWith(normalizedQuery)
	)).sort((first, second) => (
		first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' })
		|| first.code.localeCompare(second.code, 'pt-BR')
	));

	resultsList.replaceChildren(...matches.map(createClientRow));
	resultsTitle.textContent = `${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'}`;
	resultsTitle.hidden = matches.length === 0;
	emptyState.hidden = matches.length > 0;
	resultsList.hidden = matches.length === 0;
}

function openSearch(query) {
	const wasOnResults = activeScreen === 'results';
	currentQuery = query.trim();
	searchInputs.forEach((input) => {
		input.value = currentQuery;
	});
	renderResults(currentQuery);
	showScreen('results');
	const route = `pesquisa?q=${encodeURIComponent(currentQuery)}`;
	if (wasOnResults) {
		replaceRoute(route);
		return;
	}

	pushRoute(route);
	const resultsInput = searchInputs[1];
	resultsInput.focus();
	resultsInput.setSelectionRange(currentQuery.length, currentQuery.length);
}

function normalize(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderClient(client) {
	document.querySelector('#tech-client-name').textContent = client.name;
	document.querySelector('#tech-client-code').textContent = client.code;
	const status = document.querySelector('#tech-client-status');
	const isComplete = client.status === 'complete';
	status.textContent = isComplete ? 'Dados completos' : 'Dados incompletos';
	status.classList.toggle('is-incomplete', !isComplete);
	hideCopiedBadge();
	window.clearTimeout(copyFeedbackTimer);
	renderEquipment(client);
	copyFeedback.hidden = true;
	copyFeedback.classList.remove('is-visible', 'is-error');
	showScreen('client');
}

function openClient(client) {
	if (!client) {
		showScreen('home');
		return;
	}

	clientReturnScreen = activeScreen === 'results' ? 'results' : 'home';
	recentClientCodes.splice(recentClientCodes.indexOf(client.code), 1);
	recentClientCodes.unshift(client.code);
	recentClientCodes.splice(3);
	renderRecentClients();
	renderClient(client);
	pushRoute(`cliente?codigo=${encodeURIComponent(client.code)}`);
}

function renderEquipment(client) {
	equipmentList.replaceChildren();
	client.devices.forEach((device) => {
		const card = document.createElement('section');
		card.className = 'tech-equipment-card';
		const title = document.createElement('h2');
		title.className = 'tech-equipment-title';
		const icon = document.createElement('img');
		const isAlarm = device.name.toLowerCase().includes('alarme');
		icon.className = isAlarm ? 'icon-alarm' : 'icon-camera';
		icon.src = isAlarm
			? '../assets/img/alarm-shield-lock.png'
			: '../assets/img/camera-security.png';
		icon.alt = '';
		const label = document.createElement('span');
		label.textContent = device.name;
		title.append(icon, label);

		const fields = document.createElement('div');
		fields.className = 'tech-equipment-fields';
		Object.entries(device.fields).forEach(([fieldName, value]) => {
			const row = document.createElement('div');
			row.className = 'tech-equipment-field';
			const fieldLabel = document.createElement('span');
			fieldLabel.textContent = fieldName;
			const fieldValue = document.createElement('strong');
			fieldValue.textContent = value || 'Não informado';
			const copiedBadge = document.createElement('span');
			copiedBadge.className = 'tech-copied-badge';
			copiedBadge.textContent = 'Copiado';
			copiedBadge.setAttribute('role', 'status');
			copiedBadge.setAttribute('aria-live', 'polite');
			copiedBadge.setAttribute('aria-hidden', 'true');
			const copyButton = document.createElement('button');
			copyButton.className = 'tech-copy-button';
			copyButton.type = 'button';
			copyButton.setAttribute('aria-label', `Copiar ${fieldName}`);
			copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
			copyButton.addEventListener('click', () => copyValue(value, fieldName, row));
			row.append(fieldLabel, copiedBadge, fieldValue, copyButton);
			fields.append(row);
		});

		card.append(title, fields);
		equipmentList.append(card);
	});
}

function hideCopiedBadge() {
	window.clearTimeout(copiedRowTimer);
	if (!copiedRow) {
		return;
	}

	copiedRow.classList.remove('is-copied');
	const badge = copiedRow.querySelector('.tech-copied-badge');
	if (badge) {
		badge.classList.remove('is-visible');
		badge.setAttribute('aria-hidden', 'true');
	}
	copiedRow = null;
}

function showCopiedBadge(row) {
	hideCopiedBadge();
	window.clearTimeout(copyFeedbackTimer);
	copyFeedback.hidden = true;
	copyFeedback.classList.remove('is-visible', 'is-error');

	const badge = row.querySelector('.tech-copied-badge');
	row.classList.add('is-copied');
	badge.removeAttribute('aria-hidden');
	window.requestAnimationFrame(() => badge.classList.add('is-visible'));
	copiedRow = row;
	copiedRowTimer = window.setTimeout(hideCopiedBadge, 2500);
}

function showCopyError(message) {
	window.clearTimeout(copyFeedbackTimer);
	copyFeedback.textContent = message;
	copyFeedback.classList.add('is-error');
	copyFeedback.classList.remove('is-visible');
	copyFeedback.hidden = false;
	window.requestAnimationFrame(() => copyFeedback.classList.add('is-visible'));
	copyFeedbackTimer = window.setTimeout(() => {
		copyFeedback.classList.remove('is-visible');
		copyFeedback.hidden = true;
	}, 2500);
}

async function copyValue(value, label, row) {
	if (!value) {
		showCopyError(`${label} não informado.`);
		return;
	}

	if (!navigator.clipboard || !navigator.clipboard.writeText) {
		showCopyError('Cópia indisponível neste navegador.');
		return;
	}

	try {
		await navigator.clipboard.writeText(value);
		showCopiedBadge(row);
	} catch (error) {
		console.error('Não foi possível copiar o dado do equipamento.', error);
		showCopyError('Não foi possível copiar. Verifique a permissão do navegador.');
	}
}

function updateConnectionStatus() {
	const status = document.querySelector('#tech-sync-status');
	const onlineState = document.querySelector('#tech-online-state');
	const onlineLabel = document.querySelector('#tech-online-label');
	const isOnline = navigator.onLine;
	const hasOfflineShell = Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);

	status.textContent = isOnline ? 'Dados de demonstração locais' : 'Dados locais disponíveis';
	onlineLabel.textContent = isOnline
		? (hasOfflineShell ? 'Offline pronto' : 'Online')
		: 'Sem conexão';
	onlineState.classList.toggle('is-offline', !isOnline);
}

loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	loginFeedback.hidden = true;

	if (!usernameInput.value.trim() || !passwordInput.value) {
		showFeedback(loginFeedback, 'Informe seu usuário e sua senha.');
		return;
	}

	showFeedback(loginFeedback, 'A autenticação de técnicos ainda não está conectada a um servidor.');
});

passwordToggle.addEventListener('click', () => {
	const showPassword = passwordInput.type === 'password';
	passwordInput.type = showPassword ? 'text' : 'password';
	passwordToggle.setAttribute('aria-pressed', String(showPassword));
	passwordToggle.setAttribute('aria-label', showPassword ? 'Ocultar senha' : 'Mostrar senha');
});

document.querySelector('#tech-preview').addEventListener('click', () => {
	showScreen('home');
	pushRoute('inicio');
});

document.querySelectorAll('[data-search-form]').forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		openSearch(form.elements.query.value);
	});

	form.elements.query.addEventListener('input', () => {
		if (activeScreen === 'results' || form.elements.query.value.trim()) {
			openSearch(form.elements.query.value);
		}
	});
});

document.querySelectorAll('[data-back]').forEach((button) => {
	button.addEventListener('click', () => {
		if (window.history.state && window.history.state.technicianApp) {
			window.history.back();
			return;
		}

		if (activeScreen === 'client' && clientReturnScreen === 'results') {
			renderResults(currentQuery);
			showScreen('results');
			pushRoute(`pesquisa?q=${encodeURIComponent(currentQuery)}`);
			return;
		}

		showScreen('home');
		pushRoute('inicio');
	});
});

document.querySelector('#tech-sync').addEventListener('click', () => {
	const message = navigator.onLine
		? 'A sincronização com o servidor ainda não foi configurada.'
		: 'Sem conexão. Os dados demonstrativos incluídos no app permanecem disponíveis.';
	showFeedback(document.querySelector('#tech-home-feedback'), message);
});

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
if (navigator.serviceWorker) {
	navigator.serviceWorker.addEventListener('controllerchange', updateConnectionStatus);
}

function renderRouteFromHash() {
	const route = window.location.hash;
	if (route.startsWith('#inicio')) {
		showScreen('home');
		return;
	}

	if (route.startsWith('#pesquisa')) {
		const query = new URLSearchParams(route.slice(route.indexOf('?') + 1)).get('q') || '';
		currentQuery = query;
		searchInputs.forEach((input) => {
			input.value = query;
		});
		renderResults(query);
		showScreen('results');
		return;
	}

	if (route.startsWith('#cliente')) {
		const code = new URLSearchParams(route.slice(route.indexOf('?') + 1)).get('codigo');
		const client = findClient(code);
		if (client) {
			clientReturnScreen = 'results';
			renderClient(client);
			return;
		}
	}

	showScreen('login');
}

window.addEventListener('popstate', renderRouteFromHash);

if (Array.isArray(clients)) {
	renderRecentClients();
	updateConnectionStatus();
} else {
	showFeedback(loginFeedback, 'Não foi possível carregar os cadastros demonstrativos.');
	console.error('A lista de clientes não foi carregada.');
}

renderRouteFromHash();
