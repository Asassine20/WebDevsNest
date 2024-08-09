import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await createConnection();
      const { category } = req.query;
      let query = 'SELECT * FROM Post';
      const params = [];

      if (category) {
        query += ' WHERE Category = ?';
        params.push(category);
      }

      const [rows] = await connection.execute(query, params);
      await connection.end();
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
}
