class ConnectYlonSidebar extends HTMLElement {
	connectedCallback() {
		// Define os caminhos e destaca a página atual.
		const base = this.getAttribute('base') || './';
		const currentPage = window.location.pathname.split('/').pop() || 'index.html';

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--sidebar-width: 205px;
					--navy: #20293a;
					--navy-light: #293448;
					--accent: #3D86FF;
				}

				* { box-sizing: border-box; }

				button, a { font-family: "DM Sans", sans-serif; }

				.menu-toggle,
				.overlay { display: none; }

				.sidebar {
					position: fixed;
					inset: 0 auto 0 0;
					z-index: 20;
					display: flex;
					width: var(--sidebar-width);
					height: 100vh;
					flex-direction: column;
					padding: 28px 18px 18px;
					color: #fff;
					background: var(--navy);
					box-shadow: 8px 0 30px rgb(27 35 49 / 8%);
				}

				.brand {
					display: flex;
					align-items: center;
					margin: 0 0 38px;
					color: #fff;
					text-decoration: none;
				}

				.brand-logo {
					display: block;
					width: 100%;
					height: auto;
					object-fit: contain;
				}

				.nav-menu {
					display: flex;
					flex-direction: column;
					gap: 6px;
				}

				.nav-item {
					position: relative;
					display: flex;
					min-height: 44px;
					align-items: center;
					gap: 13px;
					padding: 0 13px;
					border-radius: 10px;
					color: #adb5c3;
					font-size: 13px;
					font-weight: 500;
					text-decoration: none;
					transition: 180ms ease;
				}

				.nav-item:hover {
					color: #fff;
					background: rgb(255 255 255 / 5%);
				}

				.nav-item.active {
					color: #fff;
					background: var(--navy-light);
				}

				.nav-item.active::before {
					position: absolute;
					left: -18px;
					width: 4px;
					height: 26px;
					border-radius: 0 4px 4px 0;
					background: var(--accent);
					content: "";
				}

				.sidebar-footer {
					margin-top: auto;
				}

				.sidebar-footer .nav-item {
					margin-bottom: 5px;
				}

				@media (max-width: 760px) {
					.menu-toggle {
						position: fixed;
						z-index: 40;
						top: 18px;
						left: 18px;
						display: flex;
						width: 44px;
						height: 44px;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 5px;
						border: 0;
						border-radius: 11px;
						background: var(--navy);
						box-shadow: 0 8px 22px rgb(32 41 58 / 18%);
						cursor: pointer;
					}

					.menu-toggle span {
						width: 18px;
						height: 2px;
						border-radius: 2px;
						background: #fff;
						transition: 180ms ease;
					}

					.menu-toggle.open span:nth-child(1) {
						transform: translateY(7px) rotate(45deg);
					}

					.menu-toggle.open span:nth-child(2) { opacity: 0; }

					.menu-toggle.open span:nth-child(3) {
						transform: translateY(-7px) rotate(-45deg);
					}

					.sidebar {
						transform: translateX(-100%);
						transition: transform 220ms ease;
					}

					.sidebar.open { transform: translateX(0); }

					.overlay {
						position: fixed;
						inset: 0;
						z-index: 10;
						display: block;
						background: rgb(24 31 43 / 45%);
						opacity: 0;
						pointer-events: none;
						transition: opacity 220ms ease;
					}

					.overlay.open {
						opacity: 1;
						pointer-events: auto;
					}
				}
			</style>

			<button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="sidebar" aria-expanded="false">
				<span></span><span></span><span></span>
			</button>
			<div class="overlay" aria-hidden="true"></div>

			<aside class="sidebar" id="sidebar" aria-label="Navegação principal">
				<a class="brand" href="${base}index.html" aria-label="Connect Ylon">
					<img class="brand-logo" src="${base}assets/img/connect-ylon-horizontal-dark.svg" alt="Connect Ylon">
				</a>

				<nav class="nav-menu">
					<a class="nav-item" data-page="index.html" href="${base}index.html"><span>Dashboard</span></a>
					<a class="nav-item" data-page="cliente.html" href="${base}pages/cliente.html"><span>Clientes</span></a>
					<a class="nav-item" data-page="gerencia.html" href="${base}pages/gerencia.html"><span>Gerenciar cadastros</span></a>
					<a class="nav-item" data-page="auditoria.html" href="${base}pages/auditoria.html"><span>Auditoria</span></a>
					<a class="nav-item" data-page="usuario.html" href="${base}pages/usuario.html"><span>Usuários do app</span></a>
				</nav>

				<div class="sidebar-footer">
					<a class="nav-item" href="${base}pages/login.html"><span>Sair</span></a>
				</div>
			</aside>
		`;

		const sidebar = this.shadowRoot.querySelector('.sidebar');
		const toggle = this.shadowRoot.querySelector('.menu-toggle');
		const overlay = this.shadowRoot.querySelector('.overlay');

		this.shadowRoot.querySelectorAll('.nav-item[data-page]').forEach((item) => {
			item.classList.toggle('active', item.dataset.page === currentPage);
		});

		// Mantém menu móvel, sobreposição e atributos acessíveis sincronizados.
		const setMenu = (open) => {
			sidebar.classList.toggle('open', open);
			overlay.classList.toggle('open', open);
			toggle.classList.toggle('open', open);
			toggle.setAttribute('aria-expanded', String(open));
			toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
		};

		toggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
		overlay.addEventListener('click', () => setMenu(false));
		this.shadowRoot.querySelectorAll('.nav-item').forEach((item) => {
			item.addEventListener('click', () => setMenu(false));
		});
	}
}

customElements.define('connect-ylon-sidebar', ConnectYlonSidebar);
