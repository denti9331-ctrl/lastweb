(() => {
  const t = document.querySelector("#main-intro"),
    u = document.querySelector("#book-scene");
  if (!t || !u) return;
  if (location.protocol === "file:") return;
  const v = matchMedia("(prefers-reduced-motion: reduce)"),
    p = (e) => Math.max(0, Math.min(1, e)),
    l = document.createElement("div");
  ((l.className = "forest-journey"), t.before(l), l.append(t));
  const m = document.createElement("div");
  ((m.className = "journey-caption"),
    m.setAttribute("aria-live", "polite"),
    t.append(m));
  const T = t.querySelector(".main-intro__scroll");
  T &&
    ((T.textContent = "SCROLL TO EXPLORE"),
    T.setAttribute(
      "aria-label",
      "\uC2A4\uD06C\uB864\uD558\uC5EC \uC2E0\uC804 \uD0D0\uD5D8\uD558\uAE30",
    ));
  const E = document.createElement("div");
  ((E.className = "journey-progress"),
    (E.innerHTML = "<span>THE JOURNEY</span><i></i>"),
    t.append(E));
  const s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "journey-open"),
    (s.innerHTML =
      "<span>FOUR TALES \xB7 UNANSWERED QUESTIONS</span><strong>Beyond the tale</strong><small>\uC774\uC57C\uAE30 \uB108\uBA38\uB85C</small>"),
    (s.disabled = !0),
    t.append(s));
  const o = document.createElement("div");
  ((o.className = "journey-light"),
    o.setAttribute("aria-hidden", "true"),
    (o.innerHTML =
      '<div class="journey-loading-copy"><div class="journey-loading-icons" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><use href="assets/tale-loading-icons.svg?v=2#shoe"/></svg><svg viewBox="0 0 32 32" focusable="false"><use href="assets/tale-loading-icons.svg?v=2#wolf"/></svg><svg viewBox="0 0 32 32" focusable="false"><use href="assets/tale-loading-icons.svg?v=2#drop"/></svg><svg viewBox="0 0 32 32" focusable="false"><use href="assets/tale-loading-icons.svg?v=2#apple"/></svg></div><div class="journey-loading-track" role="progressbar" aria-label="동화책 준비 중" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div></div>'));
  document.body.append(o);
  const k = [
    [
      "I \xB7 THE WATCHER",
      "\uAD34\uBB3C\uC5D0\uAC8C\uB294 \uC790\uC2E0\uC758 \uC774\uC57C\uAE30\uB97C \uB4E4\uB824\uC904 \uAE30\uD68C\uAC00 \uC5C6\uC5C8\uB2E4",
    ],
    [
      "II \xB7 THE TIDE",
      "\uC5B4\uB5A4 \uC18C\uC6D0\uC740 \uBAA9\uC18C\uB9AC\uBCF4\uB2E4 \uB354 \uB9CE\uC740 \uAC83\uC744 \uC557\uC544\uAC04\uB2E4",
    ],
    [
      "III \xB7 THE CROWN",
      "\uC655\uAD00\uC740 \uC5B4\uB5A4 \uC774\uC57C\uAE30\uAC00 \uC0B4\uC544\uB0A8\uC744\uC9C0 \uACB0\uC815\uD55C\uB2E4",
    ],
    [
      "IV \xB7 THE KEEPER",
      "\uC78A\uD78C\uB2E4\uACE0 \uD574\uC11C \uC0AC\uB77C\uC9C0\uB294 \uAC83\uC740 \uC544\uB2C8\uB2E4",
    ],
  ];
  function useStaticForest() {
    delete t.dataset.ravenWarmup;
    t.dataset.sceneReady = "fallback";
    t.dataset.bookReady = "true";
  }
  const libraryFrame = document.querySelector("#book-library-frame");
  function prepareLibrary() {
    if (libraryFrame?.dataset.src) {
      libraryFrame.src = libraryFrame.dataset.src;
      delete libraryFrame.dataset.src;
    }
  }
  let w = -2,
    L = !1;
  function f() {
    const e = l.getBoundingClientRect(),
      r = l.offsetHeight - innerHeight,
      a = p(-e.top / Math.max(1, r));
    ((window.ForestJourneyProgress = a),
      (t.dataset.progress = a.toFixed(3)),
      t.style.setProperty("--journey", a),
      t.style.setProperty("--title-opacity", 1 - p(a / 0.12)));
    const i = [0.19, 0.39, 0.59, 0.77];
    let n = -1,
      b = 0;
    (i.forEach((g, A) => {
      const h = p((0.095 - Math.abs(a - g)) / 0.035);
      h > b && ((b = h), (n = A));
    }),
      n !== w &&
        ((w = n),
        (m.innerHTML = n < 0 ? "" : `<span>${k[n][0]}</span><p>${k[n][1]}</p>`),
        m.classList.toggle("caption-right", n % 2 === 0)),
      t.style.setProperty("--caption-opacity", b));
    const c = p((a - 0.89) / 0.07);
    t.style.setProperty("--final-opacity", c);
    const d = t.dataset.bookReady === "true";
    ((s.disabled = c < 0.95 || !d),
      (s.tabIndex = c > 0.95 && d ? 0 : -1),
      (s.querySelector("small").textContent = d
        ? "\uC774\uC57C\uAE30 \uB108\uBA38\uB85C"
        : "\uCC45\uC744 \uBD88\uB7EC\uC624\uB294 \uC911"),
      (E.querySelector("i").style.transform = `scaleY(${a})`));
  }
  (addEventListener("scroll", f, { passive: !0 }),
    addEventListener("resize", f),
    addEventListener("temple-assets-ready", f),
    f());
  const C = () =>
    scrollTo({
      top:
        scrollY + l.getBoundingClientRect().top + l.offsetHeight - innerHeight,
      behavior: v.matches ? "instant" : "smooth",
    });
  function R() {
    L ||
      (M(),
      document.body.classList.remove("library-entered"),
      u.setAttribute("inert", ""),
      t.removeAttribute("inert"),
      (window.ForestBookOpening = 0),
      scrollTo({ top: 0, behavior: "instant" }),
      f());
  }
  function S() {
    if (L || Number(t.dataset.progress) < 0.93) return;
    ((L = !0), (window.ForestBookOpening = 0));
    const e = document.querySelector("#book-library-frame"),
      r = o.querySelector('[role="progressbar"]'),
      a = r.querySelector("i");
    let i = 0,
      n = 0;
    const b = performance.now(),
      c = v.matches ? 250 : 1350;
    ((a.style.transform = "scaleX(0)"),
      r.setAttribute("aria-valuenow", "0"),
      o.setAttribute("aria-hidden", "false"),
      o.setAttribute("aria-busy", "true"),
      document.body.classList.add("journey-loading"));
    requestAnimationFrame(() => requestAnimationFrame(prepareLibrary));
    function d(g) {
      let A = !1;
      try {
        A =
          e.contentDocument?.body?.dataset.libraryReady === "true" &&
          !e.contentDocument.documentElement.classList.contains(
            "library-loading",
          );
      } catch {}
      const h = g - b,
        H = 0.92 * (1 - Math.exp(-h / (c * 0.35)));
      if (
        ((i = Math.max(i, H)),
        A && h >= c && (n || (n = g), (i = 0.92 + 0.08 * p((g - n) / 220))),
        (a.style.transform = "scaleX(" + i + ")"),
        r.setAttribute("aria-valuenow", String(Math.floor(i * 100))),
        i < 1)
      ) {
        requestAnimationFrame(d);
        return;
      }
      (o.setAttribute("aria-busy", "false"),
        setTimeout(
          () => {
            (document.body.classList.add("library-entered"),
              u.removeAttribute("inert"),
              t.setAttribute("inert", ""),
              scrollTo({ top: 0, behavior: "instant" }),
              document.body.classList.remove("journey-loading"),
              setTimeout(
                () => {
                  (o.setAttribute("aria-hidden", "true"),
                    (L = !1),
                    e?.focus({ preventScroll: !0 }));
                },
                v.matches ? 0 : 600,
              ));
          },
          v.matches ? 0 : 100,
        ));
    }
    requestAnimationFrame(d);
  }
  ((window.ForestOpenBook = S),
    s.addEventListener("click", S),
    u.setAttribute("inert", ""));
  const y = new URL(location.href);
  (["library", "book"].includes(y.searchParams.get("return")) &&
    (prepareLibrary(),
    document.body.classList.add("library-entered"),
    u.removeAttribute("inert"),
    t.setAttribute("inert", ""),
    scrollTo({ top: 0, behavior: "instant" }),
    y.searchParams.delete("return"),
    (y.hash = ""),
    history.replaceState(history.state, "", y.pathname + y.search)),
    document.addEventListener(
      "click",
      (e) => {
        const r = e.target.closest("a");
        r?.getAttribute("href") === "#book-scene"
          ? (e.preventDefault(),
            e.stopImmediatePropagation(),
            document.body.classList.contains("library-entered") || C())
          : r?.getAttribute("href") === "#main-intro" &&
            (e.preventDefault(), e.stopImmediatePropagation(), R());
      },
      !0,
    ),
    addEventListener(
      "message",
      (e) => {
        e.origin === location.origin &&
          e.source ===
            document.querySelector("#book-library-frame")?.contentWindow &&
          e.data === "fairytale:home" &&
          (e.stopImmediatePropagation(), R());
      },
      !0,
    ));
  let x = !1;
  function M() {
    if (x) return;
    x = !0;
    const e = document.createElement("script");
    ((e.src = new URL(
      "forest-entry/forest-three.js?v=8",
      document.baseURI,
    ).href),
      e.addEventListener(
        "error",
        () => {
          useStaticForest();
          f();
        },
        { once: true },
      ),
      document.head.append(e));
  }
  document.body.classList.contains("library-entered") || M();
})();
