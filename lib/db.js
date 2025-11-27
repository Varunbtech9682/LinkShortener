import pkg from "pg";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database queries will fail.");
}

let pool;

if (!globalThis._tinylinkPool) {
  globalThis._tinylinkPool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
}

pool = globalThis._tinylinkPool;

export { pool };
