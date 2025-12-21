const { Client, Functions } = require('node-appwrite');
require('dotenv').config({ path: '../.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const fn = new Functions(client);

fn.list().then(l => {
    console.log("Functions List:");
    l.functions.forEach(f => {
        console.log(`- ${f.name} [${f.$id}] (Active Deployment: ${f.deployment})`);
    });
}).catch(console.error);
