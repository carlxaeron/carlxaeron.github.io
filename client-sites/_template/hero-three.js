/**
 * Hero Three.js ambient canvas + optional branded 3D object — first section only.
 * Vanilla ESM via CDN (no React/build).
 *
 * Markup:
 *   <canvas data-hero-canvas class="hero-three-canvas"></canvas> inside [data-hero]
 *   data-hero-three="blueprint" | "particles" (ambient; default blueprint)
 *   data-hero-three-object="woodblock" (optional featured craft/product mesh)
 *   data-hero-three-accent="warm" | "cool" (particle tint when accent set)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js";

const OBJECT_BUILDERS = {
  /** Carved wood block / stamp — craft, cabinetry, print-adjacent brands */
  woodblock() {
    const group = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.86,
      metalness: 0.04,
    });
    const darkWood = new THREE.MeshStandardMaterial({
      color: 0x4a3220,
      roughness: 0.92,
      metalness: 0.02,
    });
    const highlight = new THREE.MeshStandardMaterial({
      color: 0xb8894f,
      roughness: 0.78,
      metalness: 0.06,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 0.36), wood);
    group.add(body);

    for (let y = -0.32; y <= 0.32; y += 0.22) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.05, 0.07), darkWood);
      groove.position.set(0, y, 0.155);
      group.add(groove);
    }

    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.46, 0.05), highlight);
    panel.position.set(0, 0.04, 0.19);
    group.add(panel);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.07, 0.82), darkWood);
    pad.position.set(0, -0.56, 0.04);
    group.add(pad);

    group.scale.setScalar(0.92);
    return group;
  },
};

function buildAmbient(theme, accent, root) {
  const cool = accent !== "warm";
  const accentColor = cool ? 0x38bdf8 : 0xc4a574;
  const midColor = cool ? 0x2b6cb0 : 0x8b5a2b;
  const softColor = cool ? 0x94a3b8 : 0xd4c4a8;

  if (theme === "particles") {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.042,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    root.add(new THREE.Points(geo, mat));
    return;
  }

  const planeMat = new THREE.MeshBasicMaterial({
    color: midColor,
    wireframe: true,
    transparent: true,
    opacity: 0.24,
  });
  for (let i = 0; i < 3; i += 1) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2 + i * 0.4, 2.1 + i * 0.25, 8, 5),
      planeMat.clone()
    );
    plane.position.set((i - 1) * 1.6, (i - 1) * 0.35, -i * 0.55);
    plane.rotation.x = -0.55 + i * 0.12;
    plane.rotation.y = 0.35 - i * 0.18;
    root.add(plane);
  }

  const nodeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.65,
  });
  for (let i = 0; i < 16; i += 1) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(
      (Math.random() - 0.5) * 5.5,
      (Math.random() - 0.5) * 3.2,
      (Math.random() - 0.5) * 2.5
    );
    root.add(node);
  }

  const grid = new THREE.GridHelper(8, 16, softColor, softColor);
  grid.position.y = -1.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  root.add(grid);
}

const hero = document.querySelector("[data-hero]");
const canvas = hero?.querySelector("[data-hero-canvas]");
if (!hero || !canvas) {
  // no Three.js mount
} else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  canvas.remove();
} else {
  const theme = (hero.getAttribute("data-hero-three") || "blueprint").toLowerCase();
  const objectType = (hero.getAttribute("data-hero-three-object") || "").toLowerCase();
  const accent = (hero.getAttribute("data-hero-three-accent") || "cool").toLowerCase();
  const hasObject = Boolean(OBJECT_BUILDERS[objectType]);

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
  camera.position.set(hasObject ? 0.55 : 0, 0.18, hasObject ? 5.6 : 6.2);

  if (hasObject) {
    scene.add(new THREE.AmbientLight(0xfff5e8, 0.55));
    const key = new THREE.DirectionalLight(0xffe8cc, 0.85);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc4a574, 0.35);
    fill.position.set(-2, 0.5, 2);
    scene.add(fill);
  }

  const ambientRoot = new THREE.Group();
  scene.add(ambientRoot);
  buildAmbient(theme, accent, ambientRoot);

  const featured = hasObject ? OBJECT_BUILDERS[objectType]() : null;
  if (featured) {
    featured.position.set(2.15, -0.05, 0.35);
    scene.add(featured);
    hero.classList.add("hero-has-three-object");
  }

  let frameId = 0;
  let running = true;
  const clock = new THREE.Clock();
  let layoutWide = hero.clientWidth >= 768;

  function layoutFeatured() {
    if (!featured) return;
    layoutWide = hero.clientWidth >= 768;
    featured.position.x = layoutWide ? 2.15 : 1.35;
    featured.position.y = layoutWide ? -0.05 : -0.35;
    featured.scale.setScalar(layoutWide ? 0.92 : 0.62);
    camera.position.x = layoutWide ? 0.55 : 0.15;
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = hero;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    layoutFeatured();
  }

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    ambientRoot.rotation.y = t * 0.08;
    ambientRoot.rotation.x = Math.sin(t * 0.22) * 0.06;
    ambientRoot.position.y = Math.sin(t * 0.35) * 0.08;
  if (featured) {
    featured.rotation.y = t * 0.28;
    featured.rotation.x = Math.sin(t * 0.18) * 0.12 + 0.08;
    featured.position.y = (layoutWide ? -0.05 : -0.35) + Math.sin(t * 0.4) * 0.06;
  }
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
