export interface AIResumeJSON {
  summary: string;
  skills: string[];
  experience: Array<{
    id?: string;
    jobTitle: string;
    company: string;
    startDate?: string;
    endDate?: string;
    description: string;
  }>;
  education: Array<{
    id?: string;
    degree: string;
    school: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  achievements: string[];
  projects: Array<{
    id?: string;
    name: string;
    description: string;
    technologies?: string[];
  }>;
}

export interface ATSResult {
  ats_score: number;
  keywords_matched: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
  ats_breakdown?: {
    skills?: number;
    experience?: number;
    education?: number;
    keywords?: number;
    [key: string]: number | undefined;
  };
}
