export function createRedScenes(t) {
  const a = [
      "narrative-promise-actor.webp",
      "narrative-stranger-actor.webp",
      "narrative-door-actor.webp",
      "narrative-bed-actor.webp",
      "narrative-rescue-actor.webp",
      "redhood-actor.webp",
    ],
    e = document.createElement("img");
  return (
    (e.id = "red-scene-actor"),
    (e.alt = ""),
    e.setAttribute("aria-hidden", "true"),
    t.append(e),
    {
      clear() {
        e.hidden = !0;
      },
      setScene(r) {
        if (((e.hidden = !0), r < 0)) return;
        e.src = "images/interactive/" + a[r];
        const c = e.src;
        return e
          .decode()
          .then(() => {
            e.src === c && (e.hidden = !1);
          })
          .catch(() => {});
      },
      cue() {},
    }
  );
}
