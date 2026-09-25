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
          <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 font-sans">
            Catalogue Médical des Analyses & Références
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Répertoire officiel des examens de biologie médicale, unités SI et intervalles de référence par âge et sexe.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-slate-600 glass-panel px-4 py-2 rounded-xl shadow-sm">
          <TestTubes className="w-4 h-4 text-[#6941C6]" />
          <span className="font-extrabold text-slate-900">{catalog.length} analyses répertoriées</span>
        </div>
      </div>

      {/* Filter and Categories Bar */}
      <div className="glass-panel p-5 rounded-[24px] space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une analyse par nom, code, paramètre (ex: Hémoglobine, Glycémie, Créatinine, Ag HBs...)"
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 focus:border-[#6941C6]/50 focus:ring-2 focus:ring-[#6941C6]/20 rounded-xl text-[13px] text-slate-900 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer smooth-press ${
              selectedCategory === 'ALL'
                ? 'bg-[#5832E5] text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
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
                className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer smooth-press ${
                  selectedCategory === cat
                    ? 'bg-[#6941C6] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-[#F2EEFF] hover:text-[#6941C6] border border-slate-200/60 hover:border-[#EAE4FF]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="glass-panel rounded-[24px] p-6 shadow-xs hover:shadow-sm transition-all space-y-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold text-[#6941C6] bg-[#F2EEFF] px-2.5 py-1 rounded-md border border-[#EAE4FF]">
                    {exam.code}
                  </span>
                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                    {exam.category}
                  </span>
                </div>
                <h3 className="text-[15px] font-extrabold text-slate-900 mt-2 leading-snug group-hover:text-[#6941C6] transition-colors">
                  {exam.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] font-mono font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  {exam.price} FCFA
                </span>
                <button
                  type="button"
                  onClick={() => onToggleExamActive(exam.id)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer smooth-press ${
                    exam.active ? 'bg-[#059669]' : 'bg-slate-200'
                  }`}
                  title={exam.active ? 'Actif dans le laboratoire' : 'Désactivé'}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                      exam.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {exam.description && (
              <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                {exam.description}
              </p>
            )}

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[12px] text-slate-500 font-mono font-medium">
              <span>Échantillon : <span className="font-bold text-slate-700">{exam.sampleTypeDefault}</span></span>
              <span>
                <span className="font-bold text-[#6941C6]">{exam.sections.reduce((acc, s) => acc + s.parameters.length, 0)}</span> paramètres
              </span>
            </div>

            {/* Parameters snippet preview */}
            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-2 mt-1">
              {exam.sections[0]?.parameters.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-[12px] text-slate-700"
                >
                  <span className="font-bold truncate pr-2">{p.name}</span>
                  <span className="font-mono text-slate-500 shrink-0 font-medium bg-white px-2 py-0.5 rounded border border-slate-200/60">
                    {p.reference?.min !== undefined && p.reference?.max !== undefined
                      ? `${p.reference.min} – ${p.reference.max} ${p.unit || ''}`
                      : p.reference?.expected || p.unit || '—'}
                  </span>
                </div>
              ))}
              {exam.sections[0]?.parameters.length > 3 && (
                <div className="text-[11px] text-[#6941C6] font-bold pt-1.5 flex items-center gap-1">
                  <span>+ {exam.sections[0].parameters.length - 3} autres paramètres dans ce bilan</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
