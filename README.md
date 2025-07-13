# AI Enter as Newline

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/InvictusNavarchus/ai-enter-as-newline)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A simple userscript that enables the Enter key for newlines in AI chat interfaces. Use **Ctrl+Enter** (or **Cmd+Enter** on Mac) to send messages instead.

## ✨ Features

- 🔄 **Toggle functionality** - Easy on/off switch with visual indicator
- 🌍 **Multi-language support** - English, Traditional Chinese, Simplified Chinese
- 🎯 **Smart detection** - Automatically detects AI chat interfaces
- ⚡ **Lightweight** - Zero dependencies, pure TypeScript
- 🎨 **Dark mode aware** - UI adapts to system theme
- 🔧 **Configurable** - Persistent settings saved automatically

## 🌐 Supported Sites

- [ChatGPT](https://chatgpt.com/) (OpenAI)
- [Claude](https://claude.ai/) (Anthropic)
- [Gemini](https://gemini.google.com/) (Google)
- [Perplexity](https://www.perplexity.ai/)
- [Felo](https://felo.ai/)
- [DeepSeek](https://chat.deepseek.com/)
- [Grok](https://grok.com/) (X AI)
- [DuckDuckGo AI](https://duckduckgo.com/)

## 🚀 Installation

### Prerequisites
- A userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Greasemonkey](https://www.greasespot.net/)

### Install from GitHub
1. Click [here to install](https://github.com/InvictusNavarchus/ai-enter-as-newline/raw/master/ai-enter-as-newline.user.js)
2. Your userscript manager will prompt you to install
3. Click "Install" to confirm

### Manual Installation
1. Copy the contents of [`ai-enter-as-newline.user.js`](./ai-enter-as-newline.user.js)
2. Create a new userscript in your manager
3. Paste the code and save

## 📖 Usage

### Basic Operation
- **Enter**: Creates a new line in the chat input
- **Ctrl+Enter** (Windows/Linux) or **Cmd+Enter** (Mac): Sends the message

### Toggle Control
- Look for the **⏎** button in the top-right corner of supported pages
- Click to toggle between newline mode and normal mode
- Green = Newline mode ON
- Gray = Newline mode OFF (default behavior)

### Visual Indicators
- **Green button**: Newline mode active - "Ctrl+Enter to send"
- **Gray button**: Normal mode - "Enter to send"

## 🛠️ Development

### Prerequisites
- [Node.js](https://nodejs.org/) 
- [pnpm](https://pnpm.io/) package manager

### Setup
```bash
# Clone the repository
git clone https://github.com/InvictusNavarchus/ai-enter-as-newline.git
cd ai-enter-as-newline

# Install dependencies
pnpm install

# Build the userscript
pnpm run build
```

### Project Structure
```
├── ai-enter-as-newline.user.ts   # TypeScript source
├── ai-enter-as-newline.user.js   # Compiled JavaScript
├── package.json                  # Project configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

### Building
The project uses TypeScript for development and compiles to JavaScript:

```bash
pnpm run build
```

This generates the `ai-enter-as-newline.user.js` file from the TypeScript source.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Ensure the script still works on all supported sites

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This script is a fork of "AI Enter as Newline" by [windofage](https://greasyfork.org/en/scripts/531913-ai-enter-as-newline) (MIT License).
