import { initNav } from './components/nav.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav(document.querySelector('[data-component="nav"]'));
});
