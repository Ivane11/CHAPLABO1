import Dexie, { Table } from 'dexie';
import { Patient, DossierReport, ExamDefinition, Equipment, Prescriber, LabSettings } from '../types';

export class ChaplabDatabase extends Dexie {
  patients!: Table<Patient, string>;
  dossiers!: Table<DossierReport, string>;
  catalog!: Table<ExamDefinition, string>;
  equipments!: Table<Equipment, string>;
  prescribers!: Table<Prescriber, string>;
  settings!: Table<LabSettings, string>;

  constructor() {
    super('ChaplabDB');
    this.version(1).stores({
      patients: 'id, nom, prenom, matricule', // Indexed fields
      dossiers: 'id, patientId, statut, date',
      catalog: 'id, category, name',
      equipments: 'id, name',
      prescribers: 'id, name',
      settings: 'id'
    });
  }
}

export const db = new ChaplabDatabase();
