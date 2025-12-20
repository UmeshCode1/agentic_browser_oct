# Technology Stack

The Agentic Browser uses a modern, industry-aligned tech stack focused on scalability, security, and performance.

## 🧠 AI Layer

- **Model:** [Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash)
- **Role:** Reasoning, planning, and decision making.
- **Integration:** Directly called from Appwrite Functions via REST API.

## 🧩 Backend (Appwrite Cloud)

- **Auth:** Secure user management.
- **Database:** NoSQL storage for tasks and logs.
- **Functions:** Node.js serverless functions for orchestration.
- **Realtime:** WebSocket-based live updates to the frontend.
- **Storage:** Storing screenshots of agent progress.

## 🖥 Browser Executor

- **Engine:** [Playwright](https://playwright.dev/) (Headless Chromium)
- **Deployment:** [Render](https://render.com/) (Docker Web Service)
- **Framework:** Express.js for the execution API.

## 🌐 Frontend

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS.
- **SDK:** Appwrite Web SDK for frontend-backend interaction.
- **Deployment:** [Vercel](https://vercel.com/)

## 🛠 Tools & DevOps

- **Version Control:** GitHub.
- **Monorepo Management:** Standardized folder structure.
- **Environment Management:** Multi-platform `.env` handling.
