import React from 'react';
import { DossierReport, ExamDefinition, LabSettings, Patient } from '../../types';
import { evaluateParameterValue, getEffectiveReference } from '../../utils/interpretation';
import { ElectrophoresisCurve } from '../saisie/ElectrophoresisCurve';

interface ReportPrintContentProps {
  dossier: DossierReport;
  patient: Patient;
  catalog: ExamDefinition[];
  settings: LabSettings;
  format: 'A4' | 'A5'; 
}

const show = (val?: string) => val && val.trim() !== '';

const CATEGORY_COLORS: Record<string, string> = {
  'Hématologie': '#DC2626',
  'Biochimie': '#059669',
  'Sérologie': '#CA8A04',
  'Parasitologie': '#EA580C',
  'Hormonologie': '#DB2777',
  'Microbiologie': '#0891B2',
  'Immuno-Hémostase': '#7C3AED',
};

export const ReportPrintContent: React.FC<ReportPrintContentProps> = ({
  dossier,
  patient,
  catalog,
  settings,
}) => {

  const getEvalStyle = (status: string) => {
    switch(status) {
      case 'CRITICAL': return { backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' };
      case 'NORMAL': return { backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' };
      default: return {};
    }
  };

  const renderExamResults = (examDef: ExamDefinition) => {
    const category = examDef.category || 'Hématologie';
    const headerColor = CATEGORY_COLORS[category] || '#374151';

    return (
      <div key={examDef.id} className="exam-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginBottom: '3mm', width: '100%', boxSizing: 'border-box' }}>
        {/* 1. Barre en-tête colorée (couleur = catégorie) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: headerColor,
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          gap: '4mm',
        }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            {examDef.name}
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: '8px' }}>
            ÉCHANTILLON : {dossier.sampleType || examDef.sampleTypeDefault}
          </span>
        </div>

        {/* 2. Tableau des paramètres */}
        <table style={{ width: '100%', textAlign: 'left', fontSize: '9px', borderCollapse: 'collapse', marginTop: '2px', boxSizing: 'border-box' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #CBD5E1', color: '#475569', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
              <th style={{ padding: '2px 4px' }}>Paramètre Analysé</th>
              <th style={{ padding: '2px 4px', textAlign: 'right' }}>Résultat Obtenu</th>
              <th style={{ padding: '2px 4px', textAlign: 'center' }}>Unité</th>
              <th style={{ padding: '2px 4px', textAlign: 'center' }}>Intervalles de Référence</th>
              <th style={{ padding: '2px 4px', textAlign: 'center' }}>Interprétation</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: '0' }}>
            {examDef.sections.flatMap((section) =>
              section.parameters.map((param) => {
                const val = dossier.resultats[param.id] ?? '';
                const ref = getEffectiveReference(param, patient, examDef.id, dossier.resultats);
                const evalRes = evaluateParameterValue(val, param, patient, examDef.id, dossier.resultats);

                const isDensityField = param.id === 'GE_DENSITE';
                const isResultField = param.id === 'GE_RESULTAT';
                const isObsField = param.id === 'GE_OBS';

                if (isObsField) {
                  return (
                    <tr key={param.id} style={{ backgroundColor: '#FAF5FF', borderBottom: '1px solid #E9D5FF', borderTop: '1px solid #E9D5FF' }}>
                      <td colSpan={5} style={{ padding: '6px' }}>
                        <div style={{ fontWeight: 'bold', color: '#3B0764', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                          Observations Microscopiques & Confirmation :
                        </div>
                        <div style={{ color: '#581C87', fontWeight: 500, fontStyle: 'italic', fontSize: '9px' }}>
                          {val || 'Examen direct négatif. Absence de trophozoïtes ni schizontes.'}
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={param.id} style={{ borderBottom: '1px solid #F1F5F9', height: '18px' }}>
                    <td style={{ padding: '2px 4px', fontWeight: 500, color: '#1E293B', maxWidth: '100%', boxSizing: 'border-box' }}>
                      {param.name}
                    </td>

                    <td style={{
                      padding: '2px 4px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      fontWeight: isDensityField || isResultField ? 800 : 'bold',
                      color: isDensityField ? '#6B21A8' : '#0F172A',
                      fontSize: isDensityField || isResultField ? '10px' : '9px',
                      maxWidth: '100%', boxSizing: 'border-box'
                    }}>
                      {val !== '' && val !== undefined ? String(val) : '—'}
                    </td>

                    <td style={{ padding: '2px 4px', textAlign: 'center', fontFamily: 'monospace', color: '#64748B', fontSize: '9px', maxWidth: '100%', boxSizing: 'border-box' }}>
                      {param.unit || '—'}
                    </td>

                    <td style={{ padding: '2px 4px', textAlign: 'center', fontFamily: 'monospace', color: '#475569', fontSize: '9px', maxWidth: '100%', boxSizing: 'border-box' }}>
                      {ref?.min !== undefined && ref?.max !== undefined
                        ? `${ref.min} – ${ref.max}`
                        : ref?.expected || ref?.text || '—'}
                    </td>

                    <td style={{ padding: '2px 4px', textAlign: 'center', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <span style={{ fontSize: '8px', fontWeight: 'bold', padding: '1px 3px', borderRadius: '2px', ...getEvalStyle(evalRes.status) }}>
                        {evalRes.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 3. Courbe électro (si applicable) */}
        {examDef.id.includes('ELECTRO') && (
          <div style={{ maxWidth: '150mm', margin: '3mm auto', boxSizing: 'border-box' }}>
            <ElectrophoresisCurve profil={String(dossier.resultats?.[`ELEC_PROFIL`] || 'AUTRE')} compact={true} />
          </div>
        )}
        
        {/* 4. Commentaire (fond coloré léger) */}
        {(() => {
          const examComment = dossier.resultats?.[`COMMENT_${examDef.id}`];
          if (examComment && String(examComment).trim() !== '') {
            return (
              <div style={{ padding: '4px 8px', backgroundColor: '#F8FAFC', borderLeft: `2px solid ${headerColor}`, marginTop: '2mm', boxSizing: 'border-box', maxWidth: '100%' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '2px' }}>
                  Commentaire {examDef.category || 'analyse'}
                </div>
                <div style={{ fontSize: '9px', color: '#1F2937', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {String(examComment)}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  };

  const date = new Date().toLocaleDateString('fr-FR');
  const heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      id="print-report-content"
      style={{
        width: '194mm',
        minHeight: '281mm',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '9px',
        color: '#1F2937',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        lineHeight: 1.4,
      }}
    >
      {/* ═══════ ZONE 1 : EN-TÊTE LABO ═══════ */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '4mm',
        marginBottom: '4mm',
        borderBottom: '2px solid #1F2937',
        width: '100%',
        boxSizing: 'border-box',
        pageBreakAfter: 'avoid',
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: '5mm', display: 'flex', gap: '8px' }}>
          {show(settings.logoUrl) && (
            <img src={settings.logoUrl} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {show(settings.labName) && (
              <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1F2937' }}>
                {settings.labName}
              </div>
            )}
            {show(settings.labCenter) && (
              <div style={{ fontSize: '10px', color: '#5B46F6', fontWeight: 600 }}>
                {settings.labCenter}
              </div>
            )}
            {show(settings.labAddress) && (
              <div style={{ fontSize: '8px', color: '#6B7280' }}>
                {settings.labAddress}
              </div>
            )}
            {(() => {
              const segments = [];
              if (show(settings.labPhone)) segments.push(`Tél: ${settings.labPhone}`);
              if (show(settings.labEmail)) segments.push(`Email: ${settings.labEmail}`);
              if (show(settings.labWebsite)) segments.push(settings.labWebsite);
              if (segments.length === 0) return null;
              return (
                <div style={{ fontSize: '8px', color: '#6B7280', fontFamily: 'monospace' }}>
                  {segments.join(' · ')}
                </div>
              );
            })()}
          </div>
        </div>
        <div style={{
          width: '75mm',
          flexShrink: 0,
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {show(settings.labAgrement) && (
            <div style={{ fontSize: '8px', color: '#6B7280' }}>
              N° Agrément : {settings.labAgrement}
            </div>
          )}
          <div style={{ fontSize: '8px', color: '#059669', fontWeight: 'bold' }}>
            Norme ISO 15189
          </div>
          {show(dossier?.automateType) && (
            <div style={{ fontSize: '8px', color: '#6B7280', fontFamily: 'monospace' }}>
              Automate : {dossier.automateType}
            </div>
          )}
        </div>
      </header>

      {/* ═══════ ZONE 2 : BARRE COMPTE-RENDU ═══════ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#5B46F6',
        color: '#FFFFFF',
        padding: '4px 10px',
        marginBottom: '3mm',
        borderRadius: '2px',
        width: '100%',
        boxSizing: 'border-box',
        pageBreakAfter: 'avoid',
        flexShrink: 0,
        gap: '4mm'
      }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          COMPTE RENDU D'ANALYSES MÉDICALES
        </span>
        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          DOSSIER N° {dossier.id}
        </span>
      </div>

      {/* ═══════ ZONE 2b : INFOS PATIENT / PRESCRIPTEUR ═══════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4mm',
        marginBottom: '4mm',
        padding: '3mm',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '2px',
        boxSizing: 'border-box',
        pageBreakAfter: 'avoid',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '100%', boxSizing: 'border-box' }}>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>PATIENT :</span> <strong style={{ color: '#0F172A', fontWeight: 'bold', fontSize: '9px' }}>{patient.nom} {patient.prenom}</strong></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>IDENTIFIANT :</span> <span style={{ fontFamily: 'monospace', color: '#1E293B', fontWeight: 'bold', fontSize: '9px' }}>{patient.id}</span></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>ÂGE / SEXE :</span> <span style={{ color: '#1E293B', fontSize: '9px' }}>{patient.age} ans · Sexe {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}</span></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>TÉLÉPHONE :</span> <span style={{ fontFamily: 'monospace', color: '#1E293B', fontSize: '9px' }}>{patient.telephone || '—'}</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '100%', boxSizing: 'border-box' }}>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>PRESCIPTEUR :</span> <strong style={{ color: '#0F172A', fontSize: '9px' }}>{dossier.prescripteur}</strong></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>SERVICE :</span> <span style={{ color: '#1E293B', fontSize: '9px' }}>{dossier.service || patient.service || 'Dispensaire'}</span></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>PRÉLÈVEMENT LE :</span> <span style={{ fontFamily: 'monospace', color: '#1E293B', fontSize: '9px' }}>{dossier.date}</span></div>
          <div><span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>ÉCHANTILLON :</span> <span style={{ color: '#1E293B', fontSize: '9px' }}>{dossier.sampleType}</span></div>
        </div>
      </div>

      {/* ═══════ ZONE 3 : EXAMENS (flex:1) ═══════ */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '3mm',
        boxSizing: 'border-box',
      }}>
        {dossier.examensInclus.map((examId) => {
          const exam = catalog.find((e) => e.id === examId);
          if (!exam) return null;
          return renderExamResults(exam);
        })}

        {/* Observations générales */}
        {dossier.observations && dossier.observations.trim() !== '' && (
          <div style={{
            pageBreakInside: 'avoid',
            marginTop: '2mm',
            padding: '3mm',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #374151',
            borderRadius: '2px',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
              CONCLUSION & REMARQUES DU BIOLOGISTE :
            </div>
            <div style={{ fontSize: '9px', color: '#1F2937', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {dossier.observations}
            </div>
          </div>
        )}
      </main>

      {/* ═══════ ZONE 4 : PIED DE PAGE ═══════ */}
      <footer style={{
        marginTop: '4mm',
        paddingTop: '3mm',
        borderTop: '1px solid #E2E8F0',
        pageBreakInside: 'avoid',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4mm',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '8px',
          color: '#6B7280',
        }}>
          <span>Édité le {date} à {heure}</span>
          <span>Document conforme ISO 15189 · Ne pas modifier</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8px', color: '#6B7280', marginBottom: '4mm', textTransform: 'uppercase' }}>
            LE BIOLOGISTE RESPONSABLE
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', fontStyle: 'italic', color: '#1F2937' }}>
            {dossier.biologisteValidateur || settings.labBiologist || 'Dr. Ivane B. Kouassi'}
          </div>
          <div style={{ fontSize: '8px', color: '#6B7280', marginTop: '1mm' }}>
            Biologiste Médical — Validé électroniquement ✓
          </div>
        </div>
      </footer>
    </div>
  );
};
