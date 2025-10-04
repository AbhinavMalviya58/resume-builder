import { v4 as uuidv4 } from 'uuid';
import type { ResumeData } from '../types/resume';

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

interface ParsedPersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface ParsedResume extends Omit<ResumeData, 'personalInfo'> {
  personalInfo: ParsedPersonalInfo;
  atsScore: ATSMetrics;
}

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
  'AWS', 'Docker', 'Git', 'REST API', 'GraphQL', 'HTML', 'CSS', 'MongoDB'
];

export const parseResumeText = (text: string): ParsedResume => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Initialize result object with default values
  const result = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    } as ParsedPersonalInfo,
    summary: '',
    skills: [] as string[],
    experience: [] as Array<{
      id: string;
      jobTitle: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }>,
    education: [] as Array<{
      id: string;
      degree: string;
      school: string;
      startDate: string;
      endDate: string;
      description: string;
    }>,
    projects: [] as Array<{
      id: string;
      name: string;
      description: string;
      technologies: string[];
      link?: string;
    }>,
    achievements: [] as string[],
    atsScore: {
      hasName: false,
      hasEmail: false,
      hasPhone: false,
      hasExperience: false,
      hasEducation: false,
      hasSkills: false,
      hasSummary: false,
      keywordMatches: 0,
      totalScore: 0,
      suggestions: []
    }
  };

  // Extract basic information
  result.personalInfo.email = extractEmail(text) || '';
  result.personalInfo.phone = extractPhone(text) || '';
  result.personalInfo.name = extractName(lines) || '';
  
  // Extract sections
  const sections = splitIntoSection(text);
  
  if (sections.summary) {
    result.summary = sections.summary;
    result.atsScore.hasSummary = true;
  }
  
  if (sections.skills) {
    result.skills = extractSkills(sections.skills);
    result.atsScore.hasSkills = result.skills.length > 0;
  }
  
  if (sections.experience) {
    result.experience = extractExperience(sections.experience);
    result.atsScore.hasExperience = result.experience.length > 0;
  }
  
  if (sections.education) {
    result.education = extractEducation(sections.education);
    result.atsScore.hasEducation = result.education.length > 0;
  }

  // Calculate ATS score
  const atsScore = calculateATSScore({
    personalInfo: result.personalInfo,
    summary: result.summary,
    skills: result.skills,
    experience: result.experience,
    education: result.education
  });
  
  return {
    ...result,
    atsScore
  } as ParsedResume;
};

