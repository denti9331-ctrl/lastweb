const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function createKelpPatch(left, top, width, height, phase) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const fadeX = context.createLinearGradient(0, 0, width, 0);
  fadeX.addColorStop(0, "transparent");
  fadeX.addColorStop(0.12, "black");
  fadeX.addColorStop(0.82, "black");
  fadeX.addColorStop(1, "transparent");
  const fadeY = context.createLinearGradient(0, 0, 0, height);
  fadeY.addColorStop(0, "transparent");
  fadeY.addColorStop(0.28, "black");
  fadeY.addColorStop(0.88, "black");
  fadeY.addColorStop(1, "transparent");
  return { canvas, context, left, top, width, height, phase, fadeX, fadeY };
}

function paintKelpPatch(patch, art, time) {
  const { context, left, top, width, height, phase, fadeX, fadeY } = patch;
  context.clearRect(0, 0, width, height);
  for (let y = 0; y < height; y += 10) {
    const amount = Math.sin((Math.PI * y) / height);
    const shift = Math.sin(time * 0.92 + phase + y * 0.013) * amount * 9;
    const band = Math.min(10, height - y);
    context.drawImage(art, left, top + y, width, band, shift, y, width, band);
  }
  context.globalCompositeOperation = "destination-in";
  for (const mask of [fadeX, fadeY]) {
    context.fillStyle = mask;
    context.fillRect(0, 0, width, height);
  }
  context.globalCompositeOperation = "source-over";
}

