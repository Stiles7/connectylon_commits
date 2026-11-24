const users = [
	{ id: 1, name: 'Maylon Reis', fullName: 'Maylon de Oliveira Faria dos Reis', email: 'maylonreis@visatec.com.br', username: 'aux.maylon.reis', role: 'Aux. Técnico', status: 'Ativo', lastAccess: '14/11/2026 · 09:42' },
	{ id: 2, name: 'Bruno', fullName: 'Bruno Santos', email: 'bruno@visatec.com.br', username: 'sup.bruno', role: 'Supervisor', status: 'Ativo', lastAccess: '14/11/2026 · 08:15' },
	{ id: 3, name: 'Mateus', fullName: 'Mateus Oliveira', email: 'mateus@visatec.com.br', username: 'tec.mateus', role: 'Técnico', status: 'Ativo', lastAccess: '13/11/2026 · 17:30' },
	{ id: 4, name: 'João Paulo', fullName: 'João Paulo Souza', email: 'joaopaulo@visatec.com.br', username: 'aux.joao.paulo', role: 'Aux. Técnico', status: 'Ativo', lastAccess: '13/11/2026 · 16:48' },
	{ id: 5, name: 'Lais', fullName: 'Lais Almeida', email: 'lais@visatec.com.br', username: 'est.lais', role: 'Estoquista', status: 'Inativo', lastAccess: '06/11/2026 · 10:12' },
	{ id: 6, name: 'Silvio', fullName: 'Silvio Costa', email: 'silvio@visatec.com.br', username: 'ceo.silvio', role: 'CEO', status: 'Ativo', lastAccess: '13/11/2026 · 14:20' },
	{ id: 7, name: 'Glaucia', fullName: 'Glaucia Oliveira', email: 'glaucia@visatec.com.br', username: 'ger.glaucia', role: 'Gerente', status: 'Ativo', lastAccess: '12/11/2026 · 11:05' }
];

const usersBody = document.querySelector('#users-body');
const usersTotal = document.querySelector('#users-total');
const usersEmpty = document.querySelector('#users-empty');
const editorDialog = document.querySelector('#user-editor-dialog');
const userForm = document.querySelector('#user-form');
const nameInput = document.querySelector('#user-name');
const emailInput = document.querySelector('#user-email');
const usernameInput = document.querySelector('#user-username');
const passwordField = document.querySelector('#user-password-field');
const passwordInput = document.querySelector('#user-password');
const roleInput = document.querySelector('#user-role');
const formError = document.querySelector('#user-form-error');
const editorTitle = document.querySelector('#user-editor-title');
const securityBox = document.querySelector('#user-security-box');
const resetMessage = document.querySelector('#user-reset-message');
const saveUserButton = document.querySelector('#save-user-button');
const deleteDialog = document.querySelector('#user-delete-dialog');
const toast = document.querySelector('#users-toast');
let editingUserId = null;
let deletingUserId = null;
let nextUserId = Math.max(...users.map((user) => user.id)) + 1;
let toastTimer;

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[character]);
}

function renderUsers() {
	usersBody.innerHTML = users.map((user) => `
		<tr>
			<td>
				<strong class="user-display-name">${escapeHtml(user.name)}</strong>
				<span class="user-display-username">${escapeHtml(user.username)}</span>
			</td>
			<td>${escapeHtml(user.email)}</td>
			<td>${escapeHtml(user.role)}</td>
			<td><span class="user-status ${user.status === 'Ativo' ? 'active' : 'inactive'}">${escapeHtml(user.status)}</span></td>
			<td class="user-last-access">${escapeHtml(user.lastAccess)}</td>
			<td class="user-row-actions">
				<button class="button button-edit" type="button" data-action="edit" data-id="${user.id}">Editar</button>
				<button class="button button-delete" type="button" data-action="delete" data-id="${user.id}">Excluir</button>
			</td>
		</tr>
	`).join('');
	usersEmpty.hidden = users.length > 0;
	usersBody.hidden = users.length === 0;
	usersTotal.textContent = `${users.length} ${users.length === 1 ? 'usuário no total' : 'usuários no total'}`;
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('visible');
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3500);
}

