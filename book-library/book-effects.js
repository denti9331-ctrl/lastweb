(() => {
  "use strict";
  const entryIcons = new URL(
    "../assets/tale-loading-icons.svg?v=2",
    document.currentScript.src,
  ).href;
  const v = document.createElement("div");
  ((v.className = "redhood-entry-curtain"),
    v.setAttribute("aria-hidden", "true"),
    (v.innerHTML =
      '<div class="redhood-shadow-sweep"></div><div class="redhood-shadow-black"></div><div class="redhood-entry-progress"><svg class="tale-entry-icon" focusable="false" aria-hidden="true"><use href="' +
      entryIcons +
      '#wolf"></use></svg><span></span></div>'),
    document.body.append(v));
  const s = document.createElement("canvas");
  ((s.className = "tale-effects"),
    s.setAttribute("aria-hidden", "true"),
    document.body.append(s));
  const u = document.createElement("div");
  ((u.className = "mermaid-entry-curtain"),
    u.setAttribute("aria-hidden", "true"),
    (u.innerHTML =
      '<svg width="0" height="0"><defs><filter id="mermaid-entry-refraction" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".008 .026" numOctaves="2" seed="14" result="water"><animate attributeName="baseFrequency" values=".008 .026;.013 .032;.009 .022" dur="2.1s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="water" scale="0" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" values="0;36;72;48;20" keyTimes="0;.18;.48;.76;1" dur="1.8s" begin="indefinite" fill="freeze"/></feDisplacementMap></filter></defs></svg><div class="mermaid-entry-black"></div><div class="mermaid-entry-progress"><svg class="tale-entry-icon" focusable="false" aria-hidden="true"><use href="' +
      entryIcons +
      '#drop"></use></svg><span></span></div>'),
    document.body.append(u));
  const e = s.getContext("2d"),
    x = matchMedia("(prefers-reduced-motion: reduce)");
  let p = 0,
    S = [],
    C = 0,
    n = 0,
    l = 0,
    o = 0;
  function b() {
    (cancelAnimationFrame(p),
      (p = 0),
      e.clearRect(0, 0, l, o),
      (s.dataset.active = "false"));
  }
  function T() {
    ((l = innerWidth), (o = innerHeight));
    const c = Math.min(devicePixelRatio, 1.5);
    ((s.width = l * c), (s.height = o * c), e.setTransform(c, 0, 0, c, 0, 0));
  }
  (addEventListener("resize", T), T());
  function w(c) {
    if (
      (b(), x.matches || ((n = c.detail.index), n === 0 || n === 1 || n === 3))
    )
      return;
    if (n === 2) {
      u.querySelector("feDisplacementMap animate").beginElement();
      return;
    }
    ((C = performance.now()),
      (s.dataset.active = "true"),
      (s.dataset.tale = String(n)));
    const d = { x: l * 0.5, y: o * 0.43 };
    ((S = Array.from({ length: n === 1 ? 48 : 64 }, () => {
      const t = Math.random() * Math.PI * 2,
        i = 60 + Math.random() * 260;
      return {
        x: d.x + (Math.random() - 0.5) * 90,
        y: d.y + (Math.random() - 0.5) * 100,
        vx: Math.cos(t) * i,
        vy: Math.sin(t) * i - 80,
        r: n === 2 ? 5 + Math.random() * 20 : 3 + Math.random() * 11,
        angle: Math.random() * 6.28,
        spin: (Math.random() - 0.5) * 5,
        delay: Math.random() * 0.35,
        depth: 0.6 + Math.random() * 0.5,
      };
    })),
      (p = requestAnimationFrame(M)));
  }
  function M(c) {
    const d = (c - C) / 1e3;
    if (
      ((s.dataset.phase = d > 0.45 ? "burst" : "start"),
      e.clearRect(0, 0, l, o),
      d > 2.25 ||
        document.hidden ||
        !document.body.classList.contains("opening"))
    ) {
      b();
      return;
    }
    if (n === 2) {
      const t = Math.min(1, d / 1.3),
        i = t * t * (3 - 2 * t),
        h = o + 90 - i * (o + 190),
        m = e.createLinearGradient(0, h - 35, 0, h + 180);
      (m.addColorStop(0, "#02060a00"),
        m.addColorStop(0.35, "#04121bd9"),
        m.addColorStop(1, "#020406"),
        (e.fillStyle = m),
        e.beginPath(),
        e.moveTo(0, o + 20),
        e.lineTo(0, h));
      for (let f = 0; f <= l + 24; f += 24) {
        const r =
          Math.sin(f / 130 + d * 2.2) * 15 + Math.sin(f / 53 - d * 1.5) * 5;
        e.lineTo(f, h + r);
      }
      (e.lineTo(l, o + 20),
        e.closePath(),
        e.fill(),
        (p = requestAnimationFrame(M)));
      return;
    }
    for (const t of S) {
      if (n === 1) {
        const r = d - t.delay - 0.12;
        if (r < 0) continue;
        const k = Math.max(0.13, t.depth - r * 0.48),
          g = 1 / k,
          P = l * 0.5 + (t.x - l * 0.5 + t.vx * r * 0.7) * g,
          q = o * 0.43 + (t.y - o * 0.43 + t.vy * r * 0.5 + 25 * r * r) * g,
          a = t.r * g * (1 + r * 0.5);
        (e.save(),
          e.translate(P, q),
          e.rotate(t.angle + t.spin * r),
          (e.globalAlpha =
            Math.min(1, r * 7) * Math.max(0, Math.min(1, (1.8 - d) * 3))),
          e.scale(0.55 + Math.abs(Math.sin(r * 5 + t.angle)) * 0.55, 1));
        const y = e.createLinearGradient(-a, -a, a, a);
        (y.addColorStop(0, "#f18a98"),
          y.addColorStop(0.35, "#b93250"),
          y.addColorStop(1, "#4b0b25"),
          (e.fillStyle = y),
          e.beginPath(),
          e.moveTo(-a, -a * 0.65),
          e.bezierCurveTo(
            a * 0.1,
            -a * 1.4,
            a * 1.25,
            -a * 0.45,
            a * 0.6,
            a * 0.65,
          ),
          e.bezierCurveTo(a * 0.05, a * 1.2, -a * 0.8, a * 0.55, -a, -a * 0.65),
          e.fill(),
          (e.strokeStyle = "#ffc3cd44"),
          (e.lineWidth = 0.6),
          e.beginPath(),
          e.moveTo(-a * 0.65, -a * 0.5),
          e.quadraticCurveTo(0, 0, a * 0.45, a * 0.55),
          e.stroke(),
          e.restore());
        continue;
      }
      const i = d - t.delay;
      if (i < 0) continue;
      const h = Math.max(0, Math.min(1, i * 6) * (1 - i / 2.1));
      if (!h) continue;
      let m = t.x + t.vx * i * 0.8,
        f = t.y + t.vy * i + (n === 2 ? -65 : n === 1 ? 150 : 85) * i * i;
      if (
        (e.save(),
        e.translate(m, f),
        e.rotate(t.angle + t.spin * i),
        (e.globalAlpha = h),
        n === 2)
      ) {
        ((e.shadowColor = "#61d7ff"),
          (e.shadowBlur = 12),
          (e.strokeStyle = "#b4edff"),
          (e.lineWidth = 1.2));
        const r = e.createRadialGradient(-t.r * 0.3, -t.r * 0.3, 0, 0, 0, t.r);
        (r.addColorStop(0, "#d8fbff55"),
          r.addColorStop(0.75, "#388cb011"),
          r.addColorStop(1, "#b4edff77"),
          (e.fillStyle = r),
          e.beginPath(),
          e.arc(0, 0, t.r, 0, Math.PI * 2),
          e.fill(),
          e.stroke(),
          e.beginPath(),
          e.arc(-t.r * 0.2, -t.r * 0.2, t.r * 0.55, 3.5, 4.9),
          e.stroke());
      } else
        n === 0
          ? ((e.shadowColor = "#9bd7ff"),
            (e.shadowBlur = 7),
            (e.fillStyle = "#b8dfff55"),
            (e.strokeStyle = "#e1f4ffcc"),
            (e.lineWidth = 0.8),
            e.beginPath(),
            e.moveTo(-t.r, -t.r * 0.7),
            e.lineTo(t.r * 0.7, -t.r * 0.4),
            e.lineTo(t.r * 0.2, t.r * 1.8),
            e.closePath(),
            e.fill(),
            e.stroke())
          : t.r > 9
            ? ((e.shadowColor = "#8bc451"),
              (e.shadowBlur = 25),
              (e.fillStyle = "#74ae4333"),
              e.beginPath(),
              e.arc(0, 0, t.r * (1 + i * 2), 0, Math.PI * 2),
              e.fill())
            : ((e.fillStyle = "#a82237"),
              (e.strokeStyle = "#ff8d8d88"),
              e.beginPath(),
              e.moveTo(0, -t.r),
              e.quadraticCurveTo(t.r * 1.5, -t.r, t.r, t.r),
              e.quadraticCurveTo(0, t.r * 1.4, -t.r, t.r),
              e.quadraticCurveTo(-t.r * 1.5, -t.r, 0, -t.r),
              e.fill(),
              e.stroke());
      e.restore();
    }
    p = requestAnimationFrame(M);
  }
  (document.addEventListener("fairytale:book-open", w),
    addEventListener("pagehide", b),
    document.addEventListener("visibilitychange", () => {
      document.hidden && b();
    }));
})();
