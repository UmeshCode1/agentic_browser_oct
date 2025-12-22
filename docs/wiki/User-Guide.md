# User Guide 🚀

## Installation

### Prerequisites

- Node.js 18+
- Docker (Optional, for easy Executor deployment)
- Accounts: Railway, Appwrite, Google Cloud (Vertex AI / Gemini API)

### 1. Clone & Install

```bash
git clone https://github.com/UmeshCode1/agentic_browser_oct.git
cd agentic_browser_oct
# Install Frontend
cd frontend && npm install
# Install Executor
cd ../executor && npm install
```

## Configuration

You need to configure **Appwrite** and **Railway**.

### Appwrite (Backend)

1. Create a new Project.
2. Create a Database `agentic_browser` with collections: `steps`, `logs`.
3. Deploy the `agent-orchestrator` function.

### Railway (Executor)

1. Deploy the `/executor` folder.
2. **CRITICAL**: Add the following Environment Variables in Railway:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `EXECUTOR_API_KEY`: A secret key you generate (must match Appwrite).
   - `APPWRITE_ENDPOINT`: Your Appwrite API Endpoint.
   - `APPWRITE_PROJECT_ID`: Your Appwrite Project ID.
   - `APPWRITE_API_KEY`: An Appwrite API Key with `documents.write` permission.

## Running Capabilities

### Text-to-Action

On the Dashboard, type:
> "Go to google.com, search for 'latest AI news', and list the top 3 headlines."

### The "Neural Stream"

- **Thinking**: The purple bubble shows the agent planning.
- **Action**: The cards show the agent clicking/typing.
- **Result**: The final output appears in the chat.

## Tips

- Be specific. "Find flights" is vague. "Find flights from NYC to LHR on May 1st under $600" is better.
- The agent works best on static or standard web pages. Highly complex SPAs might require more "wait" steps (which the agent usually figures out).
