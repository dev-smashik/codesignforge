import { useLayoutEffect, useRef } from "react";
import { AnimatedStroke } from "./animated-stroke";

const CSS = `
.im-export{width:100%;height:100vh;height:100dvh}
.im-export .im-root{width:100%;height:100%}
.im-export .im-theme{top:max(clamp(14px,3cqh,28px),env(safe-area-inset-top));right:max(clamp(14px,3cqw,32px),env(safe-area-inset-right))}

.im-host,.im-frame{width:100%;height:100%}.im-frame{display:grid;place-items:center}
.im-root{--im-bg:#000;--im-fg:#fff;--im-text-shadow:0 2px 28px rgb(0 0 0/.7);--im-card-shadow:0 1px 0 rgb(255 255 255/.06) inset,0 28px 60px -12px rgb(0 0 0/.8);--im-card-bg:#111;--im-btn-hover:#1a1a1a;--im-btn-line:rgb(255 255 255/.4);
position:relative;width:min(100%,var(--im-w));height:min(100%,var(--im-h));margin:0;overflow:hidden;isolation:isolate;container:im-stage/size;color-scheme:dark;
background:var(--im-bg);color:var(--im-fg);user-select:none;transition:background-color .5s ease,color .5s ease;
font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.im-root[data-theme="light"]{--im-bg:#fff;--im-fg:#000;--im-text-shadow:0 1px 24px rgb(255 255 255/.85);--im-card-shadow:0 1px 0 rgb(255 255 255/.5) inset,0 24px 48px -16px rgb(0 0 0/.22);--im-card-bg:#f0f0f0;--im-btn-hover:#f0f0f0;--im-btn-line:rgb(0 0 0/.4);color-scheme:light}
.im-field{position:absolute;inset:0;z-index:1;margin:0;padding:0;list-style:none;pointer-events:none;perspective:var(--im-persp,900px);perspective-origin:50% 50%}
.im-piece{position:absolute;left:50%;top:50%;width:var(--im-piece,240px);aspect-ratio:1;margin:calc(var(--im-piece,240px)/-2) 0 0 calc(var(--im-piece,240px)/-2);opacity:0;visibility:hidden;will-change:transform,opacity,filter;backface-visibility:hidden}
.im-piece img{display:block;width:100%;height:100%;object-fit:cover;border-radius:var(--im-corner);box-shadow:var(--im-card-shadow);background:var(--im-card-bg)}
.im-copy{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;padding:0 5cqw;text-align:center;pointer-events:none}
.im-title{margin:0;font-family:'IM Instrument Serif','Instrument Serif','Times New Roman',serif;font-weight:400;font-size:calc(clamp(40px,1.5rem + 9cqw,188px) * var(--im-ts));line-height:.9;letter-spacing:-.025em;text-shadow:var(--im-text-shadow);text-wrap:balance}
.im-title em{font-style:italic;letter-spacing:-.01em}
@container im-stage (max-width:759px) and (orientation:portrait){.im-title{font-size:calc(clamp(44px,21cqw,112px) * var(--im-ts))}}
.im-theme{position:absolute;z-index:4;top:clamp(14px,3cqh,28px);right:clamp(14px,3cqw,32px);display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px 0 12px;border:1px solid var(--im-btn-line);border-radius:999px;background:var(--im-bg);color:var(--im-fg);font:500 14px/1 Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;cursor:pointer;transition:background-color .2s ease,border-color .2s ease}
.im-theme:hover{background:var(--im-btn-hover)}.im-theme:focus-visible{outline:2px solid var(--im-fg);outline-offset:3px}
.im-theme svg{width:16px;height:16px;flex:none;fill:currentColor}.im-moon,.im-root[data-theme="light"] .im-sun{display:none}.im-root[data-theme="light"] .im-moon{display:block}
@container im-stage (max-width:599px){.im-theme{padding:0 12px}.im-theme-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
.im-root[data-im-corner-control] .im-theme{right:max(16px,68px)}
.im-root[data-im-no-switch] .im-theme,.im-root[data-preview] .im-theme{display:none}
@media(prefers-reduced-motion:reduce){.im-root,.im-theme{transition:none}}
`;

