import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "../config";
import type { AIResumeJSON, ATSResult } from "../types/ai";
import type { ResumeData } from "../types/resume";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const MODEL_NAME = "gemini-2.5-flash"; // fast and cost-efficient; can be swapped for pro

const jsonSafety = (text: string) => {
  // Attempt to extract JSON block if wrapped in code fences
  const fenced = text.match(/```json\n([\s\S]*?)```/i);
  if (fenced) return fenced[1];
  return text;
};

export async function generateResumeFromInput(input: ResumeData): Promise<AIResumeJSON> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `You are an expert resume builder. Create a polished, ATS-optimized resume using the following details.
  Return ONLY valid JSON with this shape, no extra commentary:
  {
    "summary": "...",
    "skills": ["..."],
    "experience": [{"jobTitle":"...","company":"...","startDate":"","endDate":"","description":"..."}],
    "education": [{"degree":"...","school":"...","startDate":"","endDate":"","description":""}],
    "achievements": ["..."],
    "projects": [{"name":"...","description":"...","technologies":["..."]}]
  }

  User data:
  Name: ${input.personalInfo.name}
  Email: ${input.personalInfo.email}
  Phone: ${input.personalInfo.phone}
  Location: ${input.personalInfo.location}
  LinkedIn: ${input.personalInfo.linkedin}
  GitHub: ${input.personalInfo.github}
  Portfolio: ${input.personalInfo.portfolio}
  Summary: ${input.summary}
  Skills: ${input.skills.join(", ")}
  Education: ${input.education.map(e=>`${e.degree} at ${e.school} (${e.startDate} - ${e.endDate})`).join("; ")}
  Experience: ${input.experience.map(e=>`${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate})`).join("; ")}
  Projects: ${input.projects.map(p=>`${p.name} - ${p.description}`).join("; ")}
  Achievements: ${input.achievements.join("; ")}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonText = jsonSafety(text);
  try {
    const parsed = JSON.parse(jsonText) as AIResumeJSON;
    return parsed;
  } catch (e) {
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function calculateATSScore(resumeText: string, jobDescription: string): Promise<ATSResult> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = `Compare the following resume with this Job Description.
  Return ONLY valid JSON with shape:
  {
    "ats_score": 0-100,
    "keywords_matched": ["..."],
    "missing_keywords": ["..."],
    "improvement_suggestions": ["..."]
  }

  Resume:
  ${resumeText}

  Job Description:
  ${jobDescription}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonText = jsonSafety(text);
  try {
    const parsed = JSON.parse(jsonText) as ATSResult;
    // Clamp score
    parsed.ats_score = Math.max(0, Math.min(100, Math.round(parsed.ats_score)));
    return parsed;
  } catch (e) {
    throw new Error("Failed to parse ATS response as JSON");
  }
}

