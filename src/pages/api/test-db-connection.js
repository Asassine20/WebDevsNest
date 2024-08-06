// pages/api/test-db-connection.js
import { createConnection } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await createConnection();
    await connection.execute('SELECT 1');
    await connection.end();
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
}
