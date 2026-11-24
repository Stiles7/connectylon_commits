const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#login-email');
const passwordInput = document.querySelector('#login-password');
const loginMessage = document.querySelector('#login-message');
const passwordToggle = document.querySelector('#toggle-password');

function showLoginMessage(message) {
	loginMessage.textContent = message;
	loginMessage.hidden = false;
}

function clearLoginMessage() {
	loginMessage.textContent = '';
	loginMessage.hidden = true;
}

passwordToggle.addEventListener('click', () => {
	const showPassword = passwordInput.type === 'password';
	passwordInput.type = showPassword ? 'text' : 'password';
	passwordToggle.setAttribute('aria-pressed', String(showPassword));
	passwordToggle.setAttribute('aria-label', showPassword ? 'Ocultar senha' : 'Mostrar senha');
});

loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	clearLoginMessage();

	if (!emailInput.value.trim() || !passwordInput.value) {
		showLoginMessage('Informe seu e-mail e sua senha.');
		return;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
		showLoginMessage('Informe um endereço de e-mail válido.');
		return;
	}

	showLoginMessage('O serviço de autenticação ainda não está configurado. Conecte o backend de login para acessar o site.');
});

document.querySelector('#forgot-password').addEventListener('click', () => {
	clearLoginMessage();
	if (!emailInput.value.trim()) {
		showLoginMessage('Informe seu e-mail para solicitar a redefinição de senha.');
		emailInput.focus();
		return;
	}

	showLoginMessage('A recuperação de senha ainda não está configurada. Solicite ajuda ao administrador do sistema.');
});

[emailInput, passwordInput].forEach((input) => {
	input.addEventListener('input', clearLoginMessage);
});
