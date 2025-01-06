import OpenAI from "openai";

export class OpenAIWrapper {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async chatCompletion(
    prompt: string,
    model: string = "gpt-4",
    temperature: number = 0.3
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: temperature
    });
    console.log(JSON.stringify(completion, null, 2));

    return completion.choices[0].message.content || "";
  }

  async functionCall(
    prompt: string,
    tools: OpenAI.Chat.Completions.ChatCompletionTool[],
    model: string = "gpt-4",
    temperature: number = 0.3
  ): Promise<string> {
    console.log(prompt);
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: temperature,
      tools: tools,
      tool_choice: "required"
    });
    const toolCall =
      completion.choices[0].message.tool_calls![0].function.arguments;
    console.log(toolCall);
    return toolCall;
  }
}
