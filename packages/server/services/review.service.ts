import { type Review } from '../generated/prisma/client.ts';
import { ReviewRepository } from '../repositories/review.repository.ts';
import { llmClient } from '../llm/client.ts';
import template from '../prompts/summarize-reviews.txt';

export const ReviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return ReviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    const reviews = await ReviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((review) => review.content).join('\n\n');

    const prompt = template.replace('{{reviews}}', joinedReviews);

    const response = await llmClient.generateText({ prompt, maxTokens: 500 });
    return response.text;
  },
};
