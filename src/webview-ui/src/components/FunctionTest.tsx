import React from "react";
import vscode from "../vscode";
import { ResponseDisplay } from "./ResponseDisplay";
import { TemperatureControl } from "./TemperatureControl";

export function FunctionTest() {
  const [prompt, setPrompt] = React.useState("");
  const [temperature, setTemperature] = React.useState(0.3);
  const [status, setStatus] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [functionName, setFunctionName] = React.useState("");
  const [parameters, setParameters] = React.useState("");

  const handleTestFunction = () => {
    if (!prompt) return;
    setStatus("Sending prompt...");
    setResponse("");

    vscode.postMessage({
      type: "testFunction",
      value: {
        prompt,
        temperature,
        functionName,
        parameters: parameters ? JSON.parse(parameters) : {}
      }
    });
  };

  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
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
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  return (
    <div className="bg-[#2d2d2d] rounded-lg shadow p-4">
      <textarea
        className="w-full h-32 p-2 border border-gray-600 rounded-md focus:ring-2 focus:border-transparent resize-none bg-[#1e1e1e] text-gray-200"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your function prompt here..."
        spellCheck={false}
      />

      <div className="mt-4 space-y-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-600 rounded-md bg-[#1e1e1e] text-gray-200"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          placeholder="Function name"
        />
        <textarea
          className="w-full h-24 p-2 border border-gray-600 rounded-md bg-[#1e1e1e] text-gray-200 resize-none"
          value={parameters}
          onChange={(e) => setParameters(e.target.value)}
          placeholder="Function parameters (JSON format)"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <TemperatureControl
          temperature={temperature}
          setTemperature={setTemperature}
        />

        <button
          onClick={handleTestFunction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Test Function
        </button>
      </div>

      <ResponseDisplay status={status} response={response} />
    </div>
  );
}
