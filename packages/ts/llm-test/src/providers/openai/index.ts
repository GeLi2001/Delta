import OpenAI from 'openai';
import { FunctionSchema, TestOptions, TestResult, ValidationResult } from '../../core/types';
import { BaseLLMProvider } from '../base';
import { validateFunctionSchema } from './schemas';

export class OpenAIProvider extends BaseLLMProvider {
  name = 'openai';
  private client: OpenAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new OpenAI({ apiKey });
  }

  async test(prompt: string, options: TestOptions = {}): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const completion = await this.retry(() => 
        this.client.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: options.model || "gpt-4",
          temperature: options.temperature || 0.1,
        })
      );

      return {
        success: true,
        prompt,
        response: completion.choices[0].message.content || "",
        duration: Date.now() - startTime,
        raw: completion
      };
    } catch (error) {
      return {
        success: false,
        prompt,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime
      };
    }
  }

  async validateFunction(
    prompt: string, 
    schema: FunctionSchema, 
    options: TestOptions = {}
  ): Promise<ValidationResult> {
    const schemaValidation = validateFunctionSchema(schema);
    if (!schemaValidation.valid) {
      return schemaValidation;
    }

    const startTime = Date.now();
    
    try {
      const completion = await this.retry(() => 
        this.client.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: options.model || "gpt-4",
          temperature: options.temperature || 0.1,
          tools: [{
            type: "function",
            function: schema
          }],
          tool_choice: "auto"
        })
      );

      const toolCall = completion.choices[0].message.tool_calls?.[0];
      
      if (!toolCall) {
        return {
          valid: false,
          errors: ["No function call was made"]
        };
      }

      return {
        valid: true,
        suggestions: []
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : "Unknown error"]
      };
    }
  }
}