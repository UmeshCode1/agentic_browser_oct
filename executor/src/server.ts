import express, { Request, Response } from 'express';
import { chromium, Browser, Page } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.EXECUTOR_API_KEY;

let browser: Browser | null = null;

// Middleware for API Key verification
const authenticate = (req: Request, res: Response, next: Function) => {
    const apiKey = req.headers['x-api-key'];
    if (API_KEY && apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.get('/health', (req, res) => {
    res.json({ status: 'ok', browser: !!browser });
});

app.post('/action', authenticate, async (req, res) => {
    const { action, params } = req.body;

    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        let result: any = null;

        switch (action) {
            case 'navigate':
                await page.goto(params.url, { waitUntil: 'networkidle' });
                result = { url: page.url() };
                break;
            case 'screenshot':
                const buffer = await page.screenshot();
                result = { screenshot: buffer.toString('base64') };
                break;
            case 'scrape':
                const content = await page.content();
                result = { content };
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        const screenshot = await page.screenshot();

        res.json({
            success: true,
            result,
            observation: {
                url: page.url(),
                title: await page.title(),
                screenshot: screenshot.toString('base64')
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    } finally {
        await context.close();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Executor listening on port ${PORT}`);
});
