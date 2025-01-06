/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import vscode from "./vscode";

export function App() {
  const [prompt, setPrompt] = React.useState("");
  const [temperature, setTemperature] = React.useState(0.3);
  const [status, setStatus] = React.useState("");
  const [response, setResponse] = React.useState("");

  const handleTestPrompt = () => {
    if (!prompt) return;
    setStatus("Sending prompt...");
    setResponse("");

    vscode.postMessage({
      type: "testPrompt",
      value: {
        prompt,
        temperature
      }
    });
  };

  // Handle messages from extension
  window.addEventListener("message", (event) => {
    const message = event.data;
    console.log("message", message);
    switch (message.type) {
      case "status":
        setStatus(message.value);
        break;
      case "response":
        setStatus("");
        setResponse(message.value);
        break;
      case "error":
        setStatus("");
        setResponse(message.value);
        break;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleTestPrompt();
              }
            }}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="temperature"
                className="text-sm font-medium text-gray-700"
              >
                Temperature:
              </label>
              <input
                type="number"
                id="temperature"
                className="w-20 p-1 border border-gray-300 rounded-md"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>

            <button
              onClick={handleTestPrompt}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Test Prompt
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p className="text-yellow-700">{status}</p>
          </div>
        )}

        {response && (
          <div className="bg-white rounded-lg shadow p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
