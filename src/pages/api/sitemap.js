import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Define your static pages here
  const staticPaths = [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/about-us`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/login`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/signup`, lastModified: new Date().toISOString() },
  ];

  let dynamicPaths = [];
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT Url, UpdatedAt FROM Post');
    await connection.end();

    dynamicPaths = rows.map(row => ({
      url: `${baseUrl}${row.Url}`,
      lastModified: new Date(row.UpdatedAt).toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch dynamic paths:', error);
  }

  const allPaths = [...staticPaths, ...dynamicPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map(
          path => `
        <url>
          <loc>${path.url}</loc>
          <lastmod>${path.lastModified}</lastmod>
        </url>`
        )
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(sitemap);
}
