import { converstationRepository } from '../repositories/converstation.repository';
import { llmClient } from '../llm/client.ts';

type ChatService = {
  id: string;
  message: string;
};

export const chatService = {
  sendMessage: async (
    prompt: string,
    conversationId: string
  ): Promise<ChatService> => {
    const response = await llmClient.generateText({
      prompt,
      maxTokens: 200,
      previous_response_id:
        converstationRepository.getLastRepositoryId(conversationId),
    });

    converstationRepository.setLastRepositoryId(conversationId, response.id);

    return { id: conversationId, message: response.text };
  },
};
