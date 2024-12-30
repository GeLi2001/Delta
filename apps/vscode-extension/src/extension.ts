import * as vscode from "vscode";
import { DiffProvider } from "./contexts/diffProvider";
import { initializeAIReviewer, setup } from "./utils/setup";

export async function activate(context: vscode.ExtensionContext) {
  // Check if we have a workspace
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showWarningMessage(
      "Delta requires an open workspace to function."
    );
    return;
  }

  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (gitExtension && !gitExtension.isActive) {
      await gitExtension.activate();
    }

    const diffProvider = await DiffProvider.create(context);
    const aiReviewer = initializeAIReviewer(context);

    setup(context, aiReviewer, diffProvider);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to activate Delta: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function deactivate() {}
