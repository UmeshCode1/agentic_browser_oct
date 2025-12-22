# Agentic Browser (Eko Framework)

> **The World's First Autonomous "Intent-to-Action" Browser.**  
> *Powered by Eko Framework, Gemini 2.0, and Appwrite.*

![Agentic Browser UI](https://raw.githubusercontent.com/UmeshCode1/agentic_browser_oct/main/images/hero_banner.png)

## 🚀 Overview

**Agentic Browser** is not just a tool; it's an intelligent agent that browses the web for you. Built on the robust **Eko Framework**, it decomposes natural language goals into executable plans, performs complex web interactions, and streams its "thought process" back to you in real-time.

Whether it's "Find the cheapest flight to Tokyo" or "Summarize the top 3 tech news stories," the Agentic Browser plans, reasons, and executes.

## ✨ Features

- **🧠 Eko Brain**: Powered by Google Gemini 2.0 Flash for high-speed reasoning and planning.
- **🌐 Autonomous Navigation**: Handles complex DOM interactions, clicks, typing, and dynamic waiting using Playwright.
- **⚡ Real-Time Neural Stream**: Watch the agent "think" and "act" live via Appwrite Realtime.
- **🛡️ Enterprise Security**: Zero-Trust architecture. Your API keys never leave the secure Executor vault.
- **🎨 Deep Void UX**: A premium, "Fellou-inspired" aesthetic designed for focus and clarity.

## 🏗️ Architecture

The system follows the **Eko Framework** distributed architecture:

1. **Experience Layer (Frontend)**: Next.js + TailwindCSS.
2. **Orchestration Layer (Backend)**: Appwrite Cloud Functions.
3. **Execution Layer (The Brain)**: Persistent Node.js/Express service on Railway.

👉 **[View Detailed Architecture & Mindmap](docs/ARCHITECTURE.md)**

## 🛠️ Quickstart

### Prerequisites

- Node.js 18+
- Appwrite Cloud Account
- Railway Account (for Executor)
- Google Gemini API Key

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/UmeshCode1/agentic_browser_oct.git
    cd agentic_browser_oct
    ```

2. **Setup Environment**
    Copy `.env.example` to `.env.local` and fill in your Appwrite credentials.

3. **Deploy Executor**
    Deploy the `/executor` directory to Railway.
    **Critical**: Set `GEMINI_API_KEY` in Railway Variables.

4. **Run Frontend**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📚 Documentation

- [**Architecture Deep Dive**](docs/ARCHITECTURE.md)
- [**Security Policy**](docs/SECURITY.md)
- [**Contributing Guide**](docs/CONTRIBUTING.md)

## 👨‍💻 Credits

Designed & Engineered by **Umesh Patel**.

---
*Built with ❤️ using the Eko Framework.*
