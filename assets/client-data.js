// Dados demonstrativos usados até a lista ser conectada a uma API.
window.connectYlonClients = [
	{ code: '999005', name: 'Cliente 999005', equipment: 2, status: 'complete', updated: '12/11/2026' },
	{ code: '999004', name: 'Cliente 999004', equipment: 6, status: 'missing-password', updated: '12/11/2026' },
	{ code: '999006', name: 'Cliente 999006', equipment: 8, status: 'complete', updated: '12/11/2026' },
	{ code: '999007', name: 'Cliente 999007', equipment: 5, status: 'complete', updated: '11/11/2026' },
	{ code: '999008', name: 'Cliente 999008', equipment: 2, status: 'complete', updated: '11/11/2026' },
	{ code: '999009', name: 'Cliente 999009', equipment: 7, status: 'complete', updated: '11/11/2026' },
	{ code: '999003', name: 'Cliente 999003', equipment: 3, status: 'complete', updated: '12/11/2026' },
	{ code: '999010', name: 'Cliente 999010', equipment: 2, status: 'complete', updated: '10/11/2026' }
];

window.connectYlonClients.forEach((client, index) => {
	client.devices = [
		{
			name: 'DVR',
			fields: {
				'Endereço IP': `192.168.99.${90 + index}`,
				'Porta de acesso': '9999',
				'Porta de serviço': '9999',
				'Usuário': 'usuario999',
				'Senha': '99999999'
			}
		},
		{
			name: 'Central de alarme',
			fields: {
				'Endereço IP': `192.168.99.${100 + index}`,
				'Porta de acesso': '9999',
				'Usuário': 'usuario999',
				'Senha': client.code === '999004' ? '' : '99999999'
			}
		}
	];
});
