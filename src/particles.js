import * as THREE from "three";

export function createParticleIntro(canvas, options = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 9;

  const count = options.count || 1300;
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xf5a3bb,
    size: 0.036,
    transparent: true,
    opacity: 0.92,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let animationId = 0;
  let mode = "countdown";
  let startedAt = performance.now();
  let currentDigit = 3;

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function setDigitTarget(digit) {
    currentDigit = digit;
    const digitPoints = makeDigitPoints(String(digit), count);
    for (let i = 0; i < count; i += 1) {
      const p = digitPoints[i];
      targets[i * 3] = p.x;
      targets[i * 3 + 1] = p.y;
      targets[i * 3 + 2] = p.z;
    }
  }

  function setBlossomTarget() {
    mode = "blossom";
    for (let i = 0; i < count; i += 1) {
      const angle = i * 0.19;
      const petal = i % 6;
      const radius = 0.55 + (i % 95) / 95 * 2.6;
      const petalAngle = angle + petal * Math.PI / 3;
      const wave = Math.sin(radius * 3.2) * 0.28;
      targets[i * 3] = Math.cos(petalAngle) * radius + Math.cos(angle) * wave;
      targets[i * 3 + 1] = Math.sin(petalAngle) * radius * 0.78 + Math.sin(angle * 1.7) * 0.22;
      targets[i * 3 + 2] = Math.sin(angle * 2.1) * 0.55;
    }
  }

  function tick(now) {
    const elapsed = now - startedAt;
    const nextDigit = elapsed < 1000 ? 3 : elapsed < 2000 ? 2 : elapsed < 3000 ? 1 : 0;
    if (mode === "countdown" && nextDigit !== currentDigit && nextDigit > 0) {
      setDigitTarget(nextDigit);
    }
    if (mode === "countdown" && elapsed >= 3000) {
      setBlossomTarget();
    }

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      pos[i * 3] += (targets[i * 3] - pos[i * 3]) * 0.055;
      pos[i * 3 + 1] += (targets[i * 3 + 1] - pos[i * 3 + 1]) * 0.055;
      pos[i * 3 + 2] += (targets[i * 3 + 2] - pos[i * 3 + 2]) * 0.055;
    }
    geometry.attributes.position.needsUpdate = true;
    points.rotation.z += mode === "blossom" ? 0.002 : 0.0008;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    setDigitTarget(3);
    startedAt = performance.now();
    animationId = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(animationId);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  }

  window.addEventListener("resize", resize);

  return {
    start,
    stop,
    setBlossomTarget
  };
}

function makeDigitPoints(digit, count) {
  const map = {
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"]
  };
  const rows = map[digit] || map["3"];
  const cells = [];
  rows.forEach((row, y) => {
    Array.from(row).forEach((cell, x) => {
      if (cell === "1") cells.push({ x, y });
    });
  });

  return Array.from({ length: count }, (_, i) => {
    const cell = cells[i % cells.length];
    return {
      x: (cell.x - 2) * 0.62 + (Math.random() - 0.5) * 0.22,
      y: (3 - cell.y) * 0.62 + (Math.random() - 0.5) * 0.22,
      z: (Math.random() - 0.5) * 0.32
    };
  });
}
