import * as vscode from "vscode";
import { AIReviewer } from "../agents/aiReviewer";
import { DiffProvider } from "../contexts/diffProvider";
import { generateReviewHTML } from "../ui/review";
import { AISidebarProvider } from "../ui/sidebarProvider";
import { OPENAI_KEY_SECRET } from "./constants";

export function setup(
  context: vscode.ExtensionContext,
  aiReviewer: AIReviewer | null,
  diffProvider: DiffProvider
) {
  context.subscriptions.push(
    setOpenAIKeyCommand(context, aiReviewer),
    reviewCodeCommand(context, aiReviewer, diffProvider)
  );

  const sidebarProvider = new AISidebarProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("deltaSettings", sidebarProvider)
  );

  vscode.window.showInformationMessage("Extension setup complete!");
}

function setOpenAIKeyCommand(
  context: vscode.ExtensionContext,
  aiReviewer: AIReviewer | null
) {
  return vscode.commands.registerCommand("delta.setOpenAIKey", async () => {
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
  });
}

function reviewCodeCommand(
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
          cancellable: false,
        },
        async () => {
          return await aiReviewer!.reviewChanges(changes);
        }
      );

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
  });
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
