import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { DiffProvider } from "./contexts/diffProvider";
import { initializeAIReviewer, setup } from "./utils/setup";

export async function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (gitExtension && !gitExtension.isActive) {
    await gitExtension.activate();
  }
  const diffProvider = new DiffProvider();
  await diffProvider.initialize();
  const aiReviewer = initializeAIReviewer(context);

  setup(context, aiReviewer, diffProvider);
  registerCommands(context);
}

export function deactivate() {}
