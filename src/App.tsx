import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveView } from './components/layout/Sidebar';
import { Header, MainNavTab } from './components/layout/Header';
import { LandingPageView } from './components/home/LandingPageView';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientsView } from './components/patients/PatientsView';
import { PatientProfileView } from './components/patients/PatientProfileView';
import { PacksView } from './components/packs/PacksView';
import { ExamsCatalogView } from './components/exams/ExamsCatalogView';
import { ReportsView } from './components/reports/ReportsView';
import { AnatomyView } from './components/anatomy/AnatomyView';
import { AdminView } from './components/admin/AdminView';
import { NewDossierWizard } from './components/wizard/NewDossierWizard';
import { NewPatientModal } from './components/patients/NewPatientModal';
import { ValidationModal } from './components/reports/ValidationModal';
import { ReportPrintModal } from './components/print/ReportPrintModal';
import { StorageService } from './utils/storage';
import { INITIAL_PRESCRIBERS } from './data/initialData';
import { DossierReport, ExamDefinition, LabSettings, Patient, ReportStatus } from './types';

export type ViewMode =
  | 'home'
  | 'dashboard'
  | 'patients'
  | 'patient_profile'
  | 'packs'
  | 'exams'
  | 'reports'
  | 'anatomy'
  | 'admin';

