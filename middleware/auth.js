// middleware/auth.js
import { query } from '../lib/db';
import cookie from 'cookie';

export default async function auth(req, res, next) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userId = cookies.user;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' }); // Respond with 401 status
  }

  const results = await query(`
    SELECT * FROM Users WHERE Id = ?
  `, [userId]);

  if (results.length === 0) {
    return res.status(401).json({ error: 'Not authenticated' }); // Respond with 401 status
  }

  // Reset the cookie expiration on every request
  res.setHeader('Set-Cookie', `user=${userId}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`); // 7 days

  req.user = results[0];
  next();
}
