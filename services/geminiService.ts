import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// -- Chat Bot --
export const sendChatMessage = async (message: string, history: string[] = []) => {
  try {
    // Using gemini-3-pro-preview for complex health reasoning and empathy
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are a helpful, empathetic, and knowledgeable menstrual health assistant named "Ciclo AI". 
        Your tone is warm, non-judgmental, and inclusive.
        Keep answers concise (under 100 words) unless asked for details.
        Disclaimer: You are an AI, not a doctor. Always advise consulting a professional for medical issues.`,
      },
      history: history.map(h => ({ role: 'user', parts: [{ text: h }] })), // Simplified history mapping for this demo
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error", error);
    return "Lo siento, tuve un problema al procesar tu mensaje. Inténtalo de nuevo.";
  }
};

// -- Search Grounding for Education --
export const searchHealthArticles = async (query: string) => {
  try {
    // Using gemini-2.5-flash with Google Search for up-to-date info
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 3 recent, reliable articles or tips about: ${query}. Return them as a JSON list with title and summary.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    // Extract text and grounding metadata (URLs)
    const jsonText = response.text;
    const articles = JSON.parse(jsonText || '[]');
    
    // Attempt to merge grounding chunks if available for direct links, 
    // though the prompt asked for JSON output which might abstract it.
    // For this demo, we rely on the model filling the 'url' field in JSON via search tool.
    
    return articles;
  } catch (error) {
    console.error("Search Error", error);
    return [];
  }
};

// -- Image Generation --
export const generateThemeImage = async (mood: string) => {
  try {
    // Using gemini-3-pro-image-preview for high quality headers
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A soft, abstract, artistic background image representing the mood: ${mood}. Minimalist, pastel colors, soothing, suitable for a health app header.` }]
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error", error);
    return null;
  }
};

// -- Image Editing --
export const editThemeImage = async (base64Image: string, prompt: string) => {
  try {
     // Using gemini-2.5-flash-image for editing
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove data URL prefix
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
  } catch (error) {
    console.error("Image Edit Error", error);
    return null;
  }
}
