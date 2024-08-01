import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, confirmationCode } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user || user.confirmationCode !== confirmationCode) {
        return res.status(400).json({ error: 'Invalid confirmation code' });
      }

      await prisma.user.update({
        where: { email: email },
        data: { confirmed: true, confirmationCode: null },
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.setHeader('Set-Cookie', serialize('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      }));

      res.status(200).json({ message: 'User confirmed and logged in' });
    } catch (error) {
      console.error('Error confirming user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
