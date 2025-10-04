import React from 'react';
import type { ResumeData } from '../../types/resume';

export interface BaseTemplateProps {
  data: ResumeData;
  isExporting?: boolean;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ data, isExporting = false }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className={`font-sans text-gray-800 ${!isExporting ? 'p-8 max-w-4xl mx-auto' : ''}`}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.name}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
        <div className="flex gap-4 mt-2">
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} className="text-blue-600 hover:underline text-sm">
              LinkedIn
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} className="text-blue-600 hover:underline text-sm">
              GitHub
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} className="text-blue-600 hover:underline text-sm">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-2">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{exp.jobTitle}</h3>
                  <div className="text-gray-600">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </div>
                </div>
                <div className="text-gray-700 font-medium">{exp.company}</div>
                {exp.description && (
                  <div className="mt-2 text-gray-700 whitespace-pre-line">
                    {exp.description.split('•').filter(Boolean).map((point, i) => (
                      <div key={i} className="flex">
                        <span className="mr-2">•</span>
                        <span>{point.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <div className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}
                  </div>
                </div>
                <div className="text-gray-700">{edu.school}</div>
                {edu.description && (
                  <p className="mt-1 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-4">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Project
                    </a>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.description && (
                  <p className="mt-1 text-gray-700">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold border-b border-gray-300 mb-4">Achievements</h2>
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.map((achievement, index) => (
              <li key={index} className="text-gray-700">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default BaseTemplate;
