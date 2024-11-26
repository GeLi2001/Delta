import * as vscode from "vscode";
import { DiffProvider } from "./contexts/diffProvider";
import { initializeAIReviewer, setup } from "./utils/setup";

export function activate(context: vscode.ExtensionContext) {
  const diffProvider = new DiffProvider();
  const aiReviewer = initializeAIReviewer(context);

  setup(context, aiReviewer, diffProvider);
}

export function deactivate() {}
