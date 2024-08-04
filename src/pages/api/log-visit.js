import auth from '../../../middleware/auth';
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  console.log('Log visit API called');

  auth(req, res, async () => {
    if (req.user) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      console.log('Current date:', today);

      const results = await query(`
        SELECT * FROM UserVisits
        WHERE UserId = ? AND DATE(VisitDate) = ?
      `, [req.user.Id, today]);

      console.log('Existing visits for today:', results);

      if (results.length === 0) {
        await query(`
          INSERT INTO UserVisits (UserId, VisitDate)
          VALUES (?, NOW())
        `, [req.user.Id]);
        console.log('New visit logged');
      } else {
        console.log('Visit not logged, already visited today');
      }

      res.status(200).json({ message: 'Visit logged' });
    } else {
      console.log('User not authenticated');
      res.status(401).json({ error: 'Not authenticated' });
    }
  });
}
