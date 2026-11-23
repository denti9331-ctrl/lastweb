(() => {
  "use strict";
  const c = document.querySelector(".library-stage"),
    u = c?.querySelector(".worlds");
  if (!u) return;
  const s = document.createElement("div");
  ((s.className = "library-mermaid-bubbles"),
    s.setAttribute("aria-hidden", "true"));
  const a = document.createElement("video"),
    t = document.createElement("video");
  for (const e of [a, t])
    ((e.muted = !0),
      (e.defaultMuted = !0),
      (e.playsInline = !0),
      (e.preload = "none"),
      (e.tabIndex = -1),
      s.append(e));
  ((a.className = "bubble-intro"),
    (t.className = "bubble-loop"),
    (t.loop = !0),
    u.append(s));
  const i = matchMedia("(prefers-reduced-motion: reduce)");
  let r = !1,
    l = !0,
    d = !1,
    b = !1;
  function p() {
    return r && l && !document.hidden && !i.matches;
  }
  function m(e) {
    e.paused && e.play().catch(() => {});
  }
  function n() {
    const e = document.body.dataset.tale === "2";
    if (e !== r) {
      ((r = e), (d = !1), (s.dataset.phase = "intro"));
      for (const o of [a, t]) (o.pause(), o.readyState && (o.currentTime = 0));
      r &&
        !b &&
        ((b = !0),
        (a.src = "../assets/bubble-intro.webm"),
        (t.src = "../assets/bubble-loop.webm"),
        (a.preload = "auto"),
        (t.preload = "auto"),
        a.load(),
        t.load());
    }
    if ((s.classList.toggle("is-active", p()), !p())) {
      (a.pause(), t.pause());
      return;
    }
    m(d ? t : a);
  }
  (a.addEventListener("ended", () => {
    r && ((d = !0), n());
  }),
    t.addEventListener("playing", () => {
      r && d && (s.dataset.phase = "loop");
    }));
  const f = new MutationObserver(n);
  f.observe(document.body, { attributes: !0, attributeFilter: ["data-tale"] });
  const v = new IntersectionObserver(
    (e) => {
      ((l = e.some((o) => o.isIntersecting)), n());
    },
    { threshold: 0.01 },
  );
  (v.observe(c),
    document.addEventListener("visibilitychange", n),
    i.addEventListener("change", n),
    addEventListener("pagehide", () => {
      (a.pause(),
        t.pause(),
        f.disconnect(),
        v.disconnect(),
        document.removeEventListener("visibilitychange", n),
        i.removeEventListener("change", n));
    }),
    n());
})();
