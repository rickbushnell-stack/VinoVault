
import { GoogleGenAI, Type } from "@google/genai";
import { Wine } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeLabel = async (base64Image: string): Promise<Partial<Wine>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyze this wine label. Extract: name, producer, vintage, region, varietal, and wine type (Red, White, Rosé, Sparkling, or Dessert). Return ONLY a JSON object.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          producer: { type: Type.STRING },
          vintage: { type: Type.STRING },
          region: { type: Type.STRING },
          varietal: { type: Type.STRING },
          type: { type: Type.STRING },
        },
        required: ["name", "producer", "vintage", "type"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse label JSON", error);
    return {};
  }
};

export const getSommelierAdvice = async (history: { role: string; parts: { text: string }[] }[], cellar: Wine[]) => {
  const ai = getAI();
  
  const cellarContext = cellar.length > 0 
    ? `User's current cellar contains: ${cellar.map(w => `${w.vintage} ${w.producer} ${w.name}`).join(', ')}.`
    : "User's cellar is currently empty.";

  const systemInstruction = `You are an expert sommelier with 30 years of experience. 
  You provide refined, helpful, and sophisticated advice about wine pairings, storage, and tasting notes.
  Reference the user's cellar when appropriate. Keep responses concise but elegant.
  ${cellarContext}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history as any,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};
