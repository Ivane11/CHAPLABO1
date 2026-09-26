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
  Plus,
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
  onViewDossier?: (dossier: DossierReport) => void;
}

const getExamTheme = (examName: string) => {
  const name = examName.toLowerCase();
  if (name.includes('nfs') || name.includes('hémato') || name.includes('sang')) {
    return {
      id: 'hematology',
      primary: '#475569',
      gradient: 'from-[#F1F5F9] to-[#E2E8F0]',
      borderB: 'border-[#CBD5E1]',
      text: 'text-[#334155]',
      badgeBg: 'bg-[#F1F5F9]',
      badgeText: 'text-[#475569]',
      ringFocus: 'focus:border-[#334155] focus:ring-[#334155]/20',
      tabBg: 'bg-[#F1F5F9]',
      tabBorder: 'border-t-[#475569]',
      inputHover: 'hover:border-[#94A3B8]',
    };
  }
  if (name.includes('paludisme') || name.includes('parasito') || name.includes('goutte')) {
    return {
      id: 'parasitology',
      primary: '#E11D48',
      gradient: 'from-[#FFF1F2] to-[#FFE4E6]',
      borderB: 'border-[#FECDD3]',
      text: 'text-[#9F1239]',
      badgeBg: 'bg-[#FFE4E6]',
      badgeText: 'text-[#E11D48]',
      ringFocus: 'focus:border-[#E11D48] focus:ring-[#E11D48]/20',
      tabBg: 'bg-[#FFE4E6]',
      tabBorder: 'border-t-[#E11D48]',
      inputHover: 'hover:border-[#FDA4AF]',
    };
  }
  if (name.includes('crp') || name.includes('biochimie') || name.includes('inflamm')) {
    return {
      id: 'biochemistry',
      primary: '#0284C7',
      gradient: 'from-[#F0F9FF] to-[#E0F2FE]',
      borderB: 'border-[#BAE6FD]',
      text: 'text-[#0369A1]',
      badgeBg: 'bg-[#E0F2FE]',
      badgeText: 'text-[#0284C7]',
      ringFocus: 'focus:border-[#0284C7] focus:ring-[#0284C7]/20',
      tabBg: 'bg-[#E0F2FE]',
      tabBorder: 'border-t-[#0284C7]',
      inputHover: 'hover:border-[#7DD3FC]',
    };
  }
  if (name.includes('rénal') || name.includes('méta') || name.includes('urine')) {
    return {
      id: 'metabolic',
      primary: '#D97706',
      gradient: 'from-[#FFFBEB] to-[#FEF3C7]',
      borderB: 'border-[#FDE68A]',
      text: 'text-[#B45309]',
      badgeBg: 'bg-[#FEF3C7]',
      badgeText: 'text-[#D97706]',
      ringFocus: 'focus:border-[#D97706] focus:ring-[#D97706]/20',
      tabBg: 'bg-[#FEF3C7]',
      tabBorder: 'border-t-[#D97706]',
      inputHover: 'hover:border-[#FCD34D]',
    };
  }
  return {
    id: 'default',
    primary: '#7C3AED',
    gradient: 'from-[#F5F3FF] to-[#EDE9FE]',
    borderB: 'border-[#DDD6FE]',
    text: 'text-[#6D28D9]',
    badgeBg: 'bg-[#EDE9FE]',
    badgeText: 'text-[#7C3AED]',
    ringFocus: 'focus:border-[#7C3AED] focus:ring-[#7C3AED]/20',
    tabBg: 'bg-[#EDE9FE]',
    tabBorder: 'border-t-[#7C3AED]',
    inputHover: 'hover:border-[#C4B5FD]',
  };
};

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  dossiers,
  catalog,
  onBack,
  onOpenNewDossier,
  onUpdateDossierResults,
  onPreviewReport,
  onPrintReport,
  onViewDossier,
}) => {
  const [activeTab, setActiveTab] = useState<'infos' | 'dossiers' | 'resultats'>('dossiers');
  const patientDossiers = React.useMemo(() => {
    return dossiers.filter((d) => d.patientId === patient.id);
  }, [dossiers, patient.id]);
  const [selectedDossierId, setSelectedDossierId] = useState<string>(
    patientDossiers[patientDossiers.length - 1]?.id || ''
  );

  const selectedDossier =
    patientDossiers.find((d) => d.id === selectedDossierId) ||
    patientDossiers[patientDossiers.length - 1];

  const [activeExamTabId, setActiveExamTabId] = useState<string | null>(
    selectedDossier?.examensInclus?.[0] || null
  );

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
      setActiveExamTabId(target.examensInclus?.[0] || null);
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
    <div className="flex flex-col gap-3 text-[12px] select-none bg-white min-h-full">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'annuaire</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="border border-slate-200 rounded-sm border-l-4 border-l-blue-600 p-3 bg-white">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-slate-900 uppercase">
              {patient.nom} {patient.prenom}
            </h2>
            <span className="text-[11px] font-mono font-bold text-slate-700">
              [{patient.id}]
            </span>
          </div>
          <div className="text-[12px] text-slate-700 flex items-center gap-2">
            <span>{patient.sexe === 'F' ? 'Femme' : 'Homme'}</span>
            <span className="text-slate-300">•</span>
            <span>{patient.age} ans</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono">{patient.telephone}</span>
          </div>
          <div className="mt-1">
            <button
              onClick={onOpenNewDossier}
              className="flex items-center gap-1.5 h-7 px-3 bg-[#5B46F6] hover:bg-[#4623C2] text-white rounded-sm text-[12px] font-medium transition-colors cursor-pointer w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter des examens à réaliser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 text-[12px] font-semibold">
        <button
          onClick={() => setActiveTab('dossiers')}
          className={`h-7 px-4 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'dossiers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('resultats')}
          className={`h-7 px-4 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'resultats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saisie & Résultats
        </button>
        <button
          onClick={() => setActiveTab('infos')}
          className={`h-7 px-4 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'infos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Détails cliniques
        </button>
      </div>

      {/* TAB 1: DOSSIERS & EXAMENS */}
      {activeTab === 'dossiers' && (
        <div className="border border-slate-200 rounded-sm flex flex-col bg-white">
          <div className="px-3 py-1.5 border-b border-slate-200 bg-slate-50 border-l-4 border-l-purple-600">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase">
              Historique des Dossiers
            </h3>
          </div>
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200 w-[120px]">N° Dossier</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200 w-[90px]">Date</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200">Type Bilan</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200 w-[100px]">Échantillon</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200 w-[120px]">Prescripteur</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-200 w-[80px]">Statut</th>
                <th className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase w-[140px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-[11px]">
              {patientDossiers.length > 0 ? (
                patientDossiers.map((d) => (
                  <tr
                    key={d.id}
                    className={`border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedDossierId === d.id ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleSelectDossier(d.id)}
                  >
                    <td className="px-2 py-1.5 border-r border-slate-200 font-mono font-bold text-blue-700">{d.id}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200">{d.date.replace(/-/g, '/')}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 font-medium text-slate-800">{d.nomExamen}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200">{d.sampleType}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 truncate max-w-[120px]">{d.prescripteur}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200">
                      {d.statut === 'VALIDE' || d.statut === 'IMPRIME' ? (
                        <span className="text-[#10B981] font-bold">Validé</span>
                      ) : (
                        <span className="text-[#EA580C] font-bold">En cours</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            handleSelectDossier(d.id);
                            setActiveTab('resultats');
                          }}
                          className="h-6 px-2 text-[10px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
                        >
                          Saisir
                        </button>
                        <button
                          onClick={() => onViewDossier && onViewDossier(d)}
                          className="h-6 px-2 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Voir
                        </button>
                        <button
                          onClick={() => onPrintReport(d)}
                          className="h-6 px-2 text-[10px] font-semibold text-white bg-[#5832E5] hover:bg-[#4623C2] rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-2 py-3 text-center text-slate-500 italic">
                    Aucun dossier d'analyse enregistré pour ce patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SAISIE & RESULTATS */}
      {activeTab === 'resultats' && (
        <div className="flex flex-col gap-3">
          {selectedDossier ? (
            <div className="border border-slate-200 rounded-sm bg-white p-3 flex flex-col gap-3">
              {/* Dossier Selector Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase">
                  Dossier Actif :
                </span>
                <select
                  value={selectedDossier.id}
                  onChange={(e) => handleSelectDossier(e.target.value)}
                  className="font-mono text-[11px] font-bold text-blue-700 border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
                >
                  {patientDossiers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.nomExamen} ({d.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sheet Tabs / Onglets */}
              {selectedDossier.examensInclus.length > 0 && (
                <div className="flex items-center gap-0.5 border-b border-slate-300">
                  {selectedDossier.examensInclus.map((examId) => {
                    const examDef = catalog.find((e) => e.id === examId);
                    if (!examDef) return null;
                    const isActive = activeExamTabId === examId;

                    return (
                      <button
                        key={examId}
                        onClick={() => setActiveExamTabId(examId)}
                        className={`h-7 px-3 text-[11px] font-bold rounded-t-sm border border-b-0 transition-colors cursor-pointer ${
                          isActive
                            ? `bg-white text-slate-900 border-slate-300 border-t-2 border-t-blue-600`
                            : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200'
                        }`}
                        style={isActive ? { marginBottom: '-1px' } : {}}
                      >
                        {examDef.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Excel Spreadsheet Grid */}
              <div className="w-full">
                {selectedDossier.examensInclus.map((examId) => {
                  if (activeExamTabId !== examId) return null;

                  const examDef = catalog.find((e) => e.id === examId);
                  if (!examDef) return null;

                  return (
                    <div key={examDef.id} className="border border-slate-300 bg-white">
                      <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                          <col className="w-auto" />
                          <col className="w-[80px]" />
                          <col className="w-[120px]" />
                          <col className="w-[140px]" />
                          <col className="w-[110px]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase border-r border-slate-300">Paramètre</th>
                            <th className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase border-r border-slate-300 text-center">Unité</th>
                            <th className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase border-r border-slate-300 text-center">Valeur</th>
                            <th className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase border-r border-slate-300 text-center">Références</th>
                            <th className="px-2 py-1 text-[10px] font-bold text-slate-600 uppercase text-center">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examDef.sections.map((section, sIdx) => (
                            <React.Fragment key={sIdx}>
                              {section.title && (
                                <tr className="bg-slate-200/50 border-b border-slate-300">
                                  <td colSpan={5} className="px-2 py-1 text-[11px] font-extrabold uppercase text-slate-800">
                                    {section.title}
                                  </td>
                                </tr>
                              )}

                              {section.parameters.map((param) => {
                                const currentValue = currentResults[param.id] ?? '';
                                const ref = getEffectiveReference(param, patient);
                                const evalRes = evaluateParameterValue(currentValue, param, patient);
                                const isEmpty = currentValue === '';

                                return (
                                  <tr key={param.id} className="border-b border-slate-300 h-7 group hover:bg-slate-50 transition-colors">
                                    <td className="px-2 py-0 text-[11px] font-semibold text-slate-800 border-r border-slate-300 align-middle">
                                      {param.name}
                                    </td>
                                    <td className="px-2 py-0 text-[10px] font-mono text-slate-500 border-r border-slate-300 text-center align-middle bg-white">
                                      {param.unit || '—'}
                                    </td>
                                    <td className="p-0 border-r border-slate-300 bg-white relative align-middle">
                                      {param.type === 'select' ? (
                                        <select
                                          id={`input-${param.id}`}
                                          value={currentValue}
                                          onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                          className={`w-full h-full min-h-[27px] text-center px-1 text-[12px] font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-600 focus:bg-blue-50 cursor-pointer`}
                                        >
                                          <option value="">--</option>
                                          {param.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      ) : param.type === 'textarea' ? (
                                        <input
                                          id={`input-${param.id}`}
                                          type="text"
                                          value={currentValue}
                                          onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                          className={`w-full h-full min-h-[27px] px-2 text-[12px] font-medium text-slate-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-600 focus:bg-blue-50`}
                                        />
                                      ) : (
                                        <input
                                          id={`input-${param.id}`}
                                          type="number"
                                          step="any"
                                          value={currentValue}
                                          onChange={(e) => handleFieldChange(param.id, e.target.value)}
                                          className={`w-full h-full min-h-[27px] text-right px-2 text-[12px] font-mono font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-600 focus:bg-blue-50`}
                                        />
                                      )}
                                    </td>
                                    <td className="px-2 py-0 text-[10px] text-slate-500 border-r border-slate-300 text-center align-middle bg-white">
                                      {ref?.min !== undefined && ref?.max !== undefined
                                        ? `${ref.min} – ${ref.max}`
                                        : ref?.text || ref?.expected || '—'}
                                    </td>
                                    <td className={`px-1 py-0 text-[10px] font-bold text-center border-slate-300 align-middle ${
                                      isEmpty 
                                        ? 'text-slate-400 bg-white' 
                                        : evalRes.label === 'Normal' 
                                          ? 'text-[#15803D] bg-[#DCFCE7]'
                                          : 'text-[#B91C1C] bg-[#FEE2E2]'
                                    }`}>
                                      {isEmpty ? 'Non dosé' : evalRes.label === 'Normal' ? 'Normal' : evalRes.label === 'Élevé' ? 'Élevé ▲' : evalRes.label === 'Critique' ? 'Critique ▲▲' : 'Bas ▼'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ))}
                          
                          {/* Observations */}
                          <tr className="border-t border-slate-300 bg-[#FFFDF0]">
                            <td colSpan={5} className="p-0 align-top">
                              <div className="flex items-center justify-between px-2 py-1 border-b border-[#FDE68A]">
                                <span className="text-[10px] font-bold text-[#92400E] uppercase">Observations & Conclusion</span>
                                {examDef.name.toLowerCase().includes('nfs') && (
                                  <button
                                    type="button"
                                    onClick={handleAutoInterpretNFS}
                                    className="flex items-center gap-1 text-[10px] font-bold text-[#92400E] hover:text-[#78350F] cursor-pointer transition-colors"
                                  >
                                    <Sparkles className="w-3 h-3" /> Générer Auto
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={currentObservations}
                                onChange={(e) => {
                                  setCurrentObservations(e.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full h-[60px] p-2 text-[11px] text-slate-800 bg-transparent border-0 outline-none resize-none font-medium"
                                placeholder="Saisir la conclusion..."
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => onPreviewReport(selectedDossier)}
                    className="flex items-center gap-1.5 h-8 px-4 text-[12px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>Aperçu Bulletin</span>
                  </button>
                  <button
                    onClick={() => onPrintReport(selectedDossier)}
                    className="flex items-center gap-1.5 h-8 px-4 text-[12px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                  <button
                    onClick={handleSaveResults}
                    className="flex items-center gap-1.5 h-8 px-5 text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{hasUnsavedChanges ? 'Enregistrer les résultats *' : 'Enregistré'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-sm p-4 text-center text-slate-500 text-[12px] font-medium bg-white">
              Veuillez sélectionner un dossier.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DETAILS CLINIQUES */}
      {activeTab === 'infos' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-2">
            <div className="p-1.5 bg-[#5832E5]/10 rounded-lg">
              <FileText className="w-4 h-4 text-[#5832E5]" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-800">
              Fiche Administrative & Clinique Complète
            </h3>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Identité */}
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl relative overflow-hidden group hover:border-[#5832E5]/30 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#5832E5]/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-3.5 h-3.5 text-[#5832E5]" />
                  <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Identité</span>
                </div>
                <div className="flex flex-col gap-1.5 relative z-10">
                  <span className="font-bold text-[13px] text-slate-900">{patient.nom} {patient.prenom}</span>
                  <span className="text-[11px] text-[#5832E5] font-mono font-medium bg-[#5832E5]/10 w-fit px-1.5 py-0.5 rounded-md">{patient.id}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                      {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}
                    </span>
                    <span className="text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                      {patient.age} ans
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {patient.dateNaissance || 'Date non renseignée'}
                  </span>
                </div>
              </div>

              {/* Coordonnées & Prise en Charge */}
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl relative overflow-hidden group hover:border-[#0EA5E9]/30 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Prise en Charge</span>
                </div>
                <div className="flex flex-col gap-2.5 relative z-10">
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <span className="text-[12px] text-slate-700 font-medium">{patient.telephone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <span className="text-[12px] text-slate-700">
                      <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Prescripteur</span>
                      {patient.prescripteur || 'Consultation Externe'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <span className="text-[12px] text-slate-700">
                      <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Service</span>
                      {patient.service || 'Dispensaire'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prélèvements & Sang */}
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl relative overflow-hidden group hover:border-[#F43F5E]/30 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#F43F5E]/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-3.5 h-3.5 text-[#F43F5E]" />
                  <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Prélèvements</span>
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="bg-white border border-[#F43F5E]/20 text-[#F43F5E] px-3 py-2 rounded-lg text-[12px] font-medium shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse" />
                    {patient.prelevement || 'Sang total EDTA'}
                  </div>
                </div>
              </div>
            </div>

            {/* Renseignements Cliniques */}
            <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#5832E5]" />
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Renseignements Cliniques</span>
              </div>
              <div className="text-[12px] text-slate-700 leading-relaxed pl-1">
                {patient.renseignementsCliniques ? (
                  <span className="font-medium">{patient.renseignementsCliniques}</span>
                ) : (
                  <span className="italic opacity-60">Aucun renseignement clinique fourni.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
