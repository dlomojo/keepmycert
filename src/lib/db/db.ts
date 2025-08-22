// src/lib/db.ts
// Basic database connection utility

import { Pool } from 'pg'; // If you're using PostgreSQL

// Use environment variables for connection details
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for some hosting environments
      }
    })
  : null;

export async function query(text: string, params?: any[]) {
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

export default {
  query
};