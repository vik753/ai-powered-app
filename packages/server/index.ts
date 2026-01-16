import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    const stream = await client.responses.create({
      model: "gpt-4.1-mini",
      input: "Write a story about chihuahua.",
      temperature: 0.7,
      max_output_tokens: 250,
      stream: true,
    });

    // Send initial padding to force browser buffer flush
    res.write('<!DOCTYPE html><html><body><!-- ' + ' '.repeat(1024) + ' --><div style="transition: all 0.5s; font-family: -apple-system, BlinkMacSystemFont, \'San Francisco\',\n' +
        '             \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 1.1rem; font-weight: 200; padding: 20px;">');

    for await (const event of stream) {
      if ("delta" in event && event.delta) {
        res.write(event.delta);
      }
    }
    res.write('</div></body></html>');
    res.end();
  } catch (error) {
    console.error('Error stream:', error);
    if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
    } else {
        res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
