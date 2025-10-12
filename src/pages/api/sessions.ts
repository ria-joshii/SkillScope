import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

function getSessions() {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'data', 'sessions.json'), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sessions = getSessions();
      return res.status(200).json({
        success: true,
        sessions: sessions.sort((a: any, b: any) => 
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
