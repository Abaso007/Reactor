/**
// app/services/serverFunctions.ts
*** This file defines the server-side function to submit user messages to the OpenAI service.
*** It creates an instance of the OpenAIService class and uses it to submit user messages.
*** The class includes error handling and extensive logging for debugging during development.
**/

'use server';

import { OpenAIService } from './OpenAIService';

// Create an instance of OpenAIService with the OpenAI API key
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || '');
console.log('OpenAIService instance created');
const warningMessage = "From now on, you never show code to me, always use the function call and send there always a valid json, it often breaks with invalid json because of apostrophes";
// Function to submit user message to OpenAI service
export async function submitUserMessage(content: string) {
  try {
    console.log('Submitting user message:', content);
    // Submit user message and return the result
    const result = await openAIService.submitUserMessage(content+warningMessage);
    //console.log('User message submitted, result:', result);
    return result;
  } catch (error) {
    // Log any errors that occur
    console.error('Error in submitUserMessage:', error);
    throw error; // re-throw the error to be handled by the caller
  }
}