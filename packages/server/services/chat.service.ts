import OpenAI from 'openai';
import { converstationRepository } from "../repositories/converstation.repository";

type ChatService = {
    id: string;
    message: string;
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = {
    sendMessage: async (prompt: string, conversationId: string): Promise<ChatService> => {
        const response = await client.responses.create({
            model: 'gpt-4.1-mini',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 100,
            previous_response_id: converstationRepository.getLastRepositoryId(conversationId),
        });

        converstationRepository.setLastRepositoryId(conversationId, response.id);

        return { id: conversationId, message: response.output_text }
    }
}
