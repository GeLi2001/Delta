import * as path from "path";
import type { Configuration } from "webpack";

const configs: Configuration[] = [
  // Extension Host
  {
    target: "node",
    mode: "production",
    entry: "./src/extension.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "extension.js",
      libraryTarget: "commonjs2",
      clean: true
    },
    devtool: "source-map",
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
    mode: "production",
    entry: "./src/webview-ui/src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "webview.js",
      clean: true
    },
    devtool: "source-map",
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
