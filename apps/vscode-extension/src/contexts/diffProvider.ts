import simpleGit, { SimpleGit } from "simple-git";
import * as vscode from "vscode";
import { Change } from "../types";
export class DiffProvider {
  private git: SimpleGit | null = null;

  static async create(context: vscode.ExtensionContext): Promise<DiffProvider> {
    const diffProvider = new DiffProvider();
    await diffProvider.initialize();
    return diffProvider;
  }

  async initialize(): Promise<void> {
    // Get the workspace folder path
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("No workspace folder found");
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;

    try {
      this.git = simpleGit(workspacePath);

      // Verify it's a git repository
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) {
        throw new Error(`${workspacePath} is not a git repository`);
      }
    } catch (error) {
      this.git = null;
      throw new Error(`Failed to initialize git: ${error}`);
    }
  }

  async getCurrentChanges(): Promise<Change[]> {
    if (!this.git) {
      try {
        await this.initialize();
      } catch (error) {
        console.error("Failed to initialize git:", error);
        return [];
      }
    }

    try {
      const status = await this.git!.status();
      const changes: Change[] = [];

      const modifiedFiles = [
        ...status.modified,
        ...status.created,
        ...status.deleted
      ];

      for (const file of modifiedFiles) {
        try {
          const diff = await this.git!.diff(["HEAD", file]);
          const fileChanges = this.parseDiff(diff, file);
          changes.push(...fileChanges);
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
        }
      }

      return changes;
    } catch (error) {
      console.error("Error getting changes:", error);
      return [];
    }
  }

  private parseDiff(diff: string, filePath: string): Change[] {
    const changes: Change[] = [];
    const lines = diff.split("\n");
    let currentLineNumber = 0;

    for (const line of lines) {
      // Skip diff headers
      if (
        line.startsWith("diff") ||
        line.startsWith("index") ||
        line.startsWith("+++") ||
        line.startsWith("---")
      ) {
        continue;
      }

      // Handle hunk headers
      if (line.startsWith("@@")) {
        const match = line.match(/@@ -\d+(?:,\d+)? \+(\d+)/);
        if (match) {
          currentLineNumber = parseInt(match[1], 10) - 1;
        }
        continue;
      }

      // Handle actual changes
      if (line.startsWith("+")) {
        changes.push({
          type: "add",
          file: filePath,
          content: line.substring(1),
          lineNumber: ++currentLineNumber
        });
      } else if (line.startsWith("-")) {
        changes.push({
          type: "delete",
          file: filePath,
          content: line.substring(1),
          lineNumber: currentLineNumber
        });
      } else if (line.startsWith(" ")) {
        currentLineNumber++;
      }
    }

    return changes;
  }
}
