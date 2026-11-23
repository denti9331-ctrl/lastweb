(() => {
  "use strict";
  const n = document.querySelector(".library-stage"),
    i = n?.querySelector(".worlds");
  if (!i) return;
  const e = document.createElement("video");
  ((e.className = "library-snowwhite-petals"),
    (e.muted = e.defaultMuted = !0),
    (e.loop = e.playsInline = !0),
    (e.defaultPlaybackRate = e.playbackRate = 1),
    (e.preload = "none"),
    (e.tabIndex = -1),
    e.setAttribute("aria-hidden", "true"),
    i.append(e));
  const a = matchMedia("(prefers-reduced-motion: reduce)");
  let r = !0;
  function t() {
    const s =
      document.body.dataset.tale === "3" && r && !document.hidden && !a.matches;
    (e.classList.toggle("is-active", s),
      s
        ? (e.getAttribute("src") ||
            (e.src = "../assets/snowwhite-red-petals-optimized.webm"),
          e.paused && e.play().catch(() => {}))
        : e.pause());
  }
  const d = new MutationObserver(t);
  d.observe(document.body, { attributes: !0, attributeFilter: ["data-tale"] });
  const c = new IntersectionObserver(
    (s) => {
      ((r = s.some((o) => o.isIntersecting)), t());
    },
    { threshold: 0.01 },
  );
  (c.observe(n),
    document.addEventListener("visibilitychange", t),
    a.addEventListener("change", t),
    addEventListener("pagehide", () => {
      (e.pause(),
        d.disconnect(),
        c.disconnect(),
        document.removeEventListener("visibilitychange", t),
        a.removeEventListener("change", t));
    }),
    t());
})();
