# 🧠 Agentic Browser (agentic-browser-oct)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-d0225d)](https://appwrite.io/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.0-blue)](https://deepmind.google/technologies/gemini/)
[![Playwright](https://img.shields.io/badge/Browser-Playwright-45ba4b)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"The World's Best AI-Powered Autonomous Web Agent"**

**Agentic Browser** is a production-grade, autonomous web interaction system. It doesn't just scrape; it *thinks*, *observes*, and *acts*. Powered by Google's Gemini 2.0 Flash and a dedicated Playwright executor, it can navigate complex web workflows, fill forms, and extract data with reasoning capabilities.

---

## ✨ Key Features

- **🤖 Autonomous Reasoning Engine**: Implements a sophisticated **Plan-Act-Observe-Decide** loop.
- **👀 Real-Time Observation**: Watch the agent's thought process and actions live on the dashboard.
- **☁️ Headless Cloud Execution**: Scalable browser sessions powered by a deployed Executor service.
- **🔒 Secure & Scalable**: Fully integrated with Appwrite for Authentication, Database, and Serverless Functions.
- **🚀 Modern Tech Stack**: Built with Next.js 14, Tailwind CSS, and Node.js.

---

## 🏗 System Architecture

The project is structured as a modern monorepo:

| Directory | Service | Description |
| :--- | :--- | :--- |
| **`/frontend`** | **Control Center** | Next.js Dashboard for users to issue commands and watch agent logs. |
| **`/backend`** | **Brain & Logic** | Appwrite Functions (`Agent Orchestrator`) that handle the AI reasoning loop. |
| **`/executor`** | **Hands & Eyes** | Express.js + Playwright service that physically interacts with web pages. |

---

## 🚀 Getting Started

Follow these steps to deploy your own instance of Agentic Browser.

### Prerequisites

- **Node.js** (v18+)
- **Appwrite Cloud** Account
- **Google Gemini API** Key

### 1. Installation

```bash
git clone https://github.com/UmeshCode1/agentic_browser_oct.git
cd agentic_browser_oct
```

### 2. Environment Setup

Create a `.env.local` file in the root directory. This is your single source of truth for secrets.

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

## ☁️ Deployment

### 1. Backend (Appwrite)

- Deployed via Appwrite Functions (Already Configured in `backend/`).
- **Required Env Vars**: `GEMINI_API_KEY`, `EXECUTOR_URL`, `EXECUTOR_API_KEY`.

### 2. Executor (Render)

- **Automatic**: Connect your GitHub repo to Render and choose "Blueprints". It will pick up our `render.yaml`.
- **Manual**: Create a "Web Service".
  - **Runtime**: Docker
  - **Root Directory**: `executor`
  - **Env Var**: `EXECUTOR_API_KEY` (Set a strong secret).

### 3. Frontend (Vercel)

- Import the repo to Vercel.
- **Root Directory**: `frontend`.
- **Framework**: Next.js.
- **Env Vars**:
  - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: `https://cloud.appwrite.io/v1`
  - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: *(from your Appwrite settings)*`

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the Agentic Browser Dashboard.

---

## 📘 Documentation

We believe in world-class documentation. Check out our detailed guides:

- [**Architecture Deep Dive**](./docs/architecture.md) - Understand how the PAOD loop works.
- [**Agent Workflow**](./docs/agent-flow.md) - See the logic behind the AI's decisions.
- [**Deployment Guide**](./docs/deployment.md) - Deploy to Vercel and Render.

---

## 🛡 Security

This project takes security seriously:

- **Zero Hardcoded Secrets**: All keys are managed via Environment Variables.
- **Sanitized Logging**: Sensitive data is scrubbed before storage.
- **Secure Functions**: Appwrite Functions run in isolated environments.

---

## 📄 License

This project is open-sourced under the MIT License.
