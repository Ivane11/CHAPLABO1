import React, { useState } from 'react';
import {
  X,
  User,
  TestTubes,
  FileCheck,
  Search,
  Printer,
  Save,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Stethoscope,
  Plus,
  ChevronRight,
  ChevronLeft,
  Droplet,
  Bug,
  FlaskConical,
  Shield,
  Activity,
  MessageSquare
} from 'lucide-react';
import { DossierReport, ExamDefinition, Patient, Prescriber } from '../../types';
import {
  evaluateParameterValue,
  getEffectiveReference,
  interpretHematologyNFS,
} from '../../utils/interpretation';
import { ResultGrid } from '../saisie/ResultGrid';
import { generateDossierId, generatePatientId } from '../../utils/idGenerator';

const getExamStyles = (examId: string) => {
  if (examId.startsWith('EXM-NFS') || examId.includes('HEMATO')) {
    return { bg: 'linear-gradient(to bottom right, #FEF2F2, #FFF1F2)', headerBg: 'linear-gradient(to right, #DC2626, #EF4444)', border: '#DC2626', icon: Droplet, labelColor: '#DC2626' };
  }
  if (examId.includes('GOUTTE-EPAISSE') || examId.includes('PARASITO')) {
    return { bg: 'linear-gradient(to bottom right, #FFF7ED, #FFEDD5)', headerBg: 'linear-gradient(to right, #EA580C, #F97316)', border: '#EA580C', icon: Bug, labelColor: '#EA580C' };
  }
  if (examId.startsWith('EXM-BIO')) {
    return { bg: 'linear-gradient(to bottom right, #ECFDF5, #D1FAE5)', headerBg: 'linear-gradient(to right, #059669, #10B981)', border: '#059669', icon: FlaskConical, labelColor: '#059669' };
  }
  if (examId.startsWith('EXM-SERO')) {
    return { bg: 'linear-gradient(to bottom right, #FEFCE8, #FEF08A)', headerBg: 'linear-gradient(to right, #CA8A04, #EAB308)', border: '#CA8A04', icon: Shield, labelColor: '#CA8A04' };
  }
  if (examId.startsWith('EXM-HORM')) {
    return { bg: 'linear-gradient(to bottom right, #FDF2F8, #FBCFE8)', headerBg: 'linear-gradient(to right, #DB2777, #EC4899)', border: '#DB2777', icon: Activity, labelColor: '#DB2777' };
  }
  return { bg: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)', headerBg: 'linear-gradient(to right, #475569, #64748B)', border: '#475569', icon: FileCheck, labelColor: '#475569' };
};

interface NewDossierWizardProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  catalog: ExamDefinition[];
  prescribers: Prescriber[];
  existingDossiers: DossierReport[];
  initialPatientId?: string;
  initialPackId?: string;
  editDossier?: DossierReport;
  onCreateDossier: (dossier: DossierReport, newPatient?: Patient, shouldPrint?: boolean) => void;
  onUpdateDossier?: (dossier: DossierReport) => void;
}

