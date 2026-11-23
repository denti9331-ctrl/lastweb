(() => {
  const entryScript = document.currentScript.src,
    entryIcons = new URL("../assets/tale-loading-icons.svg?v=2", entryScript)
      .href;
  const U = matchMedia("(prefers-reduced-motion:reduce)"),
    m = document.createElement("div");
  ((m.className = "tale-entry-finish"), m.setAttribute("aria-hidden", "true"));
  const h = document.createElement("canvas"),
    u = document.createElement("canvas");
  ((h.className = "cinderella-entry-dust"),
    (u.className = "snowwhite-entry-ink"));
  const y = document.createElement("div");
  ((y.className = "tale-entry-finish-line"),
    (y.innerHTML =
      '<svg class="tale-entry-icon" focusable="false" aria-hidden="true"><use href="' +
      entryIcons +
      '#shoe"></use></svg><span></span>'),
    m.append(h, u, y),
    document.body.append(m));
  const t = h.getContext("2d");
  let e = null,
    i = null,
    A = null,
    p = null;
  const E = new Image();
  E.src = new URL("assets/wet-ink-bloom-v1.webp", entryScript).href;
  function D() {
    if (
      e ||
      ((e = u.getContext("webgl", {
        alpha: !0,
        premultipliedAlpha: !0,
        antialias: !1,
        depth: !1,
        powerPreference: "low-power",
      })),
      !e)
    )
      return;
    const s =
        "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
      a = `precision highp float;varying vec2 uv;uniform sampler2D paper;uniform vec2 size,origin;uniform float t;
    void main(){vec2 pt=vec2(uv.x,1.-uv.y)*size;float progress=clamp(t/1.65,0.,1.);float spread=progress*progress*(3.-2.*progress);float reach=length(size)*2.7;float radius=8.+spread*reach;
      vec2 q=(pt-origin)/radius+.5;float density=1.-texture2D(paper,clamp(q,0.,1.)).r;
      float inside=step(0.,q.x)*step(q.x,1.)*step(0.,q.y)*step(q.y,1.);
      float edge=smoothstep(.055,.29,density)*inside;
      float fill=smoothstep(1.25,1.7,t);float alpha=mix(edge,1.,fill);
      vec3 color=mix(vec3(.045,.035,.046),vec3(.016,.017,.022),spread);gl_FragColor=vec4(color*alpha,alpha);}`;
    function l(c, b) {
      const f = e.createShader(c);
      if (
        (e.shaderSource(f, b),
        e.compileShader(f),
        !e.getShaderParameter(f, e.COMPILE_STATUS))
      )
        throw Error(e.getShaderInfoLog(f));
      return f;
    }
    try {
      if (
        ((i = e.createProgram()),
        e.attachShader(i, l(e.VERTEX_SHADER, s)),
        e.attachShader(i, l(e.FRAGMENT_SHADER, a)),
        e.linkProgram(i),
        !e.getProgramParameter(i, e.LINK_STATUS))
      )
        throw Error(e.getProgramInfoLog(i));
    } catch (c) {
      (console.warn("Entry ink unavailable", c), (e = null));
      return;
    }
    (e.useProgram(i), e.disable(e.BLEND), e.clearColor(0, 0, 0, 0));
    const _ = e.createBuffer();
    (e.bindBuffer(e.ARRAY_BUFFER, _),
      e.bufferData(
        e.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        e.STATIC_DRAW,
      ));
    const r = e.getAttribLocation(i, "p");
    (e.enableVertexAttribArray(r),
      e.vertexAttribPointer(r, 2, e.FLOAT, !1, 0, 0),
      (A = e.createTexture()),
      e.bindTexture(e.TEXTURE_2D, A),
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
        new Uint8Array([0, 0, 0, 255]),
      ));
    function n() {
      (e.bindTexture(e.TEXTURE_2D, A),
        e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, E));
    }
    (E.complete && E.naturalWidth
      ? n()
      : E.addEventListener("load", n, { once: !0 }),
      (p = Object.fromEntries(
        ["size", "origin", "t", "paper"].map((c) => [
          c,
          e.getUniformLocation(i, c),
        ]),
      )),
      e.uniform1i(p.paper, 0));
  }
  let g = 0,
    w = 0,
    T = -1,
    o = 1,
    d = 1,
    v = { x: 0, y: 0 },
    x = null,
    M = [];
  document.addEventListener(
    "pointerdown",
    (s) => {
      x = { x: s.clientX, y: s.clientY };
    },
    { passive: !0 },
  );
  function R() {
    (cancelAnimationFrame(g),
      (g = 0),
      m.classList.remove("is-active"),
      t.clearRect(0, 0, o, d),
      e && e.clear(e.COLOR_BUFFER_BIT));
  }
  function L(s) {
    const a = (s - w) / 1e3;
    if (
      a > 2.3 ||
      document.hidden ||
      !document.body.classList.contains("opening")
    ) {
      R();
      return;
    }
    if (T === 3 && e)
      (e.uniform1f(p.t, a),
        e.clear(e.COLOR_BUFFER_BIT),
        e.drawArrays(e.TRIANGLES, 0, 6));
    else {
      t.clearRect(0, 0, o, d);
      const l = Math.max(0, Math.min(1, (a - 0.1) / 1.55)),
        _ = l * l * (3 - 2 * l);
      if (((t.fillStyle = `rgba(5,4,9,${_})`), t.fillRect(0, 0, o, d), T === 0))
        for (const r of M) {
          const n = Math.max(0, a - r.delay),
            c = Math.min(1, n * 8) * Math.pow(Math.max(0, 1 - n / 1.5), 1.5);
          if (!c) continue;
          const b = v.x + r.x + r.vx * n,
            f = v.y + r.y + r.vy * n + n * n * 32;
          ((t.globalAlpha = c),
            (t.fillStyle = r.warm ? "#f3e9ff" : "#c9b5ee"),
            (t.shadowColor = "#b09adc"),
            (t.shadowBlur = r.r > 1.5 ? 9 : 3),
            t.beginPath(),
            t.arc(b, f, r.r * (1 - n * 0.35), 0, Math.PI * 2),
            t.fill());
        }
      ((t.globalAlpha = 1), (t.shadowBlur = 0));
    }
    g = requestAnimationFrame(L);
  }
  document.addEventListener("fairytale:book-open", (s) => {
    if (
      ![0, 3].includes(s.detail.index) ||
      (R(), (T = s.detail.index), U.matches)
    )
      return;
    ((o = innerWidth),
      (d = innerHeight),
      (v = x || { x: o * 0.5, y: d * 0.48 }),
      (x = null));
    const a = Math.min(devicePixelRatio || 1, 1.5);
    if (
      ((h.width = Math.round(o * a)),
      (h.height = Math.round(d * a)),
      t.setTransform(a, 0, 0, a, 0, 0),
      T === 3 && (D(), e))
    ) {
      const l = Math.min(1.25, 1440 / o);
      ((u.width = Math.round(o * l)),
        (u.height = Math.round(d * l)),
        e.viewport(0, 0, u.width, u.height),
        e.uniform2f(p.size, o, d),
        e.uniform2f(p.origin, v.x, v.y));
    }
    ((m.dataset.kind = String(T)),
      y
        .querySelector("use")
        .setAttribute("href", entryIcons + "#" + (T === 3 ? "apple" : "shoe")),
      m.classList.add("is-active"),
      (M = Array.from({ length: 100 }, () => ({
        x: (Math.random() - 0.5) * 190,
        y: (Math.random() - 0.5) * 250,
        vx: (Math.random() - 0.5) * 90,
        vy: -20 - Math.random() * 75,
        r: 0.6 + Math.random() * 2,
        delay: Math.random() * 0.22,
        warm: Math.random() > 0.5,
      }))),
      (w = performance.now()),
      (g = requestAnimationFrame(L)));
  });
  const P = new MutationObserver(() => {
    g && !document.body.classList.contains("opening") && R();
  });
  (P.observe(document.body, { attributes: !0, attributeFilter: ["class"] }),
    document.addEventListener("visibilitychange", () => {
      document.hidden && R();
    }),
    addEventListener("pagehide", () => {
      (R(), P.disconnect());
    }));
})();
