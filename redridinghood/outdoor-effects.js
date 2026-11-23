const ash = Array.from({ length: 57 }, (_, i) => ({
  at: (i * 0.618034 + 0.08) % 1,
  start: (i * 0.381966 + 0.17) % 1,
  rate: 0.061 + (i % 8) * 0.009,
  size: 0.85 + (i % 7) * 0.24,
}));

export function paintOutdoorAsh(context, time, width, height) {
  context.save();
  for (const { at, start, rate, size } of ash) {
    const phase = (start + time * rate) % 1;
    const x =
      at * width +
      Math.sin(phase * 7 + start * 13) * (12 + size * 16) +
      (phase - 0.5) * 38;
    const y = (phase * 1.16 - 0.08) * height;
    const alpha = Math.sin(phase * Math.PI) * (0.38 + size * 0.15);
    context.fillStyle = "rgba(10,8,8," + alpha + ")";
    context.beginPath();
    context.ellipse(x, y, size, size * 0.55, phase * 6, 0, 2 * Math.PI);
    context.fill();
  }
  context.restore();
}

const outsideTheRoof = new Path2D(
  "M0 0H1080L903 87 793 173 862 219 949 258 1022 301 1075 380 1068 448 1028 534 980 627 884 722 800 941H0Z",
);

export function clipDoorOutside(context) {
  context.clip(outsideTheRoof);
}

function boundedPan(origin, size, zoom, desired) {
  const left = origin + (-size * 0.015 - origin) * zoom;
  const right = origin + (size * 1.015 - origin) * zoom;
  return Math.max(size + 1 - right, Math.min(-1 - left, desired));
}

export function doorCamera(width, height, targetX, targetY, progress) {
  const zoom = 1 + progress * 0.26;
  const x = Math.max(width * 0.52, Math.min(width * 0.91, targetX));
  const y = Math.max(height * 0.27, Math.min(height * 0.7, targetY));
  const panX = boundedPan(
    x,
    width,
    zoom,
    -(x - width * 0.54) * progress * 0.49,
  );
  const panY = boundedPan(
    y,
    height,
    zoom,
    (height * 0.51 - y) * progress * 0.3,
  );
  return {
    zoom,
    x,
    y,
    panX,
    panY,
    cssX: (panX + (x - width / 2) * (1 - zoom)) / 1.03,
    cssY: (panY + (y - height / 2) * (1 - zoom)) / 1.03,
  };
}

export function makeForestPlate([x, y, w, h], feather) {
  const plate = document.createElement("canvas");
  plate.width = w;
  plate.height = h;
  const brush = plate.getContext("2d");
  const horizontal = brush.createLinearGradient(0, 0, w, 0);
  horizontal.addColorStop(0, "transparent");
  horizontal.addColorStop(feather / w, "black");
  horizontal.addColorStop(1 - feather / w, "black");
  horizontal.addColorStop(1, "transparent");
  const vertical = brush.createLinearGradient(0, 0, 0, h);
  vertical.addColorStop(0, y === 0 ? "black" : "transparent");
  vertical.addColorStop(feather / h, "black");
  vertical.addColorStop(1 - feather / h, "black");
  vertical.addColorStop(1, "transparent");
  let ready = false;
  return (ctx, img, opacity) => {
    if (!img?.naturalWidth || opacity <= 0) return;
    if (!ready) {
      const sx = img.naturalWidth / 1672,
        sy = img.naturalHeight / 941;
      brush.drawImage(img, x * sx, y * sy, w * sx, h * sy, 0, 0, w, h);
      brush.globalCompositeOperation = "destination-in";
      for (const mask of [horizontal, vertical]) {
        brush.fillStyle = mask;
        brush.fillRect(0, 0, w, h);
      }
      ready = true;
    }
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(plate, x, y);
    ctx.restore();
  };
}

