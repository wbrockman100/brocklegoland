import { notFound, str, setTitle } from '../ui.js?v=1794938088';
export function render(root) { setTitle('Not found'); root.innerHTML = str(notFound()); }
