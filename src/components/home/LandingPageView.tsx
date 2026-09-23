import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  TestTubes,
  FileCheck2,
  Stethoscope,
  Activity,
  Layers,
  Printer,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { LabSettings } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface LandingPageViewProps {
  settings: LabSettings;
  onNavigate: (view: any) => void;
  onOpenNewDossier: () => void;
  onOpenNewPatient: () => void;
  patientsCount: number;
  dossiersCount: number;
  pendingCount: number;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  settings,
  onNavigate,
  onOpenNewDossier,
  onOpenNewPatient,
  patientsCount,
  dossiersCount,
  pendingCount,
}) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section with Glassmorphism and Color Accents */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-white via-[#F8F9FD] to-[#EEEDFC] border border-slate-200/90 shadow-lg shadow-indigo-500/5 p-8 sm:p-12 lg:p-16">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#818CF8]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#34D399]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D8D4FC] text-[#5B46F6] text-xs font-extrabold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#5B46F6]" />
            <span className="tracking-wide uppercase font-sans">
              SYSTÈME DE LABORATOIRE CLINIQUE DE NOUVELLE GÉNÉRATION
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-sans">
            L'Excellence Diagnostique au Service de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B46F6] via-[#6366F1] to-[#10B981]">
              Votre Centre de Santé
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            Conçu pour les cliniques et laboratoires modernes : gestion intégrée des dossiers biologiques, automatisation des analyseurs Mindray & Sysmex, goutte épaisse haute sensibilité et bulletins de résultats imprimables certifiés ISO 15189.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-bold shadow-lg shadow-slate-900/15 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
            >
              <span>Ouvrir le Tableau de Bord</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenNewDossier}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <TestTubes className="w-4 h-4 text-[#5B46F6]" />
              <span>+ Nouveau Dossier Patient</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#EEEDFC] hover:bg-[#E2E0FB] border border-[#D8D4FC] text-[#5B46F6] text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Édition des Bulletins ISO</span>
            </button>
          </div>

          {/* Live Quick Stats Strip */}
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Patients Actifs
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {patientsCount}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Dossiers sécurisés
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Dossiers Réalisés
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {dossiersCount}
              </div>
              <div className="text-[10px] text-[#5B46F6] font-semibold flex items-center gap-1 mt-0.5">
                <FileCheck2 className="w-3 h-3" />
                Analyses complètes
              </div>
            </div>

            <div className="bg-[#ECEAFE] p-3.5 rounded-2xl border border-[#D8D4FC] shadow-2xs">
              <div className="text-xs text-[#5B46F6] font-bold uppercase tracking-wider">
                À Valider Biologiste
              </div>
              <div className="text-2xl font-black text-[#5B46F6] mt-1 font-mono">
                {pendingCount}
              </div>
              <div className="text-[10px] text-[#5B46F6] font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                Priorité ISO 15189
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Automates Liés
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                4 / 4
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Mindray & Roche connectés
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid: 6 Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Une Plateforme Complète, Fluide et Modulaire
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tous les outils nécessaires pour transformer votre centre médical en référence diagnostique accréditée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Goutte Épaisse & Paludisme */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <TestTubes className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Paludisme & Goutte Épaisse Expert
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mise en valeur spécifique : résultat en gras, calcul de la densité parasitaire en surbrillance violette et bloc d'observations microscopiques certifié.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 cursor-pointer"
            >
              <span>Voir le catalogue d'analyses</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Packs Prénatals BPN */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#6366F1] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEEDFC] text-[#5B46F6] flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5B46F6] transition-colors">
                Packs Prénatals & Bilans Métaboliques
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Protocoles groupés en 1 clic : BPN Maternité (NFS, Albuminurie, Glycémie, Goutte Épaisse, VIH, Sérologies) avec interprétation automatique intégrée.
              </p>
            </div>
            <button
              onClick={() => onNavigate('packs')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5B46F6] cursor-pointer"
            >
              <span>Explorer les packs cliniques</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Impression & Édition ISO 15189 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#10B981] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8EC] text-[#16A34A] flex items-center justify-center font-bold">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors">
                Édition & Impression ISO 15189
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Génération instantanée des comptes-rendus avec en-tête d'établissement, gabarit A4 officiel et double A5 massicot avec signature biologique.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16A34A] cursor-pointer"
            >
              <span>Consulter les comptes-rendus</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 4: Validation Biologique ISO 15189 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Validation & Visa Biologiste
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visa numérique horodaté, détection en temps réel des valeurs critiques (anémie sévère, glycémie d'urgence) et horodatage ISO inviolable.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 cursor-pointer"
            >
              <span>Accéder aux validations ({pendingCount})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 5: Cartographie Anatomique 3D */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Cartographie 3D des Organes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Représentation spatiale interactive des systèmes physiologiques (foie, reins, moelle osseuse, pancréas) et corrélation automatique avec les bilans.
              </p>
            </div>
            <button
              onClick={() => onNavigate('anatomy')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 cursor-pointer"
            >
              <span>Explorer la cartographie 3D</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 6: Fiche Patient Complète */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-400 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                Dossier Patient & Surveillance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Suivi longitudinal de l'hémoglobine, alertes pré-remplies, gestion des prescripteurs et historique complet des examens réalisés.
              </p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
            >
              <span>Consulter le registre ({patientsCount})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand & Lab Identity Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <BrandLogo
            customUrl={settings.logoUrl}
            preset="crystal_cross"
            size="lg"
          />
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              {settings.labName}
            </div>
            <div className="text-xs text-slate-500">
              {settings.labCenter} · {settings.labAddress}
            </div>
            <div className="text-[11px] text-[#5B46F6] font-mono mt-0.5">
              Accréditation ISO 15189 · Agrément N° {settings.labAgrement}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Paramètres du Laboratoire
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-full bg-[#5B46F6] hover:bg-[#4F46E5] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Accéder aux Bulletins
          </button>
        </div>
      </div>
    </div>
  );
};
