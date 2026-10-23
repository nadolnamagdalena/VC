// Loading intro, following the Figma screens Intro/01-06:
//   01 tagline (short hold)  ->  02 logo + PATOMY  ->  03 the letters leave, the signet grows in place  ->
//   04 left lines brown / right lines white, split to the sides  ->  05 page colour, all lines white
//   -> header content slides up piece by piece.
//
// Everything before the finale is ONE pre-scheduled timeline (see TL): every element gets a single
// animation with keyframes at absolute times, so nothing waits on a timer or promise between stages.
// Click or Esc skips to the finale. Dev aid: ?introSpeed=0.25 plays everything at quarter speed.

const OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';        // entrances: quick start, long soft landing
const IN_OUT = 'cubic-bezier(0.45, 0, 0.15, 1)';    // moves: gentle start, gentle stop
const SOFT = 'cubic-bezier(0.5, 0, 0.1, 1)';        // finale zoom
const GENTLE = 'cubic-bezier(0.22, 1, 0.36, 1)';    // header reveal

// ---- Timeline (ms from start). Edit here to retime the intro. ----------------------------------------
const TL = {
  tagIn: 120,        // 01 tagline lines rise in
  tagInDur: 650,
  tagStagger: 100,
  tagOut: 1650,      // fully visible ~0.8 s, then rises out
  tagOutDur: 550,
  tagOutStagger: 60,
  logoIn: 1750,      // 02 mark rises; PATOMY letters follow one by one
  markInDur: 750,
  letterIn: 1830,
  letterStagger: 45,
  letterInDur: 650,
  away: 2850,        // letters rise out
  awayStagger: 25,
  awayDur: 500,
  arcColor: 3000,    // 03 letters rise out; the signet grows in place, one arc turns brown
  arcColorDur: 500,
  grow: 2850,
  growDur: 850,
};
const TOTAL = 3700;  // finale starts here

// Finale: 05 blue screen + lines zoom to the sides, 06 colours settle, then the header reveal
const ZOOM_DUR = 850;
const COLOR_AT = 550;   // ms after the finale starts: blue -> page colour, left lines brown -> white
const COLOR_DUR = 500;
const REVEAL_AT = 450;  // ms after the finale starts
const VIDEO_AT = 1100;  // ms after the reveal starts: the hero video starts once the header has settled

// ---- Scene geometry (user units of the 550.2 x 112 SVG scene) ---------------------------------------
const RISE = 100;                 // travel through the letter mask (window is 98 tall)
const MARK_RISE = 115;            // mark entrance travel (mask is 112 tall)
const pose = (x, y, s = 1) => `translate(${x}px, ${y}px) scale(${s})`;
const MARK_V2 = pose(0, 0);                 // next to the wordmark
const S4 = 1.8696;                          // grown signet
const T4 = { x: 152.4, y: -48.7 };
const MARK_V4 = pose(T4.x, T4.y, S4);
const SCENE_W = 550.2;

// The hero arcs are the mark's line pairs scaled by ARC_SCALE:
// left pair starts at mark x = 0, right pair at mark x = RIGHT_PAIR_X.
const ARC_SCALE = 912 / 112;
const RIGHT_PAIR_X = 51.9072;
const ARC_LEFT = -374;            // .hero__arcs--left  { left: -374px }
const ARC_RIGHT_OFFSET = 439;     // .hero__arcs--right { left: calc(50% + 439px) }
const BLUE = '#8CACD3';
const cssColour = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const SPEED = parseFloat(new URLSearchParams(location.search).get('introSpeed')) || 1;
const t = (ms) => ms / SPEED;

const playHeroVideo = () => document.querySelector('video.hero__image')?.play().catch(() => {});

