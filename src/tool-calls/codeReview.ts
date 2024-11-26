export const codeReviewTool = {
  type: "function",
  function: {
    name: "analyzeCode",
    description: "Analyze code changes for issues and best practices",
    parameters: {
      type: "object",
      properties: {
        file: { type: "string" },
        lineNumber: { type: "number" },
        type: { type: "string" },
        content: { type: "string" },
      },
      required: ["file", "lineNumber", "type", "content"],
    },
  },
};
