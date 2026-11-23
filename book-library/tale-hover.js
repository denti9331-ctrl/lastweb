(() => {
  const c = document.querySelector(".library-stage"),
    L = document.querySelector("#tale-title");
  if (!c || !L) return;
  const Q = matchMedia("(prefers-reduced-motion: reduce)"),
    U = matchMedia("(hover:hover) and (pointer:fine)"),
    A = document.createElement("canvas");
  ((A.className = "tale-hover-trails"), A.setAttribute("aria-hidden", "true"));
  const o = A.getContext("2d");
  if (!o) return;
  const q = document.createElement("div");
  ((q.className = "tale-mouse-dot"),
    q.setAttribute("aria-hidden", "true"),
    c.append(A, q));
  let T = 0;
  let s,
    d,
    O,
    D = !0,
    w = 0,
    it = 0,
    G = 0,
    i = null,
    r = null,
    h = [],
    l = document.body.dataset.tale;
  const y = new Image();
  function prepareMermaidReveal() {
    if (l === "2" && !y.getAttribute("src"))
      y.src = "../mermaid/assets/03-bargain.webp";
  }
  prepareMermaidReveal();
  const N = document.createElement("canvas");
  ((N.width = 320), (N.height = 220));
  const m = N.getContext("2d"),
    X = document.createElement("canvas");
  ((X.width = 320), (X.height = 220));
  const R = X.getContext("2d");
  for (const [e, t, n, g] of [
    [135, 105, 116, 84],
    [210, 105, 88, 70],
    [90, 140, 70, 60],
    [175, 60, 91, 53],
    [225, 145, 69, 53],
  ]) {
    (R.save(), R.translate(e, t), R.scale(n, g));
    const a = R.createRadialGradient(0, 0, 0.1, 0, 0, 1);
    (a.addColorStop(0, "#fff"),
      a.addColorStop(0.4, "#ffffffc0"),
      a.addColorStop(1, "#fff0"),
      (R.fillStyle = a),
      R.fillRect(-1, -1, 2, 2),
      R.restore());
  }
  const z = document.createElement("canvas");
  z.width = z.height = 48;
  const H = z.getContext("2d"),
    F = H.createRadialGradient(24, 24, 0, 24, 24, 24);
  (F.addColorStop(0, "#fffaf5"),
    F.addColorStop(0.12, "#f0e5ff"),
    F.addColorStop(0.34, "#cbb1ff85"),
    F.addColorStop(1, "#aa80ff00"),
    (H.fillStyle = F),
    H.fillRect(0, 0, 48, 48));
  function Z() {
    ((O = c.getBoundingClientRect()), (s = O.width), (d = O.height));
    const e = Math.min(devicePixelRatio || 1, 1.5);
    ((A.width = Math.round(s * e)),
      (A.height = Math.round(d * e)),
      o.setTransform(e, 0, 0, e, 0, 0));
  }
  function J() {
    return (
      D &&
      !document.hidden &&
      U.matches &&
      !Q.matches &&
      !document.body.classList.contains("opening") &&
      !document.body.classList.contains("reading")
    );
  }
  function b() {
    (clearTimeout(T),
      (T = 0),
      cancelAnimationFrame(w),
      (w = 0),
      (h = []),
      (i = r = null),
      c.classList.remove("has-tale-pointer"),
      L.style.removeProperty("mask-image"),
      o.clearRect(0, 0, s, d));
  }
  function _(e) {
    if (((w = 0), !J())) {
      b();
      return;
    }
    (o.clearRect(0, 0, s, d), (h = h.filter((t) => e - t.born < t.life)));
    for (const t of h) {
      const n = (e - t.born) / t.life,
        g = Math.sin(Math.PI * n);
      if ((o.save(), o.translate(t.x, t.y), l === "0")) {
        const a = (e - t.born) / 1e3,
          u = t.x + t.dx * a + Math.sin(a * 3 + t.angle) * 9,
          $ = t.y + t.vy * a + 105 * a * a,
          C = Math.min(1, n * 15) * Math.pow(1 - n, 1.7);
        (o.translate(u - t.x, $ - t.y),
          (o.globalCompositeOperation = "lighter"),
          (o.globalAlpha = C));
        for (let S = 0; S < 4; S++) {
          const K = 7 + a * 22,
            I = Math.sin(t.angle + S * 2.4) * K,
            E = Math.cos(t.angle * 2 + S * 1.8) * K * 0.65,
            k = t.size * (S === 0 ? 1 : 0.48) * (1 - n * 0.5);
          (S === 0 && o.drawImage(z, I - k * 3, E - k * 3, k * 6, k * 6),
            (o.fillStyle = t.tint),
            o.fillRect(I, E, Math.max(0.65, k), Math.max(0.65, k)));
        }
      } else if (l === "2" && y.complete && y.naturalWidth) {
        const a = Math.max(s / y.width, d / y.height),
          u = y.width * a,
          $ = y.height * a;
        m.clearRect(0, 0, 320, 220);
        for (let C = 0; C < 220; C += 8) {
          (m.save(), m.beginPath(), m.rect(0, C, 320, 8), m.clip());
          const j =
            (Math.sin(C * 0.032 + n * 5 + t.angle) * 17 +
              Math.sin(C * 0.067 - n * 3) * 6) *
            g;
          (m.drawImage(
            y,
            (s - u) / 2 - t.x + 160 + j,
            (d - $) / 2 - t.y + 110 + Math.sin(n * 4 + C * 0.02) * 7 * g,
            u,
            $,
          ),
            m.restore());
        }
        ((m.globalCompositeOperation = "destination-in"),
          m.drawImage(X, 0, 0),
          (m.globalCompositeOperation = "source-over"),
          (o.globalAlpha = g * 0.85),
          o.drawImage(N, -160, -110));
      }
      o.restore();
    }
    (l === "0" &&
      i &&
      e - G < 160 &&
      (o.save(),
      (o.globalCompositeOperation = "lighter"),
      (o.globalAlpha = Math.max(0, 1 - (e - G) / 160) * 0.85),
      o.drawImage(z, i.x - 12, i.y - 12, 24, 24),
      (o.fillStyle = "#fff7ee"),
      o.fillRect(i.x - 1, i.y - 1, 2, 2),
      o.restore()),
      (it = e),
      h.length && (w = requestAnimationFrame(_)));
  }
  function rt() {
    !w && J() && (w = requestAnimationFrame(_));
  }
  (c.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse" || !J()) return;
      ((O = c.getBoundingClientRect()),
        (i = { x: e.clientX - O.left, y: e.clientY - O.top }),
        c.classList.add("has-tale-pointer"),
        (q.style.transform =
          "translate3d(" + (i.x - 7) + "px," + (i.y - 7) + "px,0)"));
      const t = L.getBoundingClientRect();
      l !== "0" &&
      e.clientX >= t.left - 70 &&
      e.clientX <= t.right + 70 &&
      e.clientY >= t.top - 70 &&
      e.clientY <= t.bottom + 70
        ? (L.style.maskImage = `radial-gradient(ellipse 95px 65px at ${e.clientX - t.left}px ${e.clientY - t.top}px,#0005 0%,#0009 45%,#000 100%)`)
        : L.style.removeProperty("mask-image");
      const n = performance.now(),
        g = r ? Math.hypot(i.x - r.x, i.y - r.y) : 20;
      if (n - G > (l === "2" ? 170 : 32) && g > 9 && (l === "0" || l === "2")) {
        const a = l === "0" ? Math.min(12, 5 + Math.floor(g / 18)) : 1;
        for (let u = 0; u < a; u++)
          h.push({
            x:
              (l === "0" && r ? r.x + ((i.x - r.x) * (u + 1)) / a : i.x) +
              (Math.random() - 0.5) * 18,
            y:
              (l === "0" && r ? r.y + ((i.y - r.y) * (u + 1)) / a : i.y) +
              (Math.random() - 0.5) * 13,
            born: n - Math.random() * 70,
            life: l === "0" ? 1e3 + Math.random() * 450 : 1400,
            dx: (Math.random() - 0.5) * 30,
            vy: -15 - Math.random() * 22,
            heading: r ? Math.atan2(i.y - r.y, i.x - r.x) : 0,
            patch: 4 + Math.random() * 5,
            tint: Math.random() < 0.55 ? "#f5edff" : "#d3baff",
            angle: Math.random() * Math.PI,
            size: l === "0" ? 1.15 + Math.random() * 1.65 : 4,
          });
        (h.length > 150 && h.splice(0, h.length - 150),
          (r = i),
          (G = n),
          rt(),
          l === "0" &&
            (clearTimeout(T),
            (T = setTimeout(() => {
              ((h = []),
                (r = null),
                cancelAnimationFrame(w),
                (w = 0),
                o.clearRect(0, 0, s, d),
                (T = 0));
            }, 1600))));
      }
    },
    { passive: !0 },
  ),
    c.addEventListener("pointerleave", () => {
      ((i = r = null),
        c.classList.remove("has-tale-pointer"),
        L.style.removeProperty("mask-image"));
    }));
  const tt = new MutationObserver(() => {
    const e = document.body.dataset.tale;
    (e !== l ||
      document.body.classList.contains("opening") ||
      document.body.classList.contains("reading")) &&
      ((l = e), prepareMermaidReveal(), b());
  });
  tt.observe(document.body, {
    attributes: !0,
    attributeFilter: ["data-tale", "class"],
  });
  const et = new IntersectionObserver((e) => {
    ((D = e[0].isIntersecting), D || b());
  });
  et.observe(c);
  const at = new ResizeObserver(() => {
    (b(), Z());
  });
  (at.observe(c),
    document.addEventListener("visibilitychange", b),
    Q.addEventListener("change", b),
    U.addEventListener("change", b),
    addEventListener("pagehide", () => {
      (b(), tt.disconnect(), et.disconnect(), at.disconnect());
    }),
    Z());
})();
