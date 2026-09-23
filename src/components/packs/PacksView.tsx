import React from 'react';
import {
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Check,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface PacksViewProps {
  onPrescribePack: (packId: string) => void;
}

export const PacksView: React.FC<PacksViewProps> = ({ onPrescribePack }) => {
  const packs = [
    {
      id: 'PACK_BPN',
      title: 'PACK BPN MATERNITÉ (SUIVI PRÉNATAL)',
      category: 'Gynécologie & Obstétrique',
      highlight: '⭐ Le Plus Prescrit · Protocole National',
      color: 'purple',
      badge: '8 ANALYSES CLÉS',
      description:
        'Bilan systématique recommandé dès la première consultation prénatale (T1) pour la sécurité de la mère et du fœtus.',
      exams: [
        'NFS Formule Sanguine Complète (Mindray 3-Part)',
        'Groupage Sanguin ABO + Rhésus (Double épreuve)',
        'Électrophorèse de l’Hémoglobine (Dépistage Drépanocytose)',
        'Goutte Épaisse & Recherche Paludisme',
        'Glycémie à jeun (Dépistage Diabète gestationnel)',
        'Bandelette Urinaire (Protéinurie, Glycosurie, Nitrites)',
        'Sérologies Dépistage : Ag HBs, Toxoplasmose, Rubéole, Syphilis',
        'Sortie certifiée A4 Portrait avec filigrane médical',
      ],
      price: '18 000 FCFA',
      originalPrice: '25 500 FCFA',
    },
    {
      id: 'BILAN_METABOLIQUE',
      title: 'BILAN MÉTABOLIQUE & CARDIO-RÉNAL',
      category: 'Médecine Interne & Diabétologie',
      highlight: 'Suivi Diabète & HTA',
      color: 'blue',
      badge: 'EXPLORATION COMPLÈTE',
      description:
        'Évaluation globale du risque cardiovasculaire, de l’équilibre glycémique trimestriel et de la fonction rénale.',
      exams: [
        'Glycémie à jeun & Hémoglobine Glyquée (HbA1c)',
        'Créatininémie & Débit de Filtration Glomérulaire (CKD-EPI)',
        'Urée sanguine & Acide Urique',
        'Profil Lipidique complet (Cholestérol Total, HDL, LDL, Triglycérides)',
        'Ionogramme Sanguin (Sodium, Potassium, Chlore)',
        'Ratio d’albuminurie sur échantillon',
      ],
      price: '16 500 FCFA',
      originalPrice: '22 000 FCFA',
    },
    {
      id: 'BILAN_PEDIATRIQUE',
      title: 'BILAN PÉDIATRIQUE & SANTÉ SCOLAIRE (BPS)',
      category: 'Pédiatrie & Néonatalogie',
      highlight: 'Spécial Enfant',
      color: 'emerald',
      badge: 'DÉPISTAGE PRÉCOCE',
      description:
        'Bilan de santé global pour enfant : dépistage précoce des anémies, des hémoglobinopathies et parasitoses.',
      exams: [
        'NFS Pédiatrique avec indices érythrocytaires adaptés',
        'Électrophorèse de l’Hémoglobine (Dépistage précoce drépanocytose)',
        'Goutte Épaisse microscopique (Paludisme)',
        'Examen Parasitologique des Selles (KOP amibes & helminthes)',
        'Carte de Groupe Sanguin pédiatrique officielle',
      ],
      price: '12 000 FCFA',
      originalPrice: '17 000 FCFA',
    },
    {
      id: 'BILAN_PREOP',
      title: 'BILAN DE CHIRURGIE & PRÉ-OPÉRATOIRE',
      category: 'Anesthésie & Chirurgie',
      highlight: 'Sécurité Bloc',
      color: 'slate',
      badge: 'HÉMOSTASE & HÉMATO',
      description:
        'Bilan d’hémostase obligatoire avant tout acte chirurgical pour prévenir le risque hémorragique ou thrombotique.',
      exams: [
        'Hémogramme Complet (NFS & Numération Plaquettes)',
        'Taux de Prothrombine (TP) et INR',
        'Temps de Céphaline Activée (TCA)',
        'Fibrinogène chronométrique',
        'Groupage Sanguin ABO + Rh (Validation double détermination)',
        'Créatininémie & Ionogramme',
      ],
      price: '14 500 FCFA',
      originalPrice: '19 500 FCFA',
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Packs & Bilans Cliniques Groupés
          </h2>
          <p className="text-xs text-slate-500">
            Regroupements standardisés d'examens pour prescriptions rapides, traçabilité optimale et tarifs préférentiels.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg font-semibold">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Protocoles Validés par Biologiste</span>
        </div>
      </div>

      {/* Packs Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
              pack.id === 'PACK_BPN'
                ? 'border-purple-300 ring-2 ring-purple-100 shadow-purple-500/5'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Card Header */}
              <div
                className={`p-6 border-b ${
                  pack.color === 'purple'
                    ? 'bg-gradient-to-r from-purple-50 via-purple-50/50 to-indigo-50/40 border-purple-100'
                    : pack.color === 'blue'
                    ? 'bg-gradient-to-r from-blue-50 via-blue-50/50 to-sky-50/40 border-blue-100'
                    : pack.color === 'emerald'
                    ? 'bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-teal-50/40 border-emerald-100'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                    {pack.badge}
                  </span>
                  <span className="text-xs font-bold text-indigo-700">
                    {pack.highlight}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  {pack.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {pack.description}
                </p>
              </div>

              {/* Exams Features Checklist */}
              <div className="p-6 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  ANALYSES INCLUSES DANS CE PACK :
                </div>
                {pack.exams.map((examText, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-tight">{examText}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Footer with Price & Action */}
            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 line-through font-mono">
                    {pack.originalPrice}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 font-mono">
                    {pack.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onPrescribePack(pack.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    pack.color === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
                      : pack.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                      : pack.color === 'emerald'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25'
                  }`}
                >
                  <span>Sélectionner ce Pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
