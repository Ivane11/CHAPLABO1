import React, { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { ReportPDF } from './ReportPDF';
import { Patient, DossierReport, LabSettings, ExamDefinition } from '../../types';
import { ElectrophoresisCurve } from '../saisie/ElectrophoresisCurve';

interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  dossier: DossierReport;
  settings: LabSettings;
  catalog: ExamDefinition[];
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  isOpen,
  onClose,
  patient,
  dossier,
  settings,
  catalog,
}) => {
  const [loading, setLoading] = useState(true);
  const [curveDataUrl, setCurveDataUrl] = useState<string | undefined>(undefined);

  const examsIncluded = catalog.filter((e) => dossier.examensInclus.includes(e.id));
  const hasElectrophoresis = examsIncluded.some((e) => e.id.includes('ELECTRO'));

  React.useEffect(() => {
    if (!isOpen) {
      setCurveDataUrl(undefined);
      return;
    }

    if (!hasElectrophoresis) {
      setLoading(false);
      return;
    }

    const captureCurve = () => {
      const svgElement = document.querySelector('.curve-preview-container svg');
      if (!svgElement) {
        setTimeout(captureCurve, 100);
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setCurveDataUrl(canvas.toDataURL('image/png'));
          setLoading(false);
        } else {
          setLoading(false);
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    captureCurve();
  }, [isOpen, hasElectrophoresis]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="bg-white rounded-sm border w-full max-w-5xl h-[90vh] flex flex-col"
        style={{ borderColor: '#DEE2E6' }}
      >
        {/* En-tête */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: '#5B46F6' }} />
            <span
              className="text-[13px] font-bold uppercase tracking-wider"
              style={{ color: '#374151' }}
            >
              Aperçu du Compte-Rendu
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-slate-100"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Le conteneur caché pour le SVG afin de l'exporter en PNG dans react-pdf */}
        {hasElectrophoresis && (
           <div className="curve-preview-container absolute opacity-0 pointer-events-none" style={{ left: '-9999px', width: '800px' }}>
              <ElectrophoresisCurve 
                profil={String(dossier.resultats['ELEC_PROFIL'] || '')}
              />
           </div>
        )}

        {/* Corps - Preview PDF */}
        <div className="flex-1 bg-slate-50 relative p-4">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-500">
              Génération de l'aperçu en cours...
            </div>
          ) : (
            <PDFViewer style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}>
              <ReportPDF
                patient={patient}
                dossier={dossier}
                settings={settings}
                exams={examsIncluded}
                curveDataUrl={curveDataUrl}
              />
            </PDFViewer>
          )}
        </div>
      </div>
    </div>
  );
};
