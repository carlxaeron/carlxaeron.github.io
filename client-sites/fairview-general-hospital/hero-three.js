/**
 * Hero Three.js ambient canvas + optional branded 3D object — first section only.
 * Vanilla ESM via CDN (no React/build).
 *
 * Markup:
 *   <canvas data-hero-canvas class="hero-three-canvas"></canvas> inside [data-hero]
 *   data-hero-three="blueprint" | "particles" (ambient; default blueprint)
 *   data-hero-three-object="woodblock" | "spa" | "lakehouse" | "coffee" | "ricesack" |
 *     "briefcase" | "notaryseal" | "printroll" | "copier" | "hardhat" | "industrialfan" |
 *     "acunit" | "blueprintroll" | "pooldeck" | "waterslide" | "steelbeam" | "avpanel" |
 *     "medicinebottle" | "roofpanel" | "towercrane" | "tire" | "stethoscope" |
 *     "graduationcap" (optional featured mesh)
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

  /** Hot-stone stack + essential oil bottle — spa, wellness, massage brands */
  spa() {
    const group = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({
      color: 0x8a9488,
      roughness: 0.92,
      metalness: 0.02,
    });
    const stoneDark = new THREE.MeshStandardMaterial({
      color: 0x6b7568,
      roughness: 0.95,
      metalness: 0.01,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: 0xc9d4bc,
      roughness: 0.18,
      metalness: 0.08,
      transparent: true,
      opacity: 0.72,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a87c,
      roughness: 0.42,
      metalness: 0.35,
    });
    const oil = new THREE.MeshStandardMaterial({
      color: 0xd4a84b,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const leaf = new THREE.MeshStandardMaterial({
      color: 0x4a6741,
      roughness: 0.78,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const baseStone = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.22, 14), stoneDark);
    baseStone.position.y = -0.42;
    group.add(baseStone);

    const midStone = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.18, 14), stone);
    midStone.position.set(-0.08, -0.22, 0.04);
    midStone.rotation.y = 0.35;
    group.add(midStone);

    const topStone = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), stone);
    topStone.scale.set(1.05, 0.62, 1);
    topStone.position.set(0.12, -0.02, -0.06);
    group.add(topStone);

    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.62, 12), glass);
    bottle.position.set(0.78, 0.08, 0.12);
    group.add(bottle);

    const oilFill = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.38, 10), oil);
    oilFill.position.set(0.78, -0.06, 0.12);
    group.add(oilFill);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 10), glass);
    neck.position.set(0.78, 0.44, 0.12);
    group.add(neck);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), gold);
    cap.position.set(0.78, 0.54, 0.12);
    group.add(cap);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.22, 0.08, 0.28, 0.32);
    leafShape.quadraticCurveTo(0.12, 0.28, 0, 0.42);
    leafShape.quadraticCurveTo(-0.12, 0.28, -0.28, 0.32);
    leafShape.quadraticCurveTo(-0.22, 0.08, 0, 0);
    const leafMesh = new THREE.Mesh(new THREE.ShapeGeometry(leafShape), leaf);
    leafMesh.position.set(-0.62, 0.18, 0.28);
    leafMesh.rotation.set(-0.4, 0.5, 0.15);
    leafMesh.scale.setScalar(0.55);
    group.add(leafMesh);

    group.position.x = -0.15;
    group.scale.setScalar(0.95);
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

  /** Latte cup + saucer — café, restaurant brands */
  coffee() {
    const group = new THREE.Group();
    const ceramic = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.35,
      metalness: 0.04,
    });
    const coffeeLiquid = new THREE.MeshStandardMaterial({
      color: 0x4a3220,
      roughness: 0.55,
      metalness: 0.02,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xcba258,
      roughness: 0.42,
      metalness: 0.32,
    });
    const steam = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0,
      transparent: true,
      opacity: 0.35,
    });

    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.06, 20), ceramic);
    saucer.position.y = -0.52;
    group.add(saucer);

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.58, 16), ceramic);
    cup.position.y = -0.12;
    group.add(cup);

    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.34, 0.08, 14), coffeeLiquid);
    liquid.position.y = 0.12;
    group.add(liquid);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 8, 12, Math.PI), ceramic);
    handle.position.set(0.48, -0.08, 0);
    handle.rotation.z = Math.PI / 2;
    group.add(handle);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 16, 1, true), gold);
    band.position.y = -0.08;
    group.add(band);

    for (let i = 0; i < 3; i += 1) {
      const wisp = new THREE.Mesh(new THREE.TorusGeometry(0.06 + i * 0.04, 0.012, 6, 10), steam);
      wisp.position.set(-0.05 + i * 0.08, 0.42 + i * 0.12, 0);
      wisp.rotation.x = Math.PI / 2;
      wisp.rotation.z = i * 0.4;
      group.add(wisp);
    }

    group.scale.setScalar(0.95);
    return group;
  },

  /** Burlap rice sack — grain wholesale / retail brands */
  ricesack() {
    const group = new THREE.Group();
    const burlap = new THREE.MeshStandardMaterial({
      color: 0xc4a574,
      roughness: 0.94,
      metalness: 0.01,
    });
    const burlapDark = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.96,
      metalness: 0,
    });
    const rice = new THREE.MeshStandardMaterial({
      color: 0xf5f0e0,
      roughness: 0.88,
      metalness: 0,
    });
    const label = new THREE.MeshStandardMaterial({
      color: 0x1a3d2e,
      roughness: 0.72,
      metalness: 0.02,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 1.15, 12), burlap);
    body.position.y = -0.08;
    group.add(body);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.28, 10), burlapDark);
    neck.position.y = 0.58;
    group.add(neck);

    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 12), burlapDark);
    tie.position.y = 0.72;
    tie.rotation.x = Math.PI / 2;
    group.add(tie);

    const spill = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), rice);
    spill.position.set(-0.55, -0.72, 0.15);
    spill.rotation.x = -0.2;
    group.add(spill);

    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.22), label);
    tag.position.set(0, 0.05, 0.58);
    group.add(tag);

    group.rotation.y = 0.22;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Leather briefcase — consultancy, business services */
  briefcase() {
    const group = new THREE.Group();
    const leather = new THREE.MeshStandardMaterial({
      color: 0x1a5f7a,
      roughness: 0.78,
      metalness: 0.06,
    });
    const leatherDark = new THREE.MeshStandardMaterial({
      color: 0x0f2d4a,
      roughness: 0.82,
      metalness: 0.04,
    });
    const brass = new THREE.MeshStandardMaterial({
      color: 0xc9a87c,
      roughness: 0.38,
      metalness: 0.42,
    });
    const coral = new THREE.MeshStandardMaterial({
      color: 0xe07a5f,
      roughness: 0.65,
      metalness: 0.08,
    });

    const caseBody = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.82, 0.42), leather);
    group.add(caseBody);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.08, 0.44), leatherDark);
    lid.position.y = 0.42;
    group.add(lid);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 14, Math.PI), brass);
    handle.position.set(0, 0.58, 0);
    handle.rotation.z = Math.PI / 2;
    group.add(handle);

    for (let x of [-0.42, 0.42]) {
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.06), brass);
      clasp.position.set(x, 0.08, 0.24);
      group.add(clasp);
    }

    const accent = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.28), coral);
    accent.position.set(0, -0.02, 0.22);
    group.add(accent);

    group.scale.setScalar(0.9);
    return group;
  },

  /** Notary seal + document — legal / notary brands */
  notaryseal() {
    const group = new THREE.Group();
    const paper = new THREE.MeshStandardMaterial({
      color: 0xf8f5ef,
      roughness: 0.92,
      metalness: 0,
    });
    const wax = new THREE.MeshStandardMaterial({
      color: 0x6b3d4f,
      roughness: 0.55,
      metalness: 0.08,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xcba258,
      roughness: 0.35,
      metalness: 0.45,
    });
    const handle = new THREE.MeshStandardMaterial({
      color: 0x1a2332,
      roughness: 0.72,
      metalness: 0.12,
    });

    const doc = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.02, 0.82), paper);
    doc.position.y = -0.42;
    doc.rotation.y = 0.12;
    group.add(doc);

    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 14), wax);
    seal.position.set(0.18, -0.36, 0.12);
    group.add(seal);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 16), gold);
    ring.position.set(0.18, -0.3, 0.12);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const stamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.38, 12), handle);
    stamp.position.set(-0.35, 0.08, 0.05);
    group.add(stamp);

    const stampTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.08, 12), gold);
    stampTop.position.set(-0.35, 0.3, 0.05);
    group.add(stampTop);

    group.rotation.y = -0.18;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Vinyl decal roll — printing / signage brands */
  printroll() {
    const group = new THREE.Group();
    const core = new THREE.MeshStandardMaterial({
      color: 0x2a2f38,
      roughness: 0.65,
      metalness: 0.15,
    });
    const vinylRed = new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.42,
      metalness: 0.08,
    });
    const vinylCyan = new THREE.MeshStandardMaterial({
      color: 0x00acc1,
      roughness: 0.38,
      metalness: 0.1,
    });
    const vinylDark = new THREE.MeshStandardMaterial({
      color: 0x12151c,
      roughness: 0.5,
      metalness: 0.06,
    });

    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.72, 16), vinylRed);
    roll.rotation.z = Math.PI / 2;
    group.add(roll);

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.78, 10), core);
    inner.rotation.z = Math.PI / 2;
    group.add(inner);

    const unroll = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.55), vinylCyan);
    unroll.position.set(0.62, -0.18, 0.08);
    unroll.rotation.set(-0.35, 0.25, 0.15);
    group.add(unroll);

    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.12), vinylDark);
    strip.position.set(0.95, -0.42, 0.05);
    strip.rotation.y = 0.4;
    group.add(strip);

    group.position.x = -0.1;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Office copier — office equipment / B2B supply brands */
  copier() {
    const group = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({
      color: 0xe8ecf0,
      roughness: 0.55,
      metalness: 0.12,
    });
    const panel = new THREE.MeshStandardMaterial({
      color: 0x1a3a5c,
      roughness: 0.45,
      metalness: 0.18,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x2d8fad,
      roughness: 0.4,
      metalness: 0.2,
    });
    const paper = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0,
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.72, 0.82), body);
    base.position.y = -0.12;
    group.add(base);

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.18, 0.85), body);
    top.position.y = 0.38;
    group.add(top);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.18), panel);
    screen.position.set(-0.22, 0.12, 0.42);
    group.add(screen);

    const btnRow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.06), accent);
    btnRow.position.set(0.28, 0.08, 0.42);
    group.add(btnRow);

    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.55), paper);
    tray.position.set(0, -0.52, 0.35);
    group.add(tray);

    const output = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.38), paper);
    output.position.set(0, 0.52, 0.28);
    output.rotation.x = -0.35;
    group.add(output);

    group.scale.setScalar(0.88);
    return group;
  },

  /** Hard hat + spirit level — construction / renovation brands */
  hardhat() {
    const group = new THREE.Group();
    const helmet = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.62,
      metalness: 0.08,
    });
    const helmetDark = new THREE.MeshStandardMaterial({
      color: 0xc2410c,
      roughness: 0.68,
      metalness: 0.06,
    });
    const levelBody = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.45,
      metalness: 0.15,
    });
    const bubble = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.55,
    });

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), helmet);
    dome.position.y = 0.08;
    group.add(dome);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.65, 0.08, 16), helmetDark);
    brim.position.y = 0.02;
    group.add(brim);

    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.55), helmetDark);
    ridge.position.set(0, 0.38, 0);
    group.add(ridge);

    const level = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.22), levelBody);
    level.position.set(-0.55, -0.35, 0.15);
    level.rotation.z = 0.15;
    group.add(level);

    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.52, 8), bubble);
    vial.rotation.z = Math.PI / 2;
    vial.position.set(-0.55, -0.35, 0.28);
    group.add(vial);

    const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.08), steel);
    ruler.position.set(0.42, -0.42, 0.05);
    ruler.rotation.y = -0.35;
    group.add(ruler);

    group.scale.setScalar(0.92);
    return group;
  },

  /** Centrifugal industrial fan — ventilation / blower brands */
  industrialfan() {
    const group = new THREE.Group();
    const housing = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.62,
      metalness: 0.35,
    });
    const blade = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.45,
      metalness: 0.42,
    });
    const hub = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.5,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.4,
      metalness: 0.25,
    });

    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.42, 16, 1, true), housing);
    shell.rotation.x = Math.PI / 2;
    group.add(shell);

    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12), hub);
    back.rotation.x = Math.PI / 2;
    back.position.z = -0.18;
    group.add(back);

    for (let i = 0; i < 6; i += 1) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.06), blade);
      b.rotation.z = (i / 6) * Math.PI * 2;
      b.position.set(Math.sin(b.rotation.z) * 0.22, Math.cos(b.rotation.z) * 0.22, 0);
      group.add(b);
    }

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.04, 8, 20), accent);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.55, 10), housing);
    duct.rotation.x = Math.PI / 2;
    duct.position.z = 0.48;
    group.add(duct);

    group.rotation.y = 0.35;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Split-type AC indoor unit — HVAC / aircon brands */
  acunit() {
    const group = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({
      color: 0xf0f9ff,
      roughness: 0.48,
      metalness: 0.12,
    });
    const panel = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.42,
      metalness: 0.15,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.35,
      metalness: 0.22,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x0c4a6e,
      roughness: 0.55,
      metalness: 0.18,
    });

    const unit = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 0.38), body);
    group.add(unit);

    const louver = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.22, 0.06), panel);
    louver.position.set(0, -0.08, 0.2);
    louver.rotation.x = 0.35;
    group.add(louver);

    for (let i = 0; i < 5; i += 1) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.02, 0.04), accent);
      fin.position.set(0, -0.02 - i * 0.04, 0.18 - i * 0.02);
      fin.rotation.x = 0.28 + i * 0.02;
      group.add(fin);
    }

    const display = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), dark);
    display.position.set(0.42, 0.08, 0.2);
    group.add(display);

    const led = new THREE.Mesh(new THREE.CircleGeometry(0.025, 8), accent);
    led.position.set(0.52, 0.08, 0.21);
    group.add(led);

    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 8), dark);
    pipe.position.set(-0.62, -0.12, 0);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    group.scale.setScalar(0.9);
    return group;
  },

  /** Rolled blueprint + triangle ruler — CAD / plotting brands */
  blueprintroll() {
    const group = new THREE.Group();
    const paper = new THREE.MeshStandardMaterial({
      color: 0x1e4d8c,
      roughness: 0.82,
      metalness: 0.02,
    });
    const paperLight = new THREE.MeshStandardMaterial({
      color: 0x2b6cb0,
      roughness: 0.78,
      metalness: 0.03,
    });
    const ruler = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.35,
      metalness: 0.25,
      transparent: true,
      opacity: 0.85,
    });
    const line = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      metalness: 0.1,
    });

    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.95, 14), paper);
    roll.rotation.z = Math.PI / 2;
    group.add(roll);

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.98, 8), line);
    inner.rotation.z = Math.PI / 2;
    group.add(inner);

    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), paperLight);
    sheet.position.set(0.55, -0.22, 0.05);
    sheet.rotation.set(-0.4, 0.3, 0.1);
    group.add(sheet);

    const tri = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.02, 3), ruler);
    tri.position.set(-0.42, -0.38, 0.18);
    tri.rotation.x = Math.PI / 2;
    tri.rotation.z = Math.PI;
    group.add(tri);

    for (let i = 0; i < 4; i += 1) {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.008, 0.008), line);
      mark.position.set(0.35 + i * 0.08, -0.08 - i * 0.06, 0.12);
      mark.rotation.z = -0.25;
      group.add(mark);
    }

    group.rotation.y = -0.22;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Infinity pool deck + lounger — day resort / pool venue brands */
  pooldeck() {
    const group = new THREE.Group();
    const water = new THREE.MeshStandardMaterial({
      color: 0x1a8a9a,
      roughness: 0.12,
      metalness: 0.08,
      transparent: true,
      opacity: 0.82,
    });
    const deck = new THREE.MeshStandardMaterial({
      color: 0xd4c4a8,
      roughness: 0.88,
      metalness: 0.02,
    });
    const teak = new THREE.MeshStandardMaterial({
      color: 0x8b6914,
      roughness: 0.82,
      metalness: 0.03,
    });
    const fabric = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.92,
      metalness: 0,
    });
    const umbrella = new THREE.MeshStandardMaterial({
      color: 0xc4a574,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const pole = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.45,
    });

    const pool = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 1.05), water);
    pool.position.set(-0.15, -0.52, 0.08);
    group.add(pool);

    const edge = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.08, 0.14), deck);
    edge.position.set(-0.15, -0.42, -0.42);
    group.add(edge);

    const loungerBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.32), teak);
    loungerBase.position.set(0.55, -0.38, 0.22);
    loungerBase.rotation.y = -0.35;
    group.add(loungerBase);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.22, 0.06), teak);
    back.position.set(0.38, -0.22, 0.08);
    back.rotation.set(-0.55, -0.35, 0);
    group.add(back);

    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.24), fabric);
    cushion.position.set(0.55, -0.32, 0.22);
    cushion.rotation.y = -0.35;
    group.add(cushion);

    const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 8), pole);
    umbrellaPole.position.set(0.92, 0.02, -0.08);
    group.add(umbrellaPole);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.14, 12, 1, true), umbrella);
    canopy.position.set(0.92, 0.48, -0.08);
    group.add(canopy);

    group.rotation.y = 0.22;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Curved water slide + splash basin — water park brands */
  waterslide() {
    const group = new THREE.Group();
    const slide = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.28,
      metalness: 0.12,
    });
    const slideDark = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.32,
      metalness: 0.1,
    });
    const pool = new THREE.MeshStandardMaterial({
      color: 0x1a8a9a,
      roughness: 0.15,
      metalness: 0.06,
      transparent: true,
      opacity: 0.78,
    });
    const rail = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.45,
      metalness: 0.22,
    });

    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.14, 14), pool);
    basin.position.set(0.35, -0.58, 0.12);
    group.add(basin);

    const chute = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.05, 12, 1, true, 0, Math.PI), slide);
    chute.rotation.set(0.65, 0.15, -0.42);
    chute.position.set(-0.35, 0.08, 0.05);
    group.add(chute);

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.02, 10, 1, true, 0, Math.PI), slideDark);
    inner.rotation.set(0.65, 0.15, -0.42);
    inner.position.set(-0.32, 0.1, 0.08);
    group.add(inner);

    for (let i = 0; i < 3; i += 1) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.04), rail);
      bar.position.set(-0.62 + i * 0.18, 0.35 - i * 0.12, 0.22);
      bar.rotation.z = 0.55 - i * 0.08;
      group.add(bar);
    }

    group.rotation.y = -0.18;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Steel I-beam — industrial metals / supplier brands */
  steelbeam() {
    const group = new THREE.Group();
    const steel = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.38,
      metalness: 0.62,
    });
    const steelDark = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.42,
      metalness: 0.58,
    });
    const rivet = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.32,
      metalness: 0.72,
    });

    const web = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.55), steel);
    group.add(web);

    const topFlange = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.58), steelDark);
    topFlange.position.y = 0.52;
    group.add(topFlange);

    const botFlange = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.58), steelDark);
    botFlange.position.y = -0.52;
    group.add(botFlange);

    for (let y of [-0.35, 0, 0.35]) {
      for (let z of [-0.18, 0.18]) {
        const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 8), rivet);
        dot.rotation.x = Math.PI / 2;
        dot.position.set(0, y, z);
        group.add(dot);
      }
    }

    group.rotation.y = 0.42;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Smart panel + dome camera — AV / security / BMS brands */
  avpanel() {
    const group = new THREE.Group();
    const bezel = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.25,
    });
    const screen = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.22,
      metalness: 0.15,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
    });
    const cameraBody = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.48,
      metalness: 0.18,
    });
    const lens = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.18,
      metalness: 0.35,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.35,
      metalness: 0.28,
    });

    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.62, 0.06), bezel);
    panel.position.set(-0.15, 0.05, 0);
    group.add(panel);

    const display = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.48), screen);
    display.position.set(-0.15, 0.05, 0.035);
    group.add(display);

    const camBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.18), cameraBody);
    camBase.position.set(0.62, 0.18, 0.08);
    group.add(camBase);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), lens);
    dome.position.set(0.62, 0.28, 0.08);
    group.add(dome);

    const led = new THREE.Mesh(new THREE.CircleGeometry(0.025, 8), accent);
    led.position.set(0.72, 0.12, 0.18);
    group.add(led);

    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), bezel);
    bracket.position.set(-0.62, -0.08, 0);
    group.add(bracket);

    group.rotation.y = -0.25;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Amber pill bottle + capsules — pharmaceutical brands */
  medicinebottle() {
    const group = new THREE.Group();
    const amber = new THREE.MeshStandardMaterial({
      color: 0xc2782a,
      roughness: 0.28,
      metalness: 0.06,
      transparent: true,
      opacity: 0.88,
    });
    const cap = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.55,
      metalness: 0.08,
    });
    const label = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.02,
    });
    const pill = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.45,
      metalness: 0.05,
    });
    const pillWhite = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.42,
      metalness: 0.04,
    });

    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.82, 14), amber);
    bottle.position.y = -0.08;
    group.add(bottle);

    const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 14), cap);
    capMesh.position.y = 0.42;
    group.add(capMesh);

    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.32), label);
    tag.position.set(0, -0.02, 0.3);
    group.add(tag);

    for (let i = 0; i < 4; i += 1) {
      const capsule = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.07, 0.14, 4, 8),
        i % 2 === 0 ? pill : pillWhite
      );
      capsule.rotation.z = Math.PI / 2;
      capsule.position.set(0.55 + (i % 2) * 0.14, -0.42 + Math.floor(i / 2) * 0.12, 0.08);
      group.add(capsule);
    }

    group.rotation.y = 0.28;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Corrugated roofing panel stack — building materials brands */
  roofpanel() {
    const group = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.48,
      metalness: 0.55,
    });
    const metalDark = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.52,
      metalness: 0.5,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.55,
      metalness: 0.18,
    });

    for (let i = 0; i < 3; i += 1) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.04, 0.72), i % 2 === 0 ? metal : metalDark);
      panel.position.set(0, -0.12 + i * 0.08, i * 0.06);
      panel.rotation.y = 0.12 + i * 0.05;
      group.add(panel);
    }

    for (let x = -0.42; x <= 0.42; x += 0.21) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.74), metalDark);
      rib.position.set(x, 0.02, 0.08);
      group.add(rib);
    }

    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 8), accent);
    screw.position.set(0.35, 0.08, 0.22);
    group.add(screw);

    group.rotation.y = -0.32;
    group.scale.setScalar(0.92);
    return group;
  },

  /** Tower crane — crane rental / heavy construction brands */
  towercrane() {
    const group = new THREE.Group();
    const yellow = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.52,
      metalness: 0.22,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.42,
      metalness: 0.48,
    });
    const cable = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.15,
    });

    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 0.14), yellow);
    mast.position.y = 0.08;
    group.add(mast);

    const jib = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 0.1), yellow);
    jib.position.set(0.35, 0.72, 0);
    group.add(jib);

    const counter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.1), steel);
    counter.position.set(-0.55, 0.72, 0);
    group.add(counter);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.18), steel);
    cab.position.set(0.05, 0.62, 0.12);
    group.add(cab);

    const hookLine = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 6), cable);
    hookLine.position.set(0.82, 0.22, 0);
    group.add(hookLine);

    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 6, 10, Math.PI), steel);
    hook.position.set(0.82, -0.08, 0);
    hook.rotation.x = Math.PI / 2;
    group.add(hook);

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.55), steel);
    base.position.y = -0.62;
    group.add(base);

    group.rotation.y = 0.35;
    group.scale.setScalar(0.88);
    return group;
  },

  /** Commercial truck tire — fleet / tire supply brands */
  tire() {
    const group = new THREE.Group();
    const rubber = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.88,
      metalness: 0.04,
    });
    const tread = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.92,
      metalness: 0.02,
    });
    const rim = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.55,
    });
    const hub = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.42,
      metalness: 0.48,
    });

    const outer = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.22, 12, 24), rubber);
    outer.rotation.y = Math.PI / 2;
    group.add(outer);

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.18, 16), rim);
    inner.rotation.z = Math.PI / 2;
    group.add(inner);

    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10), hub);
    center.rotation.z = Math.PI / 2;
    group.add(center);

    for (let i = 0; i < 8; i += 1) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), tread);
      const angle = (i / 8) * Math.PI * 2;
      block.position.set(Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0);
      block.rotation.z = angle;
      group.add(block);
    }

    group.rotation.x = 0.15;
    group.rotation.y = 0.42;
    group.scale.setScalar(0.85);
    return group;
  },

  /** Stethoscope + medical cross — hospital / healthcare brands */
  stethoscope() {
    const group = new THREE.Group();
    const tube = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.62,
      metalness: 0.12,
    });
    const chest = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.32,
      metalness: 0.55,
    });
    const cross = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.45,
      metalness: 0.12,
      emissive: 0x991b1b,
      emissiveIntensity: 0.12,
    });
    const white = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.72,
      metalness: 0.02,
    });

    const diaphragm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 14), chest);
    diaphragm.rotation.x = Math.PI / 2;
    diaphragm.position.set(-0.42, -0.35, 0.12);
    group.add(diaphragm);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), chest);
    bell.position.set(-0.42, -0.18, 0.12);
    group.add(bell);

    const tubeA = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 8, 16, Math.PI * 1.1), tube);
    tubeA.rotation.set(0.4, 0.2, 0.5);
    tubeA.position.set(-0.05, 0.08, 0.05);
    group.add(tubeA);

    for (let x of [-0.12, 0.12]) {
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 6, 10), tube);
      ear.position.set(x, 0.42, 0.08);
      ear.rotation.x = Math.PI / 2;
      group.add(ear);
    }

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.04), cross);
    crossV.position.set(0.55, 0.05, 0.05);
    group.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.04), cross);
    crossH.position.set(0.55, 0.05, 0.05);
    group.add(crossH);

    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.28, 16), white);
    badge.position.set(0.55, 0.05, -0.02);
    badge.rotation.y = Math.PI;
    group.add(badge);

    group.rotation.y = -0.22;
    group.scale.setScalar(0.95);
    return group;
  },

  /** Mortarboard + stacked books — K–12 / school brands */
  graduationcap() {
    const group = new THREE.Group();
    const cloth = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.82,
      metalness: 0.04,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      roughness: 0.42,
      metalness: 0.35,
    });
    const bookCover = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.78,
      metalness: 0.03,
    });
    const pages = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.92,
      metalness: 0,
    });

    const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.52), bookCover);
    book1.position.set(0, -0.52, 0.05);
    book1.rotation.y = 0.15;
    group.add(book1);

    const pages1 = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.1, 0.46), pages);
    pages1.position.set(0.02, -0.5, 0.08);
    pages1.rotation.y = 0.15;
    group.add(pages1);

    const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.46), bookCover);
    book2.position.set(0.05, -0.38, 0.02);
    book2.rotation.y = -0.12;
    group.add(book2);

    const board = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.95), cloth);
    board.position.y = 0.02;
    board.rotation.y = 0.45;
    group.add(board);

    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.42), cloth);
    crown.position.y = 0.18;
    group.add(crown);

    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6), gold);
    tassel.position.set(0.32, 0.12, 0.32);
    tassel.rotation.z = 0.35;
    group.add(tassel);

    const button = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), gold);
    button.position.set(0.32, 0.32, 0.32);
    group.add(button);

    group.rotation.y = 0.28;
    group.scale.setScalar(0.92);
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

  if (hasObject) {
    const isLake = accent === "lake";
    const isWarm = accent === "warm";
    scene.add(
      new THREE.AmbientLight(isLake ? 0xe8f4f8 : isWarm ? 0xfff5e8 : 0xeef4ff, 0.55)
    );
    const key = new THREE.DirectionalLight(isLake ? 0xd4eef8 : isWarm ? 0xffe8cc : 0xd4e8ff, 0.85);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(isLake ? 0x5ec4d4 : isWarm ? 0xc4a574 : 0x94a3b8, 0.35);
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
