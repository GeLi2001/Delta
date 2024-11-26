import * as vscode from "vscode";
import { Change, Hunk } from "./types";

export class DiffProvider {
  async getCurrentChanges(): Promise<Change[]> {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      throw new Error("Git extension not found");
    }

    const git = gitExtension.exports.getAPI(1);
    const repository = git.repositories[0];

    if (!repository) {
      throw new Error("No git repository found");
    }

    // Get all changes in the repository
    const changes: Change[] = [];

    // Get modified files
    const state = repository.state;

    for (const change of state.workingTreeChanges) {
      // Get the diff for this specific file
      const uri = change.uri;
      const diff = await repository.diffWithHEAD(uri.fsPath);

      if (diff) {
        // Convert the diff to string if it's a Buffer
        const diffText = diff.toString();
        const fileChanges = await this.parseDiff(diffText, uri.fsPath);
        changes.push(...fileChanges);
      }
    }

    return changes;
  }

  private async parseDiff(diff: string, filePath: string): Promise<Change[]> {
    const changes: Change[] = [];
    const lines = diff.split("\n");
    let currentHunk: Hunk | null = null;

    for (const line of lines) {
      if (line.startsWith("@@ ")) {
        currentHunk = this.parseHunkHeader(line);
      } else if (line.startsWith("+") || line.startsWith("-")) {
        if (currentHunk) {
          changes.push({
            type: line.startsWith("+") ? "add" : "delete",
            file: filePath,
            content: line.substring(1),
            lineNumber: line.startsWith("+")
              ? currentHunk.newStart
              : currentHunk.oldStart,
          });
        }
      }
    }

    return changes;
  }

  private parseHunkHeader(header: string): Hunk {
    const match = header.match(/@@ -(\d+),?(\d+)? \+(\d+),?(\d+)? @@/);
    if (!match) {
      throw new Error("Invalid hunk header");
    }

    return {
      oldStart: parseInt(match[1]),
      oldLength: match[2] ? parseInt(match[2]) : 1,
      newStart: parseInt(match[3]),
      newLength: match[4] ? parseInt(match[4]) : 1,
    };
  }
}
