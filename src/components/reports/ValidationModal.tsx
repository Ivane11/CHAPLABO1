import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { DossierReport, Patient, ReportStatus } from '../../types';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DossierReport | null;
  patient: Patient | null;
  biologistDefaultName: string;
  onConfirmValidation: (
    dossierId: string,
    newStatus: ReportStatus,
    biologistName: string,
    observations?: string
  ) => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  dossier,
  patient,
  biologistDefaultName,
  onConfirmValidation,
}) => {
  if (!isOpen || !dossier || !patient) return null;

  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(dossier.statut);
  const [biologistName, setBiologistName] = useState(
    dossier.biologisteValidateur || biologistDefaultName
  );
  const [observations, setObservations] = useState(dossier.observations || '');

  const isAlreadyLocked = dossier.statut === 'VALIDE' || dossier.statut === 'IMPRIME';

  const handleSave = () => {
    onConfirmValidation(dossier.id, selectedStatus, biologistName, observations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5832E5]/40 backdrop-blur-sm select-none no-print">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-200/60 flex items-center justify-between bg-gradient-to-r from-white to-[#F2EEFF]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[18px] bg-[#E8F8EC] text-[#059669] border border-[#BFF0C8] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight font-sans">
                Certification & Visa Biologique
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Accréditation ISO 15189 · Bulletin N° <span className="font-mono font-bold text-[#6941C6]">{dossier.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer smooth-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-6">
          {/* Summary card */}
          <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-[20px] text-[13px] space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Patient : <strong className="text-slate-900 font-extrabold">{patient.nom} {patient.prenom}</strong></span>
              <span className="font-mono text-slate-500 font-medium">{patient.age} ans ({patient.sexe})</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Examen : <strong className="text-[#6941C6] font-extrabold">{dossier.nomExamen}</strong></span>
              <span>Prescrit par : <strong className="text-slate-800 font-bold">{dossier.prescripteur}</strong></span>
            </div>
          </div>

          {/* Status Selection Cards */}
          <div>
            <label className="block text-[13px] font-extrabold text-slate-800 mb-2.5">
              Statut Officiel du Bulletin :
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('EN_COURS')}
                className={`flex items-center gap-2 h-8 px-4 rounded-full font-bold transition-all cursor-pointer text-[12px] ${
                  selectedStatus === 'EN_COURS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>En cours</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('A_VALIDER')}
                className={`flex items-center gap-2 h-8 px-4 rounded-full font-bold transition-all cursor-pointer text-[12px] ${
                  selectedStatus === 'A_VALIDER'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>À Valider</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('VALIDE')}
                className={`flex items-center gap-2 h-8 px-4 rounded-full font-bold transition-all cursor-pointer text-[12px] ${
                  selectedStatus === 'VALIDE' || selectedStatus === 'IMPRIME'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validé & Certifié</span>
                {(selectedStatus === 'VALIDE' || selectedStatus === 'IMPRIME') && <Lock className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
          </div>

          {/* Biologist Signature & Observations */}
          <div className="space-y-4 p-5 rounded-[20px] bg-slate-50/50 border border-slate-200/60">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
                Biologiste Médical Validateur *
              </label>
              <input
                type="text"
                value={biologistName}
                onChange={(e) => setBiologistName(e.target.value)}
                className="w-full bg-white border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl px-4 py-2.5 text-[13px] text-slate-900 font-bold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
                Commentaires & Conclusion Diagnostique
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Mention finale sur le compte rendu médical..."
                className="w-full bg-white border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl p-4 text-[13px] text-slate-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-slate-200/60 bg-slate-50/50 flex items-center justify-between">
          {isAlreadyLocked ? (
            <span className="text-[12px] text-amber-700 font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              Ce rapport est déjà certifié.
            </span>
          ) : (
            <span className="text-[12px] text-slate-500 font-medium">
              Validation officielle horodatée.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[12px] font-bold shadow-sm transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[12px] font-bold shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Certifier le Bulletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
