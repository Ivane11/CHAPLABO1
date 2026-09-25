import {
  DEFAULT_LAB_SETTINGS,
  EXAM_CATALOG,
  INITIAL_DOSSIERS,
  INITIAL_EQUIPMENTS,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIBERS,
} from '../data/initialData';
import {
  DossierReport,
  Equipment,
  ExamDefinition,
  LabSettings,
  Patient,
  Prescriber,
} from '../types';
import { db } from './db';

const SETTINGS_ID = 'main_settings';

export const StorageService = {
  async getPatients(): Promise<Patient[]> {
    try {
      return await db.patients.toArray();
    } catch (e) {
      console.error('Error reading patients from storage', e);
      return [];
    }
  },

  async savePatients(patients: Patient[]) {
    try {
      await db.patients.clear();
      if (patients.length > 0) {
        await db.patients.bulkAdd(patients);
      }
    } catch (e) {
      console.error('Error saving patients', e);
    }
  },

  async getDossiers(): Promise<DossierReport[]> {
    try {
      return await db.dossiers.toArray();
    } catch (e) {
      console.error('Error reading dossiers from storage', e);
      return [];
    }
  },

  async saveDossiers(dossiers: DossierReport[]) {
    try {
      await db.dossiers.clear();
      if (dossiers.length > 0) {
        await db.dossiers.bulkAdd(dossiers);
      }
    } catch (e) {
      console.error('Error saving dossiers', e);
    }
  },

  async getSettings(): Promise<LabSettings> {
    try {
      const data = await db.settings.get(SETTINGS_ID);
      if (data) return data;
    } catch (e) {
      console.error('Error reading settings', e);
    }
    await this.saveSettings(DEFAULT_LAB_SETTINGS);
    return DEFAULT_LAB_SETTINGS;
  },

  async saveSettings(settings: LabSettings) {
    try {
      await db.settings.put({ ...settings, id: SETTINGS_ID } as any);
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  async getCatalog(): Promise<ExamDefinition[]> {
    try {
      const data = await db.catalog.toArray();
      if (data.length > 0) {
        const updated = data.map((ex: any) =>
          ex.id === 'EXM-ELECTRO-HB' || ex.id === 'EXM-SERO-WIDAL'
            ? EXAM_CATALOG.find((e) => e.id === ex.id) || ex
            : ex
        );
        return updated;
      }
    } catch (e) {
      console.error('Error reading catalog', e);
    }
    await this.saveCatalog(EXAM_CATALOG);
    return EXAM_CATALOG;
  },

  async saveCatalog(catalog: ExamDefinition[]) {
    try {
      await db.catalog.clear();
      if (catalog.length > 0) {
        await db.catalog.bulkAdd(catalog);
      }
    } catch (e) {
      console.error('Error saving catalog', e);
    }
  },

  async getEquipments(): Promise<Equipment[]> {
    try {
      const data = await db.equipments.toArray();
      if (data.length > 0) return data;
    } catch (e) {
      console.error('Error reading equipments', e);
    }
    await this.saveEquipments(INITIAL_EQUIPMENTS);
    return INITIAL_EQUIPMENTS;
  },

  async saveEquipments(equipments: Equipment[]) {
    try {
      await db.equipments.clear();
      if (equipments.length > 0) {
        await db.equipments.bulkAdd(equipments);
      }
    } catch (e) {
      console.error('Error saving equipments', e);
    }
  },

  async getPrescribers(): Promise<Prescriber[]> {
    try {
      const data = await db.prescribers.toArray();
      if (data.length > 0) return data;
    } catch (e) {
      console.error('Error reading prescribers', e);
    }
    await this.savePrescribers(INITIAL_PRESCRIBERS);
    return INITIAL_PRESCRIBERS;
  },

  async savePrescribers(prescribers: Prescriber[]) {
    try {
      await db.prescribers.clear();
      if (prescribers.length > 0) {
        await db.prescribers.bulkAdd(prescribers);
      }
    } catch (e) {
      console.error('Error saving prescribers', e);
    }
  },

  async exportDatabaseBackup(): Promise<void> {
    const backup = {
      version: '2.5.0-SaaS',
      exportDate: new Date().toISOString(),
      patients: await this.getPatients(),
      dossiers: await this.getDossiers(),
      settings: await this.getSettings(),
      catalog: await this.getCatalog(),
      equipments: await this.getEquipments(),
      prescribers: await this.getPrescribers(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CHAPLAB_Sauvegarde_Labo_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async importDatabaseBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.patients)) await this.savePatients(data.patients);
      if (Array.isArray(data.dossiers)) await this.saveDossiers(data.dossiers);
      if (data.settings) await this.saveSettings(data.settings);
      if (Array.isArray(data.catalog)) await this.saveCatalog(data.catalog);
      if (Array.isArray(data.equipments)) await this.saveEquipments(data.equipments);
      if (Array.isArray(data.prescribers)) await this.savePrescribers(data.prescribers);
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  },

  async factoryReset(): Promise<void> {
    await this.savePatients([]);
    await this.saveDossiers([]);
    await this.saveSettings(DEFAULT_LAB_SETTINGS);
    await this.saveCatalog(EXAM_CATALOG);
    await this.saveEquipments(INITIAL_EQUIPMENTS);
    await this.savePrescribers(INITIAL_PRESCRIBERS);
  },
};
