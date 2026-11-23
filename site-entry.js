(() => {
  const root = document.documentElement;
  const current = new URL(location.href);

  if (current.protocol === "file:") {
    root.classList.add("local-file-entry");
    const preview = new URL("http://127.0.0.1:4185/");
    preview.search = current.search;
    preview.hash = current.hash;

    // An image can check the local server without requiring CORS on a file URL.
    const probe = new Image();
    probe.onload = () => location.replace(preview.href);
    probe.src = new URL("assets/site-cursor.svg", preview).href;
    return;
  }

  if (["library", "book"].includes(current.searchParams.get("return"))) {
    root.classList.add("library-return-loading");
  }
})();
