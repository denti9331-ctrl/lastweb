(() => {
  "use strict";
  const o = document.querySelector("#main-intro");
  if (!o || location.protocol === "file:") return;
  const r = o.querySelector(".journey-caption");
  if (!r) return;
  const i = matchMedia("(prefers-reduced-motion: reduce)"),
    u = matchMedia("(max-width:767px)"),
    y = (t) => Math.max(0, Math.min(1, t));
  let m = [],
    d = -1,
    x = 0;
  const w = [0.19, 0.39, 0.59, 0.77],
    E = new MutationObserver(b);
  function b() {
    (E.disconnect(), (m = []));
    const t = r.querySelector(":scope > span");
    if (
      ((d = t
        ? ["I \xB7", "II \xB7", "III \xB7", "IV \xB7"].findIndex((e) =>
            t.textContent.startsWith(e),
          )
        : -1),
      d >= 0 && !r.querySelector(".caption-english"))
    ) {
      const e = document.createElement("p");
      ((e.className = "caption-english"),
        (e.textContent = [
          "The monster never got to tell its story",
          "Some wishes cost more than a voice",
          "The crown decides which stories survive",
          "What is forgotten does not cease to exist",
        ][d]),
        t.after(e));
    }
    for (const e of [...r.children]) {
      const a = e.textContent.trim();
      if (!a) continue;
      e.replaceChildren();
      const g = a.split(/(\s+)/).filter(Boolean),
        s = [];
      for (const c of g) {
        const n = document.createElement("span");
        ((n.textContent = c), (n.style.whiteSpace = "pre"), e.append(n));
        const l = n.offsetTop;
        let f = s.find((q) => q.top === l);
        (f || ((f = { top: l, text: "" }), s.push(f)), (f.text += c));
      }
      e.replaceChildren(
        ...s.map((c) => {
          const n = document.createElement("span");
          return (
            (n.className = "type-line"),
            (n.textContent = c.text.trim()),
            m.push(n),
            n
          );
        }),
      );
    }
    if (d === 1) r.dataset.forestCaption = "tide";
    else delete r.dataset.forestCaption;
    if (m.length) {
      const e = document.createElement("i");
      ((e.className = "type-diamond"),
        e.setAttribute("aria-hidden", "true"),
        r.append(e));
    }
    (E.observe(r, { childList: !0 }), p());
  }
  function p() {
    x = 0;
    const t = Number(o.dataset.progress || 0),
      e = w[d];
    let a = 0;
    (m.forEach((s, c) => {
      const n = c * 0.006,
        l =
          e === void 0
            ? 0
            : Math.min(
                y((t - (e - 0.095) - n) / 0.035),
                y((e + 0.095 + n - t) / 0.035),
              );
      ((a = Math.max(a, l)),
        (s.style.opacity = String(l)),
        (s.style.filter =
          i.matches || u.matches
            ? "none"
            : `blur(${((1 - l) * 40).toFixed(2)}px)`));
    }),
      r.style.setProperty("--frame-alpha", String(a)));
    const g = y(t / 0.12);
    o.querySelector(".main-intro__copy").style.filter =
      i.matches || u.matches ? "none" : `blur(${g * 7}px)`;
  }
  function v() {
    x || (x = requestAnimationFrame(p));
  }
  (addEventListener("scroll", v, { passive: !0 }),
    addEventListener("resize", () => {
      d >= 0 ? (r.querySelector(".type-diamond")?.remove(), b()) : p();
    }),
    i.addEventListener("change", v),
    u.addEventListener("change", v),
    b());
  let h = [];
  function S() {
    (h.forEach((t) => t.cancel()),
      (h = []),
      !i.matches &&
        o
          .querySelectorAll(".main-intro__eyebrow,h1,.main-intro__description")
          .forEach((t, e) => {
            t.animate &&
              h.push(
                t.animate(
                  [
                    { opacity: 0, filter: u.matches ? "none" : "blur(7px)" },
                    { opacity: 1, filter: "blur(0px)" },
                  ],
                  {
                    duration: 1250,
                    delay: e * 120,
                    easing: "cubic-bezier(.22,.61,.36,1)",
                    fill: "backwards",
                  },
                ),
              );
          }));
  }
  (addEventListener("fairytale:intro-reveal", S, { once: !0 }),
    i.addEventListener("change", () => {
      i.matches && h.forEach((t) => t.cancel());
    }),
    new MutationObserver(() => {
      o.hasAttribute("inert") || (p(), S());
    }).observe(o, { attributes: !0, attributeFilter: ["inert"] }),
    S());
})();
