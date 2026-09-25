export type PatientGender = 'M' | 'F';

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  sexe: PatientGender;
  age: number;
  dateNaissance: string;
  telephone: string;
  prescripteur: string;
  service: string;
  prelevement: string;
  renseignementsCliniques: string;
  groupeSanguin?: string;
  dateCreation: string;
}

export type ExamCategory =
  | 'Hématologie'
  | 'Biochimie'
  | 'Sérologie'
  | 'Parasitologie'
  | 'Hormonologie'
  | 'Microbiologie'
  | 'Immuno-Hémostase'
  | 'Autre';

export interface ReferenceRange {
  min?: number;
  max?: number;
  expected?: string;
  text?: string;
}

export interface AgeReference extends ReferenceRange {
  minAge?: number;
  maxAge?: number;
  sex?: 'M' | 'F';
}

export interface ExamParameter {
  id: string;
  name: string;
  unit?: string;
  type: 'number' | 'text' | 'select' | 'textarea';
  options?: string[];
  reference?: ReferenceRange;
  femaleRef?: ReferenceRange;
  maleRef?: ReferenceRange;
  childRef?: ReferenceRange;
  ageReferences?: AgeReference[];
  highlightColor?: string;
}

export interface ExamSection {
  title: string;
  parameters: ExamParameter[];
}

export interface ExamDefinition {
  id: string;
  code: string;
  category: ExamCategory;
  name: string;
  shortName?: string;
  description?: string;
  sampleTypeDefault: string;
  price: number;
  active: boolean;
  sections: ExamSection[];
}

export type ReportStatus = 'BROUILLON' | 'EN_COURS' | 'A_VALIDER' | 'VALIDE' | 'IMPRIME';

export type BilanType = 
  | 'STANDARD'
  | 'PACK_BPN'
  | 'BILAN_METABOLIQUE'
  | 'BILAN_PEDIATRIQUE'
  | 'MULTIPLE'
  | 'URGENT';

export interface DossierReport {
  id: string;
  patientId: string;
  date: string;
  nomExamen: string;
  type: BilanType;
  sampleType: string;
  automateType: string;
  prescripteur: string;
  service: string;
  statut: ReportStatus;
  biologisteValidateur?: string;
  dateValidation?: string;
  observations?: string;
  autoInterpretation?: string;
  examensInclus: string[];
  resultats: Record<string, string | number>;
  examAutomates?: Record<string, string>; // Maps exam ID to automate name
  printFormatDefault?: 'A4' | 'DOUBLE_A5';
}

export interface LabSettings {
  labName: string;
  labCenter: string;
  labAddress: string;
  labPhone: string;
  labEmail: string;
  labAgrement: string;
  labWebsite: string;
  labBiologist: string;
  logoUrl?: string;
  signatureUrl?: string;
}

export interface Equipment {
  id: string;
  nom: string;
  type: string;
  technique: string;
  echantillon: string;
  status: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  assignedExams: string[];
  lastSync?: string;
}

export interface Prescriber {
  id: string;
  nom: string;
  titre: string;
  service: string;
  dossiersCount: number;
}
