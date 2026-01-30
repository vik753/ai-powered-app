import { Router } from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/api/chat', chatController.sendMessage);

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

router.get(`/api/products/:id/reviews`, async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

export default router;
