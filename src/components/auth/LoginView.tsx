import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LoginViewProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Hardcoded secure check
    if (email === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#F2EEFF] selection:text-[#6941C6] font-sans antialiased flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-[#6941C6]/10 to-[#059669]/5 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 to-teal-400/5 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/60 text-slate-600 hover:text-slate-900 shadow-sm hover:shadow-md transition-all font-medium text-[13px]"
        >
          &larr; Retour à l'accueil
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-[420px] bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white p-8 sm:p-10 animate-[slideUp_0.4s_ease-out]">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#6941C6]/5 to-blue-600/5 rounded-t-[40px] -z-10"></div>

        <div className="flex flex-col items-center justify-center mb-8 mt-2">
          <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-center mb-5 hover:shadow-md transition-all">
            <BrandLogo preset="crystal_cross" size="lg" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight font-sans">
            Espace CHAPLAB
          </h2>
          <p className="text-[14px] font-medium text-slate-500 text-center mt-2 px-4">
            Connectez-vous pour accéder à votre espace de gestion biologique sécurisé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2 ml-1">
              Identifiant
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#6941C6] transition-colors" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID Utilisateur"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-[#6941C6] focus:ring-4 focus:ring-[#6941C6]/10 rounded-2xl text-[15px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2 ml-1">
              Mot de Passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#6941C6] transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-[#6941C6] focus:ring-4 focus:ring-[#6941C6]/10 rounded-2xl text-[15px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2"></div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="text-[13px] font-bold text-rose-600">
                {error}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#5832E5] hover:bg-[#4623C2] text-white rounded-full text-[15px] font-bold shadow-lg shadow-[#5832E5]/25 hover:shadow-xl hover:shadow-[#5832E5]/30 transition-all cursor-pointer group"
          >
            <span>Se Connecter</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
            Connexion Sécurisée AES-256
          </span>
        </div>
      </div>
    </div>
  );
};
