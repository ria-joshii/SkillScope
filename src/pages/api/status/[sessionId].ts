import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { getSessions } from '@/lib/sessions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (typeof sessionId !== 'string' || !sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const sessions = await getSessions();
    const session = sessions.find(s => s.unique_id === sessionId);

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
