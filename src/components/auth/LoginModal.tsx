import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden transition-all">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#6941C6]/10 to-blue-600/10 -z-10"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer smooth-press"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8 mt-2">
            <div className="w-16 h-16 bg-white rounded-[20px] shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <BrandLogo preset="crystal_cross" size="md" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">
              Espace CHAPLAB
            </h2>
            <p className="text-[13px] font-medium text-slate-500 text-center mt-1.5">
              Connectez-vous pour accéder à votre espace de gestion biologique.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">
                Identifiant
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID Utilisateur"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100 border-none focus:ring-2 focus:ring-[#6941C6]/20 rounded-2xl text-[14px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100 border-none focus:ring-2 focus:ring-[#6941C6]/20 rounded-2xl text-[14px] text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2"></div>
            
            {error && (
              <div className="text-[12px] font-bold text-rose-500 text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[14px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer smooth-press group"
            >
              <span>Se Connecter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Connexion Sécurisée AES-256
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
