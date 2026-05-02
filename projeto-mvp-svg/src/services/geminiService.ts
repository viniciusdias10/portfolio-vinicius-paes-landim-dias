import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function brainstormBlobName(color: string, complexity: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a creative, one-word, abstract name for an organic SVG shape with color ${color} and complexity level ${complexity}. Return only the name.`,
    });
    return response.text?.trim() || "Nova Forma";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Blob " + Math.floor(Math.random() * 1000);
  }
}
