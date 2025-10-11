import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'osce_feedback',
    });

    const [rows] = await connection.execute(
      'SELECT status, analysis_path FROM sessions WHERE unique_id = ?',
      [sessionId]
    );

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = rows[0] as any;
    let analysis = null;

    if (session.status === 'completed' && session.analysis_path) {
      try {
        const content = fs.readFileSync(session.analysis_path, 'utf-8');
        analysis = JSON.parse(content);
      } catch (err) {
        console.error('Failed to read analysis:', err);
      }
    }

    return res.status(200).json({
      success: true,
      status: session.status,
      analysis
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ 
      message: 'Failed to check status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
