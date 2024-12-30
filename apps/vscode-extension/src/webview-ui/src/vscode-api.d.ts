export interface WebviewApi<T> {
  postMessage(message: T): void;
  getState(): T;
  setState(state: T): void;
}

declare global {
  interface Window {
    acquireVsCodeApi<T>(): WebviewApi<T>;
  }
}
