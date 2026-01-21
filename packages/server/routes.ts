import { Router } from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = Router();

router.post('/api/chat', chatController.sendMessage);

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

export default router;