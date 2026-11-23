export function createObjectLayers(y) {
  const o = document.createElement("canvas");
  ((o.id = "snow-objects"), o.setAttribute("aria-hidden", "true"), y.append(o));
  const n = o.getContext("2d"),
    M = {
      1: {
        plate: "../snowwhite/assets/layers/skirt-clean.webp",
        cutout: "../snowwhite/assets/layers/skirt-cutout.webp",
        pivot: [575, 510],
        patch: [150, 395, 430, 415],
      },
      2: {
        plate: "../snowwhite/assets/layers/vase-clean.webp",
        cutout: "../snowwhite/assets/layers/vase-cutout.webp",
        pivot: [617, 277],
        patch: [510, 80, 220, 225],
      },
      3: {
        plate: "../snowwhite/assets/layers/leaves-clean.webp",
        cutout: "../snowwhite/assets/layers/leaves-cutout.webp",
        pivot: [365, 0],
        patch: [0, 0, 715, 265],
      },
    };
  let s = -1,
    t = null,
    d = 1,
    m = 1,
    u = 0,
    b = 0,
    h = !1,
    p = 0,
    I = 0;
  const x = matchMedia("(prefers-reduced-motion:reduce)");
  function C() {
    const e = Math.max(d / 1672, m / 941) * 1.04;
    return { s: e, x: (d - 1672 * e) / 2, y: (m - 941 * e) / 2 };
  }
  function L(e) {
    return (
      e.ready ||
        (e.ready = Promise.all(
          ["plate", "cutout"].map(
            (a) =>
              new Promise((w, l) => {
                const i = new Image();
                ((i.onload = () => {
                  ((e[a + "Image"] = i), w());
                }),
                  (i.onerror = l),
                  (i.src = e[a]));
              }),
          ),
        )),
      e.ready
    );
  }
  function f(e) {
    if (((u = 0), !t || document.hidden || y.inert)) return;
    if (e - b < 32) {
      u = requestAnimationFrame(f);
      return;
    }
    ((b = e), (p += (Number(h) - p) * 0.12), n.clearRect(0, 0, d, m));
    const a = C(),
      w = t.patch;
    if ((n.save(), n.translate(a.x, a.y), n.scale(a.s, a.s), !t.patchCanvas)) {
      const c = document.createElement("canvas");
      ((c.width = 1672), (c.height = 941));
      const r = c.getContext("2d");
      ((r.filter = "blur(6px)"),
        r.drawImage(t.cutoutImage, 0, 0, 1672, 941),
        (r.filter = "none"),
        (r.globalCompositeOperation = "source-in"),
        r.drawImage(t.plateImage, 0, 0, 1672, 941),
        (t.patchCanvas = c));
    }
    n.drawImage(t.patchCanvas, 0, 0);
    const l = t.pivot,
      i = (e - I) / 1e3,
      A = x.matches
        ? 0
        : s === 1
          ? Math.sin(i * 1.2) * 0.011 + Math.sin(i * 0.63) * 0.005
          : s === 2
            ? Math.sin(i * 3.5) * 0.04 * p
            : Math.sin(i * 1.15) * 0.035 + Math.sin(i * 0.57) * 0.014;
    if (
      (n.translate(...l),
      n.rotate(A),
      n.translate(-l[0], -l[1]),
      s === 1 && !t.trailing)
    ) {
      const c = document.createElement("canvas");
      ((c.width = 1672), (c.height = 941));
      const r = c.getContext("2d");
      (r.drawImage(t.cutoutImage, 0, 0, 1672, 941),
        (r.globalCompositeOperation = "destination-in"));
      const g = r.createLinearGradient(490, 0, 590, 0);
      (g.addColorStop(0, "#000"),
        g.addColorStop(1, "#0000"),
        (r.fillStyle = g),
        r.fillRect(0, 0, 1672, 941),
        (t.trailing = c));
    }
    (n.drawImage(s === 1 ? t.trailing : t.cutoutImage, 0, 0, 1672, 941),
      n.restore(),
      !x.matches &&
        (s === 1 || s === 3 || p > 0.001 || h) &&
        (u = requestAnimationFrame(f)));
  }
  function v() {
    t && !u && (u = requestAnimationFrame(f));
  }
  (addEventListener(
    "pointermove",
    (e) => {
      if (s !== 2) return;
      const a = C(),
        w = (e.clientX - a.x) / a.s,
        l = (e.clientY - a.y) / a.s;
      ((h = w > 530 && w < 725 && l > 95 && l < 295), v());
    },
    { passive: !0 },
  ),
    document.documentElement.addEventListener("pointerleave", () => {
      ((h = !1), v());
    }));
  function E() {
    ((d = innerWidth), (m = innerHeight));
    const e = Math.min(devicePixelRatio, 1.25);
    ((o.width = d * e),
      (o.height = m * e),
      n.setTransform(e, 0, 0, e, 0, 0),
      v());
  }
  return (
    E(),
    addEventListener("resize", E),
    document.addEventListener("visibilitychange", v),
    {
      clear() {
        ((s = -1),
          (t = null),
          cancelAnimationFrame(u),
          (u = 0),
          (o.hidden = !0),
          n.clearRect(0, 0, d, m));
      },
      setScene(e) {
        (this.clear(), (s = e));
        const a = M[e];
        if (a)
          return L(a)
            .then(() => {
              s === e &&
                ((t = a),
                (I = performance.now()),
                (p = 0),
                (h = !1),
                (o.hidden = !1),
                f(performance.now()));
            })
            .catch(() => {
              o.hidden = !0;
            });
      },
    }
  );
}
