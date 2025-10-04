import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';

const AchievementsForm: React.FC = () => {
  const { resumeData, addAchievement, removeAchievement } = useResume();
  const [newAchievement, setNewAchievement] = useState('');

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAchievement.trim()) {
      addAchievement(newAchievement.trim());
      setNewAchievement('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      <form onSubmit={handleAddAchievement} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            className="flex-1 p-2 border rounded-l-md"
            placeholder="Add an achievement (e.g., Employee of the Month, Hackathon Winner)"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </form>
      
      {resumeData.achievements.length === 0 ? (
        <p className="text-gray-500 text-sm">No achievements added yet.</p>
      ) : (
        <ul className="space-y-2">
          {resumeData.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start group">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <div className="flex-1">
                <div className="flex items-start">
                  <span className="flex-1">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove achievement"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementsForm;
