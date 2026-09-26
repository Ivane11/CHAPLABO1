import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { Patient, DossierReport, LabSettings, ExamDefinition } from '../../types';
import { interpretElectroHb, interpretWidal } from '../../utils/interpretation';

Font.registerHyphenationCallback((word) => [word]);

interface Props {
  patient: Patient;
  dossier: DossierReport;
  settings: LabSettings;
  exams: ExamDefinition[];
  curveDataUrl?: string;
}

// ──────────────────────────────────────────────
// COULEURS PAR CATÉGORIE
// ──────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'Hématologie': '#DC2626',
  'Biochimie': '#059669',
  'Sérologie': '#CA8A04',
  'Parasitologie': '#EA580C',
  'Hormonologie': '#DB2777',
  'Microbiologie': '#0891B2',
  'Immuno-Hémostase': '#7C3AED',
  'Autre': '#475569',
};

// ──────────────────────────────────────────────
// STYLES PREMIUM
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  // PAGE
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    paddingBottom: 60,
    paddingLeft: 32,
    paddingRight: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1F2937',
  },

  // ── EN-TÊTE LABO ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#5B46F6',
    marginBottom: 12,
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  headerRight: {
    width: 175,
    textAlign: 'right',
    paddingTop: 2,
  },
  labName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#1F2937',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  labCenter: {
    fontSize: 10,
    color: '#5B46F6',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  labInfo: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
    lineHeight: 1.5,
  },
  labInfoMono: {
    fontSize: 8,
    color: '#6B7280',
    fontFamily: 'Courier',
    marginBottom: 2,
    lineHeight: 1.5,
  },
  labAgrement: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  isoBadge: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#059669',
    borderWidth: 0.7,
    borderColor: '#059669',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  automate: {
    fontSize: 7,
    color: '#6B7280',
    fontFamily: 'Courier',
    marginTop: 4,
  },

  // ── BARRE TITRE ──
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5B46F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  titleBarText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleBarId: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },

  // ── PATIENT ──
  patientBlock: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 10,
    marginBottom: 16,
  },
  patientCol: { flex: 1, paddingRight: 10 },
  patientLine: {
    fontSize: 9,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  patientLabel: {
    color: '#6B7280',
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  patientValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
    fontSize: 9,
  },

  // ── BLOC EXAMEN ──
  examBlock: {
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  examHeaderName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    paddingRight: 8,
  },
  examHeaderSample: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  // ── TABLEAU ──
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#FAFBFC',
  },

  // Colonnes (largeurs optimales pour A4)
  colParam: { width: '40%', paddingHorizontal: 4 },
  colResult: { width: '14%', paddingHorizontal: 4, textAlign: 'right' },
  colUnit: { width: '11%', paddingHorizontal: 4, textAlign: 'center' },
  colRef: { width: '19%', paddingHorizontal: 4, textAlign: 'center' },
  colStatus: { width: '16%', paddingHorizontal: 4, textAlign: 'center' },

  cellParam: {
    fontSize: 9,
    color: '#1F2937',
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.4,
  },
  cellParamSub: {
    fontSize: 7,
    color: '#9CA3AF',
    fontFamily: 'Helvetica',
    marginTop: 2,
  },
  cellValue: {
    fontSize: 9,
    color: '#1F2937',
    fontFamily: 'Courier-Bold',
  },
  cellValueHigh: {
    fontSize: 9,
    color: '#991B1B',
    fontFamily: 'Courier-Bold',
  },
  cellValueLow: {
    fontSize: 9,
    color: '#92400E',
    fontFamily: 'Courier-Bold',
  },
  cellValueEmpty: {
    fontSize: 9,
    color: '#D1D5DB',
    fontFamily: 'Courier',
  },
  cellRef: {
    fontSize: 8,
    color: '#6B7280',
    fontFamily: 'Courier',
  },
  cellUnit: {
    fontSize: 8,
    color: '#6B7280',
    fontFamily: 'Courier',
  },

  // Badges
  badgeNormal: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeHigh: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeLow: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeEmpty: {
    fontSize: 7,
    color: '#D1D5DB',
  },

  // ── CONCLUSION PAR EXAMEN ──
  commentBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF9C3',
    borderTopWidth: 0.5,
    borderTopColor: '#FDE68A',
    borderLeftWidth: 3,
    borderLeftColor: '#EAB308',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#854D0E',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  commentText: {
    fontSize: 9,
    color: '#422006',
    lineHeight: 1.6,
    paddingLeft: 2,
  },

  // ── TEXTAREA BLOCK (sous le tableau) ──
  textareaBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  textareaLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  textareaValue: {
    fontSize: 9,
    color: '#1F2937',
    lineHeight: 1.6,
    paddingLeft: 2,
    fontFamily: 'Helvetica',
  },

  // ── OBSERVATIONS GÉNÉRALES ──
  obsBlock: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#374151',
  },
  obsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  obsLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  obsText: {
    fontSize: 8,
    color: '#1F2937',
    lineHeight: 1.6,
    paddingLeft: 2,
  },

  // ── PIED DE PAGE ──
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 28,
    right: 28,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: '#E2E8F0',
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6.5,
    color: '#9CA3AF',
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },
  signature: {
    textAlign: 'right',
    paddingRight: 5,
  },
  signatureLine: {
    width: 100,
    height: 0.5,
    backgroundColor: '#D1D5DB',
    marginLeft: 'auto',
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  signatureValid: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#5B46F6',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  // ── BANDEAU RÉFÉRENCE PATIENT (pages suivantes) ──
  pageRefBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5B46F6',
  },
  pageRefText: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#475569',
  },

  // ── LOGO LABORATOIRE ──
  logoImage: {
    width: 60,
    height: 60,
    objectFit: 'contain',
    marginBottom: 4,
  },

  // ── COURBE ELECTROPHORÈSE ──
  curveBlock: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFBFC',
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
  },
  curveLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  curveImage: {
    width: '100%',
    height: 130,
    objectFit: 'contain',
  },
});

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

