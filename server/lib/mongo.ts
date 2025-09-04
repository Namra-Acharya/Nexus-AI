import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

// In-memory fallback store when MONGO_URI is not provided (ephemeral, for demos only)
const inMemoryStore: Record<string, any[]> = {
  users: [],
};
let inMemoryId = 1;

function createInMemoryCollection(name: string) {
  return {
    findOne: async (query: any) => {
      if (!query) return null;
      // Support simple { email: value } queries used by auth
      if (query.email) return inMemoryStore.users.find(u => u.email === query.email) || null;
      return null;
    },
    insertOne: async (doc: any) => {
      const id = String(inMemoryId++);
      const record = { _id: id, ...doc };
      inMemoryStore[name].push(record);
      return { insertedId: id };
    }
  };
}

export async function getDb(): Promise<Db | any> {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set — using in-memory fallback DB (ephemeral)');
    // Return a minimal db-like object with collection() method
    return {
      collection: (name: string) => createInMemoryCollection(name),
    };
  }

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
