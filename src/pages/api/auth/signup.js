import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../../../lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, name, password } = req.body;

  // Check if email already exists
  const existingUser = await query('SELECT * FROM Users WHERE Email = ?', [email]);

  if (existingUser.length > 0) {
    return res.status(409).json({ error: 'Email already in use' }); // Conflict
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const verificationToken = uuidv4();

  await query(`
    INSERT INTO Users (Id, Email, Name, Password, VerificationToken)
    VALUES (?, ?, ?, ?, ?)
  `, [userId, email, name, hashedPassword, verificationToken]);

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #682bd7; border-radius: 4px;">
        <h2 style="color: #333;">Welcome to WebDevsNest!</h2>
        <p style="color: #555;">Hi ${name},</p>
        <p style="color: #555;">Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: #fff; background-color: #682bd7; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="color: #555;">If you did not sign up for this account, please ignore this email.</p>
        <p style="color: #555;">Thanks,<br />The WebDevsNest Team</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
    console.log('Verification email sent: ' + info.response);
  });

  res.status(201).json({ message: 'User created, please verify your email' });
}
