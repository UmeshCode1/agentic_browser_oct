# Project Architecture

The Agentic Browser system is designed as a modular, decoupled monorepo.

## 🏗 High-Level Diagram

```mermaid
graph TD
    User((User)) -->|Goal| Frontend[Next.js Dashboard]
    Frontend -->|Realtime Logs| User
    
    subgraph Appwrite_Cloud
        Frontend -->|Trigger| AF_Start[startAgent Function]
        AF_Start -->|Log| DB[(Appwrite Database)]
        DB -->|Realtime| Frontend
        
        AF_Orch[agentOrchestrator Function] -->|Read/Write| DB
        AF_Orch -->|Prompt| AI[Gemini 2.0 Flash API]
        AI -->|Decision| AF_Orch
    end
    
    subgraph External_Service
        AF_Orch -->|Action| Executor[Render: Playwright Service]
        Executor -->|Observation| AF_Orch
    end
```

## 🛠 Component Roles

### 1. Frontend (Next.js)

- **Dashboard:** Interface for triggering tasks.
- **Realtime Monitor:** Uses Appwrite Realtime to stream logs and browser steps.
- **Security:** Does not handle AI keys; all sensitive logic is backend-restricted.

### 2. Backend Orchestrator (Appwrite Functions)

- **State Management:** Tracks tasks and individual steps in the database.
- **Intelligence:** Communicates with Gemini API to decide the next move.
- **Coordination:** Acts as the bridge between the AI's intent and the Browser's execution.

### 3. Browser Executor (Playwright)

- **Chrome Instance:** Runs a headless browser in a Docker container on Render.
- **Remote Execution:** Exposes a secure API to perform clicks, typing, and navigation.
- **Sensing:** Returns screenshots and DOM data (observations) to the AI.

### 4. Database (Appwrite)

- **Collections:** `tasks`, `steps`, `logs`, `snapshots`.
- **Persistence:** Allows for asynchronous execution and history review.
