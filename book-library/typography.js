(() => {
  const e = document.querySelector("#tale-title");
  if (!e) return;
  const h = matchMedia("(prefers-reduced-motion:reduce)");
  let a = 0,
    l = 0;
  function u(r) {
    const t = Math.min(1, (r - l) / 1400),
      n = 1 - Math.pow(1 - t, 2.2);
    if (t >= 1) {
      ((e.style.clipPath = "inset(-18px)"), (a = 0));
      return;
    }
    const m = n * 1.5 - 0.2,
      s = ["-10% -20%"];
    for (let o = 0; o <= 36; o++) {
      const c = -0.2 + (o / 36) * 1.4,
        d =
          (Math.sin(c * 13 + n * 3) * 0.07 + Math.cos(c * 27 - n * 2) * 0.035) *
          Math.sin(t * Math.PI);
      s.push(`${(m + d) * 100}% ${c * 100}%`);
    }
    (s.push("-10% 120%"),
      (e.style.clipPath = `polygon(${s.join(",")})`),
      (a = requestAnimationFrame(u)));
  }
  function i(r = !1) {
    if (!r && e.firstElementChild?.classList.contains("collection-title-float"))
      return;
    const t = e.textContent;
    ((e.dataset.shadowTitle = t), e.setAttribute("aria-label", t));
    const n = document.createElement("span");
    if (
      ((n.className = "collection-title-float"),
      (n.textContent = t),
      e.replaceChildren(n),
      cancelAnimationFrame(a),
      h.matches)
    ) {
      e.style.clipPath = "none";
      return;
    }
    ((l = performance.now()), (a = requestAnimationFrame(u)));
  }
  (new MutationObserver(() => i()).observe(e, {
    childList: !0,
    characterData: !0,
    subtree: !0,
  }),
    new IntersectionObserver(
      (r) => {
        r.some((t) => t.isIntersecting) && i(!0);
      },
      { threshold: 0.2 },
    ).observe(document.querySelector(".library-stage")),
    i(),
    addEventListener("pagehide", () => cancelAnimationFrame(a)));
})();
