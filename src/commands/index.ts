import * as vscode from "vscode";
import { AIReviewer } from "../aiReviewer/agent";
import { DiffProvider } from "../contexts/diffProvider";
import { registerOpenFileCommand } from "./openFile";
import { registerReviewCodeCommand } from "./reviewCode";
import { registerSetOpenAIKeyCommand } from "./setOpenAIKey";

export function registerCommands(
  context: vscode.ExtensionContext,
  aiReviewer: AIReviewer | null,
  diffProvider: DiffProvider
) {
  registerOpenFileCommand(context);
  registerSetOpenAIKeyCommand(context, aiReviewer);
  registerReviewCodeCommand(context, aiReviewer, diffProvider);
}
