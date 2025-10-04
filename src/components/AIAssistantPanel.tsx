import React, { useMemo, useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

const AIAssistantPanel: React.FC = () => {
  const { 
    resumeData, 
    resumeText: contextResumeText, 
    aiLoading, 
    aiError, 
    generatedAI, 
    ats, 
    generateWithAI, 
    calculateATS 
  } = useResume();
  
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdUploading, setJdUploading] = useState(false);

  // Use resume text from context if available, otherwise generate it from resumeData
  const resumePlainText = useMemo(() => {
    if (contextResumeText) return contextResumeText;
    
    // Fallback to generating from resumeData if no context text is available
    const parts: string[] = [];
    const p = resumeData.personalInfo;
    parts.push(`${p.name} | ${p.email} | ${p.phone}`);
    if (p.linkedin) parts.push(p.linkedin);
    if (p.github) parts.push(p.github);
    if (p.portfolio) parts.push(p.portfolio);
    if (resumeData.summary) parts.push(`Summary: ${resumeData.summary}`);
    if (resumeData.skills?.length) parts.push(`Skills: ${resumeData.skills.join(', ')}`);
    if (resumeData.experience?.length) {
      parts.push('Experience:');
      resumeData.experience.forEach(e => parts.push(`- ${e.jobTitle} @ ${e.company} (${e.startDate} - ${e.endDate}) ${e.description}`));
    }
    if (resumeData.education?.length) {
      parts.push('Education:');
      resumeData.education.forEach(e => parts.push(`- ${e.degree} @ ${e.school} (${e.startDate} - ${e.endDate}) ${e.description || ''}`));
    }
    if (resumeData.projects?.length) {
      parts.push('Projects:');
      resumeData.projects.forEach(pj => parts.push(`- ${pj.name}: ${pj.description} (${(pj.technologies || []).join(', ')})`));
    }
    if (resumeData.achievements?.length) {
      parts.push('Achievements:');
      resumeData.achievements.forEach(a => parts.push(`- ${a}`));
    }
    return parts.join('\n');
  }, [resumeData]);

  const handleUploadJD = async (file: File) => {
    setJdUploading(true);
    try {
      const text = file.type === 'application/pdf' 
        ? await extractTextFromPdf(file) 
        : await file.text();
      setJdText(text);
      
      // If we have resume text in context, automatically calculate ATS score
      if (contextResumeText) {
        await calculateATS(contextResumeText, text);
      }
    } catch (error) {
      console.error('Error processing job description:', error);
    } finally {
      setJdUploading(false);
    }
  };

  const score = clamp(ats?.ats_score ?? 0);
  const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 form-section">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        <button
          onClick={() => generateWithAI()}
          disabled={aiLoading}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          ✨ {aiLoading ? 'Generating…' : 'Generate with AI'}
        </button>
      </div>

      {aiError && (
        <div className="mb-4 text-sm text-red-600">{aiError}</div>
      )}

      {/* ATS Score */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Resume Analysis</h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-gray-700">ATS Compatibility Score</span>
              <p className="text-xs text-gray-500">How well your resume matches the job description</p>
            </div>
            <div className="flex items-center">
              <span 
                className="text-2xl font-bold" 
                style={{ color: scoreColor }}
              >
                {score}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${score}%`, background: scoreColor }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {ats?.ats_breakdown && (
          <div className="mt-4 space-y-2">
            {Object.entries(ats.ats_breakdown).map(([category, value]) => {
              const score = value || 0;
              return (
                <div key={category} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="h-full rounded-full" 
                      style={{
                        width: `${score}%`,
                        background: score > 50 ? '#10B981' : score > 25 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {!!ats?.improvement_suggestions?.length && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-800 mb-2">Improvement Tips</div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {ats.improvement_suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Compare with Job Description */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-800 mb-2">Upload Job Description</div>
        
        <div className="flex flex-col space-y-2">
          {/* File Upload */}
          <div className="flex items-center gap-2">
            <label className="flex-1">
              <div className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{jdFile ? jdFile.name : 'Choose a file (PDF or TXT)'}</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setJdFile(file);
                      if (file.type === 'application/pdf') {
                        const text = await extractTextFromPdf(file);
                        setJdText(text);
                      } else {
                        const text = await file.text();
                        setJdText(text);
                      }
                    }
                  }}
                />
              </div>
            </label>
                        <button
                  onClick={() => calculateATS(contextResumeText || resumePlainText, jdText)}
                  disabled={aiLoading || !jdText.trim() || !(contextResumeText || resumePlainText)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!(contextResumeText || resumePlainText) ? "Please upload a resume first" : ""}
                >
                  {aiLoading ? 'Analyzing...' : 'Analyze ATS Match'}
                </button>
          </div>
          
          {/* Textarea for manual editing */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                Or paste job description below
              </label>
              <span className="text-xs text-gray-500">
                {jdText.length} characters
              </span>
            </div>
            <textarea
              id="jobDescription"
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      {(ats?.keywords_matched?.length || ats?.missing_keywords?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-800 mb-1">Matched Keywords</div>
            <div className="flex flex-wrap gap-2">
              {(ats?.keywords_matched || []).map((k, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-1">Missing Keywords</div>
            <div className="flex flex-wrap gap-2">
              {(ats?.missing_keywords || []).map((k, i) => (
                <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated AI snapshot (optional) */}
      {generatedAI && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-700">View AI Generated JSON</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
{JSON.stringify(generatedAI, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default AIAssistantPanel;
