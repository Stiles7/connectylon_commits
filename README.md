# Connect Ylon

Protótipo de uma aplicação web responsiva para consulta técnica e gerenciamento de clientes, equipamentos e usuários da Connect Ylon. A interface inclui um painel administrativo e uma experiência de consulta voltada para técnicos.

> **Estado atual:** o projeto é somente front-end estático. As telas usam dados demonstrativos no próprio JavaScript; não há API, banco de dados ou autenticação real. Alterações feitas na interface não são persistidas após recarregar a página.

## Funcionalidades demonstrativas

- **Dashboard:** indicadores e histórico de importações.
- **Clientes:** busca, filtros por situação e visualização/edição dos dados de equipamentos.
- **Gerenciar cadastros:** tabela de clientes, edição e exclusão demonstrativas, seleção de arquivo `.txt` e relatório de erros de exemplo.
- **Auditoria:** filtros, paginação e detalhes de atividades fictícias.
- **Usuários do app:** criação, edição, exclusão e solicitação de redefinição de senha em memória.
- **App técnico:** demonstração de busca de clientes, consulta de equipamentos, cópia de dados e telas offline/online.
- **PWA:** manifesto e service worker para instalação e cache de recursos do app shell.

## Estrutura e arquivos
### Raiz

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Dashboard administrativo, com indicadores e uma tabela estática de importações recentes. |
| `manifest.webmanifest` | Metadados do PWA: nome, ícone, cores, modo de exibição e página inicial do app técnico. |
| `service-worker.js` | Pré-cache do app shell, limpeza de caches antigos e resposta a requisições GET da mesma origem. |
| `README.md` | Documentação do projeto, da estrutura e de como executar o protótipo. |

### `pages/`

| Arquivo | Descrição |
| --- | --- |
| `login.html` | Tela de entrada da gerência; a autenticação e a recuperação de senha ainda não estão conectadas a um serviço. |
| `cliente.html` | Lista e resumo de clientes, com pesquisa, filtros e diálogo de consulta/edição. |
| `gerencia.html` | Gerenciamento demonstrativo de cadastros, incluindo seleção de arquivo, prévia estática de importação e edição de clientes. |
| `auditoria.html` | Consulta de atividades demonstrativas, com filtros por período, usuário e tipo de ação, além de paginação e detalhes. |
| `usuario.html` | Administração demonstrativa de usuários do aplicativo, com formulários para criar, editar e excluir. |
| `tecnico.html` | Interface do app técnico: entrada demonstrativa, busca, lista de resultados e consulta de dados de equipamentos. |

### `assets/`

| Arquivo | Descrição |
| --- | --- |
| `technician-app.css` | Estilos da interface dedicada ao aplicativo técnico. |
| `sidebar.js` | Componente de navegação lateral compartilhado nas páginas administrativas, com estado ativo e menu móvel. |
| `client-data.js` | Dados fictícios de clientes e equipamentos usados pelas telas de clientes e técnicos. |
| `clients-page.js` | Busca, filtros, indicadores, visualização e edição demonstrativa na página de clientes. |
| `manage-clients.js` | Tabela e edição de cadastros, validações demonstrativas, seleção de arquivo e ações de importação. |
| `users-page.js` | Renderização e operações demonstrativas de criação, edição, exclusão e redefinição de senha de usuários. |
| `audit-page.js` | Filtros, paginação e visualização dos registros fictícios de auditoria. |
| `login.js` | Validação básica dos campos e controle de exibição da senha na tela de login da gerência. |
| `technician-app.js` | Busca, navegação entre telas, detalhes de equipamentos e estado de conexão do app técnico. |
| `pwa.js` | Registra o service worker no navegador quando esse recurso está disponível. |
| `row-selection.js` | Controla o destaque da linha selecionada quando um diálogo está aberto. |
| `dialog-scroll-lock.js` | Impede a rolagem da página enquanto há um diálogo aberto. |

### `assets/css/`

