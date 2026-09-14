const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../../frontend/assets/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function createCardSVG(title, subtitle, iconType, primaryColor, accentColor, bgStyle = 'dark') {
  const bg = bgStyle === 'dark' ? '#1e293b' : '#0f172a';
  const cardBg = bgStyle === 'dark' ? '#0f172a' : '#1e293b';
  
  let iconSvg = '';
  if (iconType === 'lathe') {
    iconSvg = `
      <!-- Lathe Machine Chuck & Shaft -->
      <rect x="100" y="160" width="80" height="90" rx="6" fill="#334155" stroke="${accentColor}" stroke-width="3"/>
      <circle cx="140" cy="205" r="28" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>
      <rect x="175" y="188" width="220" height="34" rx="4" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="180" y="195" width="210" height="20" fill="#94a3b8"/>
      <!-- Thread grooves on shaft -->
      <line x1="220" y1="188" x2="220" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="240" y1="188" x2="240" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="260" y1="188" x2="260" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="280" y1="188" x2="280" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="300" y1="188" x2="300" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="320" y1="188" x2="320" y2="222" stroke="#334155" stroke-width="2"/>
      <line x1="340" y1="188" x2="340" y2="222" stroke="#334155" stroke-width="2"/>
      <!-- Tool Post & Carbide Cutting Tool -->
      <rect x="270" y="222" width="60" height="50" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="295,222 305,222 300,212" fill="${accentColor}"/>
      <!-- Lathe Bed Base -->
      <rect x="60" y="270" width="480" height="35" rx="5" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <rect x="80" y="305" width="70" height="35" fill="#0f172a"/>
      <rect x="450" y="305" width="70" height="35" fill="#0f172a"/>
      <!-- Sparks -->
      <circle cx="300" cy="208" r="3" fill="#fbbf24"/>
      <line x1="300" y1="208" x2="290" y2="195" stroke="#f59e0b" stroke-width="2"/>
      <line x1="300" y1="208" x2="312" y2="192" stroke="#fbbf24" stroke-width="2"/>
    `;
  } else if (iconType === 'welding') {
    iconSvg = `
      <!-- Welding Torch & Joint -->
      <polygon points="120,280 480,280 470,295 130,295" fill="#334155"/>
      <rect x="220" y="190" width="70" height="90" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <rect x="310" y="190" width="70" height="90" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <!-- Weld Bead -->
      <path d="M 290 190 Q 300 200 290 210 Q 300 220 290 230 Q 300 240 290 250 Q 300 260 290 270 Q 300 280 290 280" fill="none" stroke="${accentColor}" stroke-width="7"/>
      <!-- Torch Handle -->
      <line x1="380" y1="130" x2="305" y2="215" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>
      <line x1="305" y1="215" x2="295" y2="225" stroke="#e2e8f0" stroke-width="6"/>
      <!-- Arc Flash -->
      <circle cx="295" cy="225" r="18" fill="#ffffff" opacity="0.9"/>
      <circle cx="295" cy="225" r="35" fill="#38bdf8" opacity="0.4"/>
      <!-- Sparks Burst -->
      <line x1="295" y1="225" x2="270" y2="200" stroke="#fde047" stroke-width="3"/>
      <line x1="295" y1="225" x2="325" y2="205" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="295" y1="225" x2="260" y2="235" stroke="#fde047" stroke-width="2"/>
      <line x1="295" y1="225" x2="320" y2="245" stroke="#ef4444" stroke-width="2"/>
      <line x1="295" y1="225" x2="280" y2="260" stroke="#f59e0b" stroke-width="3"/>
    `;
  } else if (iconType === 'rig') {
    iconSvg = `
      <!-- Borewell Rig Truck & Mast -->
      <!-- Truck Body -->
      <rect x="100" y="250" width="280" height="60" rx="6" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
      <rect x="100" y="210" width="80" height="40" rx="4" fill="#2563eb"/>
      <rect x="110" y="220" width="30" height="25" rx="2" fill="#93c5fd"/>
      <!-- Wheels -->
      <circle cx="140" cy="315" r="24" fill="#0f172a" stroke="#64748b" stroke-width="6"/>
      <circle cx="300" cy="315" r="24" fill="#0f172a" stroke="#64748b" stroke-width="6"/>
      <circle cx="350" cy="315" r="24" fill="#0f172a" stroke="#64748b" stroke-width="6"/>
      <!-- Stabilizers -->
      <rect x="90" y="290" width="12" height="35" fill="#e2e8f0"/>
      <rect x="80" y="325" width="32" height="8" fill="#f59e0b"/>
      <rect x="380" y="290" width="12" height="35" fill="#e2e8f0"/>
      <rect x="370" y="325" width="32" height="8" fill="#f59e0b"/>
      <!-- Heavy Drilling Mast Tower -->
      <polygon points="410,70 435,70 455,300 390,300" fill="#334155" stroke="${accentColor}" stroke-width="3"/>
      <!-- Mast Lattice Crosses -->
      <line x1="412" y1="100" x2="433" y2="130" stroke="#94a3b8" stroke-width="2"/>
      <line x1="433" y1="100" x2="412" y2="130" stroke="#94a3b8" stroke-width="2"/>
      <line x1="410" y1="150" x2="435" y2="180" stroke="#94a3b8" stroke-width="2"/>
      <line x1="435" y1="150" x2="410" y2="180" stroke="#94a3b8" stroke-width="2"/>
      <line x1="405" y1="200" x2="440" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <line x1="440" y1="200" x2="405" y2="230" stroke="#94a3b8" stroke-width="2"/>
      <!-- Rotary Head on Mast -->
      <rect x="400" y="160" width="45" height="35" rx="3" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>
      <!-- Crown Top Pulley -->
      <circle cx="422" cy="65" r="12" fill="#64748b" stroke="#ffffff" stroke-width="2"/>
    `;
  } else if (iconType === 'rods') {
    iconSvg = `
      <!-- Drilling Rods Stacking & Thread Joint -->
      <!-- Rod 1 with Thread Pin -->
      <rect x="80" y="150" width="280" height="28" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <!-- Tapered Pin Thread -->
      <polygon points="360,152 400,157 400,171 360,176" fill="${accentColor}" stroke="#d97706" stroke-width="2"/>
      <line x1="370" y1="153" x2="370" y2="175" stroke="#78350f" stroke-width="2"/>
      <line x1="380" y1="155" x2="380" y2="173" stroke="#78350f" stroke-width="2"/>
      <line x1="390" y1="156" x2="390" y2="172" stroke="#78350f" stroke-width="2"/>
      
      <!-- Box End Coupling on Rod 2 -->
      <rect x="405" y="146" width="120" height="36" rx="4" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>
      
      <!-- Lower Rods Stack -->
      <rect x="80" y="195" width="445" height="28" rx="3" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
      <rect x="80" y="240" width="445" height="28" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <rect x="80" y="285" width="445" height="28" rx="3" fill="#334155" stroke="#64748b" stroke-width="2"/>
      
      <!-- Thread Pitch Precision Gauge -->
      <rect x="340" y="110" width="80" height="30" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <text x="350" y="130" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">API 4½"</text>
      <line x1="380" y1="140" x2="380" y2="152" stroke="#38bdf8" stroke-width="2"/>
    `;
  } else if (iconType === 'compressor') {
    iconSvg = `
      <!-- High Pressure Compressor Unit & Gauges -->
      <!-- Main Tank / Enclosure -->
      <rect x="110" y="150" width="280" height="150" rx="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3"/>
      <!-- Radiator / Cooler Grill -->
      <rect x="130" y="170" width="100" height="110" rx="4" fill="#0f172a"/>
      <line x1="140" y1="180" x2="220" y2="180" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="195" x2="220" y2="195" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="210" x2="220" y2="210" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="225" x2="220" y2="225" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="240" x2="220" y2="240" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="255" x2="220" y2="255" stroke="#64748b" stroke-width="3"/>
      <line x1="140" y1="270" x2="220" y2="270" stroke="#64748b" stroke-width="3"/>
      <!-- Air-End & Manifold -->
      <rect x="250" y="170" width="120" height="50" rx="6" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <!-- High-Pressure Discharge Valve -->
      <polygon points="380,200 420,185 420,215" fill="${accentColor}"/>
      <rect x="420" y="193" width="70" height="14" rx="3" fill="#cbd5e1"/>
      <!-- Pressure Gauges -->
      <circle cx="280" cy="115" r="26" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
      <circle cx="280" cy="115" r="22" fill="#ffffff"/>
      <line x1="280" y1="115" x2="295" y2="105" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="280" cy="115" r="3" fill="#0f172a"/>
      <text x="268" y="130" font-family="sans-serif" font-size="8" font-weight="bold" fill="#0f172a">450 PSI</text>
      <!-- Base Skid -->
      <rect x="80" y="300" width="440" height="24" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    `;
  } else {
    // Maintenance & Workshop Floor
    iconSvg = `
      <!-- Tooling & Maintenance -->
      <circle cx="200" cy="200" r="60" fill="none" stroke="${accentColor}" stroke-width="14" stroke-dasharray="16 12"/>
      <circle cx="200" cy="200" r="30" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>
      <!-- Wrench Cross -->
      <path d="M 310 140 L 390 220 L 375 235 L 295 155 Z" fill="#94a3b8"/>
      <circle cx="300" cy="150" r="16" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>
      <circle cx="380" cy="230" r="16" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/>
      <!-- Oil / Hydraulic Drop -->
      <path d="M 430 150 C 430 150 460 190 460 210 A 30 30 0 1 1 400 210 C 400 190 430 150 430 150 Z" fill="#38bdf8" opacity="0.85"/>
      <!-- Floor Base -->
      <rect x="70" y="280" width="460" height="30" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    `;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${cardBg}"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="0.75" opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Background with Tech Grid -->
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  <rect width="600" height="400" fill="url(#grid)"/>

  <!-- Top Banner Accent -->
  <rect x="0" y="0" width="600" height="8" fill="url(#headerGrad)"/>

  <!-- Watermark / Tag -->
  <rect x="30" y="25" width="180" height="28" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="42" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${accentColor}" letter-spacing="1.5">SRI VELLINGIRI WORKS</text>

  <!-- Title & Subtitle in SVG Header -->
  <text x="30" y="85" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#f8fafc">${title}</text>
  <text x="30" y="108" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">${subtitle}</text>

  <!-- Graphic Scene -->
  ${iconSvg}

  <!-- Bottom Accent bar -->
  <rect x="30" y="360" width="540" height="3" fill="#334155"/>
  <rect x="30" y="360" width="120" height="3" fill="${accentColor}"/>
  <text x="490" y="375" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748b" text-anchor="end">WORKSHOP CERTIFIED</text>
</svg>
`;
}

// Generate all service and gallery SVGs
const assetsToGenerate = [
  // Services
  { name: 'service-lathe.svg', title: 'HEAVY LATHE WORKS', subtitle: 'Precision Spindles, Boring & Threading', type: 'lathe', pri: '#1e3a8a', acc: '#f59e0b' },
  { name: 'service-welding.svg', title: 'WELDING & FABRICATION', subtitle: 'Rig Mast Repair & Hardfacing', type: 'welding', pri: '#0f766e', acc: '#f97316' },
  { name: 'service-rig.svg', title: 'BOREWELL RIG SERVICE', subtitle: 'Hydraulic Cylinder & Mast Overhaul', type: 'rig', pri: '#1d4ed8', acc: '#eab308' },
  { name: 'service-rod.svg', title: 'DRILLING ROD WORKS', subtitle: 'API Thread Cutting & Straightening', type: 'rods', pri: '#4338ca', acc: '#06b6d4' },
  { name: 'service-compressor.svg', title: 'COMPRESSOR WORKS', subtitle: 'High Pressure Air-End & Valve Service', type: 'compressor', pri: '#0369a1', acc: '#f59e0b' },
  { name: 'service-maintenance.svg', title: 'RIG MAINTENANCE', subtitle: 'Field Troubleshooting & Overhaul', type: 'maintenance', pri: '#1e293b', acc: '#10b981' },

  // Gallery
  { name: 'gallery-workshop-1.svg', title: 'WORKSHOP LATHE SECTION', subtitle: 'Heavy Duty Bed Lathe in Operation', type: 'lathe', pri: '#1e293b', acc: '#f59e0b' },
  { name: 'gallery-welding-1.svg', title: 'RIG MAST WELDING', subtitle: '40-ft Mast Lattice Structure Welding', type: 'welding', pri: '#0f172a', acc: '#f97316' },
  { name: 'gallery-rig-1.svg', title: 'BOREWELL RIG BAY', subtitle: 'Truck Rig Overhaul & Cylinder Alignment', type: 'rig', pri: '#1e3a8a', acc: '#eab308' },
  { name: 'gallery-rods-1.svg', title: 'DRILL ROD THREADING', subtitle: 'API Regular Tool Joint Machining', type: 'rods', pri: '#1e293b', acc: '#06b6d4' },
  { name: 'gallery-compressor-1.svg', title: 'COMPRESSOR SERVICING', subtitle: 'High Pressure 450 PSI Valve Inspection', type: 'compressor', pri: '#0369a1', acc: '#f59e0b' },
  { name: 'gallery-workshop-2.svg', title: 'MACHINE SHOP TOOLING', subtitle: 'Boring Bar & Tooling Assembly Floor', type: 'maintenance', pri: '#1e293b', acc: '#10b981' },
  { name: 'gallery-welding-2.svg', title: 'HARDFACING WELDING', subtitle: 'Stabilizer Pad Wear Protection Deposit', type: 'welding', pri: '#0f172a', acc: '#f97316' },
  { name: 'gallery-rig-2.svg', title: 'ROTARY HEAD REBUILD', subtitle: 'Hydraulic Motor & Gearbox Assembly', type: 'rig', pri: '#1d4ed8', acc: '#f59e0b' },
  { name: 'gallery-rods-2.svg', title: 'CROSSOVER ADAPTER SUBS', subtitle: 'Precision Saver Subs & Transition Adapters', type: 'rods', pri: '#334155', acc: '#38bdf8' },
  { name: 'gallery-compressor-2.svg', title: 'INTERCOOLER TEST BENCH', subtitle: 'Ultrasonic Clean & Valve Pressure Test', type: 'compressor', pri: '#0284c7', acc: '#fbbf24' }
];

assetsToGenerate.forEach(item => {
  const content = createCardSVG(item.title, item.subtitle, item.type, item.pri, item.acc);
  fs.writeFileSync(path.join(targetDir, item.name), content, 'utf8');
  console.log(`Generated: ${item.name}`);
});

console.log('All image assets created successfully!');
