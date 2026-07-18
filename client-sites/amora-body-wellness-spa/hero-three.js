/**
 * Hero Three.js ambient canvas + optional branded 3D object — first section only.
 * Vanilla ESM via CDN (no React/build).
 *
 * Markup:
 *   <canvas data-hero-canvas class="hero-three-canvas"></canvas> inside [data-hero]
 *   data-hero-three="blueprint" | "particles" (ambient; default blueprint)
 *   data-hero-three-object="woodblock" | "spa" | "lakehouse" (optional featured mesh)
 *   data-hero-three-accent="warm" | "cool" | "lake" (particle tint when accent set)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js";

const ACCENT_PALETTE = {
  warm: { accent: 0xc4a574, mid: 0x8b5a2b, soft: 0xd4c4a8 },
  lake: { accent: 0x5ec4d4, mid: 0x1a5f73, soft: 0xa8d8e8 },
  cool: { accent: 0x38bdf8, mid: 0x2b6cb0, soft: 0x94a3b8 },
};

function accentColors(accent) {
  return ACCENT_PALETTE[accent] || ACCENT_PALETTE.cool;
}

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

  /** Hot-stone stack + essential oil bottle — spa, wellness, massage brands (Amora palette) */
  spa() {
    const group = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({
      color: 0x7a8578,
      roughness: 0.9,
      metalness: 0.03,
    });
    const stoneDark = new THREE.MeshStandardMaterial({
      color: 0x4a5a4e,
      roughness: 0.94,
      metalness: 0.02,
    });
    const stoneWarm = new THREE.MeshStandardMaterial({
      color: 0x9a8878,
      roughness: 0.88,
      metalness: 0.04,
      emissive: 0xc9a87c,
      emissiveIntensity: 0.22,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: 0xd8e4cc,
      roughness: 0.14,
      metalness: 0.1,
      transparent: true,
      opacity: 0.68,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a87c,
      roughness: 0.38,
      metalness: 0.42,
    });
    const oil = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      roughness: 0.32,
      metalness: 0.06,
      transparent: true,
      opacity: 0.88,
    });
    const leaf = new THREE.MeshStandardMaterial({
      color: 0x4a6741,
      roughness: 0.76,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const towel = new THREE.MeshStandardMaterial({
      color: 0xf0ebe3,
      roughness: 0.92,
      metalness: 0.01,
    });
    const candleWax = new THREE.MeshStandardMaterial({
      color: 0xf5f0e6,
      roughness: 0.85,
      metalness: 0.02,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffd89a,
      emissive: 0xffb347,
      emissiveIntensity: 0.85,
      roughness: 0.4,
      metalness: 0,
      transparent: true,
      opacity: 0.92,
    });
    flameMat.userData.isFlame = true;

    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.92, 0.06, 16), stoneDark);
    tray.position.y = -0.52;
    group.add(tray);

    const baseStone = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.22, 16), stoneDark);
    baseStone.position.y = -0.38;
    group.add(baseStone);

    const midStone = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.18, 16), stone);
    midStone.position.set(-0.08, -0.18, 0.04);
    midStone.rotation.y = 0.35;
    group.add(midStone);

    const topStone = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 12), stoneWarm);
    topStone.scale.set(1.05, 0.62, 1);
    topStone.position.set(0.12, 0.02, -0.06);
    group.add(topStone);

    const pebble = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), stone);
    pebble.scale.set(1.1, 0.55, 1);
    pebble.position.set(-0.42, -0.32, 0.22);
    group.add(pebble);

    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.62, 14), glass);
    bottle.position.set(0.78, 0.12, 0.12);
    group.add(bottle);

    const oilFill = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.38, 12), oil);
    oilFill.position.set(0.78, -0.02, 0.12);
    group.add(oilFill);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 12), glass);
    neck.position.set(0.78, 0.48, 0.12);
    group.add(neck);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), gold);
    cap.position.set(0.78, 0.58, 0.12);
    group.add(cap);

    const fold1 = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.38), towel);
    fold1.position.set(-0.55, -0.48, -0.18);
    fold1.rotation.set(0.08, 0.42, 0.05);
    group.add(fold1);

    const fold2 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.32), towel);
    fold2.position.set(-0.48, -0.42, -0.12);
    fold2.rotation.set(-0.12, 0.38, -0.08);
    group.add(fold2);

    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.18, 10), candleWax);
    candle.position.set(-0.72, -0.38, 0.08);
    group.add(candle);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), flameMat);
    flame.scale.set(0.7, 1.2, 0.7);
    flame.position.set(-0.72, -0.26, 0.08);
    group.add(flame);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.22, 0.08, 0.28, 0.32);
    leafShape.quadraticCurveTo(0.12, 0.28, 0, 0.42);
    leafShape.quadraticCurveTo(-0.12, 0.28, -0.28, 0.32);
    leafShape.quadraticCurveTo(-0.22, 0.08, 0, 0);
    const leafMesh = new THREE.Mesh(new THREE.ShapeGeometry(leafShape), leaf);
    leafMesh.position.set(-0.58, 0.22, 0.28);
    leafMesh.rotation.set(-0.4, 0.5, 0.15);
    leafMesh.scale.setScalar(0.55);
    group.add(leafMesh);

    const leaf2 = leafMesh.clone();
    leaf2.position.set(0.42, 0.38, -0.08);
    leaf2.rotation.set(0.25, -0.6, -0.2);
    leaf2.scale.setScalar(0.42);
    group.add(leaf2);

    group.position.x = -0.15;
    group.scale.setScalar(0.95);
    group.userData.flame = flame;
    return group;
  },

  /** Lakeside cabin + pier — hospitality, resort, staycation brands */
  lakehouse() {
    const group = new THREE.Group();
    const wall = new THREE.MeshStandardMaterial({
      color: 0xe8f0ec,
      roughness: 0.82,
      metalness: 0.03,
    });
    const roof = new THREE.MeshStandardMaterial({
      color: 0x0c3d4a,
      roughness: 0.88,
      metalness: 0.04,
    });
    const wood = new THREE.MeshStandardMaterial({
      color: 0x7a5c42,
      roughness: 0.9,
      metalness: 0.02,
    });
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xc9e8f0,
      roughness: 0.25,
      metalness: 0.12,
      emissive: 0x1a5f73,
      emissiveIntensity: 0.18,
    });
    const water = new THREE.MeshStandardMaterial({
      color: 0x1a5f73,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.55,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      roughness: 0.45,
      metalness: 0.28,
    });

    const waterPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6, 1, 1), water);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.set(0.35, -0.72, 0.45);
    group.add(waterPlane);

    const pier = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 0.42), wood);
    pier.position.set(0.55, -0.58, 0.55);
    group.add(pier);

    for (let i = 0; i < 4; i += 1) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.38, 6), wood);
      post.position.set(-0.05 + i * 0.42, -0.78, 0.72);
      group.add(post);
    }

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.72, 0.82), wall);
    body.position.set(-0.35, -0.08, 0.05);
    group.add(body);

    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.92), roof);
    roofLeft.position.set(-0.62, 0.38, 0.05);
    roofLeft.rotation.z = 0.52;
    group.add(roofLeft);

    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.92), roof);
    roofRight.position.set(-0.08, 0.38, 0.05);
    roofRight.rotation.z = -0.52;
    group.add(roofRight);

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.12), wall);
    chimney.position.set(-0.08, 0.52, -0.18);
    group.add(chimney);

    const winLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), windowMat);
    winLeft.position.set(-0.35, 0.02, 0.47);
    group.add(winLeft);

    const winRight = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.22), windowMat);
    winRight.position.set(-0.62, 0.08, 0.47);
    group.add(winRight);

    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.34), wood);
    door.position.set(-0.12, -0.18, 0.47);
    group.add(door);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.04), gold);
    rail.position.set(0.18, 0.02, 0.48);
    group.add(rail);

    group.rotation.y = -0.28;
    group.scale.setScalar(0.98);
    return group;
  },
};

