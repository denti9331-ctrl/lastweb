import { createSoftStoryShadow as K } from "./soft-story-shadow.js";
import { stories as q } from "./stories.js?v=7";
import { createHover as j } from "./hover-effects.js?v=13";
const t = (e) => document.querySelector(e),
  r = q[document.body.dataset.tale],
  m = r.scenes.length;
const chapterParam = new URLSearchParams(location.search).get("chapter");
const requestedChapter = /^\d+$/.test(chapterParam ?? "")
  ? Number(chapterParam)
  : 0;
const initialChapter =
  requestedChapter >= 1 && requestedChapter <= m ? requestedChapter - 1 : 0;
const Z = matchMedia("(prefers-reduced-motion:reduce)").matches;
if (((document.body.dataset.theme = r.theme), r.theme === "water")) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  (e.setAttribute("width", "0"),
    e.setAttribute("height", "0"),
    e.setAttribute("aria-hidden", "true"),
    (e.style.position = "absolute"),
    (e.innerHTML =
      '<defs><filter id="water-type" x="-25%" y="-80%" width="150%" height="260%"><feTurbulence type="fractalNoise" baseFrequency=".012 .055" numOctaves="1" seed="8" result="water"><animate attributeName="baseFrequency" values=".012 .055;.018 .035;.012 .055" dur="3s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="water" scale="19" xChannelSelector="R" yChannelSelector="G"/></filter></defs>'),
    document.body.append(e));
}
((document.title = `${r.title} \u2014 Dark Fairy Tale`),
  (t(".edition").textContent = r.edition),
  (t("#source").href = r.source));
const P = r.scenes.map((e, n) => {
    const a = new Image();
    ((a.className = "picture"),
      (a.alt = e.label),
      (a.decoding = "async"),
      (a.fetchPriority = n === initialChapter ? "high" : "low"),
      n === initialChapter && (a.src = e.image),
      t("#stage").prepend(a));
    const s = document.createElement("section");
    (s.setAttribute("aria-label", e.label), t("#rail").append(s));
    const o = document.createElement("button");
    return (
      o.setAttribute("aria-label", e.label),
      (o.title = e.label),
      o.addEventListener("click", () => h(n)),
      t("#scene-nav").append(o),
      a
    );
  }),
  D = r.theme === "ember" ? {} : j(r.theme, t("#stage")),
  T = new Set();
let d = null,
  X = null,
  A = null;
let i = -1,
  I = 0,
  g = !1,
  R = !1,
  u = !1;
