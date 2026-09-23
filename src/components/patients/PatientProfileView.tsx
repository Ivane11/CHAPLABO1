import React, { useState } from 'react';
import {
  ArrowLeft,
  FilePlus,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Calendar,
  User,
  Stethoscope,
  Building,
  Activity,
  FileText,
  Eye,
} from 'lucide-react';
import { DossierReport, ExamDefinition, Patient } from '../../types';
import {
  evaluateParameterValue,
  getEffectiveReference,
  interpretHematologyNFS,
} from '../../utils/interpretation';

interface PatientProfileViewProps {
  patient: Patient;
  dossiers: DossierReport[];
  catalog: ExamDefinition[];
  onBack: () => void;
  onOpenNewDossier: () => void;
  onUpdateDossierResults: (dossierId: string, results: Record<string, any>, observations?: string) => void;
  onPreviewReport: (dossier: DossierReport) => void;
  onPrintReport: (dossier: DossierReport) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  dossiers,
  catalog,
  onBack,
  onOpenNewDossier,
  onUpdateDossierResults,
  onPreviewReport,
  onPrintReport,
}) => {
  const [activeTab, setActiveTab] = useState<'infos' | 'dossiers' | 'resultats'>('dossiers');
  const patientDossiers = dossiers.filter((d) => d.patientId === patient.id);
  const [selectedDossierId, setSelectedDossierId] = useState<string>(
    patientDossiers[patientDossiers.length - 1]?.id || ''
  );

  const selectedDossier =
    patientDossiers.find((d) => d.id === selectedDossierId) ||
    patientDossiers[patientDossiers.length - 1];

  // Temporary local state for editing results
  const [currentResults, setCurrentResults] = useState<Record<string, any>>(
    selectedDossier?.resultats || {}
  );
  const [currentObservations, setCurrentObservations] = useState<string>(
    selectedDossier?.observations || ''
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state if selected dossier changes
  const handleSelectDossier = (dId: string) => {
    setSelectedDossierId(dId);
    const target = patientDossiers.find((d) => d.id === dId);
    if (target) {
      setCurrentResults(target.resultats || {});
      setCurrentObservations(target.observations || '');
      setHasUnsavedChanges(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setCurrentResults((prev) => {
      const updated = { ...prev, [key]: value };

      // Automatic formula calculation if WBC and percent is typed
      if (key.endsWith('_PCT') && updated.NFS_WBC) {
        const baseKey = key.replace('_PCT', '');
        const wbc = parseFloat(String(updated.NFS_WBC));
        const pct = parseFloat(String(value));
        if (!isNaN(wbc) && !isNaN(pct)) {
          updated[`${baseKey}_ABS`] = parseFloat(((pct * wbc) / 100).toFixed(2));
        }
      }

      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveResults = () => {
    if (!selectedDossier) return;
    onUpdateDossierResults(selectedDossier.id, currentResults, currentObservations);
    setHasUnsavedChanges(false);
  };

  const handleAutoInterpretNFS = () => {
    const interpretation = interpretHematologyNFS(currentResults, patient);
    setCurrentObservations((prev) => {
      const prefix = prev ? `${prev}\n\n` : '';
      return `${prefix}Conclusion Hémogramme : ${interpretation.summary}`;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'annuaire des patients</span>
        </button>

        <button
          onClick={onOpenNewDossier}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>+ Nouveau Dossier pour ce patient</span>
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xl shrink-0">
              {patient.nom.slice(0, 1)}
              {patient.prenom.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {patient.nom} {patient.prenom}
                </h2>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {patient.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Dossier Actif
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {patient.sexe === 'F' ? 'Féminin' : 'Masculin'} · {patient.age} ans
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Né(e) le {patient.dateNaissance || '—'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.telephone}
                </span>
                <span>·</span>
                <span className="text-blue-600 font-medium">
                  Groupe : {patient.groupeSanguin || 'O (Rh+)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('dossiers')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all ${
            activeTab === 'dossiers'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dossiers & Bilans ({patientDossiers.length})
        </button>
        <button
          onClick={() => setActiveTab('resultats')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all ${
            activeTab === 'resultats'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saisie & Résultats d'Analyses
        </button>
        <button
          onClick={() => setActiveTab('infos')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all ${
            activeTab === 'infos'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Détails & Renseignements Cliniques
        </button>
      </div>

      {/* TAB 1: DOSSIERS & EXAMENS */}
      {activeTab === 'dossiers' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Historique des Dossiers & Bilans du Patient
            </h3>
            <button
              onClick={onOpenNewDossier}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>+ Créer un nouveau bilan</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {patientDossiers.length > 0 ? (
              patientDossiers.map((d) => (
                <div
                  key={d.id}
                  className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                    selectedDossierId === d.id ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-600">
                        {d.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {d.nomExamen}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          d.statut === 'VALIDE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.statut === 'A_VALIDER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {d.statut === 'VALIDE' ? 'Validé par biologiste' : d.statut}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Date : {d.date}</span>
                      <span>·</span>
                      <span>Échantillon : {d.sampleType}</span>
                      <span>·</span>
                      <span>Prescrit par : {d.prescripteur}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        handleSelectDossier(d.id);
                        setActiveTab('resultats');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Saisir / Modifier
                    </button>

                    <button
                      onClick={() => onPreviewReport(d)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualiser</span>
                    </button>

                    <button
                      onClick={() => onPrintReport(d)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucun dossier d'analyse enregistré pour ce patient. Cliquez sur "Créer un nouveau bilan" pour commencer.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAISIE & RESULTATS */}
      {activeTab === 'resultats' && (
        <div className="space-y-4">
          {selectedDossier ? (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
              {/* Dossier Selector Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Dossier Actif :
                    </span>
                    <select
                      value={selectedDossier.id}
                      onChange={(e) => handleSelectDossier(e.target.value)}
                      className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-2 py-1 outline-none cursor-pointer"
                    >
                      {patientDossiers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.id} — {d.nomExamen} ({d.date})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewReport(selectedDossier)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Aperçu Bulletin</span>
                  </button>

                  <button
                    onClick={() => onPrintReport(selectedDossier)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span>Imprimer</span>
                  </button>

                  <button
                    onClick={handleSaveResults}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      hasUnsavedChanges
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{hasUnsavedChanges ? 'Enregistrer les résultats *' : 'Enregistré'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Exam Parameters Table */}
              <div className="mt-5 space-y-6">
                {selectedDossier.examensInclus.map((examId) => {
                  const examDef = catalog.find((e) => e.id === examId);
                  if (!examDef) return null;

                  return (
                    <div
                      key={examDef.id}
                      className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                    >
                      <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            {examDef.name}
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {examDef.sampleTypeDefault}
                        </span>
                      </div>

                      {examDef.sections.map((section, sIdx) => (
                        <div key={sIdx} className="p-4">
                          {section.title && (
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                              {section.title}
                            </h5>
                          )}

                          <div className="divide-y divide-slate-100">
                            {section.parameters.map((param) => {
                              const currentValue = currentResults[param.id] ?? '';
                              const ref = getEffectiveReference(param, patient);
                              const evalRes = evaluateParameterValue(currentValue, param, patient);

                              return (
                                <div
                                  key={param.id}
                                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                  {/* Label & Unit */}
                                  <div className="sm:w-1/3">
                                    <span className="font-semibold text-slate-800">
                                      {param.name}
                                    </span>
                                    {param.unit && (
                                      <span className="text-slate-400 ml-1 font-mono text-[11px]">
                                        ({param.unit})
                                      </span>
                                    )}
                                  </div>

                                  {/* Input Control */}
                                  <div className="sm:w-1/3 flex items-center gap-2">
                                    {param.type === 'select' ? (
                                      <select
                                        value={currentValue}
                                        onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none transition-all cursor-pointer font-medium"
                                      >
                                        <option value="">-- Sélectionner --</option>
                                        {param.options?.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                    ) : param.type === 'textarea' ? (
                                      <textarea
                                        value={currentValue}
                                        onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                        rows={2}
                                        placeholder="Observations microscopiques..."
                                        className="w-full bg-purple-50/50 focus:bg-white border border-purple-200 focus:border-purple-500 rounded-lg p-2 text-xs text-slate-800 outline-none transition-all"
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        step="any"
                                        value={currentValue}
                                        onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                        placeholder="Valeur..."
                                        className={`w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs font-mono font-bold outline-none transition-all text-slate-900 ${
                                          param.highlightColor || ''
                                        }`}
                                      />
                                    )}
                                  </div>

                                  {/* Reference Interval & Live Evaluation Status */}
                                  <div className="sm:w-1/3 flex items-center justify-between sm:justify-end gap-3 text-right">
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      {ref?.min !== undefined && ref?.max !== undefined
                                        ? `${ref.min} – ${ref.max} ${param.unit || ''}`
                                        : ref?.text || ref?.expected || '—'}
                                    </div>
                                    <span
                                      className={`text-xs ${evalRes.color} min-w-16 text-center`}
                                    >
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

                {/* Interpretation & Observations Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Interprétation Biologique & Observations Médicales
                    </span>

                    <button
                      type="button"
                      onClick={handleAutoInterpretNFS}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Interprétation auto (NFS)</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={currentObservations}
                    onChange={(e) => {
                      setCurrentObservations(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Ajoutez les conclusions, réserves ou commentaires du biologiste qui apparaîtront sur le compte rendu officiel..."
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-3 text-xs text-slate-800 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
              Veuillez d'abord sélectionner ou créer un dossier d'analyse dans l'onglet "Dossiers & Bilans".
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DETAILS & INFORMATIONS */}
      {activeTab === 'infos' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Fiche Administrative & Clinique Complète
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Identité & État Civil
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {patient.nom} {patient.prenom}
              </div>
              <div className="text-slate-600 mt-1">
                Identifiant : <span className="font-mono">{patient.id}</span>
              </div>
              <div className="text-slate-600">
                Sexe : {patient.sexe === 'F' ? 'Féminin (F)' : 'Masculin (M)'}
              </div>
              <div className="text-slate-600">
                Date de Naissance : {patient.dateNaissance || '—'} ({patient.age} ans)
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Coordonnées & Prise en Charge
              </span>
              <div className="text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.telephone || 'Non renseigné'}</span>
              </div>
              <div className="text-slate-700 flex items-center gap-1.5 mt-2">
                <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                <span>Prescripteur : {patient.prescripteur || 'Consultation Externe'}</span>
              </div>
              <div className="text-slate-700 flex items-center gap-1.5 mt-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Service : {patient.service || 'Dispensaire'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Prélèvements & Hématologie
              </span>
              <div className="text-slate-700">
                Type de prélèvement habituel :
                <span className="font-semibold text-slate-900 ml-1">
                  {patient.prelevement || 'Sang total EDTA'}
                </span>
              </div>
              <div className="text-slate-700 mt-1">
                Groupe Sanguin :
                <span className="font-bold text-blue-600 ml-1">
                  {patient.groupeSanguin || 'O (Rh+)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Renseignements Cliniques & Anamnèse
            </span>
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 leading-relaxed font-medium">
              {patient.renseignementsCliniques || 'Aucun antécédent ou renseignement clinique renseigné pour ce patient.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
