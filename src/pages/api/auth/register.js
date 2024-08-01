import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    console.log('Register input:', { email, password, name });

    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        console.error('User already exists with email:', email);
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a confirmation code
      const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create a new user with confirmation code
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
          confirmationCode: confirmationCode,
          confirmed: false,
        },
      });

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Confirmation',
        text: `Thank you for registering. Your confirmation code is: ${confirmationCode}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'Confirmation email sent' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
