import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ExamDefinition, Patient } from '../../types';
import { evaluateParameterValue, getEffectiveReference, interpretElectroHb, interpretWidal } from '../../utils/interpretation';
import { ElectrophoresisCurve } from './ElectrophoresisCurve';

interface ResultGridProps {
  exam: ExamDefinition;
  resultsData: Record<string, any>;
  activePatient: Patient;
  theme: {
    bg: string;
    headerBg: string;
    border: string;
    icon: React.ElementType;
    labelColor: string;
  };
  readOnly?: boolean;
  onResultChange?: (paramId: string, value: any) => void;
  automate?: string;
  onAutomateChange?: (automate: string) => void;
}

export const ResultGrid: React.FC<ResultGridProps> = ({
  exam,
  resultsData,
  activePatient,
  theme,
  readOnly = false,
  onResultChange,
  automate,
  onAutomateChange,
}) => {
  const Icon = theme.icon;

  const handleResultChange = (paramId: string, val: any) => {
    if (onResultChange && !readOnly) {
      onResultChange(paramId, val);
    }
  };

  return (
    <div
      className="bg-white rounded-sm overflow-hidden flex flex-col"
      style={{
        borderColor: theme.border,
        borderWidth: '1px',
        borderLeftWidth: '4px',
        '--exam-color': theme.border,
      } as React.CSSProperties}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: theme.headerBg, color: 'white' }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            {exam.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          {!readOnly && onAutomateChange ? (
            <select
              value={automate || ''}
              onChange={(e) => onAutomateChange(e.target.value)}
              className="h-5 bg-white/10 border border-white/20 rounded-sm px-1 outline-none text-white cursor-pointer"
            >
              <option value="" className="text-slate-900">Automate (Optionnel)</option>
              <option value="Sysmex XN-L 550" className="text-slate-900">Sysmex XN-L 550</option>
              <option value="Selectra ProM" className="text-slate-900">Selectra ProM</option>
              <option value="Interlab G26" className="text-slate-900">Interlab G26</option>
              <option value="Microscopie" className="text-slate-900">Microscopie</option>
            </select>
          ) : automate ? (
            <span className="bg-white/20 px-1.5 rounded-sm">{automate}</span>
          ) : null}
          <span>{exam.sampleTypeDefault}</span>
        </div>
      </div>

      <div className="p-2" style={{ background: theme.bg }}>
        <div
          className="border border-slate-300 rounded-sm overflow-hidden"
          style={{ background: 'transparent' }}
        >
          <table className="w-full text-left border-collapse table-fixed text-[12px]">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[10%]" />
              <col className="w-[27%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr
                className="border-b border-slate-300 text-[10px] uppercase h-[24px]"
                style={{ background: theme.headerBg, color: 'white' }}
              >
                <th className="px-2 py-0 font-bold border-r border-white/20">Paramètre</th>
                <th className="px-2 py-0 font-bold border-r border-white/20 text-center">Unité</th>
                <th className="px-2 py-0 font-bold border-r border-white/20 text-center">Valeur</th>
                <th className="px-2 py-0 font-bold border-r border-white/20 text-center">Norme</th>
                <th className="px-2 py-0 font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {exam.sections.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  {section.title && (
                    <tr className="bg-black/5 border-b border-slate-300/50">
                      <td
                        colSpan={5}
                        className="px-2 py-0.5 text-[10px] font-extrabold text-slate-700 uppercase"
                      >
                        {section.title}
                      </td>
                    </tr>
                  )}
                  {section.parameters.map((param, pIdx) => {
                    const val = resultsData[param.id] ?? '';
                    const ref = getEffectiveReference(param, activePatient, exam.id, resultsData);
                    const evalRes = evaluateParameterValue(val, param, activePatient, exam.id, resultsData);

                    const hasValue = val !== '';
                    const isOutOfRange =
                      hasValue && evalRes.label !== 'NORMAL' && evalRes.label !== '';

                    const inputClass = `w-full h-[22px] border rounded-sm px-2 text-[12px] font-mono font-semibold outline-none focus:border-[var(--exam-color)] focus:ring-1 focus:ring-[var(--exam-color)] text-center ${
                      readOnly
                        ? 'bg-transparent border-transparent'
                        : isOutOfRange
                        ? 'bg-[#FEE2E2] border-[#DC2626] text-[#991B1B]'
                        : 'bg-white border-[#D1D5DB]'
                    }`;

                    return (
                      <tr
                        key={param.id}
                        className={`border-b border-slate-300/50 h-[26px] ${
                          pIdx % 2 === 0 ? 'bg-transparent' : 'bg-black/[0.02]'
                        }`}
                      >
                        <td
                          className="px-2 py-0 text-[12px] font-medium text-[#1F2937] border-r border-slate-300/50 align-middle truncate"
                          title={param.name}
                        >
                          {param.name}
                        </td>
                        <td className="px-2 py-0 text-[10px] font-mono text-slate-600 border-r border-slate-300/50 text-center align-middle">
                          {param.unit || '—'}
                        </td>
                        <td className="p-0.5 border-r border-slate-300/50 align-middle px-1 text-center">
                          {readOnly ? (
                            <div className="text-[12px] font-mono font-semibold text-center h-[22px] flex items-center justify-center">
                              {val}
                            </div>
                          ) : param.type === 'select' ? (
                            <select
                              value={val}
                              onChange={(e) => handleResultChange(param.id, e.target.value)}
                              className={`${inputClass} cursor-pointer text-center`}
                            >
                              <option value=""></option>
                              {param.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : param.type === 'textarea' ? (
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleResultChange(param.id, e.target.value)}
                              className={`${inputClass}`}
                            />
                          ) : (
                            <input
                              type="number"
                              step="any"
                              value={val}
                              onChange={(e) => handleResultChange(param.id, e.target.value)}
                              className={`${inputClass}`}
                            />
                          )}
                        </td>
                        <td className="px-2 py-0 text-[11px] font-mono text-[#6B7280] border-r border-slate-200 text-center align-middle">
                          {ref?.min !== undefined && ref?.max !== undefined
                            ? `${ref.min} – ${ref.max}`
                            : ref?.expected || ref?.text || '—'}
                        </td>
                        <td className="px-2 py-0 text-center align-middle">
                          {hasValue && evalRes.label && (
                            <span
                              className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${
                                (param.id.startsWith('WIDAL_') || param.id.startsWith('FELIX_'))
                                  ? evalRes.color
                                  : evalRes.label === 'NORMAL'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : evalRes.label.includes('ÉLEVÉ') ||
                                    evalRes.label.includes('POSITIF')
                                  ? 'bg-[#FEE2E2] text-[#991B1B]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {evalRes.label === 'NORMAL'
                                ? 'NORMAL'
                                : evalRes.label.includes('ÉLEVÉ')
                                ? '▲ ÉLEVÉ'
                                : evalRes.label.includes('BAS')
                                ? '▼ BAS'
                                : evalRes.label}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {exam.id.includes('ELECTRO') && (() => {
          const profilStr = String(resultsData['ELEC_PROFIL'] || 'AUTRE');
          const interp = interpretElectroHb(profilStr, {
            age: activePatient.age || 30,
            sexe: activePatient.sexe as 'M'|'F' || 'M'
          });
          return (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
              <ElectrophoresisCurve profil={profilStr} />
              {profilStr !== 'AUTRE' && profilStr !== '' && (
                <div className="mt-3">
                  <div className={`p-2 border-l-4 rounded-r-sm text-[11px] ${
                    interp.level === 'URGENT' ? 'bg-red-50 border-red-500 text-red-900' :
                    interp.level === 'ANORMAL' ? 'bg-orange-50 border-orange-500 text-orange-900' :
                    interp.level === 'ATTENTION' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' :
                    'bg-emerald-50 border-emerald-500 text-emerald-900'
                  }`}>
                    <div className="font-bold uppercase mb-1">
                      🔬 Interprétation électrophorèse
                    </div>
                    <div className="font-bold text-[12px] mb-1">
                      {interp.nomClinique}
                    </div>
                    <div className="mb-2">
                      {interp.details}
                    </div>
                    {interp.conseil && (
                      <div className="text-[10px] whitespace-pre-line mb-1 opacity-90">
                        💡 {interp.conseil}
                      </div>
                    )}
                    {interp.conseilFamilial && (
                      <div style={{
                        marginTop: 4,
                        padding: 6,
                        backgroundColor: '#FEF2F2',
                        borderLeft: '3px solid #DC2626',
                        fontSize: 10,
                        color: '#991B1B',
                        whiteSpace: 'pre-line',
                      }}>
                        {interp.conseilFamilial}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {exam.id.includes('WIDAL') && (() => {
          const interp = interpretWidal(resultsData);
          if (!interp || interp.level === 'NORMAL') return null;
          
          return (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
              <div className="mt-1">
                <div className={`p-2 border-l-4 rounded-r-sm text-[11px] ${
                  interp.level === 'URGENT' ? 'bg-red-50 border-red-500 text-red-900' :
                  interp.level === 'ANORMAL' ? 'bg-orange-50 border-orange-500 text-orange-900' :
                  interp.level === 'ATTENTION' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' :
                  'bg-emerald-50 border-emerald-500 text-emerald-900'
                }`}>
                  <div className="font-bold uppercase mb-1">
                    🔬 Interprétation Widal & Felix
                  </div>
                  <div className="font-bold text-[12px] mb-1">
                    {interp.conclusion}
                  </div>
                  <div className="mb-2">
                    {interp.details}
                  </div>
                  {interp.conseil && (
                    <div className="text-[10px] whitespace-pre-line mb-1 opacity-90">
                      💡 {interp.conseil}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="mt-2 flex flex-col gap-1">
          <label
            className="flex items-center gap-1 text-[11px] font-bold uppercase"
            style={{ color: theme.labelColor }}
          >
            <MessageSquare className="w-3 h-3" />
            Commentaire {exam.name} :
          </label>
          {readOnly ? (
            <div className="w-full bg-white border border-[#D1D5DB] rounded-sm p-2 text-[12px] text-slate-900 min-h-[40px] whitespace-pre-wrap">
              {resultsData[`COMMENT_${exam.id}`] || <span className="text-slate-400 italic">Aucun commentaire</span>}
            </div>
          ) : (
            <textarea
              rows={2}
              placeholder="Saisir une observation, un commentaire ou une conclusion..."
              value={resultsData[`COMMENT_${exam.id}`] || ''}
              onChange={(e) => handleResultChange(`COMMENT_${exam.id}`, e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-sm p-2 text-[12px] text-slate-900 outline-none focus:border-[var(--exam-color)] focus:ring-1 focus:ring-[var(--exam-color)]"
            />
          )}
        </div>
      </div>
    </div>
  );
};
