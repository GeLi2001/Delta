export interface ModelConfig {
  temperature?: number;
  maxTokens?: number;
}

export interface TestConfig {
  model?: string;
  modelConfig?: ModelConfig;
}

export interface Expectation {
  contains?: string;
  sentiment?: string;
}

export interface Conversation {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SingleTestOptions {
  name?: string;
  systemPrompt?: string;
  conversation: Conversation[];
  expected: Expectation[];
}

export interface TestSuite {
  name: string;
  tests: SingleTestOptions[];
}
