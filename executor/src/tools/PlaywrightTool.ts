
import { chromium, Browser, Page } from 'playwright';

export class PlaywrightTool {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private headless: boolean;

    constructor(headless: boolean = true) {
        this.headless = headless;
    }

    async launch() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: this.headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const context = await this.browser.newContext({
                viewport: { width: 1280, height: 800 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            });
            this.page = await context.newPage();
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }

    async goto(url: string) {
        if (!this.page) throw new Error("Browser not launched");
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            // Wait for basic hydration
            await this.page.waitForTimeout(2000);
            return { success: true, title: await this.page.title() };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }

    async click(selector: string) {
        if (!this.page) throw new Error("Browser not launched");
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            await this.page.click(selector);
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }

    async type(selector: string, text: string) {
        if (!this.page) throw new Error("Browser not launched");
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            await this.page.fill(selector, text);
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }

    async extract(): Promise<{ success: boolean; content?: string; error?: string }> {
        if (!this.page) throw new Error("Browser not launched");
        try {
            // Simple extraction of body text
            const content = await this.page.evaluate(() => document.body.innerText);
            return { success: true, content: content.slice(0, 5000) };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }

    async screenshot() {
        if (!this.page) throw new Error("Browser not launched");
        const buffer = await this.page.screenshot();
        return buffer.toString('base64');
    }
}
