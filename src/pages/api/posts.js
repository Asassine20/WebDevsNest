import { createConnection } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

// Function to generate a slug from a title
const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/\+\+/g, 'pp') // Replace "++" with "pp"
    .replace(/#/g, 'sharp') // Replace "#" with "sharp"
    .replace(/[^a-z0-9\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/(^-|-$)/g, ''); // Trim hyphens from start and end
};

// Function to generate a URL from the category and slug
const generateUrl = (category, slug) => {
  return `/${category.toLowerCase()}/${slug}`;
};

// Function to generate the sitemap
const generateSitemap = async () => {
  const baseURL = 'https://webdevsnest.com'; // Replace with your actual URL

  const connection = await createConnection();
  const [posts] = await connection.execute('SELECT Slug, Category FROM Post');
  await connection.end();

  const staticPaths = [
    '',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/login',
    '/signup',
    '/advertise-with-us',
  ];

  const dynamicPaths = posts.map((post) => `/${post.Category}/${post.Slug}`);

  const allPaths = [...staticPaths, ...dynamicPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((path) => {
          return `
            <url>
              <loc>${baseURL}${path}</loc>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>`;

  // Write the sitemap to the public directory
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
};

export default async (req, res) => {
  const connection = await createConnection();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const [rows] = await connection.execute('SELECT * FROM Post WHERE Id = ?', [id]);
        res.status(200).json(rows);
      } else {
        const [rows] = await connection.execute('SELECT * FROM Post');
        res.status(200).json(rows);
      }
    } else if (req.method === 'POST') {
      const { title, content, category, subCategory } = req.body;
      const slug = generateSlug(title);
      const url = generateUrl(category, slug);
      await connection.execute(
        'INSERT INTO Post (Title, Content, Category, SubCategory, Slug, Url) VALUES (?, ?, ?, ?, ?, ?)', 
        [title, content, category, subCategory, slug, url]
      );
      await generateSitemap(); // Trigger sitemap generation after adding a post
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
      await generateSitemap(); // Trigger sitemap generation after updating a post
      res.status(200).json({ message: 'Post updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await connection.execute('DELETE FROM Post WHERE Id = ?', [id]);
      await generateSitemap(); // Trigger sitemap generation after deleting a post
      res.status(200).json({ message: 'Post deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    await connection.end();
  }
};
