import * as vscode from "vscode";
import { registerOpenFileCommand } from "./openFile";
export function registerCommands(context: vscode.ExtensionContext) {
  registerOpenFileCommand(context);
}
