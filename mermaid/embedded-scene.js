if (new URLSearchParams(location.search).has("embedded")) {
  document.documentElement.classList.add("embedded");
  window.addEventListener(
    "wheel",
    (event) => {
      window.parent.postMessage(
        { type: "mermaid-scene-wheel", deltaY: event.deltaY },
        "*",
      );
    },
    { passive: true },
  );
}
