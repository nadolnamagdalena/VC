// The background lines are white over the hero and turn blue / brown as the next section comes into view.
// Docking (staying pinned while the hero scrolls, then landing on the section) is pure CSS: css/sections.css.
export function initBackgroundArcs(root) {
  const section = document.querySelector('#problem');
  if (!root || !section) return;

  // Fires when the section's top edge crosses 55% of the viewport height, in either scroll direction
  const observer = new IntersectionObserver(
    ([entry]) => {
      const reached = entry.isIntersecting || entry.boundingClientRect.top < 0;
      root.classList.toggle('bg-arcs--color', reached);
    },
    { rootMargin: '0px 0px -45% 0px' }
  );
  observer.observe(section);
}
