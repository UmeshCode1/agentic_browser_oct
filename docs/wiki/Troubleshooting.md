# Troubleshooting 🐛

## Common Issues

### 1. "Executor Refused: 500 Unauthorized"

**Cause**: The `EXECUTOR_API_KEY` in your backend (Appwrite Function variables) does not match the one in your Railway Service variables.
**Fix**: Ensure both environments have the exact same string for `EXECUTOR_API_KEY`.

### 2. "Thinking..." Indefinitely

**Cause 1**: The Railway Executor crashed or is sleeping.
**Fix**: Check Railway logs. If it's a sleep issue, upgrade to a paid plan or keep it warm.
**Cause 2**: Gemini API Quota Exceeded.
**Fix**: Check your Google Cloud Console for quota limits.

### 3. "Appwrite Init Failed" (Frontend)

**Cause**: Incorrect Project ID or Endpoint in `frontend/.env.local`.
**Fix**: Verify your `.env.local` matches your Appwrite project settings.

### 4. Browser Crashes on Complex Sites

**Cause**: Some sites detect headless browsers and block them.
**Fix**: We use `puppeteer-core` tactics to mask the bot. However, extremely defensive sites (like Cloudflare Turnstile) may still block it. This is a known limitation of autonomous agents.

## Getting Help

- Open an Issue on [GitHub](https://github.com/UmeshCode1/agentic_browser_oct/issues).
- Check the [Railway Logs](https://railway.com) for server-side errors.
