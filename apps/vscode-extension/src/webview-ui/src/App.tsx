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
        setStatus(message.value + "!!!");
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
    <div className="container">
      <textarea
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
      <div className="controls">
        <div className="temperature-control">
          <label htmlFor="temperature">Temperature:</label>
          <input
            type="number"
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>
        <button onClick={handleTestPrompt}>Test Prompt</button>
      </div>
      {status && <div className="status">{status}</div>}
      {response && <div className="response">{response}</div>}
    </div>
  );
}
