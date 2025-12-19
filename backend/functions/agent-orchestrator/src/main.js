const { Client, Databases } = require('node-appwrite');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);
    const { GEMINI_API_KEY, EXECUTOR_URL, EXECUTOR_API_KEY } = process.env;

    const callGemini = async (prompt) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });
        const data = await response.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);
    };

    const callExecutor = async (action, params) => {
        const response = await fetch(`${EXECUTOR_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': EXECUTOR_API_KEY
            },
            body: JSON.stringify({ action, params })
        });
        return await response.json();
    };

    if (req.method === 'POST') {
        const { taskId, goal } = JSON.parse(req.body);

        log(`Starting orchestration for task: ${taskId}`);

        try {
            let isDone = false;
            let lastObservation = "Initial state: Browser just opened.";
            let stepCount = 0;
            const MAX_STEPS = 10;

            while (!isDone && stepCount < MAX_STEPS) {
                stepCount++;
                log(`Executing step ${stepCount}...`);

                const prompt = `
          You are an AI Web Agent.
          GOAL: "${goal}"
          LAST OBSERVATION: ${lastObservation}
          
          Provide your internal reasoning and the next action.
          AVAILABLE ACTIONS:
          - { "action": "navigate", "params": { "url": "..." } }
          - { "action": "click", "params": { "selector": "..." } }
          - { "action": "type", "params": { "selector": "...", "text": "..." } }
          - { "action": "scrape", "params": {} }
          
          Return JSON format:
          {
            "thought": "your step-by-step reasoning",
            "action": "action_name",
            "params": { ... },
            "isDone": true/false
          }
        `;

                const geminiResponse = await callGemini(prompt);
                log(`Gemini Reasoning: ${geminiResponse.thought}`);

                const actionResult = await callExecutor(geminiResponse.action, geminiResponse.params);
                lastObservation = JSON.stringify(actionResult.observation);

                await databases.createDocument('agentic_browser', 'steps', 'unique()', {
                    taskId,
                    reasoning: geminiResponse.thought,
                    action: geminiResponse.action,
                    result: JSON.stringify(actionResult.result),
                    createdAt: new Date().toISOString()
                });

                if (geminiResponse.isDone) isDone = true;
            }

            return res.json({ success: true, message: 'Task completed' });

        } catch (err) {
            error(`Orchestration failed: ${err.message}`);
            return res.json({ success: false, error: err.message }, 500);
        }
    }

    return res.send('Send a POST request with goal and taskId.');
};
