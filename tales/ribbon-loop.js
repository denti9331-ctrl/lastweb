export function createRibbonLoop(R) {
  const r = document.createElement("canvas");
  r.className = "drama-ribbon";
  const e = r.getContext("webgl", {
    alpha: !0,
    premultipliedAlpha: !1,
    antialias: !1,
    depth: !1,
    powerPreference: "low-power",
  });
  if (!e) return { tighten() {}, reset() {} };
  R.replaceWith(r);
  const l = (t, o) => {
      const m = e.createShader(t);
      return (e.shaderSource(m, o), e.compileShader(m), m);
    },
    a = e.createProgram();
  (e.attachShader(
    a,
    l(
      e.VERTEX_SHADER,
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    ),
  ),
    e.attachShader(
      a,
      l(
        e.FRAGMENT_SHADER,
        "precision mediump float;varying vec2 uv;uniform sampler2D art;uniform vec2 size;uniform float amount;void main(){vec2 q=vec2(uv.x,1.-uv.y),crop=vec2(min((size.x/size.y)/1.776833,1.),min(1.776833/(size.x/size.y),1.));q=(q-.5)*crop/1.04+.5;vec2 delta=q-vec2(.605,.765);float falloff=exp(-pow(length(delta/vec2(.065,.07)),4.)*2.);vec2 src=q+delta*amount*.11*falloff;gl_FragColor=texture2D(art,src);}",
      ),
    ),
    e.linkProgram(a),
    e.useProgram(a));
  const T = e.createBuffer();
  (e.bindBuffer(e.ARRAY_BUFFER, T),
    e.bufferData(
      e.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      e.STATIC_DRAW,
    ));
  const f = e.getAttribLocation(a, "p");
  (e.enableVertexAttribArray(f),
    e.vertexAttribPointer(f, 2, e.FLOAT, !1, 0, 0));
  const h = e.createTexture();
  e.bindTexture(e.TEXTURE_2D, h);
  for (const t of [e.TEXTURE_MIN_FILTER, e.TEXTURE_MAG_FILTER])
    e.texParameteri(e.TEXTURE_2D, t, e.LINEAR);
  for (const t of [e.TEXTURE_WRAP_S, e.TEXTURE_WRAP_T])
    e.texParameteri(e.TEXTURE_2D, t, e.CLAMP_TO_EDGE);
  const p = e.getUniformLocation(a, "size"),
    v = e.getUniformLocation(a, "amount");
  let u = !1,
    c = 0,
    n = 0,
    E = 0;
  function i() {
    u && (e.uniform1f(v, c), e.drawArrays(e.TRIANGLES, 0, 6));
  }
  function d() {
    const t = Math.min(devicePixelRatio, 1.25);
    ((r.width = innerWidth * t),
      (r.height = innerHeight * t),
      e.viewport(0, 0, r.width, r.height),
      e.uniform2f(p, innerWidth, innerHeight),
      i());
  }
  (d(), addEventListener("resize", d));
  const s = new Image();
  ((s.onload = () => {
    (e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, s),
      (u = !0),
      i());
  }),
    (s.src = "../snowwhite/assets/layers/ribbon.webp"));
  function A(t) {
    const o = Math.min(1, (t - E) / 2400);
    ((c = (1 - Math.pow(1 - o, 3)) * 0.8),
      i(),
      (n = o < 1 ? requestAnimationFrame(A) : 0));
  }
  return {
    tighten() {
      (cancelAnimationFrame(n),
        (E = performance.now()),
        (n = requestAnimationFrame(A)));
    },
    reset() {
      (cancelAnimationFrame(n), (n = 0), (c = 0), i());
    },
  };
}
