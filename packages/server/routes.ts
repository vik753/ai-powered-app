import { Router } from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller.ts';

const router = Router();

router.post('/api/chat', chatController.sendMessage);

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

router.get(`/api/products/:id/reviews`, reviewController.getReviews);

router.post(
  `/api/products/:id/reviews/summarize`,
  reviewController.summarizeReviews
);

export default router;
