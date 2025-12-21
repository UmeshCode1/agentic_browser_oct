
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface PlanStep {
    id: number;
    instruction: string;
    action: 'goto' | 'click' | 'type' | 'extract' | 'wait';
    params: any;
}

export interface Plan {
    goal: string;
    steps: PlanStep[];
}

export class PlannerAgent {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        if (!apiKey) throw new Error("GEMINI_API_KEY is required for PlannerAgent");
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async createPlan(goal: string): Promise<Plan> {
        const prompt = `
        You are an autonomous browser agent planner.
        Goal: "${goal}"
        
        Break this goal down into a logical sequence of browser actions.
        Available Actions:
        - goto(url: string)
        - click(selector: string) // Use simple CSS selectors or text-based like "text=Login"
        - type(selector: string, text: string)
        - extract() // Extracts page text
        - wait(ms: number)

        Return strictly valid JSON format:
        {
            "goal": "${goal}",
            "steps": [
                { "id": 1, "instruction": "Navigate to Google", "action": "goto", "params": "https://www.google.com" },
                ...
            ]
        }
        Do not allow any markdown code blocks. Just raw JSON.
        `;

        const result = await this.model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Cleanup markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const plan: Plan = JSON.parse(text);
            return plan;
        } catch (e) {
            console.error("Failed to parse plan:", text);
            throw new Error("Planner failed to generate valid JSON plan.");
        }
    }
}
