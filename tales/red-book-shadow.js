export function createRedBookShadow(a, b, g) {
  const e = a.getContext("webgl", {
    alpha: !0,
    premultipliedAlpha: !0,
    antialias: !1,
    depth: !1,
    powerPreference: "low-power",
  });
  if (!e) return ((a.hidden = !0), { clear() {}, setImage() {} });
  a.hidden = !1;
  const U =
      "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}",
    F = `precision mediump float;
varying vec2 uv;uniform vec2 size;uniform float time,mode;uniform vec4 drops[8];uniform vec2 dirs[8];uniform sampler2D wolf;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float ripple(vec2 p){return sin(p.x*2.7+sin(p.y*3.1))*sin(p.y*2.3+cos(p.x*2.1));}
float fbm(vec2 p){float n=0.;n+=noise(p)*.57;p=p*2.03+7.;n+=noise(p)*.28;p=p*2.01+3.;n+=noise(p)*.15;return n;}
void main(){vec2 pt=vec2(uv.x,1.-uv.y)*size;vec2 warp=vec2(fbm(pt*.014),fbm(pt*.014+31.))-.5;float grain=fbm(pt*.075);float field=0.;float halo=0.;
for(int i=0;i<8;i++){vec4 d=drops[i];if(d.w<.1)continue;float age=d.z;vec2 q=pt-d.xy;float life=1.-smoothstep(mode>.5?2.1:.65,mode>.5?3.8:2.2,age);
if(mode>.5){float grow=1.-exp(-age*2.2);q.x+=age*23.;q+=warp*(16.+grow*14.);vec2 radii=vec2(38.+grow*103.,19.+grow*42.)*(d.w/80.);float edge=length(q/radii)+(grain-.5)*.32+(noise(pt*.8)-.5)*.045;field+=(1.-smoothstep(.69,1.02,edge))*life;halo+=(1.-smoothstep(.92,1.36,edge))*life*.19;}
else{vec2 v=dirs[i];float n=ripple(pt/95.+time*.12);q-=vec2(cos(v.x),sin(v.x))*age*40.;q+=vec2(n,ripple(pt.yx/120.-time*.16))*58.;float c=cos(v.x),s=sin(v.x);q=mat2(c,-s,s,c)*q;float radius=d.w*(.48+age*.95);q/=vec2(radius*(1.3+v.y),radius*(.35+age*.3));float rip=1.+ripple(q*2.+float(i))*.52;field+=exp(-dot(q,q)*rip*2.)*max(0.,1.-age*.38);}}
float aspect=size.x/size.y;vec2 sceneUv=(vec2(uv.x,1.-uv.y)-.5)*vec2(min(aspect/1.777,1.),min(1.777/aspect,1.))+.5;vec3 hidden=texture2D(wolf,sceneUv).rgb;
if(mode>.5){float core=1.-exp(-field*1.8);float wet=clamp(halo,0.,.32);float alpha=clamp(core*.78+wet*(1.-core),0.,.84);alpha*=.94+grain*.06;gl_FragColor=vec4(hidden*alpha,alpha);}
else{float ink=smoothstep(.28,.52,field+ripple(pt/95.+time*.12)*.09);float alpha=ink*.96;gl_FragColor=vec4(hidden*alpha,alpha);}}`,
    E = (t, o) => {
      const r = e.createShader(t);
      if (
        (e.shaderSource(r, o),
        e.compileShader(r),
        !e.getShaderParameter(r, e.COMPILE_STATUS))
      )
        throw Error(e.getShaderInfoLog(r));
      return r;
    },
    n = e.createProgram();
  (e.attachShader(n, E(e.VERTEX_SHADER, U)),
    e.attachShader(n, E(e.FRAGMENT_SHADER, F)),
    e.linkProgram(n),
    e.useProgram(n),
    e.clearColor(0, 0, 0, 0));
  const D = e.createBuffer();
  (e.bindBuffer(e.ARRAY_BUFFER, D),
    e.bufferData(
      e.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      e.STATIC_DRAW,
    ));
  const x = e.getAttribLocation(n, "p");
  (e.enableVertexAttribArray(x),
    e.vertexAttribPointer(x, 2, e.FLOAT, !1, 0, 0));
  const T = e.createTexture();
  e.bindTexture(e.TEXTURE_2D, T);
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
    new Uint8Array([7, 10, 17, 255]),
  );
  const c = Object.fromEntries(
    ["size", "time", "mode", "drops[0]", "dirs[0]"].map((t) => [
      t,
      e.getUniformLocation(n, t),
    ]),
  );
  (e.uniform1f(c.mode, 0), e.uniform1i(e.getUniformLocation(n, "wolf"), 0));
  const m = new Image();
  ((m.src = "../book-library/assets/hidden-redhood-v1.webp"),
    (m.onload = () => {
      (e.bindTexture(e.TEXTURE_2D, T),
        e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, m));
    }));
  const u = Array.from({ length: 8 }, () => ({
      x: 0,
      y: 0,
      born: -1e4,
      r: 0,
      a: 0,
      s: 0,
    })),
    R = new Float32Array(32),
    A = new Float32Array(16);
  let f = 1,
    h = 1,
    l = 0,
    w = 0,
    y = 0,
    L = 0,
    d = null;
  function p() {
    (cancelAnimationFrame(l),
      (l = 0),
      u.forEach((t) => (t.r = 0)),
      (d = null),
      e.clear(e.COLOR_BUFFER_BIT));
  }
  function _() {
    ((f = innerWidth), (h = innerHeight));
    const t = Math.min(devicePixelRatio, 1, 1100 / f);
    ((a.width = Math.round(f * t)),
      (a.height = Math.round(h * t)),
      e.viewport(0, 0, a.width, a.height),
      e.uniform2f(c.size, f, h),
      p());
  }
  (_(), addEventListener("resize", _));
  function v(t) {
    if (((l = 0), document.hidden || g.inert)) {
      p();
      return;
    }
    if (t - w < 32) {
      l = requestAnimationFrame(v);
      return;
    }
    w = t;
    let o = !1;
    for (let r = 0; r < 8; r++) {
      const i = u[r],
        s = (t - i.born) / 1e3;
      (s > 2.55 && (i.r = 0),
        i.r && (o = !0),
        R.set([i.x, i.y, Math.min(s, 4), i.r], r * 4),
        A.set([i.a, i.s], r * 2));
    }
    (e.uniform4fv(c["drops[0]"], R),
      e.uniform2fv(c["dirs[0]"], A),
      e.uniform1f(c.time, t / 1e3),
      e.clear(e.COLOR_BUFFER_BIT),
      o && (e.drawArrays(e.TRIANGLES, 0, 6), (l = requestAnimationFrame(v))));
  }
  return (
    addEventListener(
      "pointermove",
      (t) => {
        const o = performance.now();
        if (
          t.pointerType !== "mouse" ||
          b.matches ||
          g.inert ||
          document.body.classList.contains("transition-running") ||
          t.target.closest("button,a") ||
          o - y < 40
        )
          return;
        const r = d || { x: t.clientX, y: t.clientY },
          i = t.clientX - r.x,
          s = t.clientY - r.y;
        (d && Math.hypot(i, s) < 3) ||
          ((d = { x: t.clientX, y: t.clientY }),
          Object.assign(u[L++ % 8], {
            x: t.clientX,
            y: t.clientY,
            born: o,
            r: Math.min(f * 0.12, 120),
            a: Math.atan2(s, i),
            s: Math.min(Math.hypot(i, s) / 90, 1.6),
          }),
          (y = o),
          l || (l = requestAnimationFrame(v)));
      },
      { passive: !0 },
    ),
    document.documentElement.addEventListener("pointerleave", () => {
      d = null;
    }),
    document.addEventListener("visibilitychange", () => {
      document.hidden && p();
    }),
    {
      clear: p,
      setImage() {
        p();
      },
    }
  );
}
