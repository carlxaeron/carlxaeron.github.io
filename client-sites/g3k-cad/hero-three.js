/**
 * Hero Three.js ambient canvas — first section only.
 * Vanilla ESM via CDN (no React/build). Calm wireframe / particle field.
 * Docs: https://threejs.org/docs/
 *
 * Markup: <canvas data-hero-canvas class="hero-three-canvas"></canvas> inside [data-hero]
 * Optional: data-hero-three="blueprint" | "particles" on [data-hero] (default: blueprint)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js";

const hero = document.querySelector("[data-hero]");
const canvas = hero?.querySelector("[data-hero-canvas]");
if (!hero || !canvas) {
  // no Three.js mount
} else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  canvas.remove();
} else {
  const theme = (hero.getAttribute("data-hero-three") || "blueprint").toLowerCase();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6.2);

  const root = new THREE.Group();
  scene.add(root);

  const accent = 0x38bdf8;
  const mid = 0x2b6cb0;
  const soft = 0x94a3b8;

  if (theme === "particles") {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: accent,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    root.add(new THREE.Points(geo, mat));
  } else {
    const planeMat = new THREE.MeshBasicMaterial({
      color: mid,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    for (let i = 0; i < 3; i += 1) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.2 + i * 0.4, 2.1 + i * 0.25, 8, 5), planeMat.clone());
      plane.position.set((i - 1) * 1.6, (i - 1) * 0.35, -i * 0.55);
      plane.rotation.x = -0.55 + i * 0.12;
      plane.rotation.y = 0.35 - i * 0.18;
      root.add(plane);
    }

    const nodeGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.7,
    });
    for (let i = 0; i < 18; i += 1) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.5
      );
      root.add(node);
    }

    const grid = new THREE.GridHelper(8, 16, soft, soft);
    grid.position.y = -1.6;
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    root.add(grid);
  }

  let frameId = 0;
  let running = true;
  const clock = new THREE.Clock();

  function resize() {
    const { clientWidth: w, clientHeight: h } = hero;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    root.rotation.y = t * 0.08;
    root.rotation.x = Math.sin(t * 0.22) * 0.06;
    root.position.y = Math.sin(t * 0.35) * 0.08;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }

  const visibility = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running && !frameId) {
        frameId = requestAnimationFrame(tick);
      } else if (!running) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    },
    { threshold: 0.08 }
  );
  visibility.observe(hero);

  window.addEventListener("resize", resize, { passive: true });
  resize();
  frameId = requestAnimationFrame(tick);
}
