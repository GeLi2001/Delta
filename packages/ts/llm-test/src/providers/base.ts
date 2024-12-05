import { FunctionSchema, LLMProvider, TestOptions, TestResult, ValidationResult } from '../core/types';

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  abstract test(prompt: string, options: TestOptions): Promise<TestResult>;
  abstract validateFunction(prompt: string, schema: FunctionSchema, options?: TestOptions): Promise<ValidationResult>;

  protected async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
    
    throw lastError!;
  }
}