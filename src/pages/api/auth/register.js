import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

      // Create a new user
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
