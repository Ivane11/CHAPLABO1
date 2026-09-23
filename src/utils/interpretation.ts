import { ExamParameter, Patient, ReferenceRange } from '../types';

export function getEffectiveReference(
  param: ExamParameter,
  patient: Patient
): ReferenceRange | undefined {
  if (patient.age < 15 && param.childRef) {
    return param.childRef;
  }
  if (patient.sexe === 'F' && param.femaleRef) {
    return param.femaleRef;
  }
  if (patient.sexe === 'M' && param.maleRef) {
    return param.maleRef;
  }
  return param.reference;
}

export type ValueStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'UNDEFINED';

export function evaluateParameterValue(
  value: string | number | undefined,
  param: ExamParameter,
  patient: Patient
): { status: ValueStatus; label: string; color: string } {
  if (value === undefined || value === '' || value === null) {
    return { status: 'UNDEFINED', label: 'Non dosé', color: 'text-slate-400' };
  }

  // Text/Select type matching
  if (param.type === 'select' || param.type === 'text') {
    const strVal = String(value).trim().toLowerCase();
    const expected = param.reference?.expected?.toLowerCase();

    if (strVal === 'positif' || strVal === 'positive' || strVal === 'réactif') {
      return { status: 'HIGH', label: 'Positif', color: 'text-red-600 font-bold' };
    }
    if (strVal === 'négatif' || strVal === 'négative' || strVal === 'non-réactif') {
      return { status: 'NORMAL', label: 'Négatif', color: 'text-emerald-600 font-medium' };
    }
    if (expected && strVal !== expected) {
      return { status: 'CRITICAL', label: String(value), color: 'text-amber-600 font-semibold' };
    }
    return { status: 'NORMAL', label: String(value), color: 'text-slate-700' };
  }

  // Number evaluation
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  if (isNaN(num)) {
    return { status: 'NORMAL', label: String(value), color: 'text-slate-700' };
  }

  const ref = getEffectiveReference(param, patient);
  if (!ref || (ref.min === undefined && ref.max === undefined)) {
    return { status: 'NORMAL', label: String(value), color: 'text-slate-700' };
  }

  const { min, max } = ref;

  if (min !== undefined && num < min) {
    // Critical Low check
    const isCritical = min !== 0 && num < min * 0.65;
    return {
      status: isCritical ? 'CRITICAL' : 'LOW',
      label: 'Bas',
      color: isCritical ? 'text-red-700 bg-red-50 font-bold px-1.5 py-0.5 rounded' : 'text-amber-600 font-semibold',
    };
  }

  if (max !== undefined && num > max) {
    const isCritical = num > max * 1.5;
    return {
      status: isCritical ? 'CRITICAL' : 'HIGH',
      label: 'Élevé',
      color: isCritical ? 'text-red-700 bg-red-50 font-bold px-1.5 py-0.5 rounded' : 'text-red-600 font-semibold',
    };
  }

  return {
    status: 'NORMAL',
    label: 'Normal',
    color: 'text-emerald-600 font-medium',
  };
}

/**
 * Expert clinical reasoning for Hemogram / NFS (Numération Formule Sanguine)
 */
