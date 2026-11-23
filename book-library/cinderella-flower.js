(() => {
  "use strict";
  const s = document.querySelector(".library-stage"),
    r = s?.querySelector(".worlds");
  if (!r) return;
  const e = document.createElement("video");
  ((e.className = "library-cinderella-flower"),
    (e.muted = e.defaultMuted = !0),
    (e.loop = e.playsInline = !0),
    (e.defaultPlaybackRate = e.playbackRate = 1),
    (e.preload = "none"),
    (e.tabIndex = -1),
    e.setAttribute("aria-hidden", "true"),
    r.append(e));
  const n = matchMedia("(prefers-reduced-motion: reduce)");
  let i = !0;
  function t() {
    const a =
      document.body.dataset.tale === "0" && i && !document.hidden && !n.matches;
    (e.classList.toggle("is-active", a),
      a
        ? (e.getAttribute("src") ||
            (e.src = "../assets/cinderella-glue-optimized.webm"),
          e.paused && e.play().catch(() => {}))
        : e.pause());
  }
  const d = new MutationObserver(t);
  d.observe(document.body, { attributes: !0, attributeFilter: ["data-tale"] });
  const c = new IntersectionObserver(
    (a) => {
      ((i = a.some((o) => o.isIntersecting)), t());
    },
    { threshold: 0.01 },
  );
  (c.observe(s),
    document.addEventListener("visibilitychange", t),
    n.addEventListener("change", t),
    addEventListener("pagehide", () => {
      (e.pause(),
        d.disconnect(),
        c.disconnect(),
        document.removeEventListener("visibilitychange", t),
        n.removeEventListener("change", t));
    }),
    t());
})();
