import { useRef, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { parseResumeText } from '../utils/resumeParser';
import './FileUpload.css';

interface ATSMetrics {
  hasName: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasSummary: boolean;
  keywordMatches: number;
  totalScore: number;
  suggestions: string[];
}

interface FileUploadProps {
  onContinue?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onContinue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [atsScore, setAtsScore] = useState<ATSMetrics | null>(null);
  const { setResumeData, setResumeText } = useResume();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.txt')) {
      setError('Please upload a PDF or TXT file');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let text = '';
      
      if (file.type.includes('pdf')) {
        // Initialize PDF.js
        const pdfjs = await import('pdfjs-dist');
        
        // Handle both ESM and CommonJS imports for the worker
        try {
          // Try ESM import first
          const workerModule = await import('pdfjs-dist/build/pdf.worker.mjs');
          pdfjs.GlobalWorkerOptions.workerSrc = 
            typeof workerModule === 'string' ? workerModule : 
            workerModule.default ? workerModule.default : 
            new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
        } catch (error) {
          // Fallback to CDN if local import fails
          pdfjs.GlobalWorkerOptions.workerSrc = 
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
      } else {
        // For text files
        text = await file.text();
      }

      // Store the raw resume text in context for ATS comparison
      setResumeText(text);
      
      // Parse the resume text
      const parsedResume = parseResumeText(text);
      
      // Update resume data in context
      if (setResumeData) {
        setResumeData({
          personalInfo: {
            name: parsedResume.personalInfo.name,
            email: parsedResume.personalInfo.email,
            phone: parsedResume.personalInfo.phone,
            location: parsedResume.personalInfo.location,
            linkedin: '',
            github: ''
          },
          summary: parsedResume.summary,
          experience: parsedResume.experience,
          education: parsedResume.education,
          skills: parsedResume.skills,
          projects: [],
          achievements: []
        });
      }

      // Set ATS score
      setAtsScore(parsedResume.atsScore);
      
      // Complete progress
      clearInterval(interval);
      setProgress(100);
      setIsSuccess(true);
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    }
  }, [onContinue]);

  // Calculate ATS score percentage for the progress bar
  const atsPercentage = atsScore ? Math.round(atsScore.totalScore * 100) : 0;
  const atsPercentageStyle = {
    background: `linear-gradient(90deg, #10b981 0%, #10b981 ${atsPercentage}%, #e2e8f0 ${atsPercentage}%, #e2e8f0 100%)`,
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-header">
        <h1 className="file-upload-title">Upload Your Resume</h1>
        <p className="file-upload-subtitle">We'll help you create an ATS-optimized resume</p>
      </div>
      
      <div 
        className={`file-upload-area ${isDragOver ? 'drag-over' : ''} ${
          isLoading ? 'loading' : isSuccess ? 'success' : error ? 'error' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt"
          className="hidden"
        />
        
        <div className="file-upload-content">
          {isLoading ? (
            <div className="upload-status">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <div className="progress-container">
                <div className="progress-header">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="upload-text">
                <div className="upload-title">Processing your resume...</div>
                <div className="upload-subtitle">Extracting and analyzing content</div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>File uploaded successfully!</p>
              {onContinue && (
                <button 
                  className="continue-button" 
                  onClick={handleContinue}
                >
                  Continue to Editor
                </button>
              )}
            </div>
          ) : error ? (
            <div className="error-message">
              <div className="error-icon">!</div>
              <div className="error-text">
                <div className="error-title">Upload Failed</div>
                <div className="error-description">{error}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="upload-text">
                <p className="upload-title">
                  <span className="gradient-text">Drop your resume here</span>
                </p>
                <p className="upload-description">or click to browse files</p>
                <p className="file-types">Supports PDF and TXT files up to 5MB</p>
              </div>
              <div className="file-types">
                <div className="file-type">
                  <div className="file-type-icon pdf">
                    <svg viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <span>PDF</span>
                </div>
                <div className="file-type">
                  <div className="file-type-icon txt">
                    <svg viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <span>TXT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {atsScore && (
        <div className="ats-score-container">
          <div className="ats-score-header">
            <h3>ATS Score</h3>
            <div 
              className="ats-score-value"
              style={atsPercentageStyle}
            >
              {atsPercentage}%
            </div>
          </div>
          
          {atsScore.suggestions.length > 0 && (
            <div className="ats-suggestions">
              <h4>Suggestions to improve your score:</h4>
              <ul>
                {atsScore.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            className="continue-button"
            onClick={handleContinue}
            disabled={!atsScore}
          >
            Continue to Editor
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
