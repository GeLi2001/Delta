import OpenAI from "openai";
import { Change, ReviewResult } from "./types";

export class AIReviewer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async reviewChanges(changes: Change[]): Promise<ReviewResult> {
    const prompt = this.generatePrompt(changes);
    const response = await this.callAI(prompt);
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

Please analyze for:
1. Summary of changes
2. Potential bugs or issues
3. Security concerns
4. Best practices
5. Code complexity
6. Potential impact

Format your response in JSON with the following structure:
{
    "summary": "Brief overview of changes",
    "suggestions": [{"file": "path", "line": number, "description": "issue", "recommendation": "fix", "impact": "effect"}],
    "securityIssues": [{"severity": "low|medium|high", "description": "issue", "location": "where", "recommendation": "fix"}],
    "bestPractices": ["practice1", "practice2"],
    "complexity": "complexity assessment",
    "impact": "potential impact"
}`;
  }

  private async callAI(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.3,
    });

    return completion.choices[0].message.content || "";
  }

  private parseResponse(response: string): ReviewResult {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }
}
