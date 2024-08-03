// middleware/auth.js
import { query } from '../lib/db';
import cookie from 'cookie';

export default async function auth(req, res, next) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userId = cookies.user;

  if (!userId) {
    return res.status(401).end(); // Unauthorized
  }

  const results = await query(`
    SELECT * FROM Users WHERE Id = ?
  `, [userId]);

  if (results.length === 0) {
    return res.status(401).end(); // Unauthorized
  }

  req.user = results[0];
  next();
}
