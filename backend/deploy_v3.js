const { Client, Functions, InputFile } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

// Helper for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const FUNCTIONS = [
    {
        id: 'start-agent',
        name: 'Start Agent',
        runtime: 'node-18.0',
        entrypoint: 'src/main.js',
        tarPath: 'start-agent.tar.gz',
        execute: ['any'],
        vars: {
            // START AGENT needs these to trigger orchestrator
            APPWRITE_FUNCTION_ENDPOINT: process.env.APPWRITE_ENDPOINT,
            APPWRITE_FUNCTION_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
            APPWRITE_API_KEY: process.env.APPWRITE_API_KEY // Ensure it has key to create executions
        }
    },
    {
        id: 'agent-orchestrator',
        name: 'Agent Orchestrator',
        runtime: 'node-18.0',
        entrypoint: 'src/main.js',
        tarPath: 'agent-orchestrator.tar.gz',
        execute: ['any'],
        vars: {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            EXECUTOR_URL: process.env.EXECUTOR_URL || 'http://localhost:8001',
            EXECUTOR_API_KEY: process.env.EXECUTOR_API_KEY || '',
            OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
            APPWRITE_FUNCTION_ENDPOINT: process.env.APPWRITE_ENDPOINT,
            APPWRITE_FUNCTION_PROJECT_ID: process.env.APPWRITE_PROJECT_ID
        }
    }
];

async function deploy() {
    console.log(`Starting deployment to Project: ${process.env.APPWRITE_PROJECT_ID}`);

    for (const func of FUNCTIONS) {
        console.log(`\n--- Processing ${func.name} (${func.id}) ---`);

        // 1. Get or Create Function
        try {
            await functions.get(func.id);
            console.log(`✅ Function exists.`);
        } catch (e) {
            if (e.code === 404) {
                console.log("Function not found, creating...");
                await functions.create(
                    func.id, func.name, func.runtime, func.execute,
                    [], '', 15, true, true, func.entrypoint, '',
                    ['documents.read', 'documents.write', 'files.read', 'files.write']
                );
                console.log("✅ Function created.");
            } else {
                console.error("❌ check error:", e.message);
            }
        }

        // 2. Update Variables
        if (Object.keys(func.vars).length) {
            console.log("Updating variables...");
            try {
                const { variables } = await functions.listVariables(func.id);
                const existing = variables.map(v => v.key);
                for (const [k, v] of Object.entries(func.vars)) {
                    if (!v) continue;
                    if (existing.includes(k)) {
                        await functions.updateVariable(func.id, k, String(v));
                        console.log(`   Updated ${k}`);
                    } else {
                        await functions.createVariable(func.id, k, String(v));
                        console.log(`   Created ${k}`);
                    }
                }
            } catch (ve) { console.error("⚠️ Vars error:", ve.message); }
        }

        // 3. Upload Code (With retry and robust reading)
        const absPath = path.resolve(__dirname, func.tarPath);
        if (fs.existsSync(absPath)) {
            const stats = fs.statSync(absPath);
            console.log(`Uploading code from ${func.tarPath} (${stats.size} bytes)...`);

            // Wait a bit to ensure file handle is free
            await delay(1000);

            try {
                // Read synchronously into buffer
                const buffer = fs.readFileSync(absPath);

                // Use InputFile.fromBuffer (SDK v14+)
                // If this fails, investigate SDK version
                const file = InputFile.fromBuffer(buffer, func.tarPath);

                const d = await functions.createDeployment(
                    func.id,
                    file,
                    true // activate
                );
                console.log(`✅ Deployed! Deployment ID: ${d.$id}`);
            } catch (de) {
                console.error(`❌ Deploy failed: ${de.message}`);
                console.error(de);
            }
        } else {
            console.error(`❌ Function archive not found: ${absPath}`);
        }
    }
}

deploy();
