// Scroll reveals. Any element with [data-reveal] gets .is-revealed (once) when its top edge is ~75% of the way
// down the viewport; the motion itself is CSS transitions (css/sections.css), so this only flips the switch.
export function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -25% 0px' }
  );
  targets.forEach((el) => observer.observe(el));
}
