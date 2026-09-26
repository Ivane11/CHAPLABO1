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
  Microscope,
  Syringe,
  Droplets,
  HeartPulse,
} from 'lucide-react';
import { LabSettings } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface LandingPageViewProps {
  settings: LabSettings;
  onNavigate: (view: any) => void;
  onOpenNewDossier: () => void;
  onOpenNewPatient: () => void;
  onOpenLogin: () => void;
  patientsCount: number;
  dossiersCount: number;
  pendingCount: number;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  settings,
  onNavigate,
  onOpenNewDossier,
  onOpenNewPatient,
  onOpenLogin,
  patientsCount,
  dossiersCount,
  pendingCount,
}) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Header Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm">
        <div className="flex items-center">
          <BrandLogo size="md" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Fonctionnalités</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Avis</a>
          <a href="#" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1.5 cursor-pointer text-[14px] font-medium text-slate-700 hover:text-slate-900">
            <span className="text-lg">🇫🇷</span>
            <span>FR</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-90 opacity-60" />
          </div>
          <button 
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors"
          >
            Commencer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Showcase Section with Glassmorphism and Color Accents */}
      <div className="relative rounded-[40px] overflow-hidden bg-white/40 border border-white/60 shadow-xl shadow-[#6941C6]/5 p-8 sm:p-12 lg:p-16 backdrop-blur-3xl">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6941C6]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
        `}</style>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-white/60 text-[#6941C6] text-[11px] font-extrabold shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#6941C6]" />
              <span className="tracking-wider uppercase font-sans">
                SYSTÈME DE LABORATOIRE CLINIQUE DE NOUVELLE GÉNÉRATION
              </span>
            </div>
  
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] font-sans">
              L'Excellence Diagnostique au Service de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6941C6] via-[#8B5CF6] to-[#059669] bg-[length:200%_auto] animate-[text-shimmer_4s_ease-in-out_infinite]">
                Votre Centre de Santé
              </span>
              .
            </h1>
  
            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
              Conçu pour les cliniques et centres de santé modernes : gestion intégrée des dossiers biologiques, suivi précis des résultats, goutte épaisse haute sensibilité et édition de bulletins professionnels et clairs.
            </p>
  
            <div className="relative z-50 flex flex-wrap items-center gap-4 pt-8 pb-12">
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#5832E5] hover:bg-[#4623C2] text-white text-[15px] font-bold shadow-lg shadow-[#5832E5]/20 hover:shadow-xl transition-all cursor-pointer group"
              >
                <span>Accéder à l'espace membre</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6941C6]/10 to-[#059669]/10 rounded-full blur-3xl animate-pulse"></div>
            <img 
              src="/Doctors-amico.svg" 
              alt="Medical Team" 
              className="w-full max-w-[450px] h-auto object-contain relative z-10 animate-float"
            />
          </div>
        </div>

          <div className="pt-10 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[24px] border border-white/60 shadow-sm">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                Patients Actifs
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                {patientsCount}
              </div>
              <div className="text-[11px] text-[#059669] font-bold flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                Dossiers sécurisés
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[24px] border border-white/60 shadow-sm">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                Dossiers Réalisés
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                {dossiersCount}
              </div>
              <div className="text-[11px] text-[#6941C6] font-bold flex items-center gap-1.5 mt-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                Analyses complètes
              </div>
            </div>

            <div className="bg-[#F2EEFF]/80 backdrop-blur-xl p-5 rounded-[24px] border border-[#EAE4FF] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-xl rounded-full"></div>
              <div className="relative z-10">
                <div className="text-[11px] text-[#6941C6] font-bold uppercase tracking-widest">
                  À Valider Biologiste
                </div>
                <div className="text-3xl font-black text-[#6941C6] mt-1 font-mono">
                  {pendingCount}
                </div>
                <div className="text-[11px] text-[#6941C6] font-bold flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Priorité d'analyse
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[24px] border border-white/60 shadow-sm">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                Catalogue d'Analyses
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                80+
              </div>
              <div className="text-[11px] text-[#059669] font-bold flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                Examens disponibles
              </div>
            </div>
          </div>
        </div>


      {/* Feature Showcase Grid: 6 Pillars */}
      <div className="relative">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 relative z-10">
          
          {/* Animated decorative background elements */}
          <div className="absolute -left-12 -top-8 text-[#6941C6]/10 animate-[bounce_4s_infinite] drop-shadow-xl hidden md:block">
            <Microscope className="w-16 h-16" />
          </div>
          <div className="absolute right-0 -top-4 text-emerald-500/10 animate-[bounce_5s_infinite_0.5s] drop-shadow-xl hidden md:block">
            <HeartPulse className="w-14 h-14" />
          </div>
          <div className="absolute left-1/4 -bottom-6 text-emerald-500/10 animate-[bounce_4.5s_infinite_1s] drop-shadow-xl hidden md:block">
            <Droplets className="w-10 h-10" />
          </div>
          <div className="absolute right-1/4 -bottom-4 text-[#6941C6]/10 animate-[bounce_3.5s_infinite_1.5s] drop-shadow-xl hidden md:block">
            <Syringe className="w-12 h-12" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans relative">
            Une Plateforme Complète, Fluide et Modulaire
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Tous les outils nécessaires pour transformer votre centre médical en référence diagnostique accréditée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Goutte Épaisse & Paludisme */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-[#6941C6]/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-purple-50/80 border border-purple-100 text-[#6941C6] flex items-center justify-center font-bold">
                <TestTubes className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#6941C6] transition-colors">
                Paludisme & Goutte Épaisse Expert
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Mise en valeur spécifique : résultat en gras, calcul de la densité parasitaire en surbrillance violette et bloc d'observations microscopiques certifié.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-[#6941C6]">
              <span>Voir le catalogue d'analyses</span>
              <div className="w-8 h-8 rounded-full bg-[#6941C6]/5 text-[#6941C6] flex items-center justify-center group-hover:bg-[#6941C6] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Packs Prénatals BPN */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-[#6941C6]/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#F2EEFF]/80 border border-[#EAE4FF] text-[#6941C6] flex items-center justify-center font-bold">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#6941C6] transition-colors">
                Packs Prénatals & Bilans
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Protocoles groupés en 1 clic : BPN Maternité (NFS, Albuminurie, Glycémie, Goutte Épaisse, VIH, Sérologies) avec interprétation automatique intégrée.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-[#6941C6]">
              <span>Explorer les packs cliniques</span>
              <div className="w-8 h-8 rounded-full bg-[#6941C6]/5 text-[#6941C6] flex items-center justify-center group-hover:bg-[#6941C6] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Impression & Édition ISO 15189 */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-[#059669]/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-emerald-50/80 border border-emerald-100 text-[#059669] flex items-center justify-center font-bold">
                <Printer className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#059669] transition-colors">
                Édition & Impression
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Génération instantanée des comptes-rendus avec en-tête d'établissement, gabarit A4 officiel et double A5 massicot avec signature biologique.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-[#059669]">
              <span>Consulter les comptes-rendus</span>
              <div className="w-8 h-8 rounded-full bg-[#059669]/5 text-[#059669] flex items-center justify-center group-hover:bg-[#059669] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: Validation Biologique ISO 15189 */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Validation & Visa Biologiste
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Visa numérique horodaté, détection en temps réel des valeurs critiques (anémie sévère, glycémie d'urgence) et horodatage inviolable.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-blue-600">
              <span>Accéder aux validations ({pendingCount})</span>
              <div className="w-8 h-8 rounded-full bg-blue-600/5 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 5: Cartographie Anatomique 3D */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-amber-50/80 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Cartographie 3D des Organes
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Représentation spatiale interactive des systèmes physiologiques (foie, reins, moelle osseuse, pancréas) et corrélation automatique avec les bilans.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-amber-600">
              <span>Explorer la cartographie 3D</span>
              <div className="w-8 h-8 rounded-full bg-amber-600/5 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 6: Fiche Patient Complète */}
          <div className="glass-panel rounded-[32px] p-7 border border-white/60 shadow-sm hover:shadow-xl hover:border-slate-500/30 transition-all group flex flex-col justify-between cursor-pointer" onClick={onOpenLogin}>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[20px] bg-slate-100/80 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                Dossier Patient & Surveillance
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Suivi longitudinal de l'hémoglobine, alertes pré-remplies, gestion des prescripteurs et historique complet des examens réalisés.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[13px] font-bold text-slate-700">
              <span>Consulter le registre ({patientsCount})</span>
              <div className="w-8 h-8 rounded-full bg-slate-700/5 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Minimalist Footer Line */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[13px] text-slate-500 font-medium px-4">
        <div className="flex items-center gap-6 mb-4 sm:mb-0">
          <a href="#" className="hover:text-slate-800 transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-slate-800 transition-colors">CGU</a>
          <a href="mailto:contact@chaplab.com" className="hover:text-slate-800 transition-colors">contact@chaplab.com</a>
        </div>
        <div>
          © 2026 EBUNI STUDIO. Digital Medical Solution.
        </div>
      </div>
    </div>
  );
};
