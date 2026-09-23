import React, { useState } from 'react';
import { X, UserPlus, Check, AlertCircle } from 'lucide-react';
import { Patient, Prescriber } from '../../types';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescribers: Prescriber[];
  existingPatientsCount: number;
  onSavePatient: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  prescribers,
  existingPatientsCount,
  onSavePatient,
}) => {
  if (!isOpen) return null;

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState<number>(30);
  const [dateNaissance, setDateNaissance] = useState('');
  const [telephone, setTelephone] = useState('+225 ');
  const [prescripteur, setPrescripteur] = useState(prescribers[0]?.nom || 'Dr. Amadou Fall');
  const [service, setService] = useState('Consultation Externe');
  const [prelevement, setPrelevement] = useState('Sang total EDTA + Sérum');
  const [renseignementsCliniques, setRenseignementsCliniques] = useState('');
  const [groupeSanguin, setGroupeSanguin] = useState('O (Rhésus Positif)');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) {
      setErrorMessage('Veuillez renseigner le nom et le prénom du patient pour continuer.');
      return;
    }

    const newId = `CHP-2026-${String(existingPatientsCount + 1).padStart(5, '0')}`;
    const newPatient: Patient = {
      id: newId,
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      sexe,
      age: Number(age) || 30,
      dateNaissance,
      telephone,
      prescripteur,
      service,
      prelevement,
      renseignementsCliniques,
      groupeSanguin,
      dateCreation: new Date().toISOString().slice(0, 10),
    };

    onSavePatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md select-none no-print">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-slate-200/90 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-[#EEEDFC]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEEDFC] text-[#5B46F6] border border-[#D8D4FC] flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
                Nouveau Patient
              </h3>
              <p className="text-xs text-slate-400">
                Génération automatique du dossier médical et de l'identifiant biométrique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom de famille *
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Ex: KOUASSI"
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] focus:ring-3 focus:ring-[#818CF8]/20 rounded-2xl px-3.5 py-2 text-xs text-slate-900 font-extrabold uppercase outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prénom(s) *
              </label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => {
                  setPrenom(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Ex: Béranger"
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] focus:ring-3 focus:ring-[#818CF8]/20 rounded-2xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sexe *
              </label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value as any)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer focus:border-[#6366F1]"
              >
                <option value="M">Masculin (M)</option>
                <option value="F">Féminin (F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Âge (ans) *
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date Naissance
              </label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-2.5 py-2 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Téléphone mobile
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+225 07..."
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs font-mono text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Groupe Sanguin
              </label>
              <select
                value={groupeSanguin}
                onChange={(e) => setGroupeSanguin(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
              >
                <option value="O (Rhésus Positif)">O (Rhésus Positif)</option>
                <option value="A (Rhésus Positif)">A (Rhésus Positif)</option>
                <option value="B (Rhésus Positif)">B (Rhésus Positif)</option>
                <option value="AB (Rhésus Positif)">AB (Rhésus Positif)</option>
                <option value="O (Rhésus Négatif)">O (Rhésus Négatif)</option>
                <option value="A (Rhésus Négatif)">A (Rhésus Négatif)</option>
                <option value="B (Rhésus Négatif)">B (Rhésus Négatif)</option>
                <option value="AB (Rhésus Négatif)">AB (Rhésus Négatif)</option>
                <option value="Non déterminé">Non déterminé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Médecin Prescripteur
              </label>
              <input
                type="text"
                value={prescripteur}
                onChange={(e) => setPrescripteur(e.target.value)}
                placeholder="Dr. Nom ou Service"
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Demandeur
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Maternité, Pédiatrie, Externe..."
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl px-3.5 py-2 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Renseignement Clinique / Motif d'analyse
            </label>
            <textarea
              rows={2}
              value={renseignementsCliniques}
              onChange={(e) => setRenseignementsCliniques(e.target.value)}
              placeholder="Signes fonctionnels, antécédents, fièvre inexpliquée, suivi prénatal..."
              className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-[#6366F1] rounded-2xl p-3 text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-full text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enregistrer le Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