export function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Persistence State
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [dossiers, setDossiers] = useState<DossierReport[]>(() => StorageService.getDossiers());
  const [catalog, setCatalog] = useState<ExamDefinition[]>(() => StorageService.getCatalog());
  const [settings, setSettings] = useState<LabSettings>(() => StorageService.getSettings());
  const [equipments, setEquipments] = useState(() => StorageService.getEquipments());

  // Active Contexts
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || ''
  );

  // Modals State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardPatientId, setWizardPatientId] = useState<string | undefined>(undefined);
  const [wizardPackId, setWizardPackId] = useState<string | undefined>(undefined);

  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validatingDossier, setValidatingDossier] = useState<DossierReport | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printingDossier, setPrintingDossier] = useState<DossierReport | null>(null);
  const [printLayoutMode, setPrintLayoutMode] = useState<'OFFICIAL_A4' | 'ISO_DOUBLE_A5'>('OFFICIAL_A4');

  // Auto-persist whenever patients or dossiers change
  useEffect(() => {
    StorageService.savePatients(patients);
  }, [patients]);

  useEffect(() => {
    StorageService.saveDossiers(dossiers);
  }, [dossiers]);

  useEffect(() => {
    StorageService.saveCatalog(catalog);
  }, [catalog]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Handlers for Patients
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient_profile');
  };

  const handleSaveNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    setDossiers((prev) => prev.filter((d) => d.patientId !== patientId));
    if (selectedPatientId === patientId) {
      setSelectedPatientId(patients[0]?.id || '');
    }
  };

  // Handlers for Dossiers & Wizard
  const handleOpenWizard = (patientId?: string, packId?: string) => {
    setWizardPatientId(patientId);
    setWizardPackId(packId);
    setIsWizardOpen(true);
  };

  const handleCreateDossier = (
    newDossier: DossierReport,
    newPatient?: Patient,
    shouldPrint?: boolean
  ) => {
    if (newPatient) {
      setPatients((prev) => [newPatient, ...prev]);
    }
    setDossiers((prev) => [newDossier, ...prev]);
    setSelectedPatientId(newDossier.patientId);

    if (shouldPrint) {
      setPrintingDossier(newDossier);
      setPrintLayoutMode('OFFICIAL_A4');
      setIsPrintModalOpen(true);
    }
  };

  const handleUpdateDossierResults = (
    dossierId: string,
    results: Record<string, any>,
    observations?: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.id === dossierId) {
          return {
            ...d,
            resultats: results,
            observations: observations !== undefined ? observations : d.observations,
          };
        }
        return d;
      })
    );
  };

  // Validation Handlers
  const handleOpenValidation = (dossier: DossierReport) => {
    setValidatingDossier(dossier);
    setIsValidationModalOpen(true);
  };

  const handleConfirmValidation = (
    dossierId: string,
    newStatus: ReportStatus,
    biologistName: string,
    observations?: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.id === dossierId) {
          return {
            ...d,
            statut: newStatus,
            biologisteValidateur: biologistName,
            dateValidation: `${new Date().toISOString().slice(0, 10)} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            observations: observations !== undefined ? observations : d.observations,
          };
        }
        return d;
      })
    );
  };

  // Print Handlers
  const handlePreviewReport = (dossier: DossierReport) => {
    setPrintingDossier(dossier);
    setPrintLayoutMode('OFFICIAL_A4');
    setIsPrintModalOpen(true);
  };

  const handlePrintReport = (dossier: DossierReport) => {
    setPrintingDossier(dossier);
    setPrintLayoutMode('OFFICIAL_A4');
    setIsPrintModalOpen(true);
  };

  const handlePrintOfficial = (
    type: 'OFFICIAL_A4' | 'ISO_DOUBLE_A5',
    patient: Patient,
    dossier: DossierReport
  ) => {
    setSelectedPatientId(patient.id);
    setPrintingDossier(dossier);
    setPrintLayoutMode(type);
    setIsPrintModalOpen(true);
  };

  // Administration Handlers
  const handleToggleExamActive = (examId: string) => {
    setCatalog((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, active: !e.active } : e))
    );
  };

  const handleExportBackup = () => {
    StorageService.exportDatabaseBackup();
  };

  const handleImportBackup = (jsonStr: string): boolean => {
    const success = StorageService.importDatabaseBackup(jsonStr);
    if (success) {
      setPatients(StorageService.getPatients());
      setDossiers(StorageService.getDossiers());
      setCatalog(StorageService.getCatalog());
      setSettings(StorageService.getSettings());
      setEquipments(StorageService.getEquipments());
    }
    return success;
  };

  const handleFactoryReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la base de données ? Toutes les modifications seront effacées.')) {
      StorageService.factoryReset();
      setPatients(StorageService.getPatients());
      setDossiers(StorageService.getDossiers());
      setCatalog(StorageService.getCatalog());
      setSettings(StorageService.getSettings());
      setEquipments(StorageService.getEquipments());
    }
  };

  const handlePurgeDrafts = () => {
    if (window.confirm('Supprimer tous les dossiers avec le statut Brouillon ?')) {
      setDossiers((prev) => prev.filter((d) => d.statut !== 'BROUILLON'));
    }
  };

  // Resolved context entities
  const activePatientForProfile =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const validatingPatient =
    patients.find((p) => p.id === validatingDossier?.patientId) || null;

  const printingPatient =
    patients.find((p) => p.id === printingDossier?.patientId) || null;

  const pendingValidationCount = dossiers.filter((d) => d.statut === 'A_VALIDER').length;

  return (
    <div className="min-h-screen bg-[#E5E7EB] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased selection:bg-[#EEEDFC] selection:text-[#5B46F6]">
      {/* Outer master rounded card matching exact screenshot layout */}
      <div className="w-full max-w-[1540px] bg-white rounded-[32px] md:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row min-h-[920px]">
        {/* Sidebar matching screenshot */}
        <Sidebar
          activeView={currentView === 'patient_profile' ? 'patient-profile' : (currentView as ActiveView)}
          setActiveView={(v: ActiveView) => setCurrentView(v === 'patient-profile' ? 'patient_profile' : (v as ViewMode))}
          patientsCount={patients.length}
          pendingValidationCount={pendingValidationCount}
          onOpenNewDossier={() => handleOpenWizard()}
          settings={settings}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFC] lg:bg-white overflow-y-auto">
          {/* Header shown for non-dashboard views */}
          {currentView !== 'dashboard' && (
            <Header
              currentView={currentView}
              onNavigate={(view: MainNavTab) => setCurrentView(view as ViewMode)}
              patients={patients}
              dossiers={dossiers}
              settings={settings}
              onSelectPatient={handleSelectPatient}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
              onOpenNewDossier={() => handleOpenWizard()}
              onQuickPrint={() => {
                const firstValid = dossiers.find((d) => d.statut === 'VALIDE') || dossiers[0];
                if (firstValid) handlePrintReport(firstValid);
              }}
              pendingValidationCount={pendingValidationCount}
            />
          )}

          <main className="flex-1 p-5 sm:p-7 lg:p-8 w-full">
            {/* DASHBOARD / REPORTS VIEW (EXACT MATCH OF SCREENSHOT) */}
            {currentView === 'dashboard' && (
              <DashboardView
                patients={patients}
                dossiers={dossiers}
                onSelectPatient={handleSelectPatient}
                onOpenNewDossier={() => handleOpenWizard()}
                onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
                onNavigateToView={(view) => setCurrentView(view)}
                onPreviewReport={handlePreviewReport}
              />
            )}

            {/* HOME / PRESENTATION VIEW */}
            {currentView === 'home' && (
              <LandingPageView
                settings={settings}
                onNavigate={(view) => setCurrentView(view as ViewMode)}
                onOpenNewDossier={() => handleOpenWizard()}
                onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
                patientsCount={patients.length}
                dossiersCount={dossiers.length}
                pendingCount={pendingValidationCount}
              />
            )}

            {/* PATIENTS VIEW */}
            {currentView === 'patients' && (
              <PatientsView
                patients={patients}
                dossiers={dossiers}
                onSelectPatient={handleSelectPatient}
                onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
                onOpenNewDossierForPatient={(patientId) => handleOpenWizard(patientId)}
                onDeletePatient={handleDeletePatient}
              />
            )}

            {/* PATIENT PROFILE VIEW */}
            {currentView === 'patient_profile' && activePatientForProfile && (
              <PatientProfileView
                patient={activePatientForProfile}
                dossiers={dossiers}
                catalog={catalog}
                onBack={() => setCurrentView('patients')}
                onOpenNewDossier={() => handleOpenWizard(activePatientForProfile.id)}
                onUpdateDossierResults={handleUpdateDossierResults}
                onPreviewReport={handlePreviewReport}
                onPrintReport={handlePrintReport}
              />
            )}

            {/* CLINICAL PACKS VIEW */}
            {currentView === 'packs' && (
              <PacksView
                onPrescribePack={(packId) => {
                  handleOpenWizard(undefined, packId);
                }}
              />
            )}

            {/* EXAMS CATALOG VIEW */}
            {currentView === 'exams' && (
              <ExamsCatalogView
                catalog={catalog}
                onToggleExamActive={handleToggleExamActive}
              />
            )}

            {/* REPORTS MANAGEMENT VIEW */}
            {currentView === 'reports' && (
              <ReportsView
                dossiers={dossiers}
                patients={patients}
                onOpenReportValidation={handleOpenValidation}
                onPreviewReport={handlePreviewReport}
                onPrintReport={handlePrintReport}
              />
            )}

            {/* ANATOMY & BIOMEDICAL CARTOGRAPHY VIEW */}
            {currentView === 'anatomy' && (
              <AnatomyView
                patients={patients}
                dossiers={dossiers}
                activePatientId={selectedPatientId}
                onSelectPatient={(pId) => setSelectedPatientId(pId)}
                onPrintOfficial={handlePrintOfficial}
              />
            )}

            {/* ADMINISTRATION VIEW */}
            {currentView === 'admin' && (
              <AdminView
                settings={settings}
                catalog={catalog}
                equipments={equipments}
                onSaveSettings={(newSettings) => setSettings(newSettings)}
                onToggleExamActive={handleToggleExamActive}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onFactoryReset={handleFactoryReset}
                onPurgeDrafts={handlePurgeDrafts}
              />
            )}
          </main>
        </div>
      </div>

      {/* NEW DOSSIER 3-STEP WIZARD MODAL */}
      <NewDossierWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        patients={patients}
        catalog={catalog}
        prescribers={INITIAL_PRESCRIBERS}
        initialPatientId={wizardPatientId}
        initialPackId={wizardPackId}
        onCreateDossier={handleCreateDossier}
      />

      {/* NEW PATIENT MODAL */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        prescribers={INITIAL_PRESCRIBERS}
        existingPatientsCount={patients.length}
        onSavePatient={handleSaveNewPatient}
      />

      {/* VALIDATION & CERTIFICATION MODAL */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        dossier={validatingDossier}
        patient={validatingPatient}
        biologistDefaultName={settings.labBiologist}
        onConfirmValidation={handleConfirmValidation}
      />

      {/* OFFICIAL PRINT & PREVIEW MODAL */}
      <ReportPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        dossier={printingDossier}
        patient={printingPatient}
        catalog={catalog}
        settings={settings}
        printMode={printLayoutMode}
      />
    </div>
  );
}

export default App;
