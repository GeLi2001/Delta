import * as vscode from "vscode";

export class AISidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "saveKey": {
          await this._context.secrets.store("openai-api-key", data.value);
          vscode.window.showInformationMessage("API key saved successfully");
          break;
        }
        case "deleteKey": {
          await this._context.secrets.delete("openai-api-key");
          vscode.window.showInformationMessage("API key removed");
          break;
        }
      }
    });
  }

  private _getHtmlForWebview() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; }
            h3 { margin-right: 5px; } /* Added right margin for h3 */
            button, input { width: 100%; margin: 5px 0; padding: 5px; }
          </style>
        </head>
        <body>
          <h3>OpenAI API Key</h3>
          <input type="password" id="apiKey" placeholder="Enter API Key">
          <button onclick="saveKey()">Save</button>
          <button onclick="deleteKey()">Remove</button>
          
          <script>
            const vscode = acquireVsCodeApi();
            
            function saveKey() {
              const key = document.getElementById('apiKey').value;
              vscode.postMessage({ type: 'saveKey', value: key });
            }
            
            function deleteKey() {
              vscode.postMessage({ type: 'deleteKey' });
            }
          </script>
        </body>
      </html>
    `;
  }
}
