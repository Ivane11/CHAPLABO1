import { DossierReport, Patient } from '../types';

export const generatePatientId = (patients: Patient[]): string => {
  const currentYear = new Date().getFullYear();
  const prefix = `CHP-${currentYear}-`;
  
  let maxSeq = 0;
  for (const patient of patients) {
    if (patient.id.startsWith(prefix)) {
      const seqStr = patient.id.replace(prefix, '');
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(5, '0');
  return `${prefix}${nextSeq}`;
};

export const generateDossierId = (dossiers: DossierReport[]): string => {
  const today = new Date();
  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  const dateStr = `${yy}${mm}${dd}`; // e.g. 260925
  const prefix = `DOS-${dateStr}-`; // e.g. DOS-260925-
  
  let maxSeq = 0;
  for (const dossier of dossiers) {
    if (dossier.id.startsWith(prefix)) {
      const seqStr = dossier.id.replace(prefix, '');
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    } else if (dossier.id.startsWith(`RPT-${dateStr}-`)) {
      // Fallback for old prefix if needed
      const seqStr = dossier.id.replace(`RPT-${dateStr}-`, '');
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${prefix}${nextSeq}`; // e.g. DOS-260925-001
};
