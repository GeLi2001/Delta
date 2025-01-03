import type { WebviewApi } from "./vscode-api";
type MessageType = {
    type: string;
    value?: string | number | boolean | object;
};
declare const vscode: WebviewApi<MessageType>;
export default vscode;
