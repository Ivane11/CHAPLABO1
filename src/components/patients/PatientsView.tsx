import React, { useState } from 'react';
import {
  Search,
  Plus,
  FilePlus,
  FolderOpen,
  Trash2,
  ChevronsUpDown,
  Stethoscope,
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
          <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 font-sans">
            Annuaire des Patients & Dossiers
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Gestion du registre médico-légal des patients et historique des analyses.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 glass-panel p-3 rounded-[20px]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, identifiant, téléphone, prescripteur..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl text-[13px] font-medium text-slate-700 outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Tous les sexes</option>
            <option value="M">Masculin (M)</option>
            <option value="F">Féminin (F)</option>
          </select>

          <select
            value={dossierFilter}
            onChange={(e) => setDossierFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl text-[13px] font-medium text-slate-700 outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Tous les dossiers</option>
            <option value="WITH_DOSSIER">Avec bilans actifs</option>
            <option value="NO_DOSSIER">Nouveaux (sans bilan)</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="glass-panel rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="h-[38px] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#4F46E5] after:via-[#06B6D4] after:to-[#10B981]">
                {[
                  { label: 'ID Patient', bg: 'bg-[#EEF2FF]', text: 'text-[#4338CA]' },
                  { label: 'Identité & Âge', bg: 'bg-[#F1F5F9]', text: 'text-[#334155]' },
                  { label: 'Sexe', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]' },
                  { label: 'Téléphone', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]' },
                  { label: 'Prescripteur', bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' },
                  { label: 'Dossiers', bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]' },
                  { label: '', bg: 'bg-white', text: 'text-slate-500' }
                ].map((col, idx) => (
                  <th key={idx} className={`px-3 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] ${col.bg} ${col.text} border-r border-[#E2E8F0]/70 last:border-r-0`}>
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.label && <ChevronsUpDown className="w-3 h-3 opacity-50" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#334155] text-[13px]">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const patientDossiers = dossiers.filter((d) => d.patientId === patient.id);
                  const lastDossier = patientDossiers[patientDossiers.length - 1];

                  // Row Theme by Gender
                  const isMale = patient.sexe === 'M';
                  let rowBg = isMale
                    ? 'bg-gradient-to-r from-[rgba(240,249,255,0.7)] to-[rgba(255,255,255,0.9)]'
                    : 'bg-gradient-to-r from-[rgba(255,241,242,0.65)] to-[rgba(255,255,255,0.9)]';
                  let leftBorder = isMale ? 'border-[#06B6D4]' : 'border-[#F43F5E]';

                  return (
                    <tr
                      key={patient.id}
                      className={`group relative h-[46px] border-b border-[#EDF2F7] hover:brightness-95 hover:saturate-110 transition-all cursor-pointer ${rowBg} border-l-[4px] ${leftBorder}`}
                      onClick={() => onSelectPatient(patient.id)}
                    >
                      <td className="p-0 border-r border-[rgba(99,102,241,0.15)] bg-[rgba(99,102,241,0.04)] px-3 group-hover:bg-[rgba(99,102,241,0.08)] transition-colors">
                        <span className="bg-[#EEF2FF] text-[#4F46E5] font-mono text-[11px] font-bold px-2 py-1 rounded-[6px]">
                          {patient.id}
                        </span>
                      </td>

                      <td className="px-3 border-r border-[rgba(203,213,225,0.6)] bg-[rgba(241,245,249,0.5)] group-hover:bg-[rgba(241,245,249,0.8)] transition-colors">
                        <div className="flex items-center">
                          <span className="font-bold text-[#0F172A]">{patient.nom} {patient.prenom}</span>
                          <span className="bg-[rgba(139,92,246,0.12)] text-[#7C3AED] text-[10px] px-1.5 py-0.5 rounded-[4px] ml-2 font-bold">
                            {patient.age}a
                          </span>
                        </div>
                      </td>

                      <td className="px-3 border-r border-[#EEF2F6] bg-[#FFFFFF] group-hover:bg-slate-50 transition-colors">
                        <span
                          className={`inline-block px-2 py-1 rounded-[6px] text-[11px] font-bold ${
                            patient.sexe === 'F'
                              ? 'bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]'
                              : 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]'
                          }`}
                        >
                          {patient.sexe === 'F' ? 'Féminin' : 'Masculin'}
                        </span>
                      </td>

                      <td className="px-3 border-r border-[#EEF2F6] bg-[#FFFFFF] text-[#64748B] text-[12px] group-hover:bg-slate-50 transition-colors font-mono font-medium">
                        {patient.telephone || '—'}
                      </td>

                      <td className="px-3 border-r border-[rgba(167,243,208,0.6)] bg-[rgba(236,253,245,0.4)] group-hover:bg-[rgba(236,253,245,0.7)] transition-colors text-[#475569] text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-[#059669]" />
                          <span className="font-medium truncate max-w-[120px]">{patient.prescripteur || 'Consultation Externe'}</span>
                        </div>
                      </td>

                      <td className="px-3 border-r border-[rgba(196,181,253,0.5)] bg-[rgba(245,243,255,0.4)] group-hover:bg-[rgba(245,243,255,0.7)] transition-colors">
                        {patientDossiers.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#6D28D9]">
                              {patientDossiers.length} bilan(s)
                            </span>
                            {lastDossier && (
                              <span
                                className={`inline-flex items-center gap-1 h-[20px] px-1.5 rounded-[4px] font-bold text-[10px] border ${
                                  lastDossier.statut === 'VALIDE' || lastDossier.statut === 'IMPRIME'
                                    ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                                    : 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                                }`}
                              >
                                {lastDossier.statut === 'VALIDE' || lastDossier.statut === 'IMPRIME' ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                    <span>Validé</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                                    <span>À signer</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Aucun dossier</span>
                        )}
                      </td>

                      <td className="px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPatient(patient.id)}
                            className="inline-flex items-center justify-center h-[28px] px-2.5 gap-1.5 text-[11px] font-bold text-[#6941C6] bg-white border border-[#EAE4FF] hover:bg-[#F2EEFF] rounded-[6px] shadow-sm transition-colors cursor-pointer"
                            title="Ouvrir le dossier patient"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Ouvrir</span>
                          </button>

                          <button
                            onClick={() => onOpenNewDossierForPatient(patient.id)}
                            className="inline-flex items-center justify-center h-[28px] px-2.5 gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 rounded-[6px] shadow-sm transition-opacity cursor-pointer"
                            title="Nouveau Bilan pour ce patient"
                          >
                            <FilePlus className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Bilan</span>
                          </button>

                          {onDeletePatient && (
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la fiche de ${patient.nom} ${patient.prenom} ?`)) {
                                  onDeletePatient(patient.id);
                                }
                              }}
                              className="inline-flex items-center justify-center h-[28px] w-[28px] text-red-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
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
                  <td colSpan={7} className="py-12 text-center text-slate-400">
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
