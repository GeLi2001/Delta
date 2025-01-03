import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('webpack').Configuration} */
const config = {
  target: "web",
  mode: "development", // This will be overridden by --mode flag in scripts
  entry: path.resolve(__dirname, "src", "index.tsx"),  // Fix the entry path
  output: {
    path: path.resolve(__dirname, "..", "..", "dist", "webview"),
    filename: "webview.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};

export default config;