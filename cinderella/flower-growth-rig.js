import { createPetalBloom as K } from "./petal-bloom.js";
import * as t from "../book-library/vendor/three.module.js";
const O = (m) => Math.max(0, Math.min(1, m));
export function prepareFlower(m) {
  const a = m.geometry,
    g = a.attributes.position;
  function z(e, n) {
    const c = { position: [], normal: [], uv: [] };
    for (let r = 0; r < a.index.count; r += 3) {
      const h = [a.index.getX(r), a.index.getX(r + 1), a.index.getX(r + 2)],
        S = h.reduce((o, w) => o + g.getX(w), 0) / 3,
        F = h.reduce((o, w) => o + g.getY(w), 0) / 3;
      if (e(S, F))
        for (const o of h)
          (c.position.push(
            g.getX(o) - n[0],
            g.getY(o) - n[1],
            g.getZ(o) - n[2],
          ),
            c.normal.push(
              a.attributes.normal.getX(o),
              a.attributes.normal.getY(o),
              a.attributes.normal.getZ(o),
            ),
            c.uv.push(a.attributes.uv.getX(o), a.attributes.uv.getY(o)));
    }
    const u = new t.BufferGeometry();
    for (const r of Object.keys(c))
      u.setAttribute(r, new t.Float32BufferAttribute(c[r], r === "uv" ? 2 : 3));
    return u;
  }
  const B = 0.66,
    f = [],
    b = [];
  function x(e) {
    return {
      p: new t.Vector3().fromBufferAttribute(g, e),
      n: new t.Vector3().fromBufferAttribute(a.attributes.normal, e),
      uv: new t.Vector2().fromBufferAttribute(a.attributes.uv, e),
    };
  }
  for (let e = 0; e < a.index.count; e += 3) {
    let n = [
        x(a.index.getX(e)),
        x(a.index.getX(e + 1)),
        x(a.index.getX(e + 2)),
      ],
      c = [];
    for (let u = 0; u < 3; u++) {
      const r = n[u],
        h = n[(u + 1) % 3],
        S = r.p.y >= B,
        F = h.p.y >= B;
      if ((S && c.push(r), S !== F)) {
        const o = (B - r.p.y) / (h.p.y - r.p.y),
          w = {
            p: r.p.clone().lerp(h.p, o),
            n: r.n.clone().lerp(h.n, o).normalize(),
            uv: r.uv.clone().lerp(h.uv, o),
          };
        (c.push(w), b.push(w.p));
      }
    }
    for (let u = 1; u < c.length - 1; u++) f.push(c[0], c[u], c[u + 1]);
  }
  const R = b
    .reduce((e, n) => e.add(n), new t.Vector3())
    .multiplyScalar(1 / Math.max(1, b.length));
  R.y = B;
  const G = new t.BufferGeometry(),
    V = [],
    y = [],
    Y = [];
  for (const e of f) {
    const n = e.p.clone().sub(R);
    (V.push(n.x, n.y, n.z),
      y.push(e.n.x, e.n.y, e.n.z),
      Y.push(e.uv.x, e.uv.y));
  }
  return (
    G.setAttribute("position", new t.Float32BufferAttribute(V, 3)),
    G.setAttribute("normal", new t.Float32BufferAttribute(y, 3)),
    G.setAttribute("uv", new t.Float32BufferAttribute(Y, 2)),
    {
      map: m.map,
      head: G,
      center: z(
        (e, n) => n > 0.75 && Math.hypot(e + 0.02, n - 0.83) < 0.062,
        [-0.02, 0.83, 0.025],
      ),
      left: z(
        (e, n) => n > 0.32 && n < 0.5 && e < -0.026,
        [-0.012, 0.33, -0.08],
      ),
      right: z(
        (e, n) => n > 0.5 && n < 0.665 && e > 0.025,
        [-0.018, 0.51, -0.08],
      ),
    }
  );
}
export function createGrowthRig(m, a, g = 0) {
  const z = new t.MeshBasicMaterial({
      map: m.map,
      side: t.DoubleSide,
      color: 13092287,
    }),
    B = { value: 0 },
    f = new t.Group(),
    b = new t.Mesh(m.center || m.head, z);
  (b.scale.setScalar(330), (b.position.y = 14), f.add(b), a.add(f));
  const x = K(g);
  f.add(x.group);
  const R = new t.MeshBasicMaterial({
      map: m.map,
      side: t.DoubleSide,
      color: 11975592,
    }),
    G = [m.left, m.right].map((s) => {
      const i = new t.Group(),
        l = new t.Mesh(s, R);
      return (l.scale.setScalar(300), i.add(l), a.add(i), i);
    }),
    V = 32,
    y = 6,
    Y = (V + 1) * (y + 1),
    e = new t.BufferGeometry(),
    n = new Float32Array(Y * 3),
    c = new Float32Array(Y * 3),
    u = [];
  for (let s = 0; s < V; s++)
    for (let i = 0; i < y; i++) {
      const l = s * (y + 1) + i,
        d = l + y + 1;
      u.push(l, d, l + 1, d, d + 1, l + 1);
    }
  (e.setAttribute(
    "position",
    new t.BufferAttribute(n, 3).setUsage(t.DynamicDrawUsage),
  ),
    e.setAttribute(
      "normal",
      new t.BufferAttribute(c, 3).setUsage(t.DynamicDrawUsage),
    ),
    e.setIndex(u));
  const r = new t.MeshBasicMaterial({ color: 6449234 }),
    h = new t.Mesh(e, r);
  ((h.frustumCulled = !1), a.add(h));
  const S = new t.CylinderGeometry(3.5, 2.1, 18, 8),
    F = new t.Mesh(S, r);
  ((F.position.y = 5), f.add(F));
  let o = [new t.Vector3(0, 0, 0), new t.Vector3(0, 2, 0)],
    w = new t.CatmullRomCurve3(o),
    C = 2,
    q = 0,
    v = 0,
    Z = !1,
    T = 0;
  function E(s) {
    const i = w.getPoint(s);
    return (
      (i.x +=
        Math.sin(s * Math.PI) *
        Math.sin(s * 2.4 + 0.5) *
        Math.min(C * 0.055, 18)),
      i
    );
  }
  function _(s) {
    return E(Math.min(1, s + 0.005))
      .sub(E(Math.max(0, s - 0.005)))
      .normalize();
  }
  const J = new t.Vector3(),
    H = new t.Vector3(),
    I = new t.Vector3();
  return {
    get locked() {
      return Z;
    },
    extend(s, i) {
      if (Z) return;
      const l = o[o.length - 1];
      if (Math.hypot(s - l.x, i - l.y) < 7) return;
      (o.push(new t.Vector3(s, i, Math.sin(o.length * 0.23) * 3)),
        o.length > 42 &&
          (o = o.filter(
            (M, A) => A === 0 || A === o.length - 1 || A % 2 === 0,
          )));
      let d = o;
      for (let M = 0; M < 2; M++)
        d = d.map((A, p) =>
          p === 0 || p === d.length - 1
            ? A.clone()
            : d[p - 1]
                .clone()
                .addScaledVector(A, 2)
                .add(d[p + 1])
                .multiplyScalar(0.25),
        );
      ((w = new t.CatmullRomCurve3(d, !1, "centripetal")), (C = w.getLength()));
    },
    update(s, i) {
      if (Z) return !1;
      ((q += s), (T = i ? T + s : 0));
      const l = i && T > 0.28 ? O((C - 30) / 100) : 0;
      v += (l - v) * (1 - Math.exp(-s * 3.6));
      const d = O(q * 1.1),
        M = i ? 1 : d;
      for (let p = 0; p <= V; p++) {
        const D = (p / V) * M,
          U = E(D),
          L = _(D);
        I.set(L.y, -L.x, 0).normalize();
        const j = (3.4 - 1.4 * D) * Math.min(1, C / 50);
        for (let X = 0; X <= y; X++) {
          const k = (X / y) * Math.PI * 2,
            P = (p * (y + 1) + X) * 3;
          ((n[P] = U.x + I.x * Math.cos(k) * j),
            (n[P + 1] = U.y + I.y * Math.cos(k) * j),
            (n[P + 2] = U.z + Math.sin(k) * j),
            (c[P] = I.x * Math.cos(k)),
            (c[P + 1] = I.y * Math.cos(k)),
            (c[P + 2] = Math.sin(k)));
        }
      }
      ((e.attributes.position.needsUpdate = !0),
        (e.attributes.normal.needsUpdate = !0),
        J.copy(E(M)),
        H.copy(_(M)),
        f.position.copy(J).addScaledVector(H, -1.5));
      const A = Math.atan2(-H.x, H.y);
      return (
        (f.rotation.z = A),
        (f.rotation.y = 0),
        f.scale.setScalar(Math.max(0.001, O((C - 30) / 70) * 0.92)),
        (B.value = v),
        x.update(v),
        (b.rotation.x = [-0.86, -1.08, -0.73][g % 3] * v),
        (b.rotation.y = [-0.25, 0.3, -0.38][g % 3] * v),
        G.forEach((p, D) => {
          const U = 0.37 + D * 0.27,
            L = E(U * M),
            j = _(U * M);
          (p.position.copy(L), (p.rotation.z = Math.atan2(-j.x, j.y)));
          const X = O((C - (65 + D * 65)) / 95);
          (p.scale.setScalar(Math.max(0.001, X)),
            (p.rotation.y = (1 - X) * 1.2));
        }),
        l === 1 && v > 0.998
          ? ((Z = !0), (B.value = 1), x.update(1), f.scale.setScalar(0.92), !1)
          : Math.abs(v - l) > 0.001 || (!i && d < 1)
      );
    },
    dispose() {
      (e.dispose(),
        S.dispose(),
        x.dispose(),
        r.dispose(),
        z.dispose(),
        R.dispose());
    },
  };
}
