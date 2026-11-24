const managedClients = [
	{
		code: '999001',
		name: 'Cliente 999001',
		equipment: 2,
		devices: [
			{ name: 'DVR', fields: { 'Endereço IP': '192.168.99.91', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } },
			{ name: 'Central de alarme', fields: { 'Endereço IP': '192.168.99.92', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } }
		]
	},
	{
		code: '999002',
		name: 'Cliente 999002',
		equipment: 4,
		devices: [
			{ name: 'DVR', fields: { 'Endereço IP': '999.999.999.999', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } },
			{ name: 'Central de alarme', fields: { 'Endereço IP': '192.168.99.94', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '' } }
		]
	},
	{
		code: '999003',
		name: 'Cliente 999003',
		equipment: 3,
		devices: [
			{ name: 'DVR', fields: { 'Endereço IP': '192.168.99.95', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } },
			{ name: 'Central de alarme', fields: { 'Endereço IP': '192.168.99.96', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } }
		]
	},
	{
		code: '999004',
		name: 'Cliente 999004',
		equipment: 6,
		devices: [
			{ name: 'DVR', fields: { 'Endereço IP': '192.168.99.97', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } },
			{ name: 'Central de alarme', fields: { 'Endereço IP': '192.168.99.98', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '' } }
		]
	},
	{
		code: '999005',
		name: 'Cliente 999005',
		equipment: 2,
		devices: [
			{ name: 'DVR', fields: { 'Endereço IP': '192.168.99.99', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } },
			{ name: 'Central de alarme', fields: { 'Endereço IP': '192.168.99.100', 'Porta de acesso': '9999', 'Usuário': 'usuario999', 'Senha': '99999999' } }
		]
	}
];

const manageBody = document.querySelector('#manage-clients-body');
const manageSearch = document.querySelector('#manage-search');
const manageCount = document.querySelector('#manage-count');
const manageEmpty = document.querySelector('#manage-empty');
const manageFooter = document.querySelector('#manage-footer');
const errorFilterButton = document.querySelector('.manage-filters [data-filter="errors"]');
const errorBanner = document.querySelector('.manage-error-banner');
const errorBannerTitle = errorBanner.querySelector('strong');
const errorBannerDescription = errorBanner.querySelector('p');
const editDialog = document.querySelector('#edit-dialog');
const editForm = document.querySelector('#edit-form');
const editName = document.querySelector('#edit-name');
const editCode = document.querySelector('#edit-code');
const editSubtitle = document.querySelector('#edit-subtitle');
const editEquipmentList = document.querySelector('#edit-equipment-list');
const editValidation = document.querySelector('#edit-validation');
const toast = document.querySelector('#manage-toast');
const fileInput = document.querySelector('#import-file');
const filename = document.querySelector('#import-filename');
const uploadMessage = document.querySelector('#upload-message');
let activeFilter = 'all';
let editingCode = '';
let toastTimer;
const defaultFilename = 'clientes_2026-11-12.txt';

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

