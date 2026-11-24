const syncDialogScrollLock = () => {
	document.documentElement.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
};

const dialogObserver = new MutationObserver(syncDialogScrollLock);
dialogObserver.observe(document.body, {
	attributes: true,
	attributeFilter: ['open'],
	subtree: true
});
syncDialogScrollLock();
