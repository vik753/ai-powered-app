import type { Request, Response } from 'express';
import { ReviewService } from '../services/review.service.ts';
import { ProductRepository } from '../repositories/product.repository.ts';
import { ReviewRepository } from '../repositories/review.repository.ts';

export const reviewController = {
  getReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }

    const reviews = await ReviewRepository.getReviews(productId);
    const summary = await ReviewRepository.getReviewSummary(productId);

    res.json({ summary, reviews });
  },

  summarizeReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product id.' });
      return;
    }

    const product = await ProductRepository.getProducts(productId);
    if (!product) {
      res.status(400).json({ error: 'Invalid product.' });
      return;
    }

    const reviews = await ReviewRepository.getReviews(productId);
    if (!reviews.length) {
      res.status(400).json({ error: 'There are no reviews for summarize.' });
      return;
    }

    const summary = await ReviewService.summarizeReviews(productId);
    res.json({ summary });
  },
};
