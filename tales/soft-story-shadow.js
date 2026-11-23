export function createSoftStoryShadow(b, c) {
  if (!["ember", "dust"].includes(c)) return;
  const a = document.createElement("canvas");
  ((a.id = "soft-story-shadow"),
    a.setAttribute("aria-hidden", "true"),
    b.append(a));
  const m = a.getContext("2d"),
    u = document.createElement("canvas");
  ((u.width = 320), (u.height = 160));
  const v = u.getContext("2d"),
    o = v.createImageData(320, 160),
    M = (t) => ((t = Math.max(0, Math.min(1, t))), t * t * (3 - 2 * t));
  for (let t = 0; t < 160; t++)
    for (let e = 0; e < 320; e++) {
      const n = (e - 160) / 160,
        r = (t - 80) / 80,
        i =
          Math.sin(n * 8 + r * 5) * 0.04 +
          Math.sin(n * 15 - r * 7) * 0.025 +
          Math.cos(n * 5 + r * 11) * 0.025,
        f = Math.hypot(n * (1 + Math.sin(r * 5) * 0.06), r) + i,
        g = (1 - M((f - 0.18) / 0.79)) * (c === "ember" ? 0.76 : 0.49),
        s = (t * 320 + e) * 4;
      ((o.data[s] = 8),
        (o.data[s + 1] = 11),
        (o.data[s + 2] = 18),
        (o.data[s + 3] = Math.round(g * 255)));
    }
  v.putImageData(o, 0, 0);
  const w = b.querySelector("#story"),
    d = b.querySelector("#heading");
  let h = 0,
    x = 0,
    y = !1,
    S = null,
    p = null;
  function q() {
    return document.body.classList.contains("transition-running")
      ? null
      : w.classList.contains("show")
        ? w.querySelector("p")
        : c === "ember" &&
            d.classList.contains("show") &&
            !d.classList.contains("gone")
          ? d.querySelector("h1")
          : null;
  }
  function C(t) {
    const e = document.createRange();
    e.selectNodeContents(t);
    const n = e.getBoundingClientRect();
    return { x: n.x, y: n.y, w: n.width, h: n.height };
  }
  function L(t) {
    ((h = 0), m.clearRect(0, 0, a.width, a.height));
    const e = q();
    if (
      (e && ((e !== S || !y) && ((x = t), (S = e)), (p = C(e))), (y = !!e), !p)
    )
      return;
    const n = (t - x) / 1400,
      r = 0.88 + M(n) * 0.17,
      i = p,
      f = c === "ember" ? 130 : 110,
      g = i.w + f * 2,
      s = i.h + f * 1.35;
    ((m.globalAlpha = e ? 1 : 0),
      m.drawImage(
        u,
        i.x + i.w / 2 - (g * r) / 2,
        i.y + i.h / 2 - (s * r) / 2,
        g * r,
        s * r,
      ),
      e && n < 1 && (h = requestAnimationFrame(L)));
  }
  function l() {
    const t = q();
    if (((a.style.opacity = t ? "1" : "0"), !t)) {
      y = !1;
      return;
    }
    h || (h = requestAnimationFrame(L));
  }
  function A() {
    ((a.width = innerWidth), (a.height = innerHeight), l());
  }
  (new MutationObserver(l).observe(w, {
    attributes: !0,
    childList: !0,
    subtree: !0,
  }),
    new MutationObserver(l).observe(d, { attributes: !0 }),
    new MutationObserver(l).observe(document.body, {
      attributes: !0,
      attributeFilter: ["class"],
    }),
    addEventListener("resize", A),
    A());
}
