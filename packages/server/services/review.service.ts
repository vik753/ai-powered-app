import { type Review } from '../generated/prisma/client.ts';
import { ReviewRepository } from '../repositories/review.repository.ts';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ReviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return ReviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    const reviews = await ReviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((review) => review.content).join('\n\n');

    const prompt = `Summarize the following customer reviews into a short paragraph
                    highlighting key themes, both positive and negative:
    
                    ${joinedReviews}
                    `;

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 500,
    });

    return response.output_text;
  },
};
