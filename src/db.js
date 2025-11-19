import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "airline";

if (!uri) {
  console.warn("⚠️ MONGODB_URI is not set yet. Set it in .env before running against Atlas.");
}

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  db = client.db(dbName);
  console.log(`✅ Connected to MongoDB database: ${db.databaseName}`);
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not initialized. Call connectDB() first.");
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}
