import { query } from '../../../lib/db';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

// Configure AWS SDK
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new aws.SES({ apiVersion: '2010-12-01' });

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, name, subject, content } = req.body;

  try {
    // Insert the form submission into the Advertisements table
    await query(`
      INSERT INTO Advertisements (Name, Email, Subject, Content, CreatedAt)
      VALUES (?, ?, ?, ?, NOW())
    `, [name, email, subject, content]);

    // Email content
    const mailOptions = {
      from: process.env.SES_FROM_EMAIL, // Your verified email address
      to: process.env.SES_FROM_EMAIL, // The same email address
      subject: `Advertise With Us Form Submission: ${subject}`,
      replyTo: email, // User's email address for replying directly
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
          <h2>New Advertise With Us Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Content:</strong> ${content}</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Advertisement inquiry received, we will contact you shortly.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
}