Os estilos administrativos foram separados por responsabilidade. As páginas administrativas carregam os módulos na mesma ordem para preservar a cascata que existia no `style.css` original.

| Arquivo | Descrição |
| --- | --- |
| `base.css` | Reset, variáveis visuais, estrutura comum, cartões e campos de busca. |
| `dashboard.css` | Tabela e indicadores do dashboard. |
| `clients.css` | Indicadores, filtros, tabela e diálogo de clientes. |
| `manage-clients.css` | Importação demonstrativa, tabela e edição de cadastros. |
| `audit.css` | Filtros, tabela, paginação e detalhes da auditoria. |
| `users.css` | Tabela, formulários e diálogos de usuários. |
| `login.css` | Estilos da tela de login da gerência. |

### `assets/img/`

| Arquivo | Descrição |
| --- | --- |
| `connect-ylon-app-icon.svg` | Ícone declarado no manifesto do PWA. |
| `connect-ylon-icon.svg` | Ícone usado como favicon nas páginas. |
| `connect-ylon-icon-dark.svg` | Variante escura do símbolo da marca. |
| `connect-ylon-horizontal-dark.svg` | Logotipo horizontal usado na navegação lateral. |
| `connect-ylon-horizontal-light.svg` | Variante clara do logotipo horizontal. |
| `connect-ylon-horizontal-mono-navy.svg` | Variante monocromática azul-marinho do logotipo horizontal. |
| `connect-ylon-horizontal-mono-white.svg` | Variante monocromática branca do logotipo horizontal. |
| `connect-ylon-stacked-dark.svg` | Logotipo empilhado escuro, usado no app técnico. |
| `connect-ylon-stacked-light.svg` | Logotipo empilhado claro, usado na tela de login. |
| `icon-pesquisar.svg` | Ícone de pesquisa disponível entre os recursos gráficos. |
| `camera-security.png` | Ilustração de câmera usada na interface técnica e nos equipamentos. |
| `alarm-shield-lock.png` | Ilustração de alarme usada nos equipamentos. |

## Scripts por página

Os scripts são incluídos diretamente nos arquivos HTML com `defer`, para que sejam executados após o processamento do documento.

| Página | Scripts principais |
| --- | --- |
| `index.html` | `pwa.js`, `sidebar.js`, `row-selection.js` |
| `pages/login.html` | `pwa.js`, `login.js` |
| `pages/cliente.html` | `pwa.js`, `sidebar.js`, `dialog-scroll-lock.js`, `row-selection.js`, `client-data.js`, `clients-page.js` |
| `pages/gerencia.html` | `pwa.js`, `sidebar.js`, `dialog-scroll-lock.js`, `row-selection.js`, `manage-clients.js` |
| `pages/auditoria.html` | `pwa.js`, `sidebar.js`, `dialog-scroll-lock.js`, `row-selection.js`, `audit-page.js` |
| `pages/usuario.html` | `pwa.js`, `sidebar.js`, `dialog-scroll-lock.js`, `row-selection.js`, `users-page.js` |
| `pages/tecnico.html` | `pwa.js`, `client-data.js`, `technician-app.js` |

As páginas administrativas carregam os sete módulos de `assets/css/` em ordem; a página técnica carrega somente `technician-app.css`.

## Limitações e próximos passos

- Conectar a interface a uma API e a um banco de dados para que os dados sejam reais e persistentes.
- Implementar autenticação, sessões e permissões no servidor; a validação visual no navegador não protege páginas ou dados.
- Implementar a leitura, validação e processamento real dos arquivos do Moni Software.
- Carregar indicadores e atividades a partir de dados reais, removendo números e históricos fixos.
- Definir como clientes e equipamentos serão compartilhados entre as páginas administrativas e o app técnico.
- Adicionar testes para os fluxos de formulário, busca, importação e autenticação.

## Testes

O projeto ainda não possui uma suíte de testes automatizados nem scripts de build. Para verificar mudanças de JavaScript, pode-se executar `node --check` nos arquivos `.js`; isso verifica sintaxe, não o comportamento no navegador.
