import * as u from "../book-library/vendor/three.module.js";
import { loadFlower as C } from "../cinderella/flower-model.js";
import {
  prepareFlower as R,
  createGrowthRig as S,
} from "../cinderella/flower-growth-rig.js";
export function createGarden(g) {
  const i = document.createElement("canvas");
  ((i.id = "story-garden"),
    i.setAttribute(
      "aria-label",
      "\uC544\uB798\uC5D0\uC11C \uC704\uB85C \uB4DC\uB798\uADF8\uD574 \uAF43 \uD53C\uC6B0\uAE30",
    ),
    g.append(i));
  const a = document.createElement("div");
  ((a.id = "garden-hint"),
    (a.textContent =
      "\uBB34\uB364 \uC606 \uB545\uC5D0\uC11C \uC704\uB85C \uB04C\uC5B4 \uAF43\uC744 \uD53C\uC6CC\uBCF4\uC138\uC694"),
    g.append(a));
  let c;
  try {
    c = new u.WebGLRenderer({
      canvas: i,
      alpha: !0,
      antialias: devicePixelRatio < 2,
      powerPreference: "low-power",
    });
  } catch {
    return (i.remove(), a.remove(), { setScene() {} });
  }
  (c.setPixelRatio(Math.min(devicePixelRatio, 1.25)),
    (c.outputColorSpace = u.SRGBColorSpace));
  const x = new u.Scene(),
    d = new u.OrthographicCamera(
      -innerWidth / 2,
      innerWidth / 2,
      innerHeight / 2,
      -innerHeight / 2,
      0.1,
      2e3,
    );
  d.position.z = 800;
  let f = null,
    v = !1,
    y = null,
    l = !1,
    n = null,
    s = 0,
    p = 0;
  const h = [];
  function o() {
    l && !s && (s = requestAnimationFrame(M));
  }
  function M(t) {
    if (((s = 0), !l)) return;
    const r = p ? Math.min((t - p) / 1e3, 0.05) : 0.016;
    p = t;
    let E = !1;
    for (const e of h) {
      if (e.rig.locked) continue;
      const H = 1 - Math.exp(-r * 12);
      ((e.x += (e.tx - e.x) * H),
        (e.y += (e.ty - e.y) * H),
        e.rig.extend(e.x, e.y),
        (e.rig.update(r, e.released) ||
          Math.hypot(e.x - e.tx, e.y - e.ty) > 0.15) &&
          (E = !0));
    }
    (c.render(x, d),
      (i.dataset.locked = String(h.filter((e) => e.rig.locked).length)),
      (E || n) && o());
  }
  function w() {
    ((d.left = -innerWidth / 2),
      (d.right = innerWidth / 2),
      (d.top = innerHeight / 2),
      (d.bottom = -innerHeight / 2),
      d.updateProjectionMatrix(),
      c.setSize(innerWidth, innerHeight, !1),
      o());
  }
  (w(),
    addEventListener("resize", w),
    addEventListener("flower-paint-ready", o),
    addEventListener("pointerdown", (t) => {
      if (
        !l ||
        !f ||
        t.button !== 0 ||
        t.clientY < innerHeight * 0.5 ||
        t.target.closest("button,a") ||
        h.length >= 4
      )
        return;
      (t.preventDefault(), i.setPointerCapture(t.pointerId));
      const r = new u.Group();
      (r.position.set(
        t.clientX - innerWidth / 2,
        innerHeight / 2 - t.clientY,
        0,
      ),
        x.add(r),
        (n = {
          root: r,
          rig: S(f, r, h.length % 3),
          ox: t.clientX,
          oy: t.clientY,
          x: 0,
          y: 2,
          tx: 0,
          ty: 2,
          released: !1,
        }),
        h.push(n),
        (a.textContent =
          "\uC904\uAE30\uB97C \uC774\uB04C\uACE0 \uC190\uC744 \uB193\uC73C\uBA74 \uAF43\uBD09\uC624\uB9AC\uAC00 \uD3BC\uCCD0\uC838\uC694"),
        o());
    }),
    addEventListener(
      "pointermove",
      (t) => {
        n &&
          ((n.tx = Math.max(-250, Math.min(250, t.clientX - n.ox))),
          (n.ty = Math.max(2, Math.min(innerHeight * 0.48, n.oy - t.clientY))),
          o());
      },
      { passive: !0 },
    ));
  function m() {
    n &&
      ((n.released = !0),
      (n = null),
      (a.textContent =
        "\uB2E4 \uD540 \uAF43\uC740 \uADF8 \uC790\uB9AC\uC5D0 \uBA38\uBB3C\uB7EC\uC694 \xB7 \uB124 \uC1A1\uC774\uAE4C\uC9C0"),
      o());
  }
  return (
    addEventListener("pointerup", m),
    addEventListener("pointercancel", m),
    {
      setScene(t) {
        if (((l = t === 1), (i.hidden = a.hidden = !l), !l)) {
          (m(), cancelAnimationFrame(s), (s = 0), (p = 0));
          return;
        }
        return (
          v ||
            ((v = !0),
            (y = C()
              .then((r) => {
                ((f = R(r)), o());
              })
              .catch(() => {
                a.textContent =
                  "\uAF43\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694 \xB7 \uC0C8\uB85C\uACE0\uCE68\uD574 \uC8FC\uC138\uC694";
              }))),
          o(),
          y
        );
      },
    }
  );
}
