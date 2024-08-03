// pages/api/auth/signup.js
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  await query(`
    INSERT INTO Users (Id, Email, Name, Password)
    VALUES (?, ?, ?, ?)
  `, [userId, email, name, hashedPassword]);

  // Set a cookie for session management
  res.setHeader('Set-Cookie', `user=${userId}; HttpOnly; Path=/; Max-Age=3600`);

  res.status(201).json({ userId });
}
