// src/lib/db.ts
// Basic database connection utility

import { Pool } from 'pg'; // If you're using PostgreSQL

// Use environment variables for connection details
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true // Always verify SSL certificates in production
      } : {
        rejectUnauthorized: false // Allow self-signed certificates in development
      }
    })
  : null;

export async function query(text: string, params?: unknown[]) {
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

const db = {
  query
};

export default db;