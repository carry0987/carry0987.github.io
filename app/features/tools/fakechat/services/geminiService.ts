import { GoogleGenAI, Type } from '@google/genai';
import type { Message } from '../types';

export const generateConversation = async (
    topic: string,
    platform: string,
    mood: string,
    language: string,
    apiKey: string
): Promise<Message[]> => {
    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-2.5-flash'; // Fast and sufficient for text generation

    const prompt = `Generate a realistic and natural chat conversation script in ${language} between two people.
  Platform style: ${platform}.
  Topic: ${topic}.
  Tone/Mood: ${mood}.
  Length: 5-8 messages.
  IMPORTANT: Write like real people text - use minimal emojis (0-2 per message at most), include natural typos occasionally, vary message lengths, and avoid overly dramatic or exaggerated expressions. The conversation should feel authentic and everyday.
  Return a JSON array where each item has 'text' (string), 'isSender' (boolean, true for 'Me', false for 'Partner'), and 'timeOffset' (minutes from start).`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            isSender: { type: Type.BOOLEAN },
                            timeOffset: { type: Type.INTEGER }
                        },
                        required: ['text', 'isSender', 'timeOffset']
                    }
                }
            }
        });

        const data = JSON.parse(response.text || '[]');

        // Convert to App Message format
        const baseTime = new Date();
        baseTime.setHours(12, 0, 0, 0);

        return data.map((item: any, index: number) => {
            const msgTime = new Date(baseTime.getTime() + item.timeOffset * 60000);
            const timeStr = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            return {
                id: `gen-${Date.now()}-${index}`,
                text: item.text,
                isSender: item.isSender,
                timestamp: timeStr,
                isRead: true
            };
        });
    } catch (error) {
        console.error('Gemini Generation Error:', error);
        throw new Error('Failed to generate conversation.');
    }
};
