import React, { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, DownloadCloud, CheckCircle2, CloudCog } from 'lucide-react';

const CURRENT_VERSION = 'v1.5.0';

export const PwaUpdater: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000); // Check every hour
      }
    },
    onRegisterError(error) {
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
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <CloudCog className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Mises à jour de l'Application</h3>
          <p className="text-xs text-slate-500">Gestion des versions et mises à jour (PWA)</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrepareUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Mettre à jour
                </button>
                <button
                  onClick={() => setUpdateState('idle')}
                  className="px-4 py-2 bg-white hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {updateState === 'ready' && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-emerald-900">Mise à jour prête</h4>
              <p className="text-xs text-emerald-700 mt-1 mb-3">
                La nouvelle version est prête. Votre application peut maintenant être actualisée. (Aucune donnée ne sera perdue).
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyUpdate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualiser maintenant</span>
                </button>
                <button
                  onClick={() => setUpdateState('idle')}
                  className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
