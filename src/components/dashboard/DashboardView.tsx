import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Bell,
  ArrowDownToLine,
  ChevronDown,
  MoreHorizontal,
  Sparkles,
  FlaskConical,
  Activity,
  Calendar,
  Layers,
  TrendingUp,
  FileCheck,
  Cpu,
  Clock,
  ShieldCheck,
  UserCheck,
  Plus,
  Microscope,
} from 'lucide-react';
import { DossierReport, Patient } from '../../types';

interface DashboardViewProps {
  patients: Patient[];
  dossiers: DossierReport[];
  onSelectPatient: (patientId: string) => void;
  onOpenNewDossier: () => void;
  onOpenNewPatient: () => void;
  onNavigateToView: (view: any) => void;
  onPreviewReport: (dossier: DossierReport) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  dossiers,
  onSelectPatient,
  onOpenNewDossier,
  onOpenNewPatient,
  onNavigateToView,
  onPreviewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Hematology' | 'Biochemistry' | 'Automates' | 'Quality'>(
    'Overview'
  );
  const [selectedPeriod, setSelectedPeriod] = useState('1-30 Sep 2026');
  const [selectedComparison, setSelectedComparison] = useState('vs Août 2026');
  const [selectedAutomate, setSelectedAutomate] = useState('Tous les automates');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Recherche rapide de patient ou dossier
  const searchResults = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.telephone && p.telephone.includes(searchQuery))
      )
    : [];

  const handleExportClick = () => {
    const validDossier = dossiers.find((d) => d.statut === 'VALIDE') || dossiers[0];
    if (validDossier) {
      onPreviewReport(validDossier);
    } else {
      onOpenNewDossier();
    }
  };

  // Calculs dynamiques
  const totalDossiers = dossiers.length;
  const dossiersValides = dossiers.filter((d) => d.statut === 'VALIDE').length;
  const dossiersEnAttente = dossiers.filter((d) => d.statut === 'A_VALIDER').length;
  const tauxValidation = totalDossiers > 0 ? Math.round((dossiersValides / totalDossiers) * 100) : 94;

  return (
    <div className="space-y-6 text-slate-800">
      {/* En-tête Médicale Supérieure */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Titre & Sous-titre du Laboratoire */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Tableau de Bord Biologique
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Septembre 2026 · Plateau Technique Central · Conformité ISO 15189
          </p>
        </div>

        {/* Contrôles d'action rapide : Recherche, Notifications, Exportation */}
        <div className="flex items-center gap-2.5">
          {/* Barre de recherche en pilule avec raccourci ⌘K */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/80 rounded-full px-3.5 py-1.5 w-72 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Rechercher patient, analyse, code tube..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0">
                ⌘K
              </span>
            </div>

            {/* Menu déroulant des résultats de recherche */}
            {isSearchFocused && searchQuery.trim() && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSearchFocused(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 p-2 max-h-72 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Patients Correspondants
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPatient(p.id);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left p-2.5 hover:bg-[#ECEAFE] rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#5B46F6]">
                            {p.nom} {p.prenom}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {p.id} · {p.age} ans · {p.prescripteur || 'Externe'}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#5B46F6] font-bold">
                          Ouvrir &rarr;
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Aucun patient trouvé
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Raccourci vers les dossiers à valider */}
          <button
            onClick={() => onNavigateToView('reports')}
            className="w-8 h-8 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs relative cursor-pointer"
            title="Dossiers en attente de validation"
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            {dossiersEnAttente > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Bouton d'action pilule : Nouveau dossier */}
          <button
            onClick={onOpenNewDossier}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau dossier</span>
          </button>
        </div>
      </div>

      {/* Ligne des Onglets & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Onglets en pilules douces */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {[
            { id: 'Overview', label: 'Vue d’ensemble' },
            { id: 'Hematology', label: 'Hématologie & NFS' },
            { id: 'Biochemistry', label: 'Biochimie & Sérologie' },
            { id: 'Automates', label: 'Automates & Cadence' },
            { id: 'Quality', label: 'Contrôles CIQ' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#141416] text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filtres en pilules */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer whitespace-nowrap">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer whitespace-nowrap">
            <span>{selectedComparison}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer whitespace-nowrap">
            <span>{selectedAutomate}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 5 Cartes de Métriques Clés (KPIs du Laboratoire) avec Glassmorphisme & Animations Framer Motion */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Carte 1 : Dossiers d'analyses (Dossiers count) */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.015,
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 85, 246, 0.2)',
            transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
          }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onNavigateToView('reports')}
          className="glass-panel rounded-3xl p-5 shadow-xs transition-shadow flex flex-col justify-between cursor-pointer group select-none"
          title="Consulter les dossiers d'analyses"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium group-hover:text-[#5B46F6] transition-colors">Dossiers d'analyses</span>
            <div className="w-6 h-6 rounded-full border border-slate-200/80 bg-white/60 flex items-center justify-center text-slate-400 group-hover:text-[#5B46F6] group-hover:border-[#DFDCFE] transition-colors">
              <FlaskConical className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              {totalDossiers > 0 ? totalDossiers : 1428}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8]/90 px-2 py-0.5 rounded-full">
              ↑ 14.2%
            </span>
          </div>
        </motion.div>

        {/* Carte 2 : Validations en attente (Pending validations) - Carte signature lavande */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.015,
            boxShadow: '0 12px 28px -6px rgba(91, 70, 246, 0.18), 0 0 0 1px rgba(91, 70, 246, 0.35)',
            transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
          }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onNavigateToView('reports')}
          className="glass-panel rounded-3xl p-5 shadow-xs transition-shadow flex flex-col justify-between cursor-pointer bg-[#DFDCFE]/85 backdrop-blur-xl border border-[#CEC8FD] select-none group"
          title="Valider les dossiers en attente"
        >
          <div className="flex items-center justify-between text-xs text-[#5B46F6]">
            <span className="font-bold flex items-center gap-1.5">
              <span>Validations en attente</span>
              {dossiersEnAttente > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </span>
            <div className="w-6 h-6 rounded-full bg-white/80 shadow-2xs flex items-center justify-center text-[#5B46F6] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#5B46F6] font-sans">
              {dossiersEnAttente > 0 ? dossiersEnAttente : 3}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#A66708] bg-[#FEF3D6] px-2 py-0.5 rounded-full">
              {dossiersEnAttente > 0 ? 'À signer' : 'À jour'}
            </span>
          </div>
        </motion.div>

        {/* Carte 3 : Patients enregistrés (Patients count) */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.015,
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 85, 246, 0.2)',
            transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
          }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onNavigateToView('patients')}
          className="glass-panel rounded-3xl p-5 shadow-xs transition-shadow flex flex-col justify-between cursor-pointer group select-none"
          title="Consulter le registre des patients"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium group-hover:text-[#5B46F6] transition-colors">Patients enregistrés</span>
            <div className="w-6 h-6 rounded-full border border-slate-200/80 bg-white/60 flex items-center justify-center text-slate-400 group-hover:text-[#5B46F6] group-hover:border-[#DFDCFE] transition-colors">
              <UserCheck className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              {patients.length > 0 ? patients.length : 186}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8]/90 px-2 py-0.5 rounded-full">
              ↑ 18
            </span>
          </div>
        </motion.div>

        {/* Carte 4 : Délai Moyen de Rendu */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.015,
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 85, 246, 0.2)',
            transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
          }}
          whileTap={{ scale: 0.985 }}
          className="glass-panel rounded-3xl p-5 shadow-xs transition-shadow flex flex-col justify-between cursor-pointer group select-none"
          title="Délai moyen de rendu des résultats"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium group-hover:text-[#5B46F6] transition-colors">Délai moyen de rendu</span>
            <div className="w-6 h-6 rounded-full border border-slate-200/80 bg-white/60 flex items-center justify-center text-slate-400 group-hover:text-[#5B46F6] group-hover:border-[#DFDCFE] transition-colors">
              <Clock className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              2h 15m
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8]/90 px-2 py-0.5 rounded-full">
              ↓ 24 min
            </span>
          </div>
        </motion.div>

        {/* Carte 5 : Conformité Contrôles Qualité (CIQ) */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.015,
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 85, 246, 0.2)',
            transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
          }}
          whileTap={{ scale: 0.985 }}
          className="glass-panel rounded-3xl p-5 shadow-xs transition-shadow flex flex-col justify-between cursor-pointer group select-none"
          title="Conformité des contrôles internes de qualité"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium group-hover:text-[#10B981] transition-colors">Conformité CIQ</span>
            <div className="w-6 h-6 rounded-full border border-slate-200/80 bg-white/60 flex items-center justify-center text-slate-400 group-hover:text-[#10B981] group-hover:border-emerald-200 transition-colors">
              <TrendingUp className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              99.2%
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8]/90 px-2 py-0.5 rounded-full">
              Westgard OK
            </span>
          </div>
        </motion.div>
      </div>

      {/* Ligne 2 : Répartition par Discipline Biologique & Cadence des Automates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carte Gauche : Volume par Discipline de Biologie (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                Activité par Discipline Biologique
              </h3>
              <p className="text-xs text-slate-400">
                L’hématologie et la biochimie représentent 67% des examens
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('exams')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              title="Voir le catalogue d'examens"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {/* Discipline 1 : Hématologie */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 w-44 shrink-0">
                <FlaskConical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">Hématologie & NFS</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6355F6] rounded-full w-[82%]" />
              </div>
              <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                <span className="font-medium text-slate-900">542 dossiers</span>
                <span className="text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8] px-2 py-0.5 rounded-full">
                  ↑ 22%
                </span>
              </div>
            </div>

            {/* Discipline 2 : Biochimie */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 w-44 shrink-0">
                <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">Biochimie & Métabolisme</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#8D82F9] rounded-full w-[58%]" />
              </div>
              <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                <span className="font-medium text-slate-900">418 dossiers</span>
                <span className="text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8] px-2 py-0.5 rounded-full">
                  ↑ 14%
                </span>
              </div>
            </div>

            {/* Discipline 3 : Sérologie & Prénatal */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 w-44 shrink-0">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">Sérologie & Bilans BPN</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#BBB4FC] rounded-full w-[44%]" />
              </div>
              <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                <span className="font-medium text-slate-900">285 dossiers</span>
                <span className="text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8] px-2 py-0.5 rounded-full">
                  ↑ 9%
                </span>
              </div>
            </div>

            {/* Discipline 4 : Parasitologie */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 w-44 shrink-0">
                <Microscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">Parasitologie (GE Palu)</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#BCE6B3] rounded-full w-[28%]" />
              </div>
              <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                <span className="font-medium text-slate-900">124 dossiers</span>
                <span className="text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8] px-2 py-0.5 rounded-full">
                  ↑ 18%
                </span>
              </div>
            </div>

            {/* Discipline 5 : Immuno-Hémostase */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 w-44 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">Hémostase & Coagulation</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#D2F0CB] rounded-full w-[18%]" />
              </div>
              <div className="flex items-center justify-end gap-3 w-28 shrink-0 text-right">
                <span className="font-medium text-slate-900">59 dossiers</span>
                <span className="text-[10px] font-bold text-[#1F7A37] bg-[#E5F7E8] px-2 py-0.5 rounded-full">
                  ↑ 4%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Droite : Disponibilité & Cadence des Automates (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                Automates & Cadence Analytique
              </h3>
              <p className="text-xs text-slate-400">
                Taux de disponibilité opérationnelle · Sep 2026
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Automate 1 : Mindray BC-30s */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 w-44 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                    BC
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">Mindray BC-30s</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Hématologie · 42 tubes/h</div>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6355F6] rounded-full w-[98%]" />
                </div>
                <div className="w-9 text-right font-medium text-slate-800 shrink-0">
                  98%
                </div>
              </div>

              {/* Automate 2 : Sysmex XN-L 550 */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 w-44 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                    SX
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">Sysmex XN-L 550</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Diff 5-Part · 38 tubes/h</div>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8D82F9] rounded-full w-[94%]" />
                </div>
                <div className="w-9 text-right font-medium text-slate-800 shrink-0">
                  94%
                </div>
              </div>

              {/* Automate 3 : Selectra ProM */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 w-44 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                    SP
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">Selectra ProM</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Biochimie · 55 tests/h</div>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#BBB4FC] rounded-full w-[91%]" />
                </div>
                <div className="w-9 text-right font-medium text-slate-800 shrink-0">
                  91%
                </div>
              </div>

              {/* Automate 4 : Interlab G26 Sebia */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 w-44 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                    IL
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">Interlab G26 Sebia</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Électrophorèse Hb</div>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#BCE6B3] rounded-full w-[88%]" />
                </div>
                <div className="w-9 text-right font-medium text-slate-800 shrink-0">
                  88%
                </div>
              </div>
            </div>
          </div>

          {/* Conseil d'optimisation prédictif */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Calibration Selectra ProM effectuée à 07:30 · Réactifs conformes</span>
          </div>
        </div>
      </div>

      {/* Ligne 3 : Entonnoir du Flux Analytique & Suivi des Bilans Chroniques */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carte Gauche : Pipeline du Prélèvement à la Validation Médicale (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                Cycle de Traitement des Prélèvements
              </h3>
              <p className="text-xs text-slate-400">
                Progression des dossiers biologiques à travers les étapes médico-techniques
              </p>
            </div>
            {/* Badge ambre doux pour signaler le goulot d'étranglement médical */}
            <span className="text-[11px] font-medium text-[#A66708] bg-[#FEF3D6] px-2.5 py-1 rounded-full">
              Étape clé : Saisie → Visa Biologiste
            </span>
          </div>

          {/* Graphique en cascade moderne à 8 étapes */}
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-8 gap-2.5 items-end h-44">
              {/* Étape 1 : Accueil 100% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  100%
                </span>
                <div className="w-full bg-[#E2DFFD] rounded-xl h-full transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 2 : Prélèvement 96% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  96%
                </span>
                <div className="w-full bg-[#CECBFC] rounded-xl h-[96%] transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 3 : Centrifugation 92% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  92%
                </span>
                <div className="w-full bg-[#DFDCFE] rounded-xl h-[92%] transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 4 : Automate 88% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  88%
                </span>
                <div className="w-full bg-[#CECBFC] rounded-xl h-[88%] transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 5 : Saisie 82% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  82%
                </span>
                <div className="w-full bg-[#E2DFFD] rounded-xl h-[82%] transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 6 : Revue 78% */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                  78%
                </span>
                <div className="w-full bg-[#CECBFC] rounded-xl h-[78%] transition-transform group-hover:scale-y-105 origin-bottom" />
              </div>

              {/* Étape 7 : Validation Médicale 71% (Colonne mise en valeur en ambre/or pour le visa légal) */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-[#A66708] mb-1.5">
                  71%
                </span>
                <div className="w-full bg-[#F6C562] rounded-xl h-[71%] transition-transform group-hover:scale-y-105 origin-bottom shadow-xs" />
              </div>

              {/* Étape 8 : Édition / Remise 65% (Colonne mise en valeur en vert menthe) */}
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-[#1F7A37] mb-1.5">
                  65%
                </span>
                <div className="w-full bg-[#CDE9C2] rounded-xl h-[65%] transition-transform group-hover:scale-y-105 origin-bottom shadow-xs" />
              </div>
            </div>

            {/* Libellés sous les colonnes */}
            <div className="grid grid-cols-8 gap-2.5 mt-2.5 text-center">
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Accueil</div>
                <div className="text-[9px] text-slate-400 truncate">1 428 tubes</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Prélèvement</div>
                <div className="text-[9px] text-slate-400 truncate">1 371 tubes</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Centrifugé</div>
                <div className="text-[9px] text-slate-400 truncate">1 313 sérums</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Automate</div>
                <div className="text-[9px] text-slate-400 truncate">1 256 tests</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Saisie</div>
                <div className="text-[9px] text-slate-400 truncate">1 170 bilans</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 truncate">Revue CIQ</div>
                <div className="text-[9px] text-slate-400 truncate">1 113 bilans</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#A66708] truncate">Validation</div>
                <div className="text-[9px] text-slate-400 truncate">1 013 certifiés</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#1F7A37] truncate">Remis</div>
                <div className="text-[9px] text-slate-400 truncate">928 patients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Droite : Matrice de Suivi des Bilans Chroniques (Heatmap par Mois) (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
              Suivi des Cohortes Chroniques
            </h3>
            <p className="text-xs text-slate-400">
              % de renouvellement des bilans (Diabète, CPN Maternité, Rein)
            </p>
          </div>

          {/* Grille Heatmap Matricielle */}
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-medium text-slate-400">
              <div />
              <div>M1</div>
              <div>M2</div>
              <div>M3</div>
              <div>M4</div>
              <div>M5</div>
            </div>

            {/* Ligne Avril */}
            <div className="grid grid-cols-6 gap-2 items-center text-xs">
              <span className="text-[11px] font-medium text-slate-600">Avr</span>
              <div className="bg-[#8D82F9] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                84%
              </div>
              <div className="bg-[#A49CFA] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                76%
              </div>
              <div className="bg-[#BBB4FC] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                71%
              </div>
              <div className="bg-[#CEC8FD] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                68%
              </div>
              <div className="bg-[#DFDCFE] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                64%
              </div>
            </div>

            {/* Ligne Mai */}
            <div className="grid grid-cols-6 gap-2 items-center text-xs">
              <span className="text-[11px] font-medium text-slate-600">Mai</span>
              <div className="bg-[#786BF8] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                87%
              </div>
              <div className="bg-[#9B92FA] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                79%
              </div>
              <div className="bg-[#B5ADFB] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                74%
              </div>
              <div className="bg-[#CBC5FD] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                69%
              </div>
              <div className="bg-slate-50 rounded-lg h-8" />
            </div>

            {/* Ligne Juin */}
            <div className="grid grid-cols-6 gap-2 items-center text-xs">
              <span className="text-[11px] font-medium text-slate-600">Juin</span>
              <div className="bg-[#8D82F9] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                82%
              </div>
              <div className="bg-[#A49CFA] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                75%
              </div>
              <div className="bg-[#BBB4FC] text-slate-800 font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                70%
              </div>
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
            </div>

            {/* Ligne Juillet */}
            <div className="grid grid-cols-6 gap-2 items-center text-xs">
              <span className="text-[11px] font-medium text-slate-600">Juil</span>
              <div className="bg-[#7064F6] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                89%
              </div>
              <div className="bg-[#948BF9] text-white font-medium text-[10px] rounded-lg h-8 flex items-center justify-center">
                81%
              </div>
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
            </div>

            {/* Ligne Août */}
            <div className="grid grid-cols-6 gap-2 items-center text-xs">
              <span className="text-[11px] font-medium text-slate-600">Août</span>
              <div className="bg-[#6355F6] text-white font-bold text-[10px] rounded-lg h-8 flex items-center justify-center">
                91%
              </div>
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
              <div className="bg-slate-50 rounded-lg h-8" />
            </div>
          </div>

          {/* Légende du dégradé en français */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Fréquence faible</span>
            <div className="flex-1 mx-3 h-2 rounded-full bg-gradient-to-r from-[#DFDCFE] via-[#8D82F9] to-[#6355F6]" />
            <span>Assiduité élevée</span>
          </div>
        </div>
      </div>
    </div>
  );
};
