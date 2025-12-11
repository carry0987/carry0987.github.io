import type { Message } from '../types';

export const generateConversationOpenAI = async (
    topic: string,
    platform: string,
    mood: string,
    language: string,
    apiKey: string
): Promise<Message[]> => {
    const prompt = `Generate a realistic and natural chat conversation script in ${language} between two people.
Platform style: ${platform}.
Topic: ${topic}.
Tone/Mood: ${mood}.
Length: 5-8 messages.
IMPORTANT: Write like real people text - use minimal emojis (0-2 per message at most), include natural typos occasionally, vary message lengths, and avoid overly dramatic or exaggerated expressions. The conversation should feel authentic and everyday.
Return a JSON object with a "messages" array where each item has 'text' (string), 'isSender' (boolean, true for 'Me', false for 'Partner'), and 'timeOffset' (number, minutes from start).
Example format: {"messages": [{"text": "Hello!", "isSender": false, "timeOffset": 0}, {"text": "Hi!", "isSender": true, "timeOffset": 1}]}`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a helpful assistant that generates realistic chat conversations. Always respond with valid JSON only. The response must be a JSON object with a "messages" array.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const result = await response.json();
        const content = result.choices[0]?.message?.content || '{"messages":[]}';
        console.log('OpenAI raw response:', content);

        const parsed = JSON.parse(content);
        console.log('OpenAI parsed response:', parsed);

        // Handle various response formats:
        // 1. { messages: [...] }
        // 2. { conversation: [...] }
        // 3. Direct array (unlikely with json_object mode but handle anyway)
        // 4. Any other key that contains an array
        let data: any[] = [];
        if (Array.isArray(parsed)) {
            data = parsed;
        } else if (Array.isArray(parsed.messages)) {
            data = parsed.messages;
        } else if (Array.isArray(parsed.conversation)) {
            data = parsed.conversation;
        } else {
            // Find first array property
            for (const key of Object.keys(parsed)) {
                if (Array.isArray(parsed[key])) {
                    data = parsed[key];
                    break;
                }
            }
        }

        console.log('OpenAI extracted data:', data);

        if (data.length === 0) {
            throw new Error('No messages found in response');
        }

        // Convert to App Message format
        const baseTime = new Date();
        baseTime.setHours(12, 0, 0, 0);

        const messages = data.map((item: any, index: number) => {
            const msgTime = new Date(baseTime.getTime() + (item.timeOffset || index) * 60000);
            const timeStr = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            return {
                id: `gen-${Date.now()}-${index}`,
                text: item.text || item.content || item.message || '',
                isSender: Boolean(item.isSender ?? item.is_sender ?? item.sender === 'me'),
                timestamp: timeStr,
                isRead: true
            };
        });

        console.log('OpenAI final messages:', messages);
        return messages;
    } catch (error) {
        console.error('OpenAI Generation Error:', error);
        throw new Error('Failed to generate conversation.');
    }
};
