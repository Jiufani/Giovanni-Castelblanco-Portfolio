(function () {
  "use strict";
  const TAU = Math.PI * 2;
  const N = 112, M = 20;
  const names = ["Loop", "Orbit", "Bloom", "Wave"];
  const pigments = [[185, 134, 238], [164, 152, 240], [222, 145, 215], [164, 124, 233]];
  const add = (a, b) => a.map((v, k) => v + b[k]);
  const sub = (a, b) => a.map((v, k) => v - b[k]);
  const mul = (a, v) => a.map(x => x * v);
  const dot = (a, b) => a.reduce((sum, v, k) => sum + v * b[k], 0);
  const norm = a => mul(a, 1 / Math.max(.000001, Math.sqrt(dot(a, a))));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  function center(t, form) {
    if (form === 1) return [2.05 * Math.cos(t), 2.05 * Math.sin(t), .42 * Math.sin(2 * t)];
    if (form === 2) {
      const r = 1.98 + .48 * Math.cos(5 * t);
      return [r * Math.cos(t), r * Math.sin(t), .32 * Math.sin(5 * t)];
    }
    if (form === 3) return [2.28 * Math.sin(t), 1.72 * Math.sin(2 * t), .65 * Math.cos(3 * t)];
    return [(2 + .78 * Math.cos(3 * t)) * Math.cos(2 * t), (2 + .78 * Math.cos(3 * t)) * Math.sin(2 * t), .94 * Math.sin(3 * t)];
  }
  function rotate(p) {
    let [x, y, z] = p;
    const a = -.56, b = .21, c = -.18;
    [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
    [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
    return [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c), z];
  }
  function mesh(form) {
    const vertices = [];
    for (let i = 0; i < N; i++) {
      const t = i * TAU / N;
      const p = center(t, form);
      const tangent = norm(sub(center(t + .001, form), center(t - .001, form)));
      const normal = norm(cross(tangent, Math.abs(tangent[2]) > .95 ? [1, 0, 0] : [0, 0, 1]));
      const binormal = norm(cross(tangent, normal));
      for (let j = 0; j < M; j++) {
        const u = j * TAU / M;
        const radial = add(mul(normal, Math.cos(u)), mul(binormal, Math.sin(u)));
        vertices.push({ p: rotate(add(p, mul(radial, form === 1 ? .5 : .42))), n: norm(rotate(radial)) });
      }
    }
    return { vertices, pigment: pigments[form] };
  }
  function blend(a, b, t) {
    return {
      pigment: a.pigment.map((x, k) => x * (1 - t) + b.pigment[k] * t),
      vertices: a.vertices.map((v, i) => ({
        p: v.p.map((x, k) => x * (1 - t) + b.vertices[i].p[k] * t),
        n: norm(v.n.map((x, k) => x * (1 - t) + b.vertices[i].n[k] * t))
      }))
    };
  }
  function create(canvas, fallback) {
    if (!canvas || typeof canvas.getContext !== "function") return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const forms = names.map((_, index) => mesh(index));
    const light = norm([-.8, .9, 1.5]);
    const half = norm(add(light, [0, 0, 1]));
    let current = forms[0], frame = 0, form = 0;
    const motion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    const raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : requestAnimationFrame;
    function paint(shape) {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width || rect.right - rect.left || 600);
      const height = Math.max(1, rect.height || rect.bottom - rect.top || width);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * ratio), pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * .14;
      const project = p => {
        const d = 8 / (8 - p[2]);
        return [width / 2 + p[0] * scale * d, height / 2 - p[1] * scale * d];
      };
      const faces = [];
      const get = (i, j) => shape.vertices[(i % N) * M + (j % M)];
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
        const v = [get(i, j), get(i + 1, j), get(i + 1, j + 1), get(i, j + 1)];
        const normal = norm(v.reduce((sum, point) => add(sum, point.n), [0, 0, 0]));
        const shade = .27 + .73 * Math.max(0, dot(normal, light));
        const spec = Math.pow(Math.max(0, dot(normal, half)), 22);
        const tint = [247, 219, 255];
        const color = shape.pigment.map((x, k) => Math.min(255, Math.round(x * shade + tint[k] * spec * .64)));
        faces.push({ depth: v.reduce((sum, point) => sum + point.p[2], 0) / 4, points: v.map(point => project(point.p)), color: "rgb(" + color.join(",") + ")" });
      }
      faces.sort((a, b) => a.depth - b.depth);
      ctx.lineWidth = .55;
      ctx.lineJoin = "round";
      faces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(face.points[0][0], face.points[0][1]);
        face.points.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.strokeStyle = face.color;
        ctx.fill();
        ctx.stroke();
      });
      canvas.hidden = false;
      if (fallback) fallback.hidden = true;
    }
    function show(index) {
      form = ((index % forms.length) + forms.length) % forms.length;
      if (frame && window.cancelAnimationFrame) window.cancelAnimationFrame(frame);
      canvas.setAttribute("aria-label", "Abstract violet sculpture in a " + names[form].toLowerCase() + " form");
      if (motion && motion.matches) {
        current = forms[form];
        paint(current);
        return;
      }
      const from = current, target = forms[form];
      let start;
      function animate(now) {
        if (start === undefined) start = now;
        const progress = Math.min(1, (now - start) / 920);
        const eased = progress * progress * (3 - 2 * progress);
        current = blend(from, target, eased);
        paint(current);
        if (progress < 1) frame = raf(animate);
        else frame = 0;
      }
      frame = raf(animate);
    }
    paint(current);
    if ("ResizeObserver" in window) new window.ResizeObserver(() => paint(current)).observe(canvas);
    else window.addEventListener("resize", () => paint(current), { passive: true });
    if (motion && typeof motion.addEventListener === "function") motion.addEventListener("change", () => {
      if (motion.matches) { if (frame && window.cancelAnimationFrame) window.cancelAnimationFrame(frame); current = forms[form]; paint(current); }
    });
    return { show };
  }
  window.PortfolioSculpture = { create, names };
})();
