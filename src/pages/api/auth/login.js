// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  const results = await query(`
    SELECT * FROM Users WHERE Email = ?
  `, [email]);

  if (results.length === 0) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = results[0];

  const isPasswordMatch = await bcrypt.compare(password, user.Password);
  if (!isPasswordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Set a cookie for session management
  res.setHeader('Set-Cookie', `user=${user.Id}; HttpOnly; Path=/; Max-Age=3600`);

  res.status(200).json({ userId: user.Id });
}
