import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedSite } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "The full, single-file HTML code for the requested website. Must include <!DOCTYPE html>, <html>, <head> with Tailwind CDN script, and <body>."
    },
    explanation: {
      type: Type.STRING,
      description: "A very brief, one-sentence description of what was built."
    }
  },
  required: ["html", "explanation"]
};

export const generateWebsite = async (prompt: string): Promise<GeneratedSite> => {
  const systemPrompt = `
    You are SINKO, a world-class minimalist web designer. Your aesthetic is:
    - High-End Editorial / Fashion / Art Gallery style.
    - LOTS of whitespace (padding, margin).
    - Large, bold Serif typography (Playfair Display) paired with clean Sans-Serif (Inter/Helvetica).
    - High contrast: Black text on White/Off-White backgrounds.
    - Minimalist grids.
    
    Rules:
    1. STYLING: Use Tailwind CSS via CDN.
    2. IMAGES: Use 'https://picsum.photos/width/height?grayscale' for black and white placeholders.
    3. FONTS: Import Google Fonts (Playfair Display, Inter) in the <head>.
    4. DESIGN: 
       - Avoid gradients, shadows, and rounded corners unless subtle. 
       - Focus on sharp lines and typography.
       - Use 'tracking-wide' and 'leading-loose'.
    5. INTERACTIVITY: You can add vanilla JavaScript inside <script> tags for basic interactions.
    6. STRUCTURE: Return a COMPLETE, valid HTML5 file.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Build a website with the following requirements: ${prompt}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);
    
    return {
      html: parsed.html,
      explanation: parsed.explanation,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};