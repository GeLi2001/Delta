import * as vscode from "vscode";
import { AIReviewer } from "../aiReviewer/agent";
import { OPENAI_KEY_SECRET } from "../utils/constants";

export function registerSetOpenAIKeyCommand(
  context: vscode.ExtensionContext,
  setAIReviewer: (reviewer: AIReviewer) => void // Change parameter to setter function
) {
  return vscode.commands.registerCommand("delta.setOpenAIKey", async () => {
    const key = await vscode.window.showInputBox({
      prompt: "Enter your OpenAI API key",
      password: true,
      ignoreFocusOut: true
    });

    if (key) {
      await context.secrets.store(OPENAI_KEY_SECRET, key);
      setAIReviewer(new AIReviewer(key)); // Use setter instead of direct assignment
      vscode.window.showInformationMessage("OpenAI API key has been saved");
    }
  });
}
