import { ExamParameter, Patient, ReferenceRange } from '../types';

export function getEffectiveReference(
  param: ExamParameter,
  patient: Patient,
  examId?: string,
  values?: Record<string, any>
): ReferenceRange | undefined {
  // CAS SPÉCIAL : Électrophorèse Hb
  if (examId && examId.includes('ELECTRO') && param.ageReferences) {
    // Tenter de récupérer la valeur depuis values (pour ResultGrid)
    // ou depuis window.__ELEC_PROFIL__ en fallback / solution temporaire
    let profilValue = 'AA';
    if (values && values['ELEC_PROFIL']) {
      profilValue = String(values['ELEC_PROFIL']);
    } else if (typeof window !== 'undefined' && (window as any).__ELEC_PROFIL__) {
      profilValue = String((window as any).__ELEC_PROFIL__);
    }

    // Extraction du préfixe profil au cas où la valeur est longue ex: "SS (Drépanocytose)"
    let normalizedProfil = profilValue;
    if (profilValue.startsWith('AA')) normalizedProfil = 'AA';
    else if (profilValue.startsWith('AS')) normalizedProfil = 'AS';
    else if (profilValue.startsWith('SS')) normalizedProfil = 'SS';
    else if (profilValue.startsWith('SC')) normalizedProfil = 'SC';
    else if (profilValue.startsWith('AC')) normalizedProfil = 'AC';
    else if (profilValue.startsWith('CC')) normalizedProfil = 'CC';
    else if (profilValue.toUpperCase().includes('THAL')) normalizedProfil = 'BETA-THAL';

    const PROFIL_TO_CODE: Record<string, number> = {
      'AA': 0, 'AS': 1, 'SS': 2, 'AC': 3,
      'SC': 4, 'CC': 5, 'BETA-THAL': 6,
    };
    const code = PROFIL_TO_CODE[normalizedProfil] ?? 0;
    
    const match = param.ageReferences.find(ar =>
      ar.minAge === code && ar.maxAge === code
    );
    if (match) return match;
  }

  // 1. Priorité : ageReferences (le plus précis)
  if (param.ageReferences && param.ageReferences.length > 0) {
    const match = param.ageReferences.find((ar) => {
      const ageOk =
        (ar.minAge === undefined || patient.age >= ar.minAge) &&
        (ar.maxAge === undefined || patient.age <= ar.maxAge);
      const sexOk = !ar.sex || ar.sex === patient.sexe;
      return ageOk && sexOk;
    });
    if (match) return match;
  }

  // 2. Fallback : anciens champs
  const isChild = patient.age < 15;
  const isFemale = patient.sexe === 'F';
  if (isChild && param.childRef) return param.childRef;
  if (isFemale && param.femaleRef) return param.femaleRef;
  if (!isFemale && param.maleRef) return param.maleRef;
  return param.reference;
}

export type ValueStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'UNDEFINED';

