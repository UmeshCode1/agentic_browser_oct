import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6945d1c2000111091fd1");

const account = new Account(client);
const databases = new Databases(client);

client.ping();

export { client, account, databases };
