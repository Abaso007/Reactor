//app/ai/functions.tsx

/**
*** This file defines the AI functions and how to handle them.
*** It includes a function to show the Sandpack code editor and a function to handle AI function calls.
*** The functions are defined with the 'z' library for schema validation.
**/

import { z } from 'zod'; // Library for schema validation
import SandpackEditor from '@/components/SandPack_Components/SandpackEditor'; // Sandpack code editor component
import { createStreamableUI } from 'ai/rsc'; // Helper function to create streamable UI components
import React from 'react';

// Define AI functions
export const functions = [
  {
    name: 'show_sandpack_editor',
    description: 'Show the code editor and preview using Sandpack.',
    parameters: z.object({
      code: z.string().describe('The code to be displayed in Sandpack.'),
    }),
  },
];

console.log('AI functions defined');

// Function to handle AI function calls
export const handleFunctionCalls = (completion: any, aiState: any, reply: any) => {
  try {
    console.log('Handling AI function calls');
    
    // Handle 'show_sandpack_editor' function call
    completion.onFunctionCall(
      'show_sandpack_editor',
      ({ code }: { code: string }) => {
        console.log('Handling "show_sandpack_editor" function call with code:', code);
        
        // Show Sandpack editor with provided code
        reply.done(
          <SandpackEditor code={code} />
        );
        console.log('Sandpack editor shown with provided code');
        
        // Update AI state with function call information
        aiState.done([
          ...aiState.get(),
          {
            role: 'function',
            name: 'show_sandpack_editor',
            content: `[Sandpack editor loaded with provided code.]`,
          },
        ]);
        console.log('AI state updated with "show_sandpack_editor" function call information');
      },
    );
  } catch (error) {
    // Log any errors that occur
    console.error('Error in handleFunctionCalls:', error);
    throw error; // re-throw the error to be handled by the caller
  }
};

console.log('Function to handle AI function calls defined');