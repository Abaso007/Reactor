/**
*** This file exports the 'submitUserMessage' function from the 'serverFunctions' module.
*** The 'submitUserMessage' function is used to submit user messages to the OpenAI service.
**/

// Import 'submitUserMessage' function from 'serverFunctions' module
import { submitUserMessage } from '../services/serverFunctions';

console.log('Imported submitUserMessage function from serverFunctions');

// Export 'submitUserMessage' function
export { submitUserMessage };

console.log('Exported submitUserMessage function');