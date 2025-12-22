# Developer Manual 🛠️

So you want to hack on the Agentic Browser? Welcome to the **Eko Framework**.

## The Stack

- **Frontend**: Next.js 14, Tailwind, Framer Motion.
- **Backend**: Node.js (Appwrite Functions).
- **Executor**: Node.js, Express, Playwright.

## 🏗️ Architecture: The "Eko" Loop

The core logic lives in `executor/src/core/EkoEngine.ts`.

1. **Plan**: `PlannerAgent.ts` calls Gemini 2.0. It returns a JSON object with `steps`.
2. **Execute**: `EkoEngine.ts` iterates over `steps`.
3. **Act**: `BrowserAgent.ts` calls `PlaywrightTool.ts` to actually click/type.
4. **Log**: Each step result is pushed to Appwrite via `onStep` callback.

## Extending the System

### Adding a New Tool

1. Modify `executor/src/tools/PlaywrightTool.ts`.

    ```typescript
    async scrollDown() {
       await this.page.evaluate(() => window.scrollBy(0, 500));
    }
    ```

2. Expose it in `BrowserAgent.ts`.

    ```typescript
    case 'scrolldown': return this.tool.scrollDown();
    ```

3. Teach the Planner (`PlannerAgent.ts`).
    - Update the prompt in `createPlan()` to include `scrolldown()` in the "Available Actions" list.

### Debugging

- **Executor Logs**: Use `railway logs` to see the raw output from the Node.js service.
- **Frontend Logs**: Access the Chrome DevTools console to see Appwrite Realtime events coming in.
