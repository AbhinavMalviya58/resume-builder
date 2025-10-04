import React from 'react';
import { useResume } from '../contexts/ResumeContext';

const SummaryForm: React.FC = () => {
  const { resumeData, setResumeData } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({
      ...prev,
      summary: e.target.value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Write a brief summary about yourself and your professional background
        </label>
        <textarea
          value={resumeData.summary}
          onChange={handleChange}
          className="w-full p-3 border rounded-md min-h-[120px]"
          placeholder="Experienced software developer with 5+ years of experience in web development..."
        />
      </div>
      <p className="text-xs text-gray-500">
        Keep it concise (2-4 sentences). Highlight your professional experience, skills, and career goals.
      </p>
    </div>
  );
};

export default SummaryForm;
