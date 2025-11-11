import { connect } from 'mssql';
import {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} from "./env"

const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_HOST,
  port: DB_PORT,
  database: 'master',
  options: {
    encrypt: false,               // set true if using TLS
    trustServerCertificate: true  // needed for self-signed certs
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 15000
};

async function main() {
  try {
    const pool = await connect(config);
    const result = await pool.request().query('SELECT name, database_id FROM sys.databases;');
    console.log('Databases:', result.recordset);
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(2);
  }
}

main();
