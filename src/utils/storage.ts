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

const KEYS = {
  PATIENTS: 'chaplab_patients',
  DOSSIERS: 'chaplab_dossiers',
  SETTINGS: 'chaplab_settings',
  CATALOG: 'chaplab_catalog',
  EQUIPMENTS: 'chaplab_equipments',
  PRESCRIBERS: 'chaplab_prescribers',
};

export const StorageService = {
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(KEYS.PATIENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading patients from storage', e);
    }
    this.savePatients(INITIAL_PATIENTS);
    return INITIAL_PATIENTS;
  },

  savePatients(patients: Patient[]) {
    try {
      localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Error saving patients', e);
    }
  },

  getDossiers(): DossierReport[] {
    try {
      const data = localStorage.getItem(KEYS.DOSSIERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading dossiers from storage', e);
    }
    this.saveDossiers(INITIAL_DOSSIERS);
    return INITIAL_DOSSIERS;
  },

  saveDossiers(dossiers: DossierReport[]) {
    try {
      localStorage.setItem(KEYS.DOSSIERS, JSON.stringify(dossiers));
    } catch (e) {
      console.error('Error saving dossiers', e);
    }
  },

  getSettings(): LabSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) return { ...DEFAULT_LAB_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error('Error reading settings', e);
    }
    this.saveSettings(DEFAULT_LAB_SETTINGS);
    return DEFAULT_LAB_SETTINGS;
  },

  saveSettings(settings: LabSettings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  getCatalog(): ExamDefinition[] {
    try {
      const data = localStorage.getItem(KEYS.CATALOG);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading catalog', e);
    }
    this.saveCatalog(EXAM_CATALOG);
    return EXAM_CATALOG;
  },

  saveCatalog(catalog: ExamDefinition[]) {
    try {
      localStorage.setItem(KEYS.CATALOG, JSON.stringify(catalog));
    } catch (e) {
      console.error('Error saving catalog', e);
    }
  },

  getEquipments(): Equipment[] {
    try {
      const data = localStorage.getItem(KEYS.EQUIPMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading equipments', e);
    }
    this.saveEquipments(INITIAL_EQUIPMENTS);
    return INITIAL_EQUIPMENTS;
  },

  saveEquipments(equipments: Equipment[]) {
    try {
      localStorage.setItem(KEYS.EQUIPMENTS, JSON.stringify(equipments));
    } catch (e) {
      console.error('Error saving equipments', e);
    }
  },

  getPrescribers(): Prescriber[] {
    try {
      const data = localStorage.getItem(KEYS.PRESCRIBERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading prescribers', e);
    }
    this.savePrescribers(INITIAL_PRESCRIBERS);
    return INITIAL_PRESCRIBERS;
  },

  savePrescribers(prescribers: Prescriber[]) {
    try {
      localStorage.setItem(KEYS.PRESCRIBERS, JSON.stringify(prescribers));
    } catch (e) {
      console.error('Error saving prescribers', e);
    }
  },

  exportDatabaseBackup(): void {
    const backup = {
      version: '2.5.0-SaaS',
      exportDate: new Date().toISOString(),
      patients: this.getPatients(),
      dossiers: this.getDossiers(),
      settings: this.getSettings(),
      catalog: this.getCatalog(),
      equipments: this.getEquipments(),
      prescribers: this.getPrescribers(),
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

  importDatabaseBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.patients)) this.savePatients(data.patients);
      if (Array.isArray(data.dossiers)) this.saveDossiers(data.dossiers);
      if (data.settings) this.saveSettings(data.settings);
      if (Array.isArray(data.catalog)) this.saveCatalog(data.catalog);
      if (Array.isArray(data.equipments)) this.saveEquipments(data.equipments);
      if (Array.isArray(data.prescribers)) this.savePrescribers(data.prescribers);
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  },

  factoryReset(): void {
    this.savePatients(INITIAL_PATIENTS);
    this.saveDossiers(INITIAL_DOSSIERS);
    this.saveSettings(DEFAULT_LAB_SETTINGS);
    this.saveCatalog(EXAM_CATALOG);
    this.saveEquipments(INITIAL_EQUIPMENTS);
    this.savePrescribers(INITIAL_PRESCRIBERS);
  },
};