function y(e, n) {
  const a = setTimeout(() => {
    (T.delete(a), e());
  }, n);
  return (T.add(a), a);
}
function L() {
  (T.forEach(clearTimeout), T.clear());
}
function k() {
  (t("#story").classList.remove("show"),
    t("#read").setAttribute("aria-expanded", "false"));
}
function Y() {
  ((R = !0),
    (g = !0),
    k(),
    y(() => {
      R &&
        ((t("#next").hidden = !1),
        t("#next").classList.add("ready"),
        i === m - 1 &&
          ((t("#ending-links").hidden = !1),
          t("#ending-links").classList.add("show"),
          (t("#source").hidden = !1),
          d &&
            (d.setReady(!0),
            (t("#next").textContent =
              "\uC774\uC57C\uAE30\uAC00 \uB0A8\uAE34 \uC9C8\uBB38"),
            (t("#ending-links").hidden = !0))));
    }, 850));
}
function S(e) {
  (A?.cue(e),
    (I = e),
    (R = !1),
    (g = !1),
    (t("#next").hidden = !0),
    t("#next").classList.remove("ready"),
    (t("#ending-links").hidden = !0),
    t("#ending-links").classList.remove("show"));
  const n = r.scenes[i],
    a = [n.place, "lower-center", i % 2 ? "upper-right" : "upper-center"];
  t("#story").dataset.place = a[e];
  const s = t("#story p");
  (s.replaceChildren(),
    n.text[e].split(" ").forEach((o, x) => {
      const c = document.createElement("em");
      (c.style.setProperty("--i", x),
        (c.textContent = o),
        r.theme === "water" && (c.dataset.waterWord = o),
        s.append(c, document.createTextNode(" ")));
    }),
    t("#story").classList.add("show"),
    A?.syncText?.(),
    t("#read").setAttribute("aria-expanded", "true"),
    t("#sentence-next").classList.remove("ready"),
    (t("#sentence-next").textContent =
      e === 2
        ? "\uC7A5\uBA74 \uB458\uB7EC\uBCF4\uAE30 \u2197"
        : "\uACC4\uC18D \uC77D\uAE30 \u2192"),
    (t("#sentence-next").hidden = !0),
    y(
      () => {
        g ||
          (k(),
          e < 2
            ? y(() => {
                g || S(e + 1);
              }, 1e3)
            : Y());
      },
      Math.max(4800, Math.min(7e3, n.text[e].split(" ").length * 480)),
    ));
}
function O(e) {
  (d?.setReady(!1),
    L(),
    (i = e),
    (g = !1),
    (R = !1),
    (u = e === 0),
    document.body.classList.toggle("title-waiting", u),
    (t("#read").textContent = u
      ? "CLICK TO START"
      : "\uC774\uC57C\uAE30 \uC77D\uAE30"),
    k());
  const n = r.scenes[e];
  if (
    ((t("#stage").dataset.chapter = String(e)),
    t("#scene-nav").style.setProperty("--scene-progress", String((e + 1) / m)),
    t("#scene-nav").setAttribute(
      "aria-label",
      `\uC774\uC57C\uAE30 \uC9C4\uD589 ${e + 1} / ${m} \xB7 \uC7A5\uBA74 \uC120\uD0DD`,
    ),
    t("#heading").classList.remove("gone"),
    t("#heading").classList.add("show"),
    (t("#heading h1").textContent = e === 0 ? r.title : n.title),
    r.theme === "water")
  ) {
    const a = t("#heading h1"),
      s = a.textContent;
    (a.replaceChildren(),
      [...s].forEach((o, x) => {
        const c = document.createElement("span");
        ((c.className = "water-letter"),
          c.style.setProperty("--letter", x),
          (c.textContent = o === " " ? "\xA0" : o),
          a.append(c));
      }));
  }
  return (
    (t("#heading small").textContent = e === 0 ? r.edition : r.title),
    (t("#heading p").textContent = n.label),
    (t("#next").hidden = !0),
    t("#next").classList.remove("ready"),
    (t("#next").textContent =
      e === m - 1
        ? "\uCC98\uC74C\uBD80\uD130 \uB2E4\uC2DC \uC77D\uAE30 \u21BA"
        : (r.theme === "ink", "\uB2E4\uC74C \uC774\uC57C\uAE30")),
    (t("#prev").disabled = e === 0),
    (t("#number").textContent =
      `${String(e + 1).padStart(2, "0")} / ${String(m).padStart(2, "0")}`),
    (t("#label").textContent = n.label),
    (t("#source").hidden = !0),
    (t("#ending-links").hidden = !0),
    t("#ending-links").classList.remove("show"),
    [...t("#scene-nav").children].forEach((a, s) =>
      a.setAttribute("aria-current", String(s === e)),
    ),
    D.clear?.(),
    Promise.all([
      D.setImage?.(
        r.theme === "water" && (e === 0 || e === 5) ? null : P[e],
        e,
      ),
      X?.setScene(e),
      A?.setScene(e),
    ])
  );
}
let f = !1,
  w = 0,
  M = 0;
function G(e) {
  if (e !== 0) queueNextScene(e);
  (P.forEach((n, a) => {
    ((n.style.visibility = a === e ? "visible" : "hidden"),
      (n.style.opacity = a === e ? "1" : "0"),
      (n.style.zIndex = "0"),
      (n.style.transform = "none"));
  }),
    (t("#progress span").style.transform = "scaleX(" + e / (m - 1) + ")"));
}
const b = () => new Promise((e) => requestAnimationFrame(e));
function _() {
  u ||
    (y(
      () => t("#heading").classList.add("gone"),
      ["ink", "water", "ember"].includes(r.theme) ? 3500 : 1900,
    ),
    y(() => S(0), ["ink", "water", "ember"].includes(r.theme) ? 4300 : 2800));
}
const v = document.createElement("div");
((v.id = "scene-guard"),
  v.setAttribute("aria-hidden", "true"),
  t("#stage").append(v));
if (document.body.dataset.tale === "snowwhite")
  document.body.append(v, t("#cover"));
