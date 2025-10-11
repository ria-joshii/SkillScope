import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  try {
    const sessionsFile = path.join(process.cwd(), 'data', 'sessions.json');
    const sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
    const session = sessions.find((s: any) => s.unique_id === sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
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
