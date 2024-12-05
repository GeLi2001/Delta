import { beforeAll, describe, expect, it } from "@jest/globals";
import { FunctionSchema } from "../../core/types";
import { OpenAIProvider } from "../../providers/openai";

describe("OpenAIProvider", () => {
  let provider: OpenAIProvider;

  beforeAll(() => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is required for tests"
      );
    }
    provider = new OpenAIProvider(apiKey);
  });

  describe("test", () => {
    it("should handle basic prompts", async () => {
      const result = await provider.test("What is 2+2?", { temperature: 0 });
      expect(result.success).toBe(true);
      expect(result.response).toBeTruthy();
    });
  });

  describe("validateFunction", () => {
    const weatherSchema: FunctionSchema = {
      name: "getWeather",
      description: "Get weather information",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    };

    it("should validate function calls", async () => {
      const result = await provider.validateFunction(
        "What's the weather in London?",
        weatherSchema
      );
      expect(result.valid).toBe(true);
    });
  });
});
