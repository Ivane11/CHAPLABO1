import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Stethoscope,
  Activity,
  ShieldCheck,
  CheckCircle,
  FlaskConical,
  User,
  Clock,
  Sparkles,
  Droplet,
  ShieldAlert,
  Sliders,
  Layers,
} from 'lucide-react';
import { DossierReport, Patient } from '../../types';

interface AnatomyViewProps {
  patients: Patient[];
  dossiers: DossierReport[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onPrintOfficial: (type: 'OFFICIAL_A4' | 'ISO_DOUBLE_A5', patient: Patient, dossier: DossierReport) => void;
}

export const AnatomyView: React.FC<AnatomyViewProps> = ({
  patients,
  dossiers,
  activePatientId,
  onSelectPatient,
  onPrintOfficial,
}) => {
  const currentPatient =
    patients.find((p) => p.id === activePatientId) || patients[0];

  const patientDossiers = dossiers.filter(
    (d) => d.patientId === currentPatient?.id
  );
  const latestDossier = patientDossiers[patientDossiers.length - 1];

  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [activeOrganFocus, setActiveOrganFocus] = useState<string>(
    'Hématologie & Système Vasculaire'
  );
  const [activeFocusNote, setActiveFocusNote] = useState<string>(
    'Prélèvement veineux sous EDTA conforme. Surveillance de la formule érythrocytaire et plaquettaire.'
  );

  // Extract biological metrics from patient's actual latest dossier
  const nfsHb = latestDossier?.resultats?.NFS_HGB ?? '-';
  const nfsWbc = latestDossier?.resultats?.NFS_WBC ?? '-';
  const nfsPlt = latestDossier?.resultats?.NFS_PLT ?? '-';
  const crpVal = latestDossier?.resultats?.CRP_VAL ?? '-';

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Console Biomédicale & Cartographie des Organes Cibles
              </h2>
              <span className="text-[10px] font-bold text-orange-700 bg-orange-100/70 border border-orange-200 px-2 py-0.5 rounded-full uppercase">
                ISO 15189
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Exploration topographique des résultats biologiques par système anatomique
            </p>
          </div>
        </div>

        {/* Live Patient Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Patient Actif :
          </span>
          <select
            value={currentPatient?.id}
            onChange={(e) => onSelectPatient(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-orange-500 outline-none cursor-pointer shadow-2xs"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom} (#{p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Column Futuristic Anatomy Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= COLONNE GAUCHE (3.8 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Résultats Diagnostiques
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {patientDossiers.length} analyse(s) liée(s)
            </span>
          </div>

          {/* Mini Cards: Consultation & Protocol */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Stethoscope className="w-3.5 h-3.5 text-orange-600" />
                <span>CONSULTATION</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-2">
                {latestDossier?.date || 'N/A'}
              </div>
              <div className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                {latestDossier?.prescripteur || 'N/A'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>PROTOCOLE</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-2">
                ACCRÉDITÉ LIS
              </div>
              <div className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                ISO 15189 Traçabilité
              </div>
            </div>
          </div>

          {/* Lab Screening Card */}
          <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-5 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold tracking-wider">
              <span className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-sky-200" />
                LAB SCREENING ANALYTIQUE
              </span>
              <CheckCircle className="w-4 h-4 text-sky-200" />
            </div>

            <div className="text-[11px] font-medium text-sky-100">
              {latestDossier?.date || 'N/A'} · {latestDossier?.sampleType || 'N/A'}
            </div>

            <div className="text-sm font-extrabold text-white leading-snug">
              {latestDossier?.nomExamen || 'Aucun Examen'}
            </div>

            <div className="pt-2 border-t border-sky-400/30 flex items-center justify-between text-[11px]">
              <span className="text-sky-100">Validation Biologiste :</span>
              <span className="bg-sky-900/60 text-sky-100 font-extrabold px-2 py-0.5 rounded">
                {latestDossier?.statut === 'VALIDE' ? 'CERTIFIÉ CONFORME' : latestDossier?.statut || 'EN COURS'}
              </span>
            </div>
          </div>

          {/* Timeline of dossiers */}
          <div>
            <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Historique des Dossiers du Patient
            </div>
            <div className="space-y-2.5">
              {patientDossiers.map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-300 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-blue-600">
                      {d.id}
                    </span>
                    <span className="text-slate-400 font-mono">{d.date}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {d.nomExamen}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Dr. {d.prescripteur}</span>
                    <span className="font-semibold text-emerald-600">
                      {d.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLONNE CENTRALE (ANATOMIE 4.4 cols) ================= */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col items-center justify-between min-h-[580px] relative overflow-hidden">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.45))}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-orange-600 flex items-center justify-center shadow-xs text-xs font-bold transition-colors cursor-pointer"
              title="Agrandir"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.75))}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-orange-600 flex items-center justify-center shadow-xs text-xs font-bold transition-colors cursor-pointer"
              title="Réduire"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-orange-600 flex items-center justify-center shadow-xs text-xs font-bold transition-colors cursor-pointer"
              title="Réinitialiser"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Organ Focus Label */}
          <div className="self-start z-20 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-amber-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Focus : {activeOrganFocus}</span>
          </div>

          {/* Holographic Silhouette Vector SVG Stage */}
          <div
            className="w-full h-[440px] flex items-center justify-center relative transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 380 720" className="h-full w-auto select-none drop-shadow-sm">
              {/* Biometric Guide Grid */}
              <g stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6">
                <line x1="20" y1="210" x2="360" y2="210" />
                <line x1="20" y1="350" x2="360" y2="350" />
                <line x1="20" y1="490" x2="360" y2="490" />
                <line x1="190" y1="30" x2="190" y2="670" stroke="#94a3b8" strokeDasharray="2 4" />
              </g>

              {/* Anatomical Human Vector Body */}
              <g fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {/* Head & Neck */}
                <path d="M190 50 C175 50 166 62 166 80 C166 98 175 110 190 110 C205 110 214 98 214 80 C214 62 205 50 190 50 Z" />
                <path d="M180 110 L180 128 M200 110 L200 128" />

                {/* Torso & Shoulders (Hematology / Chest) */}
                <path d="M180 128 L155 138 C145 144 138 158 135 182 L155 202 L190 207 L225 202 L245 182 C242 158 235 144 225 138 L200 128" />
                <path d="M155 202 L150 272 L165 297 L190 302 L215 297 L230 272 L225 202" />

                {/* Arms (Venipuncture tubes) */}
                <path d="M135 182 L120 248 L108 338 C106 350 114 355 120 348 L134 278 L145 212" />
                <path d="M245 182 L260 248 L272 338 C274 350 266 355 260 348 L246 278 L235 212" />

                {/* Pelvis & Lower Abdomen */}
                <path d="M150 272 L145 328 L165 352 L190 356 L215 352 L235 328 L230 272" />

                {/* Legs */}
                <path d="M235 328 L248 428 L225 482 L205 482 L194 428 L190 356 L215 352 Z" />
                <path d="M225 482 L230 582 L235 638 C237 650 227 654 220 646 L208 582 L205 482" />
                <path d="M155 482 L150 582 L145 638 C143 650 153 654 160 646 L172 582 L175 482" />

                {/* Highlighted Right Thigh and Joint */}
                <path
                  d="M145 328 L130 428 L155 482 L175 482 L186 428 L190 356 L165 352 Z"
                  fill="#facc15"
                  fillOpacity="0.4"
                  stroke="#eab308"
                  strokeWidth="2.2"
                />
              </g>

              {/* Pulsing Diagnostic Hotspots */}
              {/* 1. Neuro (Head) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveOrganFocus('Neurologie & Céphalées');
                  setActiveFocusNote('Bilan électrolytique et état d’hydratation conformes.');
                }}
              >
                <circle cx="190" cy="75" r="16" fill="rgba(2,132,199,0.2)" />
                <circle cx="190" cy="75" r="5" fill="#0284c7" />
              </g>

              {/* 2. Hématologie (Thorax) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveOrganFocus('Hématologie & Hémogramme');
                  setActiveFocusNote(`Hb: ${nfsHb} g/dL · Leucocytes: ${nfsWbc} G/L · Plaquettes: ${nfsPlt} G/L.`);
                }}
              >
                <circle cx="165" cy="162" r="18" fill="rgba(234,88,12,0.25)" />
                <circle cx="165" cy="162" r="6" fill="#ea580c" />
              </g>

              {/* 3. Métabolisme (Abdomen / Foie) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveOrganFocus('Métabolisme & Reins');
                  setActiveFocusNote('Exploration glycémie à jeun et filtration rénale.');
                }}
              >
                <circle cx="205" cy="242" r="18" fill="rgba(234,88,12,0.25)" />
                <circle cx="205" cy="242" r="6" fill="#ea580c" />
              </g>

              {/* 4. Prélèvement veineux (Bras) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveOrganFocus('Voie de Ponction Veineuse');
                  setActiveFocusNote('Ponction au pli du coude sans hématome. Sang total EDTA & tube sec.');
                }}
              >
                <circle cx="270" cy="348" r="16" fill="rgba(2,132,199,0.2)" />
                <circle cx="270" cy="348" r="5" fill="#0284c7" />
              </g>

              {/* 5. Articulation & Genou */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveOrganFocus('Articulation & Cuisse droite (Focus)');
                  setActiveFocusNote('Absence de signes inflammatoires majeurs (CRP normale).');
                }}
              >
                <circle cx="155" cy="482" r="18" fill="rgba(234,88,12,0.3)" />
                <circle cx="155" cy="482" r="6" fill="#ea580c" />
              </g>
            </svg>
          </div>