export function initIntro() {
  const root = document.documentElement;
  const intro = document.querySelector('.intro');
  if (!intro || !root.classList.contains('intro-on')) {
    playHeroVideo();
    return;
  }

  history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  const fit = () => intro.style.setProperty('--s', Math.min(1, innerWidth / 640));
  fit();
  addEventListener('resize', fit);

  const skip = () => intro.getAnimations({ subtree: true }).forEach((a) => a.finish());
  intro.addEventListener('click', skip);
  const onKey = (e) => e.key === 'Escape' && skip();
  addEventListener('keydown', onKey);

  const $ = (s) => intro.querySelector(s);
  const taglineLines = [...intro.querySelectorAll('.intro__line > span')];
  const scene = $('.intro__scene');
  const sigClip = $('.intro__sigclip');
  const sigIn = $('.intro__sigin');
  const sig = $('.intro__sig');
  const arc = $('.intro__arc');
  const flood = $('.intro__flood');
  const letters = [...intro.querySelectorAll('.intro__lw')].map((g) => g.querySelector('.intro__lt'));
  const arcsL = $('.intro__arcs--left');
  const arcsR = $('.intro__arcs--right');

  // One animation per element spanning the whole timeline; frames = [[ms, {props}, easingToNextFrame?], ...]
  const track = (el, frames) => {
    const kf = frames.map(([ms, props, easing]) => ({ offset: ms / TOTAL, ...props, easing: easing || 'linear' }));
    if (kf[0].offset > 0) kf.unshift({ ...kf[0], offset: 0, easing: 'linear' });
    if (kf.at(-1).offset < 1) kf.push({ ...kf.at(-1), offset: 1 });
    return el.animate(kf, { duration: t(TOTAL), fill: 'both' });
  };
  const rise = (from) => ({ transform: `translateY(${from}px)` });
  const at0 = { transform: 'translateY(0px)' };

  // 01. Tagline: rises in, holds briefly, rises out
  taglineLines.forEach((l, i) => {
    const a = TL.tagIn + i * TL.tagStagger;
    const o = TL.tagOut + i * TL.tagOutStagger;
    track(l, [
      [a, { transform: 'translateY(110%)' }, OUT], [a + TL.tagInDur, { transform: 'translateY(0%)' }],
      [o, { transform: 'translateY(0%)' }, IN_OUT], [o + TL.tagOutDur, { transform: 'translateY(-110%)' }],
    ]);
  });

  // 02. Mark rises through its mask, PATOMY letters rise in one by one, then leave upward
  track(sigIn, [[TL.logoIn, rise(MARK_RISE), OUT], [TL.logoIn + TL.markInDur, at0]]);
  letters.forEach((lt, i) => {
    const start = TL.letterIn + i * TL.letterStagger;
    const away = TL.away + i * TL.awayStagger;
    track(lt, [
      [start, rise(RISE), OUT], [start + TL.letterInDur, at0],
      [away, at0, IN_OUT], [away + TL.awayDur, rise(-RISE)],
    ]);
  });

  // 03. Letters have left; the mark grows in place and one arc turns brown
  track(sig, [[TL.grow, { transform: MARK_V2 }, IN_OUT], [TL.grow + TL.growDur, { transform: MARK_V4 }]]);
  track(arc, [[TL.arcColor, { fill: BLUE }, 'ease-in-out'], [TL.arcColor + TL.arcColorDur, { fill: cssColour('--intro-sign-arc-end') }]]);

  // The mark's entrance mask is no longer needed once the mark starts growing past it
  intro.animate([], { duration: t(TL.grow) }).finished.then(() => sigClip.removeAttribute('clip-path'));

  // ---- Header content: each piece slides up from below, gently, one after another -------------------
  function revealHero() {
    root.classList.remove('intro-hold');
    // The video shows its first frame meanwhile; playing it later keeps the slide-in free of decoding work
    root.animate([], { duration: t(VIDEO_AT) }).finished.then(playHeroVideo);
    const q = (s) => [...document.querySelectorAll(s)];
    // The hidden start state is also set inline: a freshly created animation is not applied until the
    // next frame, which would flash the finished content. Inline state is cleared when it finishes.
    const from = (el, start, delay, duration = 900) => {
      const end = Object.fromEntries(Object.keys(start).map((key) => [key, key === 'opacity' ? '1' : 'none']));
      Object.assign(el.style, start);
      const a = el.animate([start, end], { duration: t(duration), delay: t(delay), easing: GENTLE, fill: 'both' });
      a.finished.then(() => {
        Object.keys(start).forEach((key) => (el.style[key] = ''));
        a.cancel();
      });
    };
    const up = (el, delay, distance = 18, duration) => from(el, { opacity: '0', transform: `translateY(${distance}px)` }, delay, duration);
    const mask = (el, delay, duration) => from(el, { transform: 'translateY(110%)' }, delay, duration);

    up(document.querySelector('.nav__logo'), 0, 12, 800);
    q('.nav__links li').forEach((li, i) => up(li, 60 + i * 60, 12, 800));
    q('.nav__actions .btn').forEach((b, i) => up(b, 380 + i * 80, 12, 800));

    mask(document.querySelector('.hero .eyebrow > span'), 120, 900);
    q('.hero__title .line > span').forEach((l, i) => mask(l, 220 + i * 110, 1000));
    mask(document.querySelector('.hero__lead > span'), 520, 950);
    up(document.querySelector('.hero__ctas'), 640, 20, 900);
    mask(document.querySelector('.hero__note > span'), 760, 850);
    up(document.querySelector('.hero__image'), 380, 50, 1100);
    q('.theme-toggle').forEach((el) => up(el, 860, 12, 700));
  }

  // 04-05. The mark's line pairs split to the sides and zoom into the
  // real hero arcs (same shapes, scaled 8.14x); then the intro colour -> page colour and the left lines -> arc colour.
  function finale() {
    const W = root.clientWidth;
    const H = innerHeight;
    const r = scene.getBoundingClientRect();
    const k = r.width / SCENE_W;                    // rendered scale of the scene
    const refY = r.top + k * T4.y;                  // where the mark's top edge is on screen
    const leftX = r.left + k * T4.x;                // mark x = 0
    const rightX = r.left + k * (T4.x + S4 * RIGHT_PAIR_X);
    const sigma = (k * S4) / ARC_SCALE;             // arcs image px -> screen px at mark size
    const rightHome = W / 2 + ARC_RIGHT_OFFSET;
    const pageBg = getComputedStyle(document.body).backgroundColor;

    // Inline start states too: a new animation is not applied until the next frame, and no frame may show
    // these layers unplaced.
    const zoomOpts = { duration: t(ZOOM_DUR), easing: SOFT, fill: 'both' };
    const colourOpts = { duration: t(COLOR_DUR), delay: t(COLOR_AT), easing: 'ease-in-out', fill: 'both' };
    const done = [];

    // Full-screen colour layer fades from the intro colour to the page colour
    const introBg = getComputedStyle(intro).backgroundColor;
    flood.style.visibility = 'visible';
    done.push(flood.animate([{ backgroundColor: introBg }, { backgroundColor: pageBg }], colourOpts).finished);

    const realArcs = (side) => getComputedStyle(document.querySelector(`.bg-arcs .hero__arcs--${side}`));
    const go = (group, startX, home, startColours, side) => {
      const [from, to] = group.children;
      const end = realArcs(side);
      const place = `translate(${startX - home}px, ${refY}px) scale(${sigma})`;
      // startColours: one colour per stripe of the start layer (the left pair has two stripes, the right one layer)
      const stripes = from.children.length ? [...from.children] : [from];
      stripes.forEach((el, i) => (el.style.background = startColours[i] ?? startColours[0]));
      to.style.background = end.backgroundColor;
      to.style.opacity = '0';
      Object.assign(group.style, { visibility: 'visible', transform: place });
      done.push(group.animate([{ transform: place }, { transform: 'translate(0px, 0px) scale(1)' }], zoomOpts).finished);
      done.push(from.animate([{ opacity: 1 }, { opacity: 0 }], colourOpts).finished);
      done.push(to.animate([{ opacity: 0 }, { opacity: end.opacity }], colourOpts).finished);
      return stripes;
    };
    // The left inner stripe starts in the sign's own arc colour and settles into its final one while zooming
    const innerEnd = cssColour('--intro-left-inner');
    const leftStripes = go(arcsL, leftX, ARC_LEFT, [innerEnd, cssColour('--intro-left-outer')], 'left');
    leftStripes[0].style.background = cssColour('--intro-sign-arc-end');
    done.push(leftStripes[0].animate([{ backgroundColor: cssColour('--intro-sign-arc-end') }, { backgroundColor: innerEnd }], zoomOpts).finished);
    go(arcsR, rightX, rightHome, ['#F2F2F2'], 'right');

    scene.style.visibility = 'hidden';
    intro.style.pointerEvents = 'none';
    intro.animate([], { duration: t(REVEAL_AT) }).finished.then(revealHero);

    Promise.all(done).then(() => {
      // The overlay's arcs and colour now equal the page's own: hand over
      root.classList.remove('intro-on');
      intro.remove();
      removeEventListener('resize', fit);
      removeEventListener('keydown', onKey);
      performance.mark('intro-end');
    });
  }

  performance.mark('intro-start');
  intro.animate([], { duration: t(TOTAL) }).finished.then(finale, finale);

  // Safety net: never leave the page covered or hidden
  setTimeout(() => {
    root.classList.remove('intro-on', 'intro-hold');
    intro.remove();
  }, t(20000));
}
