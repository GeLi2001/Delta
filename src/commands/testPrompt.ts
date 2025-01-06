import * as vscode from "vscode";
import { PromptTestingProvider } from "../ui-providers/promptTestingSidebarProvider";

export function registerTestPromptCommand(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("delta.testPrompt", async () => {
    try {
      // Create webview panel
      const panel = vscode.window.createWebviewPanel(
        "promptTesting",
        "Prompt Testing",
        vscode.ViewColumn.Two, // Opens in second editor column
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      // Initialize the provider with the panel
      const provider = new PromptTestingProvider(context.extensionUri, context);
      provider.resolveWebviewPanel(panel);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to open prompt testing: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });
}
