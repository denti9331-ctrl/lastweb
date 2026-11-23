import {
  clipDoorOutside,
  doorCamera,
  makeChimneySmoke,
  makeForestLeaves,
  makeForestPlate,
  mountVillageLights,
  paintChimneySmoke,
  paintOutdoorAsh,
} from "./outdoor-effects.js?v=3";

const width = 1672;
const height = 941;
const actions = [
  { label: "Click", x: 1085, y: 568 },
  { label: "", x: 0, y: 0 },
  { label: "노크", x: 1390, y: 467 },
  { label: "이불 내리기", x: 1290, y: 605 },
  { label: "문가", x: 1440, y: 570 },
  { label: "숲길", x: 1030, y: 887 },
];

const limit = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const t = limit(value);
  return t * t * (3 - 2 * t);
};

function light(context, x, y, rx, ry, color, intensity) {
  context.save();
  context.translate(x, y);
  context.scale(rx, ry);
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, "rgba(" + color + "," + limit(intensity) + ")");
  gradient.addColorStop(
    0.38,
    "rgba(" + color + "," + limit(intensity * 0.42) + ")",
  );
  gradient.addColorStop(1, "rgba(" + color + ",0)");
  context.fillStyle = gradient;
  context.fillRect(-1, -1, 2, 2);
  context.restore();
}

const hearthAsh = Array.from({ length: 17 }, (_, index) => ({
  offset: (index * 0.618034) % 1,
  life: 2.5 + (index % 7) * 0.42,
  x: 967 + ((index * 17) % 55) - 27,
  rise: 82 + ((index * 29) % 105),
  radius: 0.65 + (index % 5) * 0.29,
}));

