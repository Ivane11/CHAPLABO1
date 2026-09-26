import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  FileCheck,
  ShieldCheck,
  Lock,
  Unlock,
  ChevronsUpDown,
  Stethoscope,
  Check,
} from 'lucide-react';
import { DossierReport, Patient, ReportStatus } from '../../types';

interface ReportsViewProps {
  dossiers: DossierReport[];
  patients: Patient[];
  onOpenReportValidation: (dossier: DossierReport) => void;
  onPreviewReport: (dossier: DossierReport) => void;
  onPrintReport: (dossier: DossierReport) => void;
  onViewDossier?: (dossier: DossierReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  dossiers,
  patients,
  onOpenReportValidation,
  onPreviewReport,
  onPrintReport,
  onViewDossier,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const patientsMap = React.useMemo(() => {
    const map = new Map<string, Patient>();
    patients.forEach(p => map.set(p.id, p));
    return map;
  }, [patients]);

  const filteredDossiers = React.useMemo(() => {
    return dossiers.filter((d) => {
      const patient = patientsMap.get(d.patientId);
      const patientName = patient ? `${patient.nom} ${patient.prenom}`.toLowerCase() : '';

      const matchesSearch =
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.nomExamen.toLowerCase().includes(search.toLowerCase()) ||
        d.prescripteur.toLowerCase().includes(search.toLowerCase()) ||
        patientName.includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || d.statut === statusFilter;
      const matchesDate = !dateFilter || d.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [dossiers, patientsMap, search, statusFilter, dateFilter]);

  return (
    <div className="space-y-6">


      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 glass-panel p-4 rounded-[20px] shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n° de dossier, patient, type de bilan, prescripteur..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl text-[13px] font-medium text-slate-700 outline-none cursor-pointer transition-all appearance-none pr-8 relative"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="ALL">Tous les statuts ({dossiers.length})</option>
            <option value="BROUILLON">Brouillons</option>
            <option value="EN_COURS">En cours de traitement</option>
            <option value="A_VALIDER">À valider par biologiste</option>
            <option value="VALIDE">Validés & Verrouillés</option>
            <option value="IMPRIME">Imprimés</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl text-[13px] font-medium text-slate-700 outline-none transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-panel rounded-[24px] shadow-sm overflow-hidden border border-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="h-[38px] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#4F46E5] after:via-[#06B6D4] after:to-[#10B981]">
                {[
                  { label: 'N° Dossier', bg: 'bg-[#EEF2FF]', text: 'text-[#4338CA]' },
                  { label: 'Date', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]' },
                  { label: 'Patient & Identité', bg: 'bg-[#F1F5F9]', text: 'text-[#334155]' },
                  { label: 'Type de Bilan', bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]' },
                  { label: 'Prescripteur', bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' },
                  { label: 'Statut Biologique', bg: 'bg-white', text: 'text-slate-500' },
                  { label: 'Validateur', bg: 'bg-white', text: 'text-slate-500' },
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
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((dossier) => {
                  const patient = patientsMap.get(dossier.patientId);

                  // Row Theme Chrysalide
                  let rowBg = 'bg-gradient-to-r from-slate-50/65 to-white/90';
                  let leftBorder = 'border-[#CBD5E1]';
                  let tagStyle = 'bg-slate-100 text-slate-600 border border-slate-200';

                  if (dossier.nomExamen.includes('Paludisme') || dossier.nomExamen.includes('Goutte') || dossier.nomExamen.includes('Hématologie')) {
                    rowBg = 'bg-gradient-to-r from-[rgba(245,243,255,0.65)] to-[rgba(255,255,255,0.9)]';
                    leftBorder = 'border-[#8B5CF6]';
                    tagStyle = 'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]';
                  } else if (dossier.nomExamen.includes('Prénatal') || dossier.nomExamen.includes('Maternité') || dossier.nomExamen.includes('BPN')) {
                    rowBg = 'bg-gradient-to-r from-[rgba(255,241,242,0.65)] to-[rgba(255,255,255,0.9)]';
                    leftBorder = 'border-[#F43F5E]';
                    tagStyle = 'bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]';
                  } else if (dossier.nomExamen.includes('Métabolique') || dossier.nomExamen.includes('Rénal') || dossier.nomExamen.includes('Biochimie')) {
                    rowBg = 'bg-gradient-to-r from-[rgba(240,249,255,0.7)] to-[rgba(255,255,255,0.9)]';
                    leftBorder = 'border-[#06B6D4]';
                    tagStyle = 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]';
                  } else if (dossier.nomExamen.includes('Électrophorèse') || dossier.nomExamen.includes('Pédiatrique')) {
                    rowBg = 'bg-gradient-to-r from-[rgba(254,243,199,0.4)] to-[rgba(255,255,255,0.9)]';
                    leftBorder = 'border-[#F59E0B]';
                    tagStyle = 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]';
                  }

                  return (
                    <tr
                      key={dossier.id}
                      title={patient?.id}
                      className={`group relative h-[46px] border-b border-[#EDF2F7] hover:brightness-95 hover:saturate-110 transition-all ${rowBg} border-l-[4px] ${leftBorder}`}
                    >
                      <td className="p-0 border-r border-[rgba(99,102,241,0.15)] bg-[rgba(99,102,241,0.04)] px-3 group-hover:bg-[rgba(99,102,241,0.08)] transition-colors">
                        <span className="bg-[#EEF2FF] text-[#4F46E5] font-mono text-[11px] font-bold px-2 py-1 rounded-[6px]">
                          {dossier.id}
                        </span>
                      </td>

                      <td className="px-3 border-r border-[#EEF2F6] bg-[#FFFFFF] text-[#64748B] text-[12px] group-hover:bg-slate-50 transition-colors">
                        {dossier.date.replace(/-/g, '/')}
                      </td>

                      <td className="px-3 border-r border-[rgba(203,213,225,0.6)] bg-[rgba(241,245,249,0.5)] group-hover:bg-[rgba(241,245,249,0.8)] transition-colors">
                        {patient ? (
                          <div className="flex items-center">
                            <span className="font-bold text-[#0F172A]">{patient.nom} {patient.prenom}</span>
                            <span className="bg-[rgba(139,92,246,0.12)] text-[#7C3AED] text-[10px] px-1.5 py-0.5 rounded-[4px] ml-2 font-bold">
                              {patient.age}a ({patient.sexe})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Inconnu</span>
                        )}
                      </td>

                      <td className="px-3 border-r border-[rgba(196,181,253,0.5)] bg-[rgba(245,243,255,0.4)] group-hover:bg-[rgba(245,243,255,0.7)] transition-colors">
                        <span className={`inline-block px-2 py-1 rounded-[6px] text-[11px] font-bold ${tagStyle}`}>
                          {dossier.nomExamen}
                        </span>
                      </td>

                      <td className="px-3 border-r border-[rgba(167,243,208,0.6)] bg-[rgba(236,253,245,0.4)] group-hover:bg-[rgba(236,253,245,0.7)] transition-colors text-[#475569] text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-[#059669]" />
                          <span className="font-medium truncate max-w-[120px]">{dossier.prescripteur}</span>
                        </div>
                      </td>

                      <td className="px-3 border-r border-[#E2E8F0]/70">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center gap-1.5 h-[24px] px-2 rounded-full font-bold text-[11px] border ${
                              dossier.statut === 'VALIDE' || dossier.statut === 'IMPRIME'
                                ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                                : dossier.statut === 'A_VALIDER'
                                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            {dossier.statut === 'VALIDE' || dossier.statut === 'IMPRIME' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                <span>Validé</span>
                              </>
                            ) : dossier.statut === 'A_VALIDER' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                                <span>À signer</span>
                              </>
                            ) : (
                              <span>{dossier.statut}</span>
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 border-r border-[#E2E8F0]/70 text-[#334155] text-[12px] font-medium">
                        {dossier.biologisteValidateur ? (
                          <span className="truncate max-w-[100px] inline-block">{dossier.biologisteValidateur}</span>
                        ) : (
                          <span className="text-slate-400 italic">En attente</span>
                        )}
                      </td>

                      <td className="px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onViewDossier && (
                            <button
                              onClick={() => onViewDossier(dossier)}
                              className="w-[28px] h-[28px] flex items-center justify-center text-slate-500 hover:text-[#5B46F6] hover:bg-[#EEEDFC] rounded-sm transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onPrintReport(dossier)}
                            className="w-[28px] h-[28px] flex items-center justify-center text-slate-500 hover:text-[#059669] hover:bg-[#D1FAE5] rounded-sm transition-colors"
                            title="Imprimer le rapport"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenReportValidation(dossier)}
                            className="inline-flex items-center justify-center h-[28px] px-3 gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 rounded-[6px] shadow-sm transition-opacity ml-1"
                            title="Gérer la validation"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Viser</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Aucun dossier ne correspond à vos filtres.
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
