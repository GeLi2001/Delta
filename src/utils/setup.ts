import * as vscode from "vscode";
import { AIReviewer } from "../aiReviewer/agent";
import { registerCommands } from "../commands";
import { DiffProvider } from "../contexts/diffProvider";
import { AISidebarProvider } from "../ui/sidebarProvider";
import { OPENAI_KEY_SECRET } from "./constants";

export function setup(
  context: vscode.ExtensionContext,
  aiReviewer: AIReviewer | null,
  diffProvider: DiffProvider
) {
  registerCommands(context, aiReviewer, diffProvider);
  const sidebarProvider = new AISidebarProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("deltaSettings", sidebarProvider)
  );
  vscode.window.showInformationMessage("/Delta loaded/");
}

export function initializeAIReviewer(
  context: vscode.ExtensionContext
): AIReviewer | null {
  let aiReviewer: AIReviewer | null = null;
  context.secrets.get(OPENAI_KEY_SECRET).then((key) => {
    if (key) {
      aiReviewer = new AIReviewer(key);
    }
  });
  return aiReviewer;
}
