// pages/api/favorites.js
import { query } from '../../../lib/db';
import auth from '../../../middleware/auth';

export default async function handler(req, res) {
    await auth(req, res, async () => {
      const { userId } = req.query;
  
      try {
        const results = await query(`
          SELECT Post.Id, Post.Title, Post.Category, Post.Slug
          FROM UserFavorites
          JOIN Post ON UserFavorites.PostId = Post.Id
          WHERE UserFavorites.UserId = ?
        `, [userId]);
  
        res.status(200).json({ favorites: results });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
      }
    });
  }