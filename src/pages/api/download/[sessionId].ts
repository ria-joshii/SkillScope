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

    const pdfPath = session.pdf_path || session.analysis_path?.replace('.json', '.pdf');
    
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="OSCE-Report-${sessionId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ message: 'Download failed' });
  }
}
