import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../../../lib/db';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

// Configure AWS SDK
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new aws.SES({ apiVersion: '2010-12-01' });

const transporter = nodemailer.createTransport({
  SES: { ses, aws }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, name, password } = req.body;

  const existingUser = await query('SELECT * FROM Users WHERE Email = ?', [email]);

  if (existingUser.length > 0) {
    return res.status(409).json({ error: 'Email already in use' });
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
    from: process.env.SES_FROM_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #682bd7; border-radius: 4px;">
        <!-- Logo centered at the top -->
        <div style="text-align: center;">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="WebDevsNest Logo" style="width: 100px; height: 50px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #333; text-align: center;">Welcome to WebDevsNest!</h2>
        <p style="color: #555;">Hi ${name},</p>
        <p style="color: #555;">Thank you for signing up for an account with WebDevsNest. Please confirm your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: #fff; background-color: #682bd7; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="color: #555;">If you did not sign up for this account, please ignore this email.</p>
        <p style="color: #555;">Thank you,<br />The WebDevsNest Team</p>
        <!-- Social media icons -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.tiktok.com/@webdevsnest?lang=en" style="margin: 0 10px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/tiktokIcon.png" alt="TikTok" style="width: 24px; height: 24px;">
          </a>
          <a href="https://www.youtube.com/channel/UCMHAqAbKaP0CWQHbcvIMx2w" style="margin: 0 10px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/youtubeIcon.png" alt="YouTube" style="width: 24px; height: 24px;">
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User created, please verify your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
}
