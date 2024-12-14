export const codeReviewTool = {
  type: "function" as const,
  function: {
    name: "analyzeCode",
    description: "Analyze code changes for issues and best practices",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Brief overview of changes" },
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              file: { type: "string" },
              line: { type: "number" },
              description: { type: "string" },
              recommendation: { type: "string" },
              impact: { type: "string" }
            }
          }
        },
        securityIssues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              severity: { type: "string", enum: ["low", "medium", "high"] },
              description: { type: "string" },
              location: { type: "string" },
              recommendation: { type: "string" }
            }
          }
        },
        bestPractices: {
          type: "array",
          items: { type: "string" }
        },
        complexity: { type: "string" },
        impact: { type: "string" }
      },
      required: [
        "summary",
        "suggestions",
        "securityIssues",
        "bestPractices",
        "complexity",
        "impact"
      ]
    }
  }
};