async function z(e, n) {
  const a = t("#cover").animate(e, {
    duration: Z ? 1 : n,
    easing: "cubic-bezier(.3,.1,.25,1)",
    fill: "forwards",
  });
  return (await a.finished.catch(() => {}), a);
}
async function H(e) {
  if (!P[e].hasAttribute("src")) P[e].src = r.scenes[e].image;
  if ((await P[e].decode().catch(() => {}), !P[e].naturalWidth))
    throw Error(
      "\uC7A5\uBA74 \uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4",
    );
}
async function h(e) {
  if (f || i < 0) return;
  const n = (e + m) % m;
  if (n === i) return;
  ((f = !0),
    L(),
    k(),
    t("#heading").classList.add("gone"),
    (t("#next").hidden = !0));
  const a = t("#cover"),
    s = ["near", "right", "top", "left", "bottom", "far"][n],
    o = n < i,
    x = {
      right: ["translateX(125%)", "translateX(-125%)"],
      left: ["translateX(-125%)", "translateX(125%)"],
      top: ["translateY(-125%)", "translateY(125%)"],
      bottom: ["translateY(125%)", "translateY(-125%)"],
      near: ["scale(.02)", "scale(2.5)"],
      far: ["scale(2.5)", "scale(.02)"],
    },
    c = x[s];
  a.dataset.shadow = s;
  let C,
    E,
    $ = 1e3,
    F = 1150;
  if (document.body.dataset.tale === "snowwhite") {
    C = [{ opacity: 0 }, { opacity: 1 }];
    E = [{ opacity: 1 }, { opacity: 0 }];
    $ = 850;
    F = 820;
  } else if (r.theme === "water") {
    const l = (p) =>
      "polygon(-10% " +
      p +
      "%,10% " +
      (p - 5) +
      "%,30% " +
      (p + 4) +
      "%,50% " +
      (p - 6) +
      "%,70% " +
      (p + 3) +
      "%,90% " +
      (p - 4) +
      "%,110% " +
      p +
      "%,110% 120%,-10% 120%)";
    ((C = [
      { opacity: 0, clipPath: l(110) },
      { opacity: 0.65, clipPath: l(40), offset: 0.55 },
      { opacity: 1, clipPath: l(-15) },
    ]),
      (E = [
        { opacity: 1, clipPath: l(-15) },
        { opacity: 0, clipPath: l(-15) },
      ]),
      ($ = 1200),
      (F = 1400));
  } else
    r.theme === "dust"
      ? ((C = [
          { opacity: 0, transform: "scale(1.12)" },
          { opacity: 1, transform: "none" },
        ]),
        (E = [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "scale(1.15)" },
        ]))
      : ((C = [
          { transform: c[o ? 1 : 0], opacity: 0 },
          { transform: "none", opacity: 1 },
        ]),
        (E = [
          { transform: "none", opacity: 1 },
          { transform: c[o ? 0 : 1], opacity: 0 },
        ]));
  document.body.classList.add("transition-running");
  const N = H(n);
  N.catch(() => {});
  try {
    const l = await z(C, $);
    ((v.style.opacity = "1"),
      await b(),
      await b(),
      await N,
      d?.setReady(!1),
      D.clear?.(),
      A?.clear(),
      X?.setScene(-1),
      document.body.classList.add("scene-preparing"),
      G(n),
      await O(n),
      await b(),
      await b(),
      document.body.classList.remove("scene-preparing"),
      l.cancel(),
      (v.style.opacity = "0"),
      (await z(E, F)).cancel(),
      (a.style.opacity = "0"),
      _());
  } catch (l) {
    (console.error("Scene transition failed", l),
      (t("#read").textContent = "\uB2E4\uC2DC \uC77D\uAE30"),
      t("#heading").classList.add("show"),
      t("#heading").classList.remove("gone"));
  } finally {
    ((v.style.opacity = "0"),
      a.getAnimations().forEach((l) => l.cancel()),
      (a.style.opacity = "0"),
      document.body.classList.remove("transition-running", "scene-preparing"),
      (f = !1),
      (w = 0),
      (M = 0));
  }
}
function W() {
  !u ||
    f ||
    ((u = !1),
    document.body.classList.remove("title-waiting"),
    (t("#read").textContent = "\uC774\uC57C\uAE30 \uC77D\uAE30"),
    t("#heading").classList.add("gone"),
    L(),
    y(() => S(0), 900));
}
(document.addEventListener(
  "click",
  (e) => {
    !u ||
      f ||
      e.target.closest("a,.red-scene-action") ||
      (e.preventDefault(), e.stopImmediatePropagation(), W());
  },
  !0,
),
  t("#read").addEventListener("click", () => {
    if (!f) {
      if (u) {
        W();
        return;
      }
      (d?.setReady(!1),
        L(),
        t("#heading").classList.add("gone"),
        t("#story").classList.contains("show")
          ? ((g = !0), k())
          : (A?.setScene(i), S(0)));
    }
  }),
  t("#sentence-next").addEventListener("click", () => {
    (L(), I < 2 ? S(I + 1) : Y());
  }),
  t("#next").addEventListener("click", () => {
    d?.ready ? d.open() : h(i + 1);
  }),
  t("#prev").addEventListener("click", () => h(i - 1)));
