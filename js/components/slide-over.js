// Slide-over sections: the light section before a dark one ([data-slide-prev]) is held in place with its bottom at
// the bottom of the viewport while the dark section scrolls up over it. CSS does the holding (position: sticky);
// this only tells it where to hold (--slide-top) and how far it is covered (--cover, 0 to 1) so it can dim.
export function initSlideOver() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const prevs = [...document.querySelectorAll('[data-slide-prev]')];
  if (!prevs.length) return;
  let queued = false;

  const update = () => {
    queued = false;
    const vh = innerHeight;
    prevs.forEach((prev) => {
      const next = prev.nextElementSibling;
      if (!next) return;
      prev.style.setProperty('--slide-top', `${vh - prev.offsetHeight}px`);
      const covered = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / vh));
      prev.style.setProperty('--cover', covered.toFixed(3));
    });
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
