import { createRibbonLoop as x } from "./ribbon-loop.js";
export function createSnowDrama(r) {
  const f = matchMedia("(prefers-reduced-motion:reduce)").matches,
    t = document.createElement("div");
  ((t.id = "snow-drama"),
    t.setAttribute("aria-hidden", "true"),
    (t.innerHTML =
      '<div class="drama-vignette"></div><div class="drama-table"></div><img class="drama-ribbon" src="../snowwhite/assets/layers/ribbon.webp" alt=""><img class="drama-comb" src="../snowwhite/assets/layers/comb.webp" alt=""><div class="drama-apple"></div><div class="drama-awake"></div><div class="drama-coffin-rest"></div><div class="drama-fragment"></div><div class="drama-poison"></div><div class="drama-final"></div><div class="drama-heat"></div><div class="drama-queen-shadow"></div><div class="drama-embers"></div>'),
    r.append(t));
  const h = x(t.querySelector(".drama-ribbon"));
  for (let e = 0; e < 14; e++) {
    const s = document.createElement("i");
    ((s.style.cssText = `--x:${7 + e * 2.3}%;--delay:${(e * 0.37).toFixed(2)}s;--drift:${((e % 3) - 1) * 17}px`),
      t.querySelector(".drama-embers").append(s));
  }
  const d = document.createElement("canvas");
  ((d.className = "drama-apple"),
    t.querySelector(".drama-apple").replaceWith(d));
  const o = d.getContext("2d"),
    l = new Image();
  l.src = "../snowwhite/assets/04-apple.webp";
  const L = new Path2D(
    "M 768 579 C 764 536 791 522 816 528 C 835 531 849 516 875 526 C 903 533 916 559 912 582 L 902 606 L 868 617 C 869 607 850 606 829 612 L 775 612 Z M 807 642 C 825 638 849 635 860 631 L 873 646 L 867 665 C 841 674 821 660 807 642 Z",
  );
  function m() {
    if (
      ((d.width = innerWidth),
      (d.height = innerHeight),
      !l.complete || !l.naturalWidth)
    )
      return;
    const e = Math.max(innerWidth / 1672, innerHeight / 941) * 1.04;
    (o.setTransform(
      e,
      0,
      0,
      e,
      (innerWidth - 1672 * e) / 2,
      (innerHeight - 941 * e) / 2,
    ),
      o.save(),
      o.clip(L),
      o.drawImage(l, 0, 0, 1672, 941),
      o.restore());
  }
  (l.addEventListener("load", m), addEventListener("resize", m));
  function u() {
    const e = Math.max(innerWidth / 1672, innerHeight / 941) * 1.04,
      s = t.querySelector(".drama-fragment");
    ((s.style.left = (innerWidth - 1672 * e) / 2 + 555 * e + "px"),
      (s.style.top = (innerHeight - 941 * e) / 2 + 278 * e + "px"),
      (s.style.width = 26 * e + "px"),
      (s.style.height = 30 * e + "px"));
  }
  (u(), addEventListener("resize", u));
  let i = -1,
    g = -1,
    v = 0;
  const n = document.createElement("canvas");
  ((n.id = "mirror-omen"), n.setAttribute("aria-hidden", "true"), r.append(n));
  const a = n.getContext("2d"),
    c = new Image();
  ((c.src = "../snowwhite/assets/layers/glass-alpha.webp"), (c.onload = p));
  function p() {
    if (
      ((n.width = innerWidth),
      (n.height = innerHeight),
      !c.complete || !c.naturalWidth)
    )
      return;
    const e = Math.max(innerWidth / 1672, innerHeight / 941) * 1.04,
      s = (innerWidth - 1672 * e) / 2,
      w = (innerHeight - 941 * e) / 2;
    ((a.fillStyle = "#040609"),
      (a.globalAlpha = 0.6),
      a.fillRect(0, 0, innerWidth, innerHeight),
      (a.globalAlpha = 1),
      (a.globalCompositeOperation = "destination-in"),
      a.drawImage(c, s, w, 1672 * e, 941 * e),
      (a.globalCompositeOperation = "destination-out"),
      a.save(),
      a.translate(s, w),
      a.scale(e, e),
      a.fill(
        new Path2D(
          "M 1160 430 C 1140 500 1120 560 1090 620 L 1100 850 L 1500 850 L 1500 400 Z",
        ),
      ),
      a.restore(),
      (a.globalCompositeOperation = "source-over"));
  }
  (p(), addEventListener("resize", p));
  function b() {
    (h.reset(),
      clearTimeout(v),
      t.getAnimations({ subtree: !0 }).forEach((e) => e.cancel()),
      (t.className = ""),
      (t.hidden = !0),
      n.classList.remove("ominous"),
      document.body.classList.remove(
        "snow-poisoned",
        "snow-danger",
        "snow-apple-focus",
      ),
      delete r.dataset.drama,
      (i = -1),
      (g = -1));
  }
  function y(e) {
    i < 0 ||
      ((g = e),
      (t.dataset.cue = String(e)),
      (r.dataset.drama = `${i}-${e}`),
      i === 0 && e >= 1 && n.classList.add("ominous"),
      i === 2 &&
        (document.body.classList.add("snow-danger"),
        e >= 1 &&
          !t.classList.contains("lace-tightens") &&
          (t.classList.add("lace-tightens"),
          f || h.tighten(),
          t.classList.add("comb-revealed", "poison-seeps"))),
      i === 3 &&
        (m(e === 2 ? "rotten" : e === 1 ? "safe" : "fresh"),
        document.body.classList.add("snow-apple-focus"),
        e >= 1 && t.classList.add("apple-offered"),
        e === 2 &&
          (document.body.classList.add("snow-poisoned"),
          t.classList.add("apple-falls-silent"))),
      i === 4 &&
        (e === 1 &&
          (r.getAnimations().forEach((s) => s.cancel()),
          f ||
            r.animate(
              [
                { transform: "translate(0,0) rotate(0)" },
                { transform: "translate(-7px,4px) rotate(-.24deg)" },
                { transform: "translate(8px,-5px) rotate(.28deg)" },
                { transform: "translate(-5px,2px) rotate(-.15deg)" },
                { transform: "translate(3px,-2px) rotate(.08deg)" },
                { transform: "translate(0,0) rotate(0)" },
              ],
              { duration: 620, easing: "ease-out" },
            ),
          (v = setTimeout(() => {
            i === 4 && t.classList.add("fragment-falls");
          }, 650))),
        e === 2 && t.classList.add("awakened")),
      i === 5 &&
        (e >= 1 && t.classList.add("sentence-turn"),
        e === 2 && t.classList.add("sentence-end")));
  }
  return {
    clear: b,
    setScene(e) {
      (b(),
        (i = e),
        (t.dataset.scene = String(e)),
        (t.dataset.cue = "-1"),
        (t.hidden = !1),
        (n.hidden = e !== 0),
        e === 2 && document.body.classList.add("snow-danger"),
        e === 3 && document.body.classList.add("snow-apple-focus"));
    },
    cue: y,
  };
}