export function evaluateParameterValue(
  value: string | number | undefined,
  param: ExamParameter,
  patient: Patient,
  examId?: string,
  values?: Record<string, any>
): { status: ValueStatus; label: string; color: string } {
  if (value === undefined || value === '' || value === null) {
    return { status: 'UNDEFINED', label: 'Non dosé', color: 'text-slate-400' };
  }

  // ═══ CAS SPÉCIAL : WIDAL & FELIX ═══
  if (param.id.startsWith('WIDAL_') || param.id.startsWith('FELIX_')) {
    const s = String(value).toLowerCase();
    if (s.includes('négatif') || s.includes('negatif') || s === '') {
      return { status: 'NORMAL', label: 'NÉGATIF', color: 'bg-[#D1FAE5] text-[#065F46]' };
    }
    if (s.includes('douteux') || s.includes('1/80')) {
      return { status: 'HIGH', label: 'DOUTEUX', color: 'bg-[#FEF3C7] text-[#92400E]' };
    }
    if (s.includes('1/160')) {
      return { status: 'HIGH', label: 'POSITIF FAIBLE', color: 'bg-[#FED7AA] text-[#9A3412]' };
    }
    if (s.includes('1/320')) {
      return { status: 'HIGH', label: 'POSITIF', color: 'bg-[#FECACA] text-[#991B1B]' };
    }
    if (s.includes('1/640')) {
      return { status: 'CRITICAL', label: 'POSITIF FORT', color: 'bg-[#FECACA] text-[#7F1D1D]' };
    }
    if (s.includes('1/1280')) {
      return { status: 'CRITICAL', label: 'TRÈS POSITIF', color: 'bg-[#FCA5A5] text-[#7F1D1D]' };
    }
    if (s.includes('1/2560')) {
      return { status: 'CRITICAL', label: 'POSITIF MAJEUR', color: 'bg-[#FCA5A5] text-[#450A0A]' };
    }
    return { status: 'NORMAL', label: '', color: '' };
  }

  // Text/Select type matching
  if (param.type === 'select' || param.type === 'text') {
    const strVal = String(value).trim().toLowerCase();
    const expected = param.reference?.expected?.toLowerCase();

    if (strVal === 'positif' || strVal === 'positive' || strVal === 'réactif') {
      return { status: 'HIGH', label: 'Positif', color: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]/50' };
    }
    if (strVal === 'négatif' || strVal === 'négative' || strVal === 'non-réactif') {
      return { status: 'NORMAL', label: 'Négatif', color: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50' };
    }
    if (expected && strVal !== expected) {
      return { status: 'CRITICAL', label: String(value), color: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]/50' };
    }
    return { status: 'NORMAL', label: 'NORMAL', color: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50' };
  }

  // Number evaluation
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  if (isNaN(num)) {
    return { status: 'NORMAL', label: String(value), color: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50' };
  }

  const ref = getEffectiveReference(param, patient, examId, values);
  if (!ref || (ref.min === undefined && ref.max === undefined)) {
    return { status: 'NORMAL', label: String(value), color: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50' };
  }

  const { min, max } = ref;

  if (min !== undefined && num < min) {
    // Critical Low check
    const isCritical = min !== 0 && num < min * 0.65;
    return {
      status: isCritical ? 'CRITICAL' : 'LOW',
      label: 'Bas',
      color: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]/50',
    };
  }

  if (max !== undefined && num > max) {
    const isCritical = num > max * 1.5;
    return {
      status: isCritical ? 'CRITICAL' : 'HIGH',
      label: 'Élevé',
      color: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]/50',
    };
  }

  return {
    status: 'NORMAL',
    label: 'Normal',
    color: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50',
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

export interface ElectroInterpretation {
  level: 'NORMAL' | 'ATTENTION' | 'ANORMAL' | 'URGENT';
  profil: string;
  nomClinique: string;
  conclusion: string;
  details: string;
  conseil?: string;
  conseilFamilial?: string;
}

export function interpretElectroHb(
  profil: string,
  patient: { age: number; sexe: 'M' | 'F' }
): ElectroInterpretation {
  const P = profil.toUpperCase().trim();

  const PROFILS: Record<string, ElectroInterpretation> = {
    'AA': {
      level: 'NORMAL',
      profil: 'AA',
      nomClinique: 'Profil hémoglobinique normal',
      conclusion: 'Aucune hémoglobinopathie détectée',
      details: 'HbA1 majoritaire, HbA2 et HbF en proportions normales. '
             + 'Aucune Hb anormale (S, C, D, E).',
      conseil: 'Aucun suivi particulier nécessaire.',
    },
    'AS': {
      level: 'ATTENTION',
      profil: 'AS',
      nomClinique: 'Trait drépanocytaire (porteur sain)',
      conclusion: 'Porteur hétérozygote du gène de la drépanocytose',
      details: 'HbA1 (50-60%) et HbS (35-45%) présentes. '
             + 'Pas de maladie, mais risque de transmission à la descendance.',
      conseil: 'Aucun traitement nécessaire. Éviter les efforts extrêmes '
             + 'en altitude ou en plongée. Hydratation correcte recommandée.',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE INDISPENSABLE : '
             + 'Si le conjoint est également AS, le risque est de '
             + '25% d\'enfant SS (malade), 50% AS (porteur), 25% AA (sain). '
             + 'Dépistage du conjoint vivement recommandé.',
    },
    'SS': {
      level: 'URGENT',
      profil: 'SS',
      nomClinique: 'Drépanocytose homozygote (majeure)',
      conclusion: 'Drépanocytose majeure confirmée',
      details: 'HbS largement majoritaire (>80%), HbF variable, HbA absente. '
             + 'Maladie génétique grave avec anémie hémolytique chronique, '
             + 'crises vaso-occlusives, risque infectieux élevé.',
      conseil: 'SUIVI HÉMATOLOGIQUE SPÉCIALISÉ À VIE :\n'
             + '• Vaccinations renforcées (pneumocoque, méningocoque, '
             + 'Haemophilus, hépatites)\n'
             + '• Acide folique quotidien\n'
             + '• Hydratation abondante (3L/j)\n'
             + '• Éviter : altitude >1500m, froid, efforts intenses, '
             + 'déshydratation\n'
             + '• Consultation en urgence si fièvre >38.5°C ou douleur '
             + 'thoracique\n'
             + '• Traitement par hydroxyurée à discuter selon sévérité',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE INDISPENSABLE : '
             + 'Les deux parents sont porteurs (AS). '
             + 'Risque de 25% à chaque grossesse. '
             + 'Dépistage de la fratrie OBLIGATOIRE.',
    },
    'AC': {
      level: 'ATTENTION',
      profil: 'AC',
      nomClinique: 'Trait HbC (porteur sain)',
      conclusion: 'Porteur hétérozygote du gène HbC',
      details: 'HbA1 (50-60%) et HbC (35-45%) présentes. '
             + 'Pas de maladie, mais risque de transmission.',
      conseil: 'Aucun traitement nécessaire. Suivi standard.',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE : '
             + 'Si le conjoint est porteur (AS ou AC), risque d\'enfant '
             + 'SC (drépanocytose modérée) ou CC (maladie HbC). '
             + 'Dépistage du conjoint recommandé.',
    },
    'SC': {
      level: 'ANORMAL',
      profil: 'SC',
      nomClinique: 'Drépanocytose SC (double hétérozygote)',
      conclusion: 'Drépanocytose de forme modérée (SC)',
      details: 'HbS (~50%) et HbC (~50%). Forme moins sévère que SS '
             + 'mais avec complications possibles : crises vaso-occlusives, '
             + 'rétinopathie, priapisme, nécrose osseuse.',
      conseil: 'SUIVI HÉMATOLOGIQUE RÉGULIER :\n'
             + '• Vaccinations renforcées\n'
             + '• Hydratation abondante\n'
             + '• Examen ophtalmologique annuel\n'
             + '• Éviter les facteurs déclenchants (froid, altitude, effort)',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE INDISPENSABLE : '
             + 'Les deux parents sont porteurs (AS et AC). '
             + 'Risque de 25% à chaque grossesse.',
    },
    'CC': {
      level: 'ANORMAL',
      profil: 'CC',
      nomClinique: 'Maladie HbC homozygote',
      conclusion: 'Maladie HbC (anémie hémolytique modérée)',
      details: 'HbC majoritaire (>90%). Anémie hémolytique chronique '
             + 'modérée, splénomégalie possible, cristaux HbC dans les '
             + 'globules rouges.',
      conseil: 'SUIVI HÉMATOLOGIQUE RÉGULIER :\n'
             + '• Acide folique\n'
             + '• Surveillance de la rate\n'
             + '• Bilan hépatique périodique',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE : '
             + 'Les deux parents sont porteurs du gène HbC (AC).',
    },
    'BETA-THAL': {
      level: 'ANORMAL',
      profil: 'BETA-THAL',
      nomClinique: 'Bêta-thalassémie',
      conclusion: 'Anémie hémolytique héréditaire (bêta-thalassémie)',
      details: 'Augmentation de HbA2 (>4%) et/ou HbF. '
             + 'Forme mineure (trait) ou majeure (maladie) selon '
             + 'l\'homozygotie. Anémie microcytaire hypochrome.',
      conseil: 'SUIVI HÉMATOLOGIQUE :\n'
             + '• Dosage ferritine (éliminer carence martiale)\n'
             + '• Acide folique si anémie\n'
             + '• Forme majeure : transfusions régulières, '
             + 'chélation du fer, greffe de moelle à discuter',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE INDISPENSABLE : '
             + 'Si les deux parents sont porteurs (bêta-thal mineure), '
             + 'risque de 25% d\'enfant thalassémique majeur.',
    },
    'S-BETA': {
      level: 'URGENT',
      profil: 'S-BETA',
      nomClinique: 'Drépanocytose S/bêta-thalassémie',
      conclusion: 'Association S + bêta-thalassémie (forme sévère)',
      details: 'HbS majoritaire avec HbA2 augmentée. '
             + 'Tableau clinique proche de la drépanocytose SS.',
      conseil: 'SUIVI HÉMATOLOGIQUE SPÉCIALISÉ À VIE '
             + '(même protocole que SS).',
      conseilFamilial: '⚠️ CONSEIL GÉNÉTIQUE : '
             + 'Un parent AS, l\'autre bêta-thal mineur.',
    },
    'HPFH': {
      level: 'ATTENTION',
      profil: 'HPFH',
      nomClinique: 'Persistance héréditaire de l\'HbF',
      conclusion: 'Persistance de l\'HbF (généralement bénigne)',
      details: 'HbF élevée de façon isolée, HbA2 normale. '
             + 'Généralement asymptomatique.',
      conseil: 'Aucun suivi particulier. Bilan familial conseillé.',
    },
    'AE': {
      level: 'ATTENTION',
      profil: 'AE',
      nomClinique: 'Trait HbE',
      conclusion: 'Porteur hétérozygote HbE',
      details: 'HbA1 et HbE présentes. Asymptomatique.',
      conseil: 'Suivi standard. Conseil génétique si conjoint porteur.',
      conseilFamilial: '⚠️ Si conjoint porteur (AE ou bêta-thal), '
             + 'risque d\'enfant E/bêta-thal (sévère).',
    },
  };

  return PROFILS[P] || {
    level: 'NORMAL',
    profil: P,
    nomClinique: 'Profil non déterminé',
    conclusion: `Profil "${P}" non répertorié`,
    details: 'Profil hémoglobinique non interprétable automatiquement. '
           + 'Consulter un biologiste pour interprétation manuelle.',
  };
}

export interface WidalInterpretation {
  level: 'NORMAL' | 'ATTENTION' | 'ANORMAL' | 'URGENT';
  conclusion: string;
  details: string;
  conseil?: string;
}

export function interpretWidal(
  data: Record<string, any>
): WidalInterpretation {
  // Liste des paramètres Widal + Felix
  const keys = [
    'WIDAL_TO', 'WIDAL_TH',
    'WIDAL_AO', 'WIDAL_AH',
    'WIDAL_BO', 'WIDAL_BH',
    'FELIX_OX19', 'FELIX_OX2', 'FELIX_OXK',
  ];

  // Convertir chaque valeur en titre numérique
  const toTitre = (v: any): number => {
    if (!v) return 0;
    const s = String(v).toLowerCase();
    if (s.includes('négatif') || s.includes('negatif')) return 0;
    if (s.includes('douteux') || s.includes('1/80')) return 80;
    if (s.includes('1/160')) return 160;
    if (s.includes('1/320')) return 320;
    if (s.includes('1/640')) return 640;
    if (s.includes('1/1280')) return 1280;
    if (s.includes('1/2560')) return 2560;
    return 0;
  };

  const titres: Record<string, number> = {};
  keys.forEach(k => { titres[k] = toTitre(data[k]); });

  const maxTitre = Math.max(...Object.values(titres), 0);
  const positifs = Object.entries(titres)
    .filter(([_, v]) => v >= 160)
    .map(([k, v]) => `${k.replace('WIDAL_','').replace('FELIX_','')}: 1/${v}`);

  // ═══ CAS NÉGATIF ═══
  if (maxTitre === 0) {
    return {
      level: 'NORMAL',
      conclusion: '✅ WIDAL & FELIX : NÉGATIF',
      details: 'Aucune agglutination détectée à toutes les dilutions. '
             + 'Pas d\'infection à Salmonella ou Rickettsia.',
      conseil: 'Aucun traitement spécifique nécessaire.',
    };
  }

  // ═══ CAS DOUTEUX (1/80) ═══
  if (maxTitre === 80) {
    return {
      level: 'ATTENTION',
      conclusion: '🟡 WIDAL : DOUTEUX (titre limite 1/80)',
      details: 'Titre à la limite de positivité (1/80). '
             + 'Peut être un début d\'infection ou une réaction croisée.',
      conseil: '⚠️ CONTRÔLE À 15 JOURS OBLIGATOIRE pour rechercher '
             + 'une séroconversion (passage à un titre supérieur).',
    };
  }

  // ═══ CAS POSITIF FAIBLE (1/160) ═══
  if (maxTitre === 160) {
    return {
      level: 'ATTENTION',
      conclusion: '🟠 WIDAL : POSITIF FAIBLE (1/160)',
      details: `Anticorps anti-Salmonella détectés : ${positifs.join(' · ')}. `
             + 'Seuil de positivité atteint. Infection débutante ou ancienne.',
      conseil: 'Contrôle à 15 jours. Rechercher des signes cliniques '
             + '(fièvre, troubles digestifs). Hémoculture recommandée.',
    };
  }

  // ═══ CAS POSITIF (1/320) ═══
  if (maxTitre === 320) {
    return {
      level: 'ANORMAL',
      conclusion: '🔴 WIDAL : POSITIF (1/320)',
      details: `Anticorps anti-Salmonella à titre significatif : `
             + `${positifs.join(' · ')}.`,
      conseil: '⚠️ FIÈVRE TYPHOÏDE PROBABLE. '
             + 'Hémoculture à réaliser. '
             + 'Antibiothérapie à discuter avec le clinicien.',
    };
  }

  // ═══ CAS POSITIF FORT (1/640) ═══
  if (maxTitre === 640) {
    return {
      level: 'ANORMAL',
      conclusion: '🔴 WIDAL : POSITIF FORT (1/640)',
      details: `Titres élevés : ${positifs.join(' · ')}. `
             + 'Infection à Salmonella quasi certaine.',
      conseil: '⚠️ FIÈVRE TYPHOÏDE OU PARATYPHOÏDE CONFIRMÉE '
             + 'biologiquement. Antibiothérapie recommandée. '
             + 'Déclaration obligatoire.',
    };
  }

  // ═══ CAS TRÈS POSITIF (1/1280) ═══
  if (maxTitre === 1280) {
    return {
      level: 'URGENT',
      conclusion: '🚨 WIDAL : TRÈS POSITIF (1/1280)',
      details: `Titres très élevés : ${positifs.join(' · ')}. `
             + 'Infection active certaine.',
      conseil: '🚨 URGENCE : Fièvre typhoïde active. '
             + 'Hospitalisation à discuter. '
             + 'Antibiothérapie IV. '
             + 'Déclaration obligatoire à la santé publique.',
    };
  }

  // ═══ CAS POSITIF MAJEUR (≥ 1/2560) ═══
  if (maxTitre >= 2560) {
    return {
      level: 'URGENT',
      conclusion: '🚨 WIDAL : POSITIF MAJEUR (≥ 1/2560)',
      details: `Titres extrêmes : ${positifs.join(' · ')}. `
             + 'Infection sévère ou septicémie.',
      conseil: '🚨 URGENCE ABSOLUE : Typhoïde sévère ou septicémie. '
             + 'Hospitalisation IMMÉDIATE. '
             + 'Antibiothérapie IV + réanimation si besoin. '
             + 'Hémocultures répétées. Déclaration obligatoire.',
    };
  }

  return {
    level: 'NORMAL',
    conclusion: 'Sérologie Widal & Felix non interprétable',
    details: 'Données incomplètes.',
  };
}
