import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  if (!client) {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  }
  // For MongoDB Node.js Driver v6+, connect() is idempotent and safe to call
  await client.connect();
  const url = new URL(uri);
  const dbName = url.pathname.replace(/^\//, '') || 'nexus';
  db = client.db(dbName);
  return db;
}
