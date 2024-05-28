export type AIState = {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    id?: string;
    name?: string;
  };
  
  export type UIState = {
    id: number;
    display: React.ReactNode;
  };
  
  export type SubmitUserMessageParams = {
    content: string;
  };
  
  export type ShowSandpackEditorParams = {
    code: string;
  };
  