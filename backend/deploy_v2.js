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

        // Ensure function exists
        try {
            await functions.get(func.id);
        } catch (e) {
            if (e.code === 404) {
                console.log("Function not found, creating...");
                await functions.create(
                    func.id, func.name, func.runtime, func.execute,
                    [], '', 15, true, true, func.entrypoint, '',
                    ['documents.read', 'documents.write', 'files.read', 'files.write']
                );
            }
        }

        // Update Vars
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
            } catch (ve) { console.error("Vars error:", ve.message); }
        }

        // Upload
        const absPath = path.resolve(__dirname, func.tarPath);
        if (fs.existsSync(absPath)) {
            console.log(`Uploading ${func.tarPath}...`);
            const buffer = fs.readFileSync(absPath);

            // ROBUST INPUT FILE CREATION
            let file;
            if (InputFile.fromBuffer) {
                file = InputFile.fromBuffer(buffer, func.tarPath);
            } else {
                // Last ditch: construct internal object if SDK changed API
                file = {
                    buffer: buffer,
                    filename: func.tarPath
                };
            }

            try {
                const d = await functions.createDeployment(
                    func.id,
                    file.entrypoint ? file : InputFile.fromBuffer(buffer, func.tarPath), // Try standard first
                    true
                );
                console.log(`✅ Deployed: ${d.$id}`);
            } catch (de) {
                console.error(`Deploy failed: ${de.message}`);
                // If it failed because of InputFile issues, try passing buffer directly? (Unlikely to work but logging)
            }
        }
    }
}

deploy();
