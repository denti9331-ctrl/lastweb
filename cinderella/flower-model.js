import * as a from "../book-library/vendor/three.module.js";
export async function loadFlower() {
  const l = await fetch("models/botanical-flower-optimized.glb");
  if (!l.ok) throw new Error("Flower model unavailable");
  const o = await l.arrayBuffer(),
    s = new DataView(o),
    t = s.getUint32(12, !0),
    i = JSON.parse(new TextDecoder().decode(new Uint8Array(o, 20, t))),
    d = 28 + t,
    y = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array },
    b = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
  function u(g) {
    const n = i.accessors[g],
      v = i.bufferViews[n.bufferView],
      h = y[n.componentType];
    return new a.BufferAttribute(
      new h(
        o,
        d + (v.byteOffset || 0) + (n.byteOffset || 0),
        n.count * b[n.type],
      ),
      b[n.type],
      n.normalized || !1,
    );
  }
  const f = i.meshes[0].primitives[0],
    e = new a.BufferGeometry();
  (e.setAttribute("position", u(f.attributes.POSITION)),
    e.setAttribute("normal", u(f.attributes.NORMAL)),
    e.setAttribute("uv", u(f.attributes.TEXCOORD_0)),
    e.setIndex(u(f.indices)),
    e.computeBoundingBox());
  const r = e.boundingBox,
    c = r.max.y - r.min.y;
  (e.translate(-(r.max.x + r.min.x) / 2, -r.min.y, -(r.max.z + r.min.z) / 2),
    e.scale(1 / c, 1 / c, 1 / c),
    e.computeBoundingSphere());
  const p = i.bufferViews[i.images[0].bufferView],
    x = new Blob([new Uint8Array(o, d + p.byteOffset, p.byteLength)], {
      type: i.images[0].mimeType,
    }),
    w = URL.createObjectURL(x),
    m = await new a.TextureLoader().loadAsync(w);
  return (
    URL.revokeObjectURL(w),
    (m.flipY = !1),
    (m.colorSpace = a.SRGBColorSpace),
    (m.anisotropy = 2),
    { geometry: e, map: m }
  );
}
export function flowerMaterial(l) {
  const o = { growth: { value: 0.001 }, bend: { value: 0 } },
    s = new a.MeshStandardMaterial({
      map: l,
      roughness: 1,
      metalness: 0,
      side: a.DoubleSide,
      color: 14078665,
    });
  return (
    (s.onBeforeCompile = (t) => {
      ((t.uniforms.uGrowth = o.growth),
        (t.uniforms.uBend = o.bend),
        (t.vertexShader =
          `uniform float uGrowth; uniform float uBend;
` + t.vertexShader),
        (t.vertexShader = t.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
   float level=clamp(position.y,0.0,1.0);
   float bloom=smoothstep(0.58,1.0,uGrowth);
   float top=smoothstep(0.62,0.8,level);
   float opening=mix(1.0,max(0.025,bloom),top);
   transformed.x*=opening;transformed.z*=opening;
   transformed.y*=uGrowth;
   transformed.x+=uBend*level*level;
  `,
        )));
    }),
    (s.customProgramCacheKey = () => "flower-grow-bend-v1"),
    { material: s, uniforms: o }
  );
}
