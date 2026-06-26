import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const strings = JSON.parse(fs.readFileSync(path.join(root, 'docs/assets/i18n/strings.json'), 'utf8'));

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function heroSvg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" role="img" aria-label="${esc(t.hero_aria)}">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2350"/>
      <stop offset="45%" stop-color="#05060d"/>
      <stop offset="100%" stop-color="#0a1020"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#4fd6e0" stop-opacity="0.32"/>
      <stop offset="55%" stop-color="#4fd6e0" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#4fd6e0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowPurple" cx="92%" cy="18%" r="45%">
      <stop offset="0%" stop-color="#b388ff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#b388ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCore" cx="18%" cy="82%" r="42%">
      <stop offset="0%" stop-color="#7aa0ff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#7aa0ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="core" cx="38%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#4fd6e0"/>
      <stop offset="75%" stop-color="#b388ff"/>
      <stop offset="100%" stop-color="#b388ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e7edf5"/>
      <stop offset="45%" stop-color="#4fd6e0"/>
      <stop offset="100%" stop-color="#b388ff"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#243044" stroke-width="1" opacity="0.45"/>
    </pattern>
    <clipPath id="round">
      <rect width="1200" height="280" rx="24"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="1200" height="280" fill="url(#sky)"/>
    <rect width="1200" height="280" fill="url(#glowCyan)"/>
    <rect width="1200" height="280" fill="url(#glowPurple)"/>
    <rect width="1200" height="280" fill="url(#glowCore)"/>
    <rect width="1200" height="280" fill="url(#grid)" opacity="0.55"/>
    <ellipse cx="600" cy="300" rx="520" ry="120" fill="#4fd6e0" opacity="0.04"/>
    <ellipse cx="980" cy="40" rx="180" ry="80" fill="#b388ff" opacity="0.06"/>
    <g transform="translate(1020 72)">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="16s" repeatCount="indefinite"/>
        <ellipse cx="0" cy="0" rx="44" ry="18" fill="none" stroke="#7aa0ff" stroke-opacity="0.45" stroke-width="1.5" transform="rotate(-18)"/>
      </g>
      <circle cx="0" cy="-4" r="18" fill="url(#core)">
        <animate attributeName="r" values="16;19;16" dur="5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="-28" cy="-10" r="2.2" fill="#fff" opacity="0.85"/>
      <circle cx="30" cy="12" r="1.8" fill="#4fd6e0" opacity="0.9"/>
      <circle cx="18" cy="-22" r="1.5" fill="#b388ff" opacity="0.8"/>
      <circle cx="-12" cy="18" r="1.6" fill="#ffd54f" opacity="0.75"/>
    </g>
    <g fill="#fff" opacity="0.75">
      <circle cx="148" cy="58" r="2"><animate attributeName="opacity" values="0.35;0.95;0.35" dur="3.2s" repeatCount="indefinite"/></circle>
      <circle cx="210" cy="92" r="1.5" opacity="0.6"/>
      <circle cx="92" cy="118" r="1.8" opacity="0.55"/>
      <circle cx="168" cy="168" r="2.2"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite"/></circle>
      <circle cx="118" cy="210" r="1.4" opacity="0.65"/>
    </g>
    <g fill="#4fd6e0">
      <circle cx="78" cy="78" r="1.6" opacity="0.7"/>
      <circle cx="196" cy="138" r="2" opacity="0.8"/>
    </g>
    <text x="600" y="112" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5" fill="url(#titleGrad)">Latent Space Observatory</text>
    <text x="600" y="152" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#8a99b0">${esc(t.hero_subtitle)}</text>
    <rect x="280" y="176" width="640" height="2" rx="1" fill="#243044"/>
    <rect x="380" y="176" width="440" height="2" rx="1" fill="#4fd6e0" opacity="0.7">
      <animate attributeName="opacity" values="0.45;0.95;0.45" dur="4s" repeatCount="indefinite"/>
    </rect>
    <g font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600" fill="#8a99b0">
      <text x="600" y="212" text-anchor="middle">${esc(t.hero_tag1)}</text>
      <text x="600" y="238" text-anchor="middle" fill="#4fd6e0" opacity="0.9">${esc(t.hero_tag2)}</text>
    </g>
    <circle cx="1088" cy="208" r="2.5" fill="#b388ff" opacity="0.7">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="1040" cy="58" r="2" fill="#4fd6e0" opacity="0.6"/>
    <circle cx="148" cy="220" r="2" fill="#ff6b6b" opacity="0.55"/>
  </g>
</svg>`;
}

function statusSvg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 72" role="img" aria-label="${esc(t.status_aria)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f131a"/>
      <stop offset="100%" stop-color="#1a2350"/>
    </linearGradient>
  </defs>
  <rect width="900" height="72" rx="14" fill="url(#bg)" stroke="#1c2430" stroke-width="1"/>
  <circle cx="36" cy="36" r="8" fill="#4fd6e0" opacity="0.25">
    <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="36" cy="36" r="4" fill="#4fd6e0"/>
  <text x="58" y="32" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#e8edf5">${esc(t.status_line1)}</text>
  <text x="58" y="52" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" font-weight="500" fill="#8a99b0">${esc(t.status_line2)}</text>
  <text x="820" y="38" text-anchor="end" font-family="ui-monospace, monospace" font-size="11" fill="#4fd6e0" opacity="0.85">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>384-d → PCA₃
  </text>
</svg>`;
}

