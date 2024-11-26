export const codeReviewPrompt = `
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
