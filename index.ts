import express from 'express';
import { initDb, isConnected, querySql } from './db';

async function start() {
  await initDb();

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

    if (!isConnected()) {
      console.error('No DB connection available to run query');
      return res.status(503).json({ error: 'DB not connected' });
    }

    try {
      console.info('Executing query:', sql);
      const rows = await querySql(sql);
      console.info('Query result:', rows);
      return res.json({ rows });
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
