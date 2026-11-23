(() => {
  const covers = ["cinderella", "redhood", "mermaid", "snowwhite"];
  let completed = 0;
  const track = (promise) =>
    Promise.resolve(promise).then(() => {
      document.body.dataset.libraryProgress = String(
        ++completed / (covers.length + 2),
      );
    });
  const initialized = new Promise((resolve) => {
    if (document.body.dataset.libraryReady === "true") {
      resolve();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.body.dataset.libraryReady !== "true") return;
      observer.disconnect();
      resolve();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-library-ready"],
    });
  });
  const artwork = covers.map((name) => {
    const image = new Image();
    image.src = `assets/world-${name}-scene-v9.webp`;
    return image.decode().catch(() => {});
  });
  Promise.all([initialized, document.fonts.ready, ...artwork].map(track)).then(
    () => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.documentElement.classList.remove("library-loading");
          window.parent.postMessage("fairytale:library-ready", location.origin);
        }),
      );
    },
  );
})();
