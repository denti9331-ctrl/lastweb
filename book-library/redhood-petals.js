(() => {
  "use strict";
  const r = document.querySelector(".library-stage"),
    d = r?.querySelector(".worlds");
  if (!d) return;
  const e = document.createElement("video");
  ((e.className = "library-red-petals"),
    (e.muted = !0),
    (e.loop = !0),
    (e.playsInline = !0),
    (e.preload = "none"),
    e.setAttribute("aria-hidden", "true"),
    (e.tabIndex = -1),
    d.append(e));
  const n = matchMedia("(prefers-reduced-motion: reduce)");
  let a = !0;
  function t() {
    const s =
      document.body.dataset.tale === "1" && a && !document.hidden && !n.matches;
    (e.classList.toggle("is-active", s),
      s
        ? (e.getAttribute("src") ||
            (e.src = "../assets/redhood-fall-optimized.webm"),
          e.paused && e.play().catch(() => {}))
        : e.pause());
  }
  const i = new MutationObserver(t);
  i.observe(document.body, { attributes: !0, attributeFilter: ["data-tale"] });
  const o = new IntersectionObserver(
    (s) => {
      ((a = s.some((c) => c.isIntersecting)), t());
    },
    { threshold: 0.01 },
  );
  (o.observe(r),
    document.addEventListener("visibilitychange", t),
    n.addEventListener("change", t),
    addEventListener("pagehide", () => {
      (e.pause(), i.disconnect(), o.disconnect());
    }),
    t());
})();
