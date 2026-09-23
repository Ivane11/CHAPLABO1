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
} from 'lucide-react';
import { DossierReport, Patient, ReportStatus } from '../../types';

interface ReportsViewProps {
  dossiers: DossierReport[];
  patients: Patient[];
  onOpenReportValidation: (dossier: DossierReport) => void;
  onPreviewReport: (dossier: DossierReport) => void;
  onPrintReport: (dossier: DossierReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  dossiers,
  patients,
  onOpenReportValidation,
  onPreviewReport,
  onPrintReport,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const filteredDossiers = dossiers.filter((d) => {
    const patient = patients.find((p) => p.id === d.patientId);
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

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Gestion & Validation Biologique des Rapports
          </h2>
          <p className="text-xs text-slate-500">
            Suivi du cycle de vie des bulletins, validation médicale avec signature électronique et verrouillage définitif (ISO 15189).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Contrôle & Traçabilité LIS</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n° de dossier, patient, type de bilan, prescripteur..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none cursor-pointer"
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
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">N° Dossier</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient & Identité</th>
                <th className="py-3 px-4">Type de Bilan</th>
                <th className="py-3 px-4 text-center">Statut Biologique</th>
                <th className="py-3 px-4">Validateur Référent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((dossier) => {
                  const patient = patients.find((p) => p.id === dossier.patientId);

                  return (
                    <tr
                      key={dossier.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onPreviewReport(dossier)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {dossier.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {dossier.date}
                      </td>
                      <td className="py-3.5 px-4">
                        {patient ? (
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {patient.nom} {patient.prenom}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {patient.id} · {patient.age} ans ({patient.sexe})
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Patient inconnu</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {dossier.nomExamen}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Prescrit par : {dossier.prescripteur}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                            dossier.statut === 'VALIDE' || dossier.statut === 'IMPRIME'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : dossier.statut === 'A_VALIDER'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {dossier.statut === 'VALIDE' || dossier.statut === 'IMPRIME' ? (
                            <>
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Validé</span>
                            </>
                          ) : dossier.statut === 'A_VALIDER' ? (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>À valider</span>
                            </>
                          ) : (
                            <span>{dossier.statut}</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {dossier.biologisteValidateur || 'En attente'}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenReportValidation(dossier)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                            title="Gérer la validation biologique"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Valider</span>
                          </button>

                          <button
                            onClick={() => onPreviewReport(dossier)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Aperçu du compte rendu"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onPrintReport(dossier)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                            title="Imprimer le compte rendu"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Imprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
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
