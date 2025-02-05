import * as vscode from "vscode";
import { OpenAIWrapper } from "../language-models/openai";
import { OPENAI_KEY_SECRET } from "../utils/constants";

export class PromptTestingProvider {
  private _view?: vscode.WebviewView | vscode.WebviewPanel;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewPanel(panel: vscode.WebviewPanel) {
    this._view = panel;
    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    panel.webview.html = this._getHtmlForWebview();
    this._setupMessageListener(panel.webview);
  }

  private _setupMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(async (data) => {
      console.log("received message", data);
      switch (data.type) {
        case "testPrompt": {
          try {
            const apiKey = await this._context.secrets.get(OPENAI_KEY_SECRET);
            if (!apiKey) {
              throw new Error("OpenAI API key not found");
            }

            webview.postMessage({
              type: "status",
              value: "Generating LLM response..."
            });

            const openai = new OpenAIWrapper(apiKey);
            const response = await openai.chatCompletion(
              data.value.prompt,
              "gpt-4",
              data.value.temperature
            );

            webview.postMessage({
              type: "response",
              value: response
            });
          } catch (error) {
            webview.postMessage({
              type: "error",
              value: `Error: ${error}`
            });
          }
          break;
        }
        case "testFunction": {
          try {
            console.log("triggering function call");
            const apiKey = await this._context.secrets.get(OPENAI_KEY_SECRET);
            if (!apiKey) {
              throw new Error("OpenAI API key not found");
            }
            console.log(data.value.tools);
            webview.postMessage({
              type: "status",
              value: "Generating LLM response..."
            });
            const openai = new OpenAIWrapper(apiKey);
            const response = await openai.functionCall(
              data.value.prompt,
              [data.value.tools],
              "gpt-4",
              data.value.temperature
            );
            webview.postMessage({
              type: "response",
              value: response
            });
          } catch (error) {
            webview.postMessage({
              type: "error",
              value: `Error: ${error}`
            });
          }
          break;
        }
      }
    });
  }

  private _getHtmlForWebview() {
    if (!this._view?.webview) {
      return "";
    }
    const webview = this._view.webview;

    // Get paths to local resources
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "webview", "webview.js")
    );

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource};">
          <title>Prompt Testing</title>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${webview.cspSource}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