function renderClients() {
	const errorCount = managedClients.filter((client) => Boolean(getClientIssue(client))).length;
	const term = normalize(manageSearch.value.trim());
	const matching = managedClients.filter((client) => {
		const matchesTerm = normalize(`${client.code} ${client.name}`).includes(term);
		const matchesFilter = activeFilter === 'all' || Boolean(getClientIssue(client));
		return matchesTerm && matchesFilter;
	});

	manageBody.innerHTML = matching.map((client) => {
		const issue = getClientIssue(client);
		return `
			<tr class="${issue ? 'has-error' : ''}">
				<td>${escapeHtml(client.code)}</td>
				<td class="manage-client-name">${escapeHtml(client.name)}</td>
				<td class="manage-equipment-count">${client.equipment} equipamentos</td>
				<td><span class="manage-status ${issue ? 'incomplete' : 'complete'}"><span aria-hidden="true"></span>${issue || 'Completo'}</span></td>
				<td class="manage-row-actions">
					<button class="button button-edit" type="button" data-action="edit" data-code="${client.code}">Editar</button>
					<button class="button button-delete" type="button" data-action="delete" data-code="${client.code}">Excluir</button>
				</td>
			</tr>
		`;
	}).join('');

	const hasTerm = term.length > 0;
	manageCount.textContent = hasTerm
		? `${matching.length} ${matching.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}`
		: '';
	manageEmpty.hidden = matching.length > 0;
	manageBody.hidden = matching.length === 0;
	errorFilterButton.innerHTML = `<span aria-hidden="true">●</span> Com erro de dados (${errorCount})`;
	errorBanner.hidden = errorCount === 0;
	errorBannerTitle.textContent = `${errorCount} ${errorCount === 1 ? 'cliente com dados incompletos ou inválidos' : 'clientes com dados incompletos ou inválidos'}`;
	errorBannerDescription.textContent = errorCount
		? 'Corrija os cadastros para que os técnicos tenham sempre os dados certos.'
		: '';
	manageFooter.textContent = hasTerm
		? `Mostrando ${matching.length} ${matching.length === 1 ? 'cliente' : 'clientes'}`
		: `Mostrando ${matching.length} de 1.248 clientes`;
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('visible');
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3500);
}

