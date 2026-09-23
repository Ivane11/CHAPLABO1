import React from 'react';

export type LogoPreset = 'crystal_cross' | 'dna_ribbon' | 'caduceus_luxury' | 'modern_biodot';

interface BrandLogoProps {
  customUrl?: string;
  preset?: LogoPreset;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  labName?: string;
}

export const PRESET_LOGOS: { id: LogoPreset; name: string; description: string }[] = [
  { id: 'crystal_cross', name: 'Croix Clinique Iris & Menthe', description: 'Insigne moderne pastel (comme la référence)' },
  { id: 'dna_ribbon', name: 'Hélice ADN & Chromosome', description: 'Biologie moléculaire & Génétique' },
  { id: 'caduceus_luxury', name: 'Caducée Médical Or & Indigo', description: 'Prestige hospitalier & Tradition' },
  { id: 'modern_biodot', name: 'BioDot Minimaliste', description: 'Haute technologie & LIS connecté' },
];

export const BrandLogo: React.FC<BrandLogoProps> = ({
  customUrl,
  preset = 'crystal_cross',
  size = 'md',
  className = '',
  showText = false,
  labName = 'CHAPLAB',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const renderIcon = () => {
    if (customUrl) {
      return (
        <img
          src={customUrl}
          alt="Logo Laboratoire"
          className="w-full h-full object-contain rounded-xl"
        />
      );
    }

    if (preset === 'crystal_cross') {
      return (
        <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#818CF8] to-[#34D399] p-0.5 shadow-md shadow-indigo-500/15 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 3V21M3 12H21"
                stroke="url(#iris-gradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="3" fill="#10B981" />
              <defs>
                <linearGradient id="iris-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      );
    }

    if (preset === 'dna_ribbon') {
      return (
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] p-1.5 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-full h-full">
            <path d="M4 19C7 19 8 5 12 5s5 14 8 14" />
            <path d="M4 5c3 0 4 14 8 14s5-14 8-14" />
            <line x1="6" y1="8" x2="18" y2="8" />
            <line x1="6" y1="16" x2="18" y2="16" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        </div>
      );
    }

    if (preset === 'caduceus_luxury') {
      return (
        <div className="w-full h-full rounded-2xl bg-[#0F172A] p-1.5 flex items-center justify-center text-[#FBBF24] border border-[#F59E0B]/30 shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
            <line x1="12" y1="2" x2="12" y2="22" strokeWidth="2.5" />
            <path d="M7 6c2-2 8-2 10 0-2 2-8 2-10 0z" fill="currentColor" fillOpacity="0.2" />
            <path d="M8 12c1.5-1.5 6.5-1.5 8 0s-6.5 1.5-8 0z" fill="currentColor" fillOpacity="0.2" />
            <circle cx="12" cy="3" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    }

    // Default modern biodot
    return (
      <div className="w-full h-full rounded-2xl bg-[#EEEDFC] border border-[#D8D4FC] p-1.5 flex items-center justify-center text-[#5B46F6]">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <circle cx="12" cy="12" r="9" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="4.5" fill="#6366F1" />
          <circle cx="12" cy="5" r="1.8" fill="#10B981" />
          <circle cx="19" cy="12" r="1.8" fill="#10B981" />
        </svg>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeClasses[size]} shrink-0 transition-transform hover:scale-105`}>
        {renderIcon()}
      </div>
      {showText && (
        <div className="leading-tight">
          <span className="font-extrabold text-base tracking-tight text-slate-900 block font-sans">
            {labName}
          </span>
          <span className="text-[10px] font-semibold text-[#6366F1] tracking-wider uppercase block">
            Laboratoire Accrédité ISO 15189
          </span>
        </div>
      )}
    </div>
  );
};
