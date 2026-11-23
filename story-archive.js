const dialog = document.querySelector("#story-archive");
const trigger = document.querySelector("[data-archive]");
const gallery = dialog.querySelector(".story-archive__cards");
const storyIds = ["snowwhite", "redridinghood", "mermaid", "cinderella"];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const bookOrder = ["cinderella", "redridinghood", "mermaid", "snowwhite"];
let bookEffects;
let launching = false;

function prepareBookEffects() {
  bookEffects ??= Promise.all(
    [
      "book-effects.css?v=tale-loader4",
      "book-effects.js?v=archive1",
      "tale-entry-finish.js?v=archive1",
    ].map(
      (file) =>
        new Promise((resolve, reject) => {
          const stylesheet = file.includes(".css?");
          const element = document.createElement(
            stylesheet ? "link" : "script",
          );
          const url = new URL(`book-library/${file}`, document.baseURI);
          if (stylesheet) {
            element.rel = "stylesheet";
            element.href = url.href;
          } else {
            element.src = url.href;
          }
          element.addEventListener("load", resolve, { once: true });
          element.addEventListener("error", reject, { once: true });
          document.head.append(element);
        }),
    ),
  ).then(
    () => true,
    () => false,
  );
  return bookEffects;
}

async function openArchiveCard(event, storyId) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  if (launching) return;
  launching = true;
  const destination = new URL(event.currentTarget.href);
  if (!reducedMotion.matches && (await prepareBookEffects())) {
    const index = bookOrder.indexOf(storyId);
    document.body.dataset.archiveLaunch = "";
    document.body.dataset.tale = String(index);
    document.body.classList.add("opening");
    activePanel?.();
    document.dispatchEvent(
      new CustomEvent("fairytale:book-open", { detail: { index } }),
    );
    await new Promise((resolve) =>
      setTimeout(resolve, index === 1 ? 1800 : 2300),
    );
    destination.searchParams.set("entry", "book");
  }
  location.assign(destination.href);
}

window.addEventListener("pageshow", (event) => {
  if (!event.persisted || !launching) return;
  launching = false;
  document.body.classList.remove("opening");
  delete document.body.dataset.archiveLaunch;
  delete document.body.dataset.tale;
});

function riseIntoView(element) {
  if (reducedMotion.matches) return;
  return element.animate(
    [
      { opacity: 0, transform: "translateY(11px)", filter: "blur(5px)" },
      { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
    ],
    { duration: 490, easing: "cubic-bezier(.22,.61,.36,1)" },
  );
}

function connectIndicator(picker) {
  const indicator = picker.querySelector(".story-archive__indicator");
  let hovered;
  function align() {
    const current = hovered ?? picker.querySelector('[aria-pressed="true"]');
    if (!current?.offsetWidth) return;
    indicator.toggleAttribute("data-hovered", Boolean(hovered));
    indicator.style.setProperty(
      "--indicator-ink",
      getComputedStyle(current).getPropertyValue("--story-color"),
    );
    indicator.style.width = `${current.offsetWidth}px`;
    indicator.style.transform = `translate(${current.offsetLeft}px, ${current.offsetTop + current.offsetHeight - 2}px)`;
  }
  picker.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = event.target.closest("button");
    align();
  });
  picker.addEventListener("pointerout", (event) => {
    if (!hovered || hovered.contains(event.relatedTarget)) return;
    hovered = null;
    align();
  });
  new ResizeObserver(align).observe(picker);
  document.fonts.ready.then(align);
  return align;
}

