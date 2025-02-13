# Hypernotic

A modern, desktop-based Markdown note-taking application built with React, TypeScript, and Tauri. Hypernotic provides a clean, efficient environment for managing and editing markdown documents with a focus on simplicity and productivity.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Tauri](https://img.shields.io/badge/Tauri-2.x-FFC131)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/) (v1.77 or higher)
- Platform-specific dependencies for Tauri:
  - **macOS**: Xcode Command Line Tools

## Development

1. Clone the repository:

```bash
git clone https://github.com/clogginsdev/hypernotic.git
cd hypernotic
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm tauri dev
```

This will launch both the Vite development server and the Tauri development window.

## Building

To create a production build:

```bash
pnpm tauribuild
```

The built application will be available in the `src-tauri/target/release` directory.

## Features

- 📝 Markdown editing and preview
- Clean and simple UI for a distraction-free writing experience
- 🗂️ Local file system integration
- ⌨️ Extensive keyboard shortcuts
- 📁 Directory browser

## Keyboard Shortcuts

| Action            | Shortcut             |
| ----------------- | -------------------- |
| New File          | Cmd/Ctrl + N         |
| Open File         | Cmd/Ctrl + O         |
| Open Folder       | Cmd/Ctrl + K         |
| Save File         | Cmd/Ctrl + S         |
| Directory Browser | Ctrl + Space         |
| Show Shortcuts    | Cmd/Ctrl + Shift + K |

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License - see the [LICENSE](src-tauri/LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
