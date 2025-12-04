import { GoogleGenAI } from '@google/genai';

/**
 * Generates an SVG string based on the user's prompt.
 * Uses 'gemini-3-pro' as requested for generation.
 * @param prompt - The user's description of the SVG to generate
 * @param apiKey - The Gemini API key provided by the user
 */
export const generateSvgFromPrompt = async (prompt: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error('API Key is required. Please enter your Gemini API key in the settings.');
    }

    const ai = new GoogleGenAI({ apiKey });
    try {
        const systemPrompt = `
      You are a world-class expert in Scalable Vector Graphics (SVG) design and coding. 
      Your task is to generate a high-quality, visually stunning, and detailed SVG based on the user's description of an object or item.
      
      Guidelines:
      1.  **Output Format**: Return ONLY the raw SVG code. Do not wrap it in markdown code blocks (e.g., no \`\`\`xml). Do not add any conversational text before or after.
      2.  **Quality**: Use gradients, proper pathing, and distinct colors to create depth and visual appeal. Avoid simple stroked lines unless requested. The style should be "flat art" or "material design" unless specified otherwise.
      3.  **Technical**: 
          - Always include a \`viewBox\` attribute.
          - Ensure the SVG is self-contained (no external references).
          - Use semantic IDs or classes if helpful, but inline styles are preferred for portability.
          - Default size should be square (e.g., 512x512) unless the aspect ratio suggests otherwise.
    `;

        const fullPrompt = `Create an SVG representation of the following object/item: "${prompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: fullPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.4, // Lower temperature for more precise code generation
                topP: 0.95,
                topK: 40
            }
        });

        const rawText = response.text || '';

        // Robust cleanup to extract just the SVG part
        const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);

        if (svgMatch && svgMatch[0]) {
            return svgMatch[0];
        } else {
            // If regex fails, return raw text but warn/handle in UI if it's not valid
            // For now, we assume the model follows instructions well due to the system prompt.
            // If the model returns markdown, we try to strip it.
            return rawText
                .replace(/```xml/g, '')
                .replace(/```svg/g, '')
                .replace(/```/g, '')
                .trim();
        }
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        throw new Error(error.message || 'Failed to generate SVG.');
    }
};
