import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';

const ATSScanner: React.FC = () => {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [foundKeywords, setFoundKeywords] = useState<{keyword: string, count: number}[]>([]);

  const calculateATSScore = () => {
    if (!jobDescription.trim()) {
      return;
    }

    // Extract all text from resume
    const resumeText = [
      resumeData.summary,
      resumeData.skills.join(' '),
      resumeData.education.map(edu => `${edu.degree} ${edu.school} ${edu.description}`).join(' '),
      resumeData.experience.map(exp => `${exp.jobTitle} ${exp.company} ${exp.description}`).join(' '),
      resumeData.projects.map(proj => `${proj.name} ${proj.description} ${proj.technologies?.join(' ')}`).join(' '),
      resumeData.achievements.join(' ')
    ].join(' ').toLowerCase();

    // Extract keywords from job description (simple approach)
    const jobText = jobDescription.toLowerCase();
    
    // Common words to exclude from keyword extraction
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'as', 'by', 'of', 'is', 'are', 'was', 'were',
      'be', 'this', 'that', 'these', 'those', 'it', 'its', 'our', 'we', 'you', 'they', 'them', 'their', 'your', 'my', 'mine',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall'
    ]);

    // Extract keywords (words with 3+ letters, not in common words)
    const keywords = Array.from(
      new Set(
        jobText
          .split(/\s+/)
          .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
          .filter(word => word.length >= 3 && !commonWords.has(word))
      )
    );

    // Check which keywords are in the resume
    const found = [];
    const missing = [];
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      const count = (resumeText.match(regex) || []).length;
      
      if (count > 0) {
        found.push({ keyword, count });
      } else {
        missing.push(keyword);
      }
    }

    // Calculate score (percentage of keywords found)
    const newScore = Math.round((found.length / keywords.length) * 100);
    
    setScore(isNaN(newScore) ? 0 : newScore);
    setFoundKeywords(found.sort((a, b) => b.count - a.count).slice(0, 20)); // Show top 20
    setMissingKeywords(missing.slice(0, 20)); // Show top 20 missing
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreFeedback = (score: number) => {
    if (score >= 80) return 'Excellent match! Your resume contains most of the important keywords.';
    if (score >= 50) return 'Good match, but could be improved. Consider adding some of the missing keywords.';
    return 'Low match. Your resume is missing many important keywords from the job description.';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">ATS Score Checker</h2>
      <p className="text-gray-600 mb-4">
        Paste a job description below to see how well your resume matches and identify missing keywords.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[200px]"
          placeholder="Paste the job description here..."
        />
      </div>
      
      <button
        onClick={calculateATSScore}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
      >
        Analyze Resume Match
      </button>

      {score !== null && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">ATS Match Score</h3>
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full ${
                score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <p className="text-gray-700 mb-6">{getScoreFeedback(score)}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Found Keywords (Top 20)</h4>
              {foundKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {foundKeywords.map((item, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center"
                      title={`Appears ${item.count} time${item.count > 1 ? 's' : ''}`}
                    >
                      {item.keyword}
                      <span className="ml-1 text-xs bg-green-200 rounded-full px-1.5">
                        {item.count}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No keywords found in your resume.</p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Missing Keywords (Top 20)</h4>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 text-sm">Great! All important keywords from the job description are in your resume.</p>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Tips to Improve Your ATS Score</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
              <li>Incorporate missing keywords naturally into your work experience and skills sections</li>
              <li>Use the exact terminology from the job description when possible</li>
              <li>Include both acronyms and full forms (e.g., "SEO (Search Engine Optimization)")</li>
              <li>Add a "Skills" or "Technical Skills" section with relevant keywords</li>
              <li>Ensure your resume is machine-readable (avoid headers/footers, images, or complex formatting)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScanner;
