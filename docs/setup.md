# Setup Guide

Follow these steps to set up the Agentic Browser project for local development and deployment.

## 1. Appwrite Backend Setup

1. **Create a Project:** Go to [Appwrite Cloud](https://cloud.appwrite.io) and create a new project.
2. **Project ID:** Note down your Project ID and Endpoint. Update `.env.example`.
3. **Database:** Create a database named `AgenticBrowser`.
4. **Collections:** Create the following collections:
   - `tasks`
   - `steps`
   - `logs`
5. **Attributes:**
   - **tasks:** `goal` (string), `status` (string), `userId` (string).
   - **steps:** `taskId` (string), `reasoning` (string, long), `action` (string), `result` (string, long), `screenshotId` (string).
   - **logs:** `taskId` (string), `message` (string), `type` (string).
6. **API Key:** Create an API Key with full scopes for Database and Functions.

## 2. Executor Setup (Render)

1. **Repo:** Push the `executor/` directory (or the whole monorepo) to GitHub.
2. **Service:** Create a new **Web Service** on Render.
3. **Dockerfile:** Render will automatically detect the Dockerfile in `/executor`.
4. **Env Vars:** Set `EXECUTOR_API_KEY` (shared secret with Appwrite Function).

## 3. Frontend Setup (Vercel)

1. **Import:** Connect your GitHub repo to Vercel.
2. **Framework:** Select Next.js.
3. **Root Directory:** Set to `frontend`.
4. **Env Vars:**
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `GEMINI_API_KEY` (Wait, this should be in Appwrite Function for security)

## 4. Appwrite Functions

1. **Deploy:** Use the Appwrite CLI or Console to deploy the functions from `backend/functions`.
2. **Config:** Add `GEMINI_API_KEY` and `EXECUTOR_URL` as function variables.
