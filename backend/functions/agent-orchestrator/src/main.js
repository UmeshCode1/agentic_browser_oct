const { Client, Databases } = require('node-appwrite');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async ({ req, res, log, error }) => {
    // We only need the Executor Config now.
    const { EXECUTOR_URL, EXECUTOR_API_KEY } = process.env;

    if (req.method === 'POST') {
        let payload;
        try {
            payload = JSON.parse(req.body);
        } catch (e) {
            payload = req.body;
        }

        const { taskId, goal } = payload;

        log(`Orchestrator Triggered: Delegating task ${taskId} to Executor Cluster...`);

        try {
            // Call the Eko Engine
            const response = await fetch(`${EXECUTOR_URL}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': EXECUTOR_API_KEY
                },
                body: JSON.stringify({ goal, taskId })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Executor Refused: ${response.status} ${errText}`);
            }

            const data = await response.json();

            // Should be { success, logs, output }
            log(`Executor Finished. Success: ${data.success}`);

            // Return success to the caller (frontend or start-agent)
            return res.json({
                success: data.success,
                output: data.output,
                logs: data.logs
            });

        } catch (err) {
            error(`Delegation Failed: ${err.message}`);
            return res.json({
                success: false,
                error: `Orchestrator Error: ${err.message}`
            }, 500);
        }
    }

    return res.send('Active Status: Eko Relay Online. POST { goal, taskId } required.');
};
