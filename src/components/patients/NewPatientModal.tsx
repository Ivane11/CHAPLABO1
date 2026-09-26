import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Patient, Prescriber } from '../../types';
import { generatePatientId } from '../../utils/idGenerator';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescribers: Prescriber[];
  patients: Patient[];
  onSavePatient: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  prescribers,
  patients,
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
      setErrorMessage('Veuillez renseigner le nom et le prénom du patient.');
      return;
    }

    const newId = generatePatientId(patients);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 select-none">
      <div className="bg-white rounded-sm w-full max-w-[600px] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
          <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide">
            Nouveau Patient
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="m-3 p-2 bg-red-50 border border-red-200 text-[12px] font-semibold text-red-700 flex items-center gap-2 rounded-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col text-[12px]">
          <div className="p-3 space-y-4">
            
            {/* Section 1: IDENTIFICATION */}
            <div className="border-l-4 border-blue-600 pl-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Ex: KOUASSI"
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none uppercase"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Prénom(s) *</label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                      setErrorMessage('');
                    }}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Sexe *</label>
                  <select
                    value={sexe}
                    onChange={(e) => setSexe(e.target.value as any)}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Âge (ans) *</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Date naissance</label>
                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Téléphone</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: PRESCRIPTION */}
            <div className="border-l-4 border-purple-600 pl-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Médecin prescripteur</label>
                  <input
                    type="text"
                    value={prescripteur}
                    onChange={(e) => setPrescripteur(e.target.value)}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-700">Service demandeur</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="h-7 px-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Consultation Externe">Consultation Externe</option>
                    <option value="Urgences">Urgences</option>
                    <option value="Maternité">Maternité</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Médecine Générale">Médecine Générale</option>
                    <option value="Chirurgie">Chirurgie</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Réanimation">Réanimation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: RENSEIGNEMENTS CLINIQUES */}
            <div className="border-l-4 border-orange-600 pl-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-700">Renseignements cliniques</label>
                <textarea
                  rows={3}
                  value={renseignementsCliniques}
                  onChange={(e) => setRenseignementsCliniques(e.target.value)}
                  placeholder="Signes fonctionnels, antécédents..."
                  className="w-full p-2 border border-[#DEE2E6] rounded-sm focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-5 text-[12px] font-bold text-white bg-rose-600 rounded-full hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="h-8 px-5 text-[12px] font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
