import { useRef, useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import type { TemplateType } from '../types/resume';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ResumePreview: React.FC = () => {
  const { resumeData, activeTemplate, setActiveTemplate } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsExporting(true);
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      // Calculate dimensions to maintain aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 20; // Add margins
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', x, 10, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`${resumeData.personalInfo.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = () => {
    const templateProps = { data: resumeData, isExporting };
    
    switch (activeTemplate) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'professional':
        return <ProfessionalTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
        <div className="flex gap-4">
          <select
            value={activeTemplate}
            onChange={(e) => setActiveTemplate(e.target.value as TemplateType)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
          </select>
          <button
            onClick={downloadPDF}
            disabled={isExporting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div 
        ref={resumeRef} 
        className="bg-white shadow-lg overflow-hidden"
        style={{ minHeight: '1123px', width: '794px', maxWidth: '100%', margin: '0 auto' }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
