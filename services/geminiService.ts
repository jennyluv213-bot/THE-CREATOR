
import { GoogleGenAI, Type } from "@google/genai";
import { DaySchedule, TimetableConfig, SubjectGlossary, SubjectTerm } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerationResponse {
  schedule: DaySchedule[];
  glossary: SubjectGlossary[];
}

export const generatePlan = async (config: TimetableConfig): Promise<GenerationResponse> => {
  const prompt = `Act as an expert SHS academic advisor. Generate a 7-day HOME study plan and a high-yield academic glossary.
  
  CONTEXT:
  - School: 7:00 AM - ${config.closingTime}.
  - Home Window: ${config.closingTime} to ${config.bedTime}.
  - Subjects: English, Core Maths, Integrated Science, Social Studies, Geography, Add Maths, Economics, History, Computing.

  REQUIREMENTS:
  1. Schedule: Home study blocks (1.5h each). Start after school (include 1h rest).
  2. Glossary: For each of the 9 subjects, provide 15 diverse academic terms with definitions and specific syllabus categories.
  
  RETURN JSON:
  {
    "schedule": Array of 7 DaySchedule,
    "glossary": Array of { "subject": string, "terms": Array of SubjectTerm }
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return JSON.parse(response.text);
};

export const expandGlossary = async (subject: string, existingTermsCount: number): Promise<SubjectTerm[]> => {
  const prompt = `Generate 35 NEW and ADVANCED academic terms for the SHS/WASSCE syllabus for the subject: ${subject}.
  Avoid these types of basic terms: [Assume basic terms are already known].
  Focus on technical jargon, complex theories, and specific exam-frequent terminology.
  Return exactly 35 terms in a JSON array: [{"term": string, "definition": string, "category": string}].`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });

  return JSON.parse(response.text);
};