// Adapted from the HorizonX Immersive Motion component shared for this project.
// HorizonX member license applies; Instrument Serif is licensed under SIL OFL 1.1.
export function ImmersiveMotionCTA() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!document.querySelector("style[data-immersive-motion]")) {
      const tag = document.createElement("style");
      tag.setAttribute("data-immersive-motion", "");
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const root = rootRef.current;
    if (!root) return;
    const node = root;
    const query = (selector) => (node.matches(selector) ? node : node.querySelector(selector));
    try {
      const theme = localStorage.getItem("immersive-motion-theme");
      if (theme === "light" || theme === "dark") query(".im-root")?.setAttribute("data-theme", theme);
    } catch {}

    const heading = query(".cta-heading");
    let revealFrame = 0;
    const stopHeadingReveal = () => {
      cancelAnimationFrame(revealFrame);
      window.removeEventListener("scroll", checkHeadingReveal);
      window.removeEventListener("resize", checkHeadingReveal);
    };
    const checkHeadingReveal = () => {
      if (!heading) return;
      cancelAnimationFrame(revealFrame);
      revealFrame = requestAnimationFrame(() => {
        const bounds = heading.getBoundingClientRect();
        if (bounds.top > window.innerHeight * 0.84 || bounds.bottom < 0) return;
        heading.classList.remove("reveal-pending");
        heading.classList.add("is-visible");
        stopHeadingReveal();
      });
    };
    if (heading && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heading.classList.add("is-visible");
    } else if (heading) {
      const bounds = heading.getBoundingClientRect();
      if (bounds.top > window.innerHeight * 0.84) {
        heading.classList.add("reveal-pending");
        window.addEventListener("scroll", checkHeadingReveal, { passive: true });
        window.addEventListener("resize", checkHeadingReveal);
        checkHeadingReveal();
      } else {
        heading.classList.add("is-visible");
      }
    }

// Original HorizonX code. Default pieces from the HorizonX stock library.
// Title font: Instrument Serif, SIL Open Font License 1.1. HorizonX Tools License.
/** Original HorizonX renderer for Immersive Motion. Plain DOM and CSS 3D transforms, no library. */
// An endless dolly through a set of square pieces. A clock moves the camera
// forward; each piece waits small and soft in the margins, swells, sharpens
// and leaves past the lens, then re-enters far away on a new path, so the loop
// never repeats exactly. The pieces fly round a single title, never across it.

const GOLDEN = 2.399963229728653; // golden angle, radians
const SPACING = 0.419999; // gap between pieces along the corridor, in perspective units
const FIRST = 0.900001; // nearest piece's distance at time 0
const EXIT = 0.419999; // how far past the lens a piece travels before it is gone
const PERIOD = 1.35; // seconds between two pieces leaving, at speed 1
const FLARE = 0.75; // far pieces keep this share of their margin offset
const BREATH_PERIOD = 9; // seconds of one speed swell

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function smooth(e0, e1, x) { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
function rand(i, k) { const s = Math.sin(i * 127.101 + k * 311.701) * 43758.5453; return s - Math.floor(s); }
const mod = (a, n) => ((a % n) + n) % n;

/** Distance travelled by the camera after `clock` seconds of play, with the speed swell. */
function travelled(clock, config) {
  const k = (2 * Math.PI) / BREATH_PERIOD, amp = config.breath / 100;
  // Integral of speed * (1 + amp * sin(k t)) from 0 to clock.
  return (SPACING / PERIOD) * config.speed * (clock + (amp / k) * (1 - Math.cos(k * clock)));
}

/**
 * Where piece `i` of `n` sits along the corridor when the camera has travelled
 * `phase`: `d` > 0 in front of the lens, < 0 already past it, and `lap`, how
 * many times it has gone round (0 on the first pass).
 */
function corridor(i, n, phase) {
  const loop = n * SPACING, ahead = i * SPACING + FIRST - phase + EXIT;
  return { d: mod(ahead, loop) - EXIT, lap: -Math.floor(ahead / loop) };
}

/** Fade in far away, fade out just past the lens. */
function presence(d) { return smooth(5.20001, 3.20001, d) * (1 - smooth(0.120001, -EXIT + 0.0599999, d)); }

/**
 * The path a given appearance `j` of a piece flies. A golden-angle walk on a
 * superellipse round the title puts the pieces in the margins and corners,
 * never on the words. On a portrait stage there are no side margins, so every
 * piece goes above or below the title instead.
 */
function path(j, geo) {
  const a = j * GOLDEN + 0.600001, c = Math.cos(a), s = Math.sin(a);
  const cx = Math.sign(c) * Math.abs(c) ** 0.549999;
  let cy = Math.sign(s) * Math.abs(s) ** 0.549999;
  if (geo.portrait) cy = (cy < 0 ? -1 : 1) * (0.779999 + 0.219999 * Math.abs(cy));
  const reach = 0.950001 + rand(j, 2) * 0.199999;
  return { cx, cy, x: cx * geo.rx * reach, y: cy * geo.ry * reach, scale: 0.860001 + rand(j, 1) * 0.3, roll: (rand(j, 4) - 0.500001) * 9 };
}

/**
 * Stage geometry from its size and the title box (both in px, the title
 * relative to the stage centre as half extents).
 */
function geometry(width, height, title, config) {
  const portrait = width < 760 && height > width;
  const perspective = Math.round(Math.max(width, height) * (portrait ? 1.1 : 0.850001));
  const base = (portrait ? width * 0.360001 : clamp(Math.min(width * 0.170001, height * 0.300001), 56, 300)) * config.pieceSize / 100;
  const halfW = Math.min(title.halfW, width * 0.400001), halfH = Math.max(title.halfH, height * 0.199999);
  const spread = config.spread / 100;
  const rx = (portrait ? width * 0.339999 : halfW + base * 0.620001) * spread;
  const ry = (portrait ? halfH + base * 0.5 : halfH + base * 0.419999) * spread;
  return { width, height, portrait, perspective, base, rx, ry };
}

/**
 * One piece's frame: transform, opacity, filter and stacking, or null when it
 * is out of sight. `pointer` is the eased pointer in -1..1.
 */
function pieceFrame(i, n, phase, geo, config, light, pointer = [0, 0]) {
  const { d, lap } = corridor(i, n, phase);
  const o = presence(d);
  if (o <= 0.00200001) return null;
  const L = path(i + lap * n, geo);
  const drift = config.drift / 100, parallax = config.parallax / 100;
  // A slow crane: the camera drifts on a soft curve, so the dolly breathes.
  const craneX = Math.sin(phase * 0.21) * geo.width * 0.0350001 * drift + pointer[0] * geo.width * 0.0199999 * parallax;
  const craneY = Math.cos(phase * 0.17) * geo.height * 0.0199999 * drift + pointer[1] * geo.height * 0.02 * parallax;
  const fog = smooth(4.39999, 1.20001, d); // 0 far away, 1 close
  const blur = Math.max(smooth(2.2, 5, d) * 2.4, (1 - smooth(-0.319999, 0.0599999, d)) * 7) * config.depthBlur / 100;
  const near = Math.max(d, 0), flare = 1 + near * FLARE;
  const x = L.x * flare - craneX / (1 + near), y = L.y * flare - craneY / (1 + near);
  const turn = smooth(4, 0.400001, d), ry = -L.cx * 16 * turn, rx = L.cy * 10 * turn;
  // Dark stages sink far pieces into the black; light ones fade them into the
  // white instead, since dimming there reads as grey haze.
  const dim = (config.dim / 100) * (1 - fog);
  const opacity = light ? o * (1 - dim) : o;
  const filter = light
    ? `saturate(${(1 - dim * 0.78).toFixed(3)}) blur(${blur.toFixed(2)}px)`
    : `brightness(${(1 - dim).toFixed(3)}) blur(${blur.toFixed(2)}px)`;
  const transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${(-d * geo.perspective).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${L.roll.toFixed(2)}deg) scale(${L.scale.toFixed(3)})`;
  return { d, lap, x, y, opacity, filter, transform, z: Math.round(1000 - d * 100) };
}

/** Camera roll for the whole field, in degrees. */
const fieldRoll = (phase, config) => Math.sin(phase * 0.289999) * 1.1 * config.drift / 100;

function createImmersiveMotion(root, initial) {
  const field = root.querySelector('.im-field');
  const title = root.querySelector('.im-title');
  const toggle = root.querySelector('.im-theme');
  const doc = root.ownerDocument, win = doc.defaultView || globalThis;
  const motion = typeof win.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let config = initial, pieces = [], keys = '', geo = null;
  let light = initial.theme === 'light';
  // Fonts: registered once per document under their own family name, so a page
  // that defines "Instrument Serif" differently keeps its own.
  const fonts = doc.fonts || null;
  if (initial.fontUrl && typeof win.FontFace === 'function' && fonts && !fonts.__imFont) {
    const face = (url, style) => new win.FontFace('IM Instrument Serif', `url(${JSON.stringify(url)}) format("woff2")`, { weight: '400', style, display: 'swap' });
    fonts.__imFont = Promise.all([face(initial.fontUrl, 'normal'), face(initial.fontItalicUrl || initial.fontUrl, 'italic')]
      .map((f) => f.load().then((loaded) => fonts.add(loaded)))).catch(() => {});
  }
  // The export remembers the visitor's theme; the editor never does.
  let saved = null;
  if (initial.persistKey) { try { saved = win.localStorage?.getItem(initial.persistKey) ?? null; } catch {} }
  let raf = 0, last = 0, visible = true, destroyed = false;
  let clock = 0, pace = 1, phase = 0;
  const pointer = [0, 0], target = [0, 0];
  const listeners = [];
  const listen = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); listeners.push(() => el.removeEventListener(type, fn, opts)); };

  const held = () => config.still || config.speed === 0 || !!motion?.matches;

  function setPieces() {
    const n = config.count, next = config.images.length ? config.images : [];
    const k = `${n}|${next.join('\n')}`;
    if (k === keys) return;
    keys = k;
    // Pieces already on stage stay: a count change adds or drops only the
    // difference and a new image swaps its src in place, so the loop never
    // blinks while a slider moves.
    while (pieces.length > n) pieces.pop().el.remove();
    for (let i = 0; i < n; i++) {
      let p = pieces[i];
      if (!p) {
        const li = doc.createElement('li');
        li.className = 'im-piece';
        const img = doc.createElement('img');
        img.alt = ''; img.decoding = 'async'; img.draggable = false;
        li.append(img); field.append(li);
        p = pieces[i] = { el: li, img, last: '' };
      }
      const src = next[i % next.length];
      if (src !== undefined && p.img.getAttribute('src') !== src) p.img.src = src;
    }
  }

  function measure() {
    const w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return false;
    const r = root.getBoundingClientRect(), t = title.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    geo = geometry(w, h, { halfW: t.width / 2, halfH: Math.max(cy - t.top, t.bottom - cy) }, config);
    field.style.setProperty('--im-persp', `${geo.perspective}px`);
    field.style.setProperty('--im-piece', `${geo.base.toFixed(1)}px`);
    for (const p of pieces) p.last = '';
    return true;
  }

  function render() {
    if (!geo) return;
    field.style.transform = `rotate(${fieldRoll(phase, config).toFixed(3)}deg)`;
    const n = pieces.length;
    for (let i = 0; i < n; i++) {
      const p = pieces[i], f = pieceFrame(i, n, phase, geo, config, light, pointer);
      const out = f ? `${f.transform}|${f.opacity.toFixed(3)}|${f.filter}|${f.z}` : 'hidden';
      if (out === p.last) continue;
      p.last = out;
      const s = p.el.style;
      if (!f) { s.opacity = '0'; s.visibility = 'hidden'; continue; }
      s.visibility = 'visible'; s.transform = f.transform; s.opacity = f.opacity.toFixed(3); s.filter = f.filter; s.zIndex = String(f.z);
    }
    root.toggleAttribute('data-ready', true);
  }

  function tick(now) {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05) || 1 / 60;
    last = now;
    const goal = held() ? 0 : 1;
    // Starting and stopping ease in and out; the loop never jumps.
    pace += (goal - pace) * (1 - Math.exp(-dt * 3.2));
    if (Math.abs(goal - pace) < 1e-3) pace = goal;
    const amp = config.breath / 100;
    clock += dt * pace;
    phase += dt * pace * (SPACING / PERIOD) * config.speed * (1 + amp * Math.sin(clock * (2 * Math.PI / BREATH_PERIOD)));
    for (let a = 0; a < 2; a++) pointer[a] += (target[a] - pointer[a]) * (1 - Math.exp(-dt * 3));
    render();
    const settled = Math.abs(target[0] - pointer[0]) + Math.abs(target[1] - pointer[1]) < 1e-4;
    if ((pace > 0 || goal > 0 || !settled) && visible) wake();
  }
  function wake() { if (!raf && !destroyed && visible) { if (!last) last = 0; raf = win.requestAnimationFrame(tick); } }
  function restart() { last = 0; wake(); }

  function applyTheme(next) {
    light = next === 'light';
    root.dataset.theme = next;
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(light));
      toggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      const label = toggle.querySelector('.im-theme-label');
      if (label) label.textContent = light ? 'Dark mode' : 'Light mode';
    }
    for (const p of pieces) p.last = '';
    render();
  }

  function setStill() {
    // A frozen frame: thumbnails, `speed 0` and the reduced-motion still.
    if (config.still) { clock = config.phase; phase = travelled(config.phase, config); pace = 0; }
  }

  if (toggle) listen(toggle, 'click', (event) => {
    event.stopPropagation();
    const next = light ? 'dark' : 'light';
    if (config.persistKey) { try { win.localStorage?.setItem(config.persistKey, next); } catch {} }
    applyTheme(next);
  });
  listen(root, 'pointermove', (e) => {
    if (config.preview || config.parallax === 0 || e.pointerType === 'touch') return;
    const r = root.getBoundingClientRect();
    target[0] = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    target[1] = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    restart();
  });
  listen(root, 'pointerleave', () => { target[0] = target[1] = 0; restart(); });
  if (motion) listen(motion, 'change', restart);
  const sleep = () => { if (raf) win.cancelAnimationFrame(raf); raf = 0; };
  listen(doc, 'visibilitychange', () => { if (doc.hidden) sleep(); else restart(); });
  // The title size sets the clear zone; measure again once the web font is in.
  Promise.resolve(fonts?.__imFont).then(() => fonts?.ready).then(() => { if (!destroyed && measure()) render(); });
  const resizer = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(() => { if (measure()) { render(); restart(); } }) : null;
  resizer?.observe(root);
  const intersection = typeof win.IntersectionObserver === 'function' ? new win.IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) restart(); else sleep();
  }) : null;
  intersection?.observe(root);

  function update(next) {
    const themeChanged = next.theme !== config.theme;
    config = next;
    root.toggleAttribute('data-preview', config.preview);
    setPieces();
    setStill();
    if (themeChanged || !root.dataset.theme) applyTheme(config.theme);
    if (measure()) render();
    restart();
  }
  // Held from the first frame when motion is reduced: nothing starts moving,
  // and the stage shows the same composed frame as the thumbnail.
  if (held()) { pace = 0; clock = initial.phase; phase = travelled(initial.phase, initial); }
  config = { ...initial, theme: undefined };
  update(saved === 'light' || saved === 'dark' ? { ...initial, theme: saved } : initial);
  return {
    update,
    destroy() {
      destroyed = true; sleep(); resizer?.disconnect(); intersection?.disconnect();
      listeners.forEach((remove) => remove());
      field.replaceChildren(); pieces = []; keys = '';
    }
  };
}

    const engine = createImmersiveMotion(query(".im-root"), {
      images: Array.from({ length: 30 }, (_, index) => `/assets/immersive-motion/piece-${String(index + 1).padStart(2, "0")}.webp`),
      count: 30, pieceSize: 100, spread: 100, speed: 1, breath: 15, drift: 100, parallax: 100, depthBlur: 100, dim: 70,
      theme: "dark", still: false, phase: 0, preview: false, fontUrl: "/assets/immersive-motion/instrument-serif-regular.woff2", fontItalicUrl: "/assets/immersive-motion/instrument-serif-italic.woff2", persistKey: "immersive-motion-theme",
    });
    const dispose = () => { engine.destroy(); stopHeadingReveal(); window.removeEventListener("pagehide", dispose); };
    window.addEventListener("pagehide", dispose, { once: true });
    return dispose;
  }, []);

  return (
    <section ref={rootRef} className="im-export cta-immersive" id="pricing" aria-label="Pricing and availability">
      <div className="im-frame">
        <div className="im-root" data-theme="dark" style={{ "--im-w": "1280px", "--im-h": "800px", "--im-ts": "1", "--im-corner": "4px" }}>
          <ul className="im-field" aria-hidden="true" />
          <div className="im-copy">
            <div className="cta-center im-title">
              <h2 className="cta-heading">Get a Dedicated SaaS Design &amp; Development Team Without the Cost of Hiring In House.</h2>
              <p>We bring designers and engineers together to design, build, and launch exceptional SaaS products faster and more efficiently.</p>
              <a className="forge-button hero-action" href="#contact"><span className="hero-action-label">See pricing &amp; availability</span><svg className="hero-action-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="white" /></svg><AnimatedStroke className="hero-action-stroke" /></a>
              <div className="social-line"><span className="social-label">We are available on socials</span><span className="social-icons">{[["61f43.svg", "Dribbble"], ["98f84.svg", "Instagram"], ["f5ae5.svg", "X"], ["ce7cf.svg", "LinkedIn"]].map(([src, label]) => <a href="#more" aria-label={label} key={label}><img src={`/assets/cta/${src}`} alt="" width="24" height="24" /></a>)}</span></div>
            </div>
          </div>
          <button className="im-theme" type="button" aria-pressed="false" aria-label="Switch to light mode">
            <svg className="im-sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" /><path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l-1.7-1.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <svg className="im-moon" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1Z" /></svg>
            <span className="im-theme-label">Light mode</span>
          </button>
        </div>
      </div>
    </section>
  );
}

