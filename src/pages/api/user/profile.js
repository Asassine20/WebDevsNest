import { authenticated } from '../../../middleware/auth';

export default authenticated(async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(req.user);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
