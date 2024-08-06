// pages/api/auth/verify.js
import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  const users = await query('SELECT * FROM Users WHERE VerificationToken = ?', [token]);

  if (users.length === 0) {
    return res.status(400).json({ error: 'Invalid verification token' });
  }

  await query('UPDATE Users SET EmailVerified = CURRENT_TIMESTAMP(3), VerificationToken = NULL WHERE VerificationToken = ?', [token]);

  // Redirect to dashboard after verification
  res.writeHead(302, { Location: '/profile/dashboard' });
  res.end();
}
