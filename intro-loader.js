(() => {
  const loader = document.querySelector("#site-intro-loader");
  if (
    document.documentElement.classList.contains("library-return-loading") ||
    document.body.classList.contains("library-entered") ||
    location.protocol === "file:"
  ) {
    loader.remove();
    return;
  }

  const forest = document.querySelector("#main-intro");
  const track = loader.querySelector("[role=progressbar]");
  const fill = track.querySelector("i");
  const started = performance.now();
  const pacingTime = 3200;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let progress = 0;
  let announced = 0;
  let fontsReady = false;
  let previousFrame = started;
  document.fonts.ready.then(() => {
    fontsReady = true;
  });

  function finish() {
    window.dispatchEvent(new Event("fairytale:intro-reveal"));
    loader.classList.add("is-complete");
    if (reducedMotion.matches) loader.remove();
    else {
      loader.addEventListener("transitionend", () => loader.remove(), {
        once: true,
      });
      setTimeout(() => loader.remove(), 600);
    }
  }

  function update(now) {
    const rendered = forest.dataset.sceneReady === "true";
    const modelsLoaded = forest.dataset.initialAssets === "ready";
    const ravenFinished = ["ready", "unavailable"].includes(
      forest.dataset.ravenWarmup,
    );
    const butterflyFinished = ["true", "error"].includes(
      forest.dataset.butterflyReady,
    );
    const fallback = forest.dataset.sceneReady === "fallback";
    const elapsed = now - started;
    const finishLoading =
      elapsed >= pacingTime &&
      fontsReady &&
      (fallback ||
        (rendered && modelsLoaded && ravenFinished && butterflyFinished));
    const prepared = fallback
      ? 0.96
      : 0.1 +
        0.26 * rendered +
        0.18 * modelsLoaded +
        0.28 * ravenFinished +
        0.08 * butterflyFinished +
        0.06 * fontsReady;
    const target = finishLoading
      ? 1
      : Math.min(prepared, (0.96 * elapsed) / pacingTime);
    const frameTime = Math.max(0, Math.min(100, now - previousFrame));
    previousFrame = now;
    progress +=
      (Math.max(progress, target) - progress) * (1 - Math.exp(-frameTime / 95));
    if (finishLoading && progress > 0.994) progress = 1;
    fill.style.transform = `scaleX(${progress})`;
    const percent = progress === 1 ? 100 : Math.floor(progress * 20) * 5;
    if (percent !== announced) {
      track.setAttribute("aria-valuenow", String(percent));
      announced = percent;
    }
    if (progress === 1) finish();
    else requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();
