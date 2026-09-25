import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Printer,
  ChevronDown,
  Bell,
  Sparkles,
  SlidersHorizontal,
  Calendar,
  CheckCircle2,
  Cpu,
  FileDown,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Patient, DossierReport, LabSettings } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { CustomCalendar } from '../dashboard/CustomCalendar';

export type MainNavTab =
  | 'home'
  | 'dashboard'
  | 'patients'
  | 'exams'
  | 'packs'
  | 'reports'
  | 'anatomy'
  | 'admin';

interface HeaderProps {
  currentView: MainNavTab | string;
  onNavigate: (view: MainNavTab) => void;
  patients: Patient[];
  dossiers: DossierReport[];
  settings: LabSettings;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewDossier: () => void;
  onQuickPrint?: () => void;
  pendingValidationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  patients,
  dossiers,
  settings,
  onSelectPatient,
  onOpenNewPatient,
  onOpenNewDossier,
  onQuickPrint,
  pendingValidationCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1-30 Sep 2026');
  const [selectedPrescriberFilter, setSelectedPrescriberFilter] = useState('Tous les prescripteurs');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Tous statuts');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isPrescriberDropdownOpen, setIsPrescriberDropdownOpen] = useState(false);
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('universal-search-input');
        searchInput?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract unique prescribers dynamically from real data
  const uniquePrescribers = Array.from(new Set(dossiers.map(d => d.prescripteur).filter(Boolean))).sort();
  const prescriberOptions = ['Tous les prescripteurs', ...uniquePrescribers];

