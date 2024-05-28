//app/ai/config.ts

/**
*** This file defines the initial states for the AI and UI.
*** The initialAIState is an empty array, indicating that there are no initial messages or actions.
*** The initialUIState is also an empty array, indicating that there are no initial UI elements.
**/

// Initial state for the AI
export const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function'; // Role of the message or action
  content: string; // Content of the message or action
  id?: string; // Optional ID of the message or action
  name?: string; // Optional name of the message or action
}[] = []; // Initial state is an empty array

console.log('Initial AI state defined');

// Initial state for the UI
export const initialUIState: {
  id: number; // ID of the UI element
  display: React.ReactNode; // Display value of the UI element
}[] = []; // Initial state is an empty array

console.log('Initial UI state defined');