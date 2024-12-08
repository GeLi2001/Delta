export abstract class BaseLLMProvider {
  abstract test(prompt: string, config?: any): Promise<any>;
  abstract validateFunction(prompt: string, functionSchema: any): Promise<any>;
}
