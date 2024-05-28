// app/action.tsx

/**
*** This file defines the AI actions for the application using the Generative UI framework provided by the Vercel AI SDK.
*** Generative UI allows the AI to control parts of the UI, making it more interactive and dynamic.
*** The AI and UI states are managed separately, allowing for a clear separation of concerns.
*** The 'createAI' function from the 'ai/rsc' module is used to create the AI with the defined actions and initial states.
**/

import 'server-only'; // Ensures that this file is only run on the server

import { createAI } from 'ai/rsc'; // Function to create the AI. Part of the Vercel AI SDK.
import { submitUserMessage } from './actions/submitUserMessage'; // Action to submit user messages to the AI
import { showSandpackEditor } from './actions/showSandpackEditor'; // Action to show the Sandpack editor. This is an example of the AI controlling the UI.
import { initialAIState, initialUIState } from './ai/config'; // Initial states for the AI and UI. These are used to reset the states when needed.

// Create the AI with the defined actions and initial states
export const AI = createAI({
  actions: {
    submitUserMessage,
    showSandpackEditor,
  },
  initialUIState, // The initial state of the UI. This is used when the UI is first loaded or when it needs to be reset.
  initialAIState, // The initial state of the AI. This is used when the AI is first loaded or when it needs to be reset.
});

console.log('AI created with submitUserMessage and showSandpackEditor actions');