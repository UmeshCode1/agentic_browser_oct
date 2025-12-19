# Agentic Browser (agentic-browser-oct)

An AI-powered autonomous web interaction system that can browse websites, extract information, and take actions using a reasoning loop.

## 🚀 Overview

The **Agentic Browser** is a production-grade AI agent system designed to handle complex web-defined goals. Unlike traditional scrapers, this system reasons through steps, observes page contents, and decides on next actions autonomously.

### Key Features

- **Autonomous Reasoning:** Plan -> Act -> Observe -> Decide loop powered by Gemini API.
- **Real-time Monitoring:** Watch the agent's steps and logs as they happen.
- **Headless Browser Execution:** Powered by Playwright on a dedicated service.
- **Secure Orchestration:** Appwrite Functions manage logic and API security.

## 🏗 System Architecture

The project follows a monorepo structure:

- **`/frontend`**: Next.js application (Deployed on Vercel).
- **`/backend`**: Appwrite Functions and configuration.
- **`/executor`**: Playwright service (Deployed on Render).
- **`/docs`**: Project documentation and GitHub Wiki source.

## 🛠 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Appwrite Realtime.
- **Backend:** Appwrite Cloud (Auth, DB, Functions, Storage).
- **AI:** Gemini API (Planning & Reasoning).
- **Browser:** Playwright (Headless Chromium).
- **Deployment:** Vercel (Frontend), Appwrite Cloud (Backend), Render (Executor).

## 🚦 Getting Started

### Prerequisites

- Node.js & npm
- Appwrite Cloud Account
- Gemini API Key
- Render Account (for Executor)

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/UmeshCode1/agentic_browser_oct.git
   cd agentic_browser_oct
   ```

2. **Setup Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Executor:**

   ```bash
   cd executor
   # Instructions in executor/README.md
   ```

## 📘 Documentation

Detailed documentation is available in the [GitHub Wiki](https://github.com/UmeshCode1/agentic_browser_oct/wiki).

- [Architecture Details](./docs/architecture.md)
- [Agent Workflow](./docs/agent-flow.md)
- [Setup Guide](./docs/setup.md)
- [Deployment & Security](./docs/deployment.md)

## 📄 License

MIT
