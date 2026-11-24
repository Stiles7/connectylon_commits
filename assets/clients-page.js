const clients = window.connectYlonClients;
const clientsBody = document.querySelector('#clients-body');
const clientsSearch = document.querySelector('#clients-search');
const clientCount = document.querySelector('#client-count');
const emptyState = document.querySelector('#clients-empty');
const filterButtons = document.querySelectorAll('.client-filters .filter-chip');
const clientDialog = document.querySelector('#client-dialog');
const dialogClientName = document.querySelector('#dialog-client-name');
const dialogClientCode = document.querySelector('#dialog-client-code');
const equipmentList = document.querySelector('#equipment-list');
const editError = document.querySelector('#client-edit-error');
const editSuccess = document.querySelector('#client-edit-success');
const editButton = document.querySelector('#edit-client');
const cancelEditButton = document.querySelector('#cancel-client-edit');
const saveEditButton = document.querySelector('#save-client-edit');
let activeFilter = 'all';
let activeClientCode = '';
let isEditing = false;

const totalClientCount = 1248;
const totalEquipmentCount = 3870;
// Outros erros pertencem a clientes fora da amostra local exibida nesta página.
const unlistedErrorCount = 6;

const equipmentTemplate = [
	{
		name: 'DVR',
		icon: 'camera',
		fields: ['Endereço IP', 'Porta de acesso', 'Porta de serviço', 'Usuário', 'Senha']
	},
	{
		name: 'Central de alarme',
		icon: 'shield',
		fields: ['Endereço IP', 'Porta de acesso', 'Usuário', 'Senha']
	}
];

function normalize(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[character]);
}

