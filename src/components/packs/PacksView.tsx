import React from 'react';
import {
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ExamDefinition } from '../../types';

interface PacksViewProps {
  catalog: ExamDefinition[];
  onPrescribePack: (packId: string) => void;
}

export const PacksView: React.FC<PacksViewProps> = ({ catalog, onPrescribePack }) => {
  const packsData = [
    {
      id: 'PACK_BPN',
      title: 'BPN MATERNITÉ',
      category: 'Gynécologie & Obstétrique',
      highlight: '⭐ Le Plus Prescrit',
      color: 'purple',
      badge: '8 ANALYSES CLÉS',
      description: 'Bilan de suivi prénatal systématique recommandé dès la première consultation (T1).',
      exams: [
        'NFS Complète',
        'Groupage Sanguin ABO-Rh',
        'Électrophorèse de l’Hb',
        'Goutte Épaisse & Paludisme',
        'Glycémie à jeun',
        'Bandelette Urinaire',
        'Sérologies: Ag HBs, Toxo, Rubéole, Syphilis',
        'Sortie certifiée A4',
      ],
      examIds: ['EXM-NFS', 'EXM-GS-RH', 'EXM-ELECTRO-HB', 'EXM-GOUTTE-EPAISSE', 'EXM-BIO-GLYCEMIE', 'EXM-URINES-BANDELETTE', 'EXM-SERO-INFECTIEUX'],
      discountPercentage: 30, // 30% discount
    },
    {
      id: 'BILAN_METABOLIQUE',
      title: 'BILAN MÉTABOLIQUE',
      category: 'Médecine Interne & Diabétologie',
      highlight: 'Suivi Diabète & HTA',
      color: 'blue',
      badge: 'EXPLORATION COMPLÈTE',
      description: 'Évaluation du risque cardiovasculaire, de l’équilibre glycémique et fonction rénale.',
      exams: [
        'Glycémie & HbA1c',
        'Créatininémie & DFG',
        'Urée & Acide Urique',
        'Profil Lipidique Complet',
        'Ionogramme Sanguin',
        'Ratio d’albuminurie',
      ],
      examIds: ['EXM-BIO-GLYCEMIE', 'EXM-BIO-RENAL', 'EXM-BIO-LIPIDIQUE', 'EXM-IONOGRAMME'],
      discountPercentage: 25,
    },
    {
      id: 'BILAN_PEDIATRIQUE',
      title: 'BILAN PÉDIATRIQUE',
      category: 'Pédiatrie & Néonatalogie',
      highlight: 'Spécial Enfant',
      color: 'emerald',
      badge: 'DÉPISTAGE PRÉCOCE',
      description: 'Bilan de santé global enfant : anémies, hémoglobinopathies et parasitoses.',
      exams: [
        'NFS Pédiatrique',
        'Électrophorèse de l’Hb',
        'Goutte Épaisse (Paludisme)',
        'Examen Parasitologique Selles',
        'Carte de Groupe Sanguin',
      ],
      examIds: ['EXM-NFS', 'EXM-ELECTRO-HB', 'EXM-GOUTTE-EPAISSE', 'EXM-GS-RH'],
      discountPercentage: 30,
    },
  ];

  const packs = packsData.map(pack => {
    let originalPriceNum = 0;
    // Check if the catalog contains the exams to sum their prices
    pack.examIds.forEach(id => {
      const found = catalog.find(e => e.id === id);
      if (found) {
        originalPriceNum += found.price;
      }
    });
    
    // Fallback if some exams are missing from catalog or original sum is 0
    if (originalPriceNum === 0) {
      if (pack.id === 'PACK_BPN') originalPriceNum = 25500;
      if (pack.id === 'BILAN_METABOLIQUE') originalPriceNum = 22000;
      if (pack.id === 'BILAN_PEDIATRIQUE') originalPriceNum = 17000;
    }

    const priceNum = Math.floor(originalPriceNum * (1 - pack.discountPercentage / 100));
    
    return {
      ...pack,
      originalPrice: `${originalPriceNum.toLocaleString('fr-FR')} FCFA`,
      price: `${priceNum.toLocaleString('fr-FR')} FCFA`,
    };
  });

  return (
    <div className="space-y-10 pb-10">
      {/* View Header */}
      <div className="text-center pt-6 pb-2">
        <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 font-sans">
          Choisissez le Bilan Adapté
        </h2>
        <p className="text-[13px] text-slate-500 mt-2 font-medium">
          Regroupements standardisés pour prescriptions rapides, avec tarifs préférentiels.
        </p>
      </div>

      {/* Packs Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        {packs.map((pack) => {
          const isHighlighted = pack.id === 'PACK_BPN';

          return (
            <div
              key={pack.id}
              className={`relative glass-panel transition-all overflow-hidden flex flex-col justify-between ${
                pack.id === 'PACK_BPN'
                  ? 'bg-gradient-to-br from-[#E0FF5F] to-[#F1FF9F] text-slate-900 border-white/50 shadow-xl transform xl:-translate-y-4'
                  : pack.id === 'BILAN_METABOLIQUE'
                  ? 'bg-gradient-to-br from-[#FFE5E5] to-[#FFF0E5] text-slate-900 border-white/50'
                  : 'bg-gradient-to-br from-[#E5F5FF] to-[#F0F8FF] text-slate-900 border-white/50'
              }`}
            >
              {isHighlighted && (
                <div className="absolute top-0 left-0 right-0 flex justify-center">
                  <div className="bg-slate-900 text-[#E0FF5F] text-[11px] font-bold uppercase tracking-wider px-6 py-1.5 rounded-b-2xl shadow-sm">
                    {pack.highlight}
                  </div>
                </div>
              )}

              <div className={`p-8 ${isHighlighted ? 'pt-10' : 'pt-8'}`}>
                {/* Title & Desc */}
                <h3 className="text-[20px] font-extrabold tracking-tight leading-snug text-slate-900">
                  {pack.id === 'PACK_BPN' ? 'BPN Maternité' :
                   pack.id === 'BILAN_METABOLIQUE' ? 'Métabolique' :
                   pack.id === 'BILAN_PEDIATRIQUE' ? 'Pédiatrique' : 'Pré-Opératoire'}
                </h3>
                <p className="text-[13px] mt-2 font-medium leading-relaxed min-h-[60px] text-slate-600/90">
                  {pack.description}
                </p>

                {/* Price */}
                <div className="mt-6 mb-8">
                  <div className="text-[13px] font-bold line-through mb-1 text-slate-500">
                    {pack.originalPrice}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-extrabold tracking-tight leading-none text-slate-900">
                      {pack.price.replace(' FCFA', '')}
                    </span>
                    <span className="text-[13px] font-bold text-slate-600">
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  onClick={() => onPrescribePack(pack.id)}
                  className={`w-full py-3.5 rounded-full text-[14px] font-bold transition-all shadow-sm cursor-pointer smooth-press mb-8 ${
                    pack.id === 'PACK_BPN'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                  }`}
                >
                  Sélectionner ce Pack
                </button>

                {/* Divider Line */}
                <div className="h-px w-full mb-6 bg-slate-900/10" />

                {/* Features */}
                <div className="space-y-4">
                  <div className="text-[13px] font-bold text-slate-900">
                    Analyses incluses :
                  </div>
                  <div className="space-y-3">
                    {pack.exams.map((examText, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-[13px] font-medium leading-snug">
                        <Zap className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" fill="currentColor" />
                        <span className="text-slate-700">{examText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
