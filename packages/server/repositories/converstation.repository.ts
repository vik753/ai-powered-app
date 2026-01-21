const conversations = new Map<string, string>();

export const converstationRepository = {
    getLastRepositoryId: (conversationId: string) => conversations.get(conversationId),
    setLastRepositoryId: (conversationId: string, responseId: string) => conversations.set(conversationId, responseId),
}