function openEditor(code) {
	const client = managedClients.find((item) => item.code === code);
	if (!client) return;

	editingCode = code;
	editName.value = client.name;
	editCode.value = client.code;
	editSubtitle.textContent = `Código ${client.code} · importado do Moni Software`;
	editValidation.hidden = true;
	editEquipmentList.innerHTML = client.devices.map((device, deviceIndex) => `
		<section class="edit-equipment-card" aria-label="${escapeHtml(device.name)}">
			<h4>${escapeHtml(device.name)}</h4>
			<div class="edit-device-fields">
				${Object.entries(device.fields).map(([field, value]) => {
					const invalidIp = field === 'Endereço IP' && !isValidIp(value || '');
					const missingPassword = field === 'Senha' && !value;
					const inputId = `device-${deviceIndex}-${field.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
					return `
						<label class="edit-field ${invalidIp || missingPassword ? 'has-field-error' : ''}" for="${inputId}">
							<span>${escapeHtml(field)}</span>
							<input id="${inputId}" name="device-${deviceIndex}-${escapeHtml(field)}" value="${escapeHtml(value)}" data-device="${deviceIndex}" data-field="${escapeHtml(field)}" ${field === 'Endereço IP' ? 'inputmode="decimal"' : ''}>
							<small class="field-error" ${invalidIp || missingPassword ? '' : 'hidden'}>${invalidIp ? 'IP inválido' : 'Senha obrigatória'}</small>
						</label>
					`;
				}).join('')}
			</div>
		</section>
	`).join('');
	validateEditor();
	editDialog.showModal();
}

function closeEditor() {
	editDialog.close();
}

function validateEditor() {
	let invalidCount = 0;
	editEquipmentList.querySelectorAll('.edit-field').forEach((field) => {
		const input = field.querySelector('input');
		const message = field.querySelector('.field-error');
		let error = '';
		if (input.dataset.field === 'Endereço IP' && !isValidIp(input.value.trim())) error = 'IP inválido';
		if (input.dataset.field === 'Senha' && !input.value.trim()) error = 'Senha obrigatória';
		field.classList.toggle('has-field-error', Boolean(error));
		message.textContent = error;
		message.hidden = !error;
		if (error) invalidCount += 1;
	});

	const nameIsEmpty = !editName.value.trim();
	editName.closest('.edit-field').classList.toggle('has-field-error', nameIsEmpty);
	if (nameIsEmpty) invalidCount += 1;
	editValidation.hidden = invalidCount === 0;
	editValidation.innerHTML = `<strong>${invalidCount} ${invalidCount === 1 ? 'campo precisa' : 'campos precisam'} de correção</strong><span>Os campos em vermelho estão inválidos ou vazios.</span>`;
	return invalidCount === 0;
}

document.querySelectorAll('.manage-filters .filter-chip').forEach((button) => {
	button.addEventListener('click', () => {
		activeFilter = button.dataset.filter;
		document.querySelectorAll('.manage-filters .filter-chip').forEach((item) => item.classList.toggle('active', item === button));
		renderClients();
	});
});

manageSearch.addEventListener('input', renderClients);

document.querySelector('#show-errors').addEventListener('click', () => {
	activeFilter = 'errors';
	document.querySelectorAll('.manage-filters .filter-chip').forEach((button) => {
		button.classList.toggle('active', button.dataset.filter === 'errors');
	});
	renderClients();
	document.querySelector('#manage-clients-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

manageBody.addEventListener('click', (event) => {
	const button = event.target.closest('[data-action]');
	if (!button) return;
	if (button.dataset.action === 'edit') openEditor(button.dataset.code);
	if (button.dataset.action === 'delete') {
		const client = managedClients.find((item) => item.code === button.dataset.code);
		if (!client || !window.confirm(`Excluir o cadastro de ${client.name}?`)) return;
		managedClients.splice(managedClients.indexOf(client), 1);
		renderClients();
		showToast('Cadastro excluído da demonstração.');
	}
});

editEquipmentList.addEventListener('input', (event) => {
	if (event.target.matches('input')) validateEditor();
});

document.querySelector('.edit-close').addEventListener('click', closeEditor);
document.querySelector('#cancel-edit').addEventListener('click', closeEditor);
editDialog.addEventListener('click', (event) => {
	if (event.target === editDialog) closeEditor();
});

editForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (!validateEditor()) return;
	const client = managedClients.find((item) => item.code === editingCode);
	if (!client) return;

	client.name = editName.value.trim();
	editEquipmentList.querySelectorAll('input[data-device]').forEach((input) => {
		client.devices[Number(input.dataset.device)].fields[input.dataset.field] = input.value.trim();
	});
	closeEditor();
	renderClients();
	showToast('Alterações salvas na demonstração.');
});

const dropzone = document.querySelector('#upload-dropzone');
const resetImport = () => {
	fileInput.value = '';
	filename.textContent = defaultFilename;
	uploadMessage.textContent = '';
};

document.querySelector('#select-file').addEventListener('click', () => fileInput.click());
dropzone.addEventListener('click', (event) => {
	if (event.target.closest('button')) return;
	fileInput.click();
});
dropzone.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		fileInput.click();
	}
});

function acceptFile(file) {
	if (!file) return;
	if (!file.name.toLowerCase().endsWith('.txt')) {
		uploadMessage.textContent = 'Selecione um arquivo .txt do Moni Software.';
		uploadMessage.classList.add('upload-error');
		fileInput.value = '';
		return;
	}
	uploadMessage.classList.remove('upload-error');
	uploadMessage.textContent = 'Arquivo selecionado para pré-visualização.';
	filename.textContent = file.name;
}

fileInput.addEventListener('change', () => acceptFile(fileInput.files[0]));
['dragenter', 'dragover'].forEach((eventName) => {
	dropzone.addEventListener(eventName, (event) => {
		event.preventDefault();
		dropzone.classList.add('drag-over');
	});
});
['dragleave', 'drop'].forEach((eventName) => {
	dropzone.addEventListener(eventName, (event) => {
		event.preventDefault();
		dropzone.classList.remove('drag-over');
	});
});
dropzone.addEventListener('drop', (event) => acceptFile(event.dataTransfer.files[0]));

document.querySelector('#cancel-import').addEventListener('click', resetImport);
document.querySelector('#confirm-import').addEventListener('click', () => {
	showToast('Importação confirmada na demonstração. Conecte o serviço para aplicar os dados.');
});

document.querySelector('#download-errors').addEventListener('click', () => {
	const report = 'Linha;Erro\r\n12;Endereço IP inválido\r\n34;Senha ausente\r\n57;Código de cliente inválido\r\n';
	const url = URL.createObjectURL(new Blob([report], { type: 'text/csv;charset=utf-8' }));
	const link = document.createElement('a');
	link.href = url;
	link.download = 'relatorio-de-erros.csv';
	link.click();
	URL.revokeObjectURL(url);
});

renderClients();