const getEffectiveRef = (param: any, patient: Patient) => {
  const isChild = patient.age < 15;
  const isFemale = patient.sexe === 'F';

  if (param.ageReferences && param.ageReferences.length > 0) {
    const match = param.ageReferences.find((ar: any) => {
      const ageOk =
        (ar.minAge === undefined || patient.age >= ar.minAge) &&
        (ar.maxAge === undefined || patient.age <= ar.maxAge);
      const sexOk = !ar.sex || ar.sex === patient.sexe;
      return ageOk && sexOk;
    });
    if (match) return match;
  }
  return isChild && param.childRef ? param.childRef
    : isFemale && param.femaleRef ? param.femaleRef
      : !isFemale && param.maleRef ? param.maleRef
        : param.reference;
};

const formatRef = (param: any, patient: Patient): string => {
  const ref = getEffectiveRef(param, patient);
  if (!ref) return '—';
  if (ref.min !== undefined && ref.max !== undefined)
    return `${ref.min} – ${ref.max}`;
  if (ref.expected) return ref.expected;
  if (ref.text) return ref.text;
  return '—';
};

const evalValue = (val: any, param: any, patient: Patient) => {
  const empty = {
    label: '',
    style: null,
    valueStyle: styles.cellValueEmpty,
  };
  if (val === '' || val === undefined || val === null) return empty;

  // ═══ CAS SPÉCIAL : WIDAL & FELIX ═══
  if (param.id.startsWith('WIDAL_') || param.id.startsWith('FELIX_')) {
    const s = String(val).toLowerCase();
    if (s.includes('négatif') || s.includes('negatif') || s === '') {
      return { label: 'NÉGATIF', style: { ...styles.badgeNormal, backgroundColor: '#D1FAE5', color: '#065F46' }, valueStyle: styles.cellValue };
    }
    if (s.includes('douteux') || s.includes('1/80')) {
      return { label: 'DOUTEUX', style: { ...styles.badgeHigh, backgroundColor: '#FEF3C7', color: '#92400E' }, valueStyle: styles.cellValueHigh };
    }
    if (s.includes('1/160')) {
      return { label: 'POSITIF FAIBLE', style: { ...styles.badgeHigh, backgroundColor: '#FED7AA', color: '#9A3412' }, valueStyle: styles.cellValueHigh };
    }
    if (s.includes('1/320')) {
      return { label: 'POSITIF', style: { ...styles.badgeHigh, backgroundColor: '#FECACA', color: '#991B1B' }, valueStyle: styles.cellValueHigh };
    }
    if (s.includes('1/640')) {
      return { label: 'POSITIF FORT', style: { ...styles.badgeHigh, backgroundColor: '#FECACA', color: '#7F1D1D' }, valueStyle: styles.cellValueHigh };
    }
    if (s.includes('1/1280')) {
      return { label: 'TRÈS POSITIF', style: { ...styles.badgeHigh, backgroundColor: '#FCA5A5', color: '#7F1D1D' }, valueStyle: styles.cellValueHigh };
    }
    if (s.includes('1/2560')) {
      return { label: 'POSITIF MAJEUR', style: { ...styles.badgeHigh, backgroundColor: '#FCA5A5', color: '#450A0A' }, valueStyle: styles.cellValueHigh };
    }
    return empty;
  }

  if (param.type !== 'number') {
    return {
      label: 'NORMAL',
      style: styles.badgeNormal,
      valueStyle: styles.cellValue,
    };
  }

  const num = parseFloat(String(val));
  if (isNaN(num)) return empty;

  const ref = getEffectiveRef(param, patient);
  if (!ref || (ref.min === undefined && ref.max === undefined)) {
    return {
      label: 'NORMAL',
      style: styles.badgeNormal,
      valueStyle: styles.cellValue,
    };
  }
  if (ref.min !== undefined && num < ref.min) {
    return {
      label: 'BAS',
      style: styles.badgeLow,
      valueStyle: styles.cellValueLow,
    };
  }
  if (ref.max !== undefined && num > ref.max) {
    return {
      label: 'ÉLEVÉ',
      style: styles.badgeHigh,
      valueStyle: styles.cellValueHigh,
    };
  }
  return {
    label: 'NORMAL',
    style: styles.badgeNormal,
    valueStyle: styles.cellValue,
  };
};

