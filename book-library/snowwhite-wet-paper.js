(() => {
  const s = document.querySelector(".library-stage");
  if (!s) return;
  const T = matchMedia("(prefers-reduced-motion:reduce)"),
    S = matchMedia("(pointer:fine)"),
    o = document.createElement("canvas");
  ((o.className = "snowwhite-wet-paper"),
    o.setAttribute("aria-hidden", "true"));
  const e = o.getContext("webgl", {
    alpha: !0,
    premultipliedAlpha: !0,
    depth: !1,
    antialias: !1,
    powerPreference: "low-power",
  });
  if (!e) return;
  const B =
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    M = `precision highp float;varying vec2 uv;uniform vec2 size;uniform vec4 drops[12];uniform vec2 variants[12];uniform sampler2D paper,backdrop;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
  void main(){vec2 pt=vec2(uv.x,1.-uv.y)*size;float coverage=0.;
    for(int i=0;i<12;i++){vec4 d=drops[i];if(d.w<1.)continue;float age=d.z;float grow=1.-exp(-age*2.5);float retreat=smoothstep(1.35,3.15,age);
      vec2 q=(pt-d.xy)/d.w;float a=variants[i].x,c=cos(a),s=sin(a);q=mat2(c,-s,s,c)*q;q.x*=variants[i].y;
      vec2 tex=q+.5;if(tex.x<0.||tex.y<0.||tex.x>1.||tex.y>1.)continue;
      float density=1.-texture2D(paper,tex).r;
      float fibers=noise(pt*.07)*.025+noise(pt*.31)*.008;
      float edge=length(q)+(1.-density)*.08+fibers;
      float front=.055+grow*.64;
      float wetFront=1.-smoothstep(front-.025,front+.018,edge);
      float threshold=mix(.64,.045,grow)+retreat*.16;
      float pigment=smoothstep(threshold,threshold+.14,density);
      float stain=pigment*wetFront*pow(1.-retreat,1.35)*.91;
      coverage=1.-(1.-coverage)*(1.-stain);
    }
    float aspect=size.x/size.y;vec2 imageUv=(vec2(uv.x,1.-uv.y)-.5)*vec2(min(aspect/1.777,1.),min(1.777/aspect,1.))+.5;
    vec3 color=texture2D(backdrop,imageUv).rgb;gl_FragColor=vec4(color*coverage,coverage);
  }`;
  function b(t, n) {
    const r = e.createShader(t);
    if (
      (e.shaderSource(r, n),
      e.compileShader(r),
      !e.getShaderParameter(r, e.COMPILE_STATUS))
    )
      throw Error(e.getShaderInfoLog(r));
    return r;
  }
  let i;
  try {
    if (
      ((i = e.createProgram()),
      e.attachShader(i, b(e.VERTEX_SHADER, B)),
      e.attachShader(i, b(e.FRAGMENT_SHADER, M)),
      e.linkProgram(i),
      !e.getProgramParameter(i, e.LINK_STATUS))
    )
      throw Error(e.getProgramInfoLog(i));
  } catch (t) {
    console.warn("Wet ink unavailable", t);
    return;
  }
  (e.useProgram(i), e.disable(e.BLEND), e.clearColor(0, 0, 0, 0));
  const X = e.createBuffer();
  (e.bindBuffer(e.ARRAY_BUFFER, X),
    e.bufferData(
      e.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      e.STATIC_DRAW,
    ));
  const x = e.getAttribLocation(i, "p");
  (e.enableVertexAttribArray(x),
    e.vertexAttribPointer(x, 2, e.FLOAT, !1, 0, 0));
  let R = 0;
  function w(t, n) {
    const r = e.createTexture();
    (e.activeTexture(e.TEXTURE0 + t),
      e.bindTexture(e.TEXTURE_2D, r),
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
        new Uint8Array([255, 255, 255, 255]),
      ));
    const a = new Image();
    return (
      (a.onload = () => {
        (e.activeTexture(e.TEXTURE0 + t),
          e.bindTexture(e.TEXTURE_2D, r),
          e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, a),
          R++);
      }),
      (a.src = n),
      r
    );
  }
  (w(0, "assets/wet-ink-bloom-v1.webp"),
    w(1, "assets/hidden-snowwhite-v1.webp"));
  const f = Object.fromEntries(
    ["size", "paper", "backdrop", "drops[0]", "variants[0]"].map((t) => [
      t,
      e.getUniformLocation(i, t),
    ]),
  );
  (e.uniform1i(f.paper, 0), e.uniform1i(f.backdrop, 1), s.append(o));
  let u = 1,
    v = 1,
    c = 0,
    p = !0,
    h = !0,
    y = !1,
    d = null,
    A = 0,
    O = 0;
  const g = Array.from({ length: 12 }, () => ({
      x: 0,
      y: 0,
      born: -1e4,
      r: 0,
      a: 0,
      s: 1,
    })),
    _ = new Float32Array(48),
    U = new Float32Array(24);
  function E() {
    return (
      h &&
      p &&
      !document.hidden &&
      document.body.dataset.tale === "3" &&
      !document.body.classList.contains("opening") &&
      !document.body.classList.contains("reading") &&
      !T.matches &&
      S.matches
    );
  }
  function l() {
    (cancelAnimationFrame(c),
      (c = 0),
      (d = null),
      g.forEach((t) => (t.r = 0)),
      e.clear(e.COLOR_BUFFER_BIT));
  }
  function L() {
    l();
    const t = s.getBoundingClientRect();
    ((u = t.width), (v = t.height));
    const n = Math.min(devicePixelRatio || 1, 1.5, 1920 / u);
    ((o.width = Math.round(u * n)),
      (o.height = Math.round(v * n)),
      e.viewport(0, 0, o.width, o.height),
      e.uniform2f(f.size, u, v));
  }
  function D(t) {
    if (((c = 0), !E())) {
      l();
      return;
    }
    let n = !1;
    for (let r = 0; r < 12; r++) {
      const a = g[r],
        m = (t - a.born) / 1e3;
      (m > 3.2 ? (a.r = 0) : a.r && (n = !0),
        _.set([a.x, a.y, m, a.r], r * 4),
        U.set([a.a, a.s], r * 2));
    }
    (e.uniform4fv(f["drops[0]"], _),
      e.uniform2fv(f["variants[0]"], U),
      e.clear(e.COLOR_BUFFER_BIT),
      e.drawArrays(e.TRIANGLES, 0, 6),
      n && (c = requestAnimationFrame(D)));
  }
  (s.addEventListener(
    "pointermove",
    (t) => {
      if (t.pointerType !== "mouse" || !E() || R < 2) return;
      const n = s.getBoundingClientRect(),
        r = performance.now(),
        a = { x: t.clientX - n.left, y: t.clientY - n.top },
        m = d ? Math.hypot(a.x - d.x, a.y - d.y) : 100;
      r - A > 65 &&
        m > 28 &&
        (Object.assign(g[O++ % 12], a, {
          born: r,
          r: Math.min(u * 0.16, 190) * (1 + Math.random() * 0.18),
          a: Math.random() * 6.28,
          s: 0.85 + Math.random() * 0.3,
        }),
        (d = a),
        (A = r),
        c || (c = requestAnimationFrame(D)));
    },
    { passive: !0 },
  ),
    s.addEventListener("pointerleave", () => (d = null)));
  const F = new MutationObserver(() => {
    const t = document.body.dataset.tale === "3";
    ((t !== y || ((c || d) && !E())) && l(),
      (y = t),
      (o.style.display = t ? "" : "none"));
  });
  F.observe(document.body, {
    attributes: !0,
    attributeFilter: ["data-tale", "class"],
  });
  const I = new IntersectionObserver((t) => {
    ((p = t[0].isIntersecting), p || l());
  });
  I.observe(s);
  const P = new ResizeObserver(L);
  (P.observe(s),
    document.addEventListener("visibilitychange", () => {
      document.hidden && l();
    }),
    T.addEventListener("change", l),
    L(),
    o.addEventListener("webglcontextlost", (t) => {
      (t.preventDefault(),
        (h = !1),
        cancelAnimationFrame(c),
        (o.style.display = "none"));
    }),
    addEventListener("pagehide", () => {
      (l(), (h = !1), F.disconnect(), I.disconnect(), P.disconnect());
    }));
})();
