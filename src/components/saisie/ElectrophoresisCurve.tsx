import React from 'react';

interface ElectrophoresisCurveProps {
  profil: string;
  compact?: boolean;
}

interface PeakDef {
  frac: string;
  center: number;
  height: number;
  width: number;
  label: string;
}

const PROFILES: Record<string, PeakDef[]> = {
  'AA': [
    { frac: 'A', center: 60, height: 95, width: 28, label: 'A' },
    { frac: 'A2', center: 25, height: 8, width: 22, label: 'A₂' }
  ],
  'AS': [
    { frac: 'A', center: 60, height: 60, width: 28, label: 'A' },
    { frac: 'S', center: 32, height: 38, width: 26, label: 'S' },
    { frac: 'A2', center: 15, height: 4, width: 18, label: '' }
  ],
  'SS': [
    { frac: 'S', center: 35, height: 88, width: 30, label: 'S' },
    { frac: 'F', center: 15, height: 10, width: 24, label: 'F' },
    { frac: 'A2', center: 80, height: 3, width: 18, label: '' }
  ],
  'AC': [
    { frac: 'A', center: 60, height: 60, width: 28, label: 'A' },
    { frac: 'C', center: 30, height: 38, width: 26, label: 'C' },
    { frac: 'A2', center: 15, height: 4, width: 18, label: '' }
  ],
  'SC': [
    { frac: 'S', center: 55, height: 48, width: 26, label: 'S' },
    { frac: 'C', center: 30, height: 48, width: 26, label: 'C' },
    { frac: 'F', center: 15, height: 4, width: 18, label: '' }
  ],
  'CC': [
    { frac: 'C', center: 40, height: 92, width: 30, label: 'C' },
    { frac: 'A2', center: 15, height: 6, width: 20, label: 'A₂' }
  ],
  'BETA-THAL': [
    { frac: 'A', center: 60, height: 70, width: 28, label: 'A' },
    { frac: 'A2', center: 25, height: 20, width: 24, label: 'A₂' },
    { frac: 'F', center: 15, height: 12, width: 22, label: 'F' }
  ]
};

const getFractionColor = (frac: string) => {
  if (frac === 'A' || frac === 'A1') return { fill: '#1E5FAA', stroke: '#0F3F7A' };
  if (frac === 'S' || frac === 'F') return { fill: '#4CAF50', stroke: '#2E7D32' };
  if (frac === 'C') return { fill: '#F4B942', stroke: '#C58F00' };
  if (frac === 'A2') return { fill: '#06B6D4', stroke: '#0891B2' };
  return { fill: '#F4B942', stroke: '#C58F00' };
};

const gauss = (x: number, center: number, height: number, width: number) => {
  const dx = (x - center) / width;
  return height * Math.exp(-0.5 * dx * dx);
};

