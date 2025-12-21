
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client, Databases } from 'node-appwrite';
import { EkoEngine } from './core/EkoEngine';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.EXECUTOR_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Appwrite Configuration
const client = new Client();
if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY) {
    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
    // Disable SSL verification for development/testing if needed (remove in prod if possible)
    // client.setSelfSigned(true); 
}

const databases = new Databases(client);

// Middleware
const authenticate = (req: Request, res: Response, next: Function) => {
    const apiKey = req.headers['x-api-key'];
    if (API_KEY && apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.get('/health', (req, res) => {
    res.json({ status: 'ok', engine: 'Eko Framework v2.1' });
});

app.post('/execute', authenticate, async (req, res) => {
    const { goal, taskId } = req.body;

    if (!goal) return res.status(400).json({ error: 'Goal is required' });
    if (!GEMINI_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY missing' });

    // Define Logger
    const logStep = async (step: any) => {
        if (!taskId || !process.env.APPWRITE_ENDPOINT) return;
        try {
            await databases.createDocument('agentic_browser', 'steps', 'unique()', {
                taskId,
                reasoning: step.reasoning || "Executing Logic...",
                action: step.action || "PROCESSING",
                params: JSON.stringify(step.params || {}),
                result: step.result || "Pending",
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("[Eko] Failed to log step to Appwrite:", e);
        }
    };

    // Initialize Engine
    const engine = new EkoEngine({
        geminiApiKey: GEMINI_KEY,
        headless: true,
        onStep: logStep
    });

    try {
        const result = await engine.start(goal, taskId);

        // Log final completion
        if (taskId && process.env.APPWRITE_ENDPOINT) {
            await databases.createDocument('agentic_browser', 'logs', 'unique()', {
                taskId,
                message: `Task Completed: ${result.output}`,
                type: 'success',
                createdAt: new Date().toISOString()
            }).catch(e => console.error("Failed to log completion", e));
        }

        res.json(result);
    } catch (error: any) {
        console.error("Execution Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Eko Executor listening on port ${PORT}`);
});
