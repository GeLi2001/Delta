import { OpenAIProvider } from '@delta/llm-test';

async function main() {
  const provider = new OpenAIProvider(process.env.OPENAI_API_KEY!);

  // Test basic prompt
  const result = await provider.test(
    "What is the capital of France?",
    { temperature: 0 }
  );
  console.log(result);

  // Test function validation
  const validationResult = await provider.validateFunction(
    "What's the weather in London?",
    {
      name: "getWeather",
      description: "Get weather information for a location",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] }
        },
        required: ["location"]
      }
    }
  );
  console.log(validationResult);
}

main().catch(console.error);