function buildAmbient(theme, accent, root) {
  const { accent: accentColor, mid: midColor, soft: softColor } = accentColors(accent);

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

  let warmGlow = null;
  if (hasObject) {
    const isLake = objectType === "lakehouse";
    const isSpa = objectType === "spa";
    scene.add(new THREE.AmbientLight(isLake ? 0xe8f4f8 : isSpa ? 0xf5efe6 : 0xfff5e8, isSpa ? 0.62 : 0.55));
    const key = new THREE.DirectionalLight(isLake ? 0xd4eef8 : isSpa ? 0xffeed8 : 0xffe8cc, isSpa ? 0.92 : 0.85);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(isLake ? 0x5ec4d4 : isSpa ? 0x4a6741 : 0xc4a574, isSpa ? 0.42 : 0.35);
    fill.position.set(-2, 0.5, 2);
    scene.add(fill);
    if (isSpa) {
      const rim = new THREE.DirectionalLight(0xc9a87c, 0.28);
      rim.position.set(-1.5, 2, -3);
      scene.add(rim);
      warmGlow = new THREE.PointLight(0xffc878, 0.55, 4.5);
      warmGlow.position.set(1.8, 0.35, 1.2);
      scene.add(warmGlow);
    }
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
      featured.rotation.y = t * 0.22;
      featured.rotation.x = Math.sin(t * 0.16) * 0.1 + 0.08;
      featured.position.y = (layoutWide ? -0.05 : -0.35) + Math.sin(t * 0.35) * 0.05;
      const flame = featured.userData.flame;
      if (flame?.material) {
        const flicker = 0.72 + Math.sin(t * 9.5) * 0.12 + Math.sin(t * 14.2) * 0.06;
        flame.material.emissiveIntensity = flicker;
        flame.scale.y = 1.05 + Math.sin(t * 11) * 0.12;
      }
    }
    if (warmGlow) {
      warmGlow.intensity = 0.48 + Math.sin(t * 0.9) * 0.08;
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
