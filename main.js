import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ═══════════════════════════════════════════════
   NEXBOT — Three.js Robot + Cyber-Punk Interactions
   ═══════════════════════════════════════════════ */

// ── Mouse state ──
const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

function updateCursor() {
  cursorX += (mouse.x - cursorX) * 0.2;
  cursorY += (mouse.y - cursorY) * 0.2;
  ringX += (mouse.x - ringX) * 0.1;
  ringY += (mouse.y - ringY) * 0.1;
  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Hover effect
document.querySelectorAll('[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Scroll Progress ──
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) {
    scrollProgress.style.width = (scrolled / maxScroll * 100) + '%';
  }
});

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Preloader ──
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 1200);
});

// ── Counter Animation ──
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isFloat ? current.toFixed(2) : Math.floor(current);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Observer for counter
const aboutSection = document.getElementById('about');
if (aboutSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(aboutSection);
}

// ── Scroll Reveal (fallback for browsers without scroll-driven animations) ──
if (!CSS.supports('animation-timeline', 'scroll()')) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });
}

/* ═══════════════════════════════════════════════
   THREE.JS — NEXBOT ROBOT (HIGH VISIBILITY)
   ═══════════════════════════════════════════════ */

const canvas = document.getElementById('robotCanvas');
if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(4.5, 1.5, 7);
  camera.lookAt(3, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // ── Post-processing: Bloom ──
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,   // strength — moderate bloom for neon glow
    0.3,   // radius
    0.5    // threshold — higher so only bright emissive parts bloom
  );
  composer.addPass(bloomPass);

  // ── Lighting (BRIGHT) ──
  const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
  scene.add(ambientLight);

  // Key light — cyan from front-right
  const keyLight = new THREE.DirectionalLight(0x00ffff, 2.0);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  // Rim light — magenta from back-left (creates silhouette edge)
  const rimLight = new THREE.DirectionalLight(0xff00ff, 1.8);
  rimLight.position.set(-4, 4, -4);
  scene.add(rimLight);

  // Fill light — blue from below
  const fillLight = new THREE.PointLight(0x3366ff, 2.0, 25);
  fillLight.position.set(0, -1, 5);
  scene.add(fillLight);

  // Spot from above — dramatic cone
  const spotLight = new THREE.SpotLight(0x00ffff, 2.5, 30, Math.PI / 5, 0.5);
  spotLight.position.set(0, 10, 3);
  spotLight.target.position.set(3, 0, 0);
  scene.add(spotLight);
  scene.add(spotLight.target);

  // Back-fill warm highlight
  const backLight = new THREE.PointLight(0xff33aa, 1.2, 20);
  backLight.position.set(3, 2, -3);
  scene.add(backLight);

  // ── Materials (BRIGHT, VISIBLE) ──
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x2a2a3e,
    emissive: 0x0a0a1e,
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.15,
  });

  const bodyMetal = new THREE.MeshStandardMaterial({
    color: 0x3a3a5e,
    emissive: 0x111133,
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.25,
  });

  const cyanEmissive = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 2.5,
    metalness: 0.3,
    roughness: 0.05,
  });

  const magentaEmissive = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 2.2,
    metalness: 0.3,
    roughness: 0.05,
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 4.0,
    metalness: 0.2,
    roughness: 0,
  });

  const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0x5566aa,
    emissive: 0x112244,
    emissiveIntensity: 0.5,
    metalness: 0.7,
    roughness: 0.3,
  });

  // Cyan edge glow material for wireframe outlines
  const edgeGlow = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.12,
    wireframe: true,
  });

  // ── Robot Group ──
  const bot = new THREE.Group();
  bot.scale.setScalar(0.9);

  // -- Base Platform --
  const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.3, 8);
  const basePlatform = new THREE.Mesh(baseGeo, darkMetal);
  basePlatform.position.y = -1.35;
  bot.add(basePlatform);

  // Base wireframe highlight
  const baseWire = new THREE.Mesh(baseGeo, edgeGlow);
  baseWire.position.y = -1.35;
  bot.add(baseWire);

  // Base ring glow (thick, visible)
  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.06, 16, 48),
    cyanEmissive
  );
  baseRing.position.y = -1.2;
  baseRing.rotation.x = Math.PI / 2;
  bot.add(baseRing);

  // Second ring (magenta, smaller)
  const baseRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.0, 0.04, 16, 48),
    magentaEmissive
  );
  baseRing2.position.y = -1.18;
  baseRing2.rotation.x = Math.PI / 2;
  bot.add(baseRing2);

  // -- Legs --
  const legGeo = new THREE.CylinderGeometry(0.13, 0.16, 1.2, 8);

  const leftLeg = new THREE.Mesh(legGeo, bodyMetal);
  leftLeg.position.set(-0.35, -0.6, 0);
  bot.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, bodyMetal);
  rightLeg.position.set(0.35, -0.6, 0);
  bot.add(rightLeg);

  // Leg glow strips
  const legStripGeo = new THREE.BoxGeometry(0.02, 1.1, 0.02);
  [-0.35, 0.35].forEach(x => {
    const strip = new THREE.Mesh(legStripGeo, cyanEmissive);
    strip.position.set(x, -0.6, 0.15);
    bot.add(strip);
  });

  // Knee joints
  const kneeGeo = new THREE.SphereGeometry(0.16, 12, 12);
  const leftKnee = new THREE.Mesh(kneeGeo, jointMaterial);
  leftKnee.position.set(-0.35, -0.1, 0);
  bot.add(leftKnee);

  const rightKnee = new THREE.Mesh(kneeGeo, jointMaterial);
  rightKnee.position.set(0.35, -0.1, 0);
  bot.add(rightKnee);

  // Knee glow rings
  const kneeRingGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 24);
  [-0.35, 0.35].forEach(x => {
    const ring = new THREE.Mesh(kneeRingGeo, cyanEmissive);
    ring.position.set(x, -0.1, 0);
    ring.rotation.x = Math.PI / 2;
    bot.add(ring);
  });

  // -- Torso / Body --
  const torsoGeo = new THREE.BoxGeometry(1.2, 1.5, 0.8, 2, 2, 2);
  const torso = new THREE.Mesh(torsoGeo, bodyMetal);
  torso.position.y = 0.7;
  bot.add(torso);

  // Torso wireframe
  const torsoWire = new THREE.Mesh(torsoGeo, edgeGlow);
  torsoWire.position.y = 0.7;
  bot.add(torsoWire);

  // Torso edge glow lines (neon outlines)
  const edgeLineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
  const torsoEdges = new THREE.EdgesGeometry(torsoGeo);
  const torsoLines = new THREE.LineSegments(torsoEdges, edgeLineMat);
  torsoLines.position.y = 0.7;
  bot.add(torsoLines);

  // Chest panel
  const chestPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.65, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x0d0d20,
      emissive: 0x050515,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.05,
    })
  );
  chestPanel.position.set(0, 0.8, 0.44);
  bot.add(chestPanel);

  // Chest glow strips (multiple, visible)
  const stripPositions = [
    { y: 0.95, w: 0.65, color: cyanEmissive },
    { y: 0.85, w: 0.55, color: magentaEmissive },
    { y: 0.75, w: 0.45, color: cyanEmissive },
    { y: 0.65, w: 0.35, color: magentaEmissive },
  ];
  stripPositions.forEach(s => {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(s.w, 0.04, 0.07),
      s.color
    );
    strip.position.set(0, s.y, 0.46);
    bot.add(strip);
  });

  // -- Neck --
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.3, 8),
    jointMaterial
  );
  neck.position.y = 1.55;
  bot.add(neck);

  // Neck ring
  const neckRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.025, 8, 24),
    cyanEmissive
  );
  neckRing.position.y = 1.45;
  neckRing.rotation.x = Math.PI / 2;
  bot.add(neckRing);

  // -- Head Group (tracks mouse) --
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.95;
  bot.add(headGroup);

  // Head shell
  const headGeo = new THREE.BoxGeometry(0.95, 0.75, 0.8, 2, 2, 2);
  const head = new THREE.Mesh(headGeo, darkMetal);
  headGroup.add(head);

  // Head edge glow
  const headEdges = new THREE.EdgesGeometry(headGeo);
  const headLines = new THREE.LineSegments(headEdges, new THREE.LineBasicMaterial({
    color: 0x00ffff, transparent: true, opacity: 0.5
  }));
  headGroup.add(headLines);

  // Visor / Face screen (brighter, glowing)
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.38, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x003344,
      emissive: 0x004455,
      emissiveIntensity: 1.5,
      metalness: 0.2,
      roughness: 0,
      transparent: true,
      opacity: 0.9,
    })
  );
  visor.position.set(0, 0.02, 0.43);
  headGroup.add(visor);

  // Visor edge glow
  const visorEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.8, 0.38, 0.06));
  const visorLines = new THREE.LineSegments(visorEdges, new THREE.LineBasicMaterial({
    color: 0x00ffff, transparent: true, opacity: 0.8
  }));
  visorLines.position.set(0, 0.02, 0.43);
  headGroup.add(visorLines);

  // Eyes (LARGE, BRIGHT)
  const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.2, 0.04, 0.46);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.2, 0.04, 0.46);
  headGroup.add(rightEye);

  // Eye glow halos
  const eyeHaloGeo = new THREE.RingGeometry(0.11, 0.14, 24);
  const eyeHaloMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  [-0.2, 0.2].forEach(x => {
    const halo = new THREE.Mesh(eyeHaloGeo, eyeHaloMat);
    halo.position.set(x, 0.04, 0.47);
    headGroup.add(halo);
  });

  // Antenna
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6),
    jointMaterial
  );
  antenna.position.set(0, 0.6, 0);
  headGroup.add(antenna);

  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    magentaEmissive
  );
  antennaTip.position.set(0, 0.88, 0);
  headGroup.add(antennaTip);

  // Second antenna (asymmetric)
  const antenna2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6),
    jointMaterial
  );
  antenna2.position.set(0.25, 0.5, 0);
  antenna2.rotation.z = -0.2;
  headGroup.add(antenna2);

  const antennaTip2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 10, 10),
    cyanEmissive
  );
  antennaTip2.position.set(0.3, 0.7, 0);
  headGroup.add(antennaTip2);

  // -- Shoulders (bigger, glowing joints) --
  const shoulderGeo = new THREE.SphereGeometry(0.22, 12, 12);

  const leftShoulder = new THREE.Mesh(shoulderGeo, jointMaterial);
  leftShoulder.position.set(-0.82, 1.3, 0);
  bot.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeo, jointMaterial);
  rightShoulder.position.set(0.82, 1.3, 0);
  bot.add(rightShoulder);

  // Shoulder glow rings
  const shoulderRingGeo = new THREE.TorusGeometry(0.25, 0.025, 8, 24);
  [-0.82, 0.82].forEach(x => {
    const ring = new THREE.Mesh(shoulderRingGeo, magentaEmissive);
    ring.position.set(x, 1.3, 0);
    ring.rotation.y = Math.PI / 2;
    bot.add(ring);
  });

  // -- Arms --
  const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 1.0, 8);

  const leftArm = new THREE.Mesh(armGeo, bodyMetal);
  leftArm.position.set(-0.82, 0.7, 0);
  bot.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, bodyMetal);
  rightArm.position.set(0.82, 0.7, 0);
  bot.add(rightArm);

  // Arm glow strips
  [-0.82, 0.82].forEach(x => {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.9, 0.02),
      cyanEmissive
    );
    strip.position.set(x, 0.7, 0.1);
    bot.add(strip);
  });

  // -- Hands --
  const handGeo = new THREE.BoxGeometry(0.2, 0.28, 0.17);

  const leftHand = new THREE.Mesh(handGeo, darkMetal);
  leftHand.position.set(-0.82, 0.1, 0);
  bot.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, darkMetal);
  rightHand.position.set(0.82, 0.1, 0);
  bot.add(rightHand);

  // Hand edge glow
  const handEdgeGeo = new THREE.EdgesGeometry(handGeo);
  [-0.82, 0.82].forEach(x => {
    const lines = new THREE.LineSegments(handEdgeGeo, new THREE.LineBasicMaterial({
      color: 0x00ffff, transparent: true, opacity: 0.4
    }));
    lines.position.set(x, 0.1, 0);
    bot.add(lines);
  });

  // -- Fingers --
  const fingerGeo = new THREE.BoxGeometry(0.04, 0.14, 0.04);
  [-0.06, 0, 0.06].forEach(offset => {
    [-0.82, 0.82].forEach(x => {
      const f = new THREE.Mesh(fingerGeo, jointMaterial);
      f.position.set(x + offset, -0.05, 0);
      bot.add(f);
    });
  });

  // Position bot to the right side
  bot.position.set(3, -0.3, 0);
  scene.add(bot);

  // ── Particle System ──
  const particleCount = 500;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    velocities[i * 3] = (Math.random() - 0.5) * 0.004;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    // Alternate cyan / magenta particles
    if (Math.random() > 0.5) {
      pColors[i * 3] = 0; pColors[i * 3 + 1] = 1; pColors[i * 3 + 2] = 1;
    } else {
      pColors[i * 3] = 1; pColors[i * 3 + 1] = 0; pColors[i * 3 + 2] = 1;
    }
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    vertexColors: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Ground Grid ──
  const gridHelper = new THREE.GridHelper(20, 40, 0x005555, 0x002233);
  gridHelper.position.y = -1.8;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.4;
  scene.add(gridHelper);

  // ── Ground glow plane (subtle) ──
  const groundGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.015,
      side: THREE.DoubleSide,
    })
  );
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.y = -1.75;
  scene.add(groundGlow);

  // ── Animation ──
  const clock = new THREE.Clock();
  let currentHeadRotX = 0, currentHeadRotY = 0;

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Mouse tracking for head
    const targetHeadRotY = mouse.nx * 0.6;
    const targetHeadRotX = -mouse.ny * 0.35;

    currentHeadRotY = THREE.MathUtils.lerp(currentHeadRotY, targetHeadRotY, 0.05);
    currentHeadRotX = THREE.MathUtils.lerp(currentHeadRotX, targetHeadRotX, 0.05);

    headGroup.rotation.y = currentHeadRotY;
    headGroup.rotation.x = currentHeadRotX;

    // Subtle body sway toward mouse
    bot.rotation.y = THREE.MathUtils.lerp(bot.rotation.y, mouse.nx * 0.12, 0.02);

    // Idle breathing animation
    const breathe = Math.sin(elapsed * 1.5) * 0.02;
    torso.position.y = 0.7 + breathe;
    torsoWire.position.y = 0.7 + breathe;
    torsoLines.position.y = 0.7 + breathe;
    headGroup.position.y = 1.95 + breathe * 1.3;

    // Arm sway
    leftArm.rotation.z = Math.sin(elapsed * 0.8) * 0.06 + 0.06;
    rightArm.rotation.z = -Math.sin(elapsed * 0.8) * 0.06 - 0.06;

    // Eye pulse
    eyeMaterial.emissiveIntensity = 3.5 + Math.sin(elapsed * 3) * 1.0;

    // Antenna pulse
    antennaTip.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.25);
    antennaTip2.scale.setScalar(1 + Math.cos(elapsed * 3.5) * 0.2);

    // Base rings rotation
    baseRing.rotation.z = elapsed * 0.3;
    baseRing2.rotation.z = -elapsed * 0.4;

    // Glow strip pulse
    cyanEmissive.emissiveIntensity = 2.5 + Math.sin(elapsed * 2) * 0.6;
    magentaEmissive.emissiveIntensity = 2.2 + Math.cos(elapsed * 2.5) * 0.5;

    // Update particles
    const posArray = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      if (Math.abs(posArray[i * 3]) > 9) velocities[i * 3] *= -1;
      if (Math.abs(posArray[i * 3 + 1]) > 9) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2]) > 9) velocities[i * 3 + 2] *= -1;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Grid subtle scroll
    gridHelper.position.z = (elapsed * 0.3) % 0.5;

    // Ground glow pulse
    groundGlow.material.opacity = 0.012 + Math.sin(elapsed) * 0.005;

    composer.render();
  }
  animate();

  // ── Resize ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}
