import * as vscode from "vscode";

export function registerOpenFileCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "delta.openFile",
      async (args: { path: string; lineNumber: number }) => {
        try {
          if (!args?.path) {
            throw new Error("File path is required");
          }

          // Get the workspace root
          const workspaceRoot =
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!workspaceRoot) {
            throw new Error("No workspace folder found");
          }

          // First focus the first editor group (main editor)
          await vscode.commands.executeCommand(
            "workbench.action.focusFirstEditorGroup"
          );

          // Resolve the full path
          const fullPath = args.path.startsWith("/")
            ? args.path
            : vscode.Uri.joinPath(vscode.Uri.file(workspaceRoot), args.path)
                .fsPath;

          const fileUri = vscode.Uri.file(fullPath);

          // Open document in the now-focused main editor group
          const doc = await vscode.workspace.openTextDocument(fileUri);
          const editor = await vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.One, // Force it to open in the first editor group
            preserveFocus: false, // Give focus to the opened file
            preview: false, // Open as a permanent editor
          });

          if (args.lineNumber) {
            const line = Math.max(0, args.lineNumber - 1);
            const position = new vscode.Position(line, 0);
            const selection = new vscode.Selection(position, position);
            editor.selection = selection;
            editor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
          }
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to open file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    )
  );
}