export function mountFoamFinale(stage) {
  const overlay = document.createElement("div");
  overlay.className = "mermaid-finale";
  const waterPlate = new Image();
  waterPlate.src = "assets/06-underwater.webp";
  waterPlate.alt = "";
  waterPlate.className = "picture mermaid-finale-water-plate";
  waterPlate.draggable = false;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const context = canvas.getContext("2d");
  const kelpPatches = [
    createKelpPatch(0, 546, 445, 395, 0),
    createKelpPatch(1220, 480, 452, 461, 2.4),
  ];
  let kelpFilter = "none";
  const lift = document.createElement("button");
  lift.type = "button";
  lift.className = "mermaid-finale-lift";
  lift.textContent = "Click";
  lift.setAttribute("aria-label", "거품 흩어 보내기");
  stage.prepend(overlay);
  overlay.append(waterPlate, canvas, lift);

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const particles = Array.from({ length: 78 }, (_, index) => ({
    spread: Math.sin(index * 37.1),
    delay: (index * 0.618) % 1,
    depth: 0.25 + ((index * 0.3819) % 0.75),
  }));
  const suspendedParticles = Array.from({ length: 52 }, (_, index) => ({
    x: (index * 0.618034 + 0.11) % 1,
    offset: (index * 0.381966 + 0.4) % 1,
    speed: 0.022 + (index % 7) * 0.008,
    bubble: index % 3 === 0,
  }));
  let width,
    height,
    ratio,
    artScale,
    artLeft,
    artTop,
    frame = 0;
  const origin = performance.now();
  let liftedAt = null,
    lastFrame = 0;
  let cameraX = 0,
    cameraY = 0,
    zoom = 1;
  const projectX = (x) =>
    width / 2 + (artLeft + x * artScale - width / 2) * zoom + cameraX;
  const projectY = (y) =>
    height / 2 + (artTop + y * artScale - height / 2) * zoom + cameraY;

  function resize() {
    kelpFilter = getComputedStyle(waterPlate).filter;
    width = stage.clientWidth;
    height = stage.clientHeight;
    ratio = Math.min(devicePixelRatio, 1.25);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    artScale = Math.max(width / 1672, height / 941) * 1.04;
    const position = width < 700 ? 0.67 : 0.5;
    artLeft =
      (width - 1672 * artScale) * position + width * ((position - 0.5) * 0.04);
    artTop = (height - 941 * artScale) * 0.5;
    lift.style.left =
      Math.max(74, Math.min(width - 74, width * (width < 700 ? 0.61 : 0.65))) +
      "px";
    lift.style.top =
      Math.max(height * 0.52, Math.min(height * 0.73, projectY(675))) + "px";
    schedule();
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }

  function trigger() {
    if (liftedAt !== null) return;
    liftedAt = performance.now();
    if (document.activeElement === lift)
      stage.querySelector("#read")?.focus({ preventScroll: true });
    lift.hidden = true;
    overlay.dataset.phase = "lifting";
    schedule();
  }

  function render(now) {
    frame = 0;
    if (now - lastFrame < 31 && !motion.matches) return schedule();
    lastFrame = now;
    const elapsed = (now - origin) / 1000;
    const progress =
      liftedAt === null
        ? 0
        : motion.matches
          ? 1
          : clamp((now - liftedAt) / 4200);
    const push = ease(elapsed / 5.2);
    const release = ease(progress);
    const swell = Math.sin(elapsed * 0.92) * (1 - release);
    zoom = motion.matches ? 1 : 1 + push * 0.09 + release * 0.035;
    cameraX = motion.matches ? 0 : width * (-0.04 * push + 0.022 * release);
    cameraY = motion.matches
      ? 0
      : height * (0.021 * push + 0.012 * swell - 0.038 * release);
    stage.style.setProperty("--foam-camera-x", cameraX + "px");
    stage.style.setProperty("--foam-camera-y", cameraY + "px");
    stage.style.setProperty("--foam-camera-scale", String(1.04 * zoom));
    const dissolve = ease((progress - 0.1) / 0.74);
    waterPlate.style.opacity = String(ease(progress / 0.18));
    waterPlate.style.setProperty("--water-edge", 112 - dissolve * 146 + "%");
    const water = ease((progress - 0.14) / 0.86);
    const lightSway = motion.matches ? 0 : Math.sin(elapsed * 0.55);
    const lightPulse = motion.matches ? 0 : Math.sin(elapsed * 0.92 + 1.2);
    overlay.style.setProperty(
      "--water-light",
      String(0.2 + 0.14 * water + 0.055 * lightPulse),
    );
    overlay.style.setProperty("--beam-origin", 71 + lightSway * 4 + "%");
    overlay.style.setProperty("--beam-angle", 158 + lightSway * 6 + "deg");
    if (context) {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      if (!motion.matches && waterPlate.naturalWidth === 1672) {
        context.filter = kelpFilter;
        for (const patch of kelpPatches) {
          if (
            projectX(patch.left + patch.width) <= 0 ||
            projectX(patch.left) >= width
          )
            continue;
          paintKelpPatch(patch, waterPlate, elapsed);
          context.drawImage(
            patch.canvas,
            projectX(patch.left),
            projectY(patch.top),
            patch.width * artScale * zoom,
            patch.height * artScale * zoom,
          );
        }
        context.filter = "none";
      }
      const dawn = ease((progress - 0.26) / 0.74);
      if (dawn) {
        const light = context.createRadialGradient(
          projectX(1140),
          projectY(95),
          0,
          projectX(1140),
          projectY(95),
          height * 0.65,
        );
        light.addColorStop(0, "rgba(255,206,171," + 0.3 * dawn + ")");
        light.addColorStop(1, "rgba(255,206,171,0)");
        context.fillStyle = light;
        context.fillRect(0, 0, width, height);
      }
      if (!motion.matches) {
        for (const particle of suspendedParticles) {
          const phase = (particle.offset + elapsed * particle.speed) % 1;
          const y = height * (1.05 - phase * 1.1);
          const x =
            width * particle.x +
            Math.sin(phase * 11 + particle.offset * 8) * 12;
          const alpha =
            Math.sin(phase * Math.PI) * (particle.bubble ? 0.53 : 0.29);
          context.beginPath();
          const radius = particle.bubble
            ? 1.8 + particle.offset * 1.55
            : 0.55 + particle.offset * 0.65;
          context.arc(x, y, radius, 0, Math.PI * 2);
          if (particle.bubble) {
            context.lineWidth = 0.7;
            context.strokeStyle = "rgba(209,236,233," + alpha + ")";
            context.stroke();
            context.beginPath();
            context.arc(
              x - radius * 0.26,
              y - radius * 0.36,
              0.45,
              0,
              Math.PI * 2,
            );
            context.fillStyle = "rgba(239,251,240," + alpha + ")";
            context.fill();
          } else {
            context.fillStyle = "rgba(220,232,205," + alpha + ")";
            context.fill();
          }
        }
      }
      if (!motion.matches && progress < 1) {
        context.lineCap = "round";
        const rise = ease(progress);
        for (const particle of particles) {
          const { spread, delay, depth } = particle;
          const drift = (elapsed * (0.15 + depth * 0.08) + delay) % 1;
          const x =
            width * (width < 700 ? 0.6 : 0.64) +
            spread * (width * (0.045 + rise * 0.24)) +
            Math.sin(elapsed * 1.35 + delay * 19) * 18;
          const y =
            height *
            (0.79 -
              drift * (0.08 + depth * 0.13) -
              rise * (0.2 + depth * 0.57));
          const size = Math.max(0.8, artScale * (1.1 + depth * (4 + rise * 9)));
          const alpha =
            Math.sin(drift * Math.PI) * (1 - progress) * (0.25 + depth * 0.55);
          context.strokeStyle = "rgba(222,244,239," + alpha + ")";
          context.lineWidth = 0.85;
          context.beginPath();
          context.arc(x, y, size, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }
    if (progress === 1) overlay.dataset.phase = "dawn";
    if (!motion.matches) schedule();
  }

  lift.addEventListener("click", trigger);
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", schedule);
  resize();

  return {
    ready: waterPlate.decode().catch(() => {}),
    trigger,
    remove() {
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      for (const property of [
        "--foam-camera-x",
        "--foam-camera-y",
        "--foam-camera-scale",
      ]) {
        stage.style.removeProperty(property);
      }
      overlay.remove();
    },
  };
}
