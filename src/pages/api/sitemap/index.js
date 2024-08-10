import { createConnection } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

const generateSitemap = async () => {
  const baseURL = 'https://webdevsnest.com'; // Replace with your actual URL

  const connection = await createConnection();
  const [posts] = await connection.execute('SELECT Slug, Category FROM Post');
  await connection.end();

  const staticPaths = [
    '',
    'about-us',
    'contact-us',
    'privacy-policy',
    'login',
    'signup',
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

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      await generateSitemap();
      res.status(200).json({ message: 'Sitemap generated successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
