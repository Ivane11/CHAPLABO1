import React from 'react';
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Layers,
  FlaskConical,
  Activity,
  Home,
  Settings,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronDown,
  Cpu,
} from 'lucide-react';
import { LabSettings } from '../../types';

export type ActiveView =
  | 'home'
  | 'dashboard'
  | 'reports'
  | 'patients'
  | 'patient-profile'
  | 'exams'
  | 'packs'
  | 'anatomy'
  | 'admin';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  patientsCount: number;
  pendingValidationCount: number;
  onOpenNewDossier: () => void;
  settings?: LabSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  patientsCount,
  pendingValidationCount,
  onOpenNewDossier,
  settings,
}) => {
  // Navigation réelle du Laboratoire Médical
  const navItems = [
    {
      id: 'dashboard' as ActiveView,
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
    },
    {
      id: 'reports' as ActiveView,
      label: 'Dossiers & Analyses',
      icon: FileCheck,
      badge: pendingValidationCount > 0 ? String(pendingValidationCount) : undefined,
      badgeColor: 'bg-[#5B46F6] text-white',
    },
    {
      id: 'patients' as ActiveView,
      label: 'Registre Patients',
      icon: Users,
      badge: patientsCount > 0 ? String(patientsCount) : undefined,
    },
    {
      id: 'packs' as ActiveView,
      label: 'Packs Prénatals (BPN)',
      icon: Layers,
    },
    {
      id: 'exams' as ActiveView,
      label: 'Catalogue des Examens',
      icon: FlaskConical,
    },
    {
      id: 'anatomy' as ActiveView,
      label: 'Cartographie 3D',
      icon: Activity,
    },
    {
      id: 'home' as ActiveView,
      label: 'Accueil Vitrine',
      icon: Home,
    },
    {
      id: 'admin' as ActiveView,
      label: 'Configuration & Labo',
      icon: Settings,
    },
  ];

  const biologistName = settings?.labBiologist
    ? settings.labBiologist.split('—')[0].trim()
    : 'Dr. Ivane B. Kouassi';

  return (
    <aside className="w-[245px] shrink-0 bg-transparent flex flex-col justify-between select-none py-6 pl-6 pr-5 border-r border-slate-100 no-print">
      <div className="space-y-6">
        {/* Identité Biomédicale du Laboratoire */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#6355F6] flex items-center justify-center shadow-xs text-white">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 font-sans leading-none">
              CHAPLAB
            </div>
            <div className="text-[10px] font-medium text-slate-400 tracking-wide mt-1">
              Biologie & Analyses
            </div>
          </div>
        </div>

        {/* Sélecteur de Laboratoire / Site Biomédical */}
        <div
          onClick={() => setActiveView('admin')}
          className="bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/70 p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
          title="Paramètres du laboratoire"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#DFDCFE] text-[#5B46F6] font-bold text-xs flex items-center justify-center shrink-0">
              L
            </div>
            <div className="text-left overflow-hidden min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-[#5B46F6] transition-colors">
                {settings?.labName || 'Laboratoire Central'}
              </div>
              <div className="text-[10px] text-slate-400 truncate leading-tight">
                Plateau Medical · ISO 15189
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </div>

        {/* Section Navigation Biologique */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
            GESTION DU LABORATOIRE
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'patients' && activeView === 'patient-profile');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ECEAFE] text-[#5B46F6] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <item.icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#5B46F6]' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white text-[#5B46F6]'
                          : item.badgeColor || 'text-slate-500 bg-slate-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Zone Inférieure : Contrôle Automates, Raccourcis & Profil Biologiste */}
      <div className="space-y-4 pt-6">
        {/* Carte Statut CIQ & Automates (teinte menthe douce clinique) */}
        <div className="bg-[#EBF7EA] border border-[#D5EED3] rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#275330]">
              <Cpu className="w-3.5 h-3.5 text-[#2E6B3A]" />
              <span>Automates en Ligne</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          </div>
          <p className="text-[11px] text-[#36683F] leading-snug">
            Mindray BC-30s & Sysmex synchronisés. Contrôle CIQ du matin validé.
          </p>
          <button
            onClick={onOpenNewDossier}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold py-1.5 px-3 rounded-full shadow-2xs border border-[#CDE6CB] transition-colors cursor-pointer text-center"
          >
            + Nouveau dossier
          </button>
        </div>

        {/* Liens secondaires : Configuration & Aide */}
        <div className="space-y-0.5">
          <button
            onClick={() => setActiveView('admin')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Paramètres Système</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Guide d'utilisation</span>
          </button>
        </div>

        {/* Profil du Biologiste Médical Validateur */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6355F6] to-[#10B981] p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center overflow-hidden">
                IK
              </div>
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                {biologistName}
              </div>
              <div className="text-[10px] text-slate-400 truncate leading-tight">
                Biologiste Médical · Directeur
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
            title="Accueil"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
