// actions/showSandpackEditor.tsx

/**
*** This file defines the 'showSandpackEditor' function which is used to display the Sandpack code editor.
*** The function takes a string of code as input and displays it in the Sandpack editor.
*** It uses the 'createStreamableUI' function from the 'ai/rsc' module to create a streamable UI component for the Sandpack editor.
*** This is part of the Genui project, which aims to provide an interactive coding environment for users.
**/

// Import necessary modules and components
import { getMutableAIState, createStreamableUI } from 'ai/rsc'; // Helper functions for managing AI state and creating streamable UI components
import { SystemMessage } from '@/components/llm-stocks'; // SystemMessage component for displaying system messages
import { runAsyncFnWithoutBlocking, sleep } from '@/lib/utils'; // Helper functions for running asynchronous functions
import SandpackEditor from '@/components/SandPack_Components/SandpackEditor'; // Sandpack code editor component
import { AI } from '../action'; // AI action definitions

// Function to show Sandpack code editor
export async function showSandpackEditor(code: string) {
  'use server'; // Ensure that this function is run on the server

  // Get mutable AI state
  const aiState = getMutableAIState<typeof AI>();

  // Create a streamable UI component for the Sandpack editor
  const sandpackUI = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      <p className="mb-2">Loading Sandpack...</p>
    </div>,
  );

  // Create a streamable UI component for the system message
  const systemMessage = createStreamableUI(null);

  // Run an asynchronous function without blocking
  runAsyncFnWithoutBlocking(async () => {
    // Wait for 1 second
    await sleep(1000);

    // Display the Sandpack editor with the provided code
    sandpackUI.done(
      <SandpackEditor code={code} />
    );

    // Display a system message indicating that the Sandpack editor has been loaded
    systemMessage.done(
      <SystemMessage>
        Sandpack editor loaded with provided code.
      </SystemMessage>,
    );

    // Update the AI state with the system message
    aiState.done([
      ...aiState.get(),
      {
        role: 'system',
        content: `[Sandpack editor loaded with provided code.]`,
      },
    ]);
  });

  // Return the Sandpack UI value and the new system message
  return {
    sandpackUI: sandpackUI.value,
    newMessage: {
      id: Date.now(),
      display: systemMessage.value,
    },
  };
}