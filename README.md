# Delta

Delta is a monorepo containing AI-powered development tools, including a VSCode extension for code review and testing.

## Project Structure

delta/
├── apps/
│ └── vscode-extension/ # VSCode extension for code review
├── packages/
│ ├── ts/
│ │ └── core/ # Shared TypeScript library
│ └── python/
│ └── core/ # Python utilities
├── pnpm-workspace.yaml
└── README.md

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+
- Python 3.8+ (for Python packages)

### Installation

# Install dependencies

pnpm install

# Build all packages

pnpm -r build

## Packages

### VSCode Extension

- Location: `apps/vscode-extension`
- Features:
  - AI-powered code review
  - Real-time analysis
  - Security scanning
  - Best practices suggestions

### Core Libraries

- TypeScript: `packages/ts/core`
- Python: `packages/python/core`

## Development

# Install dependencies

pnpm install

# Run tests

pnpm -r test

# Lint

pnpm -r lint

## Contributing

Please read [CONTRIBUTING.md](apps/vscode-extension/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](apps/vscode-extension/LICENSE) file for details.
