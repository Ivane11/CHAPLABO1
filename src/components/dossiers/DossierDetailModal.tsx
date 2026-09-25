import React, { useState } from 'react';
import {
  X,
  Printer,
  Edit,
  FileCheck,
  User,
  Activity,
  Calendar,
  Microscope,
  Stethoscope,
  TestTubes,
} from 'lucide-react';
import { DossierReport, Patient, ExamDefinition } from '../../types';
import { ResultGrid } from '../saisie/ResultGrid';

interface DossierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DossierReport | null;
  patient: Patient | null;
  catalog: ExamDefinition[];
  onPrint: (dossier: DossierReport) => void;
  onEdit: (dossier: DossierReport) => void;
}

const getExamStyles = (examId: string) => {
  if (examId.startsWith('EXM-NFS') || examId.includes('HEMATO')) {
    return { bg: 'linear-gradient(to bottom right, #FEF2F2, #FFF1F2)', headerBg: 'linear-gradient(to right, #DC2626, #EF4444)', border: '#DC2626', icon: Activity, labelColor: '#DC2626' };
  }
  if (examId.includes('GOUTTE-EPAISSE') || examId.includes('PARASITO')) {
    return { bg: 'linear-gradient(to bottom right, #FFF7ED, #FFEDD5)', headerBg: 'linear-gradient(to right, #EA580C, #F97316)', border: '#EA580C', icon: Microscope, labelColor: '#EA580C' };
  }
  if (examId.startsWith('EXM-BIO')) {
    return { bg: 'linear-gradient(to bottom right, #ECFDF5, #D1FAE5)', headerBg: 'linear-gradient(to right, #059669, #10B981)', border: '#059669', icon: TestTubes, labelColor: '#059669' };
  }
  return { bg: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)', headerBg: 'linear-gradient(to right, #475569, #64748B)', border: '#475569', icon: FileCheck, labelColor: '#475569' };
};

export const DossierDetailModal: React.FC<DossierDetailModalProps> = ({
  isOpen,
  onClose,
  dossier,
  patient,
  catalog,
  onPrint,
  onEdit,
}) => {
  if (!isOpen || !dossier || !patient) return null;

  const [activeTab, setActiveTab] = useState<'resume' | 'resultats' | 'observations' | 'historique'>('resultats');

  const includedExams = dossier.examensInclus
    .map(id => catalog.find(e => e.id === id))
    .filter(Boolean) as ExamDefinition[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 select-none">
      <div className="bg-white rounded-sm border border-slate-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-300 flex items-center justify-between bg-white border-l-4 border-l-[#059669]">
          <div className="flex items-center gap-3">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase">
              Détail du Dossier : {dossier.id}
            </h3>
            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
              dossier.statut === 'VALIDE' ? 'bg-[#D1FAE5] text-[#065F46]' :
              dossier.statut === 'A_VALIDER' ? 'bg-[#FEF3C7] text-[#92400E]' :
              'bg-[#F1F5F9] text-[#475569]'
            }`}>
              {dossier.statut}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Patient Summary Bar */}
        <div className="flex gap-4 px-3 py-2 bg-slate-50 border-b border-slate-300 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {patient.nom} {patient.prenom}
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {dossier.date}
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            {dossier.prescripteur}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-300 bg-white text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab('resume')}
            className={`h-7 px-4 border-r border-slate-300 transition-colors ${
              activeTab === 'resume' ? 'bg-[#059669] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Résumé
          </button>
          <button
            onClick={() => setActiveTab('resultats')}
            className={`h-7 px-4 border-r border-slate-300 transition-colors ${
              activeTab === 'resultats' ? 'bg-[#059669] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Détail des Examens
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`h-7 px-4 border-r border-slate-300 transition-colors ${
              activeTab === 'observations' ? 'bg-[#059669] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Observations
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#F8FAFC]">
          {activeTab === 'resume' && (
            <div className="bg-white border border-slate-300 rounded-sm p-4 text-[12px] flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Informations Générales</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <span className="font-semibold">Type :</span> <span>{dossier.type}</span>
                    <span className="font-semibold">Examen principal :</span> <span>{dossier.nomExamen}</span>
                    <span className="font-semibold">Service :</span> <span>{dossier.service}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pré-analytique</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <span className="font-semibold">Prélèvement :</span> <span>{dossier.sampleType}</span>
                    <span className="font-semibold">Automate(s) :</span> <span>{dossier.automateType || 'Non spécifié'}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Validation</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <span className="font-semibold">Validé par :</span> <span>{dossier.biologisteValidateur || '—'}</span>
                  <span className="font-semibold">Date de validation :</span> <span>{dossier.dateValidation || '—'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resultats' && (
            <div className="flex flex-col gap-3">
              {includedExams.map(exam => (
                <ResultGrid
                  key={exam.id}
                  exam={exam}
                  resultsData={dossier.resultats}
                  activePatient={patient}
                  theme={getExamStyles(exam.id)}
                  readOnly={true}
                />
              ))}
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="bg-white border border-slate-300 rounded-sm p-3 min-h-[150px] text-[12px] text-slate-700 whitespace-pre-wrap font-mono">
              {dossier.observations || <span className="text-slate-400 italic">Aucune observation globale n'a été ajoutée à ce dossier.</span>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-300 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(dossier)}
            className="flex items-center gap-1.5 h-8 px-4 bg-blue-600 text-white text-[11px] font-bold rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" />
            Modifier
          </button>
          <button
            onClick={() => onPrint(dossier)}
            className="flex items-center gap-1.5 h-8 px-4 bg-emerald-600 text-white text-[11px] font-bold rounded-full hover:bg-emerald-700 cursor-pointer transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 h-8 px-5 bg-rose-600 text-white text-[11px] font-bold rounded-full hover:bg-rose-700 cursor-pointer transition-colors shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
