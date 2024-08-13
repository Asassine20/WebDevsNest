import { createConnection } from '../../../lib/db';

export default async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const connection = await createConnection();

  const [rows] = await connection.execute(
    `
    SELECT Id, Title, Category, Slug,
           CASE
             WHEN Title LIKE ? THEN 1
             WHEN Title LIKE ? THEN 2
             ELSE 3
           END AS \`Rank\`
    FROM Post
    WHERE Title LIKE ? OR Content LIKE ?
    ORDER BY \`Rank\`, LOCATE(?, Title), Title ASC
    `,
    [
      `${query}%`,         // Exact match at the start of the Title
      `%${query}%`,        // Match anywhere in the Title
      `%${query}%`,        // For WHERE clause Title
      `%${query}%`,        // For WHERE clause Content
      query                // For LOCATE function
    ]
  );

  await connection.end();

  return res.status(200).json(rows);
};
