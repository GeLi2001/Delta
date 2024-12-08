import { OpenAI } from "openai";
import { BaseLLMProvider } from "./base";

export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({ apiKey });
  }

  async test(prompt: string, config?: any) {
    // Implementation
    return await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      ...config,
    });
  }

  async validateFunction(prompt: string, functionSchema: any) {
    // Implementation
    return await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      functions: [functionSchema],
      function_call: "auto",
    });
  }
}
