(() => {
  const root = document.documentElement;
  if (!root.classList.contains("library-return-loading")) return;

  const loader = document.querySelector("#collection-return-loader");
  const frame = document.querySelector("#book-library-frame");
  const track = loader.querySelector("[role=progressbar]");
  const fill = track.querySelector("i");
  const started = performance.now();
  const minimumLoadTime = 2500;
  let previousFrame = started;
  let progress = 0;

  function update(now) {
    const library = frame.contentDocument;
    const ready =
      library?.body?.dataset.libraryReady === "true" &&
      !library.documentElement.classList.contains("library-loading");
    const prepared = Number(library?.body?.dataset.libraryProgress || 0);
    const elapsed = now - started;
    const frameTime = Math.min(now - previousFrame, 60);
    previousFrame = now;
    const pacing = elapsed / minimumLoadTime;
    const target = ready
      ? Math.min(1, pacing)
      : Math.min(0.9, pacing * 0.88, 0.12 + prepared * 0.8);
    progress += (target - progress) * (1 - Math.exp(-frameTime / 140));

    if (ready && elapsed >= minimumLoadTime && progress > 0.997) {
      fill.style.transform = "scaleX(1)";
      track.setAttribute("aria-valuenow", "100");
      setTimeout(() => {
        root.classList.remove("library-return-loading");
        loader.classList.add("is-complete");
        setTimeout(() => loader.remove(), 650);
      }, 200);
      return;
    }

    fill.style.transform = `scaleX(${progress})`;
    track.setAttribute(
      "aria-valuenow",
      String(Math.min(99, Math.floor(progress * 100))),
    );
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();
