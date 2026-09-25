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
  MessageCircle,
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
      id: 'reports' as ActiveView,
      label: 'Dossiers & Analyses',
      icon: FileCheck,
      badge: pendingValidationCount > 0 ? String(pendingValidationCount) : undefined,
      badgeColor: 'bg-[#5B46F6] text-white',
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
      id: 'admin' as ActiveView,
      label: 'Configuration & Labo',
      icon: Settings,
    },
    {
      id: 'home' as ActiveView,
      label: 'Accueil Vitrine',
      icon: Home,
    },
  ];

  const biologistName = settings?.labBiologist
    ? settings.labBiologist.split('—')[0].trim()
    : 'Dr. Ivane B. Kouassi';

  return (
    <aside className="w-[260px] shrink-0 bg-white/90 backdrop-blur-md flex flex-col justify-between select-none py-6 pl-6 pr-5 border-r border-[#E2E8F0]/80 no-print">
      <div className="space-y-6">
        {/* Identité Biomédicale du Laboratoire */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] flex items-center justify-center shadow-xs text-white">
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



        {/* Section Navigation Biologique */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
            GESTION DU LABORATOIRE
          </div>

          <nav className="space-y-[1px]">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'patients' && activeView === 'patient-profile');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] text-[12px] font-medium transition-all cursor-pointer smooth-press ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4F46E5]/12 to-[#7C3AED]/5 border-l-[3px] border-[#4F46E5] text-[#4338CA] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/80 border-l-[3px] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <item.icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive ? 'text-[#4F46E5]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${
                        isActive
                          ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-sm'
                          : item.badgeColor || 'text-[#64748B] bg-slate-100'
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

      {/* Zone Inférieure : Raccourcis & Profil Biologiste */}
      <div className="space-y-4 pt-6">
        {/* Action Rapide: Contact WhatsApp */}
        <div className="px-2">
          <button
            onClick={() => window.open('https://wa.me/2250748251943', '_blank')}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-[13px] font-bold py-2.5 px-4 rounded-[14px] shadow-sm hover:shadow-md transition-all cursor-pointer smooth-press flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>

        {/* Liens secondaires : Configuration & Aide */}
        <div className="space-y-0.5">
          <button
            onClick={() => setActiveView('admin')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer smooth-press"
          >
            <Settings className="w-[18px] h-[18px] text-slate-400" />
            <span>Paramètres Système</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer smooth-press"
          >
            <HelpCircle className="w-[18px] h-[18px] text-slate-400" />
            <span>Guide d'utilisation</span>
          </button>
        </div>


      </div>
    </aside>
  );
};
