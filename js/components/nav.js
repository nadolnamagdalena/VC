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

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
}