export const NewDossierWizard: React.FC<NewDossierWizardProps> = ({
  isOpen,
  onClose,
  patients,
  catalog,
  prescribers,
  existingDossiers,
  initialPatientId,
  initialPackId,
  editDossier,
  onCreateDossier,
  onUpdateDossier,
}) => {
  if (!isOpen) return null;

  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Patient mode (existing vs new)
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>(
    initialPatientId || editDossier ? 'existing' : 'existing'
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    editDossier ? editDossier.patientId : initialPatientId || patients[0]?.id || ''
  );

  // New patient form fields
  const [newPatientNom, setNewPatientNom] = useState('');
  const [newPatientPrenom, setNewPatientPrenom] = useState('');
  const [newPatientSexe, setNewPatientSexe] = useState<'M' | 'F'>('M');
  const [newPatientAge, setNewPatientAge] = useState<number>(30);
  const [newPatientDob, setNewPatientDob] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('+225 ');
  const [newPatientPrescripteur, setNewPatientPrescripteur] = useState(
    prescribers[0]?.nom || 'IDE Camara'
  );
  const [newPatientService, setNewPatientService] = useState('Consultation Externe');
  const [newPatientClinical, setNewPatientClinical] = useState('');

  // Step 2: Exams & Parameters
  const [sampleType, setSampleType] = useState(editDossier?.sampleType || 'Sang total EDTA');
  const [automateType, setAutomateType] = useState(editDossier?.automateType || '');
  const [dossierDate, setDossierDate] = useState(
    editDossier ? editDossier.date : new Date().toISOString().slice(0, 10)
  );
  const [examSearch, setExamSearch] = useState('');
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>(() => {
    if (editDossier) return editDossier.examensInclus || [];
    if (initialPackId === 'PACK_BPN') {
      return ['EXM-NFS', 'EXM-GS-RH', 'EXM-ELECTRO-HB', 'EXM-GOUTTE-EPAISSE', 'EXM-BIO-GLYCEMIE', 'EXM-SERO-INFECTIEUX', 'EXM-URINES-BANDELETTE'];
    }
    if (initialPackId === 'BILAN_METABOLIQUE') {
      return ['EXM-BIO-GLYCEMIE', 'EXM-BIO-RENAL', 'EXM-BIO-LIPIDIQUE'];
    }
    return ['EXM-NFS', 'EXM-GOUTTE-EPAISSE'];
  });

  // Step 3: Results inputs
  const [resultsData, setResultsData] = useState<Record<string, any>>(() => {
    if (editDossier) return { ...editDossier.resultats };
    const initial: Record<string, any> = {};
    if (selectedExamIds.includes('EXM-GOUTTE-EPAISSE')) {
      initial['GE_RESULTAT'] = 'Négatif';
      initial['GE_ESPECE'] = 'Absence de parasite';
      initial['GE_FORMES'] = 'Aucune forme parasitaire';
      initial['GE_DENSITE'] = 0;
    }
    return initial;
  });
  const [examAutomates, setExamAutomates] = useState<Record<string, string>>(() => editDossier?.examAutomates || {});
  const [observations, setObservations] = useState(editDossier?.observations || '');

  // Active patient resolved
  const activePatient: Patient =
    patientMode === 'existing'
      ? patients.find((p) => p.id === selectedPatientId) || patients[0]
      : {
          id: generatePatientId(patients),
          nom: newPatientNom || 'NOUVEAU',
          prenom: newPatientPrenom || 'PATIENT',
          sexe: newPatientSexe,
          age: Number(newPatientAge) || 30,
          dateNaissance: newPatientDob,
          telephone: newPatientPhone,
          prescripteur: newPatientPrescripteur,
          service: newPatientService,
          prelevement: sampleType,
          renseignementsCliniques: newPatientClinical,
          dateCreation: new Date().toISOString().slice(0, 10),
        };

  // Quick Pack selection helpers
  const handleApplyPack = (packType: 'PACK_BPN' | 'BILAN_METABOLIQUE' | 'BILAN_PEDIATRIQUE') => {
    if (packType === 'PACK_BPN') {
      setSelectedExamIds(['EXM-NFS', 'EXM-GS-RH', 'EXM-ELECTRO-HB', 'EXM-GOUTTE-EPAISSE', 'EXM-BIO-GLYCEMIE', 'EXM-SERO-INFECTIEUX', 'EXM-URINES-BANDELETTE']);
      setSampleType('Sang total EDTA + Sérum + Urines');
    } else if (packType === 'BILAN_METABOLIQUE') {
      setSelectedExamIds(['EXM-BIO-GLYCEMIE', 'EXM-BIO-RENAL', 'EXM-BIO-LIPIDIQUE']);
      setSampleType('Sérum à jeun + Plasma fluoré');
    } else if (packType === 'BILAN_PEDIATRIQUE') {
      setSelectedExamIds(['EXM-NFS', 'EXM-ELECTRO-HB', 'EXM-GOUTTE-EPAISSE', 'EXM-GS-RH']);
      setSampleType('Sang total EDTA');
    }
  };

  const handleResultChange = (paramId: string, val: any) => {
    setResultsData((prev) => {
      const updated = { ...prev, [paramId]: val };

      // Auto compute absolute counts for leukocytic formula
      if (paramId.endsWith('_PCT') && updated.NFS_WBC) {
        const baseKey = paramId.replace('_PCT', '');
        const wbc = parseFloat(String(updated.NFS_WBC));
        const pct = parseFloat(String(val));
        if (!isNaN(wbc) && !isNaN(pct)) {
          updated[`${baseKey}_ABS`] = parseFloat(((pct * wbc) / 100).toFixed(2));
        }
      }

      return updated;
    });
  };

  const handleAutoInterpret = () => {
    if (selectedExamIds.includes('EXM-NFS')) {
      const interp = interpretHematologyNFS(resultsData, activePatient);
      setResultsData((prev) => {
        const lead = prev['COMMENT_EXM-NFS'] ? `${prev['COMMENT_EXM-NFS']}\n\n` : '';
        return {
          ...prev,
          'COMMENT_EXM-NFS': `${lead}Conclusion Biologique : ${interp.summary}`
        };
      });
    }
  };

  const handleFinalSubmit = (shouldPrint: boolean) => {
    const createdPatient: Patient | undefined =
      patientMode === 'new' ? activePatient : undefined;

    const examTitle =
      selectedExamIds.length === 1
        ? catalog.find((e) => e.id === selectedExamIds[0])?.name || 'Bilan d’analyse'
        : selectedExamIds.includes('EXM-ELECTRO-HB') && selectedExamIds.includes('EXM-SERO-INFECTIEUX')
        ? 'Pack Bilan Prénatal Maternité (BPN)'
        : selectedExamIds.includes('EXM-BIO-LIPIDIQUE')
        ? 'Bilan Métabolique & Biochimie'
        : 'Analyses Médicales Multi-paramètres';

    const finalDossier: DossierReport = {
      id: editDossier ? editDossier.id : generateDossierId(existingDossiers),
      patientId: activePatient.id,
      date: dossierDate,
      nomExamen: examTitle,
      type:
        selectedExamIds.length > 3
          ? 'PACK_BPN'
          : selectedExamIds.length > 1
          ? 'MULTIPLE'
          : 'STANDARD',
      sampleType,
      automateType,
      prescripteur: activePatient.prescripteur || 'Consultation Externe',
      service: activePatient.service || 'Dispensaire',
      statut: editDossier ? editDossier.statut : 'VALIDE',
      biologisteValidateur: editDossier ? editDossier.biologisteValidateur : 'Dr. Ivane B. Kouassi',
      dateValidation: editDossier ? editDossier.dateValidation : `${dossierDate} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      observations: observations,
      examensInclus: selectedExamIds,
      resultats: resultsData,
      examAutomates: examAutomates,
    };

    if (editDossier && onUpdateDossier) {
      onUpdateDossier(finalDossier);
    } else {
      onCreateDossier(finalDossier, createdPatient, shouldPrint);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 select-none">
      <div className="bg-white rounded-sm border border-slate-300 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Wizard Header */}
        <div className="px-3 py-2 border-b border-slate-300 flex items-center justify-between bg-white border-l-4 border-l-[#5B46F6]">
          <h3 className="text-[13px] font-bold text-slate-900 uppercase">
            {editDossier ? 'MODIFICATION DU DOSSIER' : "NOUVEAU DOSSIER D'ANALYSE"}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="flex items-center border-b border-slate-300 bg-white text-[12px] font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`h-7 px-4 border-r border-slate-300 flex items-center gap-1.5 transition-colors ${
              step === 1 ? 'bg-[#5B46F6] text-white' : step > 1 ? 'bg-[#EEEDFC] text-[#5B46F6]' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <span>1</span>
            <span>Patient</span>
          </button>
          <button
            onClick={() => {
              if (step >= 2 || (patientMode === 'existing' || (newPatientNom.trim() && newPatientPrenom.trim()))) {
                setStep(2);
                setErrorMessage('');
              }
            }}
            className={`h-7 px-4 border-r border-slate-300 flex items-center gap-1.5 transition-colors ${
              step === 2 ? 'bg-[#5B46F6] text-white' : step > 2 ? 'bg-[#EEEDFC] text-[#5B46F6]' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <span>2</span>
            <span>Examens & Bilans</span>
          </button>
          <button
            onClick={() => {
              if (step >= 3 || (selectedExamIds.length > 0 && (patientMode === 'existing' || (newPatientNom.trim() && newPatientPrenom.trim())))) {
                setStep(3);
                setErrorMessage('');
              }
            }}
            className={`h-7 px-4 border-r border-slate-300 flex items-center gap-1.5 transition-colors ${
              step === 3 ? 'bg-[#5B46F6] text-white' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <span>3</span>
            <span>Résultats & Valid.</span>
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="h-7 mx-3 mt-3 px-3 bg-[#FEE2E2] flex items-center gap-2">
            <AlertCircle className="w-[12px] h-[12px] shrink-0 text-[#DC2626]" />
            <span className="text-[#DC2626] text-[11px] font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* STEP 1: PATIENT */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              {/* Patient Mode Tabs */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setPatientMode('existing');
                    setErrorMessage('');
                  }}
                  className={`h-7 px-4 text-[12px] font-bold rounded-l-sm border border-slate-300 transition-colors ${
                    patientMode === 'existing'
                      ? 'bg-[#5B46F6] text-white border-[#5B46F6]'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-r-0'
                  }`}
                >
                  Patient Existant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientMode('new');
                    setErrorMessage('');
                  }}
                  className={`h-7 px-4 text-[12px] font-bold rounded-r-sm border border-slate-300 transition-colors ${
                    patientMode === 'new'
                      ? 'bg-[#5B46F6] text-white border-[#5B46F6]'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Nouveau Patient
                </button>
              </div>

              {patientMode === 'existing' ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Sélectionner le patient :
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none cursor-pointer"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom} {p.prenom} — #{p.id} ({p.age} ans)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Summary card of chosen patient */}
                  {activePatient && (
                    <div className="border border-slate-300 border-l-[3px] border-l-blue-600 p-2 bg-white flex flex-col gap-0.5">
                      <div className="font-bold text-slate-900 text-[12px]">
                        {activePatient.nom} {activePatient.prenom} (#{activePatient.id})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {activePatient.age} ans · {activePatient.sexe === 'F' ? 'Féminin' : 'Masculin'} · {activePatient.telephone}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Prescripteur : {activePatient.prescripteur} ({activePatient.service})
                      </div>
                      {activePatient.renseignementsCliniques && (
                        <div className="text-[11px] text-blue-700 italic mt-1">
                          Indication : {activePatient.renseignementsCliniques}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* New Patient Form Fields */
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nom de famille *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatientNom}
                        onChange={(e) => {
                          setNewPatientNom(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Prénom(s) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatientPrenom}
                        onChange={(e) => {
                          setNewPatientPrenom(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Sexe *
                      </label>
                      <select
                        value={newPatientSexe}
                        onChange={(e) => setNewPatientSexe(e.target.value as any)}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Âge (ans) *
                      </label>
                      <input
                        type="number"
                        value={newPatientAge}
                        onChange={(e) => setNewPatientAge(Number(e.target.value))}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] font-mono text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] font-mono text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Prescripteur référent
                      </label>
                      <input
                        type="text"
                        value={newPatientPrescripteur}
                        onChange={(e) => setNewPatientPrescripteur(e.target.value)}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Service demandeur
                      </label>
                      <input
                        type="text"
                        value={newPatientService}
                        onChange={(e) => setNewPatientService(e.target.value)}
                        className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Renseignements Cliniques
                    </label>
                    <textarea
                      rows={2}
                      value={newPatientClinical}
                      onChange={(e) => setNewPatientClinical(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm p-2 text-[12px] text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: EXAMS & PACKS */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              {/* Pre-analytical parameters (Sample & Automate) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Date de Prélèvement
                  </label>
                  <input
                    type="date"
                    value={dossierDate}
                    onChange={(e) => setDossierDate(e.target.value)}
                    className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Type d'Échantillon *
                  </label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[12px] text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="Sang total EDTA">Sang total EDTA</option>
                    <option value="Sérum">Sérum</option>
                    <option value="Plasma hépariné">Plasma hépariné</option>
                    <option value="Sang total EDTA + Sérum">Sang total EDTA + Sérum</option>
                    <option value="Sang total EDTA + Sérum + Urines">Sang total EDTA + Sérum + Urines</option>
                    <option value="Urines (milieu de jet)">Urines (milieu de jet)</option>
                    <option value="Selles">Selles</option>
                  </select>
                </div>

              </div>

              {/* Quick Packs Selector Buttons */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Sélection Rapide par Pack Clinique :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPack('PACK_BPN')}
                    className="p-2 bg-rose-600 hover:bg-rose-700 text-center cursor-pointer rounded-full shadow-sm transition-colors border-none smooth-press"
                  >
                    <div className="text-[12px] font-bold text-white">
                      Pack BPN Maternité
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPack('BILAN_METABOLIQUE')}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-center cursor-pointer rounded-full shadow-sm transition-colors border-none smooth-press"
                  >
                    <div className="text-[12px] font-bold text-white">
                      Bilan Métabolique
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPack('BILAN_PEDIATRIQUE')}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-center cursor-pointer rounded-full shadow-sm transition-colors border-none smooth-press"
                  >
                    <div className="text-[12px] font-bold text-white">
                      Bilan Pédiatrique BPS
                    </div>
                  </button>
                </div>
              </div>

              {/* Individual Exams Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Sélection Personnalisée ({selectedExamIds.length} retenus) :
                  </label>
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={examSearch}
                      onChange={(e) => setExamSearch(e.target.value)}
                      placeholder="Filtrer..."
                      className="w-full h-7 bg-white border border-slate-300 focus:border-[#5B46F6] rounded-sm px-2 text-[11px] outline-none"
                    />
                  </div>
                </div>

                <div className="h-48 overflow-y-auto border border-slate-300 rounded-sm bg-white">
                  <table className="w-full text-left border-collapse text-[12px]">
                    <tbody>
                      {catalog
                        .filter((e) =>
                          e.name.toLowerCase().includes(examSearch.toLowerCase()) ||
                          e.category.toLowerCase().includes(examSearch.toLowerCase())
                        )
                        .map((exam) => {
                          const isSelected = selectedExamIds.includes(exam.id);
                          return (
                            <tr
                              key={exam.id}
                              className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer"
                              onClick={() => {
                                setErrorMessage('');
                                if (!isSelected) {
                                  setSelectedExamIds((prev) => [...prev, exam.id]);
                                } else {
                                  setSelectedExamIds((prev) =>
                                    prev.filter((id) => id !== exam.id)
                                  );
                                }
                              }}
                            >
                              <td className="w-8 px-2 py-1 text-center border-r border-slate-200">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  readOnly
                                  className="w-[12px] h-[12px] text-[#5B46F6] border-slate-300 rounded-sm cursor-pointer"
                                />
                              </td>
                              <td className="px-2 py-1 font-bold text-slate-800 border-r border-slate-200">
                                {exam.name}
                              </td>
                              <td className="px-2 py-1 text-[11px] text-slate-500 border-r border-slate-200">
                                {exam.category}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS ENTRY */}
          {step === 3 && (
            <div className="flex flex-col gap-3 pb-2">
              <div className="flex items-center justify-between h-6 px-2 bg-slate-100 border border-slate-300 rounded-sm text-[11px] text-slate-700 font-semibold">
                <span>
                  Saisie pour {activePatient.nom} {activePatient.prenom}
                </span>
                <button
                  type="button"
                  onClick={handleAutoInterpret}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-interprétation
                </button>
              </div>

              {selectedExamIds.map((examId) => {
                const exam = catalog.find((e) => e.id === examId);
                if (!exam) return null;
                const theme = getExamStyles(exam.id);

                return (
                  <ResultGrid
                    key={exam.id}
                    exam={exam}
                    resultsData={resultsData}
                    activePatient={activePatient}
                    theme={theme}
                    onResultChange={handleResultChange}
                    automate={examAutomates[exam.id]}
                    onAutomateChange={(val) => setExamAutomates(prev => ({ ...prev, [exam.id]: val }))}
                  />
                );
              })}


            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 border-t border-slate-300 bg-slate-50 flex items-center justify-between">
          <div>
            {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep((s) => (s - 1) as any);
                    setErrorMessage('');
                  }}
                  className="flex items-center gap-1 h-8 px-4 border border-slate-300 text-[12px] font-bold text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              )}
            </div>
  
            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && patientMode === 'new' && (!newPatientNom.trim() || !newPatientPrenom.trim())) {
                      setErrorMessage('Veuillez renseigner le nom et le prénom du patient.');
                      return;
                    }
                    if (step === 2 && selectedExamIds.length === 0) {
                      setErrorMessage('Veuillez sélectionner au moins un examen à analyser.');
                      return;
                    }
                    setErrorMessage('');
                    setStep((s) => (s + 1) as any);
                  }}
                  className="flex items-center gap-1 h-8 px-4 bg-blue-600 text-white text-[12px] font-bold rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit(false)}
                    className="flex items-center gap-1.5 h-8 px-4 bg-emerald-600 text-white text-[12px] font-bold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer seul</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit(true)}
                    className="flex items-center gap-1.5 h-8 px-4 bg-blue-600 text-white text-[12px] font-bold rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Enregistrer & Imprimer</span>
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
