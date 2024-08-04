import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute('SELECT * FROM Post');
      await connection.end();
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
}
