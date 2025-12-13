import { GoogleGenAI, Type, type Schema } from '@google/genai';
import type { AiInsight } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const insightSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        haiku: {
            type: Type.STRING,
            description: 'A haiku poem inspired by the color in English.'
        },
        history: {
            type: Type.STRING,
            description: "A 1-2 sentence description of the color's historical or cultural significance in Japan."
        },
        emotionalVibe: {
            type: Type.STRING,
            description: 'Three adjectives describing the feeling of this color.'
        }
    },
    required: ['haiku', 'history', 'emotionalVibe']
};

export const getColorInsight = async (colorName: string, colorHex: string): Promise<AiInsight> => {
    try {
        const prompt = `Provide a cultural insight for the traditional Japanese color "${colorName}" (Hex: ${colorHex}).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: insightSchema,
                systemInstruction:
                    'You are an expert on Japanese traditional colors, aesthetics, and history. Keep descriptions concise, poetic, and accurate.'
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error('No response from AI');
        }

        return JSON.parse(text) as AiInsight;
    } catch (error) {
        console.error('Error fetching color insight:', error);
        return {
            haiku: 'Silent color speaks,\nHistory fades into now,\nDigital mind dreams.',
            history:
                'This color has deep roots in Japanese tradition, though specifics are momentarily elusive to the spirits.',
            emotionalVibe: 'Mysterious, Quiet, Timeless'
        };
    }
};
