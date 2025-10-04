import React from 'react';
import type { BaseTemplateProps } from './BaseTemplate';

const MinimalTemplate: React.FC<BaseTemplateProps> = (props) => {
  return (
    <div className={`font-sans resume-template ${!props.isExporting ? 'p-8 max-w-4xl mx-auto' : ''}`}>
      <div className="bg-white p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-1">{props.data.personalInfo.name}</h1>
          <div className="h-0.5 w-16 bg-gray-400 mx-auto my-3"></div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {props.data.personalInfo.email && <span>{props.data.personalInfo.email}</span>}
            {props.data.personalInfo.phone && <span>• {props.data.personalInfo.phone}</span>}
            {props.data.personalInfo.location && <span>• {props.data.personalInfo.location}</span>}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {props.data.personalInfo.linkedin && (
              <a href={props.data.personalInfo.linkedin} className="text-gray-600 hover:text-gray-800 text-sm">
                LinkedIn
              </a>
            )}
            {props.data.personalInfo.github && (
              <a href={props.data.personalInfo.github} className="text-gray-600 hover:text-gray-800 text-sm">
                GitHub
              </a>
            )}
            {props.data.personalInfo.portfolio && (
              <a href={props.data.personalInfo.portfolio} className="text-gray-600 hover:text-gray-800 text-sm">
                Portfolio
              </a>
            )}
          </div>
        </header>

        <div className="space-y-8">
          {/* Summary */}
          {props.data.summary && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-2">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{props.data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {props.data.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-1">
                Experience
              </h2>
              <div className="space-y-6">
                {props.data.experience.map((exp, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{exp.jobTitle}</h3>
                        <div className="text-gray-600">{exp.company}</div>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="mt-2 text-gray-700 text-sm">
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
          {props.data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-1">
                Education
              </h2>
              <div className="space-y-4">
                {props.data.education.map((edu, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                      <div className="text-sm text-gray-500">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}
                      </div>
                    </div>
                    <div className="text-gray-600">{edu.school}</div>
                    {edu.description && (
                      <p className="mt-1 text-gray-700 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {props.data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {props.data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="  text-gray-800 px-3 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {props.data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {props.data.projects.map((project, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          View
                        </a>
                      )}
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {props.data.achievements.length > 0 && (
            <section>
              <h2 className="text-lg font-medium uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-1">
                Achievements
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {props.data.achievements.map((achievement, index) => (
                  <li key={index} className="text-gray-700">
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

export default MinimalTemplate;
