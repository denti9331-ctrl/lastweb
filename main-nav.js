(() => {
  const navigation = document.querySelector(".main-navigation");
  if (!navigation) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  for (const link of navigation.querySelectorAll('a[href^="#"]')) {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      const top =
        link.hash === "#main-intro"
          ? 0
          : scrollY +
            target.getBoundingClientRect().top -
            navigation.offsetHeight;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    });
  }

  const frame = document.querySelector("#book-library-frame");
  const returnLoader = document.querySelector("#collection-return-loader");
  let queued = false;

  function updateVisibility() {
    queued = false;
    const library = frame.contentDocument;
    const visible =
      document.body.classList.contains("library-entered") &&
      library?.body?.dataset.libraryReady === "true" &&
      !library.documentElement.classList.contains("library-loading") &&
      !document.documentElement.classList.contains("library-return-loading") &&
      !(
        returnLoader?.isConnected &&
        returnLoader.classList.contains("is-complete")
      );
    document.body.classList.toggle("main-nav-visible", visible);
    navigation.inert = !visible;
    navigation.setAttribute("aria-hidden", String(!visible));
  }

  function scheduleUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateVisibility);
  }

  frame.addEventListener("load", scheduleUpdate);
  window.addEventListener("message", (event) => {
    if (
      event.origin === location.origin &&
      event.source === frame.contentWindow &&
      event.data === "fairytale:library-ready"
    )
      scheduleUpdate();
  });
  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  scheduleUpdate();
})();
