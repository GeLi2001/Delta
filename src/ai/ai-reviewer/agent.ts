import { Change, ReviewResult } from "../../types";
import { OpenAIWrapper } from "../language-models/openai";
import { codeReviewPrompt } from "./prompts";
import { codeReviewTool } from "./tool-calls";

export class AIReviewer {
  private openaiWrapper: OpenAIWrapper;

  constructor(apiKey: string) {
    this.openaiWrapper = new OpenAIWrapper(apiKey);
  }
  async reviewChanges(changes: Change[]): Promise<ReviewResult> {
    const prompt = this.generatePrompt(changes);
    const response = await this.openaiWrapper.functionCall(prompt, [
      codeReviewTool,
    ]);
    return this.parseResponse(response);
  }

  private generatePrompt(changes: Change[]): string {
    return `Review the following code changes:

${changes
  .map(
    (change) => `
File: ${change.file}
Line ${change.lineNumber}
Type: ${change.type}
Content: ${change.content}
`
  )
  .join("\n")}

${codeReviewPrompt}`;
  }

  private parseResponse(response: string): ReviewResult {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }
}
