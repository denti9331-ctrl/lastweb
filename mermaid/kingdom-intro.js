const artwork = { width: 1672, height: 941 };

const layerSpecs = [
  {
    asset: "hair",
    x: 205,
    y: 211,
    width: 372,
    height: 342,
    anchor: "right",
    amplitude: 12,
    phase: 0.4,
  },
  {
    asset: "kelp",
    x: 0,
    y: 475,
    width: 354,
    height: 466,
    anchor: "bottom",
    amplitude: 15,
    phase: 1.8,
  },
  {
    asset: "kelp",
    x: 625,
    y: 470,
    width: 1047,
    height: 471,
    anchor: "bottom",
    amplitude: 17,
    phase: 3.1,
  },
];

function makeLayer(spec) {
  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const context = canvas.getContext("2d");
  let seam;
  if (spec.anchor === "right") {
    seam = context.createLinearGradient(spec.width - 72, 0, spec.width, 0);
    seam.addColorStop(0, "#000");
    seam.addColorStop(0.5, "#000");
    seam.addColorStop(1, "transparent");
  }
  return { ...spec, canvas, context, seam };
}

function warpLayer(layer, image, time, reduced) {
  const { x, y, width, height, anchor, amplitude, phase, context, seam } =
    layer;
  context.clearRect(0, 0, width, height);
  if (reduced) {
    context.drawImage(image, x, y, width, height, 0, 0, width, height);
  } else {
    const hair = anchor === "right";
    const length = hair ? width : height;
    for (let offset = 0; offset < length; offset += 10) {
      const band = Math.min(10, length - offset);
      const flexibility = Math.cos(((offset / length) * Math.PI) / 2);
      const shift =
        Math.sin(time * 0.83 + phase + offset * 0.01) * flexibility * amplitude;
      if (hair)
        context.drawImage(
          image,
          x + offset,
          y,
          band,
          height,
          offset,
          shift,
          band,
          height,
        );
      else
        context.drawImage(
          image,
          x,
          y + offset,
          width,
          band,
          shift,
          offset,
          width,
          band,
        );
    }
  }
  if (seam) {
    context.globalCompositeOperation = "destination-in";
    context.fillStyle = seam;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
  }
}

function drawMoonlight(context, time) {
  context.save();
  context.globalCompositeOperation = "screen";
  context.translate(1025, 60);
  context.rotate(-0.3 + Math.sin(time * 0.64) * 0.19);
  context.scale(97 + Math.sin(time * 0.75) * 18, 410);
  const light = context.createRadialGradient(0, 0.48, 0, 0, 0.48, 1);
  light.addColorStop(0, "rgba(220,220,194,.31)");
  light.addColorStop(0.46, "rgba(202,215,198,.14)");
  light.addColorStop(1, "rgba(192,220,211,0)");
  context.fillStyle = light;
  context.fillRect(-1, -0.52, 2, 2);
  context.restore();
}

const bubbles = Array.from({ length: 23 }, (_, index) => ({
  x: 80 + ((index * 601) % 1512),
  offset: (index * 0.618034 + 0.15) % 1,
  speed: 0.037 + (index % 5) * 0.012,
  radius: 1.1 + (index % 7) * 0.38,
}));

function drawBubbles(context, time) {
  context.save();
  context.lineWidth = 0.85;
  context.strokeStyle = "#d6ebe8";
  context.fillStyle = "#e7f2eb";
  for (const { x, offset, speed, radius } of bubbles) {
    const rise = (offset + time * speed) % 1;
    const centerX = x + Math.sin(rise * 8 + offset * 25) * (6 + radius * 3);
    const centerY = 1000 - rise * 1050;
    context.globalAlpha = Math.sin(rise * Math.PI) * 0.58;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(
      centerX - radius * 0.35,
      centerY - radius * 0.32,
      0.55,
      0,
      2 * Math.PI,
    );
    context.fill();
  }
  context.restore();
}

export function mountKingdomIntro(stage) {
  const picture = stage.querySelector('img[src$="01-depths-clean.webp"]');
  const canvas = document.createElement("canvas");
  canvas.className = "mermaid-kingdom";
  canvas.setAttribute("aria-hidden", "true");
  const context = canvas.getContext("2d");
  if (!picture || !context) return { remove() {} };
  stage.prepend(canvas);

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const layers = layerSpecs.map(makeLayer);
  const images = Object.fromEntries(
    ["hair", "kelp"].map((name) => {
      const image = new Image();
      image.src = "assets/layers/depths-" + name + ".webp";
      return [name, image];
    }),
  );
  const origin = performance.now();
  let frame = 0,
    lastFrame = 0,
    width,
    height,
    ratio,
    scale,
    left,
    top,
    artworkFilter;

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    ratio = Math.min(devicePixelRatio, 1.25);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    scale = Math.max(width / artwork.width, height / artwork.height) * 1.04;
    left = (width - artwork.width * scale) / 2;
    top = (height - artwork.height * scale) / 2;
    artworkFilter = getComputedStyle(picture).filter;
    schedule();
  }

  function draw(now) {
    frame = 0;
    if (!motion.matches && now - lastFrame < 31) return schedule();
    lastFrame = now;
    const time = motion.matches ? 0 : (now - origin) / 1000;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.translate(left, top);
    context.scale(scale, scale);
    context.filter = artworkFilter;
    for (const layer of layers) {
      const image = images[layer.asset];
      if (
        !image.naturalWidth ||
        left + (layer.x + layer.width) * scale <= 0 ||
        left + layer.x * scale >= width
      )
        continue;
      warpLayer(layer, image, time, motion.matches);
      context.drawImage(layer.canvas, layer.x, layer.y);
    }
    context.filter = "none";
    drawMoonlight(context, time);
    if (!motion.matches) {
      drawBubbles(context, time);
      schedule();
    }
  }

  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  for (const image of Object.values(images))
    image.addEventListener("load", schedule);
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", schedule);
  resize();
  return {
    ready: Promise.allSettled(
      Object.values(images).map((image) => image.decode()),
    ),
    remove() {
      observer.disconnect();
      for (const image of Object.values(images))
        image.removeEventListener("load", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      canvas.remove();
    },
  };
}