function getDisplayName(fullName) {
	const parts = fullName.split(/\s+/);
	return parts.length > 2 ? `${parts[0]} ${parts[parts.length - 1]}` : fullName;
}

function openEditor(user) {
	editingUserId = user ? user.id : null;
	editorTitle.textContent = user ? 'Editar usuário' : 'Novo usuário';
	nameInput.value = user ? user.fullName : '';
	emailInput.value = user ? user.email : '';
	usernameInput.value = user ? user.username : '';
	passwordInput.value = '';
	passwordField.hidden = Boolean(user);
	roleInput.value = user ? user.role : 'Técnico';
	securityBox.hidden = !user;
	resetMessage.hidden = true;
	saveUserButton.textContent = user ? 'Salvar alterações' : 'Criar usuário';
	formError.hidden = true;
	editorDialog.showModal();
}

function closeEditor() {
	editorDialog.close();
	passwordInput.value = '';
}

function validateUser() {
	const name = nameInput.value.trim();
	const email = emailInput.value.trim();
	const username = usernameInput.value.trim();
	let message = '';

	if (!name || !email || !username || (editingUserId === null && !passwordInput.value)) {
		message = 'Preencha todos os campos obrigatórios.';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		message = 'Informe um endereço de e-mail válido.';
	} else {
		const duplicate = users.find((user) => user.id !== editingUserId
			&& (user.email.toLowerCase() === email.toLowerCase()
				|| user.username.toLowerCase() === username.toLowerCase()));
		if (duplicate) message = 'Este e-mail ou nome de usuário já está cadastrado.';
	}

	formError.textContent = message;
	formError.hidden = !message;
	return !message;
}

usersBody.addEventListener('click', (event) => {
	const button = event.target.closest('[data-action]');
	if (!button) return;
	const user = users.find((item) => item.id === Number(button.dataset.id));
	if (!user) return;

	if (button.dataset.action === 'edit') {
		openEditor(user);
		return;
	}

	deletingUserId = user.id;
	document.querySelector('#delete-user-name').textContent = user.name;
	document.querySelector('#delete-user-email').textContent = user.email;
	deleteDialog.showModal();
});

document.querySelector('#new-user').addEventListener('click', () => openEditor(null));
document.querySelector('#close-user-editor').addEventListener('click', closeEditor);
document.querySelector('#cancel-user-edit').addEventListener('click', closeEditor);
editorDialog.addEventListener('click', (event) => {
	if (event.target === editorDialog) closeEditor();
});
editorDialog.addEventListener('close', () => {
	passwordInput.value = '';
});

userForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (!validateUser()) return;

	const fullName = nameInput.value.trim();
	const existingUser = users.find((user) => user.id === editingUserId);
	const formValues = {
		fullName,
		name: existingUser && existingUser.fullName === fullName ? existingUser.name : getDisplayName(fullName),
		email: emailInput.value.trim(),
		username: usernameInput.value.trim(),
		role: roleInput.value
	};
	if (editingUserId === null) {
		users.push({ id: nextUserId++, ...formValues, status: 'Ativo', lastAccess: 'Nunca acessou' });
		closeEditor();
		renderUsers();
		showToast('Usuário criado na demonstração.');
		return;
	}

	if (!existingUser) return;
	Object.assign(existingUser, formValues);
	closeEditor();
	renderUsers();
	showToast('Alterações salvas na demonstração.');
});

document.querySelector('#reset-user-password').addEventListener('click', () => {
	const user = users.find((item) => item.id === editingUserId);
	if (!user) return;
	resetMessage.textContent = `Solicitação de redefinição enviada para ${user.email} (demonstração).`;
	resetMessage.hidden = false;
});

document.querySelector('#cancel-user-delete').addEventListener('click', () => deleteDialog.close());
document.querySelector('#confirm-user-delete').addEventListener('click', () => {
	const userIndex = users.findIndex((item) => item.id === deletingUserId);
	if (userIndex === -1) return;
	const [deletedUser] = users.splice(userIndex, 1);
	deleteDialog.close();
	renderUsers();
	showToast(`Usuário ${deletedUser.name} excluído da demonstração.`);
	deletingUserId = null;
});

deleteDialog.addEventListener('click', (event) => {
	if (event.target === deleteDialog) deleteDialog.close();
});

renderUsers();
