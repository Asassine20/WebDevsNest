export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Clear the user cookie
  res.setHeader('Set-Cookie', 'user=; HttpOnly; Path=/; Max-Age=0');

  res.status(200).json({ message: 'Logged out' });
}