export function makeForestLeaves() {
  const parts = [
    { rect: [480, 0, 602, 300], strength: 5.5, phase: 0.3, root: "left" },
    { rect: [1150, 0, 257, 249], strength: 4.3, phase: 2.1, root: "right" },
  ].map((part) => {
    const [x, y, w, h] = part.rect;
    const plate = document.createElement("canvas");
    plate.width = w;
    plate.height = h;
    const brush = plate.getContext("2d");
    const anchor = brush.createLinearGradient(0, 0, w, 0);
    if (part.root === "right") {
      anchor.addColorStop(0, "black");
      anchor.addColorStop(0.73, "black");
      anchor.addColorStop(1, "transparent");
    } else {
      anchor.addColorStop(0, "transparent");
      anchor.addColorStop(0.14, "black");
      anchor.addColorStop(1, "black");
    }
    return {
      ...part,
      x,
      y,
      w,
      h,
      plate,
      brush,
      anchor,
      restore: makeForestPlate(part.rect, 43),
    };
  });
  return (ctx, clean, leaves, time) => {
    if (!clean?.naturalWidth || !leaves?.naturalWidth) return;
    const sx = leaves.naturalWidth / 1672,
      sy = leaves.naturalHeight / 941;
    for (const {
      x,
      y,
      w,
      h,
      plate,
      brush,
      anchor,
      restore,
      strength,
      phase,
    } of parts) {
      restore(ctx, clean, 1);
      brush.clearRect(0, 0, w, h);
      for (let row = 0; row < h; row += 8) {
        const band = Math.min(8, h - row);
        const weight = Math.min(1, row / 190);
        const sway =
          Math.sin(time * 1.15 + phase + row * 0.023) * strength * weight;
        brush.drawImage(
          leaves,
          x * sx,
          (y + row) * sy,
          w * sx,
          band * sy,
          sway,
          row,
          w,
          band,
        );
      }
      brush.globalCompositeOperation = "destination-in";
      brush.fillStyle = anchor;
      brush.fillRect(0, 0, w, h);
      brush.globalCompositeOperation = "source-over";
      ctx.drawImage(plate, x, y);
    }
  };
}

const housePlans = [
  {
    label: "왼쪽 앞집",
    area: [0, 105, 437, 433],
    shape: "0 0, 88% 21%, 100% 100%, 0 100%",
    windows: [
      [166, 288, 39, 67],
      [368, 376, 34, 44],
    ],
  },
  {
    label: "왼쪽 골목집",
    area: [438, 397, 211, 215],
    shape: "0 30%, 70% 0, 100% 42%, 88% 100%, 0 100%",
    windows: [[531, 506, 24, 47]],
  },
  {
    label: "왼쪽 먼 집",
    area: [650, 478, 149, 147],
    shape: "0 22%, 74% 0, 100% 100%, 0 100%",
    windows: [[734, 573, 19, 27]],
  },
  {
    label: "오른쪽 먼 집",
    area: [982, 422, 253, 183],
    shape: "9% 36%, 44% 0, 100% 23%, 100% 100%, 0 100%",
    windows: [
      [1105, 521, 19, 29],
      [1159, 586, 15, 25],
      [997, 564, 14, 23],
    ],
  },
  {
    label: "오른쪽 위층 집",
    area: [1278, 13, 223, 324],
    shape: "31% 0, 100% 0, 100% 93%, 0 100%",
    windows: [[1430, 122, 33, 61]],
  },
  {
    label: "오른쪽 앞집",
    area: [1360, 338, 312, 334],
    shape: "0 33%, 100% 0, 100% 100%, 7% 100%",
    windows: [[1597, 435, 36, 70]],
  },
];

