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

    if (!session || !session.pdf_path) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const pdfBuffer = fs.readFileSync(session.pdf_path);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sessionId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ message: 'Download failed' });
  }
}
