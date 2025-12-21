const { Client, Functions, InputFile } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

const FUNCTIONS = [
    {
        id: 'start-agent',
        name: 'Start Agent',
        runtime: 'node-18.0',
        entrypoint: 'src/main.js',
        tarPath: 'start-agent.tar.gz',
        execute: ['any'],
        vars: {}
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
            EXECUTOR_URL: process.env.EXECUTOR_URL || 'https://placeholder.com',
            EXECUTOR_API_KEY: process.env.EXECUTOR_API_KEY || '',
            OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        }
    }
];

async function deploy() {
    for (const func of FUNCTIONS) {
        console.log(`Processing ${func.name}...`);

        try {
            await functions.get(func.id);
        } catch (e) {
            if (e.code === 404) {
                console.log(`Creating function ${func.id}...`);
                try {
                    await functions.create(
                        func.id, func.name, func.runtime, func.execute,
                        [], '', 15, true, true, func.entrypoint, '',
                        ['documents.read', 'documents.write', 'files.read', 'files.write', 'executions.write']
                    );
                } catch (ce) { console.error("Create failed:", ce.message); continue; }
            }
        }

        if (Object.keys(func.vars).length) {
            console.log("Updating variables...");
            try {
                const { variables } = await functions.listVariables(func.id);
                const existing = variables.map(v => v.key);
                for (const [k, v] of Object.entries(func.vars)) {
                    if (!v) continue;
                    if (existing.includes(k)) await functions.updateVariable(func.id, k, String(v));
                    else await functions.createVariable(func.id, k, String(v));
                }
            } catch (ve) { console.error("Vars failed:", ve.message); }
        }

        if (fs.existsSync(func.tarPath)) {
            const absPath = path.resolve(__dirname, func.tarPath);
            console.log(`Uploading ${absPath}...`);
            const buffer = fs.readFileSync(absPath);

            try {
                // Ensure we use the buffer method
                const file = InputFile.fromBuffer(buffer, func.tarPath);
                const d = await functions.createDeployment(func.id, file, true);
                console.log(`✅ Deployed: ${d.$id}`);
            } catch (de) {
                console.error(`Deploy failed for ${func.id}:`);
                console.error(de);
            }
        }
    }
}

deploy();
