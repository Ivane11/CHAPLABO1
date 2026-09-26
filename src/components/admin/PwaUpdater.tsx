import React, { useState, useEffect } from 'react';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, DownloadCloud, CheckCircle2, CloudCog } from 'lucide-react';

const CURRENT_VERSION = 'v1.5.0';

export const PwaUpdater: React.FC<{ mode?: 'inline' | 'global' }> = ({ mode = 'inline' }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000); // Check every hour
      }
    },
    onRegisterError(error: Error) {
      console.error('SW registration error', error);
    },
  });

  const [updateState, setUpdateState] = useState<'idle' | 'checking' | 'available' | 'ready'>('idle');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    if (needRefresh && updateState === 'idle') {
      setUpdateState('available');
    }
  }, [needRefresh, updateState]);

  const handleCheckUpdate = async () => {
    setUpdateState('checking');
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.update();
        setLastCheck(new Date());
        if (!needRefresh) {
          setTimeout(() => setUpdateState('idle'), 1000);
        }
      } catch (err) {
        setUpdateState('idle');
      }
    } else {
      setTimeout(() => setUpdateState('idle'), 1000);
    }
  };

  const handlePrepareUpdate = () => {
    // Simule la préparation (qui est déjà faite en arrière-plan par le SW)
    setUpdateState('ready');
  };

  const handleApplyUpdate = () => {
    updateServiceWorker(true);
    // Force le rechargement si la lib ne le fait pas d'elle-même
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (mode === 'global' && updateState === 'idle' && !needRefresh) {
    return null;
  }

  const isGlobal = mode === 'global';

  const Wrapper = isGlobal ? 'div' : React.Fragment;
  const wrapperProps = isGlobal ? { className: "fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className={isGlobal 
        ? "max-w-md w-full bg-white p-8 rounded-[32px] border border-white/60 shadow-2xl animate-in zoom-in-95 duration-500"
        : "bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"}>
      
      {!isGlobal && (
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CloudCog className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mises à jour de l'Application</h3>
            <p className="text-xs text-slate-500">Gestion des versions et mises à jour (PWA)</p>
          </div>
        </div>
      )}

      {!isGlobal && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Version Actuelle
            </div>
            <div className="text-xl font-black text-slate-800 font-mono">
              {CURRENT_VERSION}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Dernière vérification : {lastCheck.toLocaleTimeString()}
            </div>
          </div>
          
          {updateState === 'idle' && !needRefresh && (
            <button
              onClick={handleCheckUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Vérifier les mises à jour</span>
            </button>
          )}

          {updateState === 'checking' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Vérification...</span>
            </div>
          )}
        </div>
      )}

      {(updateState === 'available' || needRefresh) && updateState !== 'ready' && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <DownloadCloud className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-900">Nouvelle mise à jour disponible</h4>
              <p className="text-xs text-blue-700 mt-1 mb-3">
                Une nouvelle version de l'application est disponible.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handlePrepareUpdate}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex-1"
                >
                  Télécharger la mise à jour
                </button>
                {!isGlobal && (
                  <button
                    onClick={() => setUpdateState('idle')}
                    className="px-4 py-2.5 bg-white hover:bg-blue-50 border border-blue-100 text-blue-700 text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Plus tard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {updateState === 'ready' && (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/30 p-5 rounded-xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          {/* Futuristic animated background elements */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-40 animate-pulse delay-700"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            
            <h4 className="text-base font-extrabold text-white mb-1">Mise à jour prête !</h4>
            <p className="text-[13px] text-indigo-200 mb-5 leading-relaxed">
              La nouvelle version est téléchargée. 
              <br />Le système va redémarrer pour appliquer.
            </p>
            
            {/* Animated futuristic progress bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 w-full relative">
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            
            <button
              onClick={handleApplyUpdate}
              className="w-full py-3 bg-white text-indigo-900 hover:bg-indigo-50 text-[14px] font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Relancer l'application</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </Wrapper>
  );
};
