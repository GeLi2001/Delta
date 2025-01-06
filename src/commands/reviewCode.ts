import * as vscode from "vscode";
import { AIReviewer } from "../aiReviewer/agent";
import { DiffProvider } from "../contexts/diffProvider";
import { generateReviewHTML } from "../ui-providers/review";
import { OPENAI_KEY_SECRET } from "../utils/constants";

export function registerReviewCodeCommand(
  context: vscode.ExtensionContext,
  aiReviewer: AIReviewer | null,
  diffProvider: DiffProvider
) {
  return vscode.commands.registerCommand("delta.reviewCode", async () => {
    try {
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

      if (!aiReviewer) {
        aiReviewer = new AIReviewer(key);
      }

      const changes = await diffProvider.getCurrentChanges();
      const review = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Reviewing code changes...",
          cancellable: false
        },
        async () => {
          return await aiReviewer!.reviewChanges(changes);
        }
      );

      const panel = vscode.window.createWebviewPanel(
        "codeReview",
        "AI Code Review",
        {
          viewColumn: vscode.ViewColumn.Beside, // Put review panel beside
          preserveFocus: true // Keep focus on main editor
        },
        {
          enableCommandUris: true,
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      // In your webview panel creation code
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "openFile") {
            console.log("openFile", message);
            await vscode.commands.executeCommand("delta.openFile", {
              path: message.path,
              lineNumber: message.lineNumber
            });
          }
        },
        undefined,
        context.subscriptions
      );

      panel.webview.html = generateReviewHTML(review);
    } catch (error) {
      vscode.window.showErrorMessage(`Review failed: ${error}`);
    }
  });
}
