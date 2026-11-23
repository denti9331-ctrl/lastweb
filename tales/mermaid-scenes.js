export function createMermaidScenes(P) {
  const b = document.createElement("canvas");
  ((b.id = "mermaid-life"), b.setAttribute("aria-hidden", "true"), P.append(b));
  const e = b.getContext("2d"),
    w = matchMedia("(prefers-reduced-motion:reduce)").matches,
    B = {
      1: {
        plate: "../mermaid/assets/layers/storm-clean.webp",
        cutout: "../mermaid/assets/layers/storm-hair.webp",
        kind: "right",
        anchor: 800,
      },
      3: {
        plate: "../mermaid/assets/layers/dress-clean.webp",
        cutout: "../mermaid/assets/layers/dress.webp",
        kind: "dress",
        anchor: 400,
      },
      4: {
        plate: "../mermaid/assets/layers/night-clean.webp",
        cutout: "../mermaid/assets/layers/night-hair.webp",
        kind: "left",
        anchor: 1030,
      },
      5: {
        plate: "../mermaid/assets/layers/foam-clean.webp",
        kind: "dissolve",
        anchor: 1200,
      },
    },
    A = new Image();
  A.src = "../mermaid/assets/layers/storm-foam.webp";
  let f = -1,
    E = null,
    M = null,
    C = 1,
    I = 1,
    y = 0,
    O = 0,
    z = 0,
    g = -1,
    T = 0,
    L = -1,
    S = -1,
    R = { x: 0, y: 0, at: -1e4 };
  const j = document.createElement("canvas");
  ((j.width = 1672), (j.height = 941));
  const K = j.getContext("2d");
  addEventListener(
    "pointermove",
    (a) => {
      const s = F();
      ((R = {
        x: (a.clientX - s.x) / s.s,
        y: (a.clientY - s.y) / s.s,
        at: performance.now(),
      }),
        p());
    },
    { passive: !0 },
  );
  function F() {
    const a = Math.max(C / 1672, I / 941) * 1.04;
    return { s: a, x: (C - 1672 * a) / 2, y: (I - 941 * a) / 2 };
  }
  function p() {
    f >= 0 && !y && !document.hidden && (y = requestAnimationFrame(W));
  }
  function Z(a) {
    return (
      a.ready ||
        (a.ready = Promise.all(
          (a.kind === "dissolve" ? ["plate"] : ["plate", "cutout"]).map(
            (s) =>
              new Promise((o, t) => {
                const n = new Image();
                ((n.onload = () => {
                  ((a[s + "Image"] = n), o());
                }),
                  (n.onerror = t),
                  (n.src = a[s]));
              }),
          ),
        )),
      a.ready
    );
  }
  function H(a, s) {
    const o = document.createElement("canvas");
    ((o.width = 1672), (o.height = 941));
    const t = o.getContext("2d");
    if (
      (t.drawImage(s, 0, 0, 1672, 941),
      (t.globalCompositeOperation = "destination-in"),
      a.kind === "dissolve")
    ) {
      const i = document.createElement("canvas"),
        c = document.createElement("canvas");
      ((i.width = c.width = 835), (i.height = c.height = 470));
      const l = i.getContext("2d", { willReadFrequently: !0 }),
        h = c.getContext("2d", { willReadFrequently: !0 });
      (l.drawImage(s, 0, 0, 835, 470),
        h.drawImage(a.plateImage, 0, 0, 835, 470));
      const m = l.getImageData(0, 0, 835, 470),
        v = h.getImageData(0, 0, 835, 470),
        k = l.createImageData(835, 470);
      for (let u = 0; u < k.data.length; u += 4) {
        const J =
          Math.abs(m.data[u] - v.data[u]) +
          Math.abs(m.data[u + 1] - v.data[u + 1]) +
          Math.abs(m.data[u + 2] - v.data[u + 2]);
        k.data[u + 3] = J > 22 ? 255 : 0;
      }
      (l.putImageData(k, 0, 0),
        (l.globalCompositeOperation = "destination-in"),
        l.save(),
        l.scale(0.5, 0.5),
        (l.fillStyle = "#000"),
        l.fill(
          new Path2D(
            "M 1375 175 C 1450 170 1510 200 1480 295 L 1490 365 L 1545 465 L 1470 490 L 1400 410 L 1340 510 L 1190 610 L 1030 700 L 930 675 L 970 545 L 1120 450 L 1125 395 L 950 430 L 935 330 L 1220 230 Z",
          ),
        ),
        l.restore(),
        (t.filter = "blur(4px)"),
        t.drawImage(i, 0, 0, 1672, 941),
        (t.filter = "none"));
    } else t.drawImage(a.cutoutImage, 0, 0, 1672, 941);
    if (a.kind === "dress") {
      const i = t.createLinearGradient(300, 0, 440, 0);
      (i.addColorStop(0, "#000"),
        i.addColorStop(1, "#0000"),
        (t.fillStyle = i),
        t.fillRect(0, 0, 1672, 941),
        (t.globalCompositeOperation = "destination-out"),
        (t.fillStyle = "#000"),
        t.fill(
          new Path2D(
            "M 285 790 Q 315 750 355 760 L 390 830 L 590 830 L 610 941 L 275 941 Z",
          ),
        ),
        (t.globalCompositeOperation = "source-over"));
    }
    a.foreground = o;
    const n = document.createElement("canvas");
    ((n.width = 1672), (n.height = 941));
    const r = n.getContext("2d");
    if (
      ((r.filter = "blur(4px)"),
      r.drawImage(o, 0, 0),
      (r.filter = "none"),
      (r.globalCompositeOperation = "source-in"),
      r.drawImage(a.plateImage, 0, 0, 1672, 941),
      (a.repair = n),
      a.kind === "dissolve")
    ) {
      const i = document.createElement("canvas");
      ((i.width = 1672), (i.height = 941));
      const c = i.getContext("2d");
      (c.save(), c.translate(1250, 420), c.scale(1, 0.74));
      const l = c.createRadialGradient(0, 0, 0, 0, 0, 500);
      (l.addColorStop(0, "#000"),
        l.addColorStop(0.88, "#000"),
        l.addColorStop(1, "#0000"),
        (c.fillStyle = l),
        c.fillRect(-500, -500, 1e3, 1e3),
        c.restore(),
        (c.globalCompositeOperation = "source-in"),
        c.drawImage(a.plateImage, 0, 0, 1672, 941),
        (a.fullRepair = i));
    }
  }
  function d(a, s, o, t, n, r) {
    (e.save(), e.translate(a, s), e.scale(1, t / o));
    const i = e.createRadialGradient(0, 0, 0, 0, 0, o);
    (i.addColorStop(0, n),
      i.addColorStop(0.32, n),
      i.addColorStop(1, "#0000"),
      (e.globalAlpha = r),
      (e.fillStyle = i),
      e.fillRect(-o, -o, o * 2, o * 2),
      e.restore());
  }
  const x = [],
    Q = [
      [1180, 333, 1156, 352, 1081, 337, 1090, 390],
      [1090, 390, 1113, 425, 1105, 445, 1065, 459],
      [1065, 459, 1003, 475, 948, 480, 954, 524],
      [954, 524, 960, 552, 992, 584, 984, 628],
    ];
  let D = 0;
  for (const a of Q)
    for (let s = 0; s <= 40; s++) {
      const o = s / 40,
        t = 1 - o,
        n =
          t * t * t * a[0] +
          3 * t * t * o * a[2] +
          3 * t * o * o * a[4] +
          o * o * o * a[6],
        r =
          t * t * t * a[1] +
          3 * t * t * o * a[3] +
          3 * t * o * o * a[5] +
          o * o * o * a[7],
        i = x[x.length - 1];
      (i && (D += Math.hypot(n - i.x, r - i.y)), x.push({ x: n, y: r, d: D }));
    }
  function X(a) {
    const s = a * D;
    let o = 0,
      t = x.length - 1;
    for (; o < t; ) {
      const n = (o + t) >> 1;
      x[n].d < s ? (o = n + 1) : (t = n);
    }
    return x[o];
  }
  function Y(a, s, o, t) {
    (e.save(),
      e.translate(a, s),
      (e.globalAlpha = t),
      (e.strokeStyle = "#c5e2e4"),
      (e.fillStyle = "#9ccfd51a"),
      (e.lineWidth = 1),
      e.beginPath(),
      e.ellipse(0, 0, o * 0.72, o, Math.sin(a) * 0.2, 0, Math.PI * 2),
      e.fill(),
      e.stroke(),
      (e.globalAlpha = t * 0.7),
      e.beginPath(),
      e.ellipse(-o * 0.2, -o * 0.3, o * 0.22, o * 0.35, 0.25, 3.2, 5.1),
      e.stroke(),
      e.restore());
  }
  function W(a) {
    if (((y = 0), f < 0 || document.hidden || P.inert)) return;
    if (a - O < 40) {
      p();
      return;
    }
    O = a;
    const s = w ? 0 : (a - z) / 1e3,
      o = F();
    if (
      (e.clearRect(0, 0, C, I),
      e.save(),
      e.translate(o.x, o.y),
      e.scale(o.s, o.s),
      M?.foreground)
    ) {
      M.kind !== "dissolve" && e.drawImage(M.repair, 0, 0);
      const t = M;
      if (t.kind === "right" || t.kind === "left")
        for (let n = 0; n < 1672; n += 32) {
          const r = (h) => {
              const m = Math.max(
                0,
                t.kind === "right"
                  ? (h - t.anchor) / 650
                  : (t.anchor - h) / 600,
              );
              return (
                Math.sin(s * 1.25 + h * 0.008) *
                Math.min(1, m) *
                (t.kind === "left" ? 27 : 18)
              );
            },
            i = Math.min(32, 1672 - n),
            c = r(n),
            l = (r(n + i) - c) / i;
          (e.save(),
            e.transform(1, l, 0, 1, 0, c - l * n),
            e.drawImage(t.foreground, n, 0, i, 941, n, 0, i, 941),
            e.restore());
        }
      else if (t.kind === "dress")
        for (let n = 0; n < 941; n += 24) {
          const r = (h) =>
              Math.sin(s * 1.2 + h * 0.009) *
              Math.max(0, Math.min(1, (h - 500) / 300)) *
              7,
            i = Math.min(24, 941 - n),
            c = r(n),
            l = (r(n + i) - c) / i;
          (e.save(),
            e.transform(1, 0, l, 1, c - l * n, 0),
            e.drawImage(t.foreground, 0, n, 1672, i, 0, n, 1672, i),
            e.restore());
        }
      else {
        const n = g < 0 ? 0 : (a - g) / 1e3,
          r = g < 0 ? 0 : w ? 1 : Math.max(0, Math.min(1, (n - 1.8) / 5.4));
        if (
          (r > 0 &&
            ((e.globalAlpha = r * r * (3 - 2 * r)),
            e.drawImage(t.fullRepair, 0, 0),
            (e.globalAlpha = 1)),
          g >= 0 && r < 1)
        ) {
          const i = Math.min(1, n / 1.8) * (1 - r);
          (e.save(),
            (e.globalCompositeOperation = "screen"),
            d(1385, 270, 73, 115, "#7acbff", i * 0.25),
            d(1320, 405, 120, 150, "#65bdff", i * 0.19),
            d(1120, 560, 160, 90, "#68c3ff", i * 0.13),
            e.restore());
        }
      }
    }
    if (f === 0) {
      (e.save(), e.beginPath(), e.rect(500, 0, 1172, 210), e.clip());
      for (let t = 0; t < 8; t++) {
        ((e.strokeStyle = "#b0d1d3"),
          (e.globalAlpha = 0.09),
          (e.lineWidth = 1.3 + (t % 3)),
          e.beginPath());
        const n = 35 + t * 19 + Math.sin(s * 0.8 + t) * 8;
        (e.moveTo(540, n),
          e.bezierCurveTo(
            800,
            n - 22 + Math.sin(s * 0.9 + t) * 17,
            1120,
            n + 26,
            1620,
            n - 9,
          ),
          e.stroke());
      }
      (e.restore(),
        d(1040, 85, 250, 100, "#b0d4db", 0.035 + 0.012 * Math.sin(s * 0.8)));
    }
    if (
      (f === 1 &&
        A.complete &&
        A.naturalWidth &&
        ((e.globalAlpha = 0.28 + 0.08 * Math.sin(s * 1.3)),
        e.drawImage(
          A,
          Math.sin(s * 0.95) * 5,
          Math.cos(s * 1.1) * 3,
          1672,
          941,
        ),
        (e.globalAlpha = 1)),
      f === 2)
    ) {
      const t = S < 0 ? 0 : w ? 1 : Math.min(1, (a - S) / 4200),
        n = t * t * (3 - 2 * t),
        r = (0.88 + Math.sin(s * 1.7) * 0.1) * n;
      if (L >= 0 && !w) {
        const i = (a - L) / 1e3;
        for (let c = 0; c < 22; c++) {
          const l = i * 0.23 - c * 0.047;
          if (l < 0) continue;
          const h = l % 1,
            m = X(h),
            v = Math.sin(h * Math.PI) * 0.85 * Math.min(1, i);
          (d(m.x, m.y, 6 + (c % 3) * 2, 6 + (c % 3) * 2, "#83daff", v * 0.35),
            (e.globalAlpha = v),
            (e.fillStyle = c % 3 ? "#d6f4ff" : "#8bdcff"),
            e.beginPath(),
            e.arc(m.x, m.y, 1.1 + (c % 3) * 0.45, 0, Math.PI * 2),
            e.fill());
        }
        e.globalAlpha = 1;
      }
      (e.save(),
        (e.globalCompositeOperation = "screen"),
        d(890, 380, 115, 130, "#168bff", 0.65 * r),
        e.save(),
        e.beginPath(),
        e.moveTo(882, 311),
        e.lineTo(901, 311),
        e.lineTo(901, 345),
        e.bezierCurveTo(926, 368, 931, 402, 910, 410),
        e.bezierCurveTo(855, 438, 842, 388, 871, 352),
        e.closePath(),
        e.clip(),
        d(890, 392, 36, 45, "#3daaff", 0.95 * r),
        e.restore(),
        d(889, 385, 19, 25, "#d9faff", 0.9 * r),
        e.restore());
    }
    if (f === 4) {
      for (const n of [1361, 1638])
        (d(n, 208, 55, 95, "#f0c787", 0.22 + 0.025 * Math.sin(s * 2.5 + n)),
          d(n, 208, 13, 28, "#fff0bc", 0.42));
      (e.save(), (e.globalCompositeOperation = "screen"));
      const t = 0.32 + 0.2 * Math.sin(s * 1.4);
      ((e.strokeStyle = "#c8e9ff"),
        (e.shadowColor = "#79c4ff"),
        (e.shadowBlur = 15),
        (e.globalAlpha = t),
        (e.lineWidth = 2),
        e.beginPath(),
        e.moveTo(1116, 710),
        e.lineTo(1075, 820),
        e.stroke(),
        (e.shadowBlur = 0),
        d(1095, 765, 28, 74, "#8ac9ff", t * 0.32),
        d(367, 70, 102, 93, "#e0edff", 0.18 + 0.045 * Math.sin(s * 0.7)),
        e.save(),
        e.beginPath(),
        e.moveTo(335, 130),
        e.lineTo(285, 440),
        e.lineTo(505, 440),
        e.lineTo(397, 130),
        e.clip(),
        d(373, 170, 330, 440, "#b4d8f1", 0.045),
        e.restore(),
        e.restore());
    }
    if (f === 3) {
      const t = Math.hypot(R.x - 755, R.y - 420),
        n = Math.max(0, 1 - t / 180) * Math.max(0, 1 - (a - R.at) / 2200);
      if (n > 0) {
        (e.save(),
          (e.globalCompositeOperation = "screen"),
          d(755, 420, 72, 87, "#f0c9bb", n * 0.18));
        for (let r = 0; r < 9; r++) {
          const i = s * 0.65 + r * 2.4,
            c = 755 + Math.sin(i) * 45,
            l = 440 - ((s * 20 + r * 17) % 100);
          d(c, l, 3, 3, "#efd6cc", n * 0.45);
        }
        e.restore();
      }
    }
    if (f === 5 && g >= 0 && !w) {
      const t = (a - g) / 1e3 - 1.8;
      if (t > 0) {
        const n = [
          [1385, 210],
          [1430, 295],
          [1415, 380],
          [1450, 455],
          [1320, 450],
          [1240, 500],
          [1140, 565],
          [1040, 630],
          [970, 640],
          [1190, 355],
          [1080, 375],
          [1e3, 380],
        ];
        for (let r = 0; r < 90; r++) {
          const i = n[r % n.length],
            c = (r % 13) * 0.12,
            l = t - c;
          if (l < 0 || l > 5.2) continue;
          const h = l * l * 9,
            m = i[0] + Math.sin(r * 12.3) * h + Math.sin(l * 2 + r) * 10,
            v = i[1] - l * (24 + (r % 5) * 8),
            k = Math.sin(Math.min(1, l / 5.2) * Math.PI) * 0.72;
          Y(m, v, 2 + (r % 6), k);
        }
      }
    }
    (e.restore(), !w && (f !== 3 || M) && p());
  }
  function q() {
    ((C = innerWidth), (I = innerHeight));
    const a = Math.min(devicePixelRatio, 1.25);
    ((b.width = C * a),
      (b.height = I * a),
      e.setTransform(a, 0, 0, a, 0, 0),
      p());
  }
  (q(),
    addEventListener("resize", q),
    document.addEventListener("visibilitychange", p),
    addEventListener("scroll", p, { passive: !0 }));
  function G() {
    (T++,
      (f = -1),
      (M = null),
      (g = L = S = -1),
      cancelAnimationFrame(y),
      (y = 0),
      e.clearRect(0, 0, C, I),
      (b.hidden = !0));
  }
  return {
    clear: G,
    setScene(a) {
      (G(),
        (f = a),
        (z = performance.now()),
        (O = 0),
        (b.hidden = !1),
        (P.dataset.mermaidScene = String(a)));
      const s = T,
        o = B[a];
      if (o)
        return (
          (E = [...P.querySelectorAll(".picture")].find(
            (n) => n.style.visibility === "visible",
          )),
          Z(o)
            .then(() => {
              if (T !== s || f !== a || !E) return;
              const n = E,
                r = () => {
                  T === s && (H(o, n), (M = o), p());
                };
              return n
                .decode()
                .catch(() => {})
                .then(() => {
                  (r(), cancelAnimationFrame(y), (y = 0), W(performance.now()));
                });
            })
            .catch(() => {})
        );
      p();
    },
    cue(a) {
      (f === 2 &&
        (L < 0 && (L = performance.now()),
        a >= 1 && S < 0 && (S = performance.now()),
        p()),
        f === 5 && a >= 1 && g < 0 && ((g = performance.now()), p()));
    },
  };
}
