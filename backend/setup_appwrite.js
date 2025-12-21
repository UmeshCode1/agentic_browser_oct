/**
 * Appwrite Backend Setup Script
 * Use this to programmatically create the database, collections, and attributes.
 */

require('dotenv').config({ path: '../.env.local' });
const { Client, Databases, Storage, Permission, Role } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = 'agentic_browser';
const BUCKET_ID = 'screenshots';

async function setupBackend() {
    try {
        console.log('🚀 Starting Appwrite Setup...');

        // 1. Create Database
        try {
            await databases.get(DB_ID);
            console.log('✅ Database already exists');
        } catch {
            await databases.create(DB_ID, 'Agentic Browser');
            console.log('✅ Database created');
        }

        // 2. Create Tasks Collection
        try {
            await databases.createCollection(DB_ID, 'tasks', 'Tasks');
            await databases.createStringAttribute(DB_ID, 'tasks', 'goal', 1000, true);
            await databases.createStringAttribute(DB_ID, 'tasks', 'status', 50, true);
            await databases.createStringAttribute(DB_ID, 'tasks', 'userId', 255, true);
            console.log('✅ Tasks collection setup');
        } catch (e) {
            console.log('ℹ️ Tasks collection might already exist');
        }

        // 3. Create Steps Collection
        try {
            await databases.createCollection(DB_ID, 'steps', 'Agent Steps');
            await databases.createStringAttribute(DB_ID, 'steps', 'taskId', 255, true);
            await databases.createStringAttribute(DB_ID, 'steps', 'reasoning', 5000, true);
            await databases.createStringAttribute(DB_ID, 'steps', 'action', 1000, true);
            await databases.createStringAttribute(DB_ID, 'steps', 'result', 10000, false);
            await databases.createStringAttribute(DB_ID, 'steps', 'screenshotId', 255, false);
            console.log('✅ Steps collection setup');
        } catch (e) {
            console.log('ℹ️ Steps collection might already exist');
        }

        // 4. Create Logs Collection
        try {
            await databases.createCollection(DB_ID, 'logs', 'Agent Logs');
            await databases.createStringAttribute(DB_ID, 'logs', 'taskId', 255, true);
            await databases.createStringAttribute(DB_ID, 'logs', 'message', 2000, true);
            await databases.createStringAttribute(DB_ID, 'logs', 'type', 50, true);
            console.log('✅ Logs collection setup');
        } catch (e) {
            console.log('ℹ️ Logs collection might already exist');
        }

        // 5. Create Storage Bucket
        try {
            await storage.getBucket(BUCKET_ID);
            console.log('✅ Storage bucket already exists');
        } catch {
            await storage.createBucket(BUCKET_ID, 'Screenshots', [
                Permission.read(Role.any()), // Public read access
                Permission.write(Role.any())
            ]);
            console.log('✅ Storage bucket created');
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

setupBackend();
