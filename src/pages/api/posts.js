import { createConnection } from '../../../lib/db';

// Function to generate a slug from a title
const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Function to generate a URL from the category and slug
const generateUrl = (category, slug) => {
  return `/${category.toLowerCase()}/${slug}`;
};

export default async (req, res) => {
  const connection = await createConnection();

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const [rows] = await connection.execute('SELECT * FROM Post WHERE Id = ?', [id]);
      await connection.end();
      return res.status(200).json(rows);
    } else {
      const [rows] = await connection.execute('SELECT * FROM Post');
      await connection.end();
      return res.status(200).json(rows);
    }
  } else if (req.method === 'POST') {
    const { title, content, category, subCategory } = req.body;
    const slug = generateSlug(title);
    const url = generateUrl(category, slug);
    await connection.execute(
      'INSERT INTO Post (Title, Content, Category, SubCategory, Slug, Url) VALUES (?, ?, ?, ?, ?, ?)', 
      [title, content, category, subCategory, slug, url]
    );
    await connection.end();
    res.status(201).json({ message: 'Post created' });
  } else if (req.method === 'PUT') {
    const { id, title, content, category, subCategory } = req.body;
    const slug = generateSlug(title);
    const url = generateUrl(category, slug);
    const currentTime = new Date();
    await connection.execute(
      'UPDATE Post SET Title = ?, Content = ?, Category = ?, SubCategory = ?, Slug = ?, Url = ?, UpdatedAt = ? WHERE Id = ?', 
      [title, content, category, subCategory, slug, url, currentTime, id]
    );
    await connection.end();
    res.status(200).json({ message: 'Post updated' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await connection.execute('DELETE FROM Post WHERE Id = ?', [id]);
    await connection.end();
    res.status(200).json({ message: 'Post deleted' });
  } else {
    await connection.end();
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
