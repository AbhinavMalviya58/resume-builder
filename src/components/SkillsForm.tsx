import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';

const SkillsForm: React.FC = () => {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <form onSubmit={handleAddSkill} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 p-2 border rounded-l-md"
            placeholder="Add a skill (e.g., JavaScript, Python)"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>
        ))}
        {resumeData.skills.length === 0 && (
          <p className="text-gray-500 text-sm">No skills added yet. Add some skills above.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
