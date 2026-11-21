import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiResponse = async (prompt: string, modelName: string = "gemini-3-flash-preview") => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateQuestion = async (topic: string, difficulty: number) => {
  const prompt = `Generate a high-quality UTBK SNBT style question about ${topic} with difficulty level ${difficulty}/5.
  Provide the question, 5 multiple choice options (A-E), and the correct answer.
  Include a step-by-step explanation. 
  Formatting: Use LaTeX for math ($...$).
  Return in JSON format:
  {
    "question": "...",
    "options": ["...", "...", "...", "...", "..."],
    "answer": "A/B/C/D/E",
    "explanation": "..."
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Question Generation Error:", error);
    return null;
  }
};
