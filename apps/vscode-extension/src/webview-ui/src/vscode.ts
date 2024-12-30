import type { WebviewApi } from "./vscode-api";

type MessageType = {
  type: string;
  value?: string | number | boolean | object;
};

const vscode: WebviewApi<MessageType> = window.acquireVsCodeApi<MessageType>();

export default vscode;
