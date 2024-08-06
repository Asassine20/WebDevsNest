// pages/api/auth/forgot-password.js
import { query } from '../../../../lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email } = req.body;

  const results = await query(`
    SELECT * FROM Users WHERE Email = ?
  `, [email]);

  if (results.length === 0) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const user = results[0];
  const token = crypto.randomBytes(20).toString('hex');
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  // Save the token and its expiration time in the database
  await query(`
    UPDATE Users SET ResetToken = ?, ResetTokenExpiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE Id = ?
  `, [token, user.Id]);

  // Send the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #682bd7; border-radius: 4px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: #fff; background-color: #682bd7; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="color: #555;">If you did not request this, please ignore this email.</p>
        <p style="color: #555;">Thanks,<br />The WebDevsNest Team</p>
      </div>
    `,
  };  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'A reset link has been sent to your email address.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send the email.' });
  }
}
