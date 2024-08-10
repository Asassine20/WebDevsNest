import { query } from '../../../../lib/db';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import crypto from 'crypto';

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

  await query(`
    UPDATE Users SET ResetToken = ?, ResetTokenExpiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE Id = ?
  `, [token, user.Id]);

  const mailOptions = {
    from: process.env.SES_FROM_EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #682bd7; border-radius: 4px;">
      <!-- Logo centered at the top -->
      <div style="text-align: center;">
        <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="WebDevsNest Logo" style="max-width: 100px; height: auto; margin-bottom: 20px;">
      </div>
      <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">Please click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: #fff; background-color: #682bd7; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="color: #555;">If you did not request this, please ignore this email.</p>
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
    res.status(200).json({ message: 'A reset link has been sent to your email address.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send the email.' });
  }
}
