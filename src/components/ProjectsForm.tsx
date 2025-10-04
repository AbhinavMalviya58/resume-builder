import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';

const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [newTech, setNewTech] = useState('');

  const handleAddTech = (projectId: string) => {
    if (newTech.trim()) {
      const project = resumeData.projects.find(p => p.id === projectId);
      if (project && !project.technologies.includes(newTech.trim())) {
        updateProject(projectId, 'technologies', [...project.technologies, newTech.trim()]);
        setNewTech('');
      }
    }
  };

  const removeTech = (projectId: string, tech: string) => {
    const project = resumeData.projects.find(p => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        'technologies',
        project.technologies.filter(t => t !== tech)
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={addProject}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          + Add Project
        </button>
      </div>

      {resumeData.projects.length === 0 ? (
        <p className="text-gray-500 text-sm">No projects added yet.</p>
      ) : (
        <div className="space-y-6">
          {resumeData.projects.map((project) => (
            <div key={project.id} className="border p-4 rounded-lg relative group">
              <button
                onClick={() => removeProject(project.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove project"
              >
                ×
              </button>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Project Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Project description, features, and your role in the project."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(project.id, tech)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech(project.id);
                        }
                      }}
                      className="flex-1 p-2 border rounded-l-md text-sm"
                      placeholder="Add technology (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTech(project.id)}
                      className="bg-gray-200 px-3 rounded-r-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link (optional)
                  </label>
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
