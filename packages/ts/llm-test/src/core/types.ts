export interface LLMProvider {
    name: string;
    test(prompt: string, options: TestOptions): Promise<TestResult>;
    validateFunction(prompt: string, schema: FunctionSchema, options?: TestOptions): Promise<ValidationResult>;
  }
  
  export interface FunctionSchema {
    name: string;
    description?: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
  }
  
  export interface TestOptions {
    model?: string;
    temperature?: number;
    maxRetries?: number;
    timeout?: number;
    validateOutput?: boolean;
  }
  
  export interface TestResult {
    success: boolean;
    prompt: string;
    response?: string;
    functionCalls?: {
      name: string;
      args: Record<string, any>;
    }[];
    error?: string;
    duration: number;
    raw?: any;
  }
  
  export interface ValidationResult {
    valid: boolean;
    errors?: string[];
    suggestions?: string[];
  }