import * as path from "path";
import type { Configuration } from "webpack";

const configs: Configuration[] = [
  // Extension Host
  {
    target: "node",
    mode: "development",
    entry: "./src/extension.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "extension.js",
      libraryTarget: "commonjs2"
    },
    externals: {
      vscode: "commonjs vscode"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ["ts-loader"]
        }
      ]
    }
  },
  // Webview
  {
    target: "web",
    mode: "development",
    entry: "./src/webview-ui/src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist/webview"),
      filename: "webview.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  }
];

export default configs;
