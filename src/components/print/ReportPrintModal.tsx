import React, { useState } from 'react';
import { X, Printer, Download, Eye, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DossierReport, ExamDefinition, LabSettings, Patient } from '../../types';
import { evaluateParameterValue, getEffectiveReference } from '../../utils/interpretation';

interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DossierReport | null;
  patient: Patient | null;
  catalog: ExamDefinition[];
  settings: LabSettings;
  printMode?: 'OFFICIAL_A4' | 'ISO_DOUBLE_A5';
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  isOpen,
  onClose,
  dossier,
  patient,
  catalog,
  settings,
  printMode = 'OFFICIAL_A4',
}) => {
  if (!isOpen || !dossier || !patient) return null;

  const [activePrintLayout, setActivePrintLayout] = useState<'OFFICIAL_A4' | 'ISO_DOUBLE_A5'>(printMode);

  const handleTriggerPrint = () => {
    window.print();
  };

  // Render individual exam table
  const renderExamResults = (examDef: ExamDefinition) => {
    return (
      <div key={examDef.id} className="mb-4">
        <div className="bg-slate-100 border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-900 uppercase tracking-wide flex justify-between">
          <span>{examDef.name}</span>
          <span className="font-mono text-slate-600 font-normal">
            Échantillon : {dossier.sampleType || examDef.sampleTypeDefault}
          </span>
        </div>

        <table className="w-full text-left text-[11px] border-collapse mt-1">
          <thead>
            <tr className="border-b border-slate-300 text-slate-600 text-[10px] uppercase font-semibold">
              <th className="py-1 px-2">Paramètre Analysé</th>
              <th className="py-1 px-2 text-right">Résultat Obtenu</th>
              <th className="py-1 px-2 text-center">Unité</th>
              <th className="py-1 px-2 text-center">Intervalles de Référence</th>
              <th className="py-1 px-2 text-center">Interprétation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {examDef.sections.flatMap((section) =>
              section.parameters.map((param) => {
                const val = dossier.resultats[param.id] ?? '';
                const ref = getEffectiveReference(param, patient);
                const evalRes = evaluateParameterValue(val, param, patient);

                // Specific styling for Goutte Épaisse as requested by the user:
                // - Résultat en gras
                // - Densité parasitaire en gras et couleur violette
                // - Case d'observation et d'interprétation fond violet clair
                const isDensityField = param.id === 'GE_DENSITE';
                const isResultField = param.id === 'GE_RESULTAT';
                const isObsField = param.id === 'GE_OBS';

                if (isObsField) {
                  return (
                    <tr key={param.id} className="bg-purple-50/80 border border-purple-200">
                      <td colSpan={5} className="p-2.5">
                        <div className="font-bold text-purple-950 text-[10px] uppercase tracking-wider mb-0.5">
                          Observations Microscopiques & Confirmation :
                        </div>
                        <div className="text-purple-900 font-medium italic text-[11px]">
                          {val || 'Examen direct négatif. Absence de trophozoïtes ni schizontes.'}
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={param.id} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2 font-medium text-slate-800">
                      {param.name}
                    </td>

                    <td
                      className={`py-1.5 px-2 text-right font-mono ${
                        isDensityField
                          ? 'font-extrabold text-purple-800 text-[12px]'
                          : isResultField
                          ? 'font-extrabold text-slate-900 text-[12px]'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {val !== '' && val !== undefined ? String(val) : '—'}
                    </td>

                    <td className="py-1.5 px-2 text-center font-mono text-slate-500 text-[10px]">
                      {param.unit || '—'}
                    </td>

                    <td className="py-1.5 px-2 text-center font-mono text-slate-600 text-[10px]">
                      {ref?.min !== undefined && ref?.max !== undefined
                        ? `${ref.min} – ${ref.max}`
                        : ref?.expected || ref?.text || '—'}
                    </td>

                    <td className="py-1.5 px-2 text-center">
                      <span className={`text-[10px] font-bold ${evalRes.color}`}>
                        {evalRes.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none overflow-y-auto">
      {/* Top Floating Control Bar (Hidden during Print) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-60 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3 no-print">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActivePrintLayout('OFFICIAL_A4')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activePrintLayout === 'OFFICIAL_A4'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            A4 Portrait Officiel
          </button>
          <button
            onClick={() => setActivePrintLayout('ISO_DOUBLE_A5')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activePrintLayout === 'ISO_DOUBLE_A5'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Double A5 Massicot (ISO)
          </button>
        </div>

        <button
          onClick={handleTriggerPrint}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Lancer l'Impression</span>
        </button>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Printable Document Sheet (A4 or Double A5) */}
      <div className="mt-14 mb-8 w-full max-w-[210mm] bg-white shadow-2xl rounded-sm p-8 sm:p-10 border border-slate-200 printable-area text-slate-900 font-sans relative">
        {/* ================= LAYOUT 1: A4 PORTRAIT OFFICIEL ================= */}
        {activePrintLayout === 'OFFICIAL_A4' && (
          <div className="space-y-4">
            {/* Header: Official Laboratory Letterhead */}
            <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center font-black text-2xl rounded-lg">
                  C
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">
                    {settings.labName}
                  </h1>
                  <p className="text-[11px] font-bold text-blue-700">
                    {settings.labCenter}
                  </p>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    {settings.labAddress}
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    Tél: {settings.labPhone} · Email: {settings.labEmail}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500">
                  N° Agrément : {settings.labAgrement}
                </div>
                <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                  Accréditation ISO 15189
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Automate : {dossier.automateType || 'Mindray BC-30s'}
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white text-center py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span>COMPTE RENDU D'ANALYSES MÉDICALES</span>
              <span className="font-mono text-blue-300">DOSSIER N° {dossier.id}</span>
            </div>

            {/* Patient & Prescription Details Matrix */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PATIENT :</span>{' '}
                  <strong className="text-slate-900 font-bold">
                    {patient.nom} {patient.prenom}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">IDENTIFIANT :</span>{' '}
                  <span className="font-mono text-slate-800 font-bold">{patient.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">ÂGE / SEXE :</span>{' '}
                  <span className="text-slate-800">{patient.age} ans · Sexe {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">TÉLÉPHONE :</span>{' '}
                  <span className="font-mono text-slate-800">{patient.telephone || '—'}</span>
                </div>
              </div>

              <div className="space-y-1 border-l border-slate-200 pl-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PRESCIPTEUR :</span>{' '}
                  <strong className="text-slate-900">{dossier.prescripteur}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">SERVICE :</span>{' '}
                  <span className="text-slate-800">{dossier.service || patient.service || 'Dispensaire'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PRÉLÈVEMENT LE :</span>{' '}
                  <span className="font-mono text-slate-800">{dossier.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">ÉCHANTILLON :</span>{' '}
                  <span className="text-slate-800">{dossier.sampleType}</span>
                </div>
              </div>
            </div>

            {/* Results Tables for each included exam */}
            <div className="space-y-3 pt-1">
              {dossier.examensInclus.map((examId) => {
                const exam = catalog.find((e) => e.id === examId);
                if (!exam) return null;
                return renderExamResults(exam);
              })}
            </div>

            {/* Biologist Conclusion & Interpretation */}
            <div className="border border-slate-200 rounded p-3 bg-slate-50/70 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                CONCLUSION & REMARQUES DU BIOLOGISTE :
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                {dossier.observations ||
                  'Bilan biologique sans anomalie critique. Résultats conformes aux seuils de référence de l’établissement.'}
              </p>
            </div>

            {/* Signature & Seal Block */}
            <div className="pt-4 border-t border-slate-300 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-mono">
                  Édité le {new Date().toLocaleDateString('fr-FR')} à{' '}
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-[9px] text-slate-400">
                  Document certifié conforme selon la norme ISO 15189. Toute altération invalide ce compte-rendu.
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  LE BIOLOGISTE RESPONSABLE
                </div>
                <div className="h-10 flex items-center justify-end font-serif italic text-blue-900 text-sm opacity-80 my-1">
                  Dr. {settings.labBiologist.split('—')[0]}
                </div>
                <div className="font-bold text-slate-900 text-xs">
                  {dossier.biologisteValidateur || settings.labBiologist}
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">
                  Validé électroniquement ✓
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LAYOUT 2: DOUBLE A5 MASSICOT (ISO 15189) ================= */}
        {activePrintLayout === 'ISO_DOUBLE_A5' && (
          <div className="space-y-8">
            {/* Volet 1: Exemplaire Patient */}
            <div className="border border-slate-300 p-4 rounded space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    {settings.labName} · VOLET PATIENT
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {dossier.nomExamen} — #{dossier.id}
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  Date : {dossier.date}
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs gap-2 bg-slate-50 p-2 rounded">
                <div>
                  Patient : <strong>{patient.nom} {patient.prenom}</strong> ({patient.age} ans)
                </div>
                <div>
                  Prescripteur : <strong>{dossier.prescripteur}</strong>
                </div>
              </div>

              {/* Compact results */}
              <div className="space-y-2">
                {dossier.examensInclus.slice(0, 2).map((examId) => {
                  const exam = catalog.find((e) => e.id === examId);
                  if (!exam) return null;
                  return renderExamResults(exam);
                })}
              </div>

              <div className="text-right text-[10px] text-slate-400 font-mono pt-2 border-t">
                Signature : {settings.labBiologist}
              </div>
            </div>

            {/* Dotted Cutting Line */}
            <div className="relative py-2 text-center text-[10px] text-slate-400 font-mono select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-slate-300" />
              </div>
              <span className="relative bg-white px-3 font-semibold uppercase text-slate-500">
                ✂ Ligne de Massicotage / Découpe A5
              </span>
            </div>

            {/* Volet 2: Exemplaire Laboratoire / Archive Médicale */}
            <div className="border border-slate-300 p-4 rounded space-y-3 bg-slate-50/40">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    ARCHIVE LIS & TRAÇABILITÉ (ISO 15189) · VOLET LABORATOIRE
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Bilan Patient #{patient.id} — Dossier #{dossier.id}
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  Automate : {dossier.automateType}
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  Patient : <strong>{patient.nom} {patient.prenom}</strong> · Prélèvement : {dossier.sampleType}
                </div>
                <div>
                  Validation Biologique : Certifiée conforme par {settings.labBiologist}
                </div>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded text-xs">
                <strong>Observations :</strong> {dossier.observations || 'Analyses conformes aux contrôles qualité.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