function buildGallery(stories) {
  gallery.innerHTML = `
    <div class="story-archive__stories" role="group" aria-label="Stories">
      <span class="story-archive__indicator" aria-hidden="true"></span>
    </div>
    <section class="story-archive__feature" aria-label="Scene preview">
      <div class="story-archive__deck" role="group" aria-label="Scroll through scenes" tabindex="0"></div>
      <div class="story-archive__copy" aria-live="polite">
        <div class="story-archive__text">
          <p class="story-archive__number"></p>
          <h3></h3>
          <p class="story-archive__description" lang="ko"></p>
        </div>
        <div class="story-archive__links">
          <a data-open-story>Read from the beginning</a>
        </div>
      </div>
    </section>`;

  const picker = gallery.querySelector(".story-archive__stories");
  const alignIndicator = connectIndicator(picker);
  const deck = gallery.querySelector(".story-archive__deck");
  const sceneText = gallery.querySelector(".story-archive__text");
  const number = gallery.querySelector(".story-archive__number");
  const title = gallery.querySelector("h3");
  const description = gallery.querySelector(".story-archive__description");
  const openStory = gallery.querySelector("[data-open-story]");
  const cardSpacing = 0.69;
  const arcStep = 0.35;
  let story, url, cards, active, drag;
  let position = 0;
  let target = 0;
  let frame = 0;
  let lastFrame = 0;
  let textReveal;
  let deckReveal;

  function revealText() {
    textReveal?.cancel();
    textReveal = riseIntoView(sceneText);
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;

  function render() {
    const index = wrap(Math.round(position), cards.length);
    if (index !== active) {
      active = index;
      const scene = story.scenes[index];
      number.textContent = `CHAPTER ${String(index + 1).padStart(2, "0")} / ${cards.length}`;
      title.textContent = scene.title;
      description.textContent = scene.text[0];
      revealText();
      cards.forEach((card, slot) => {
        card.tabIndex = slot === index ? 0 : -1;
      });
    }
    cards.forEach((card, slot) => {
      const half = cards.length / 2;
      const distance = wrap(slot - position + half, cards.length) - half;
      const depth = Math.abs(distance);
      const bend = Math.min(depth, 3);
      const angle = distance * arcStep;
      card.style.setProperty("--x", `${(Math.cos(angle) - 1) * 118}%`);
      card.style.setProperty(
        "--y",
        `${((Math.sin(angle) * cardSpacing) / Math.sin(arcStep)) * 100}%`,
      );
      card.style.setProperty("--tilt", `${(angle * 180) / Math.PI}deg`);
      card.style.setProperty("--size", String(1 - bend * 0.075));
      card.style.opacity = String(clamp((half - depth) * 1.5, 0, 1));
      // Keep the same overlap order as cards pass through the center.
      card.style.setProperty("--layer", String(20 - Math.round(distance * 5)));
    });
  }

  function animate(now) {
    const gap = target - position;
    const elapsed = Math.min(40, now - lastFrame);
    lastFrame = now;
    const followTime = drag ? 38 : 145;
    position =
      Math.abs(gap) < 0.001 || reducedMotion.matches
        ? target
        : position + gap * (1 - Math.exp(-elapsed / followTime));
    render();
    frame = position === target ? 0 : requestAnimationFrame(animate);
  }

  function move(value) {
    target = value;
    if (!frame) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }

  deck.closest(".story-archive__feature").addEventListener(
    "wheel",
    (event) => {
      if (
        event.ctrlKey ||
        drag ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      )
        return;
      const scale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? deck.clientHeight
            : 1;
      const change = (event.deltaY * scale) / 185;
      event.preventDefault();
      move(target + change);
    },
    { passive: false },
  );

  deck.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    move(Math.round(target) + (event.key === "ArrowDown" ? 1 : -1));
  });

  deck.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    move(position);
    drag = {
      id: event.pointerId,
      y: event.clientY,
      start: position,
      moved: false,
    };
  });
  deck.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    if (!drag.moved) {
      if (Math.abs(drag.y - event.clientY) < 7) return;
      drag.moved = true;
      deck.setPointerCapture(event.pointerId);
    }
    move(
      drag.start +
        (drag.y - event.clientY) /
          (deck.firstElementChild.offsetHeight * cardSpacing),
    );
  });
  function endDrag(event) {
    if (drag?.id !== event.pointerId) return;
    if (event.type === "lostpointercapture" && event.target !== deck) return;
    drag = null;
  }
  deck.addEventListener("pointerup", endDrag);
  deck.addEventListener("pointercancel", endDrag);
  deck.addEventListener("lostpointercapture", endDrag);
  deck.addEventListener("pointerleave", (event) => {
    if (!drag?.moved) endDrag(event);
  });

  function selectStory(id, selected) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    story = stories[id];
    url = new URL(`${id}/index.html`, document.baseURI);
    dialog.dataset.story = id;
    cards = story.scenes.map((scene, index) => {
      const card = document.createElement("a");
      card.className = "story-archive__frame";
      card.href = `${url.href}?chapter=${index + 1}`;
      card.setAttribute("aria-label", scene.title);
      card.addEventListener("click", (event) => openArchiveCard(event, id));
      card.draggable = false;
      const image = document.createElement("img");
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";
      image.src = new URL(scene.image, url).href;
      card.append(image);
      return card;
    });
    deck.replaceChildren(...cards);
    deckReveal?.cancel();
    deckReveal = riseIntoView(deck);
    for (const button of picker.querySelectorAll("button"))
      button.setAttribute("aria-pressed", String(button === selected));
    alignIndicator();
    openStory.href = url.href;
    position = target = 0;
    active = -1;
    render();
  }

  for (const id of storyIds) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.category = id;
    button.textContent = stories[id].title;
    button.addEventListener("click", () => selectStory(id, button));
    picker.append(button);
  }
  selectStory("snowwhite", picker.querySelector('[data-category="snowwhite"]'));
  return revealText;
}