for (const [e, n] of Object.entries(q)) {
  if (n === r) continue;
  const a = document.createElement("a");
  ((a.href = `../${e}/index.html`),
    (a.textContent = n.name),
    t("#ending-links").append(a));
}
(addEventListener(
  "wheel",
  (e) => {
    if (f) {
      e.preventDefault();
      return;
    }
    if (d?.ready || (e.preventDefault(), u)) return;
    const n = performance.now();
    if ((n - M > 250 && (w = 0), (M = n), (w += e.deltaY), Math.abs(w) > 110)) {
      const a = Math.sign(w);
      ((w = 0), i + a >= 0 && i + a < m && h(i + a));
    }
  },
  { passive: !1 },
),
  addEventListener("keydown", (e) => {
    u ||
      d?.ready ||
      e.target.closest("button,a,input") ||
      ((e.key === "ArrowRight" || e.key === "PageDown") &&
        (e.preventDefault(), h(i + 1)),
      (e.key === "ArrowLeft" || e.key === "PageUp") &&
        (e.preventDefault(), h(i - 1)));
  }),
  (history.scrollRestoration = "manual"));
async function ee() {
  const root = document.documentElement;
  const fromBook = root.classList.contains("from-book-entry");
  const minimumLoaderTime = fromBook
    ? null
    : new Promise((resolve) => setTimeout(resolve, Z ? 250 : 950));
  G(initialChapter);
  const preparations = [
    O(initialChapter),
    H(initialChapter),
    loadStoryEffects(),
    document.fonts.ready,
    minimumLoaderTime,
  ];
  await Promise.allSettled(preparations);
  await b();
  root.classList.remove("story-loading", "from-book-entry");
  if (fromBook) {
    const url = new URL(location.href);
    url.searchParams.delete("entry");
    history.replaceState(history.state, "", url);
  }
  if (i === 0) queueNextScene(0);
}
function queueNextScene(index) {
  const next = (index + 1) % m;
  if (!P[next].hasAttribute("src")) P[next].src = r.scenes[next].image;
}

async function loadSceneEffects() {
  const stage = t("#stage");
  const load = async (importEffect, setup) => {
    try {
      setup(await importEffect());
      await Promise.all([X?.setScene(i), A?.setScene(i)]);
      if (t("#story").classList.contains("show")) A?.cue(I);
    } catch (error) {
      console.warn("Story effect unavailable", error);
    }
  };
  switch (r.theme) {
    case "dust":
      await load(
        () => import("./cinderella-garden.js?v=4"),
        ({ createGarden }) => {
          X = createGarden(stage);
        },
      );
      break;
    case "ink":
      await load(
        () => import("./snow-drama.js"),
        ({ createSnowDrama }) => {
          A = createSnowDrama(stage);
        },
      );
      break;
    case "ember":
      await load(
        () => import("../redridinghood/scene-effects.js?v=15"),
        ({ createRedIllustrationEffects }) => {
          A = createRedIllustrationEffects(stage, r.scenes.at(-1).text.at(-1));
        },
      );
      break;
    case "water":
      await load(
        () => import("../mermaid/revised-scenes.js?v=20"),
        ({ createMermaidReaderScenes }) => {
          A = createMermaidReaderScenes(stage);
        },
      );
      break;
  }
}
async function loadStoryEffects() {
  const ending = import("./snow-ending.js?v=2")
    .then(({ createSnowEnding }) => {
      d = createSnowEnding(t("#stage"), document.body.dataset.tale);
      d?.onRestart(() => h(0));
    })
    .catch((error) => console.warn("Story ending unavailable", error));
  await Promise.all([loadSceneEffects(), ending]);
}
if (r.theme !== "ember") K(t("#stage"), r.theme);
ee();
