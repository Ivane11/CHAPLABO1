import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Tag,
  TestTubes,
} from 'lucide-react';
import { ExamCategory, ExamDefinition } from '../../types';

interface ExamsCatalogViewProps {
  catalog: ExamDefinition[];
  onToggleExamActive: (examId: string) => void;
}

export const ExamsCatalogView: React.FC<ExamsCatalogViewProps> = ({
  catalog,
  onToggleExamActive,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: ExamCategory[] = [
    'Hématologie',
    'Biochimie',
    'Sérologie',
    'Parasitologie',
    'Hormonologie',
    'Microbiologie',
  ];

  const filteredExams = catalog.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(search.toLowerCase()) ||
      exam.code.toLowerCase().includes(search.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(search.toLowerCase())) ||
      exam.sections.some((s) =>
        s.parameters.some((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      );

    const matchesCategory =
      selectedCategory === 'ALL' || exam.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Catalogue Médical des Analyses & Références
          </h2>
          <p className="text-xs text-slate-500">
            Répertoire officiel des examens de biologie médicale, unités SI et intervalles de référence par âge et sexe.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <TestTubes className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-900">{catalog.length} analyses répertoriées</span>
        </div>
      </div>

      {/* Filter and Categories Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une analyse par nom, code, paramètre (ex: Hémoglobine, Glycémie, Créatinine, Ag HBs...)"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-xs text-slate-900 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Toutes ({catalog.length})
          </button>
          {categories.map((cat) => {
            const count = catalog.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                    {exam.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {exam.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                  {exam.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-800">
                  {exam.price} FCFA
                </span>
                <button
                  type="button"
                  onClick={() => onToggleExamActive(exam.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    exam.active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  title={exam.active ? 'Actif dans le laboratoire' : 'Désactivé'}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      exam.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {exam.description && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {exam.description}
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Échantillon : {exam.sampleTypeDefault}</span>
              <span>
                {exam.sections.reduce((acc, s) => acc + s.parameters.length, 0)} paramètres
              </span>
            </div>

            {/* Parameters snippet preview */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
              {exam.sections[0]?.parameters.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-[11px] text-slate-700"
                >
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="font-mono text-slate-500 ml-2 shrink-0">
                    {p.reference?.min !== undefined && p.reference?.max !== undefined
                      ? `${p.reference.min}–${p.reference.max} ${p.unit || ''}`
                      : p.reference?.expected || p.unit || '—'}
                  </span>
                </div>
              ))}
              {exam.sections[0]?.parameters.length > 3 && (
                <div className="text-[10px] text-blue-600 font-semibold pt-1">
                  + {exam.sections[0].parameters.length - 3} autres paramètres dans ce bilan
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
