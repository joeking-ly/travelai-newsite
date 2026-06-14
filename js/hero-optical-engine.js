/**
 * TravelAI hero optical engine — adapted from "Quantum Core: Optical Engine"
 * Original: Justin Linwood Ross | MIT License | 2025
 * https://github.com (see upstream demo)
 *
 * Rainbow brand palette, dark #0A0A0F base, subtle lens dispersion — no HUD.
 */

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const BRAND_BG = 0x0a0a0f;
const BRAND_HEX = [
  "#FF6B6B",
  "#FFA500",
  "#FFD700",
  "#32CD32",
  "#00CED1",
  "#4169E1",
  "#9370DB",
  "#FF1493",
];

const noiseVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uSpike;
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    float n = snoise(position * 2.2 + uTime * 0.35);
    float pulse = sin(uTime * 2.2) * 0.04;
    vec3 newPos = position + normal * (n * uSpike + pulse);
    vPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const rainbowPlasmaFragment = `
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec3 vNormal;
  varying vec3 vPos;

  vec3 spectrum(float t) {
    t = fract(t);
    vec3 c = vec3(
      abs(t * 6.0 - 3.0) - 1.0,
      2.0 - abs(t * 6.0 - 2.0),
      2.0 - abs(t * 6.0 - 4.0)
    );
    return clamp(c, 0.0, 1.0);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPos);
    float fresnel = pow(clamp(1.0 - dot(viewDir, vNormal), 0.0, 1.0), 2.2);
    float scan = sin(vPos.y * 42.0 + uTime * 3.5) * 0.035;
    float hue = atan(vPos.z, vPos.x) / 6.2831853 + uTime * 0.06 + fresnel * 0.35;
    vec3 rainbow = spectrum(hue);
    vec3 deep = vec3(0.04, 0.04, 0.06);
    vec3 color = mix(deep, rainbow, 0.55 + fresnel * 0.45);
    color = mix(color, uAccent, fresnel * 0.35);
    color += rainbow * fresnel * 1.6;
    color += scan * rainbow;
    gl_FragColor = vec4(color, 0.88);
  }
`;

const AdvancedLensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAberration: { value: 0.006 },
    uDistortion: { value: 0.14 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAberration;
    uniform float uDistortion;
    varying vec2 vUv;

    vec2 distort(vec2 uv, float k) {
      vec2 centered = uv - 0.5;
      float r2 = dot(centered, centered);
      float f = 1.0 + r2 * (k + k * sqrt(r2));
      return f * centered + 0.5;
    }

    void main() {
      vec2 uv = vUv;
      vec2 rUv = distort(uv, uDistortion - uAberration);
      vec2 gUv = distort(uv, uDistortion);
      vec2 bUv = distort(uv, uDistortion + uAberration);
      float r = texture2D(tDiffuse, rUv).r;
      float g = texture2D(tDiffuse, gUv).g;
      float b = texture2D(tDiffuse, bUv).b;
      float mask = 1.0;
      if (rUv.x < 0.0 || rUv.x > 1.0 || rUv.y < 0.0 || rUv.y > 1.0) mask = 0.0;
      if (bUv.x < 0.0 || bUv.x > 1.0 || bUv.y < 0.0 || bUv.y > 1.0) mask = 0.0;
      gl_FragColor = vec4(r, g, b, 1.0) * mask;
    }
  `,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * @param {HTMLElement | null} mountEl
 * @returns {{ destroy: () => void } | null}
 */
export function initHeroOptical(mountEl) {
  if (!mountEl) return null;

  const hero = mountEl.closest(".hero");
  if (hero) hero.classList.add("hero--optical");

  if (prefersReducedMotion()) {
    mountEl.closest(".hero-optical")?.classList.add("hero-optical--static");
    return null;
  }

  const width = () => mountEl.clientWidth || window.innerWidth;
  const height = () => mountEl.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BRAND_BG, 0.022);

  const camera = new THREE.PerspectiveCamera(48, width() / height(), 0.1, 100);
  camera.position.z = 7.2;

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(BRAND_BG, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarsePointer() ? 1.25 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  mountEl.appendChild(renderer.domElement);
  renderer.domElement.className = "hero-optical__canvas";

  const detail = isCoarsePointer() ? 32 : 64;
  const particleCount = isCoarsePointer() ? 2200 : 3600;

  const accent = new THREE.Color(BRAND_HEX[4]);
  const sphereMat = new THREE.ShaderMaterial({
    vertexShader: noiseVertex,
    fragmentShader: rainbowPlasmaFragment,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSpike: { value: 0.18 },
      uAccent: { value: accent },
    },
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, detail), sphereMat);
  scene.add(core);

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.4 + Math.random() * 7.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * 0.45;
    positions[i * 3] = r * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.sin(theta);
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleColors = BRAND_HEX.map((h) => new THREE.Color(h));
  let colorIdx = 0;
  const particlesMat = new THREE.PointsMaterial({
    size: isCoarsePointer() ? 0.035 : 0.042,
    color: particleColors[0],
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width(), height()),
    1.2,
    0.45,
    0.82
  );
  bloomPass.threshold = 0.05;
  bloomPass.strength = 1.15;
  bloomPass.radius = 0.55;
  composer.addPass(bloomPass);

  const lensPass = new ShaderPass(AdvancedLensShader);
  lensPass.uniforms.uAberration.value = 0.006;
  lensPass.uniforms.uDistortion.value = 0.14;
  composer.addPass(lensPass);

  let targetSpike = 0.18;
  let particleSpeedMult = 0.85;
  let mouseX = 0;
  let mouseY = 0;
  let running = true;
  let raf = 0;

  const onMove = (e) => {
    const w = width();
    const h = height();
    mouseX = ((e.clientX - w / 2) / w) * 0.35;
    mouseY = ((e.clientY - h / 2) / h) * 0.35;
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  const clock = new THREE.Clock();

  function resize() {
    const w = width();
    const h = height();
    if (w < 1 || h < 1) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(mountEl);
  resize();

  const io = new IntersectionObserver(
    (entries) => {
      running = entries.some((e) => e.isIntersecting);
      if (running && !raf) animate();
    },
    { rootMargin: "80px", threshold: 0.05 }
  );
  io.observe(mountEl);

  function animate() {
    if (!running) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    sphereMat.uniforms.uTime.value = t;
    targetSpike = 0.14 + Math.sin(t * 0.28) * 0.06 + Math.sin(t * 0.71) * 0.03;
    sphereMat.uniforms.uSpike.value +=
      (targetSpike - sphereMat.uniforms.uSpike.value) * 0.04;

    colorIdx = (colorIdx + 0.0025) % 1;
    const ci = Math.floor(colorIdx * particleColors.length) % particleColors.length;
    const cj = (ci + 1) % particleColors.length;
    const blend = (colorIdx * particleColors.length) % 1;
    particlesMat.color.copy(particleColors[ci]).lerp(particleColors[cj], blend);
    sphereMat.uniforms.uAccent.value.lerp(particleColors[(ci + 3) % particleColors.length], 0.02);

    particles.rotation.y = -t * 0.07 * particleSpeedMult;
    particles.rotation.x = Math.sin(t * 0.12) * 0.08;
    core.rotation.y = t * 0.08;
    core.rotation.z = Math.sin(t * 0.15) * 0.12;

    lensPass.uniforms.uDistortion.value =
      0.12 + Math.sin(t * 0.18) * 0.05 + Math.sin(t * 0.43) * 0.02;
    lensPass.uniforms.uAberration.value =
      0.004 + Math.sin(t * 0.31) * 0.003 + Math.sin(t * 0.57) * 0.0015;

    camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2.2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    composer.render();
  }

  animate();

  return {
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      io.disconnect();
      composer.dispose();
      renderer.dispose();
      sphereMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      core.geometry.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