function paintHearthAsh(context, time) {
  context.save();
  for (const { offset, life, x, rise, radius } of hearthAsh) {
    const phase = (time / life + offset) % 1;
    const px = x + Math.sin(phase * 7 + offset * 18) * (8 + phase * 15);
    const py = 630 - phase * rise;
    const alpha = Math.sin(Math.PI * phase);
    context.fillStyle =
      phase < 0.42
        ? "rgba(231,156,96," + alpha * 0.5 + ")"
        : "rgba(176,158,143," + alpha * 0.33 + ")";
    context.beginPath();
    context.ellipse(px, py, radius, radius * 0.65, phase * 4, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

const roomAsh = Array.from({ length: 47 }, (_, index) => ({
  x: (index * 0.618034 + 0.015) % 1,
  offset: (index * 0.381966 + 0.21) % 1,
  life: 13 + (index % 8) * 1.4,
  radius: 0.45 + (index % 6) * 0.19,
}));

function paintRoomAsh(context, time, viewWidth, viewHeight) {
  context.save();
  for (const { x, offset, life, radius } of roomAsh) {
    const phase = (time / life + offset) % 1;
    const drift = Math.sin(phase * 5 + offset * 13) * (7 + radius * 9);
    const px = viewWidth * x + drift;
    const py = viewHeight * (1.08 - phase * 1.16);
    const alpha = Math.sin(phase * Math.PI) * (0.25 + radius * 0.11);
    context.fillStyle = "rgba(211,181,151," + alpha + ")";
    context.beginPath();
    context.ellipse(px, py, radius, radius * 0.58, phase * 5, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function paintFire(context, time, x, y) {
  const flicker =
    0.25 +
    0.055 * Math.sin(time * 5.8) +
    0.035 * Math.sin(time * 8.75 + 1.2) +
    0.019 * Math.sin(time * 16.1);
  const drift = Math.sin(time * 3.15) * 9;
  context.globalCompositeOperation = "screen";
  light(context, x + drift, y, 192, 158, "240,144,75", flicker);
  light(
    context,
    x - 22 + drift * 0.6,
    y + 5,
    57,
    64,
    "255,183,104",
    flicker * 0.56,
  );
  light(
    context,
    x + 52 + drift * 1.4,
    y + 136,
    330,
    73,
    "215,125,74",
    flicker * 0.63,
  );
  context.globalCompositeOperation = "source-over";
  return flicker;
}

function makePatch(
  context,
  image,
  [x, y, w, h],
  dx,
  dy,
  opacity,
  rotation = 0,
) {
  if (!image?.naturalWidth || opacity <= 0) return;
  const sx = image.naturalWidth / width,
    sy = image.naturalHeight / height;
  context.save();
  context.translate(x + w / 2 + dx, y + h / 2 + dy);
  context.rotate(rotation);
  context.beginPath();
  context.ellipse(0, 0, w / 2, h / 2, 0, 0, 2 * Math.PI);
  context.clip();
  context.globalAlpha = opacity;
  context.drawImage(
    image,
    x * sx,
    y * sy,
    w * sx,
    h * sy,
    -w / 2,
    -h / 2,
    w,
    h,
  );
  context.restore();
}

const basketOutline = new Path2D(
  "M1020 511 Q1025 502 1036 503 C1039 482 1048 467 1062 461 L1068 466 C1050 480 1047 493 1046 502 Q1066 494 1085 499 L1088 485 L1086 475 Q1088 471 1094 472 L1099 476 L1098 487 Q1100 493 1110 497 L1116 503 C1112 484 1098 462 1083 456 L1086 450 C1107 457 1121 482 1125 504 Q1132 502 1137 508 L1130 524 Q1129 548 1117 571 Q1086 582 1048 575 Q1032 573 1028 557 Z",
);

function makeForestMist() {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  const texture = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const u = x / (canvas.width - 1),
        v = y / (canvas.height - 1);
      const spine =
        0.51 + 0.09 * Math.sin(u * 10) + 0.053 * Math.sin(u * 22 + 1);
      const band = Math.exp(-((v - spine) ** 2) / 0.045);
      const ragged =
        0.55 +
        0.22 * Math.sin(u * 19 + v * 13) +
        0.13 * Math.sin(u * 44 - v * 19);
      const fade =
        Math.sin(Math.PI * u) ** 0.75 * Math.sin(Math.PI * v) ** 0.52;
      const i = (y * canvas.width + x) * 4;
      texture.data[i] = 193;
      texture.data[i + 1] = 195;
      texture.data[i + 2] = 183;
      texture.data[i + 3] = 255 * band * ragged * fade;
    }
  }
  context.putImageData(texture, 0, 0);
  return canvas;
}

function paintForestMist(context, texture, time, door) {
  const bands = door
    ? [
        [-230, 478, 1020, 218, 0.22, 0.24],
        [-235, 633, 1390, 147, 0.45, 0.48],
        [-210, 744, 1700, 123, 0.79, 0.58],
      ]
    : [
        [470, 345, 1110, 207, 0.21, 0.23],
        [370, 523, 1185, 143, 0.43, 0.34],
        [-220, 701, 1640, 142, 0.68, 0.43],
      ];
  context.save();
  bands.forEach(([x, y, w, h, speed, opacity], i) => {
    const shift = Math.sin(time * speed + i * 1.4) * (74 + i * 34);
    context.globalAlpha = opacity * (0.92 + Math.sin(time * 0.36 + i) * 0.08);
    context.drawImage(
      texture,
      x + shift,
      y + Math.sin(time * 0.32 + i) * 8,
      w,
      h,
    );
  });
  context.restore();
}

function makeCapeMotion([left, top, w, h], amplitude) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  const fade = context.createLinearGradient(w * 0.16, 0, w * 0.46, 0);
  fade.addColorStop(0, "transparent");
  fade.addColorStop(1, "black");
  const matched = document.createElement("canvas");
  matched.width = w;
  matched.height = h;
  const material = matched.getContext("2d");
  let prepared = false;
  const copyArtwork = (ctx, img) => {
    const sx = img.naturalWidth / width,
      sy = img.naturalHeight / height;
    ctx.drawImage(img, left * sx, top * sy, w * sx, h * sy, 0, 0, w, h);
  };
  return (target, cutout, base, time) => {
    if (!cutout?.naturalWidth || !base?.naturalWidth) return;
    if (!prepared) {
      copyArtwork(material, cutout);
      const fabric = material.getImageData(0, 0, w, h);
      copyArtwork(context, base);
      const original = context.getImageData(0, 0, w, h).data;
      for (let i = 0; i < fabric.data.length; i += 4) {
        if (fabric.data[i + 3] === 0) continue;
        const redness = original[i] - original[i + 1];
        if (redness < 9) continue;
        for (let c = 0; c < 3; c++)
          fabric.data[i + c] =
            fabric.data[i + c] * 0.24 + original[i + c] * 0.76;
      }
      material.putImageData(fabric, 0, 0);
      prepared = true;
    }
    context.clearRect(0, 0, w, h);
    for (let offset = 0; offset < w; offset += 7) {
      const strip = Math.min(7, w - offset);
      const free = smooth((offset - w * 0.24) / (w * 0.73));
      const wave =
        (Math.sin(time * 1.06 - offset * 0.018) +
          Math.sin(time * 1.48 - offset * 0.026 + 1) * 0.24) *
        amplitude;
      context.drawImage(
        matched,
        offset,
        0,
        strip,
        h,
        offset,
        free * wave,
        strip,
        h,
      );
    }
    context.globalCompositeOperation = "destination-in";
    context.fillStyle = fade;
    context.fillRect(0, 0, w, h);
    context.globalCompositeOperation = "source-over";
    target.drawImage(canvas, left, top);
  };
}

const basketHands = new Path2D(
  "M986 421 C1008 432 1027 438 1053 441 C1068 442 1081 445 1087 452 " +
    "C1089 457 1089 465 1085 466 C1082 468 1080 465 1079 465 C1078 470 1074 471 1072 468 " +
    "C1070 473 1065 472 1064 469 C1059 473 1056 470 1057 465 C1048 464 1044 459 1038 455 " +
    "C1017 453 998 451 986 446 Z " +
    "M1178 521 C1167 520 1157 516 1148 512 C1140 507 1134 506 1129 507 " +
    "C1127 505 1124 506 1123 508 C1127 511 1131 513 1132 517 C1131 520 1127 522 1122 523 " +
    "L1121 527 Q1124 530 1129 528 Q1127 533 1132 534 C1137 536 1144 533 1150 532 " +
    "C1159 536 1169 541 1178 543 Z",
);

function makeBasketSwing() {
  const x = 1009,
    y = 440,
    w = 145,
    h = 145;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const layer = canvas.getContext("2d");
  let ready = false;
  return (context, picture, angle) => {
    if (!picture?.naturalWidth) return;
    if (!ready) {
      const sx = picture.naturalWidth / width,
        sy = picture.naturalHeight / height;
      layer.translate(-x, -y);
      layer.save();
      layer.clip(basketOutline);
      layer.drawImage(picture, x * sx, y * sy, w * sx, h * sy, x, y, w, h);
      layer.restore();
      layer.globalCompositeOperation = "destination-out";
      layer.fill(basketHands);
      ready = true;
    }
    context.save();
    context.translate(1083, 452);
    context.rotate(angle);
    context.drawImage(canvas, x - 1083, y - 452);
    context.restore();

    context.save();
    context.clip(basketHands);
    context.drawImage(picture, 0, 0, width, height);
    context.restore();
  };
}

const rescueProps = [
  {
    label: "쓰러진 의자",
    x: 638,
    y: 665,
    pivot: [627, 716],
    area: [500, 586, 272, 182],
    outline: new Path2D(
      "M521 699 Q530 695 546 702 Q543 662 568 627 L561 623 Q546 615 556 607 Q564 601 580 609 L657 644 Q670 634 686 641 Q708 648 710 676 L705 704 L729 715 Q742 728 726 733 L696 719 Q679 749 653 748 Q638 744 630 723 L541 718 Q514 715 521 699 Z M568 669 L581 673 L570 703 L552 702 Z M610 681 L639 697 L632 707 L602 704 Z",
    ),
  },
  {
    label: "떨어진 금속 컵",
    x: 775,
    y: 770,
    pivot: [778, 788],
    area: [719, 724, 122, 95],
    outline: new Path2D(
      "M736 788 Q728 767 738 748 Q747 729 758 736 Q765 740 769 744 L799 748 Q813 754 811 771 Q811 782 803 787 L811 793 L806 798 L797 791 L760 792 Q748 800 736 788 Z",
    ),
  },
];

function paintObject(context, image, outline, [x, y], dx, dy, angle) {
  if (!image?.naturalWidth) return;
  context.save();
  context.translate(x + dx, y + dy);
  context.rotate(angle);
  context.translate(-x, -y);
  context.clip(outline, "evenodd");
  context.drawImage(image, 0, 0, width, height);
  context.restore();
}

function makeCastShadows(source) {
  const figures = [
    [0.13, 0.01, 0.36, 0.98, 925, 842, 1],
    [0.5, 0.17, 0.32, 0.82, 1215, 840, -1],
  ];
  return figures.map(([x, y, w, h, footX, footY, direction]) => {
    const mask = document.createElement("canvas");
    mask.width = 132;
    mask.height = 180;
    const context = mask.getContext("2d");
    let ready = false;
    return (target, time, strength) => {
      if (!source.naturalWidth) return;
      if (!ready) {
        context.drawImage(
          source,
          x * source.naturalWidth,
          y * source.naturalHeight,
          w * source.naturalWidth,
          h * source.naturalHeight,
          0,
          0,
          132,
          180,
        );
        context.globalCompositeOperation = "source-in";
        context.fillStyle = "#100c0a";
        context.fillRect(0, 0, 132, 180);
        ready = true;
      }
      const flicker =
        Math.sin(time * 5.8) * 0.032 + Math.sin(time * 8.75 + 1.2) * 0.018;
      target.save();
      target.translate(footX, footY);
      target.transform(
        0.75,
        0,
        direction * (0.77 + flicker),
        -0.58 - flicker,
        0,
        0,
      );
      target.globalAlpha = 0.18 + strength * 0.25;
      target.filter = "blur(3.2px)";
      target.drawImage(mask, -66, -180);
      target.restore();
    };
  });
}

function makeReveal(x, y, w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const buffer = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const edge = mask.getContext("2d");
  edge.translate(w / 2, h / 2);
  edge.scale(w / 2, h / 2);
  const alpha = edge.createRadialGradient(0, 0, 0.78, 0, 0, 1);
  alpha.addColorStop(0, "black");
  alpha.addColorStop(1, "transparent");
  edge.fillStyle = alpha;
  edge.fillRect(-1, -1, 2, 2);
  let imageReady = false;
  return (context, image, opacity) => {
    if (!image?.naturalWidth || opacity <= 0) return;
    if (!imageReady) {
      const sx = image.naturalWidth / width,
        sy = image.naturalHeight / height;
      buffer.drawImage(image, x * sx, y * sy, w * sx, h * sy, 0, 0, w, h);
      buffer.globalCompositeOperation = "destination-in";
      buffer.drawImage(mask, 0, 0);
      imageReady = true;
    }
    context.save();
    context.globalAlpha = opacity;
    context.drawImage(canvas, x, y);
    context.restore();
  };
}

export function createRedIllustrationEffects(stage, finalLine) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let scene;
  let audio;
  let textFrame = 0;
  const storyText = stage.querySelector("#story > p");

  function syncText() {
    if (!storyText || textFrame) return;
    textFrame = requestAnimationFrame(() => {
      textFrame = 0;
      const words = [...storyText.querySelectorAll("em")];
      storyText.querySelector(".red-line-fog")?.remove();
      if (!words.length) return;
      const font = parseFloat(getComputedStyle(storyText).fontSize);
      const left = Math.min(...words.map((word) => word.offsetLeft));
      const top = Math.min(...words.map((word) => word.offsetTop));
      const right = Math.max(
        ...words.map((word) => word.offsetLeft + word.offsetWidth),
      );
      const bottom = Math.max(
        ...words.map((word) => word.offsetTop + word.offsetHeight),
      );
      const fog = document.createElement("span");
      fog.className = "red-line-fog";
      fog.setAttribute("aria-hidden", "true");
      fog.style.left = left - font * 2.1 + "px";
      fog.style.top = top - font * 1.1 + "px";
      fog.style.width = right - left + font * 4.2 + "px";
      fog.style.height = bottom - top + font * 2.2 + "px";
      storyText.prepend(fog);
    });
  }

  const textObserver = new ResizeObserver(syncText);
  if (storyText) textObserver.observe(storyText);
  document.fonts.ready.then(syncText);

  function knock() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      audio ??= new Audio();
      audio
        .resume()
        .then(() => {
          const t = audio.currentTime;
          const duration = 0.145;
          const buffer = audio.createBuffer(
            1,
            Math.ceil(audio.sampleRate * duration),
            audio.sampleRate,
          );
          const signal = buffer.getChannelData(0);
          for (let i = 0; i < signal.length; i++) {
            const elapsed = i / audio.sampleRate;
            const attack = Math.min(1, elapsed * 900);
            const body = Math.sin(
              2 * Math.PI * (112 * elapsed - 83 * elapsed * elapsed),
            );
            signal[i] =
              attack *
              (body * 0.57 * Math.exp(-elapsed * 33) +
                (Math.random() * 2 - 1) * 0.39 * Math.exp(-elapsed * 65));
          }
          const sound = audio.createBufferSource();
          sound.buffer = buffer;
          const wood = audio.createBiquadFilter();
          wood.type = "lowpass";
          wood.frequency.value = 790;
          const volume = audio.createGain();
          volume.gain.value = 0.32;
          sound.connect(wood).connect(volume).connect(audio.destination);
          sound.start(t);
        })
        .catch(() => {});
    } catch {}
  }

  function clear() {
    scene?.remove();
    scene = undefined;
  }

  function setScene(index) {
    if (scene?.index === index) return;
    clear();
    const action = actions[index];
    if (!action) return;

    const layer = document.createElement("div");
    layer.className = "red-scene-effects";
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("2d");
    if (!context) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "red-scene-action";
    button.textContent = action.label;
    button.hidden = !action.label;
    if (index === 0) {
      button.classList.add("red-basket-click");
      const label = document.createElement("span");
      label.textContent = action.label;
      button.replaceChildren(label);
    }
    const caption = document.createElement("p");
    caption.className = "red-scene-caption";
    caption.setAttribute("role", "status");
    caption.hidden = true;
    const picture = [...stage.querySelectorAll(":scope > img.picture")].find(
      (img) => img.style.visibility === "visible",
    );
    const reveal =
      index === 1
        ? makeForestPlate([170, 285, 760, 645], 66)
        : index === 3
          ? makeReveal(1070, 438, 380, 222)
          : null;
    const alternate = reveal && new Image();
    if (alternate)
      alternate.src =
        index === 1
          ? "images/scenes/02-stranger-without-wolf.webp"
          : "images/scenes/04-bed.webp";
    const detailPlate = index === 0 ? new Image() : null;
    const replaceDetail = index === 0 ? makeReveal(994, 424, 170, 178) : null;
    const swingBasket = index === 0 ? makeBasketSwing() : null;
    const outdoors = index === 1 || index === 2 || index === 5;
    const mist = index === 1 || index === 2 ? makeForestMist() : null;
    const smoke = index === 5 ? makeChimneySmoke() : null;
    const leaves = index === 1 ? makeForestLeaves() : null;
    const canopy = leaves && new Image();
    const canopyBackground = leaves && new Image();
    if (canopy) {
      canopy.src = "images/scenes/02-stranger-canopy-layer.webp";
      canopyBackground.src = "images/scenes/02-stranger-canopy-clean.webp";
    }
    const capeConfig =
      index === 1
        ? {
            name: "02-stranger",
            crop: [1080, 481, 309, 350],
            restore: [1059, 475, 344, 389],
            amplitude: 5.4,
          }
        : index === 5
          ? {
              name: "06-return",
              crop: [1072, 607, 194, 226],
              restore: [1060, 597, 215, 244],
              amplitude: 4.1,
            }
          : null;
    const swayCape =
      capeConfig && makeCapeMotion(capeConfig.crop, capeConfig.amplitude);
    const cape = capeConfig && new Image();
    const capeBackground = capeConfig && new Image();
    const restoreCapeBackground =
      capeConfig && makeReveal(...capeConfig.restore);
    if (capeConfig) {
      cape.src = "images/scenes/" + capeConfig.name + "-cape-layer.webp";
      capeBackground.src =
        "images/scenes/" + capeConfig.name + "-cape-clean.webp";
    }
    const actors = index === 0 ? new Image() : null;
    const shadows = actors ? makeCastShadows(actors) : [];
    if (detailPlate)
      detailPlate.src = "images/scenes/01-promise-basket-clean.webp";
    if (actors) actors.src = "images/illustrations/01-promise.webp";
    const propPlate = index === 4 ? new Image() : null;
    if (propPlate) propPlate.src = "images/scenes/05-rescue-props-clean.webp";
    const props = propPlate
      ? rescueProps.map((spec) => {
          const control = document.createElement("button");
          control.type = "button";
          control.className = "red-scene-action red-prop-control";
          control.setAttribute("aria-label", spec.label);
          return {
            ...spec,
            control,
            restore: makeReveal(...spec.area),
            started: null,
          };
        })
      : [];
    stage.append(layer);
    layer.append(canvas, button, caption, ...props.map((prop) => prop.control));
    const village = index === 5 ? mountVillageLights(layer, schedule) : null;

    let sizeX, sizeY, dpr, scale, left, top;
    let frame = 0,
      lastFrame = 0,
      activated = null;
    let basketAngle = 0,
      basketVelocity = 0;
    let pointerStart = null,
      pull = 0;
    const origin = performance.now();

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    }

    function resize() {
      sizeX = stage.clientWidth;
      sizeY = stage.clientHeight;
      dpr = Math.min(devicePixelRatio, 1.25);
      canvas.width = Math.round(sizeX * dpr);
      canvas.height = Math.round(sizeY * dpr);
      const cover = Math.max(sizeX / width, sizeY / height);
      const position =
        (parseFloat(
          picture ? getComputedStyle(picture).objectPosition : "50%",
        ) || 50) / 100;
      scale = cover * 1.03;
      left = (sizeX - width * cover) * position * 1.03 - sizeX * 0.015;
      top = (sizeY - height * scale) / 2;
      button.style.left =
        Math.max(52, Math.min(sizeX - 52, left + action.x * scale)) + "px";
      button.style.top =
        Math.max(92, Math.min(sizeY * 0.81, top + action.y * scale)) + "px";
      for (const prop of props) {
        const x = left + prop.x * scale,
          y = top + prop.y * scale;
        prop.control.hidden =
          x < 12 || x > sizeX - 12 || y < 12 || y > sizeY - 12;
        prop.control.style.left = x + "px";
        prop.control.style.top = y + "px";
      }
      village?.resize(left, top, scale, sizeX, sizeY);
      schedule();
    }

    function paintSceneAsh(time, x, y) {
      context.save();
      context.translate(x - 974, y - 616);
      paintHearthAsh(context, time);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintRoomAsh(context, time, sizeX, sizeY);
      context.restore();
    }

    function paintRescueProps(now) {
      if (!propPlate?.naturalWidth) return;
      props.forEach((prop, index) => {
        if (prop.started === null) return;
        const time = (now - prop.started) / 1000;
        if (time >= 1.12) {
          prop.started = null;
          return;
        }
        const blend = Math.min(
          smooth(time / 0.075),
          smooth((1.12 - time) / 0.15),
        );
        const angle =
          Math.sin(time * (index === 0 ? 15 : 10)) *
          Math.exp(-time * 3.1) *
          (index === 0 ? 0.16 : 0.42);
        const bounce =
          index === 1
            ? -Math.abs(Math.sin(time * 9)) * Math.exp(-time * 4) * 31
            : 0;
        prop.restore(context, propPlate, blend);
        if (bounce < 0)
          light(
            context,
            prop.x + 4,
            prop.y + 21,
            35,
            8,
            "24,18,15",
            blend * 0.31,
          );
        paintObject(
          context,
          picture,
          prop.outline,
          prop.pivot,
          0,
          bounce,
          angle,
        );
      });
    }

    function activate() {
      if (index === 0) {
        basketVelocity = Math.min(1.08, basketVelocity + 0.83);
        schedule();
        return;
      }
      if (activated !== null) return;
      if (index === 2) knock();
      activated = performance.now();
      if (document.activeElement === button)
        stage.querySelector("#read")?.focus({ preventScroll: true });
      button.hidden = true;
      schedule();
    }

    function draw(now) {
      frame = 0;
      if (!motion.matches && now - lastFrame < 31) return schedule();
      const dt = Math.min(0.042, (now - lastFrame) / 1000);
      lastFrame = now;
      const reduced = motion.matches;
      const time = reduced ? 0 : (now - origin) / 1000;
      const elapsed = activated === null ? 0 : now - activated;
      const progress =
        activated === null ? 0 : reduced ? 1 : smooth(elapsed / 1650);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, sizeX, sizeY);
      if (index === 2 && activated !== null && !reduced) {
        const camera = doorCamera(
          sizeX,
          sizeY,
          left + 1370 * scale,
          top + 462 * scale,
          smooth((elapsed - 210) / 2050),
        );
        context.translate(camera.x + camera.panX, camera.y + camera.panY);
        context.scale(camera.zoom, camera.zoom);
        context.translate(-camera.x, -camera.y);
        if (picture)
          picture.style.transform =
            "translate(" +
            camera.cssX +
            "px," +
            camera.cssY +
            "px) scale(" +
            camera.zoom +
            ")";
      }
      context.translate(left, top);
      context.scale(scale, scale);
      if (!reduced && cape?.naturalWidth && capeBackground?.naturalWidth) {
        restoreCapeBackground(context, capeBackground, 1);
        swayCape(context, cape, picture, time);
      }

      if (index === 0) {
        const flicker = paintFire(context, time, 974, 616);
        for (const shadow of shadows) shadow(context, time, flicker);
        if (!reduced) paintSceneAsh(time, 974, 616);
        if (!reduced && detailPlate.naturalWidth) {
          basketVelocity += (-44 * basketAngle - 5.1 * basketVelocity) * dt;
          basketAngle += basketVelocity * dt;
          if (Math.abs(basketAngle) + Math.abs(basketVelocity) > 0.003) {
            const blend = smooth(Math.abs(basketAngle) / 0.023);
            replaceDetail(context, detailPlate, blend);
            swingBasket(context, picture, basketAngle);
          }
        }
      } else if (index === 1) {
        reveal(context, alternate, progress);
        if (!reduced) leaves(context, canopyBackground, canopy, time);
        paintForestMist(context, mist, time, false);
      } else if (index === 2) {
        const flicker = 0.18 + Math.sin(time * 3.5) * 0.035 + progress * 0.53;
        context.globalCompositeOperation = "screen";
        light(context, 1350, 366, 105, 132, "247,158,84", flicker);
        if (progress) {
          light(context, 1395, 470, 164, 251, "244,181,119", progress * 0.3);
          light(context, 1383, 706, 139, 62, "248,170,103", progress * 0.36);
        }
        context.globalCompositeOperation = "source-over";
        context.save();
        clipDoorOutside(context);
        paintForestMist(context, mist, time, true);
        if (!reduced) paintOutdoorAsh(context, time, width, height);
        context.restore();
      } else if (index === 3) {
        const breath = Math.sin(time * 2) * 1.6;
        if (!reduced)
          makePatch(
            context,
            picture,
            [1145, 550, 290, 234],
            0,
            breath * (1 - progress),
            0.75,
          );
        reveal(context, alternate, Math.max(progress, pull * 0.74));
      } else if (index === 4) {
        light(context, 1145, 534, 399, 284, "18,14,13", 0.38 * (1 - progress));
        if (progress) {
          context.globalCompositeOperation = "screen";
          light(context, 1444, 447, 223, 313, "252,201,151", progress * 0.31);
          light(context, 1194, 667, 448, 162, "248,194,145", progress * 0.24);
          context.globalCompositeOperation = "source-over";
        }
        paintFire(context, time, 891, 542);
        if (!reduced) {
          paintRescueProps(now);
          paintSceneAsh(time, 891, 542);
        }
      } else {
        light(
          context,
          850 + Math.sin(time * 0.6) * 44,
          640,
          420,
          121,
          "180,181,173",
          0.058,
        );
        village.paint(context, dt, reduced, light);
        if (!reduced) paintChimneySmoke(context, smoke, time);
        if (activated !== null && caption.hidden) {
          caption.textContent = finalLine;
          caption.hidden = false;
        }
      }
      if (!reduced && outdoors && index !== 2) {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintOutdoorAsh(context, time, sizeX, sizeY);
      }
      if (!reduced) schedule();
    }

    button.addEventListener("click", activate);
    for (const prop of props)
      prop.control.addEventListener("click", () => {
        prop.started = performance.now();
        schedule();
      });
    if (index === 3) {
      button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        pointerStart = event.clientY;
        button.setPointerCapture(event.pointerId);
      });
      button.addEventListener("pointermove", (event) => {
        if (pointerStart === null) return;
        pull = limit((event.clientY - pointerStart) / 68);
        if (pull >= 0.9) activate();
        schedule();
      });
      const reset = () => {
        pointerStart = null;
        if (activated === null) pull = 0;
        schedule();
      };
      button.addEventListener("pointerup", reset);
      button.addEventListener("pointercancel", reset);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    for (const image of [
      alternate,
      detailPlate,
      actors,
      propPlate,
      cape,
      capeBackground,
      canopy,
      canopyBackground,
    ])
      image?.addEventListener("load", schedule);
    resize();

    scene = {
      index,
      cue(line) {
        if (index === 1 && line === 2) activate();
      },
      remove() {
        observer.disconnect();
        document.removeEventListener("visibilitychange", schedule);
        motion.removeEventListener("change", schedule);
        for (const image of [
          alternate,
          detailPlate,
          actors,
          propPlate,
          cape,
          capeBackground,
          canopy,
          canopyBackground,
        ])
          image?.removeEventListener("load", schedule);
        cancelAnimationFrame(frame);
        if (index === 2 && picture) {
          picture.style.transform = "none";
          picture.style.removeProperty("transform-origin");
        }
        layer.remove();
      },
    };
  }

  window.addEventListener(
    "pagehide",
    () => {
      clear();
      textObserver.disconnect();
      cancelAnimationFrame(textFrame);
      audio?.close().catch(() => {});
    },
    { once: true },
  );
  return {
    clear,
    setScene,
    syncText,
    cue(line) {
      scene?.cue(line);
    },
  };
}
