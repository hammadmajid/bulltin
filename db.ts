import { connect, ConnectionPool } from 'mssql';
import {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} from './env';

const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_HOST,
  port: DB_PORT,
  database: 'master',
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 15000
};

let pool: ConnectionPool | null = null;

export async function initDb(): Promise<ConnectionPool | null> {
  if (pool) return pool;
  try {
    pool = await connect(config);
    console.info('DB pool connected (db.ts)');
    return pool;
  } catch (err) {
    console.error('DB connection error (db.ts):', err);
    pool = null;
    return null;
  }
}

export function isConnected(): boolean {
  return !!pool;
}

export async function querySql(sql: string): Promise<any[]> {
  if (!pool) throw new Error('DB not connected');
  const result = await pool.request().query(sql);
  return result.recordset;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
    } catch (err) {
      console.warn('Error closing DB pool:', err);
    }
    pool = null;
  }
}