let loading;
let revealOnOpen;
let activePanel;
const observedDocuments = new WeakSet();

function observeOutsideClicks(surface) {
  if (!surface || observedDocuments.has(surface)) return;
  observedDocuments.add(surface);
  let pointerStart;
  surface.addEventListener(
    "pointerdown",
    (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    },
    true,
  );
  surface.addEventListener(
    "click",
    (event) => {
      if (
        event.target.closest?.(".story-archive, [data-archive], [data-about]")
      )
        return;
      if (
        event.detail &&
        pointerStart &&
        Math.hypot(
          event.clientX - pointerStart.x,
          event.clientY - pointerStart.y,
        ) > 6
      )
        return;
      activePanel?.();
    },
    true,
  );
}

observeOutsideClicks(document);
const libraryFrame = document.querySelector("#book-library-frame");
libraryFrame.addEventListener("load", () =>
  observeOutsideClicks(libraryFrame.contentDocument),
);
observeOutsideClicks(libraryFrame.contentDocument);

function registerPanel(panel, opener) {
  let closing;

  function closePanel() {
    if (!panel.open || closing) return;
    if (activePanel === closePanel) activePanel = null;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.close();
      return;
    }
    const currentPosition = new DOMMatrixReadOnly(
      getComputedStyle(panel).transform,
    ).m41;
    closing = panel.animate(
      [
        {
          transform: `translateX(${currentPosition}px)`,
          opacity: 1,
          easing: "ease-out",
        },
        {
          transform: `translateX(${currentPosition - 14}px)`,
          opacity: 1,
          offset: 0.24,
          easing: "cubic-bezier(.45,0,.6,1)",
        },
        {
          transform: "translateX(calc(100% + var(--archive-inset)))",
          opacity: 0.35,
        },
      ],
      { duration: 540, fill: "forwards" },
    );
    closing.onfinish = () => {
      panel.close();
      closing.cancel();
      closing = null;
    };
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activePanel === closePanel) {
      event.preventDefault();
      if (panel.contains(document.activeElement))
        opener.focus({ preventScroll: true });
      closePanel();
    }
  });
  return () => {
    if (closing) {
      closing.cancel();
      closing = null;
      panel.close();
    }
    if (panel.open) {
      closePanel();
      return false;
    }
    activePanel?.();
    panel.show();
    activePanel = closePanel;
    return true;
  };
}

const toggleArchive = registerPanel(dialog, trigger);
trigger.addEventListener("click", async () => {
  if (!toggleArchive()) return;
  if (!reducedMotion.matches) prepareBookEffects();
  if (loading) {
    revealOnOpen?.();
    return;
  }
  const status = dialog.querySelector("[role=status]");
  status.textContent = "Loading stories...";
  loading = import("./tales/stories.js?v=7");
  try {
    const { stories } = await loading;
    revealOnOpen = buildGallery(stories);
    status.textContent = "";
  } catch {
    status.textContent =
      "Stories could not load. Close and reopen Archive to try again.";
    loading = null;
  }
});

const about = document.querySelector("#main-about");
const aboutTrigger = document.querySelector("[data-about]");
const toggleAbout = registerPanel(about, aboutTrigger);
const aboutPicker = about.querySelector(".story-archive__stories");
const alignAboutIndicator = connectIndicator(aboutPicker);
const aboutButtons = aboutPicker.querySelectorAll("button");
let aboutReveal;
function revealAboutSection() {
  aboutReveal?.cancel();
  aboutReveal = riseIntoView(about.querySelector("section:not([hidden])"));
}
aboutPicker.addEventListener("click", (event) => {
  const selected = event.target.closest("button");
  if (!selected || selected.getAttribute("aria-pressed") === "true") return;
  for (const button of aboutButtons) {
    const active = button === selected;
    button.setAttribute("aria-pressed", String(active));
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      !active;
  }
  alignAboutIndicator();
  revealAboutSection();
});
aboutTrigger.addEventListener("click", () => {
  if (!toggleAbout()) return;
  alignAboutIndicator();
  revealAboutSection();
});
