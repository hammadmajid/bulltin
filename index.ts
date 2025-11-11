import express from 'express';
import { connect, ConnectionPool } from 'mssql';
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

async function start() {
  try {
    pool = await connect(config);
    console.log('DB pool connected');
  } catch (err) {
    console.error('DB connection error:', err);
    // continue without exiting so server can still accept requests (will return 503 if DB not connected)
  }

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // POST /query expects a JSON body like { "query": "SELECT ..." } or a raw SQL string
  app.post('/query', async (req, res) => {
    const body = req.body;
    const sql = typeof body === 'string' ? body : (body && body.query) ? body.query : undefined;

    if (!sql || typeof sql !== 'string') {
      console.error('Received invalid query payload:', body);
      return res.status(400).json({ error: 'Request body must be a SQL string or { query: string }' });
    }

    if (!pool) {
      console.error('No DB connection available to run query');
      return res.status(503).json({ error: 'DB not connected' });
    }

    try {
      console.info('Executing query:', sql);
      const result = await pool.request().query(sql);
      console.info('Query result:', result.recordset);
      return res.json({ rows: result.recordset });
    } catch (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: String(err) });
    }
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(port, () => {
    console.info(`Server listening on http://localhost:${port}`);
  });
}

start();
