import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticated = fn => async (req, res) => {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return await fn(req, res);
  } catch (error) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
};
