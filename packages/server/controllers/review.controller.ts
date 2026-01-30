import type { Request, Response } from 'express';
import { ReviewService } from '../services/review.service.ts';

export const reviewController = {
  getReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }

    const reviews = await ReviewService.getReviews(productId);

    res.json(reviews);
  },

  summarizeReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }

    const summary = await ReviewService.summarizeReviews(productId);
    res.json({ summary });
  },
};
