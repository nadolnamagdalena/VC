// Switches the page between light and dark via <html data-theme>; choice is saved in localStorage.
export function initThemeToggle(root) {
  if (!root) return;
  const buttons = root.querySelectorAll('[data-theme-value]');

  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeValue === theme)));
  };

  apply(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      apply(b.dataset.themeValue);
      try { localStorage.setItem('theme', b.dataset.themeValue); } catch (e) { /* storage unavailable */ }
    })
  );
}
