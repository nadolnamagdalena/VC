import { initIntro } from './components/intro.js';
import { initNav } from './components/nav.js';
import { initThemeToggle } from './components/theme-toggle.js';
import { initBackgroundArcs } from './components/background-arcs.js';
import { initReveal } from './components/reveal.js';
import { initSlideOver } from './components/slide-over.js';

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initNav(document.querySelector('[data-component="nav"]'));
  initThemeToggle(document.querySelector('[data-component="theme-toggle"]'));
  initBackgroundArcs(document.querySelector('[data-component="background-arcs"]'));
  initReveal();
  initSlideOver();
});
