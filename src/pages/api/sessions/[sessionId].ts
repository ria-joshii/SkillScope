import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const { getSessions } = await import('../../../lib/storage');
    const sessions = await getSessions();
    const session = sessions.find((s: any) => s.unique_id === sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: 'Session not found' 
      });
    }

    return res.status(200).json({
      success: true,
      session: {
        id: session.id,
        unique_id: session.unique_id,
        file_name: session.file_name,
        status: session.status,
        pdf_path: session.pdf_path,
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    });

  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
