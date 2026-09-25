with open('src/components/print/ReportPrintModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { X, Printer, Download, Eye, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';", 
"""import { X, Printer, Download, Eye, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2pdf from 'html2pdf.js';""")

content = content.replace("const [activePrintLayout, setActivePrintLayout] = useState<'OFFICIAL_A4' | 'ISO_DOUBLE_A5'>(printMode);",
"""const [format, setFormat] = useState<'A4' | 'A5'>(printMode === 'ISO_DOUBLE_A5' ? 'A5' : 'A4');""")

content = content.replace("""  const handleTriggerPrint = () => {
    window.print();
  };""", """  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('print-report-content');
    if (!reportElement) {
      alert('Erreur : contenu du rapport introuvable.');
      return;
    }

    const safeName = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `CHAPLAB_Rapport_${safeName(patient.nom)}_${safeName(patient.prenom)}_${dossier.id}_${dossier.date}.pdf`;

    const isA5 = format === 'A5';
    const options = {
      margin: isA5 ? [5, 5, 5, 5] : [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#FFFFFF',
      },
      jsPDF: {
        unit: 'mm',
        format: isA5 ? [148, 210] : 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    try {
      await html2pdf().set(options).from(reportElement).save();

      const blob = await html2pdf().set(options).from(reportElement).outputPdf('blob');
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.addEventListener('load', () => {
          setTimeout(() => {
            win.print();
          }, 500);
        });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      alert('Erreur lors de la génération du PDF.');
    }
  };""")

# Now replace the return statement DOM structure
old_return_start = """  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 print:bg-transparent print:items-start select-none p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] print:max-h-none bg-white border border-[#DEE2E6] print:border-none rounded-sm print:rounded-none shadow-2xl print:shadow-none flex flex-col overflow-hidden print:overflow-visible my-auto print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0] border-l-4 border-l-[#5B46F6] bg-white print:hidden">
          <h2 className="text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            IMPRESSION DU COMPTE-RENDU
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 print:bg-white print:p-0">
          
          <div className="flex items-center gap-4 mb-4 p-3 bg-white border border-[#E2E8F0] rounded-sm print:hidden">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Format :</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="printFormat" 
                  checked={activePrintLayout === 'OFFICIAL_A4'} 
                  onChange={() => setActivePrintLayout('OFFICIAL_A4')}
                  className="accent-[#5B46F6]"
                />
                <span className="text-[12px] text-slate-800">A4 Portrait Officiel</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="printFormat" 
                  checked={activePrintLayout === 'ISO_DOUBLE_A5'} 
                  onChange={() => setActivePrintLayout('ISO_DOUBLE_A5')}
                  className="accent-[#5B46F6]"
                />
                <span className="text-[12px] text-slate-800">Double A5 Massicot (ISO)</span>
              </label>
            </div>
          </div>

          {/* Preview Container */}
          <div className="bg-white border border-[#E2E8F0] rounded-sm p-4 overflow-x-auto print:border-none print:p-0 print:overflow-visible flex justify-center">
            <div className="w-full max-w-[210mm] printable-area text-slate-900 font-sans relative text-left p-0 sm:p-2 print:p-0">
        {/* ================= LAYOUT 1: A4 PORTRAIT OFFICIEL ================= */}
        {activePrintLayout === 'OFFICIAL_A4' && ("""

new_return_start = """  return (
    <>
      {/* ZONE VISIBLE (le modal) */}
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-sm border border-slate-300 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          {/* En-tête modal */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 border-l-4 border-l-[#5B46F6]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              ▌ Impression du compte-rendu
            </span>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Corps : choix du format */}
          <div className="p-4 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Format d'impression
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('A4')}
                className={`py-2 px-3 text-[11px] font-semibold border rounded-sm transition-colors ${
                  format === 'A4'
                    ? 'bg-[#5B46F6]/10 border-[#5B46F6] text-[#5B46F6]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                A4 Portrait
              </button>
              <button
                onClick={() => setFormat('A5')}
                className={`py-2 px-3 text-[11px] font-semibold border rounded-sm transition-colors ${
                  format === 'A5'
                    ? 'bg-[#5B46F6]/10 border-[#5B46F6] text-[#5B46F6]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Double A5 Massicot
              </button>
            </div>

            <div className="text-[10px] text-slate-500 mt-3">
              Le PDF sera téléchargé puis ouvert pour impression.
            </div>
          </div>

          {/* Pied : boutons */}
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="h-7 px-3 text-[11px] border border-slate-300 rounded-sm hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              onClick={handleDownloadPDF}
              className="h-7 px-3 text-[11px] font-bold text-white rounded-sm shadow-sm"
              style={{ backgroundColor: '#5B46F6' }}
            >
              📥 Télécharger le PDF
            </button>
          </div>
        </div>
      </div>

      {/* ZONE CACHÉE (pour la génération PDF uniquement) */}
      <div
        id="print-report-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#FFFFFF',
          padding: format === 'A5' ? '5mm' : '10mm',
          fontFamily: 'Arial, sans-serif',
          color: '#1F2937',
        }}
      >
        <div className="text-slate-900 font-sans">
        {/* ================= LAYOUT 1: A4 PORTRAIT OFFICIEL ================= */}
        {format === 'A4' && ("""

content = content.replace(old_return_start, new_return_start)

# Replace activePrintLayout with format in the rest of the layout logic
content = content.replace("activePrintLayout === 'ISO_DOUBLE_A5'", "format === 'A5'")

old_return_end = """            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-2 print:hidden">
          <button 
            onClick={onClose}
            className="flex items-center justify-center h-7 px-3 border border-slate-300 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-sm transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button 
            onClick={handleTriggerPrint}
            className="flex items-center justify-center gap-1.5 h-7 px-3 bg-[#5B46F6] hover:bg-[#4623C2] text-white text-[11px] font-semibold rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3 h-3" />
            Lancer l'impression
          </button>
        </div>
      </div>
    </div>
  );
};"""

new_return_end = """        </div>
      </div>
    </>
  );
};"""

content = content.replace(old_return_end, new_return_end)

with open('src/components/print/ReportPrintModal.tsx', 'w') as f:
    f.write(content)

print("Done")
