import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, TemplateType } from '../types/resume';
import type { AIResumeJSON, ATSResult } from '../types/ai';
import { generateResumeFromInput, calculateATSScore as aiCalculateATSScore } from '../services/AIService';

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  achievements: [],
};

interface ResumeContextType {
  resumeData: ResumeData;
  resumeText: string;
  setResumeText: (text: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeTemplate: TemplateType;
  setActiveTemplate: (template: TemplateType) => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: string | string[]) => void;
  removeProject: (id: string) => void;
  addAchievement: (achievement: string) => void;
  removeAchievement: (index: number) => void;
  // AI
  aiLoading: boolean;
  aiError: string | null;
  generatedAI: AIResumeJSON | null;
  ats: ATSResult | null;
  generateWithAI: () => Promise<void>;
  calculateATS: (resumeText: string, jobDescription: string) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : defaultResumeData;
  });
  
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedAI, setGeneratedAI] = useState<AIResumeJSON | null>(null);
  const [ats, setAts] = useState<ATSResult | null>(null);
  const [resumeText, setResumeText] = useState('');

  // Save to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // Skills
  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  // AI actions
  const generateWithAI = async () => {
    try {
      setAiError(null);
      setAiLoading(true);
      const result = await generateResumeFromInput(resumeData);
      setGeneratedAI(result);
      // Merge AI result into resumeData for live preview
      setResumeData(prev => ({
        ...prev,
        summary: result.summary || prev.summary,
        skills: result.skills?.length ? result.skills : prev.skills,
        experience: result.experience?.map((e, i) => ({
          id: e.id || `${Date.now()}-${i}`,
          jobTitle: e.jobTitle,
          company: e.company,
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          description: e.description,
        })) || prev.experience,
        education: result.education?.map((e, i) => ({
          id: e.id || `${Date.now()}-edu-${i}`,
          degree: e.degree,
          school: e.school,
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          description: e.description || '',
        })) || prev.education,
        achievements: result.achievements?.length ? result.achievements : prev.achievements,
        projects: result.projects?.map((p, i) => ({
          id: p.id || `${Date.now()}-proj-${i}`,
          name: p.name,
          description: p.description,
          technologies: p.technologies || [],
        })) || prev.projects,
      }));
    } catch (e: any) {
      setAiError(e?.message || 'Failed to generate resume with AI');
    } finally {
      setAiLoading(false);
    }
  };

  const calculateATS = async (resumeText: string, jobDescription: string) => {
    try {
      setAiError(null);
      setAiLoading(true);
      const result = await aiCalculateATSScore(resumeText, jobDescription);
      setAts(result);
    } catch (e: any) {
      setAiError(e?.message || 'Failed to calculate ATS');
    } finally {
      setAiLoading(false);
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Education
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  // Experience
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  // Projects
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  };

  // Achievements
  const addAchievement = (achievement: string) => {
    if (achievement) {
      setResumeData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
      }));
    }
  };

  const removeAchievement = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        activeTemplate,
        setActiveTemplate,
        addSkill,
        removeSkill,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addProject,
        updateProject,
        removeProject,
        addAchievement,
        removeAchievement,
        aiLoading,
        aiError,
        generatedAI,
        ats,
        generateWithAI,
        resumeText,
        setResumeText,
        calculateATS,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
