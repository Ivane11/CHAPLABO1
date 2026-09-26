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
  ChevronDown,
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
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    { q: "ChapLab remplace-t-il un biologiste ?", a: "Non, ChapLab est un outil d'assistance et de gestion qui facilite le travail du biologiste, mais la validation finale reste sous sa responsabilité." },
    { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Toutes les données sont chiffrées de bout en bout et hébergées sur des serveurs sécurisés." },
    { q: "Puis-je l'utiliser sur mobile ?", a: "Non, l'application n'est pas responsive sur téléphone pour le moment. Elle est conçue pour être utilisée sur ordinateur." },
    { q: "Y a-t-il un abonnement payant ?", a: "Non, il n'y a aucun abonnement. Une fois que vous recevez le lien d'accès, l'utilisation de ChapLab est totalement gratuite." }
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans pb-0">
      {/* Soft Top Gradients mimicking the inspiration */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#F2EEFF] rounded-full blur-[100px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8F5EE] rounded-full blur-[100px] opacity-80 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      
      {/* Navbar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 mt-6 bg-white/70 backdrop-blur-xl rounded-full border border-white shadow-sm relative z-50">
        <div className="flex items-center">
          <BrandLogo size="md" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Fonctionnalités</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            Connexion
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto mt-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8F5EE] text-[#6941C6] text-[12px] font-bold shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plus rapide, plus sûr, plus efficace ✨</span>
        </div>

        <style>{`
          @keyframes shine-sweep {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .animate-shine {
            animation: shine-sweep 3s linear infinite;
            background-size: 200% auto;
            display: inline-block;
          }
        `}</style>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          L'allié indispensable <br/>pour votre{' '}
          <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#6941C6,45%,#D1C4E9,55%,#6941C6)] animate-shine">
            centre médical
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10">
          Accédez à une plateforme intelligente pour gérer vos dossiers biologiques, optimiser vos processus et délivrer des résultats fiables à vos patients, tout en respectant les normes de qualité.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6941C6] hover:bg-[#5832E5] text-white px-8 py-4 rounded-full text-[15px] font-bold shadow-xl shadow-[#6941C6]/20 hover:-translate-y-1 transition-all"
          >
            Essayez gratuitement
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Mockup Showcase (with animated SVG) */}
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[32px] blur-xl -z-10"></div>
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[32px] p-6 md:p-10 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-left space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[12px] font-bold text-slate-400 ml-2">Tableau de bord</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F2EEFF] text-[#6941C6] rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold text-slate-800">Patients Enregistrés</div>
                    <div className="text-sm text-slate-500">{patientsCount} dossiers actifs</div>
                  </div>
                </div>
                <div className="text-[#059669] font-bold text-sm bg-[#E8F5EE] px-3 py-1 rounded-full">+12%</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8F5EE] text-[#059669] rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold text-slate-800">Examens Validés</div>
                    <div className="text-sm text-slate-500">{dossiersCount} réalisés</div>
                  </div>
                </div>
                <div className="text-[#059669] font-bold text-sm bg-[#E8F5EE] px-3 py-1 rounded-full">Optimal</div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-15px); }
                }
                .animate-float {
                  animation: float 4s ease-in-out infinite;
                }
              `}</style>
              <img 
                src="/Doctors-amico.svg" 
                alt="Medical Team" 
                className="w-full max-w-[320px] h-auto object-contain animate-float drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Tout ce qu'il faut) */}
      <section id="features" className="max-w-6xl mx-auto px-6 mt-32 relative z-10">
        <div className="text-center mb-12">
          <div className="text-[#6941C6] text-[12px] font-bold uppercase tracking-widest mb-2">Fonctionnalités</div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Tout ce qu'il faut pour réussir</h2>
          <p className="text-slate-500 font-medium mt-4">Des outils conçus pour fluidifier votre quotidien et garantir la qualité.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-[#E8F5EE] text-[#059669] rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Gestion Complète</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Suivi détaillé des patients, historiques de visites et base de données sécurisée pour votre laboratoire.
            </p>
          </div>
          
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-[#F2EEFF] text-[#6941C6] rounded-2xl flex items-center justify-center mb-6">
              <TestTubes className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Analyses Expertes</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Goutte épaisse, packs prénatals, biochimie. Tous vos examens structurés avec valeurs de référence automatiques.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-[#F2EEFF] text-[#6941C6] rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Validation Biologique</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Alertes sur valeurs critiques, signature électronique et visa du biologiste pour une conformité ISO 15189.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-[#E0F2FE] text-[#0284C7] rounded-2xl flex items-center justify-center mb-6">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Édition & Impression</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Comptes-rendus générés instantanément en format A4 officiel ou A5, prêts à être remis aux patients.
            </p>
          </div>
        </div>
      </section>

      {/* STEPS SECTION (Simple comme 1, 2, 3) */}
      <section className="mt-32 bg-gradient-to-b from-transparent via-[#E8F5EE]/40 to-transparent py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-[#059669] text-[12px] font-bold uppercase tracking-widest mb-2">Processus</div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Simple comme 1, 2, 3</h2>
          <p className="text-slate-500 font-medium mt-4 mb-16">Lancez une analyse et rendez le résultat en quelques clics.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#059669] text-white font-black text-lg flex items-center justify-center border-4 border-white shadow-sm mb-6">1</div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#6941C6] mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Enregistrez</h3>
              <p className="text-[13px] text-slate-500 font-medium px-4">Créez le profil patient et sélectionnez les examens prescrits depuis le catalogue.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#059669] text-white font-black text-lg flex items-center justify-center border-4 border-white shadow-sm mb-6">2</div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#6941C6] mb-4">
                <TestTubes className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Saisissez</h3>
              <p className="text-[13px] text-slate-500 font-medium px-4">Entrez les résultats. Les valeurs anormales sont automatiquement signalées en rouge.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#059669] text-white font-black text-lg flex items-center justify-center border-4 border-white shadow-sm mb-6">3</div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#6941C6] mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Validez</h3>
              <p className="text-[13px] text-slate-500 font-medium px-4">Le biologiste valide le dossier d'un clic, générant un rapport sécurisé et prêt à imprimer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-3xl mx-auto px-6 mt-32 mb-20 relative z-10">
        <div className="text-center mb-12">
          <div className="text-[#6941C6] text-[12px] font-bold uppercase tracking-widest mb-2">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Questions fréquentes</h2>
          <p className="text-slate-500 font-medium mt-4">Tout ce que vous devez savoir sur ChapLab.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-slate-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-slate-600 font-medium leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA FULL GRADIENT */}
      <section className="bg-gradient-to-r from-[#059669] via-[#047857] to-[#6941C6] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Prêt à transformer votre laboratoire ?</h2>
          <p className="text-emerald-100 font-medium text-lg mb-10 max-w-2xl mx-auto">Rejoignez des dizaines de professionnels de santé qui font confiance à ChapLab au quotidien.</p>
          <button onClick={onOpenLogin} className="bg-white text-[#059669] px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
            Commencer gratuitement
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-sm text-slate-500 font-medium mt-6 leading-relaxed">
              La solution interface unifiée pour vos analyses, validation médicale, et impression.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produit</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-[#059669]">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-[#059669]">Catalogue Analyses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Ressources</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-[#059669]">FAQ</a></li>
              <li><a href="#" className="hover:text-[#059669]">Blog</a></li>
              <li><a href="#" className="hover:text-[#059669]">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Légal</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-[#059669]">Confidentialité</a></li>
              <li><a href="#" className="hover:text-[#059669]">CGU</a></li>
              <li><a href="#" className="hover:text-[#059669]">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© 2026 EBUNI STUDIO. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600">contact@chaplab.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
