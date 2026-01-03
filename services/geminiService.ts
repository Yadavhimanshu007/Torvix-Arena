
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTournamentHype = async (title: string, gameName: string, prize: string) => {
  const ai = getAIClient();
  // Use ai.models.generateContent directly with the model and prompt
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate an energetic, hype-filled 3-sentence description for a tournament called "${title}" featuring "${gameName}" with a prize pool of "${prize}". Make it sound professional and exciting!`,
    config: {
      temperature: 0.9,
    },
  });
  // Use .text property directly (not a method call)
  return response.text;
};

export const generateTournamentRules = async (gameName: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 standard professional rules for a competitive "${gameName}" tournament. Use a clear, bulleted list format.`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};

export const generateMatchUpdateHype = async (p1: string, p2: string, score: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, thrilling sports-commentator style update for a match between ${p1} and ${p2} that just finished with a score of ${score}.`,
    config: {
      temperature: 1.0,
    }
  });
  return response.text;
};
