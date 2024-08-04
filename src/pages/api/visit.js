import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const [visit] = await query(
      'SELECT * FROM UserVisitStreak WHERE UserId = ?',
      [userId]
    );

    if (!visit) {
      await query(
        'INSERT INTO UserVisitStreak (UserId, LastVisit, Streak) VALUES (?, ?, ?)',
        [userId, today, 1]
      );
      return res.status(200).json({ streak: 1 });
    }

    const lastVisit = new Date(visit.LastVisit);
    const differenceInDays = Math.floor((new Date(today) - lastVisit) / (1000 * 60 * 60 * 24));

    if (differenceInDays === 1) {
      await query(
        'UPDATE UserVisitStreak SET LastVisit = ?, Streak = Streak + 1 WHERE UserId = ?',
        [today, userId]
      );
      return res.status(200).json({ streak: visit.Streak + 1 });
    } else if (differenceInDays > 1) {
      await query(
        'UPDATE UserVisitStreak SET LastVisit = ?, Streak = 1 WHERE UserId = ?',
        [today, userId]
      );
      return res.status(200).json({ streak: 1 });
    }

    return res.status(200).json({ streak: visit.Streak });
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    const [visit] = await query(
      'SELECT * FROM UserVisitStreak WHERE UserId = ?',
      [userId]
    );
    return res.status(200).json({ streak: visit ? visit.Streak : 0 });
  }

  return res.status(405).end(); // Method Not Allowed
}
