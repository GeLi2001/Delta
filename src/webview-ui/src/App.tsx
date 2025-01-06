import React from "react";
import { ChatTest } from "./components/ChatTest";
import { FunctionTest } from "./components/FunctionTest";

export function App() {
  const [mode, setMode] = React.useState<"chat" | "function">("chat");

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-[#2d2d2d] rounded-lg shadow p-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setMode("chat")}
              className={`px-4 py-2 rounded-md ${
                mode === "chat"
                  ? "bg-blue-600 text-white"
                  : "bg-[#3d3d3d] text-gray-300"
              }`}
            >
              Chat Test
            </button>
            <button
              onClick={() => setMode("function")}
              className={`px-4 py-2 rounded-md ${
                mode === "function"
                  ? "bg-blue-600 text-white"
                  : "bg-[#3d3d3d] text-gray-300"
              }`}
            >
              Function Test
            </button>
          </div>

          {mode === "chat" ? <ChatTest /> : <FunctionTest />}
        </div>
      </div>
    </div>
  );
}
