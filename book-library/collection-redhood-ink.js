(() => {
  const c = document.querySelector(".library-stage"),
    w = document.querySelector("#tale-title");
  if (!c || !w) return;
  const l = document.createElement("canvas"),
    e = l.getContext("webgl", {
      alpha: !0,
      premultipliedAlpha: !0,
      antialias: !1,
      depth: !1,
      powerPreference: "low-power",
    });
  if (!e) return;
  (l.addEventListener("webglcontextlost", () => {
    (document.body.classList.remove("collection-fluid-ready"),
      (l.style.display = "none"));
  }),
    (l.className = "collection-fluid-canvas"),
    l.setAttribute("aria-hidden", "true"));
  const q =
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    C = `precision mediump float;
varying vec2 uv;uniform vec2 size;uniform float time,mode;uniform vec4 drops[16];uniform vec2 dirs[16];uniform sampler2D wolf;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float ripple(vec2 p){return sin(p.x*2.7+sin(p.y*3.1))*sin(p.y*2.3+cos(p.x*2.1));}
float fbm(vec2 p){float n=0.;n+=noise(p)*.57;p=p*2.03+7.;n+=noise(p)*.28;p=p*2.01+3.;n+=noise(p)*.15;return n;}
void main(){vec2 pt=vec2(uv.x,1.-uv.y)*size;vec2 warp=vec2(fbm(pt*.014),fbm(pt*.014+31.))-.5;float grain=fbm(pt*.075);float field=0.;float halo=0.;
for(int i=0;i<16;i++){vec4 d=drops[i];if(d.w<.1)continue;float age=d.z;vec2 q=pt-d.xy;float life=1.-smoothstep(mode>.5?2.1:.65,mode>.5?3.8:2.2,age);
if(mode>.5){float grow=1.-exp(-age*2.2);q.x+=age*23.;q+=warp*(16.+grow*14.);vec2 radii=vec2(38.+grow*103.,19.+grow*42.)*(d.w/80.);float edge=length(q/radii)+(grain-.5)*.32+(noise(pt*.8)-.5)*.045;field+=(1.-smoothstep(.69,1.02,edge))*life;halo+=(1.-smoothstep(.92,1.36,edge))*life*.19;}
else{vec2 v=dirs[i];float n=ripple(pt/95.+time*.12);q-=vec2(cos(v.x),sin(v.x))*age*40.;q+=vec2(n,ripple(pt.yx/120.-time*.16))*58.;float c=cos(v.x),s=sin(v.x);q=mat2(c,-s,s,c)*q;float radius=d.w*(.48+age*.95);q/=vec2(radius*(1.3+v.y),radius*(.35+age*.3));float rip=1.+ripple(q*2.+float(i))*.52;field+=exp(-dot(q,q)*rip*2.)*max(0.,1.-age*.38);}}
float aspect=size.x/size.y;vec2 sceneUv=(vec2(uv.x,1.-uv.y)-.5)*vec2(min(aspect/1.777,1.),min(1.777/aspect,1.))+.5;vec3 hidden=texture2D(wolf,sceneUv).rgb;
if(mode>.5){float core=1.-exp(-field*1.8);float wet=clamp(halo,0.,.32);float alpha=clamp(core*.78+wet*(1.-core),0.,.84);alpha*=.94+grain*.06;gl_FragColor=vec4(hidden*alpha,alpha);}
else{float ink=smoothstep(.28,.52,field+ripple(pt/95.+time*.12)*.09);float alpha=ink*.96;gl_FragColor=vec4(hidden*alpha,alpha);}}`;
  function _(t, a) {
    const r = e.createShader(t);
    if (
      (e.shaderSource(r, a),
      e.compileShader(r),
      !e.getShaderParameter(r, e.COMPILE_STATUS))
    )
      throw Error(e.getShaderInfoLog(r));
    return r;
  }
  let d;
  try {
    if (
      ((d = e.createProgram()),
      e.attachShader(d, _(e.VERTEX_SHADER, q)),
      e.attachShader(d, _(e.FRAGMENT_SHADER, C)),
      e.linkProgram(d),
      !e.getProgramParameter(d, e.LINK_STATUS))
    )
      return;
  } catch (t) {
    console.warn("Hero fluid unavailable", t);
    return;
  }
  (e.useProgram(d), e.disable(e.BLEND), e.clearColor(0, 0, 0, 0));
  const G = e.createBuffer();
  (e.bindBuffer(e.ARRAY_BUFFER, G),
    e.bufferData(
      e.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      e.STATIC_DRAW,
    ));
  const S = e.getAttribLocation(d, "p");
  (e.enableVertexAttribArray(S),
    e.vertexAttribPointer(S, 2, e.FLOAT, !1, 0, 0));
  const u = Object.fromEntries(
    [
      "size",
      "time",
      "mode",
      "breath",
      "drift",
      "reveal",
      "drops[0]",
      "dirs[0]",
    ].map((t) => [t, e.getUniformLocation(d, t)]),
  );
  function U(t) {
    const a = e.createTexture();
    return (
      e.activeTexture(e.TEXTURE0 + t),
      e.bindTexture(e.TEXTURE_2D, a),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
      e.texImage2D(
        e.TEXTURE_2D,
        0,
        e.RGBA,
        1,
        1,
        0,
        e.RGBA,
        e.UNSIGNED_BYTE,
        new Uint8Array(4),
      ),
      a
    );
  }
  const N = U(0),
    O = U(1);
  (e.uniform1i(e.getUniformLocation(d, "lettering"), 0),
    e.uniform1i(e.getUniformLocation(d, "wolf"), 1));
  const D = {};
  let L = null;
  function B() {
    const t = document.body.dataset.tale;
    if (!["1", "3"].includes(t) || t === L) return;
    L = t;
    let a = D[t];
    function r() {
      document.body.dataset.tale === t &&
        (e.activeTexture(e.TEXTURE1),
        e.bindTexture(e.TEXTURE_2D, O),
        e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, a));
    }
    a
      ? a.complete && r()
      : ((a = D[t] = new Image()),
        (a.onload = r),
        (a.src =
          t === "1"
            ? "assets/hidden-redhood-v1.webp"
            : "assets/hidden-snowwhite-v1.webp"));
  }
  B();
  const x = document.createElement("canvas"),
    f = x.getContext("2d");
  let m = 1,
    T = 1,
    p,
    h = !0;
  function z() {
    ((p = c.getBoundingClientRect()), (m = p.width), (T = p.height));
    const t = Math.min(devicePixelRatio || 1, 1.25, 1440 / m);
    ((l.width = Math.round(m * t)),
      (l.height = Math.round(T * t)),
      e.viewport(0, 0, l.width, l.height),
      (x.width = Math.round(m * t)),
      (x.height = Math.round(T * t)),
      f.setTransform(t, 0, 0, t, 0, 0),
      f.clearRect(0, 0, m, T),
      (f.textAlign = "center"),
      (f.textBaseline = "alphabetic"));
    for (const a of w.querySelectorAll("span")) {
      const r = a.getBoundingClientRect(),
        o = getComputedStyle(a);
      ((f.font = `${o.fontStyle} ${o.fontWeight} ${o.fontSize} ${o.fontFamily}`),
        (f.letterSpacing = o.letterSpacing),
        (f.fillStyle = "#f2eee5"));
      const i = f.measureText(a.textContent),
        E = i.actualBoundingBoxAscent,
        A = i.actualBoundingBoxDescent;
      f.fillText(
        a.textContent,
        r.left - p.left + r.width / 2,
        r.top - p.top + (r.height + E - A) / 2,
      );
    }
    (e.activeTexture(e.TEXTURE0),
      e.bindTexture(e.TEXTURE_2D, N),
      e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, x),
      e.uniform2f(u.size, m, T),
      (h = !1));
  }
  (c.append(l), document.body.classList.add("collection-fluid-ready"));
  let F = performance.now(),
    s = 0,
    y = !0,
    v = null,
    n = null,
    M = 0,
    k = 0;
  const Y = performance.now(),
    b = matchMedia("(prefers-reduced-motion: reduce)"),
    $ = matchMedia("(pointer: coarse)"),
    R = Array.from({ length: 16 }, () => ({
      x: -5e3,
      y: -5e3,
      born: -1e4,
      r: 1,
      a: 0,
      s: 0,
    })),
    P = new Float32Array(64),
    I = new Float32Array(32);
  let W = 0;
  function X(t) {
    if (((s = 0), !y || document.hidden || document.body.dataset.tale !== "1"))
      return;
    h && z();
    const a = (t - Y) / 1e3,
      r = b.matches ? 0 : Math.sin(a * 0.95);
    if (
      (c.style.setProperty("--hero-float-y", `${r * -12}px`),
      c.style.setProperty("--hero-float-angle", `${r * 0.65}deg`),
      c.style.setProperty(
        "--hero-letter-breath",
        String(0.28 + (r + 1) * 0.22),
      ),
      n && t - M > 24 && !$.matches && !b.matches)
    ) {
      const o = v || n,
        i = n.x - o.x,
        E = n.y - o.y,
        A = Math.hypot(i, E);
      if (!v || A > 3) {
        const H = R[W++ % 16];
        (Object.assign(H, {
          x: n.x,
          y: n.y,
          born: t,
          r: document.body.dataset.tale === "3" ? 80 : Math.min(m * 0.12, 120),
          a: Math.atan2(E, i),
          s: Math.min(A / 90, 1.6),
        }),
          (v = n),
          (M = t));
      }
      n = null;
    }
    for (let o = 0; o < 16; o++) {
      const i = R[o],
        E = (t - i.born) / 1e3;
      (P.set(
        [
          i.x,
          i.y,
          Math.min(E, 4),
          E > (document.body.dataset.tale === "3" ? 3.8 : 2.55) ? 0.01 : i.r,
        ],
        o * 4,
      ),
        I.set([i.a, i.s], o * 2));
    }
    (e.uniform4fv(u["drops[0]"], P),
      e.uniform2fv(u["dirs[0]"], I),
      e.uniform1f(u.time, a),
      e.uniform1f(u.mode, document.body.dataset.tale === "3" ? 1 : 0),
      e.uniform1f(u.breath, 1),
      e.uniform1f(u.drift, b.matches ? 0 : r * 4),
      e.uniform1f(u.reveal, b.matches ? 1 : Math.min(1, (t - F) / 1400)),
      e.clear(e.COLOR_BUFFER_BIT),
      e.drawArrays(e.TRIANGLES, 0, 6),
      (k = t),
      (s = requestAnimationFrame(X)));
  }
  function g() {
    !s && y && !document.hidden && (s = requestAnimationFrame(X));
  }
  (new MutationObserver(() => {
    ((h = !0), g());
  }).observe(w, { childList: !0, subtree: !0, characterData: !0 }),
    new MutationObserver(() => {
      const t = document.body.dataset.tale === "1";
      (B(),
        (v = n = null),
        R.forEach((a) => (a.born = -1e4)),
        (l.style.display = t ? "" : "none"),
        t
          ? ((F = performance.now()), (h = !0), g())
          : (cancelAnimationFrame(s),
            (s = 0),
            (v = n = null),
            R.forEach((a) => (a.born = -1e4))));
    }).observe(document.body, {
      attributes: !0,
      attributeFilter: ["data-tale"],
    }),
    c.addEventListener("pointermove", (t) => {
      t.pointerType === "mouse" &&
        (n = { x: t.clientX - p.left, y: t.clientY - p.top });
    }),
    c.addEventListener("pointerleave", () => {
      n = v = null;
    }),
    new ResizeObserver(() => {
      ((h = !0), g());
    }).observe(c),
    new IntersectionObserver(
      (t) => {
        ((y = t[0].isIntersecting),
          y ? ((h = !0), g()) : (cancelAnimationFrame(s), (s = 0), (v = null)));
      },
      { threshold: 0 },
    ).observe(c),
    document.addEventListener("visibilitychange", () => {
      document.hidden ? (cancelAnimationFrame(s), (s = 0)) : g();
    }),
    document.fonts.ready.then(() => {
      ((h = !0), g());
    }),
    addEventListener("pagehide", () => cancelAnimationFrame(s)),
    g());
})();
