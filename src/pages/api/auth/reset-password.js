// pages/api/auth/reset-password.js
import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { token, password } = req.body;

  const results = await query(`
    SELECT * FROM Users WHERE ResetToken = ? AND ResetTokenExpiry > NOW()
  `, [token]);

  if (results.length === 0) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const user = results[0];
  const hashedPassword = await bcrypt.hash(password, 10);

  await query(`
    UPDATE Users SET Password = ?, ResetToken = NULL, ResetTokenExpiry = NULL WHERE Id = ?
  `, [hashedPassword, user.Id]);

  res.status(200).json({ message: 'Password has been reset successfully' });
}
