import * as THREE from "three";

export function createMemoryScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const group = new THREE.Group();
  scene.add(group);

  const textureLoader = new THREE.TextureLoader();
  const photos = ["/assets/mom-1.jpg", "/assets/mom-2.jpg", "/assets/mom-3.jpg"];
  const positions = [
    [-1.9, 0.35, 0.2, -0.16],
    [0, -0.1, 0.65, 0.08],
    [1.9, 0.28, 0, 0.18]
  ];

  photos.forEach((src, index) => {
    const texture = textureLoader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 2.05), material);
    card.position.set(positions[index][0], positions[index][1], positions[index][2]);
    card.rotation.z = positions[index][3];
    card.rotation.y = -positions[index][3] * 0.8;
    group.add(card);

    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 2.22),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.86 })
    );
    frame.position.copy(card.position);
    frame.position.z -= 0.025;
    frame.rotation.copy(card.rotation);
    group.add(frame);
  });

  let animationId = 0;

  function resize() {
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 420;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function tick() {
    group.rotation.y = Math.sin(performance.now() * 0.00045) * 0.14;
    group.rotation.x = Math.sin(performance.now() * 0.00035) * 0.04;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    animationId = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(animationId);
    renderer.dispose();
  }

  window.addEventListener("resize", resize);

  return { start, stop };
}
