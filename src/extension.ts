import * as vscode from "vscode";
import { AIReviewer } from "./aiReviewer";
import { DiffProvider } from "./diffProvider";
import { AISidebarProvider } from "./sidebarProvider";
import { ReviewResult, SecurityIssue, Suggestion } from "./types";

const OPENAI_KEY_SECRET = "openai-api-key";

export function activate(context: vscode.ExtensionContext) {
  const diffProvider = new DiffProvider();
  let aiReviewer: AIReviewer | null = null;

  // Command to set OpenAI API key
  let setKeyCommand = vscode.commands.registerCommand(
    "delta.setOpenAIKey",
    async () => {
      const key = await vscode.window.showInputBox({
        prompt: "Enter your OpenAI API key",
        password: true,
        ignoreFocusOut: true,
      });

      if (key) {
        await context.secrets.store(OPENAI_KEY_SECRET, key);
        aiReviewer = new AIReviewer(key);
        vscode.window.showInformationMessage("OpenAI API key has been saved");
      }
    }
  );

  // Command to review code
  let reviewCommand = vscode.commands.registerCommand(
    "delta.reviewCode",
    async () => {
      try {
        // Check if we have the API key
        const key = await context.secrets.get(OPENAI_KEY_SECRET);
        if (!key) {
          const setKey = "Set API Key";
          const response = await vscode.window.showErrorMessage(
            "OpenAI API key not found. Please set your API key first.",
            setKey
          );

          if (response === setKey) {
            await vscode.commands.executeCommand("delta.setOpenAIKey");
          }
          return;
        }

        // Initialize AIReviewer if not already done
        if (!aiReviewer) {
          aiReviewer = new AIReviewer(key);
        }

        // Get changes
        const changes = await diffProvider.getCurrentChanges();

        // Show progress
        const review = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Reviewing code changes...",
            cancellable: false,
          },
          async () => {
            return await aiReviewer!.reviewChanges(changes);
          }
        );

        // Show results in webview
        const panel = vscode.window.createWebviewPanel(
          "codeReview",
          "AI Code Review",
          vscode.ViewColumn.Two,
          {}
        );

        panel.webview.html = generateReviewHTML(review);
      } catch (error) {
        vscode.window.showErrorMessage(`Review failed: ${error}`);
      }
    }
  );

  context.subscriptions.push(setKeyCommand, reviewCommand);
  const sidebarProvider = new AISidebarProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aiReviewSettings",
      sidebarProvider
    )
  );
  // Try to initialize AIReviewer with stored key
  context.secrets.get(OPENAI_KEY_SECRET).then((key) => {
    if (key) {
      aiReviewer = new AIReviewer(key);
    }
  });
}

function generateReviewHTML(review: ReviewResult): string {
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
                        <strong>${s.file}:${s.line}</strong>
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
        </body>
    </html>`;
}

export function deactivate() {}