function orbitSvg(t) {
  const nebulaX = t.orbit_nebula.length > 18 ? 90 : 110;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 200" role="img" aria-label="${esc(t.orbit_aria)}">
  <defs>
    <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2350"/>
      <stop offset="50%" stop-color="#05060d"/>
      <stop offset="100%" stop-color="#0a1020"/>
    </linearGradient>
    <radialGradient id="probeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4fd6e0" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#4fd6e0" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#4fd6e0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#b388ff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#b388ff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="round">
      <rect width="560" height="200" rx="18"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="560" height="200" fill="url(#panel)"/>
    <rect width="560" height="200" fill="url(#nebula)" opacity="0.8">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="6s" repeatCount="indefinite"/>
    </rect>
    <g stroke="#243044" stroke-width="0.6" opacity="0.4">
      <line x1="0" y1="40" x2="560" y2="40"/><line x1="0" y1="80" x2="560" y2="80"/>
      <line x1="0" y1="120" x2="560" y2="120"/><line x1="0" y1="160" x2="560" y2="160"/>
      <line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/>
      <line x1="240" y1="0" x2="240" y2="200"/><line x1="320" y1="0" x2="320" y2="200"/>
      <line x1="400" y1="0" x2="400" y2="200"/><line x1="480" y1="0" x2="480" y2="200"/>
    </g>
    <g transform="translate(280 108)">
      <animateTransform attributeName="transform" type="rotate" values="0 280 108; 8 280 108; 0 280 108; -8 280 108; 0 280 108" dur="14s" repeatCount="indefinite" additive="sum"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/>
        <ellipse cx="0" cy="0" rx="118" ry="42" fill="none" stroke="#7aa0ff" stroke-opacity="0.35" stroke-width="1.2"/>
      </g>
      <g fill="#ff6b6b">
        <circle cx="-72" cy="-18" r="3.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite"/></circle>
        <circle cx="-58" cy="-8" r="2.5" opacity="0.8"/>
        <circle cx="-80" cy="-2" r="2" opacity="0.7"/>
        <circle cx="-65" cy="6" r="3" opacity="0.85"/>
        <circle cx="-48" cy="-14" r="2.2" opacity="0.75"/>
      </g>
      <g fill="#5cc46a">
        <circle cx="58" cy="-22" r="3.2"><animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite"/></circle>
        <circle cx="72" cy="-10" r="2.4" opacity="0.8"/>
        <circle cx="48" cy="-6" r="2.8" opacity="0.75"/>
        <circle cx="64" cy="4" r="2" opacity="0.7"/>
        <circle cx="82" cy="-18" r="2.6" opacity="0.85"/>
      </g>
      <g fill="#ffd54f">
        <circle cx="-8" cy="28" r="3.4"><animate attributeName="opacity" values="0.4;0.95;0.4" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="10" cy="34" r="2.3" opacity="0.8"/>
        <circle cx="-22" cy="38" r="2.6" opacity="0.75"/>
        <circle cx="4" cy="44" r="2" opacity="0.7"/>
        <circle cx="18" cy="26" r="2.8" opacity="0.85"/>
      </g>
      <g fill="#e8edf5" opacity="0.55">
        <circle cx="-30" cy="-32" r="1.5"/><circle cx="36" cy="14" r="1.2"/>
        <circle cx="-95" cy="12" r="1.4"/><circle cx="90" cy="8" r="1.6"/>
        <circle cx="0" cy="-38" r="1.3"/><circle cx="-40" cy="22" r="1.1"/>
      </g>
      <g>
        <circle cx="0" cy="0" r="28" fill="url(#probeGlow)" opacity="0.35">
          <animate attributeName="r" values="18;34;18" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.45;0.2" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle r="5" fill="#4fd6e0" stroke="#fff" stroke-width="1" opacity="0.95">
          <animateMotion path="M -40 -20 C 20 -40, 50 10, 30 30 C 0 50, -50 20, -40 -20" dur="7s" repeatCount="indefinite"/>
        </circle>
      </g>
      <circle cx="0" cy="-6" r="14" fill="#4fd6e0" opacity="0.25"/>
      <circle cx="0" cy="-6" r="8" fill="#b388ff" opacity="0.45">
        <animate attributeName="r" values="6;9;6" dur="4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <g font-family="Segoe UI, Inter, Arial, sans-serif" font-size="10" font-weight="700" fill="#8a99b0">
      <text x="24" y="24">${esc(t.orbit_concept)}</text>
      <text x="24" y="38" fill="#ff6b6b" font-size="9">${esc(t.orbit_categories)}</text>
      <text x="400" y="24">${esc(t.orbit_probe)}</text>
      <text x="400" y="38" fill="#4fd6e0" font-size="9">${esc(t.orbit_colormaps)}</text>
      <text x="24" y="178" fill="#4fd6e0">${esc(t.orbit_auto)}</text>
      <text x="${nebulaX}" y="178">${esc(t.orbit_nebula)}</text>
      <text x="430" y="178">${esc(t.orbit_pca)}</text>
    </g>
    <text x="480" y="178" font-family="ui-monospace, monospace" font-size="11" fill="#4fd6e0" opacity="0.85">fps 58
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
    </text>
    <rect x="24" y="52" width="512" height="1" fill="#243044" opacity="0.6"/>
    <rect x="24" y="52" width="180" height="1" fill="#4fd6e0" opacity="0.7">
      <animate attributeName="width" values="80;220;80" dur="5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.95;0.4" dur="5s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>`;
}

const divider = fs.readFileSync(path.join(root, 'docs/assets/readme-divider.svg'), 'utf8');

for (const [lang, t] of Object.entries(strings)) {
  const outDir = lang === 'en'
    ? path.join(root, 'docs/assets')
    : path.join(root, 'docs/assets/i18n', lang);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'readme-hero.svg'), heroSvg(t));
  fs.writeFileSync(path.join(outDir, 'readme-status.svg'), statusSvg(t));
  fs.writeFileSync(path.join(outDir, 'embedding-orbit.svg'), orbitSvg(t));
  if (lang !== 'en') {
    fs.writeFileSync(path.join(outDir, 'readme-divider.svg'), divider);
  }
  console.log('wrote', lang, '→', outDir);
}