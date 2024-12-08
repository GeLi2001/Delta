import { Expectation } from "../core/types";

export function validateExpectations(
  response: string,
  expectations: Expectation[]
): boolean {
  for (const expectation of expectations) {
    if (expectation.contains && !response.includes(expectation.contains)) {
      return false;
    }
    // Add other assertion types
  }
  return true;
}
