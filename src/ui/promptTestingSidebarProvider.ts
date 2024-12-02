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
      localResourceRoots: [this._extensionUri],
    };

    panel.webview.html = this._getHtmlForWebview();
    this._setupMessageListener(panel.webview);
  }

  private _setupMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "testPrompt": {
          try {
            const apiKey = await this._context.secrets.get(OPENAI_KEY_SECRET);
            if (!apiKey) {
              throw new Error("OpenAI API key not found");
            }

            webview.postMessage({
              type: "status",
              value: "Generating response...",
            });

            const openai = new OpenAIWrapper(apiKey);
            const response = await openai.chatCompletion(data.prompt);

            webview.postMessage({
              type: "response",
              value: response,
            });
          } catch (error) {
            webview.postMessage({
              type: "error",
              value: `Error: ${error}`,
            });
          }
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
            body {
              padding: 20px;
              font-family: var(--vscode-font-family);
              color: var(--vscode-foreground);
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            textarea {
              width: 100%;
              height: 200px;
              margin: 10px 0;
              background-color: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border: 1px solid var(--vscode-input-border);
              padding: 10px;
              font-family: var(--vscode-editor-font-family);
              resize: vertical;
            }
            button {
              background-color: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              padding: 8px 16px;
              cursor: pointer;
              margin-bottom: 20px;
            }
            button:hover {
              background-color: var(--vscode-button-hoverBackground);
            }
            #response {
              white-space: pre-wrap;
              background-color: var(--vscode-editor-background);
              padding: 15px;
              border-radius: 4px;
              font-family: var(--vscode-editor-font-family);
              margin-top: 20px;
            }
            .status {
              margin: 10px 0;
              font-style: italic;
              color: var(--vscode-descriptionForeground);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <textarea 
              id="prompt" 
              placeholder="Enter your prompt here..."
              spellcheck="false"
            ></textarea>
            <div>
              <button onclick="testPrompt()">Test Prompt</button>
            </div>
            <div id="status" class="status"></div>
            <div id="response"></div>
          </div>

          <script>
            const vscode = acquireVsCodeApi();
            
            function testPrompt() {
              const prompt = document.getElementById('prompt').value;
              if (!prompt) return;
              
              document.getElementById('status').textContent = 'Sending prompt...';
              document.getElementById('response').textContent = '';
              
              vscode.postMessage({ 
                type: 'testPrompt', 
                prompt 
              });
            }

            window.addEventListener('message', event => {
              const message = event.data;
              
              switch (message.type) {
                case 'status':
                  document.getElementById('status').textContent = message.value;
                  break;
                case 'response':
                  document.getElementById('status').textContent = '';
                  document.getElementById('response').textContent = message.value;
                  break;
                case 'error':
                  document.getElementById('status').textContent = '';
                  document.getElementById('response').textContent = message.value;
                  break;
              }
            });

            // Enable Ctrl+Enter to submit
            document.getElementById('prompt').addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                testPrompt();
              }
            });
          </script>
        </body>
      </html>
    `;
  }
}
