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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md select-none no-print">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-slate-200/90 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-[#E8F8EC]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#16A34A] border border-[#BFF0C8] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
                Certification & Visa Biologique
              </h3>
              <p className="text-xs text-slate-400">
                Accréditation ISO 15189 · Bulletin N° {dossier.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Summary card */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Patient : <strong className="text-slate-900 font-bold">{patient.nom} {patient.prenom}</strong></span>
              <span className="font-mono text-slate-500">{patient.age} ans ({patient.sexe})</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Examen : <strong className="text-[#5B46F6] font-bold">{dossier.nomExamen}</strong></span>
              <span>Prescrit par : <strong className="text-slate-800">{dossier.prescripteur}</strong></span>
            </div>
          </div>

          {/* Status Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Statut Officiel du Bulletin :
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedStatus('EN_COURS')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStatus === 'EN_COURS'
                    ? 'border-[#5B46F6] bg-[#EEEDFC] ring-1 ring-[#5B46F6]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5B46F6]" />
                  <span>En cours</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Analyses en cours de saisie
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('A_VALIDER')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStatus === 'A_VALIDER'
                    ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>À Valider</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Saisie terminée, attente visa
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('VALIDE')}
                className={`col-span-2 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStatus === 'VALIDE' || selectedStatus === 'IMPRIME'
                    ? 'border-[#10B981] bg-[#E8F8EC] ring-1 ring-[#10B981]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-extrabold text-[#1E3A2F] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Validé & Certifié Conforme (ISO 15189)</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                </div>
                <div className="text-[11px] text-[#2F5244] mt-1 leading-relaxed">
                  Appose la signature numérique du biologiste, horodate le document et déverrouille l'impression finale pour le patient.
                </div>
              </button>
            </div>
          </div>

          {/* Biologist Signature & Observations */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Biologiste Médical Validateur *
              </label>
              <input
                type="text"
                value={biologistName}
                onChange={(e) => setBiologistName(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#6366F1] rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Commentaires & Conclusion Diagnostique
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Mention finale sur le compte rendu médical..."
                className="w-full bg-white border border-slate-200 focus:border-[#6366F1] rounded-xl p-3 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          {isAlreadyLocked ? (
            <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              Ce rapport est déjà certifié.
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Validation officielle horodatée.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-full text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certifier le Bulletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