  const searchResults = searchQuery.trim()
    ? {
        patients: patients.filter(
          (p) =>
            p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.telephone.includes(searchQuery)
        ),
        dossiers: dossiers.filter(
          (d) =>
            d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.nomExamen.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.prescripteur.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : null;

  // View headings and descriptions inspired by the reference screenshot
  const viewMeta: Record<string, { title: string; subtitle: string }> = {
    home: {
      title: 'Centre Médical & Diagnostic',
      subtitle: `${settings.labName} · Plateau Médical · Norme ISO 15189`,
    },
    dashboard: {
      title: 'Rapports & Activité Clinique',
      subtitle: 'Septembre 2026 · Centre Hospitalier · Comparé à Août',
    },
    patients: {
      title: 'Registre des Patients',
      subtitle: `${patients.length} dossiers médicaux actifs · Identification biométrique`,
    },
    patient_profile: {
      title: 'Fiche Patient & Dossier Biologique',
      subtitle: 'Historique des analyses et surveillance thérapeutique',
    },
    exams: {
      title: 'Catalogue des Analyses Médicales',
      subtitle: 'Nomenclature officielle, valeurs de référence et automates',
    },
    packs: {
      title: 'Packs Prénatals & Bilans Métaboliques',
      subtitle: 'BPN Maternité, Cardio-Rénal, Pédiatrie et Protocoles Groupés',
    },
    reports: {
      title: 'Validation & Certification Biologique',
      subtitle: `${pendingValidationCount} dossiers en attente de visa médical ISO 15189`,
    },
    anatomy: {
      title: 'Cartographie Biomédicale 3D',
      subtitle: 'Systèmes anatomiques, voies veineuses et surveillance des organes cibles',
    },
    admin: {
      title: 'Configuration du Laboratoire',
      subtitle: 'Coordonnées officielles, accréditations, automates et sauvegardes',
    },
  };

  const currentMeta = viewMeta[currentView] || {
    title: 'CHAPLAB Medical LIS',
    subtitle: 'Plateforme Clinique & Analyses Médicales ISO 15189',
  };

  // Nav pills in the sub-header (inspired by the reference screenshot's Overview, Revenue, Retention, etc.)
  const navPills: { id: MainNavTab; label: string; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'reports', label: 'Validation Biologique', badge: pendingValidationCount > 0 ? String(pendingValidationCount) : undefined, badgeColor: 'bg-[#5B46F6] text-white' },
  ];

  return (
    <header className="sticky top-0 z-30 no-print transition-all duration-200">
      {/* Upper Glassmorphism Bar */}
      <div className="relative z-20 bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-3.5 shadow-[0_2px_20px_-8px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand / Facility Dropdown Pill + Live Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <BrandLogo
                customUrl={settings.logoUrl}
                preset="crystal_cross"
                size="sm"
              />
            </div>


          </div>

          {/* Center: Search Bar with glassmorphism styling */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="w-4 h-4 text-[#06B6D4] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="universal-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Rechercher patient, analyse, code tube (⌘K)"
                className="w-full h-[42px] pl-10 pr-14 bg-white/90 backdrop-blur-md hover:bg-white focus:bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-[#06B6D4] focus:ring-4 focus:ring-[#06B6D4]/10 rounded-full text-[13px] text-slate-900 placeholder-slate-400 transition-all outline-none shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200/80 rounded px-1.5 py-0.5 shadow-2xs pointer-events-none">
                ⌘K
              </div>
            </div>

            {/* Live Search Modal/Dropdown */}
            {isSearchOpen && searchResults && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSearchOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                  {/* Patients list */}
                  <div className="p-2.5">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Patients ({searchResults.patients.length})
                    </div>
                    {searchResults.patients.length > 0 ? (
                      searchResults.patients.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectPatient(p.id);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#EEEDFC]/60 text-left transition-colors cursor-pointer group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#5B46F6]">
                              {p.nom} {p.prenom}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {p.id} · {p.age} ans ({p.sexe}) · {p.telephone}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-[#5B46F6] group-hover:translate-x-0.5 transition-transform">
                            Ouvrir &rarr;
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">
                        Aucun patient trouvé
                      </div>
                    )}
                  </div>

                  {/* Dossiers list */}
                  <div className="p-2.5 bg-slate-50/50">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Dossiers d'analyses ({searchResults.dossiers.length})
                    </div>
                    {searchResults.dossiers.length > 0 ? (
                      searchResults.dossiers.slice(0, 4).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            onSelectPatient(d.patientId);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-left transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {d.id} — {d.nomExamen}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Date : {d.date} · {d.prescripteur}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              d.statut === 'VALIDE'
                                ? 'bg-[#E8F8EC] text-[#16A34A]'
                                : 'bg-[#FEF6EE] text-[#D97706]'
                            }`}
                          >
                            {d.statut}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">
                        Aucun dossier trouvé
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Quick Action Buttons matching reference image */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick print shortcut */}
            {onQuickPrint && (
              <button
                onClick={onQuickPrint}
                className="w-[42px] h-[42px] rounded-full bg-white border border-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:text-[#06B6D4]"
                title="Aperçu & Impression rapide"
              >
                <Printer className="w-[18px] h-[18px]" />
              </button>
            )}





            {/* Nouveau Patient Button */}
            <button
              onClick={onOpenNewPatient}
              className="flex items-center gap-2 h-[42px] px-5 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[13px] font-bold shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.6)] transition-all cursor-pointer smooth-press"
            >
              <UserPlus className="w-[16px] h-[16px] text-white" />
              <span className="tracking-tight">Nouveau Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Breadcrumb & Segmented Control Pill Row (Directly matching the reference image) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title & Subtitle Lockup (like "Reports - September 2026...") */}
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              {currentMeta.title}
            </h2>
          </div>

          {/* Filter Dropdowns on the right (like "1-30 Sep 2026 v", "vs Aug 2026 v", "All providers v") */}
          <div className="flex items-center gap-2 flex-wrap pb-1 md:pb-0">
            {/* Period Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0]/80 text-[13px] font-semibold text-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedPeriod}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <CustomCalendar isOpen={isPeriodDropdownOpen} onClose={() => setIsPeriodDropdownOpen(false)} align="right" />
            </div>

            {/* Prescribers Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsPrescriberDropdownOpen(!isPrescriberDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <span>{selectedPrescriberFilter}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isPrescriberDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPrescriberDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-1 text-xs">
                    {prescriberOptions.map((doc) => (
                      <button
                        key={doc}
                        onClick={() => {
                          setSelectedPrescriberFilter(doc);
                          setIsPrescriberDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          selectedPrescriberFilter === doc ? 'bg-[#EEEDFC] text-[#5B46F6] font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {doc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>


          </div>
        </div>

        {/* Third Row: Segmented Pills Bar (like "Overview | Revenue | Retention | Providers | Marketing") */}
        <div className="max-w-7xl mx-auto mt-2.5 flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {navPills.map((pill) => {
            const isActive = currentView === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onNavigate(pill.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer smooth-press ${
                  pill.id === 'dashboard'
                    ? isActive
                      ? 'bg-pink-200 text-pink-800 shadow-sm border border-pink-300'
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200 border border-pink-200'
                    : isActive
                    ? 'bg-[#F97316] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>{pill.label}</span>
                {pill.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      pill.badgeColor || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {pill.badge}
                  </span>
                )}
              </button>
            );
          })}
          </div>

          {currentMeta.subtitle && (
            <span className="text-xs text-slate-400 font-medium hidden sm:inline pr-2 whitespace-nowrap">
              {currentMeta.subtitle}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
