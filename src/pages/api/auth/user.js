// pages/api/auth/user.js
import auth from '../../../../middleware/auth';

export default async function handler(req, res) {
  auth(req, res, async () => {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });
}
