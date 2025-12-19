const { Client, Databases, Functions, ID } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);
    const functions = new Functions(client);

    if (req.method === 'POST') {
        const { goal, userId } = JSON.parse(req.body);

        try {
            // 1. Create a Task document
            const task = await databases.createDocument(
                'agentic_browser',
                'tasks',
                ID.unique(),
                {
                    goal,
                    userId: userId || 'anonymous',
                    status: 'started',
                    createdAt: new Date().toISOString()
                }
            );

            log(`Task created: ${task.$id}`);

            // 2. Trigger the Orchestrator Function asynchronously
            // We don't wait for it to finish because it might take minutes.
            functions.createExecution(
                'agent-orchestrator',
                JSON.stringify({ taskId: task.$id, goal }),
                true // async
            );

            return res.json({ success: true, taskId: task.$id });

        } catch (err) {
            error(`StartAgent failed: ${err.message}`);
            return res.json({ success: false, error: err.message }, 500);
        }
    }

    return res.send('Send a POST request with goal.');
};
