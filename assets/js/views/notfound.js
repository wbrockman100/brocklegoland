import { notFound, str, setTitle } from '../ui.js?v=1794661478';
export function render(root) { setTitle('Not found'); root.innerHTML = str(notFound()); }
