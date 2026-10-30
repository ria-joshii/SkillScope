import { NextApiRequest, NextApiResponse } from 'next';
import { getSessions } from '@/lib/sessions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sessions = await getSessions();
      return res.status(200).json({
        success: true,
        sessions: sessions.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      });
    } catch (error) {
      console.error('Sessions error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
