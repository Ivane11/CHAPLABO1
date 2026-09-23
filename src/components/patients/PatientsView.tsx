import React, { useState } from 'react';
import {
  Search,
  Plus,
  FilePlus,
  FolderOpen,
  Trash2,
} from 'lucide-react';
import { DossierReport, Patient } from '../../types';

interface PatientsViewProps {
  patients: Patient[];
  dossiers: DossierReport[];
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewDossierForPatient: (patientId: string) => void;
  onDeletePatient?: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  dossiers,
  onSelectPatient,
  onOpenNewPatientModal,
  onOpenNewDossierForPatient,
  onDeletePatient,
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [dossierFilter, setDossierFilter] = useState<'ALL' | 'WITH_DOSSIER' | 'NO_DOSSIER'>('ALL');

  const filteredPatients = patients.filter((p) => {
    const matchesQuery =
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.telephone.includes(search) ||
      (p.prescripteur && p.prescripteur.toLowerCase().includes(search.toLowerCase()));

    const matchesGender = genderFilter === 'ALL' || p.sexe === genderFilter;

    const patientDossiers = dossiers.filter((d) => d.patientId === p.id);
    const matchesDossier =
      dossierFilter === 'ALL' ||
      (dossierFilter === 'WITH_DOSSIER' && patientDossiers.length > 0) ||
      (dossierFilter === 'NO_DOSSIER' && patientDossiers.length === 0);

    return matchesQuery && matchesGender && matchesDossier;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Annuaire des Patients & Dossiers
          </h2>
          <p className="text-xs text-slate-500">
            Gestion du registre médico-légal des patients et historique des analyses.
          </p>
        </div>

        <button
          onClick={onOpenNewPatientModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Patient</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, identifiant, téléphone, prescripteur..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">Tous les sexes</option>
            <option value="M">Masculin (M)</option>
            <option value="F">Féminin (F)</option>
          </select>

          <select
            value={dossierFilter}
            onChange={(e) => setDossierFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">Tous les dossiers</option>
            <option value="WITH_DOSSIER">Avec bilans actifs</option>
            <option value="NO_DOSSIER">Nouveaux (sans bilan)</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">ID Patient</th>
                <th className="py-3 px-4">Identité & Âge</th>
                <th className="py-3 px-4">Sexe</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Prescripteur Référent</th>
                <th className="py-3 px-4">Dossiers d'Analyses</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const patientDossiers = dossiers.filter((d) => d.patientId === patient.id);
                  const lastDossier = patientDossiers[patientDossiers.length - 1];

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectPatient(patient.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                        {patient.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {patient.nom} {patient.prenom}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Né(e) le {patient.dateNaissance || '--'} · {patient.age} ans
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            patient.sexe === 'F'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {patient.telephone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {patient.prescripteur || 'Consultation Externe'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {patient.service || 'Dispensaire'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {patientDossiers.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-900">
                              {patientDossiers.length} bilan(s)
                            </span>
                            {lastDossier && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  lastDossier.statut === 'VALIDE'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {lastDossier.statut}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Aucun dossier</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPatient(patient.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Ouvrir le dossier patient"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </button>

                          <button
                            onClick={() => onOpenNewDossierForPatient(patient.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Nouveau Bilan pour ce patient"
                          >
                            <FilePlus className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden md:inline">Prescrire</span>
                          </button>

                          {onDeletePatient && (
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la fiche de ${patient.nom} ${patient.prenom} ?`)) {
                                  onDeletePatient(patient.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Supprimer patient"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Aucun patient ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
