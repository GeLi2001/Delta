import { ReviewResult, SecurityIssue, Suggestion } from "../types";

export function generateReviewHTML(review: ReviewResult): string {
  return `<!DOCTYPE html>
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .section { margin-bottom: 20px; }
                    .issue { margin: 10px 0; padding: 10px; background: #f0f0f0; }
                    .security-high { border-left: 4px solid #ff0000; }
                    .security-medium { border-left: 4px solid #ffa500; }
                    .security-low { border-left: 4px solid #ffff00; }
                </style>
            </head>
            <body>
                <h1>Code Review Results</h1>
                
                <div class="section">
                    <h2>Summary</h2>
                    <p>${review.summary}</p>
                </div>
    
                <div class="section">
                    <h2>Suggestions</h2>
                    ${review.suggestions
                      .map(
                        (s: Suggestion) => `
                        <div class="issue">
                            <strong>
                            <a href="#" onclick="openFile('${s.file}', ${s.line}); return false;">
                                    ${s.file}:${s.line}
                                </a>
                            </strong>                            
                            <p>${s.description}</p>
                            <p><strong>Recommendation:</strong> ${s.recommendation}</p>
                            <p><strong>Impact:</strong> ${s.impact}</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
    
                <div class="section">
                    <h2>Security Issues</h2>
                    ${review.securityIssues
                      .map(
                        (s: SecurityIssue) => `
                        <div class="issue security-${s.severity}">
                            <strong>${s.severity.toUpperCase()}</strong>
                            <p>${s.description}</p>
                            <p><strong>Location:</strong> ${s.location}</p>
                            <p><strong>Recommendation:</strong> ${
                              s.recommendation
                            }</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
    
                <div class="section">
                    <h2>Best Practices</h2>
                    <ul>
                        ${review.bestPractices
                          .map((p: string) => `<li>${p}</li>`)
                          .join("")}
                    </ul>
                </div>
    
                <div class="section">
                    <h2>Complexity</h2>
                    <p>${review.complexity}</p>
                </div>
    
                <div class="section">
                    <h2>Potential Impact</h2>
                    <p>${review.impact}</p>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    function openFile(path, line) {
                        console.log("openFile", path, line);
                        vscode.postMessage({
                            command: 'openFile',
                            path: path,
                            lineNumber: line
                        });
                    }
                </script>
            </body>
        </html>`;
}
