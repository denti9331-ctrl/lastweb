import { createMermaidScenes } from "../tales/mermaid-scenes.js?v=6";

import { mountFoamFinale } from "./foam-finale.js?v=12";

import { mountKingdomIntro } from "./kingdom-intro.js?v=4";

const revised = {
  2: ["mermaid-voice.html", "목소리의 대가"],
  3: ["mermaid-ballroom-3d.html", "말할 수 없는 진실"],
  4: ["mermaid-dawn-deck.html", "새벽까지 남은 선택"],
};

export function createMermaidReaderScenes(stage) {
  const original = createMermaidScenes(stage);
  let frame;
  let activeIndex = -1;
  let frameTimeout;
  let frameReady;
  let resolveFrame;
  let finale;
  let intro;

  function clear() {
    activeIndex = -1;
    clearTimeout(frameTimeout);
    resolveFrame?.();
    resolveFrame = undefined;
    frameReady = undefined;
    frame?.remove();
    frame = undefined;
    intro?.remove();
    intro = undefined;
    finale?.remove();
    finale = undefined;
    original.clear();
  }

  return {
    clear,
    setScene(index) {
      if (index === activeIndex && (frame || finale || intro)) {
        return frameReady ?? finale?.ready ?? intro?.ready;
      }
      clear();
      activeIndex = index;
      if (index === 0) {
        intro = mountKingdomIntro(stage);
        return intro.ready;
      }
      if (index === 5) {
        finale = mountFoamFinale(stage);
        return finale.ready;
      }
      const scene = revised[index];
      if (!scene) return original.setScene(index);

      const [file, title] = scene;
      const next = document.createElement("iframe");
      next.className = "mermaid-revised-scene";
      next.title = title;
      next.setAttribute("sandbox", "allow-scripts");
      next.src = file + "?embedded=1&v=cursor1";
      frameReady = new Promise((resolve) => {
        resolveFrame = resolve;
      });
      next.addEventListener(
        "load",
        () => {
          clearTimeout(frameTimeout);
          next.classList.add("is-ready");
          resolveFrame();
        },
        { once: true },
      );
      stage.prepend(next);
      frame = next;
      frameTimeout = setTimeout(() => {
        next.remove();
        frame = undefined;
        Promise.resolve(original.setScene(index)).then(
          resolveFrame,
          resolveFrame,
        );
      }, 7000);
      return frameReady;
    },
    cue(index) {
      if (finale) {
        if (index === 2) finale.trigger();
      } else if (!frame && !intro) original.cue(index);
    },
  };
}

window.addEventListener("message", (event) => {
  const frame = document.querySelector(".mermaid-revised-scene");
  if (!frame || event.source !== frame.contentWindow) return;
  if (
    event.data?.type === "mermaid-scene-wheel" &&
    Number.isFinite(event.data.deltaY)
  ) {
    window.dispatchEvent(
      new WheelEvent("wheel", { deltaY: event.data.deltaY }),
    );
  }
});
