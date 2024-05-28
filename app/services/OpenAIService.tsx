// app/services/OpenAIService.tsx
/**
*** This file defines the OpenAIService class which is responsible for handling interactions with the OpenAI API.
*** It uses the OpenAI SDK to send user messages to the GPT-4 model and process the responses.
*** The class includes error handling and extensive logging for debugging during development.
**/

// Importing necessary modules and components
import OpenAI from 'openai'; // OpenAI SDK for interacting with the OpenAI API
import { getMutableAIState, createStreamableUI } from 'ai/rsc'; // Helper functions for managing AI state and creating streamable UI components
import { runOpenAICompletion } from '@/lib/utils'; // Function to run OpenAI completion
import { systemMessage } from '../ai/systemMessage'; // System message to be sent to OpenAI
import { functions, handleFunctionCalls } from '../ai/functions'; // Functions to handle specific AI function calls
import { BotMessage } from '@/components/llm-stocks'; // BotMessage component for displaying messages
import { AI } from '../action'; // AI action definitions

export const maxDuration = 60; // Maximum duration for OpenAI completion in seconds

// OpenAIService class definition
export class OpenAIService {
  private openai: OpenAI; // Instance of OpenAI SDK

  // Constructor initializes OpenAI SDK with provided API key
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    console.log('OpenAI SDK initialized with API key');
  }

  // Method to submit user message to OpenAI and process the response
  async submitUserMessage(content: string) {
    try {
      console.log('Submitting user message to OpenAI:', content);
      
      // Get mutable AI state
      const aiState = getMutableAIState<typeof AI>();
      // Update AI state with user message
      aiState.update([
        ...aiState.get(),
        {
          role: 'user',
          content,
        },
      ]);

      console.log('AI state updated with user message');

      // Create initial bot message UI with loading state
      const reply = createStreamableUI(
        <BotMessage className="items-center">Loading...</BotMessage>,
      );

      console.log('Initial bot message UI created with loading state');

      // Run OpenAI completion with system message, user message, and AI functions
      const completion = runOpenAICompletion(this.openai, {
        model: 'gpt-4o',
        stream: true,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          ...aiState.get().map((info: any) => ({
            role: info.role,
            content: info.content,
            name: info.name,
          })),
        ],
        functions,
        temperature: 0,
      });

      console.log('OpenAI completion run with system message, user message, and AI functions');

      // Handle text content from OpenAI completion
      completion.onTextContent((content: string, isFinal: boolean) => {
        // Update bot message UI with content
        reply.update(<BotMessage>{content}</BotMessage>);
        console.log('Bot message UI updated with content from OpenAI completion');
        // If content is final, mark reply as done and update AI state with assistant message
        if (isFinal) {
          reply.done();
          aiState.done([...aiState.get(), { role: 'assistant', content }]);
          console.log('Reply marked as done and AI state updated with assistant message');
        }
      });

      // Handle function calls from OpenAI completion
      handleFunctionCalls(completion, aiState, reply);
      console.log('Function calls from OpenAI completion handled');

      // Return message ID and display value
      return {
        id: Date.now(),
        display: reply.value,
      };
    } catch (error) {
      // Log error to console with descriptive message
      console.error('Error in submitUserMessage:', error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}