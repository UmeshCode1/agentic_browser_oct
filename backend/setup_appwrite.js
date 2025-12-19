/**
 * Appwrite Backend Setup Script
 * Use this to programmatically create the database, collections, and attributes.
 */

const { Client, Databases, Storage } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6945d1c2000111091fd1')
    .setKey('YOUR_API_KEY_HERE'); // User needs to provide this

const databases = new Databases(client);

const DB_ID = 'agentic_browser';

async function setupBackend() {
    try {
        // 1. Create Database
        await databases.create(DB_ID, 'Agentic Browser');
        console.log('✅ Database created');

        // 2. Create Tasks Collection
        await databases.createCollection(DB_ID, 'tasks', 'Tasks');
        await databases.createStringAttribute(DB_ID, 'tasks', 'goal', 1000, true);
        await databases.createStringAttribute(DB_ID, 'tasks', 'status', 50, true);
        await databases.createStringAttribute(DB_ID, 'tasks', 'userId', 255, true);
        console.log('✅ Tasks collection setup');

        // 3. Create Steps Collection
        await databases.createCollection(DB_ID, 'steps', 'Agent Steps');
        await databases.createStringAttribute(DB_ID, 'steps', 'taskId', 255, true);
        await databases.createStringAttribute(DB_ID, 'steps', 'reasoning', 5000, true);
        await databases.createStringAttribute(DB_ID, 'steps', 'action', 1000, true);
        await databases.createStringAttribute(DB_ID, 'steps', 'result', 10000, false);
        await databases.createStringAttribute(DB_ID, 'steps', 'screenshotId', 255, false);
        console.log('✅ Steps collection setup');

        // 4. Create Logs Collection
        await databases.createCollection(DB_ID, 'logs', 'Agent Logs');
        await databases.createStringAttribute(DB_ID, 'logs', 'taskId', 255, true);
        await databases.createStringAttribute(DB_ID, 'logs', 'message', 2000, true);
        await databases.createStringAttribute(DB_ID, 'logs', 'type', 50, true);
        console.log('✅ Logs collection setup');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

// setupBackend();
