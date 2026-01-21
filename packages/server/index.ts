import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import router from './routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