export const ElectrophoresisCurve: React.FC<ElectrophoresisCurveProps> = ({ profil, compact }) => {
  // Normalisation du profil
  let normalizedProfil = profil;
  if (profil.startsWith('AA')) normalizedProfil = 'AA';
  else if (profil.startsWith('AS')) normalizedProfil = 'AS';
  else if (profil.startsWith('SS')) normalizedProfil = 'SS';
  else if (profil.startsWith('SC')) normalizedProfil = 'SC';
  else if (profil.startsWith('AC')) normalizedProfil = 'AC';
  else if (profil.startsWith('CC')) normalizedProfil = 'CC';
  else if (profil.toUpperCase().includes('THAL')) normalizedProfil = 'BETA-THAL';

  const peaks = PROFILES[normalizedProfil] || [];
  const hasCurve = peaks.length > 0;

  if (!hasCurve) {
    return (
      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 11, fontStyle: 'italic', padding: 20 }}>
        Aucune courbe disponible pour ce profil.
      </div>
    );
  }

  // Bruit de fond aléatoire (fixé pseudo-aléatoirement pour être stable)
  const generateNoisePath = () => {
    let path = `M 70,340 `;
    // On génère des ondulations entre 335 et 325 (plus bas = valeur Y plus élevée, donc plus proche de 340, ex: 332-338)
    // Le prompt dit : ondulant entre y=335 et y=325
    let currentY = 338;
    for (let x = 70; x <= 780; x += 15) {
      // variation simple pseudo-aléatoire basée sur x
      const variation = Math.sin(x * 0.1) * 3 + Math.cos(x * 0.3) * 2;
      currentY = 335 - variation;
      if (currentY > 340) currentY = 340;
      path += `L ${x},${currentY.toFixed(1)} `;
    }
    path += `L 780,340 Z`;
    return path;
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: compact ? 4 : 8, 
      border: '1px solid #E5E7EB', 
      borderRadius: 4,
      maxWidth: compact ? '480px' : '100%',
      margin: compact ? '0 auto' : '0'
    }}>
      <div style={{ fontSize: compact ? 9 : 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        Profil électrophorétique : {normalizedProfil}
      </div>
      <svg viewBox="0 0 800 400" style={{ width: '100%', height: compact ? '150px' : 'auto', display: 'block', margin: '0 auto' }}>
        
        {/* Grille verticale */}
        {[180, 290, 400, 510, 620].map(x => (
          <line key={x} x1={x} y1="30" x2={x} y2="340" stroke="#E5E7EB" strokeWidth="1" />
        ))}

        {/* Axe X */}
        <line x1="70" y1="340" x2="780" y2="340" stroke="#000" strokeWidth="1" />
        <polygon points="780,336 788,340 780,344" fill="#000" />
        <text x="425" y="380" fontSize="12" fill="#000" textAnchor="middle">
          Temps de Migration / Temps de Rétention (s)
        </text>

        {/* Axe Y */}
        <line x1="70" y1="340" x2="70" y2="30" stroke="#000" strokeWidth="1" />
        <polygon points="66,30 70,22 74,30" fill="#000" />
        <text 
          x="20" y="185" 
          fontSize="12" fill="#374151" 
          textAnchor="middle" 
          transform="rotate(-90 20 185)"
        >
          Intensité (u.a.)
        </text>

        {/* Bruit de fond */}
        <path d={generateNoisePath()} fill="#D1D5DB" fillOpacity="0.5" stroke="#9CA3AF" strokeWidth="1" />

        {/* Pics */}
        {peaks.map((p, idx) => {
          const x_center = 70 + (p.center / 100) * 710;
          const max_h_pixels = (p.height / 100) * 310;
          
          let path = '';
          const startX = x_center - 3 * p.width;
          const endX = x_center + 3 * p.width;
          
          for (let x = startX; x <= endX; x += 2) {
            // Empêcher de sortir à gauche de l'axe Y
            if (x < 70) continue; 
            if (x > 780) continue;
            
            const h = gauss(x, x_center, max_h_pixels, p.width);
            const y = 340 - h;
            
            if (path === '') {
              path += `M ${x.toFixed(1)},340 L ${x.toFixed(1)},${y.toFixed(1)} `;
            } else {
              path += `L ${x.toFixed(1)},${y.toFixed(1)} `;
            }
          }
          
          if (path !== '') {
            // Terminer à la base
            path += `L ${Math.min(780, endX).toFixed(1)},340 Z`;
          }

          const colors = getFractionColor(p.frac);

          return (
            <React.Fragment key={`peak-group-${idx}`}>
              <path
                d={path}
                fill={colors.fill}
                fillOpacity="0.85"
                stroke={colors.stroke}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {p.label && (
                <text
                  x={x_center}
                  y={340 - max_h_pixels - 10}
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1F2937"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              )}
            </React.Fragment>
          );
        })}

        {/* Légende */}
        <g transform="translate(620, 50)">
          <text x="0" y="0" fontSize="12" fontWeight="bold" textDecoration="underline" fill="#000">
            Fractions
          </text>
          
          {/* Hb A */}
          <rect x="0" y="15" width="12" height="12" fill="#1E5FAA" stroke="#0F3F7A" strokeWidth="1" />
          <text x="18" y="25" fontSize="11" fill="#000">Hb A</text>

          {/* Hb S/F */}
          <rect x="0" y="35" width="12" height="12" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1" />
          <text x="18" y="45" fontSize="11" fill="#000">Hb S/F</text>
          
          {/* Autres */}
          <rect x="0" y="55" width="12" height="12" fill="#F4B942" stroke="#C58F00" strokeWidth="1" />
          <text x="18" y="65" fontSize="11" fill="#000">Autres</text>

          {/* Bruit de fond */}
          <rect x="0" y="75" width="12" height="12" fill="#D1D5DB" fillOpacity="0.5" stroke="#9CA3AF" strokeWidth="1" />
          <text x="18" y="85" fontSize="11" fill="#000">Bruit de fond</text>
        </g>
      </svg>
    </div>
  );
};
