// pages/api/auth/logout.js
export default async function handler(req, res) {
    res.setHeader('Set-Cookie', 'user=; HttpOnly; Path=/; Max-Age=0');
    res.status(200).json({ message: 'Logged out' });
  }
  