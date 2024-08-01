import { createConnection } from '../../../lib/db';

// Function to generate a slug from a title
const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export default async (req, res) => {
  const connection = await createConnection();

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const [rows] = await connection.execute('SELECT * FROM Posts WHERE Id = ?', [id]);
      await connection.end();
      return res.status(200).json(rows);
    } else {
      const [rows] = await connection.execute('SELECT * FROM Posts');
      await connection.end();
      return res.status(200).json(rows);
    }
  } else if (req.method === 'POST') {
    const { title, content, category } = req.body;
    const slug = generateSlug(title);
    await connection.execute('INSERT INTO Posts (Title, Content, Category, Slug) VALUES (?, ?, ?, ?)', [title, content, category, slug]);
    await connection.end();
    res.status(201).json({ message: 'Post created' });
  } else if (req.method === 'PUT') {
    const { id, title, content, category } = req.body;
    const slug = generateSlug(title);
    const currentTime = new Date();
    await connection.execute('UPDATE Posts SET Title = ?, Content = ?, Category = ?, Slug = ?, Last_updated = ? WHERE Id = ?', [title, content, category, slug, currentTime, id]);
    await connection.end();
    res.status(200).json({ message: 'Post updated' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await connection.execute('DELETE FROM Posts WHERE Id = ?', [id]);
    await connection.end();
    res.status(200).json({ message: 'Post deleted' });
  } else {
    await connection.end();
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