// ──────────────────────────────────────────────
// COMPOSANT
// ──────────────────────────────────────────────
export const ReportPDF: React.FC<Props> = ({
  patient,
  dossier,
  settings,
  exams,
  curveDataUrl,
}) => {
  const dateEdition = new Date().toLocaleDateString('fr-FR');
  const heureEdition = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // ─── Helpers réutilisables ───────────────────────────────────────
  const renderLabHeader = () => (
    <View style={styles.header} fixed>
      <View style={styles.headerLeft}>
        {/* Logo du laboratoire */}
        {settings.logoUrl && settings.logoUrl.startsWith('data:image') ? (
          <Image
            src={settings.logoUrl}
            style={styles.logoImage}
            cache={false}
          />
        ) : null}
        {settings.labName ? <Text style={styles.labName}>{settings.labName}</Text> : null}
        {settings.labCenter ? <Text style={styles.labCenter}>{settings.labCenter}</Text> : null}
        {settings.labAddress ? <Text style={styles.labInfo}>{settings.labAddress}</Text> : null}
        <Text style={styles.labInfoMono}>
          {[
            settings.labPhone ? `Tél: ${settings.labPhone}` : '',
            settings.labEmail ? `Email: ${settings.labEmail}` : '',
          ].filter(Boolean).join(' · ')}
        </Text>
        {settings.labWebsite ? <Text style={styles.labInfoMono}>{settings.labWebsite}</Text> : null}
      </View>
      <View style={styles.headerRight}>
        {settings.labAgrement ? (
          <Text style={styles.labAgrement}>N° Agrément : {settings.labAgrement}</Text>
        ) : null}
        {/* Removed isoBadge and automate mentions per user request */}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer} fixed>
      <View style={styles.footerTop}>
        <Text>Édité le {dateEdition} à {heureEdition}</Text>
        <Text>Document confidentiel · Ne pas modifier</Text>
      </View>
      <View style={styles.signature}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>LE BIOLOGISTE RESPONSABLE</Text>

      </View>
    </View>
  );

  const renderExamContent = (exam: ExamDefinition) => {
    const headerColor = CATEGORY_COLORS[exam.category] || '#475569';
    const allParams = exam.sections.flatMap((s) => s.parameters);
    const tableParams = allParams.filter((p) => p.type !== 'textarea');
    const textParams = allParams.filter((p) => p.type === 'textarea');
    const comment = String(dossier.resultats[`COMMENT_${exam.id}`] || '');

    return (
      <View key={exam.id} style={styles.examBlock} wrap={!exam.id.includes('NFS')}>
        {/* En-tête coloré */}
        <View style={[styles.examHeader, { backgroundColor: headerColor }]}>
          <Text style={styles.examHeaderName}>{exam.name}</Text>
          <Text style={styles.examHeaderSample}>
            {dossier.examAutomates?.[exam.id] ? `${dossier.examAutomates[exam.id]} · ` : ''}
            {exam.sampleTypeDefault}
          </Text>
        </View>

        {/* Tableau */}
        {tableParams.length > 0 && (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colParam]}>Paramètre analysé</Text>
              <Text style={[styles.tableHeaderCell, styles.colResult]}>Résultat</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unité</Text>
              <Text style={[styles.tableHeaderCell, styles.colRef]}>Intervalle</Text>
              <Text style={[styles.tableHeaderCell, styles.colStatus]}>Interprétation</Text>
            </View>
            {tableParams.map((param, idx) => {
              const val = dossier.resultats[param.id] ?? '';
              const refStr = formatRef(param, patient);
              const ev = evalValue(val, param, patient);
              const isEmpty = val === '' || val === undefined || val === null;
              return (
                <View key={param.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.cellParam, styles.colParam]}>{param.name}</Text>
                  <Text style={[ev.valueStyle, styles.colResult]}>{isEmpty ? '—' : String(val)}</Text>
                  <Text style={[styles.cellUnit, styles.colUnit]}>{param.unit || '—'}</Text>
                  <Text style={[styles.cellRef, styles.colRef]}>{refStr}</Text>
                  <View style={styles.colStatus}>
                    {ev.style ? (
                      <Text style={ev.style}>{ev.label}</Text>
                    ) : (
                      <Text style={styles.badgeEmpty}>—</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Interprétation Widal */}
        {exam.id.includes('WIDAL') && (() => {
          const interp = interpretWidal(dossier.resultats);
          if (!interp) return null;
          const colors = {
            'NORMAL':    { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
            'ATTENTION': { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
            'ANORMAL':   { bg: '#FED7AA', text: '#9A3412', border: '#EA580C' },
            'URGENT':    { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' },
          };
          const c = colors[interp.level as keyof typeof colors] || colors['NORMAL'];
          return (
            <View
              style={{
                marginTop: 8,
                padding: 6,
                backgroundColor: c.bg,
                borderLeftWidth: 4,
                borderLeftColor: c.border,
                borderRadius: 2,
              }}
            >
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: c.text, marginBottom: 3 }}>
                {interp.conclusion}
              </Text>
              <Text style={{ fontSize: 8, color: c.text, marginBottom: 2 }}>{interp.details}</Text>
              {interp.conseil && (
                <Text style={{ fontSize: 8, color: c.text, fontFamily: 'Helvetica-Oblique' }}>
                  {interp.conseil}
                </Text>
              )}
            </View>
          );
        })()}

        {/* Paramètres textes longs */}
        {textParams.map((param) => {
          const val = dossier.resultats[param.id] ?? '';
          if (!val) return null;
          return (
            <View key={param.id} style={styles.textareaBlock}>
              <Text style={styles.textareaLabel}>{param.name} :</Text>
              <Text style={styles.textareaValue}>{String(val)}</Text>
            </View>
          );
        })}

        {/* Conclusion */}
        {comment.trim() ? (
          <View style={styles.commentBlock}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentLabel}>CONCLUSION &amp;amp; REMARQUES DU BIOLOGISTE</Text>
            </View>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        ) : null}

        {/* Courbe électrophorèse (uniquement si examen ELECTRO et courbe capturée) */}
        {exam.id.includes('ELECTRO') && curveDataUrl ? (
          <View style={styles.curveBlock}>
            <Text style={styles.curveLabel}>Courbe d'électrophorèse — Profil hémoglobinique</Text>
            <Image src={curveDataUrl} style={styles.curveImage} />
          </View>
        ) : null}

        {/* Interprétation électrophorèse */}
        {exam.id.includes('ELECTRO') && (() => {
          const profilStr = String(dossier.resultats['ELEC_PROFIL'] || 'AUTRE');
          if (profilStr === 'AUTRE' || profilStr === '') return null;
          const interp = interpretElectroHb(profilStr, {
            age: patient.age || 30,
            sexe: patient.sexe as 'M'|'F' || 'M'
          });
          return (
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
              backgroundColor: interp.level === 'URGENT' ? '#FEF2F2' : '#FFF7ED',
              borderLeftWidth: 3,
              borderLeftColor: interp.level === 'URGENT' ? '#DC2626' : '#EA580C',
              marginTop: 4,
            }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#991B1B', textTransform: 'uppercase' }}>
                🔬 Interprétation électrophorèse
              </Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#1F2937', marginTop: 2 }}>
                {interp.nomClinique}
              </Text>
              <Text style={{ fontSize: 7, color: '#4B5563', marginTop: 2 }}>
                {interp.details}
              </Text>

              {interp.conseil && (
                <Text style={{ fontSize: 7, color: '#374151', marginTop: 3, lineHeight: 1.4 }}>
                  💡 {interp.conseil}
                </Text>
              )}

              {interp.conseilFamilial && (
                <View style={{
                  marginTop: 4, padding: 4,
                  backgroundColor: '#FEE2E2',
                  borderLeftWidth: 2,
                  borderLeftColor: '#DC2626',
                }}>
                  <Text style={{ fontSize: 7, color: '#991B1B', fontFamily: 'Helvetica-Bold' }}>
                    {interp.conseilFamilial}
                  </Text>
                </View>
              )}
            </View>
          );
        })()}
      </View>
    );
  };

  const examGroups: ExamDefinition[][] = [];
  let currentGroup: ExamDefinition[] = [];

  exams.forEach((exam) => {
    // Les gros examens qui nécessitent d'être isolés
    const isBig = exam.id.includes('ELECTRO') || exam.id.includes('NFS') || exam.id.includes('WIDAL');
    
    if (isBig) {
      if (currentGroup.length > 0) {
        examGroups.push(currentGroup);
        currentGroup = [];
      }
      examGroups.push([exam]);
    } else {
      currentGroup.push(exam);
    }
  });
  
  if (currentGroup.length > 0) {
    examGroups.push(currentGroup);
  }

  return (
    <Document>
      {examGroups.map((group, groupIdx) => (
        <Page key={`group-${groupIdx}`} size="A4" style={styles.page} wrap>
          {renderLabHeader()}

          {groupIdx === 0 ? (
            <>
              {/* Barre titre */}
              <View style={styles.titleBar}>
                <Text style={styles.titleBarText}>COMPTE RENDU D'ANALYSES MÉDICALES</Text>
                <Text style={styles.titleBarId}>DOSSIER N° {dossier.id}</Text>
              </View>

              {/* Patient */}
              <View style={styles.patientBlock}>
                <View style={styles.patientCol}>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>PATIENT : </Text>
                    <Text style={styles.patientValue}>{patient.nom} {patient.prenom}</Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>IDENTIFIANT : </Text>
                    <Text style={styles.patientValue}>{patient.id}</Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>ÂGE / SEXE : </Text>
                    <Text style={styles.patientValue}>
                      {patient.age} ans · {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}
                    </Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>TÉLÉPHONE : </Text>
                    <Text style={styles.patientValue}>{patient.telephone}</Text>
                  </Text>
                </View>
                <View style={styles.patientCol}>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>PRESCRIPTEUR : </Text>
                    <Text style={styles.patientValue}>{dossier.prescripteur}</Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>SERVICE : </Text>
                    <Text style={styles.patientValue}>{dossier.service}</Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>PRÉLÈVEMENT LE : </Text>
                    <Text style={styles.patientValue}>{dossier.date}</Text>
                  </Text>
                  <Text style={styles.patientLine}>
                    <Text style={styles.patientLabel}>ÉCHANTILLON : </Text>
                    <Text style={styles.patientValue}>{dossier.sampleType}</Text>
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.pageRefBar}>
              <Text style={styles.pageRefText}>
                Patient : {patient.nom} {patient.prenom} · {patient.age} ans · {patient.sexe === 'F' ? 'F' : 'M'}
              </Text>
              <Text style={styles.pageRefText}>Dossier N° {dossier.id} · {dossier.date}</Text>
            </View>
          )}

          {/* Rendu des examens du groupe */}
          {group.map((exam) => (
            <React.Fragment key={exam.id}>
              {renderExamContent(exam)}
            </React.Fragment>
          ))}

          {renderFooter()}
        </Page>
      ))}

      {/* ══════════════════════════════════════════
          PAGE FINALE : Observations générales (si remplies)
      ══════════════════════════════════════════ */}
      {dossier.observations && dossier.observations.trim() ? (
        <Page size="A4" style={styles.page}>
          {renderLabHeader()}
          <View style={styles.pageRefBar}>
            <Text style={styles.pageRefText}>
              Patient : {patient.nom} {patient.prenom} · Dossier N° {dossier.id}
            </Text>
          </View>
          <View style={styles.obsBlock}>
            <View style={styles.obsHeader}>
              <Text style={styles.obsLabel}>OBSERVATIONS GÉNÉRALES DU DOSSIER</Text>
            </View>
            <Text style={styles.obsText}>{dossier.observations}</Text>
          </View>
          {renderFooter()}
        </Page>
      ) : null}
    </Document>
  );
};