// Helper functions for parsing
const extractEmail = (text: string): string | null => {
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

const extractPhone = (text: string): string | null => {
  const phoneRegex = /(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

const extractName = (lines: string[]): string | null => {
  // Simple heuristic: first non-empty line that doesn't contain email or phone
  for (const line of lines) {
    if (!line.match(/@|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      return line.trim();
    }
  }
  return null;
};

const splitIntoSection = (text: string) => {
  const sections: Record<string, string> = {};
  const sectionPatterns = {
    summary: /(?:summary|about|profile)/i,
    experience: /(?:experience|work\s+history|employment)/i,
    education: /(?:education|academic)/i,
    skills: /(?:skills|technical\s+skills|technologies)/i
  };

  // Split text into lines and group by sections
  const lines = text.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    // Check if line matches a section header
    const sectionMatch = Object.entries(sectionPatterns).find(([_, pattern]) => 
      line.match(pattern)
    );
    
    if (sectionMatch) {
      currentSection = sectionMatch[0];
      sections[currentSection] = line + '\n';
    } else if (currentSection) {
      sections[currentSection] += line + '\n';
    }
  }
  
  return sections;
};

const extractSkills = (skillsText: string): string[] => {
  // Split by common delimiters and filter out common words
  const skills = skillsText
    .split(/[,\n\|\/]/)
    .map(skill => skill.trim())
    .filter(skill => 
      skill.length > 1 && 
      !['and', 'or', 'with', 'using', 'experience'].includes(skill.toLowerCase())
    );
  
  // Remove duplicates
  return [...new Set(skills)];
};

const extractExperience = (expText: string) => {
  const experiences: Array<{
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }> = [];
  
  const entries = expText.split(/\n\s*\n/);
  
  for (const entry of entries) {
    const lines = entry.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) continue;
    
    // Simple pattern matching for job title and company
    const titleMatch = lines[0].match(/(.+?)\s*at\s*(.+?)(?:\(.*\))?$/i) || 
                      lines[0].match(/(.+?)[,-]\s*(.+)/);
    
    if (titleMatch) {
      const dateMatch = lines[1].match(/(\w+\s*\d{4})\s*-\s*(Present|\w+\s*\d{4})/i) || 
                       lines[1].match(/(\w+\s*\d{4})\s*to\s*(Present|\w+\s*\d{4})/i);
      
      experiences.push({
        id: uuidv4(),
        jobTitle: titleMatch[1].trim(),
        company: titleMatch[2].trim(),
        startDate: dateMatch ? dateMatch[1] : '',
        endDate: dateMatch ? dateMatch[2] : lines[1].trim(),
        description: lines.slice(2).join('\n')
      });
    }
  }
  
  return experiences;
};

const extractEducation = (eduText: string) => {
  const education: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    description: string;
  }> = [];
  
  const entries = eduText.split(/\n\s*\n/);
  
  for (const entry of entries) {
    const lines = entry.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) continue;
    
    const dateMatch = lines[1].match(/(\w+\s*\d{4})\s*-\s*(\w+\s*\d{4}|Present)/i);
    
    education.push({
      id: uuidv4(),
      degree: lines[0].trim(),
      school: lines[1].replace(/(\w+\s*\d{4}\s*-\s*(?:\w+\s*\d{4}|Present))\s*/, '').trim(),
      startDate: dateMatch ? dateMatch[1] : '',
      endDate: dateMatch ? dateMatch[2] : '',
      description: lines.slice(2).join('\n')
    });
  }
  
  return education;
};

interface ResumeForATSCalculation {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  summary: string;
  skills: string[];
  experience: any[];
  education: any[];
}

const calculateATSScore = (resume: ResumeForATSCalculation): ATSMetrics => {
  const score: ATSMetrics = {
    hasName: !!resume.personalInfo.name,
    hasEmail: !!resume.personalInfo.email,
    hasPhone: !!resume.personalInfo.phone,
    hasExperience: resume.experience.length > 0,
    hasEducation: resume.education.length > 0,
    hasSkills: resume.skills.length > 0,
    hasSummary: !!resume.summary,
    keywordMatches: 0,
    totalScore: 0,
    suggestions: []
  };

  // Calculate keyword matches
  const allText = JSON.stringify(resume).toLowerCase();
  score.keywordMatches = COMMON_SKILLS.filter(skill => 
    allText.includes(skill.toLowerCase())
  ).length;

  // Calculate total score (0-100)
  const sectionScores = [
    score.hasName ? 10 : 0,
    score.hasEmail ? 10 : 0,
    score.hasPhone ? 5 : 0,
    score.hasSummary ? 10 : 0,
    score.hasSkills ? 15 : 0,
    score.hasExperience ? 20 : 0,
    score.hasEducation ? 15 : 0,
    Math.min(score.keywordMatches * 3, 15) // Max 15 points for keywords
  ];

  score.totalScore = sectionScores.reduce((sum, s) => sum + s, 0);

  // Generate suggestions
  if (!score.hasName) score.suggestions.push('Add your full name');
  if (!score.hasEmail) score.suggestions.push('Include your email address');
  if (!score.hasPhone) score.suggestions.push('Add your phone number');
  if (!score.hasSummary) score.suggestions.push('Add a professional summary');
  if (!score.hasSkills) score.suggestions.push('List your key skills');
  if (!score.hasExperience) score.suggestions.push('Add your work experience');
  if (!score.hasEducation) score.suggestions.push('Include your education');
  if (score.keywordMatches < 3) score.suggestions.push('Add more relevant skills and keywords');

  return score;
};