export function mountVillageLights(layer, schedule) {
  const houses = housePlans.map((plan) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "red-house-control";
    button.setAttribute("aria-label", plan.label + " 불빛");
    button.style.clipPath = "polygon(" + plan.shape + ")";
    const item = {
      ...plan,
      button,
      inside: false,
      focused: false,
      pinned: false,
      level: 0,
    };
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") {
        item.inside = true;
        schedule();
      }
    });
    button.addEventListener("pointerleave", () => {
      item.inside = false;
      schedule();
    });
    button.addEventListener("focus", () => {
      item.focused = button.matches(":focus-visible");
      schedule();
    });
    button.addEventListener("blur", () => {
      item.focused = false;
      schedule();
    });
    button.addEventListener("click", (event) => {
      if (event.pointerType !== "mouse") {
        item.pinned = !item.pinned;
        schedule();
      }
    });
    layer.append(button);
    return item;
  });
  return {
    resize(left, top, scale, viewWidth, viewHeight) {
      for (const {
        area: [x, y, w, h],
        button,
      } of houses) {
        button.style.left = left + x * scale + "px";
        button.style.top = top + y * scale + "px";
        button.style.width = w * scale + "px";
        button.style.height = h * scale + "px";
        button.hidden =
          left + (x + w) * scale < 0 ||
          left + x * scale > viewWidth ||
          top + (y + h) * scale < 0 ||
          top + y * scale > viewHeight;
      }
    },
    paint(context, dt, reduced, light) {
      for (const house of houses) {
        const target = house.inside || house.focused || house.pinned ? 1 : 0;
        house.level = reduced
          ? target
          : house.level + (target - house.level) * (1 - Math.exp(-dt * 7));
        if (house.level < 0.01 && target === 0) house.level = 0;
        for (const [x, y, rx, ry] of house.windows) {
          light(context, x, y, rx, ry, "25,20,19", 0.73 * (1 - house.level));
          if (house.level > 0) {
            context.globalCompositeOperation = "screen";
            light(
              context,
              x,
              y,
              rx * 2.2,
              ry * 1.6,
              "245,178,101",
              house.level * 0.47,
            );
            light(
              context,
              x,
              y,
              rx * 0.71,
              ry * 0.82,
              "255,212,144",
              house.level * 0.32,
            );
            context.globalCompositeOperation = "source-over";
          }
        }
      }
    },
  };
}

export function makeChimneySmoke() {
  const wisp = document.createElement("canvas");
  wisp.width = 110;
  wisp.height = 160;
  const brush = wisp.getContext("2d");
  const image = brush.createImageData(wisp.width, wisp.height);
  for (let y = 0; y < wisp.height; y++) {
    const v = y / (wisp.height - 1);
    const center =
      0.55 + 0.11 * Math.sin(v * 5.8) - 0.06 * Math.sin(v * 12 + 1);
    const width = 0.1 + (1 - v) * 0.25;
    for (let x = 0; x < wisp.width; x++) {
      const u = x / (wisp.width - 1);
      const edge = (u - center) / width;
      const fade = Math.sin(Math.PI * v) ** 0.62;
      const turbulence =
        0.72 +
        0.14 * Math.sin(u * 21 + v * 14) +
        0.09 * Math.sin(u * 43 - v * 23) +
        0.05 * Math.sin(u * 71 + v * 52);
      const i = (y * wisp.width + x) * 4;
      image.data[i] = 189;
      image.data[i + 1] = 184;
      image.data[i + 2] = 175;
      image.data[i + 3] =
        255 * Math.exp(-edge * edge * 2.55) * fade * turbulence;
    }
  }
  brush.putImageData(image, 0, 0);
  return wisp;
}

export function paintChimneySmoke(context, texture, time) {
  const chimneys = [
    [474, 86, 0, 0.87],
    [709, 281, 0.3, 1],
    [823, 435, 0.57, 0.47],
    [1111, 356, 0.73, 0.83],
  ];
  for (const [x, y, seed, size] of chimneys) {
    const sway = Math.sin(time * 0.56 + seed * 10);
    context.save();
    context.translate(x, y + 4);
    context.rotate(0.19 + sway * 0.095);
    context.globalAlpha = 0.45;
    context.drawImage(texture, -18 * size, -95 * size, 36 * size, 100 * size);
    context.restore();
    for (let i = 0; i < 4; i++) {
      const phase = (time * (0.15 + seed * 0.028) + i / 4 + seed) % 1;
      const rise = (25 + 130 * phase) * size;
      const drift =
        (15 * phase +
          Math.sin(phase * 6 + time * 0.44 + seed * 16) * 13 * phase) *
        size;
      const w = (22 + phase * 59) * size;
      const h = (51 + phase * 39) * size;
      context.save();
      context.translate(x + drift, y - rise);
      context.rotate(0.16 + sway * 0.1 + Math.sin(phase * 7 + seed) * 0.13);
      context.globalAlpha = Math.sin(Math.PI * phase) * 0.34;
      context.drawImage(texture, -w * 0.5, -h * 0.65, w, h);
      context.restore();
    }
  }
}
