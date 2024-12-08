import {
  ModelConfig,
  SingleTestOptions,
  TestConfig,
  TestSuite,
} from "../core/types";
import { loadYamlTests } from "../utils/yaml-loader";

export class TestSuiteRunner {
  constructor(
    private config: TestConfig,
    private suite: TestSuite
  ) {}

  async run() {
    console.log(`Running test suite: ${this.suite.name}`);
    for (const test of this.suite.tests) {
      await this.runSingleTest(test);
    }
  }

  private async runSingleTest(test: SingleTestOptions) {
    // Implement test running logic here
    console.log(`Running test: ${test.name}`);
    // Add your test execution logic
  }
}

export class SingleTestRunner {
  constructor(
    private config: TestConfig,
    private test: SingleTestOptions
  ) {}

  async run() {
    // Implement single test running logic here
    console.log(`Running single test: ${this.test.name}`);
    // Add your test execution logic
  }
}

export class Delta {
  private config: TestConfig = {};

  model(name: string, config?: ModelConfig) {
    this.config.model = name;
    this.config.modelConfig = config;
    return this;
  }

  suite(yamlPath: string) {
    const testSuite = loadYamlTests(yamlPath);
    return new TestSuiteRunner(this.config, testSuite);
  }

  test(options: SingleTestOptions) {
    return new SingleTestRunner(this.config, options);
  }
}

// Export a singleton instance
export const delta = new Delta();
