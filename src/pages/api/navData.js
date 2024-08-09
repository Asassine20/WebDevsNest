import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute('SELECT Title, Url, Category, SubCategory FROM Post ORDER BY SubCategory, Title');
      await connection.end();

      const groupedData = rows.reduce((acc, post) => {
        if (!acc[post.SubCategory]) {
          acc[post.SubCategory] = [];
        }
        acc[post.SubCategory].push(post);
        return acc;
      }, {});

      res.status(200).json(groupedData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
