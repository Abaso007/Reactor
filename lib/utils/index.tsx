import { OpenAIMessage, OpenAIFunction } from '@/types/openai';
import { OpenAIStream } from 'ai';
import type OpenAI from 'openai';
import zodToJsonSchema from 'zod-to-json-schema';
import { ToolDefinition, TAnyToolDefinitionArray, TToolDefinitionMap } from './tool-definition';
import { z } from 'zod';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Function to consume the stream
const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

// Function to run OpenAI completion with provided parameters
export function runOpenAICompletion(
  openai: OpenAI,
  params: {
    model: string;
    stream: boolean;
    messages: OpenAIMessage[];
    functions: TAnyToolDefinitionArray;
    temperature?: number;
  }
) {
  let text = '';
  let hasFunction = false;

  type TToolMap = TToolDefinitionMap<typeof params.functions>;
  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  const functionsMap: Record<string, TAnyToolDefinitionArray[number]> = {};
  for (const fn of params.functions) {
    functionsMap[fn.name] = fn;
  }

  let onFunctionCall = {} as any;

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map(fn => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<string, unknown>,
          })),
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;

            if (!onFunctionCall[functionCallPayload.name]) {
              return;
            }

            // we need to convert arguments from z.input to z.output
            // this is necessary if someone uses a .default in their schema
            const zodSchema = functionsMap[functionCallPayload.name].parameters;
            const parsedArgs = zodSchema.safeParse(
              functionCallPayload.arguments,
            );

            if (!parsedArgs.success) {
              throw new Error(
                `Invalid function call in message. Expected a function call object`,
              );
            }

            onFunctionCall[functionCallPayload.name]?.(parsedArgs.data);
          },
          onToken(token) {
            text += token;
            if (text.startsWith('{')) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        },
      ),
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>,
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: <TName extends TAnyToolDefinitionArray[number]['name']>(
      name: TName,
      callback: (
        args: z.output<
          TName extends keyof TToolMap
            ? TToolMap[TName] extends infer TToolDef
              ? TToolDef extends TAnyToolDefinitionArray[number]
                ? TToolDef['parameters']
                : never
              : never
            : never
        >,
      ) => void | Promise<void>,
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}

// Utility function to merge classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to format numbers as currency
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

// Utility function to run an async function without blocking
export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn();
};

// Utility function to sleep for a specified amount of time
export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Fake data function to get stock price
export function getStockPrice(name: string) {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total = (total + name.charCodeAt(i) * 9999121) % 9999;
  }
  return total / 100;
}
