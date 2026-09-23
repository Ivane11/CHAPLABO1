import React, { useState } from 'react';
import {
  Building2,
  FlaskConical,
  Database,
  Cpu,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
} from 'lucide-react';
import { Equipment, ExamDefinition, LabSettings } from '../../types';

interface AdminViewProps {
  settings: LabSettings;
  catalog: ExamDefinition[];
  equipments: Equipment[];
  onSaveSettings: (settings: LabSettings) => void;
  onToggleExamActive: (examId: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onFactoryReset: () => void;
  onPurgeDrafts: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  settings,
  catalog,
  equipments,
  onSaveSettings,
  onToggleExamActive,
  onExportBackup,
  onImportBackup,
  onFactoryReset,
  onPurgeDrafts,
}) => {
  const [activeTab, setActiveTab] = useState<'lab' | 'catalog' | 'system' | 'equipments'>('lab');
  const [formData, setFormData] = useState<LabSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  const handleInputChange = (field: keyof LabSettings, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportBackup(content);
        if (ok) {
          alert('Sauvegarde restaurée avec succès ! Les données sont synchronisées.');
        } else {
          alert('Fichier JSON invalide. Veuillez vérifier le fichier.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Administration & Paramètres LIS
          </h2>
          <p className="text-xs text-slate-500">
            Configuration de l'identité officielle du laboratoire, automates, catalogue d'analyses et sauvegardes locales.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('lab')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'lab'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Laboratoire & En-tête</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Catalogue & Prix</span>
        </button>

        <button
          onClick={() => setActiveTab('equipments')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'equipments'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Automates & Traçabilité ({equipments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-3 cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Système & Données</span>
        </button>
      </div>

      {/* TAB 1: LABORATOIRE & EN-TÊTE OFFICIEL */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Coordonnées Officielles & Mentions Légales
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Ces informations figureront automatiquement sur tous vos bulletins d'analyses A4 et doubles A5.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom Officiel du Laboratoire *
                </label>
                <input
                  type="text"
                  required
                  value={formData.labName}
                  onChange={(e) => handleInputChange('labName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Établissement / Centre de Rattachement
                </label>
                <input
                  type="text"
                  value={formData.labCenter}
                  onChange={(e) => handleInputChange('labCenter', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse Géographique & Boîte Postale
                </label>
                <textarea
                  rows={2}
                  value={formData.labAddress}
                  onChange={(e) => handleInputChange('labAddress', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone(s) Principal
                  </label>
                  <input
                    type="text"
                    value={formData.labPhone}
                    onChange={(e) => handleInputChange('labPhone', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail de Contact
                  </label>
                  <input
                    type="email"
                    value={formData.labEmail}
                    onChange={(e) => handleInputChange('labEmail', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    N° Agrément / N° d'Ordre
                  </label>
                  <input
                    type="text"
                    value={formData.labAgrement}
                    onChange={(e) => handleInputChange('labAgrement', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Site Web / Portails Patients
                  </label>
                  <input
                    type="text"
                    value={formData.labWebsite}
                    onChange={(e) => handleInputChange('labWebsite', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom & Titre du Pharmacien / Médecin Biologiste Référent
                </label>
                <input
                  type="text"
                  value={formData.labBiologist}
                  onChange={(e) => handleInputChange('labBiologist', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les coordonnées</span>
                </button>

                {saveSuccess && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    En-tête sauvegardé
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Right: Live Preview of Official Letterhead */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Aperçu en Direct de l'En-tête Officiel
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Format Impression A4 / A5
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                    C
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-blue-900 uppercase leading-snug">
                      {formData.labName || 'CENTRE DE BIOLOGIE MÉDICALE'}
                    </h4>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {formData.labCenter}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-1">
                      {formData.labAddress}
                    </div>
                    <div className="text-[10px] text-blue-800 font-mono mt-1">
                      {formData.labPhone} · {formData.labEmail}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>Agrément : {formData.labAgrement || 'AGR-2026'}</span>
                  <span>Certification ISO 15189</span>
                </div>
              </div>
            </div>

            {/* Signature & Stamp preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Validation & Signature du Biologiste
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  Le Biologiste Responsable
                </div>
                <div className="h-10 flex items-center justify-end font-serif italic text-blue-900 text-sm opacity-80 my-1">
                  Dr. {formData.labBiologist.split('—')[0]}
                </div>
                <div className="text-[11px] font-bold text-slate-800">
                  {formData.labBiologist}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Horodatage cryptographique certifié
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG MANAGEMENT */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Rechercher une analyse..."
              className="w-72 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none"
            />
            <span className="text-xs text-slate-500 font-mono">
              {catalog.length} analyses configurées
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Nom de l'analyse</th>
                  <th className="py-2.5 px-4">Discipline</th>
                  <th className="py-2.5 px-4">Tarif (FCFA)</th>
                  <th className="py-2.5 px-4 text-center">Statut dans le LIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {catalog
                  .filter((e) =>
                    e.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    e.code.toLowerCase().includes(catalogSearch.toLowerCase())
                  )
                  .map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {exam.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {exam.name}
                      </td>
                      <td className="py-3 px-4">{exam.category}</td>
                      <td className="py-3 px-4 font-mono font-medium">{exam.price} FCFA</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleExamActive(exam.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer inline-flex ${
                            exam.active ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              exam.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EQUIPMENTS & AUTOMATES */}
      {activeTab === 'equipments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipments.map((eq) => (
              <div
                key={eq.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {eq.nom}
                      </h4>
                      <p className="text-[11px] text-slate-500">{eq.type}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eq.status === 'ONLINE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700">Technique :</span>{' '}
                    {eq.technique}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Échantillon :</span>{' '}
                    {eq.echantillon}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Dernière synchro :</span>{' '}
                    {eq.lastSync || 'Aujourd’hui'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM & DATA VAULT */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Export / Import Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Sauvegarde & Restauration Locale
                </h3>
                <p className="text-xs text-slate-500">
                  Exportez l'intégralité de la base de données en format JSON cryptographique.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Le système CHAPLAB fonctionne en architecture <strong>Local-First</strong> : toutes les données
              sont conservées sur votre ordinateur. Pour transférer la base vers un autre poste ou créer une archive,
              utilisez les boutons ci-dessous.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onExportBackup}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger Sauvegarde (.json)</span>
              </button>

              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurer une Sauvegarde</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 text-red-700">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-900">
                  Zone Critique & Maintenance
                </h3>
                <p className="text-xs text-red-600">
                  Actions de maintenance irréversibles sur la base locale.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800">
                    Purger les dossiers Brouillons
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supprime les bilans incomplets non validés.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onPurgeDrafts}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 cursor-pointer"
                >
                  Purger
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-red-700">
                    Réinitialisation Usine (Factory Reset)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Remet la base de données à zéro avec le jeu de données d'origine.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onFactoryReset}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
