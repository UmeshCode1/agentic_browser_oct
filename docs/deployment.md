# Deployment & Security Guide

## 🔐 Security Best Practices

1. **Environment Variables:** Never commit sensitive keys (Gemini API, Executor API Key) to Git. Use the provided `.env.example` as a template and set the actual values in your deployment platform settings (Vercel/Render/Appwrite).
2. **API Keys:** The Playwright Executor is protected by an `X-API-KEY` header. Ensure the same key is set in both Render (`envVars`) and Appwrite Functions (`vars`).
3. **Appwrite Scopes:** The API key created in Appwrite should have restricted scopes. Only grant permissions for `documents.write`, `executions.write`, and `files.write`.

## 🚀 Auto-Deployment Setup

### Vercel (Frontend)

- **Root Directory:** Set to `frontend`.
- **Framework Preset:** Next.js.
- **Environment Variables:**
  - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
  - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- **Link Repository:** Vercel will auto-deploy on every push to `main`.

### Render (Executor)

- **Automatic:** Render uses the `render.yaml` blueprint to set up the service.
- **Root Directory:** Set to `executor`.
- **Deployment:** Render will auto-rebuild the Docker image on every push to `main`.

### Appwrite Cloud (Backend Functions)

- **Manual Trigger:** Use the Appwrite CLI:

  ```bash
  cd backend
  appwrite login
  appwrite deploy function
  ```

- **Updates:** Once deployed, functions can be triggered via Appwrite's event system or direct API calls from the frontend.
