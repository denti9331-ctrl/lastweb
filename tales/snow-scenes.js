import { createObjectLayers as ae } from "./snow-object-layers.js?v=2";
export function createSnowScenes(L, y) {
  const j = ae(L),
    z = matchMedia("(prefers-reduced-motion:reduce)"),
    t = y.getContext("webgl", {
      alpha: !0,
      depth: !1,
      antialias: !1,
      powerPreference: "low-power",
    }),
    d = document.createElement("canvas");
  ((d.id = "mirror-mist"), d.setAttribute("aria-hidden", "true"), L.append(d));
  const o = d.getContext("2d"),
    u = document.createElement("button");
  ((u.id = "mirror-hint"),
    (u.textContent =
      "\uAC70\uC6B8\uC744 \uBB38\uC9C8\uB7EC \uB2E6\uC544\uBCF4\uC138\uC694"),
    u.setAttribute("aria-label", "\uAC70\uC6B8 \uB2E6\uAE30"),
    L.append(u));
  let c = -1,
    T = null,
    f = 1,
    p = 1,
    m = 0,
    B = 0,
    k = 0,
    _ = 0,
    F = 0,
    M = 0,
    S = !1,
    w = null,
    U = 0,
    I = !1;
  const X = [],
    C = [];
  let A = 0;
  const g = document.createElement("canvas");
  ((g.id = "mirror-foreground"),
    (g.width = 1672),
    (g.height = 941),
    g.setAttribute("aria-hidden", "true"),
    L.append(g));
  const R = g.getContext("2d"),
    v = new Image();
  ((v.src = "../snowwhite/assets/layers/mirror-foreground.webp"),
    (v.onload = () => {
      (N(), q());
    }));
  function N() {
    c !== 0 ||
      !T?.complete ||
      !T.naturalWidth ||
      !v.complete ||
      !v.naturalWidth ||
      (R.clearRect(0, 0, 1672, 941),
      (R.globalCompositeOperation = "source-over"),
      R.drawImage(T, 0, 0, 1672, 941),
      (R.globalCompositeOperation = "destination-in"),
      R.drawImage(v, 0, 0, 1672, 941),
      (R.globalCompositeOperation = "source-over"));
  }
  const K =
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    $ = `precision highp float;varying vec2 uv;uniform sampler2D art;uniform vec2 size;uniform float ratio,time,scene,house,vase;
 float region(vec2 p,vec2 c,vec2 r){return 1.-smoothstep(.45,1.,length((p-c)/r));}
 float windowLight(vec2 p,vec2 c,vec2 r){vec2 d=abs((p-c)/r);return 1.-smoothstep(.7,1.2,max(d.x,d.y));}
 void main(){vec2 p=vec2(uv.x,1.-uv.y);float aspect=size.x/size.y;vec2 crop=vec2(min(aspect/ratio,1.),min(ratio/aspect,1.));vec2 q=(p-.5)*crop/1.04+.5,src=q;
 vec3 c=texture2D(art,src).rgb;
 if(scene==1.){float lights=0.;lights+=windowLight(q,vec2(.807,.394),vec2(.014,.025));lights+=windowLight(q,vec2(.72,.55),vec2(.015,.025));lights+=windowLight(q,vec2(.771,.55),vec2(.016,.025));lights+=windowLight(q,vec2(.931,.546),vec2(.016,.025));lights+=windowLight(q,vec2(.663,.554),vec2(.015,.025));float glow=region(q,vec2(.8,.52),vec2(.18,.14));c+=vec3(.65,.35,.10)*house*(lights*.7+glow*.35)*( .96+sin(time*3.1)*.04);}
 gl_FragColor=vec4(c,1.);}`;
  let b, x;
  if (t) {
    const e = (r, l) => {
      const s = t.createShader(r);
      if (
        (t.shaderSource(s, l),
        t.compileShader(s),
        !t.getShaderParameter(s, t.COMPILE_STATUS))
      )
        throw Error(t.getShaderInfoLog(s));
      return s;
    };
    ((b = t.createProgram()),
      t.attachShader(b, e(t.VERTEX_SHADER, K)),
      t.attachShader(b, e(t.FRAGMENT_SHADER, $)),
      t.linkProgram(b),
      t.useProgram(b));
    const a = t.createBuffer();
    (t.bindBuffer(t.ARRAY_BUFFER, a),
      t.bufferData(
        t.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        t.STATIC_DRAW,
      ));
    const i = t.getAttribLocation(b, "p");
    (t.enableVertexAttribArray(i),
      t.vertexAttribPointer(i, 2, t.FLOAT, !1, 0, 0));
    const n = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, n);
    for (const r of [t.TEXTURE_MIN_FILTER, t.TEXTURE_MAG_FILTER])
      t.texParameteri(t.TEXTURE_2D, r, t.LINEAR);
    for (const r of [t.TEXTURE_WRAP_S, t.TEXTURE_WRAP_T])
      t.texParameteri(t.TEXTURE_2D, r, t.CLAMP_TO_EDGE);
    x = Object.fromEntries(
      ["size", "ratio", "time", "scene", "house", "vase"].map((r) => [
        r,
        t.getUniformLocation(b, r),
      ]),
    );
  }
  function G() {
    const e = Math.max(f / 1672, p / 941) * 1.04;
    return { scale: e, x: (f - 1672 * e) / 2, y: (p - 941 * e) / 2 };
  }
  function H(e) {
    const a = G();
    return { x: (e.clientX - a.x) / a.scale, y: (e.clientY - a.y) / a.scale };
  }
  const W = new Image(),
    P = document.createElement("canvas");
  let D = null;
  ((W.src = "../snowwhite/assets/layers/glass-alpha.webp"),
    (W.onload = () => {
      ((P.width = 1672), (P.height = 941));
      const e = P.getContext("2d", { willReadFrequently: !0 });
      (e.drawImage(W, 0, 0, 1672, 941),
        (e.globalCompositeOperation = "destination-out"),
        e.fill(
          new Path2D(
            "M 1160 430 C 1140 500 1120 560 1090 620 L 1100 850 L 1500 850 L 1500 400 Z",
          ),
        ),
        (e.globalCompositeOperation = "source-over"),
        (D = e.getImageData(0, 0, 1672, 941).data),
        q());
    }));
  function Y(e, a, i = 0.12, n = 0) {
    const r = G(),
      l = 42 * r.scale,
      s = r.x + e * r.scale,
      h = r.y + a * r.scale;
    (o.save(),
      (o.globalCompositeOperation = "destination-out"),
      o.translate(s, h),
      o.rotate(n),
      o.scale(1, 0.7));
    const E = o.createRadialGradient(0, 0, 0, 0, 0, l);
    (E.addColorStop(0, "rgba(0,0,0," + i + ")"),
      E.addColorStop(0.55, "rgba(0,0,0," + i * 0.7 + ")"),
      E.addColorStop(1, "rgba(0,0,0,0)"),
      (o.fillStyle = E),
      o.fillRect(-l, -l, l * 2, l * 2),
      o.restore());
  }
  function q() {
    if ((o.clearRect(0, 0, f, p), c !== 0 || I || !D)) return;
    const e = G();
    (o.save(),
      (o.fillStyle = "#07080a"),
      (o.globalAlpha = 0.82),
      o.fillRect(0, 0, f, p));
    let a = 172;
    const i = () => ((a = (a * 16807) % 2147483647), (a - 1) / 2147483646);
    for (let n = 0; n < 45; n++) {
      const r = e.x + (750 + i() * 450) * e.scale,
        l = e.y + (90 + i() * 650) * e.scale,
        s = (25 + i() * 90) * e.scale,
        h = o.createRadialGradient(r, l, 0, r, l, s);
      (h.addColorStop(0, n % 3 ? "#020304b8" : "#45443d45"),
        h.addColorStop(1, "#00000000"),
        (o.globalAlpha = 0.6),
        (o.fillStyle = h),
        o.fillRect(r - s, l - s, s * 2, s * 2));
    }
    for (let n = 0; n < 13e3; n++)
      ((o.fillStyle = n % 4 ? "#060708" : "#8b8975"),
        (o.globalAlpha = 0.08 + i() * 0.22),
        o.fillRect(
          e.x + (730 + i() * 500) * e.scale,
          e.y + (70 + i() * 730) * e.scale,
          (0.3 + i()) * e.scale,
          (0.3 + i()) * e.scale,
        ));
    ((o.globalAlpha = 1),
      (o.globalCompositeOperation = "destination-in"),
      o.drawImage(P, e.x, e.y, 1672 * e.scale, 941 * e.scale),
      v.complete &&
        v.naturalWidth &&
        ((o.globalCompositeOperation = "destination-out"),
        o.drawImage(v, e.x, e.y, 1672 * e.scale, 941 * e.scale)),
      o.restore());
    for (const n of X) Y(n[0], n[1], n[2], n[3]);
  }
  function V() {
    ((f = innerWidth), (p = innerHeight));
    const e = Math.min(devicePixelRatio, 1.25);
    ((y.width = Math.round(f * e)),
      (y.height = Math.round(p * e)),
      (d.width = Math.round(f * e)),
      (d.height = Math.round(p * e)),
      o.setTransform(e, 0, 0, e, 0, 0),
      t && (t.viewport(0, 0, y.width, y.height), t.uniform2f(x.size, f, p)),
      q());
  }
  function O(e) {
    ((m = 0),
      !(document.hidden || !T) &&
        (e - B > 32 &&
          ((B = e),
          (_ += (F - _) * 0.09),
          (M *= 0.975),
          t &&
            (t.uniform1f(x.time, z.matches ? 0 : (e - k) / 1e3),
            t.uniform1f(x.house, _),
            t.uniform1f(x.vase, z.matches ? 0 : M),
            t.drawArrays(t.TRIANGLES, 0, 6))),
        c === 1 && (m = requestAnimationFrame(O))));
  }
  function Q(e) {
    if (c !== 0 || I || !S || !D) return;
    const a = H(e),
      i = Math.round(a.x),
      n = Math.round(a.y);
    if (
      i < 0 ||
      i >= 1672 ||
      n < 0 ||
      n >= 941 ||
      D[(n * 1672 + i) * 4 + 3] < 30
    ) {
      w = null;
      return;
    }
    const r = w || a,
      l = Math.hypot(a.x - r.x, a.y - r.y),
      s = Math.max(1, Math.ceil(l / 5));
    for (let h = 1; h <= s; h++) {
      const E = h / s,
        ee = r.x + (a.x - r.x) * E,
        te = r.y + (a.y - r.y) * E,
        J = [ee, te, 0.12, Math.atan2(a.y - r.y, a.x - r.x)];
      (X.push(J), C.push(J));
    }
    ((w = a), A || (A = requestAnimationFrame(Z)), u.classList.add("used"));
  }
  function Z() {
    A = 0;
    for (let e = 0; e < 32 && C.length; e++) {
      const a = C.shift();
      Y(...a);
    }
    C.length && (A = requestAnimationFrame(Z));
  }
  return (
    addEventListener("pointerdown", (e) => {
      e.target.closest("button,a") || ((S = !0), (w = null), Q(e));
    }),
    addEventListener("pointerup", () => {
      ((S = !1), (w = null));
    }),
    addEventListener("pointercancel", () => {
      ((S = !1), (w = null));
    }),
    addEventListener(
      "pointermove",
      (e) => {
        Q(e);
        const a = H(e);
        ((F =
          c === 1 && a.x > 1040 && a.x < 1630 && a.y > 220 && a.y < 630
            ? 1
            : 0),
          c === 2 &&
            a.x > 535 &&
            a.x < 700 &&
            a.y > 115 &&
            a.y < 290 &&
            (M = 1));
      },
      { passive: !0 },
    ),
    u.addEventListener("click", () => {
      ((I = !0), d.classList.add("clean"), u.classList.add("used"));
    }),
    document.documentElement.addEventListener("pointerleave", () => {
      ((F = 0), (S = !1), (w = null));
    }),
    addEventListener("resize", V),
    document.addEventListener("visibilitychange", () => {
      !document.hidden && !m && (m = requestAnimationFrame(O));
    }),
    V(),
    {
      clear() {
        (cancelAnimationFrame(A),
          (A = 0),
          (C.length = 0),
          (g.hidden = !0),
          j.clear(),
          U++,
          cancelAnimationFrame(m),
          (m = 0),
          (y.style.visibility = "hidden"),
          (d.style.visibility = "hidden"),
          (u.hidden = !0));
      },
      setImage(e, a) {
        const i = ++U;
        c = a;
        const n = j.setScene(a);
        ((T = e),
          (g.hidden = a !== 0),
          (X.length = 0),
          (I = !1),
          (_ = F = M = 0),
          (k = performance.now()),
          (u.hidden = c !== 0),
          u.classList.remove("used"),
          d.classList.remove("clean"),
          (L.dataset.snowScene = String(c)),
          (d.style.visibility = c === 0 ? "visible" : "hidden"),
          q());
        const r = () => {
          U === i &&
            (N(),
            t &&
              c === 1 &&
              (t.texImage2D(
                t.TEXTURE_2D,
                0,
                t.RGBA,
                t.RGBA,
                t.UNSIGNED_BYTE,
                e,
              ),
              t.uniform1f(x.ratio, e.naturalWidth / e.naturalHeight),
              t.uniform1f(x.scene, c),
              (y.style.visibility = "visible"),
              (m = requestAnimationFrame(O))));
        };
        return Promise.all([
          n,
          e
            .decode()
            .catch(() => {})
            .then(() => {
              (r(), cancelAnimationFrame(m), (m = 0), O(performance.now()));
            }),
        ]);
      },
    }
  );
}
