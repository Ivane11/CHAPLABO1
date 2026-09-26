import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LoginViewProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulation délai connexion
    setTimeout(() => {
      if (email === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Identifiant ou mot de passe incorrect.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Mesh (Light Mode) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-[#6941C6]/10 to-[#059669]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 to-teal-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04] pointer-events-none"></div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/60 text-slate-600 hover:text-slate-900 shadow-sm hover:shadow-md transition-all font-medium text-[13px] group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Retour
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[420px] perspective-1000">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white p-8 sm:p-10 transform-gpu transition-all hover:shadow-xl">
          
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#059669] to-[#6941C6] rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center">
                <BrandLogo preset="crystal_cross" size="lg" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
              Bienvenue
            </h2>
            <p className="text-[14px] font-medium text-slate-500 text-center px-4">
              Connectez-vous pour accéder à l'écosystème ChapLab.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID Utilisateur"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/10 rounded-2xl text-[15px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#6941C6] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-[#6941C6] focus:ring-4 focus:ring-[#6941C6]/10 rounded-2xl text-[15px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-[slideDown_0.3s_ease-out]">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="text-[13px] font-bold text-rose-600">
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full h-14 mt-4 rounded-full overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#059669]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#059669] via-[#3B82F6] to-[#6941C6] opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-all duration-1000 ease-in-out"></div>

              <div className="relative flex items-center justify-center gap-2 h-full text-white font-bold text-[16px]">
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Accéder au labo</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Sécurisé par protocole quantique
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
