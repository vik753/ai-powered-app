import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  previous_response_id?: string;
};

type LlmClientResponse = {
  id: string;
  text: string;
};

export const llmClient = {
  generateText: async ({
    model = 'gpt-4.1-mini',
    prompt,
    temperature = 0.2,
    maxTokens = 300,
  }: GenerateTextOptions): Promise<LlmClientResponse> => {
    const response = await client.responses.create({
      model,
      input: prompt,
      temperature,
      max_output_tokens: maxTokens,
    });

    return { id: response.id, text: response.output_text };
  },
};
