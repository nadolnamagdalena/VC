// Switches the nav between its normal (dark blue) colours and white while it sits over a dark section.
// Dark sections are marked with data-nav-theme="dark". Checked on scroll (one rAF per frame at most), so the
// page never has to know where the nav is.
export function initNav(root) {
  if (!root) return;
  const darkSections = [...document.querySelectorAll('[data-nav-theme="dark"]')];
  let queued = false;

  const update = () => {
    queued = false;
    const bar = root.getBoundingClientRect();
    const y = bar.top + bar.height / 2;          // the line through the middle of the nav
    const overDark = darkSections.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    root.classList.toggle('nav--on-dark', overDark);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  // Mobile: the Menu button opens the links panel; picking a link (or Escape) closes it
  const menu = root.querySelector('.nav__menu');
  if (menu) {
    const setOpen = (open) => {
      root.classList.toggle('nav--open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
    };
    menu.addEventListener('click', () => setOpen(!root.classList.contains('nav--open')));
    root.querySelector('.nav__panel').addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
    addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
}
