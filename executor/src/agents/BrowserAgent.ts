
import { PlaywrightTool } from "../tools/PlaywrightTool";

export interface ActionResult {
    success: boolean;
    summary: string;
    data?: any;
    error?: string;
}

export class BrowserAgent {
    private tool: PlaywrightTool;

    constructor(config: { headless: boolean }) {
        this.tool = new PlaywrightTool(config.headless);
    }

    async launch() {
        await this.tool.launch();
    }

    async close() {
        await this.tool.close();
    }

    async executeAction(action: string, params: any): Promise<ActionResult> {
        // Map simple action names to tool methods
        switch (action.toLowerCase()) {
            case 'goto':
                const goRes = await this.tool.goto(params);
                return {
                    success: goRes.success,
                    summary: goRes.success ? `Navigated to ${params}` : "Failed Navigation",
                    error: goRes.error
                };

            case 'click':
                const clickRes = await this.tool.click(params);
                return {
                    success: clickRes.success,
                    summary: clickRes.success ? `Clicked ${params}` : "Failed Click",
                    error: clickRes.error
                };

            case 'type':
                // Params might be string (selector) or object {selector, text} depending on planner
                // Assuming planner sends object for type? Or simple arguments?
                // Inspecting PlannerAgent prompt: type(selector, text)
                // So params likely needs to handle this. 
                // Let's assume params is treated as an array of args or an object by Planner?
                // JSON: "params": ["#search", "query"] or {selector:..., text:...}
                // Let's assume object for safety in Planner prompt update or robust handling.
                // For now, let's look at Planner prompt: "type(selector, text)".
                // Ideally Planner output: "params": { "selector": "#id", "text": "hello" }

                // Let's handle generic object
                const selector = typeof params === 'object' ? params.selector : params;
                const text = typeof params === 'object' ? params.text : '';

                if (!text) return { success: false, summary: "Missing text for type action", error: "No text provided" };

                const typeRes = await this.tool.type(selector, text);
                return {
                    success: typeRes.success,
                    summary: typeRes.success ? `Typed "${text}" into ${selector}` : "Failed Type",
                    error: typeRes.error
                };

            case 'extract':
                const extRes = await this.tool.extract();
                return {
                    success: extRes.success,
                    summary: extRes.success ? "Extracted page content" : "Failed Extract",
                    data: extRes.success ? extRes.content : undefined,
                    error: !extRes.success ? extRes.error : undefined
                };

            case 'wait':
                const ms = typeof params === 'number' ? params : 1000;
                await new Promise(r => setTimeout(r, ms));
                return { success: true, summary: `Waited ${ms}ms` };

            default:
                return { success: false, summary: "Unknown Action", error: `Action ${action} not supported` };
        }
    }
}
