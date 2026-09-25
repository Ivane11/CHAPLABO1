import re

# 1. Fix initialData.ts
with open('src/data/initialData.ts', 'r') as f:
    content = f.read()

# Add automateType: '' to dossiers that are missing it
content = re.sub(r'(observations:\s*.*?,)\n(\s*autoInterpretation:)', r'\1\n      automateType: "",\n\2', content)
with open('src/data/initialData.ts', 'w') as f:
    f.write(content)

# 2. Fix ReportPrintModal.tsx
with open('src/components/print/ReportPrintModal.tsx', 'r') as f:
    content = f.read()

# Make sure we have original
import subprocess
subprocess.run(['git', 'checkout', 'src/components/print/ReportPrintModal.tsx'])

with open('src/components/print/ReportPrintModal.tsx', 'r') as f:
    orig = f.read()

# We want to replace the whole return statement and everything above it, except the exam renderer.
m_exam = re.search(r'(  const renderExamResults = \(examDef: ExamDefinition\) => \{.*?  \};\n)', orig, re.DOTALL)
exam_logic = m_exam.group(1) if m_exam else ""

# Extract Layout 1 (A4)
m_a4 = re.search(r'\{\/\* ================= LAYOUT 1: A4 PORTRAIT OFFICIEL ================= \*\/\}\n\s*\{activePrintLayout === \'OFFICIAL_A4\' && \((.*?)\)\}', orig, re.DOTALL)
layout_a4 = m_a4.group(1).strip() if m_a4 else ""

# Extract Layout 2 (A5)
m_a5 = re.search(r'\{\/\* ================= LAYOUT 2: DOUBLE A5 MASSICOT \(ISO 15189\) ================= \*\/\}\n\s*\{activePrintLayout === \'ISO_DOUBLE_A5\' && \((.*?)\)\}', orig, re.DOTALL)
layout_a5 = m_a5.group(1).strip() if m_a5 else ""

new_file = f"""import React, {{ useState }} from 'react';
import {{ X, Printer, Download, Eye, FileText, CheckCircle2, ShieldCheck }} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import {{ DossierReport, ExamDefinition, LabSettings, Patient }} from '../../types';
import {{ evaluateParameterValue, getEffectiveReference }} from '../../utils/interpretation';

interface ReportPrintModalProps {{
  isOpen: boolean;
  onClose: () => void;
  dossier: DossierReport | null;
  patient: Patient | null;
  catalog: ExamDefinition[];
  settings: LabSettings;
  printMode?: 'OFFICIAL_A4' | 'ISO_DOUBLE_A5';
}}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({{
  isOpen,
  onClose,
  dossier,
  patient,
  catalog,
  settings,
  printMode = 'OFFICIAL_A4',
}}) => {{
  const [format, setFormat] = useState<'A4' | 'A5'>(printMode === 'ISO_DOUBLE_A5' ? 'A5' : 'A4');

  React.useEffect(() => {{
    if (isOpen) {{
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {{
        if (e.key === 'Escape') onClose();
      }};
      window.addEventListener('keydown', handleEsc);
      return () => {{
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEsc);
      }};
    }}
  }}, [isOpen, onClose]);

  if (!isOpen || !dossier || !patient) return null;

  const show = (val?: string) => val && val.trim() !== '';

  const handleDownloadPDF = async () => {{
    const reportElement = document.getElementById('print-report-content');
    if (!reportElement) {{
      alert('Erreur : contenu du rapport introuvable.');
      return;
    }}

    const safeName = (s: string) =>
      s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `CHAPLAB_Rapport_${{safeName(patient.nom)}}_{{safeName(patient.prenom)}}_{{dossier.id}}_{{dossier.date}}.pdf`;

    const isA5 = format === 'A5';
    const options = {{
      margin: isA5 ? 5 : 10,
      filename: fileName,
      image: {{ type: 'jpeg', quality: 0.98 }},
      html2canvas: {{
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#FFFFFF',
      }},
      jsPDF: {{
        unit: 'mm',
        format: isA5 ? [148, 210] : 'a4',
        orientation: 'portrait',
      }},
      pagebreak: {{ mode: ['avoid-all', 'css', 'legacy'] }},
    }};

    try {{
      // @ts-ignore
      await html2pdf().set(options).from(reportElement).save();

      // @ts-ignore
      const blob = await html2pdf().set(options).from(reportElement).outputPdf('blob');
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {{
        win.addEventListener('load', () => {{
          setTimeout(() => {{
            win.print();
          }}, 500);
        }});
      }}

      setTimeout(() => {{
        onClose();
      }}, 1000);
    }} catch (err) {{
      console.error('Erreur génération PDF:', err);
      alert('Erreur lors de la génération du PDF.');
    }}
  }};

{exam_logic}

  return (
    <>
      {{/* ZONE VISIBLE (le modal) */}}
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={{onClose}}>
        <div className="bg-white rounded-sm border border-slate-300 shadow-2xl max-w-md w-full" onClick={{(e) => e.stopPropagation()}}>
          {{/* En-tête modal */}}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 border-l-4 border-l-[#5B46F6]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Impression du compte-rendu
            </span>
            <button onClick={{onClose}} className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {{/* Corps : choix du format */}}
          <div className="p-4 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Format d'impression
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={{() => setFormat('A4')}}
                className={{`py-2 px-3 text-[11px] font-semibold border rounded-sm transition-colors cursor-pointer ${{
                  format === 'A4'
                    ? 'bg-[#5B46F6]/10 border-[#5B46F6] text-[#5B46F6]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }}`}}
              >
                A4 Portrait Officiel
              </button>
              <button
                onClick={{() => setFormat('A5')}}
                className={{`py-2 px-3 text-[11px] font-semibold border rounded-sm transition-colors cursor-pointer ${{
                  format === 'A5'
                    ? 'bg-[#5B46F6]/10 border-[#5B46F6] text-[#5B46F6]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }}`}}
              >
                Double A5 Massicot
              </button>
            </div>

            <div className="text-[10px] text-slate-500 mt-3">
              Le PDF sera généré et téléchargé, puis s'ouvrira automatiquement pour impression.
            </div>
          </div>

          {{/* Pied : boutons */}}
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={{onClose}}
              className="flex items-center justify-center h-7 px-3 text-[11px] font-semibold border border-slate-300 text-slate-700 bg-white rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={{handleDownloadPDF}}
              className="flex items-center justify-center h-7 px-3 text-[11px] font-bold text-white rounded-sm transition-colors shadow-sm cursor-pointer"
              style={{{{ backgroundColor: '#5B46F6' }}}}
            >
              📥 Télécharger le PDF
            </button>
          </div>
        </div>
      </div>

      {{/* ZONE CACHÉE (pour la génération PDF uniquement) */}}
      <div
        id="print-report-content"
        style={{{{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#FFFFFF',
          padding: format === 'A5' ? '5mm' : '10mm',
          fontFamily: 'Arial, sans-serif',
          color: '#1F2937',
        }}}}
      >
        <div className="text-slate-900 font-sans">
          {{/* ================= LAYOUT 1: A4 PORTRAIT OFFICIEL ================= */}}
          {{format === 'A4' && (
            {layout_a4}
          )}}

          {{/* ================= LAYOUT 2: DOUBLE A5 MASSICOT (ISO 15189) ================= */}}
          {{format === 'A5' && (
            {layout_a5}
          )}}
        </div>
      </div>
    </>
  );
}};
"""

with open('src/components/print/ReportPrintModal.tsx', 'w') as f:
    f.write(new_file)

print("Done")