export function interpretHematologyNFS(
  results: Record<string, string | number>,
  patient: Patient
): { summary: string; items: string[]; alertLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL' } {
  const items: string[] = [];

  const getNum = (key: string): number | null => {
    const v = results[key];
    if (v === undefined || v === '') return null;
    const parsed = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return isNaN(parsed) ? null : parsed;
  };

  const hb = getNum('NFS_HGB');
  const wbc = getNum('NFS_WBC');
  const plt = getNum('NFS_PLT');
  const vgm = getNum('NFS_MCV');
  const ccmh = getNum('NFS_MCHC');
  const tcmh = getNum('NFS_MCH');
  const neutAbs = getNum('NFS_NEUT_ABS') ?? (getNum('NFS_NEUT_PCT') && wbc ? (getNum('NFS_NEUT_PCT')! * wbc) / 100 : null);
  const lymAbs = getNum('NFS_LYM_ABS') ?? (getNum('NFS_LYM_PCT') && wbc ? (getNum('NFS_LYM_PCT')! * wbc) / 100 : null);
  const eosAbs = getNum('NFS_EOS_ABS') ?? (getNum('NFS_EOS_PCT') && wbc ? (getNum('NFS_EOS_PCT')! * wbc) / 100 : null);

  const hbMin = patient.age < 15 ? 11.5 : patient.sexe === 'F' ? 12.0 : 13.0;
  const hbMax = patient.age < 15 ? 14.5 : patient.sexe === 'F' ? 16.0 : 17.5;

  let alertLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL' = 'NOMINAL';

  // 1. Red blood cells / Hemoglobin
  if (hb !== null) {
    if (hb < 7.0) {
      alertLevel = 'CRITICAL';
      items.push(`Anémie sévère (${hb.toFixed(1)} g/dL) — Surveillance transfusionnelle requise`);
    } else if (hb < hbMin) {
      alertLevel = 'WARNING';
      let desc = 'Anémie ';
      if (vgm !== null) {
        if (vgm < 80) desc += 'microcytaire ';
        else if (vgm > 100) desc += 'macrocytaire ';
        else desc += 'normocytaire ';
      }
      if (tcmh !== null || ccmh !== null) {
        const isHypo = (tcmh !== null && tcmh < 27) || (ccmh !== null && ccmh < 32);
        desc += isHypo ? 'hypochrome' : 'normochrome';
      }
      items.push(desc.trim() + ` (${hb.toFixed(1)} g/dL)`);
    } else if (hb > hbMax) {
      items.push(`Polyglobulie suspectée (Hb élevée à ${hb.toFixed(1)} g/dL)`);
    }
  }

  // 2. White blood cells / Leucocytes
  if (wbc !== null) {
    if (wbc > 10.0) {
      if (alertLevel !== 'CRITICAL') alertLevel = 'WARNING';
      items.push(`Hyperleucocytose (${wbc.toFixed(2)} G/L)`);
    } else if (wbc < 4.0) {
      if (alertLevel !== 'CRITICAL') alertLevel = 'WARNING';
      items.push(`Leucopénie (${wbc.toFixed(2)} G/L)`);
    }
  }

  // 3. Formula Leucocytaire
  if (neutAbs !== null) {
    if (neutAbs > 7.5) items.push(`Neutrophilie (${neutAbs.toFixed(2)} G/L)`);
    else if (neutAbs < 1.5) {
      if (neutAbs < 0.5) alertLevel = 'CRITICAL';
      items.push(`Agranulocytose/Neutropénie (${neutAbs.toFixed(2)} G/L)`);
    }
  }

  if (lymAbs !== null) {
    if (lymAbs > 4.0) items.push(`Lymphocytose (${lymAbs.toFixed(2)} G/L)`);
    else if (lymAbs < 1.0) items.push(`Lymphopénie (${lymAbs.toFixed(2)} G/L)`);
  }

  if (eosAbs !== null && eosAbs > 0.5) {
    items.push(`Hyperéosinophilie (${eosAbs.toFixed(2)} G/L)`);
  }

  // 4. Platelets / Plaquettes
  if (plt !== null) {
    if (plt < 50) {
      alertLevel = 'CRITICAL';
      items.push(`Thrombopénie sévère (${plt} G/L) — Risque hémorragique`);
    } else if (plt < 150) {
      if (alertLevel !== 'CRITICAL') alertLevel = 'WARNING';
      items.push(`Thrombopénie modérée (${plt} G/L)`);
    } else if (plt > 450) {
      items.push(`Thrombocytose (${plt} G/L)`);
    }
  }

  if (items.length === 0) {
    return {
      summary: 'Hémogramme dans les limites des valeurs de référence habituelles.',
      items: ['Absence d’anomalie cytologique quantitative.'],
      alertLevel: 'NOMINAL',
    };
  }

  return {
    summary: items.join(' · '),
    items,
    alertLevel,
  };
}
