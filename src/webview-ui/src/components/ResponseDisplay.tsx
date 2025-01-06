import React from "react";

interface Props {
  status: string;
  response: string;
}

export function ResponseDisplay({ status, response }: Props) {
  return (
    <>
      {status && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-yellow-700">{status}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 bg-[#2d2d2d] rounded-lg shadow p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-200">
            {response}
          </pre>
        </div>
      )}
    </>
  );
}
