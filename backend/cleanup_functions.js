const { Client, Functions } = require('node-appwrite');
require('dotenv').config({ path: '../.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

async function clean() {
    console.log("🔍 Scanning for duplicate functions...");
    try {
        const list = await functions.list();
        const keeps = ['start-agent', 'agent-orchestrator'];

        for (const func of list.functions) {
            if (!keeps.includes(func.$id)) {
                console.log(`🗑️ Deleting duplicate/unwanted function: ${func.name} (${func.$id})`);
                await functions.delete(func.$id);
                console.log(`✅ Deleted ${func.$id}`);
            } else {
                console.log(`🛡️ Keeping core function: ${func.name} (${func.$id})`);
            }
        }
    } catch (e) {
        console.error("❌ Cleanup failed:", e.message);
    }
}

clean();
