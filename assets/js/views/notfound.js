import { notFound, str, setTitle } from '../ui.js?v=1795577892';
export function render(root) { setTitle('Not found'); root.innerHTML = str(notFound()); }
