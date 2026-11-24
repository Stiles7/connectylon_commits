const activities = [
	{ date: '2026-11-12', time: '10:42', user: 'Tec. Mateus', action: 'Consulta', record: 'Cliente 999001 · 999001', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999001.' },
	{ date: '2026-11-12', time: '10:38', user: 'Tec. Silvio', action: 'Alteração', record: 'Cliente 999002 · 999002', origin: 'Painel web', description: 'Atualizou informações dos equipamentos cadastrados.' },
	{ date: '2026-11-12', time: '10:31', user: 'Tec. Silvio', action: 'Consulta', record: 'Cliente 999003 · 999003', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999003.' },
	{ date: '2026-11-12', time: '10:15', user: 'Glaucia', action: 'Alteração', record: 'Cliente 999004 · 999004', origin: 'Painel web', description: 'Editou dados de acesso dos equipamentos do cliente.' },
	{ date: '2026-11-12', time: '09:54', user: 'Tec. Mateus', action: 'Consulta', record: 'Cliente 999005 · 999005', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999005.' },
	{ date: '2026-11-12', time: '09:30', user: 'Tec. Bruno', action: 'Acesso', record: 'Entrada no sistema', origin: 'Aplicativo', description: 'Entrou no sistema pelo aplicativo.' },
	{ date: '2026-11-12', time: '08:40', user: 'Tec. Bruno', action: 'Importação', record: 'clientes_2026-11-12.txt', origin: 'Painel web', description: 'Importou arquivo de clientes do Moni Software.' },
	{ date: '2026-11-12', time: '08:32', user: 'Tec. Bruno', action: 'Acesso', record: 'Entrada no sistema', origin: 'Painel web', description: 'Entrou no sistema pelo painel web.' },
	{ date: '2026-11-12', time: '08:18', user: 'Glaucia', action: 'Consulta', record: 'Cliente 999001 · 999001', origin: 'Painel web', description: 'Consultou o histórico do cliente de código 999001.' },
	{ date: '2026-11-12', time: '08:06', user: 'Tec. Mateus', action: 'Acesso', record: 'Entrada no sistema', origin: 'Aplicativo', description: 'Entrou no sistema pelo aplicativo.' },
	{ date: '2026-11-12', time: '07:52', user: 'Tec. Silvio', action: 'Consulta', record: 'Cliente 999003 · 999003', origin: 'Aplicativo', description: 'Consultou as informações dos equipamentos.' },
	{ date: '2026-11-12', time: '07:45', user: 'Glaucia', action: 'Alteração', record: 'Cliente 999005 · 999005', origin: 'Painel web', description: 'Atualizou os dados de contato do cliente.' },
	{ date: '2026-11-12', time: '07:32', user: 'Tec. Bruno', action: 'Consulta', record: 'Cliente 999004 · 999004', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999004.' },
	{ date: '2026-11-12', time: '07:20', user: 'Tec. Mateus', action: 'Acesso', record: 'Entrada no sistema', origin: 'Aplicativo', description: 'Entrou no sistema pelo aplicativo.' },
	{ date: '2026-11-12', time: '07:05', user: 'Glaucia', action: 'Importação', record: 'clientes_2026-11-05.txt', origin: 'Painel web', description: 'Revisou o relatório da importação anterior.' },
	{ date: '2026-11-12', time: '06:48', user: 'Tec. Silvio', action: 'Consulta', record: 'Cliente 999002 · 999002', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999002.' },
	{ date: '2026-11-12', time: '06:35', user: 'Tec. Bruno', action: 'Acesso', record: 'Entrada no sistema', origin: 'Painel web', description: 'Entrou no sistema pelo painel web.' },
	{ date: '2026-11-12', time: '06:22', user: 'Glaucia', action: 'Alteração', record: 'Cliente 999003 · 999003', origin: 'Painel web', description: 'Atualizou os dados de acesso do cliente.' },
	{ date: '2026-11-12', time: '06:08', user: 'Tec. Mateus', action: 'Consulta', record: 'Cliente 999005 · 999005', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999005.' },
	{ date: '2026-11-12', time: '05:54', user: 'Tec. Silvio', action: 'Acesso', record: 'Entrada no sistema', origin: 'Aplicativo', description: 'Entrou no sistema pelo aplicativo.' },
	{ date: '2026-11-12', time: '05:40', user: 'Glaucia', action: 'Consulta', record: 'Cliente 999004 · 999004', origin: 'Painel web', description: 'Consultou os dados do cliente de código 999004.' },
	{ date: '2026-11-12', time: '05:18', user: 'Tec. Bruno', action: 'Alteração', record: 'Cliente 999001 · 999001', origin: 'Painel web', description: 'Atualizou os dados de um equipamento.' },
	{ date: '2026-11-12', time: '05:02', user: 'Tec. Mateus', action: 'Acesso', record: 'Entrada no sistema', origin: 'Aplicativo', description: 'Entrou no sistema pelo aplicativo.' },
	{ date: '2026-11-12', time: '04:47', user: 'Tec. Silvio', action: 'Consulta', record: 'Cliente 999002 · 999002', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999002.' },
	{ date: '2026-11-11', time: '18:22', user: 'Glaucia', action: 'Alteração', record: 'Cliente 999005 · 999005', origin: 'Painel web', description: 'Atualizou os dados do cliente.' },
	{ date: '2026-11-11', time: '17:50', user: 'Tec. Mateus', action: 'Consulta', record: 'Cliente 999001 · 999001', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999001.' },
	{ date: '2026-11-11', time: '16:41', user: 'Tec. Bruno', action: 'Acesso', record: 'Entrada no sistema', origin: 'Painel web', description: 'Entrou no sistema pelo painel web.' },
	{ date: '2026-11-11', time: '15:16', user: 'Tec. Silvio', action: 'Importação', record: 'clientes_2026-11-11.txt', origin: 'Painel web', description: 'Importou arquivo de clientes do Moni Software.' },
	{ date: '2026-11-10', time: '14:32', user: 'Tec. Bruno', action: 'Consulta', record: 'Cliente 999003 · 999003', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999003.' },
	{ date: '2026-11-10', time: '13:10', user: 'Glaucia', action: 'Acesso', record: 'Entrada no sistema', origin: 'Painel web', description: 'Entrou no sistema pelo painel web.' },
	{ date: '2026-11-10', time: '11:06', user: 'Tec. Mateus', action: 'Alteração', record: 'Cliente 999004 · 999004', origin: 'Painel web', description: 'Atualizou os dados de acesso dos equipamentos.' },
	{ date: '2026-11-10', time: '09:48', user: 'Tec. Silvio', action: 'Consulta', record: 'Cliente 999005 · 999005', origin: 'Aplicativo', description: 'Consultou os dados do cliente de código 999005.' }
];

const pageSize = 8;
const defaultTotal = 248;
let currentPage = 1;

const filtersForm = document.querySelector('#audit-filters');
const periodFilter = document.querySelector('#audit-period');
const userFilter = document.querySelector('#audit-user');
const actionFilter = document.querySelector('#audit-action');
const searchInput = document.querySelector('#audit-search');
const activityBody = document.querySelector('#audit-body');
const emptyState = document.querySelector('#audit-empty');
const rangeLabel = document.querySelector('#audit-range');
const periodCount = document.querySelector('#audit-period-count');
const pageNumbers = document.querySelector('#audit-page-numbers');
const detailDialog = document.querySelector('#audit-detail-dialog');

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[character]);
}

function formatDate(value) {
	const [year, month, day] = value.split('-');
	return `${day}/${month}/${year}`;
}

function getFilteredActivities() {
	const query = searchInput.value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	const period = periodFilter.value;

	return activities.filter((activity) => {
		const inPeriod = period === 'all'
			|| (period === 'day' && activity.date === '2026-11-12')
			|| (period === '7days' && activity.date >= '2026-11-06')
			|| (period === '30days' && activity.date >= '2026-10-13');
		const matchesUser = userFilter.value === 'all' || activity.user === userFilter.value;
		const matchesAction = actionFilter.value === 'all' || activity.action === actionFilter.value;
		const searchableText = `${activity.record} ${activity.description} ${activity.user} ${activity.action}`
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
		return inPeriod && matchesUser && matchesAction && searchableText.includes(query);
	});
}

function renderPagination(pageCount) {
	document.querySelector('#audit-previous').disabled = currentPage <= 1;
	document.querySelector('#audit-next').disabled = currentPage >= pageCount;
	pageNumbers.innerHTML = Array.from({ length: pageCount }, (_, index) => {
		const page = index + 1;
		return `<button class="audit-page-number ${page === currentPage ? 'active' : ''}" type="button" data-page="${page}" aria-label="Página ${page}" ${page === currentPage ? 'aria-current="page"' : ''}>${page}</button>`;
	}).join('');
}

function renderActivities() {
	const matching = getFilteredActivities();
	const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
	currentPage = Math.min(currentPage, pageCount);
	const start = (currentPage - 1) * pageSize;
	const visible = matching.slice(start, start + pageSize);
	const isDefaultView = periodFilter.value === 'day'
		&& userFilter.value === 'all'
		&& actionFilter.value === 'all'
		&& !searchInput.value.trim();
	const total = isDefaultView ? defaultTotal : matching.length;

	activityBody.innerHTML = visible.map((activity) => {
		const activityIndex = activities.indexOf(activity);
		const actionClass = activity.action.toLowerCase().replace('ç', 'c').replace('ã', 'a');
		return `
			<tr>
				<td>${formatDate(activity.date)} ${activity.time}</td>
				<td class="audit-user">${escapeHtml(activity.user)}</td>
				<td><span class="audit-action-badge ${actionClass}">${escapeHtml(activity.action)}</span></td>
				<td>${escapeHtml(activity.record)}</td>
				<td class="audit-origin">${escapeHtml(activity.origin)}</td>
				<td><button class="view-client audit-detail-link" type="button" data-activity="${activityIndex}">Ver registro</button></td>
			</tr>
		`;
	}).join('');

	emptyState.hidden = matching.length > 0;
	activityBody.hidden = matching.length === 0;
	const firstRecord = matching.length ? start + 1 : 0;
	const lastRecord = Math.min(start + visible.length, matching.length);
	rangeLabel.textContent = `Mostrando ${firstRecord}–${lastRecord} de ${total} registros`;
	periodCount.textContent = `${total} registros no período`;
	renderPagination(pageCount);
}

function showActivity(index) {
	const activity = activities[index];
	if (!activity) return;

	document.querySelector('#audit-detail-date').textContent = `${formatDate(activity.date)} às ${activity.time}`;
	document.querySelector('#audit-detail-title').textContent = activity.action;
	document.querySelector('#audit-detail-list').innerHTML = `
		<div><dt>Usuário</dt><dd>${escapeHtml(activity.user)}</dd></div>
		<div><dt>Registro</dt><dd>${escapeHtml(activity.record)}</dd></div>
		<div><dt>Origem</dt><dd>${escapeHtml(activity.origin)}</dd></div>
		<div><dt>Tipo de ação</dt><dd>${escapeHtml(activity.action)}</dd></div>
	`;
	document.querySelector('#audit-detail-description').textContent = activity.description;
	detailDialog.showModal();
}

filtersForm.addEventListener('submit', (event) => {
	event.preventDefault();
	currentPage = 1;
	renderActivities();
});

document.querySelector('#clear-audit-filters').addEventListener('click', () => {
	periodFilter.value = 'day';
	userFilter.value = 'all';
	actionFilter.value = 'all';
	searchInput.value = '';
	currentPage = 1;
	renderActivities();
});

pageNumbers.addEventListener('click', (event) => {
	const button = event.target.closest('[data-page]');
	if (!button) return;
	currentPage = Number(button.dataset.page);
	renderActivities();
});

document.querySelector('#audit-previous').addEventListener('click', () => {
	if (currentPage > 1) {
		currentPage -= 1;
		renderActivities();
	}
});

document.querySelector('#audit-next').addEventListener('click', () => {
	const pageCount = Math.max(1, Math.ceil(getFilteredActivities().length / pageSize));
	if (currentPage < pageCount) {
		currentPage += 1;
		renderActivities();
	}
});

activityBody.addEventListener('click', (event) => {
	const button = event.target.closest('.audit-detail-link');
	if (button) showActivity(Number(button.dataset.activity));
});

detailDialog.querySelector('.dialog-close').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => {
	if (event.target === detailDialog) detailDialog.close();
});

renderActivities();
