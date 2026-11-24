let selectedRow = null;

function clearSelectedRow() {
	document.querySelectorAll('.table-wrap table tbody tr.selected').forEach((row) => row.classList.remove('selected'));
	selectedRow = null;
}

document.addEventListener('click', (event) => {
	const target = event.target instanceof Element ? event.target : null;
	const row = target && target.closest('.table-wrap table tbody tr');
	if (!row || row.querySelector('td[colspan]') || !document.querySelector('dialog[open]')) return;

	clearSelectedRow();
	selectedRow = row;
	row.classList.add('selected');
});

const selectionObserver = new MutationObserver(() => {
	if (!document.querySelector('dialog[open]')) clearSelectedRow();
});
selectionObserver.observe(document.body, {
	attributes: true,
	attributeFilter: ['open'],
	subtree: true
});
