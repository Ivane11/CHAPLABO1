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
} from 'lucide-react';
import { DossierReport, ExamDefinition, Patient, Prescriber } from '../../types';
import {
  evaluateParameterValue,
  getEffectiveReference,
  interpretHematologyNFS,
} from '../../utils/interpretation';

interface NewDossierWizardProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  catalog: ExamDefinition[];
  prescribers: Prescriber[];
  initialPatientId?: string;
  initialPackId?: string;
  onCreateDossier: (dossier: DossierReport, newPatient?: Patient, shouldPrint?: boolean) => void;
}

export const NewDossierWizard: React.FC<NewDossierWizardProps> = ({
  isOpen,
  onClose,
  patients,
  catalog,
  prescribers,
  initialPatientId,
  initialPackId,
  onCreateDossier,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Patient mode (existing vs new)
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>(
    initialPatientId ? 'existing' : 'existing'
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || patients[0]?.id || ''
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
  const [sampleType, setSampleType] = useState('Sang total EDTA');
  const [automateType, setAutomateType] = useState('Mindray BC-30s');
  const [dossierDate, setDossierDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [examSearch, setExamSearch] = useState('');
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>(() => {
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
    const initial: Record<string, any> = {};
    if (selectedExamIds.includes('EXM-GOUTTE-EPAISSE')) {
      initial['GE_RESULTAT'] = 'Négatif';
      initial['GE_ESPECE'] = 'Absence de parasite';
      initial['GE_FORMES'] = 'Aucune forme parasitaire';
      initial['GE_DENSITE'] = 0;
    }
    return initial;
  });
  const [observations, setObservations] = useState('');

  // Active patient resolved
  const activePatient: Patient =
    patientMode === 'existing'
      ? patients.find((p) => p.id === selectedPatientId) || patients[0]
      : {
          id: `CHP-2026-000${patients.length + 1}`,
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
      setObservations((prev) => {
        const lead = prev ? `${prev}\n\n` : '';
        return `${lead}Conclusion Biologique : ${interp.summary}`;
      });
    }
  };

  const handleFinalSubmit = (shouldPrint: boolean) => {
    const reportId = `RPT-2026-00${Math.floor(10 + Math.random() * 90)}`;
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

    const newDossier: DossierReport = {
      id: reportId,
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
      statut: 'VALIDE',
      biologisteValidateur: 'Dr. Ivane B. Kouassi',
      dateValidation: `${dossierDate} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      observations,
      examensInclus: selectedExamIds,
      resultats: resultsData,
    };

    onCreateDossier(newDossier, createdPatient, shouldPrint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md select-none no-print">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[30px] border border-slate-200/90 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Wizard Header & Stepper */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-[#EEEDFC]/40">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
              Nouveau Dossier d'Analyse Médicale
            </h3>
            <p className="text-xs text-slate-400">
              Workflow standardisé conforme aux exigences médico-légales ISO 15189
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Linear Stepper Indicator */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1 ? 'bg-[#5B46F6] text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              Patient
            </span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-100 mx-2" />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2 ? 'bg-[#5B46F6] text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              Examens & Bilans
            </span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-100 mx-2" />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 3 ? 'bg-[#5B46F6] text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              Résultats & Validation
            </span>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: PATIENT */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Patient Mode Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-full max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setPatientMode('existing');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    patientMode === 'existing'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
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
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    patientMode === 'new'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Nouveau Patient
                </button>
              </div>

              {patientMode === 'existing' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Sélectionner le patient dans la base médicale :
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} {p.prenom} — #{p.id} ({p.age} ans, {p.sexe === 'F' ? 'Femme' : 'Homme'})
                      </option>
                    ))}
                  </select>

                  {/* Summary card of chosen patient */}
                  {activePatient && (
                    <div className="p-4 rounded-2xl bg-[#EEEDFC]/60 border border-[#D8D4FC] space-y-2 text-xs">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {activePatient.nom} {activePatient.prenom} (#{activePatient.id})
                      </div>
                      <div className="text-slate-600">
                        {activePatient.age} ans · Sexe : {activePatient.sexe === 'F' ? 'Féminin' : 'Masculin'} · Contact : {activePatient.telephone}
                      </div>
                      <div className="text-slate-600">
                        Prescripteur : <strong className="text-slate-800">{activePatient.prescripteur}</strong> ({activePatient.service})
                      </div>
                      {activePatient.renseignementsCliniques && (
                        <div className="text-[11px] text-[#5B46F6] font-medium italic">
                          Indication clinique : {activePatient.renseignementsCliniques}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* New Patient Form Fields */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
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
                        placeholder="Ex: KOUASSI"
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 font-extrabold uppercase outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
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
                        placeholder="Ex: Béranger"
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sexe *
                      </label>
                      <select
                        value={newPatientSexe}
                        onChange={(e) => setNewPatientSexe(e.target.value as any)}
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="M">Masculin (M)</option>
                        <option value="F">Féminin (F)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Âge (ans) *
                      </label>
                      <input
                        type="number"
                        value={newPatientAge}
                        onChange={(e) => setNewPatientAge(Number(e.target.value))}
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3 py-2 text-xs text-slate-900 font-mono font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        placeholder="+225 07..."
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prescripteur référent
                      </label>
                      <input
                        type="text"
                        value={newPatientPrescripteur}
                        onChange={(e) => setNewPatientPrescripteur(e.target.value)}
                        placeholder="Dr. Nom du médecin"
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Service demandeur
                      </label>
                      <input
                        type="text"
                        value={newPatientService}
                        onChange={(e) => setNewPatientService(e.target.value)}
                        placeholder="Maternité, Urgences..."
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Renseignements Cliniques
                    </label>
                    <textarea
                      rows={2}
                      value={newPatientClinical}
                      onChange={(e) => setNewPatientClinical(e.target.value)}
                      placeholder="Symptomatologie, suspicion clinique, motif de l'analyse..."
                      className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl p-3 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: EXAMS & PACKS */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Pre-analytical parameters (Sample & Automate) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Date de Prélèvement
                  </label>
                  <input
                    type="date"
                    value={dossierDate}
                    onChange={(e) => setDossierDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Type d'Échantillon *
                  </label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 outline-none cursor-pointer"
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

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Automate Associé
                  </label>
                  <select
                    value={automateType}
                    onChange={(e) => setAutomateType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="Mindray BC-30s">Mindray BC-30s</option>
                    <option value="Sysmex XN-L 550">Sysmex XN-L 550</option>
                    <option value="Selectra ProM Clinical Chemistry">Selectra ProM</option>
                    <option value="Interlab G26 / Densitomètre">Interlab G26</option>
                    <option value="Méthode manuelle / Microscopie">Méthode manuelle</option>
                  </select>
                </div>
              </div>

              {/* Quick Packs Selector Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sélection Rapide par Pack Clinique :
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPack('PACK_BPN')}
                    className="p-3 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-purple-900">
                      Pack BPN Maternité
                    </div>
                    <div className="text-[10px] text-purple-700">
                      7 examens prénataux
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPack('BILAN_METABOLIQUE')}
                    className="p-3 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-blue-900">
                      Bilan Métabolique
                    </div>
                    <div className="text-[10px] text-blue-700">
                      Diabète, Rein, Lipides
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPack('BILAN_PEDIATRIQUE')}
                    className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-emerald-900">
                      Bilan Pédiatrique BPS
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      NFS, Palu, Drépano
                    </div>
                  </button>
                </div>
              </div>

              {/* Individual Exams Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Sélection Personnalisée ({selectedExamIds.length} examens retenus) :
                  </label>
                  <div className="w-56 relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={examSearch}
                      onChange={(e) => setExamSearch(e.target.value)}
                      placeholder="Filtrer examen..."
                      className="w-full pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl p-2 divide-y divide-slate-100 bg-white">
                  {catalog
                    .filter((e) =>
                      e.name.toLowerCase().includes(examSearch.toLowerCase()) ||
                      e.category.toLowerCase().includes(examSearch.toLowerCase())
                    )
                    .map((exam) => {
                      const isSelected = selectedExamIds.includes(exam.id);
                      return (
                        <label
                          key={exam.id}
                          className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                setErrorMessage('');
                                if (e.target.checked) {
                                  setSelectedExamIds((prev) => [...prev, exam.id]);
                                } else {
                                  setSelectedExamIds((prev) =>
                                    prev.filter((id) => id !== exam.id)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-[#5B46F6] rounded border-slate-300 focus:ring-[#5B46F6] cursor-pointer"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {exam.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {exam.category} · {exam.sampleTypeDefault}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {exam.price} FCFA
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS ENTRY */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-3.5 bg-[#EEEDFC]/60 border border-[#D8D4FC] rounded-2xl text-xs text-[#5B46F6] flex items-center justify-between">
                <span>
                  Saisie clinique pour <strong>{activePatient.nom} {activePatient.prenom}</strong> (#{activePatient.id})
                </span>
                <button
                  type="button"
                  onClick={handleAutoInterpret}
                  className="flex items-center gap-1.5 bg-white border border-[#D8D4FC] px-3 py-1.5 rounded-full text-xs font-bold text-[#5B46F6] hover:bg-[#EEEDFC] cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5B46F6]" />
                  <span>Auto-interprétation clinique</span>
                </button>
              </div>

              {selectedExamIds.map((examId) => {
                const exam = catalog.find((e) => e.id === examId);
                if (!exam) return null;

                const isGoutteEpaisse = exam.id === 'EXM-GOUTTE-EPAISSE';

                return (
                  <div
                    key={exam.id}
                    className={`border rounded-2xl overflow-hidden shadow-xs ${
                      isGoutteEpaisse
                        ? 'border-purple-300 ring-1 ring-purple-100 bg-purple-50/10'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 border-b flex items-center justify-between ${
                        isGoutteEpaisse
                          ? 'bg-purple-100/70 border-purple-200 text-purple-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-900 font-bold'
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wide">
                        {exam.name}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {exam.sampleTypeDefault}
                      </span>
                    </div>

                    {exam.sections.map((section, sIdx) => (
                      <div key={sIdx} className="p-4 space-y-3">
                        {section.title && (
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {section.title}
                          </h5>
                        )}

                        <div className="divide-y divide-slate-100">
                          {section.parameters.map((param) => {
                            const val = resultsData[param.id] ?? '';
                            const ref = getEffectiveReference(param, activePatient);
                            const evalRes = evaluateParameterValue(val, param, activePatient);

                            const isDensityField = param.id === 'GE_DENSITE';
                            const isResultField = param.id === 'GE_RESULTAT';
                            const isObsField = param.id === 'GE_OBS';

                            return (
                              <div
                                key={param.id}
                                className={`py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                  isObsField ? 'bg-purple-50/80 p-3 rounded-2xl border border-purple-200 my-2' : ''
                                }`}
                              >
                                <div className="sm:w-1/3">
                                  <span
                                    className={`font-semibold ${
                                      isDensityField || isResultField
                                        ? 'font-bold text-purple-900 text-sm'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    {param.name}
                                  </span>
                                  {param.unit && (
                                    <span className="text-slate-400 ml-1 font-mono text-[11px]">
                                      ({param.unit})
                                    </span>
                                  )}
                                </div>

                                <div className="sm:w-1/3">
                                  {param.type === 'select' ? (
                                    <select
                                      value={val}
                                      onChange={(e) => handleResultChange(param.id, e.target.value)}
                                      className={`w-full border rounded-xl px-2.5 py-1.5 text-xs outline-none cursor-pointer ${
                                        isResultField
                                          ? 'border-purple-300 font-bold bg-white text-purple-950 focus:border-purple-600'
                                          : 'border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:border-[#6366F1]'
                                      }`}
                                    >
                                      {param.options?.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  ) : param.type === 'textarea' ? (
                                    <textarea
                                      rows={2}
                                      value={val}
                                      onChange={(e) => handleResultChange(param.id, e.target.value)}
                                      placeholder="Commentaire d'observation..."
                                      className="w-full bg-white border border-purple-300 focus:border-purple-600 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                                    />
                                  ) : (
                                    <input
                                      type="number"
                                      step="any"
                                      value={val}
                                      onChange={(e) => handleResultChange(param.id, e.target.value)}
                                      placeholder="Valeur..."
                                      className={`w-full border rounded-xl px-3 py-1.5 text-xs font-mono outline-none ${
                                        isDensityField
                                          ? 'border-purple-400 bg-purple-50 text-purple-800 font-extrabold text-sm focus:border-purple-600'
                                          : 'border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-bold focus:border-[#6366F1]'
                                      }`}
                                    />
                                  )}
                                </div>

                                <div className="sm:w-1/3 flex items-center justify-between sm:justify-end gap-3 text-right">
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {ref?.min !== undefined && ref?.max !== undefined
                                      ? `${ref.min} – ${ref.max}`
                                      : ref?.expected || ref?.text || '—'}
                                  </div>
                                  <span className={`text-xs ${evalRes.color} min-w-16 text-center`}>
                                    {evalRes.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* General Biological Observations */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Observations Générales & Conclusions du Biologiste
                </label>
                <textarea
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Conclusions diagnostiques, conseils thérapeutiques ou mention de conformité ISO 15189..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep((s) => (s - 1) as any);
                  setErrorMessage('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
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
                className="flex items-center gap-2 px-5 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-full text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer seul</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalSubmit(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
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
