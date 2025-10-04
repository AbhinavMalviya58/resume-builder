import { useState } from 'react';
import { ResumeProvider, useResume } from './contexts/ResumeContext';
import AIAssistantPanel from './components/AIAssistantPanel';
import PersonalInfoForm from './components/PersonalInfoForm';
import SummaryForm from './components/SummaryForm';
import SkillsForm from './components/SkillsForm';
import EducationForm from './components/EducationForm';
import ExperienceForm from './components/ExperienceForm';
import ProjectsForm from './components/ProjectsForm';
import AchievementsForm from './components/AchievementsForm';
import FileUpload from './components/FileUpload';
import ResumePreview from './components/ResumePreview';
// import ATSScanner from './components/ATSScanner';

const AppContent = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { setActiveTemplate: setContextTemplate } = useResume();

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤', emoji: '📋' },
    { id: 'summary', label: 'Summary', icon: '📄', emoji: '📝' },
    { id: 'education', label: 'Education', icon: '🎓', emoji: '🏫' },
    { id: 'experience', label: 'Experience', icon: '💼', emoji: '🏢' },
    { id: 'skills', label: 'Skills', icon: '🛠️', emoji: '⚡' },
    { id: 'projects', label: 'Projects', icon: '📂', emoji: '🚀' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', emoji: '🌟' },
  ];

  const templates = [
    { id: 'minimal', label: 'Minimal', color: 'bg-gray-500' },
    { id: 'modern', label: 'Modern', color: 'bg-blue-500' },
    { id: 'professional', label: 'Professional', color: 'bg-green-500' },
  ];

  // Removed unused getTabIcon function

  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
    setContextTemplate(templateId as any);
  };

  const { generateWithAI, aiLoading } = useResume();

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'summary':
        return <SummaryForm />;
      case 'skills':
        return <SkillsForm />;
      case 'education':
        return <EducationForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'achievements':
        return <AchievementsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  const ATSScore = () => {
    const score = 87; // Mock score
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600 bg-green-100';
      if (score >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 form-section">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {score}/100
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Strong keyword match</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Add more technical skills</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Template Switcher */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Template:</span>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTemplate === template.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {template.label}
                  </button>
                ))}
              </div>

              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md">
                📥 Download PDF
              </button>

              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="md:hidden px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showMobilePreview ? '📝' : '👁️'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="w-full">
        <div className="flex h-[calc(100vh-4rem)]">

          {/* Left Panel - Form (40% width) */}
          <div className={`w-2/5 bg-gray-50 overflow-y-auto ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <FileUpload />
              </div>

              {/* Generate with AI */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">AI Generation</div>
                    <div className="text-xs text-gray-600">Create or enhance your resume using Gemini</div>
                  </div>
                  <button
                    onClick={() => generateWithAI()}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60 shadow-md"
                  >
                    ✨ {aiLoading ? 'Generating…' : 'Generate with AI'}
                  </button>
                </div>
              </div>

              {/* Form Sections */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-all ${activeSection === section.id
                          ? 'bg-indigo-50 border-l-4 border-indigo-500'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSection === section.id
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-600' 
                          }`}>
                          <span className="text-lg">{section.icon}</span>
                        </div>
                        <span className="font-medium text-white">{section.label}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === section.id ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeSection === section.id && (
                      <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                        <div className="pt-4">
                          {renderSectionContent()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview (60% width) */}
          <div className={`w-3/5 bg-gray-50 overflow-y-auto ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
            <div className="p-6 space-y-6">
              {/* AI Assistant Panel */}
              <div className="p-6 border-b border-gray-200">
                <AIAssistantPanel />
              </div>

              {/* Resume Preview */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* A4 Preview Container */}
                <div className="h-full flex justify-center overflow-y-auto">
                  <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      maxWidth: '100%',
                      aspectRatio: '210/297'
                    }}
                  >
                    <div className="h-full overflow-y-auto">
                      <ResumePreview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

const App = () => {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
};

export default App;
