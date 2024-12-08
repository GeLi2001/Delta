import { readFileSync } from "fs";
import { load } from "js-yaml";
import { TestSuite } from "../core/types";

export function loadYamlTests(path: string): TestSuite {
  try {
    const fileContents = readFileSync(path, "utf8");
    const data = load(fileContents) as TestSuite;
    return data;
  } catch (error) {
    throw new Error(`Failed to load test suite from ${path}: ${error}`);
  }
}