function isValidIp(value) {
	const parts = value.split('.');
	return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function getClientIssue(client) {
	for (const device of client.devices) {
		if (!isValidIp(device.fields['Endereço IP'] || '')) return 'IP inválido';
		if (!device.fields['Senha']) return 'Senha ausente';
	}
	return '';
}

function updateClientSummary() {
	const visibleErrors = clients.filter((client) => Boolean(getClientIssue(client))).length;
	const totalErrors = unlistedErrorCount + visibleErrors;
	const totalComplete = totalClientCount - totalErrors;

	document.querySelector('#summary-total').textContent = totalClientCount.toLocaleString('pt-BR');
	document.querySelector('#summary-equipment').textContent = totalEquipmentCount.toLocaleString('pt-BR');
	document.querySelector('#summary-complete').textContent = totalComplete.toLocaleString('pt-BR');
	document.querySelector('#summary-errors').textContent = totalErrors.toLocaleString('pt-BR');
	filterButtons.forEach((button) => {
		if (button.dataset.filter === 'all') button.textContent = `Todos (${totalClientCount.toLocaleString('pt-BR')})`;
		if (button.dataset.filter === 'complete') button.textContent = `Completos (${totalComplete.toLocaleString('pt-BR')})`;
		if (button.dataset.filter === 'errors') button.textContent = `Com erro de dados (${totalErrors.toLocaleString('pt-BR')})`;
	});
}

function renderClients() {
	const searchTerm = normalize(clientsSearch.value.trim());
	const matchingClients = clients.filter((client) => {
		const matchesSearch = normalize(`${client.code} ${client.name}`).includes(searchTerm);
		const issue = getClientIssue(client);
		const matchesFilter = activeFilter === 'all'
			|| (activeFilter === 'complete' && !issue)
			|| (activeFilter === 'errors' && Boolean(issue));
		return matchesSearch && matchesFilter;
	});

	clientsBody.innerHTML = matchingClients.map((client) => {
		const issue = getClientIssue(client);
		const isComplete = !issue;
		return `
			<tr class="${issue ? 'has-error' : ''}">
				<td>${escapeHtml(client.code)}</td>
				<td class="client-name">${escapeHtml(client.name)}</td>
				<td>${client.equipment} equipamentos</td>
				<td><span class="client-status ${isComplete ? 'complete' : 'incomplete'}"><span aria-hidden="true"></span>${issue || 'Completo'}</span></td>
				<td>${escapeHtml(client.updated)}</td>
				<td><button class="view-client" type="button" data-code="${escapeHtml(client.code)}">Ver cliente</button></td>
			</tr>
		`;
	}).join('');

	const hasSearch = searchTerm.length > 0;
	clientCount.textContent = hasSearch
		? `${matchingClients.length} ${matchingClients.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}`
		: `Exibindo ${matchingClients.length} de ${totalClientCount.toLocaleString('pt-BR')} clientes cadastrados`;
	emptyState.hidden = matchingClients.length > 0;
	clientsBody.hidden = matchingClients.length === 0;
	updateClientSummary();
}

function renderEquipment(client) {
	equipmentList.innerHTML = equipmentTemplate.map((equipment, equipmentIndex) => {
		const iconFile = equipment.icon === 'camera' ? 'camera-security.png' : 'alarm-shield-lock.png';
		const values = client.devices[equipmentIndex] ? client.devices[equipmentIndex].fields : {};
		const fields = equipment.fields.map((field) => {
			const value = values[field] || '';
			if (isEditing) {
				const inputId = `client-device-${equipmentIndex}-${field.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
				return `
					<label class="equipment-edit-field" for="${inputId}">
						<span>${escapeHtml(field)}</span>
						<input id="${inputId}" value="${escapeHtml(value)}" data-device="${equipmentIndex}" data-field="${escapeHtml(field)}" ${field === 'Senha' ? 'autocomplete="new-password"' : ''}>
						<small class="client-field-error" hidden></small>
					</label>
				`;
			}

			const displayValue = value
				? (field === 'Senha' ? '••••••••' : escapeHtml(value))
				: 'Não informado';
			return `
				<div class="equipment-field">
					<dt>${escapeHtml(field)}</dt>
					<dd class="${value ? '' : 'missing'}">
						<span>${displayValue}</span>
						<button class="copy-detail" type="button" aria-label="Copiar ${escapeHtml(field)}" data-value="${escapeHtml(value)}" ${value ? '' : 'disabled'}>
							<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>
						</button>
					</dd>
				</div>
			`;
		}).join('');

		return `
			<section class="equipment-card" aria-label="${escapeHtml(equipment.name)}">
				<header class="equipment-heading">
					<img class="equipment-icon icon-${equipment.icon}" src="../assets/img/${iconFile}" alt="">
					<h2>${escapeHtml(equipment.name)}</h2>
				</header>
				${isEditing
					? `<div class="equipment-edit-grid">${fields}</div>`
					: `<dl class="equipment-fields">${fields}</dl>`}
			</section>
		`;
	}).join('');
}

function showClient(code, edit = false) {
	const client = clients.find((item) => item.code === code);
	if (!client) return;

	activeClientCode = code;
	isEditing = edit;
	dialogClientName.textContent = client.name;
	dialogClientCode.textContent = `Código ${client.code}`;
	editError.hidden = true;
	editSuccess.hidden = true;
	editButton.hidden = isEditing;
	cancelEditButton.hidden = !isEditing;
	saveEditButton.hidden = !isEditing;
	renderEquipment(client);

	if (isEditing) validateClientEdit();
	if (!clientDialog.open) clientDialog.showModal();
}

function validateClientEdit() {
	let invalidCount = 0;
	equipmentList.querySelectorAll('.equipment-edit-field').forEach((field) => {
		const input = field.querySelector('input');
		const message = field.querySelector('.client-field-error');
		let error = '';
		if (input.dataset.field === 'Endereço IP' && !isValidIp(input.value.trim())) error = 'IP inválido';
		if (input.dataset.field === 'Senha' && !input.value.trim()) error = 'Senha obrigatória';
		field.classList.toggle('has-field-error', Boolean(error));
		input.setAttribute('aria-invalid', String(Boolean(error)));
		message.textContent = error;
		message.hidden = !error;
		if (error) invalidCount += 1;
	});

	editError.hidden = invalidCount === 0;
	editError.textContent = invalidCount
		? `${invalidCount} ${invalidCount === 1 ? 'campo precisa' : 'campos precisam'} de correção. Os campos em vermelho estão inválidos ou vazios.`
		: '';
	return invalidCount === 0;
}

clientsSearch.addEventListener('input', renderClients);

filterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		activeFilter = button.dataset.filter;
		filterButtons.forEach((item) => item.classList.toggle('active', item === button));
		renderClients();
	});
});

clientsBody.addEventListener('click', (event) => {
	const button = event.target.closest('.view-client');
	if (!button) return;

	clientsBody.querySelectorAll('tr.selected').forEach((row) => row.classList.remove('selected'));
	button.closest('tr').classList.add('selected');
	showClient(button.dataset.code);
});

editButton.addEventListener('click', () => showClient(activeClientCode, true));
cancelEditButton.addEventListener('click', () => showClient(activeClientCode));
saveEditButton.addEventListener('click', () => {
	if (!validateClientEdit()) return;
	const client = clients.find((item) => item.code === activeClientCode);
	if (!client) return;

	equipmentList.querySelectorAll('input[data-device]').forEach((input) => {
		client.devices[Number(input.dataset.device)].fields[input.dataset.field] = input.value.trim();
	});
	client.updated = new Date().toLocaleDateString('pt-BR');
	renderClients();
	showClient(client.code);
	editSuccess.hidden = false;
	editSuccess.textContent = 'Dados atualizados. A situação do cadastro foi recalculada.';
});

equipmentList.addEventListener('input', (event) => {
	if (isEditing && event.target.matches('input')) validateClientEdit();
});

clientDialog.querySelector('.dialog-close').addEventListener('click', () => clientDialog.close());
clientDialog.addEventListener('click', (event) => {
	if (event.target === clientDialog) clientDialog.close();
});
clientDialog.addEventListener('close', () => {
	isEditing = false;
	clientsBody.querySelectorAll('tr.selected').forEach((row) => row.classList.remove('selected'));
});

equipmentList.addEventListener('click', async (event) => {
	const button = event.target.closest('.copy-detail');
	if (!button || button.disabled) return;

	try {
		await navigator.clipboard.writeText(button.dataset.value);
		button.title = 'Dado copiado';
		button.setAttribute('aria-label', 'Dado copiado');
	} catch {
		button.title = 'Não foi possível copiar este dado';
		button.setAttribute('aria-label', 'Não foi possível copiar este dado');
	}
});

const initialSearch = new URLSearchParams(window.location.search).get('q') || '';
clientsSearch.value = initialSearch;
renderClients();
