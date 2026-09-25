import fs from 'fs';
import path from 'path';
import os from 'os';
import { EXAM_CATALOG } from '../src/data/initialData';
import { ExamDefinition, ExamParameter, ExamSection, AgeReference, ExamCategory } from '../src/types';

// Constants
const EXPORT_DIR = path.join(os.homedir(), 'Downloads', 'access_export');
const EXAMENS_CSV = path.join(EXPORT_DIR, 'examens.csv');
const PARAMETRES_CSV = path.join(EXPORT_DIR, 'parametres.csv');
const NORMES_CSV = path.join(EXPORT_DIR, 'normes.csv');

const OUTPUT_TS = path.join(process.cwd(), 'src', 'data', 'importedExams.ts');
const OUTPUT_TXT = path.join(process.cwd(), 'import-report.txt');

// Mapping Category -> Prefix ID
const CATEGORY_TO_PREFIX: Record<string, string> = {
  'Hématologie': 'HEMATO',
  'Biochimie': 'BIO',
  'Sérologie': 'SERO',
  'Parasitologie': 'PARASITO',
  'Hormonologie': 'HORM',
  'Microbiologie': 'MICRO',
  'Immuno-Hémostase': 'HEMOSTASE',
};

// Utils: Simple CSV Parser handling quotes
function parseCSV(content: string, separator = ';'): Record<string, string>[] {
  const lines = content.trim().replace(/\r/g, '').split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0]
    .replace(/^\uFEFF/, '')
    .split(separator)
    .map(h => h.trim().replace(/^"|"$/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split handling simple cases (this is a basic split, might need robust regex if values contain the separator)
    const values = line.split(separator).map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  return data;
}

function isDuplicate(newExam: ExamDefinition, existing: ExamDefinition[]): boolean {
  return existing.some(e =>
    e.id === newExam.id ||
    e.code.toLowerCase().trim() === newExam.code.toLowerCase().trim() ||
    e.name.toLowerCase().trim() === newExam.name.toLowerCase().trim()
  );
}

async function main() {
  console.log('--- DÉBUT DE L\'IMPORTATION DEPUIS ACCESS ---');
  
  if (!fs.existsSync(EXPORT_DIR)) {
    console.error(`❌ Erreur: Le dossier ${EXPORT_DIR} n'existe pas.`);
    console.error(`Veuillez exporter vos tables Access en CSV dans ce dossier.`);
    process.exit(1);
  }

  if (!fs.existsSync(EXAMENS_CSV) || !fs.existsSync(PARAMETRES_CSV) || !fs.existsSync(NORMES_CSV)) {
    console.error(`❌ Erreur: Il manque des fichiers CSV dans ${EXPORT_DIR}.`);
    console.error(`Attendu : examens.csv, parametres.csv, normes.csv`);
    process.exit(1);
  }

  // 1. Lire les CSV
  const examensRaw = fs.readFileSync(EXAMENS_CSV, 'utf-8');
  const parametresRaw = fs.readFileSync(PARAMETRES_CSV, 'utf-8');
  const normesRaw = fs.readFileSync(NORMES_CSV, 'utf-8');

  const examensData = parseCSV(examensRaw);
  const parametresData = parseCSV(parametresRaw);
  const normesData = parseCSV(normesRaw);

  console.log(`✅ Fichiers lus : ${examensData.length} examens, ${parametresData.length} paramètres, ${normesData.length} normes.`);

  // Regrouper normes par paramètre
  const normesByParam: Record<string, any[]> = {};
  normesData.forEach(norme => {
    const pid = norme['id_param'];
    if (!normesByParam[pid]) normesByParam[pid] = [];
    normesByParam[pid].push(norme);
  });

  // Regrouper paramètres par examen
  const paramsByExam: Record<string, any[]> = {};
  parametresData.forEach(param => {
    const codeExamen = param['code_examen'];
    if (!paramsByExam[codeExamen]) paramsByExam[codeExamen] = [];
    paramsByExam[codeExamen].push(param);
  });

  const parsedExams: ExamDefinition[] = [];
  const duplicateExams: { exam: ExamDefinition, reason: string }[] = [];
  const newExams: ExamDefinition[] = [];

  // 2. Transformer
  for (const row of examensData) {
    const code = row['code'];
    const name = row['nom'];
    const category = row['categorie'] as ExamCategory;
    const tube = row['tube'];
    const priceStr = row['prix'];

    const prefix = CATEGORY_TO_PREFIX[category] || 'AUTRE';
    if (!CATEGORY_TO_PREFIX[category]) {
      console.warn(`⚠️  Catégorie inconnue "${category}" pour ${code} → préfixe AUTRE`);
    }
    const id = `EXM-${prefix}-${code}`;

    // Construire les paramètres pour cet examen
    const rawParams = paramsByExam[code] || [];
    const examParameters: ExamParameter[] = rawParams.map(rp => {
      const paramId = rp['id_param'];
      const rawNormes = normesByParam[paramId] || [];
      
      const ageReferences: AgeReference[] = rawNormes.map(rn => {
        const ref: AgeReference = {};
        if (rn['sexe']) ref.sex = rn['sexe'] as 'M' | 'F';
        if (rn['age_min']) ref.minAge = parseInt(rn['age_min'], 10);
        if (rn['age_max']) ref.maxAge = parseInt(rn['age_max'], 10);
        if (rn['min']) ref.min = parseFloat(rn['min'].replace(',', '.'));
        if (rn['max']) ref.max = parseFloat(rn['max'].replace(',', '.'));
        return ref;
      });

      return {
        id: paramId,
        name: rp['nom'],
        unit: rp['unite'],
        type: (rp['type'] as any) || 'number',
        ageReferences: ageReferences.length > 0 ? ageReferences : undefined
      };
    });

    const newExam: ExamDefinition = {
      id,
      code,
      name,
      category,
      sampleTypeDefault: tube,
      price: parseFloat(priceStr.replace(',', '.')) || 0,
      active: true,
      sections: examParameters.length > 0 ? [{ title: "Paramètres", parameters: examParameters }] : []
    };

    parsedExams.push(newExam);
  }

  // 3. Détection de doublons
  for (const exam of parsedExams) {
    // Check against EXAM_CATALOG
    const existsInCatalog = EXAM_CATALOG.find(e => 
      e.id === exam.id || 
      e.code.toLowerCase().trim() === exam.code.toLowerCase().trim() ||
      e.name.toLowerCase().trim() === exam.name.toLowerCase().trim()
    );

    if (existsInCatalog) {
      let reason = 'ID existant';
      if (existsInCatalog.code.toLowerCase().trim() === exam.code.toLowerCase().trim()) reason = 'Code existant';
      if (existsInCatalog.name.toLowerCase().trim() === exam.name.toLowerCase().trim()) reason = 'Nom existant';
      
      duplicateExams.push({ exam, reason });
    } else {
      newExams.push(exam);
    }
  }

  // 4 & 5. Générer les fichiers de sortie
  // TypeScript File
  const tsContent = `import { ExamDefinition } from '../types';\n\nexport const IMPORTED_EXAMS: ExamDefinition[] = ${JSON.stringify(newExams, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8');

  // Report File
  const reportLines = [
    'RAPPORT D\'IMPORT ACCESS',
    `Date : ${new Date().toLocaleString()}`,
    `Source : ${EXPORT_DIR}`,
    '',
    `Examens lus : ${parsedExams.length}`,
    `Doublons ignorés : ${duplicateExams.length}`,
    `Nouveaux examens : ${newExams.length}`,
    '',
    'Liste des doublons ignorés :',
    ...duplicateExams.map(d => `- ${d.exam.name} (déjà existant, ${d.reason})`),
    '',
    'Liste des nouveaux examens :',
    ...newExams.map(n => `- ${n.id} : ${n.name}`)
  ];
  fs.writeFileSync(OUTPUT_TXT, reportLines.join('\n'), 'utf-8');

  console.log(`\n📄 Rapport généré : ${OUTPUT_TXT}`);
  console.log(`🚀 Nouveaux examens sauvegardés dans : ${OUTPUT_TS}`);
  console.log(`\nPour intégrer ces examens, ouvrez src/data/initialData.ts et importez IMPORTED_EXAMS.`);
}

main().catch(err => {
  console.error("Erreur critique :", err);
  process.exit(1);
});
