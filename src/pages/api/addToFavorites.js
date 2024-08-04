import { query } from '../../../lib/db';
import auth from '../../../middleware/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      await auth(req, res, async () => {
        const { postId } = req.body;
        const userId = req.user.Id;
  
        if (!userId || !postId) {
          return res.status(400).json({ error: 'Missing userId or postId' });
        }
  
        try {
          await query(`
            INSERT INTO UserFavorites (UserId, PostId)
            VALUES (?, ?)
          `, [userId, parseInt(postId, 10)]);
  
          res.status(200).json({ message: 'Post added to favorites' });
        } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Database error' });
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }