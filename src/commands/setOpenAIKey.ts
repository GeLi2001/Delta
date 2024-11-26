import * as vscode from "vscode";
import { AIReviewer } from "../aiReviewer/agent";
import { OPENAI_KEY_SECRET } from "../utils/constants";

export function registerSetOpenAIKeyCommand(
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
