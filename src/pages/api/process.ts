import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import mysql from 'mysql2/promise';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, filePath } = req.body;

  if (!sessionId || !filePath) {
    return res.status(400).json({ message: 'Missing sessionId or filePath' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'osce_feedback',
    });

    await connection.execute(
      'UPDATE sessions SET status = ? WHERE unique_id = ?',
      ['processing', sessionId]
    );

    const outputDir = path.join(process.cwd(), 'outputs');
    const scriptPath = path.join(process.cwd(), 'scripts', 'osce_analyzer.py');
    
    const { stdout } = await execAsync(
      `python3 "${scriptPath}" "${filePath}" "${outputDir}"`
    );

    const outputFile = stdout.trim();

    await connection.execute(
      'UPDATE sessions SET status = ?, analysis_path = ? WHERE unique_id = ?',
      ['completed', outputFile, sessionId]
    );

    await connection.end();

    return res.status(200).json({ success: true, outputFile });
  } catch (error) {
    console.error('Processing error:', error);
    
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'osce_feedback',
      });

      await connection.execute(
        'UPDATE sessions SET status = ? WHERE unique_id = ?',
        ['failed', sessionId]
      );

      await connection.end();
    } catch (dbError) {
      console.error('DB update error:', dbError);
    }

    return res.status(500).json({ 
      message: 'Processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
