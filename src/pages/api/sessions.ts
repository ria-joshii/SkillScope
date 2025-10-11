import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all sessions for teacher
    const teacherId = req.headers['x-user-id'] as string;
    
    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'osce_feedback',
      });

      const [rows] = await connection.execute(
        'SELECT * FROM sessions WHERE teacher_id = ? ORDER BY created_at DESC',
        [teacherId]
      );

      await connection.end();

      return res.status(200).json({
        success: true,
        sessions: rows
      });

    } catch (error) {
      console.error('Sessions error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