          {/* Bottom Stage Status Capsule */}
          <div className="w-full mt-3 bg-[#5832E5] text-white p-3 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{activeOrganFocus}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {activeFocusNote}
            </p>
          </div>
        </div>

        {/* ================= COLONNE DROITE (3.8 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Identity & Biomédical Conclusion Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {currentPatient?.nom || 'Aucun'} {currentPatient?.prenom || 'Patient'}
                </h2>
                <div className="text-[11px] font-bold text-slate-400 mt-0.5 font-mono">
                  Dossier #{currentPatient?.id || '-'} · {currentPatient?.age || '-'} ans · {currentPatient?.sexe || '-'}
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                DOSSIER ACTIF
              </span>
            </div>

            {/* Clinical Diagnosis Line */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Conclusion Biomédicale Certifiée :
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                <span className="text-orange-600 font-extrabold mr-1">[BIO-ISO]</span>
                {latestDossier?.observations || (latestDossier ? 'Bilan biologique conforme · Absence d’anomalie critique immédiate.' : 'Aucune donnée.')}
              </p>
            </div>

            {/* Prescriber Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-blue-600 uppercase">
                    Prescription Soins
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    {latestDossier?.prescripteur || currentPatient?.prescripteur || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-400 font-bold uppercase">
                  Validé par
                </div>
                <div className="text-xs font-extrabold text-emerald-600">
                  {latestDossier?.biologisteValidateur || (latestDossier ? 'Dr. Kouassi' : 'N/A')}
                </div>
              </div>
            </div>
          </div>

          {/* Biological Metrics Grid (Real values from dossier) */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Constantes & Métriques Biologiques
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              4 paramètres clés
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Hémoglobine */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-extrabold text-slate-900">Hémoglobine</strong>
                <Droplet className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Norme : 12.0–17.5 g/dL</span>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900">{nfsHb}</span>
                  <small className="text-xs text-slate-500 font-bold"> g/dL</small>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                  Normal
                </span>
              </div>
            </div>

            {/* Leucocytes */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-extrabold text-slate-900">Leucocytes</strong>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Norme : 4.0–10.0 G/L</span>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900">{nfsWbc}</span>
                  <small className="text-xs text-slate-500 font-bold"> G/L</small>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                  Normal
                </span>
              </div>
            </div>

            {/* Plaquettes */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-extrabold text-slate-900">Plaquettes</strong>
                <Layers className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Norme : 150–400 G/L</span>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900">{nfsPlt}</span>
                  <small className="text-xs text-slate-500 font-bold"> G/L</small>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                  Normal
                </span>
              </div>
            </div>

            {/* CRP */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-extrabold text-slate-900">CRP</strong>
                <Activity className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Norme : &lt; 5.0 mg/L</span>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900">{crpVal}</span>
                  <small className="text-xs text-slate-500 font-bold"> mg/L</small>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                  Normal
                </span>
              </div>
            </div>
          </div>

          {/* Official Printing Triggers (High Quality A4 & Double A5) */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (currentPatient && latestDossier) {
                  onPrintOfficial('OFFICIAL_A4', currentPatient, latestDossier);
                }
              }}
              className="w-full bg-white hover:bg-orange-50/50 p-3 rounded-2xl border border-slate-200 hover:border-orange-300 shadow-2xs flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 group-hover:text-orange-600">
                <Printer className="w-4 h-4 text-red-500" />
                <span>Imprimer Bilan Prénatal & NFS</span>
              </div>
              <span className="bg-[#5832E5] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                A4 PORTRAIT
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentPatient && latestDossier) {
                  onPrintOfficial('ISO_DOUBLE_A5', currentPatient, latestDossier);
                }
              }}
              className="w-full bg-white hover:bg-sky-50/50 p-3 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-2xs flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 group-hover:text-sky-600">
                <Sliders className="w-4 h-4 text-sky-500" />
                <span>Fiche Traçabilité Méthodes (ISO 15189)</span>
              </div>
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                DOUBLE A5
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
