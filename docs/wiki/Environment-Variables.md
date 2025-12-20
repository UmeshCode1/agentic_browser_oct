# Environment Variables

Security is a priority. Hardcoding secrets is avoided by using platform-specific environment variables.

## 🗝 Required Variables

### Frontend (Vercel)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite Cloud URL | `https://fra.cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Project ID | `6945d...` |

### Backend (Appwrite Functions)

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google AI Studio API Key |
| `EXECUTOR_URL` | The URL of your Render service |
| `EXECUTOR_API_KEY` | Shared secret with the Playwright service |

### Executor (Render)

| Variable | Description |
| :--- | :--- |
| `EXECUTOR_API_KEY` | Must match the one in Appwrite Functions |
| `PORT` | Listening port (Default: 3001) |

---

## 📝 Setup from `.env.example`

A template is provided in the root directory. Rename it to `.env` during local development (note: `.env` is git-ignored).

```bash
cp .env.example .env
```
