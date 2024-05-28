import { z, ZodObject, ZodRawShape } from 'zod';
import { ChatCompletionMessageParam } from 'openai';

export type OpenAIMessage = ChatCompletionMessageParam;

export type OpenAIFunction = {
  name: string;
  description: string;
  parameters: ZodObject<ZodRawShape>;
};

export type RunCompletionParams = {
  messages: OpenAIMessage[];
  functions: OpenAIFunction[];
  temperature?: number;
};
