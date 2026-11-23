import { createRedBookShadow as S } from "./red-book-shadow.js";
import { createSnowScenes as L } from "./snow-scenes.js?v=2";
export function createHover(m, A) {
  const e = document.querySelector("#hover-canvas"),
    g = matchMedia("(prefers-reduced-motion:reduce)"),
    f = document.createElement("div");
  if (
    ((f.className = "cursor-dot"),
    document.body.append(f),
    addEventListener(
      "pointermove",
      (r) => {
        r.pointerType === "mouse" &&
          (f.classList.add("visible"),
          (f.style.left = r.clientX + "px"),
          (f.style.top = r.clientY + "px"));
      },
      { passive: !0 },
    ),
    document.documentElement.addEventListener("pointerleave", () =>
      f.classList.remove("visible"),
    ),
    m === "ink")
  )
    return L(A, e);
  if (m === "water") return U(e, g);
  if (m === "ember") return S(e, g, A);
  const i = e.getContext("2d"),
    o = [];
  let v = 0,
    h,
    d,
    l = 0;
  function E() {
    ((h = innerWidth), (d = innerHeight));
    const r = Math.min(devicePixelRatio, 1.5);
    ((e.width = h * r), (e.height = d * r), i.setTransform(r, 0, 0, r, 0, 0));
  }
  (E(), addEventListener("resize", E));
  function b(r) {
    ((v = 0), i.clearRect(0, 0, h, d));
    for (let s = o.length - 1; s >= 0; s--) {
      const n = o[s],
        u = (r - n.born) / 1e3;
      if (u > 1.6) {
        o.splice(s, 1);
        continue;
      }
      ((i.globalAlpha = Math.sin(Math.min(1, u / 1.6) * Math.PI) * 0.5),
        (i.fillStyle = n.color),
        i.save(),
        i.translate(n.x + Math.sin(u * 2 + n.spin) * 7, n.y + u * 40),
        i.rotate(n.spin + u),
        i.fillRect(-n.r / 2, -n.r / 2, n.r, n.r * 0.7),
        i.restore());
    }
    ((i.globalAlpha = 1), o.length && (v = requestAnimationFrame(b)));
  }
  return (
    addEventListener(
      "pointermove",
      (r) => {
        if (
          !(
            r.pointerType !== "mouse" ||
            g.matches ||
            performance.now() - l < 30
          )
        ) {
          l = performance.now();
          for (let s = 0; s < 2; s++)
            o.push({
              x: r.clientX + (Math.random() - 0.5) * 18,
              y: r.clientY,
              born: l,
              r: 1 + Math.random() * 2,
              spin: Math.random() * 6,
              color: s ? "#d1c2b8" : "#a99eac",
            });
          (o.length > 65 && o.splice(0, o.length - 65),
            v || (v = requestAnimationFrame(b)));
        }
      },
      { passive: !0 },
    ),
    {
      setImage() {},
      clear() {
        ((o.length = 0), i.clearRect(0, 0, h, d));
      },
    }
  );
}
function U(m, A) {
  const e = m.getContext("webgl", {
    alpha: !0,
    premultipliedAlpha: !0,
    depth: !1,
    antialias: !1,
    powerPreference: "low-power",
  });
  if (!e) return { setImage() {} };
  const g =
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    f =
      "precision highp float;varying vec2 uv;uniform sampler2D picture;uniform vec2 size;uniform float ratio,time,chapter;uniform vec4 drops[6];void main(){vec2 pt=vec2(uv.x,1.-uv.y),offset=vec2(0.);float alpha=0.;for(int i=0;i<6;i++){vec4 d=drops[i];if(d.w<.5)continue;vec2 q=(pt*size-d.xy)/vec2(82.,58.);float wobble=sin(q.y*3.+time)*.12+sin(q.x*4.-time)*.08;float field=exp(-max(0.,dot(q,q)+wobble)*2.2);float fade=smoothstep(0.,.2,d.z)*(1.-smoothstep(.65,2.3,d.z));float strength=field*fade;offset+=vec2(sin(q.y*6.+time*2.4),cos(q.x*4.-time*1.8))*.0023*strength;alpha=max(alpha,strength*.88);}float aspect=size.x/size.y;vec2 crop=vec2(min(aspect/ratio,1.),min(ratio/aspect,1.));vec2 base=(pt-.5)*crop/1.04+.5;float protection=0.;if(chapter<.5){protection=1.-smoothstep(.35,.44,base.x);protection*=smoothstep(.12,.25,base.y);}else if(chapter<1.5){protection=1.-smoothstep(.85,1.05,length((base-vec2(.53,.55))/vec2(.34,.43)));}else if(chapter<2.5){protection=max(1.-smoothstep(.35,.44,base.x),smoothstep(.67,.75,base.x));protection=max(protection,1.-smoothstep(.8,1.1,length((base-vec2(.533,.4))/vec2(.06,.1))));}else if(chapter<3.5){protection=max(1.-smoothstep(.33,.42,base.x),smoothstep(.68,.77,base.x));}else if(chapter<4.5){protection=smoothstep(.48,.6,base.x);protection=max(protection,(1.-smoothstep(.26,.35,base.x))*smoothstep(.4,.55,base.y));}else{protection=1.-smoothstep(.8,1.1,length((base-vec2(.75,.46))/vec2(.24,.32)));}float waterArea=1.;if(chapter>2.5&&chapter<3.5){waterArea=0.;}else if(chapter>.5&&chapter<1.5){waterArea=smoothstep(.48,.64,base.y);}else if(chapter>3.5&&chapter<4.5){waterArea=(1.-smoothstep(.29,.39,base.x))*smoothstep(.22,.36,base.y);}else if(chapter>4.5){waterArea=smoothstep(.67,.82,base.y);}alpha*=(1.-protection)*waterArea;vec2 sampleUv=base+offset*crop/1.04*(1.-protection);vec3 color=texture2D(picture,sampleUv).rgb;gl_FragColor=vec4(color*alpha,alpha);}";
  function i(t, c) {
    const p = e.createShader(t);
    if (
      (e.shaderSource(p, c),
      e.compileShader(p),
      !e.getShaderParameter(p, e.COMPILE_STATUS))
    )
      throw Error(e.getShaderInfoLog(p));
    return p;
  }
  const o = e.createProgram();
  if (
    (e.attachShader(o, i(e.VERTEX_SHADER, g)),
    e.attachShader(o, i(e.FRAGMENT_SHADER, f)),
    e.linkProgram(o),
    !e.getProgramParameter(o, e.LINK_STATUS))
  )
    return { setImage() {} };
  e.useProgram(o);
  const v = e.createBuffer();
  (e.bindBuffer(e.ARRAY_BUFFER, v),
    e.bufferData(
      e.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      e.STATIC_DRAW,
    ));
  const h = e.getAttribLocation(o, "p");
  (e.enableVertexAttribArray(h),
    e.vertexAttribPointer(h, 2, e.FLOAT, !1, 0, 0));
  const d = e.createTexture();
  e.bindTexture(e.TEXTURE_2D, d);
  for (const t of [e.TEXTURE_MIN_FILTER, e.TEXTURE_MAG_FILTER])
    e.texParameteri(e.TEXTURE_2D, t, e.LINEAR);
  for (const t of [e.TEXTURE_WRAP_S, e.TEXTURE_WRAP_T])
    e.texParameteri(e.TEXTURE_2D, t, e.CLAMP_TO_EDGE);
  e.texImage2D(
    e.TEXTURE_2D,
    0,
    e.RGBA,
    1,
    1,
    0,
    e.RGBA,
    e.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );
  const l = Object.fromEntries(
    ["picture", "size", "ratio", "time", "chapter", "drops[0]"].map((t) => [
      t,
      e.getUniformLocation(o, t),
    ]),
  );
  e.uniform1i(l.picture, 0);
  const E = Array.from({ length: 6 }, () => ({ x: 0, y: 0, born: 0, on: 0 })),
    b = new Float32Array(24);
  let r = 0,
    s = 1,
    n = 1,
    u = 0,
    R = 0,
    x = !1,
    w = 0;
  function y() {
    ((s = innerWidth), (n = innerHeight));
    const t = Math.min(devicePixelRatio, 1.5);
    ((m.width = s * t),
      (m.height = n * t),
      e.viewport(0, 0, m.width, m.height),
      e.uniform2f(l.size, s, n));
  }
  (y(), addEventListener("resize", y));
  function _(t) {
    r = 0;
    let c = !1;
    for (let p = 0; p < 6; p++) {
      const a = E[p],
        T = (t - a.born) / 1e3;
      (T > 2.3 && (a.on = 0),
        a.on && (c = !0),
        b.set([a.x, a.y, T, a.on], p * 4));
    }
    (e.uniform4fv(l["drops[0]"], b),
      e.uniform1f(l.time, t / 1e3),
      e.clear(e.COLOR_BUFFER_BIT),
      e.drawArrays(e.TRIANGLES, 0, 6),
      c && !document.hidden && (r = requestAnimationFrame(_)));
  }
  return (
    addEventListener(
      "pointermove",
      (t) => {
        const c = performance.now();
        !x ||
          A.matches ||
          t.pointerType !== "mouse" ||
          c - R < 65 ||
          ((R = c),
          Object.assign(E[u++ % 6], {
            x: t.clientX,
            y: t.clientY,
            born: c,
            on: 1,
          }),
          r || (r = requestAnimationFrame(_)));
      },
      { passive: !0 },
    ),
    {
      setImage(t, c = 0) {
        const p = ++w;
        ((x = !1), e.uniform1f(l.chapter, c));
        if (!t) return;
        const a = t,
          T = () => {
            p !== w ||
              !a.naturalWidth ||
              (e.bindTexture(e.TEXTURE_2D, d),
              e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, a),
              e.uniform1f(l.ratio, a.naturalWidth / a.naturalHeight),
              (x = !0));
          };
        a.complete && a.naturalWidth
          ? T()
          : a.addEventListener("load", T, { once: !0 });
      },
      clear() {
        (E.forEach((t) => (t.on = 0)), e.clear(e.COLOR_BUFFER_BIT));
      },
    }
  );
}
