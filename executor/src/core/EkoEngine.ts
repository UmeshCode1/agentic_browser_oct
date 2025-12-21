
import { PlannerAgent } from "../agents/PlannerAgent";
import { BrowserAgent } from "../agents/BrowserAgent";

export interface EkoEngineOptions {
    geminiApiKey: string;
    headless?: boolean;
    onStep?: (step: any) => Promise<void>;
}

export interface EkoResult {
    success: boolean;
    logs: string[];
    output?: any;
    taskId?: string;
}

export class EkoEngine {
    private planner: PlannerAgent;
    private browser: BrowserAgent;
    private logs: string[] = [];
    private options: EkoEngineOptions;

    constructor(options: EkoEngineOptions) {
        this.options = options;
        this.planner = new PlannerAgent(options.geminiApiKey);
        this.browser = new BrowserAgent({ headless: options.headless ?? true });
    }

    private log(msg: string) {
        const timestamp = new Date().toISOString();
        const entry = `[EkoEngine] ${timestamp}: ${msg}`;
        console.log(entry);
        this.logs.push(entry);
    }

    async start(goal: string, taskId?: string): Promise<EkoResult> {
        this.log(`Starting mission: ${goal}`);

        try {
            // 1. Plan
            this.log("Initializing Planner Agent...");
            const plan = await this.planner.createPlan(goal);
            this.log(`Plan created with ${plan.steps.length} steps.`);

            // Notify initial plan
            if (this.options.onStep) {
                await this.options.onStep({
                    taskId,
                    reasoning: "Mission Initialized",
                    action: "PLAN",
                    result: `Created ${plan.steps.length} step plan`,
                    createdAt: new Date().toISOString()
                });
            }

            // 2. Initialize Browser
            await this.browser.launch();
            this.log("Browser Agent launched.");

            // 3. Execute Loop
            for (const step of plan.steps) {
                this.log(`Executing Step ${step.id}: ${step.instruction}`);

                // Notify Start of Step
                if (this.options.onStep) {
                    await this.options.onStep({
                        taskId,
                        reasoning: `Executing: ${step.instruction}`,
                        action: step.action.toUpperCase(),
                        params: step.params,
                        result: "Processing...",
                        createdAt: new Date().toISOString()
                    });
                }

                try {
                    const result = await this.browser.executeAction(step.action, step.params);
                    this.log(`Step ${step.id} Result: ${result.summary}`);

                    if (!result.success) {
                        throw new Error(`Step ${step.id} failed: ${result.error}`);
                    }

                    // Notify Success of Step (Update logical state if we were tracking by ID, but since we just stream logs)
                    // Ideally we update the previous document, but for now we stream a "Result" log
                    // Or we just let the start log stand. The user UI shows "Processing" -> "Result".
                    // Let's send a log Update if possible, but simplest is sending status.
                } catch (stepError: any) {
                    this.log(`Critical Error in Step ${step.id}: ${stepError.message}`);
                    await this.browser.close();
                    return { success: false, logs: this.logs, output: stepError.message, taskId };
                }
            }

            // 4. Cleanup
            await this.browser.close();
            this.log("Mission Accomplished.");

            return {
                success: true,
                logs: this.logs,
                output: "Mission completed successfully.",
                taskId
            };

        } catch (error: any) {
            this.log(`Engine Failure: ${error.message}`);
            if (this.browser) await this.browser.close();
            return { success: false, logs: this.logs, output: error.message, taskId };
        }
    }
}
