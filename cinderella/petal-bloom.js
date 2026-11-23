import * as r from "../book-library/vendor/three.module.js";
let u;
function H() {
  if (u) return u;
  const c = document.createElement("canvas");
  ((c.width = 128), (c.height = 256));
  const s = c.getContext("2d"),
    a = s.createLinearGradient(0, 0, 0, 256);
  (a.addColorStop(0, "#bbaea6"),
    a.addColorStop(0.45, "#e2d9cb"),
    a.addColorStop(1, "#f1e9d9"),
    (s.fillStyle = a),
    s.fillRect(0, 0, 128, 256),
    (s.strokeStyle = "#85747138"),
    (s.lineWidth = 0.8));
  for (let t = 0; t < 7; t++)
    (s.beginPath(),
      s.moveTo(64, 0),
      s.bezierCurveTo(
        64 + (t - 3) * 7,
        80,
        64 + (t - 3) * 14,
        170,
        64 + (t - 3) * 18,
        256,
      ),
      s.stroke());
  if (
    ((u = new r.CanvasTexture(c)),
    (u.colorSpace = r.SRGBColorSpace),
    typeof Image < "u")
  ) {
    const t = new Image();
    ((t.onload = () => {
      (s.clearRect(0, 0, 128, 256),
        s.drawImage(t, 0, 0, 128, 256),
        (u.needsUpdate = !0),
        dispatchEvent(new Event("flower-paint-ready")));
    }),
      (t.src = "assets/restyled/petal-paint.webp"));
  }
  return u;
}
export function createPetalBloom(c) {
  const s = new r.Group(),
    a = 14,
    t = 10,
    v = 5 * (a + 1) * (t + 1),
    h = new Float32Array(v * 3),
    x = new Float32Array(v * 2),
    C = [];
  for (let n = 0; n < 5; n++)
    for (let o = 0; o <= a; o++)
      for (let e = 0; e <= t; e++) {
        const i = n * (a + 1) * (t + 1) + o * (t + 1) + e;
        if (((x[i * 2] = e / t), (x[i * 2 + 1] = o / a), o < a && e < t)) {
          const d = i + t + 1;
          C.push(i, d, i + 1, d, d + 1, i + 1);
        }
      }
  const l = new r.BufferGeometry();
  (l.setAttribute(
    "position",
    new r.BufferAttribute(h, 3).setUsage(r.DynamicDrawUsage),
  ),
    l.setAttribute("uv", new r.BufferAttribute(x, 2)),
    l.setIndex(C));
  const P = new r.MeshBasicMaterial({
      map: H(),
      color: [14867405, 12295079, 10662848][c % 3],
      side: r.DoubleSide,
      polygonOffset: !0,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    g = new r.Mesh(l, P);
  ((g.frustumCulled = !1), (g.position.y = -14), (s.position.y = 14), s.add(g));
  const f = [];
  for (let n = 0; n < 5; n++) {
    const o = n * (a + 1) * (t + 1);
    for (let e = 0; e < a; e++)
      (f.push(o + e * (t + 1), o + (e + 1) * (t + 1)),
        f.push(o + e * (t + 1) + t, o + (e + 1) * (t + 1) + t));
    for (let e = 0; e < t; e++)
      (f.push(o + e, o + e + 1),
        f.push(o + a * (t + 1) + e, o + a * (t + 1) + e + 1));
  }
  const b = new r.BufferGeometry();
  (b.setAttribute("position", l.attributes.position), b.setIndex(f));
  const B = new r.LineBasicMaterial({
      color: 4803654,
      transparent: !0,
      opacity: 0.48,
      depthWrite: !1,
    }),
    M = new r.LineSegments(b, B);
  ((M.position.y = -14), (M.frustumCulled = !1), (M.renderOrder = 2), s.add(M));
  let A = -1;
  function G(n) {
    if (!(Math.abs(n - A) < 1e-5)) {
      ((A = n),
        (s.rotation.x = [-0.86, -1.08, -0.73][c % 3] * n),
        (s.rotation.y = [-0.25, 0.3, -0.38][c % 3] * n));
      for (let o = 0; o < 5; o++) {
        const e = o * 0.045,
          i = Math.max(0, Math.min(1, (n - e) / 0.82)),
          d = i * i * (3 - 2 * i),
          I = Math.PI / 2 + (o * Math.PI * 2) / 5,
          k = Math.cos(I),
          E = Math.sin(I);
        for (let w = 0; w <= a; w++)
          for (let m = 0; m <= t; m++) {
            const p = w / a,
              y = (m / t) * 2 - 1,
              S = (o * (a + 1) * (t + 1) + w * (t + 1) + m) * 3,
              U = I + ((y * Math.PI) / 5) * 1.035,
              j = 1 + Math.pow(Math.sin(Math.PI * p), 0.85) * 20,
              O = Math.cos(U) * j,
              R = p * 67,
              T = Math.sin(U) * j,
              z = 4 + p * 70,
              D = Math.pow(Math.sin(Math.PI * p), 0.8) * 24 * y,
              F = k * z - E * D,
              L = 14 + E * z + k * D,
              W = -Math.sin(Math.PI * p) * 6 + Math.pow(p, 5) * 10 + y * y * 2;
            ((h[S] = O + (F - O) * d),
              (h[S + 1] = R + (L - R) * d),
              (h[S + 2] = T + (W - T) * d + Math.sin(Math.PI * d) * p * 16));
          }
      }
      ((l.attributes.position.needsUpdate = !0), l.computeVertexNormals());
    }
  }
  return (
    G(0),
    {
      group: s,
      update: G,
      dispose() {
        (l.dispose(), b.dispose(), B.dispose(), P.dispose());
      },
    }
  );
}
