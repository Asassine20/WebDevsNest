import { createConnection } from '../../../lib/db';

export default async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const connection = await createConnection();
  const [rows] = await connection.execute(
    'SELECT Id, Title, Category, Slug FROM Posts WHERE Title LIKE ? OR Content LIKE ?',
    [`%${query}%`, `%${query}%`]
  );
  await connection.end();

  return res.status(200).json(rows);
};
