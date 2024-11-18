import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await createConnection();

      // Query to fetch posts ordered by CreatedAt
      const [rows] = await connection.execute(
        'SELECT Id, Title, Content, Category, SubCategory, CreatedAt, UpdatedAt, Slug, Url, MetaDescription, MetaKeywords FROM Post ORDER BY CreatedAt DESC'
      );

      await connection.end();

      // Format the data
      const formattedData = rows.map((post) => ({
        id: post.Id,
        title: post.Title,
        content: post.Content,
        category: post.Category,
        subCategory: post.SubCategory || 'General',
        createdAt: post.CreatedAt,
        updatedAt: post.UpdatedAt,
        slug: post.Slug,
        url: post.Url,
        metaDescription: post.MetaDescription,
        metaKeywords: post.MetaKeywords,
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
