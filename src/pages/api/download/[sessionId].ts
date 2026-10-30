import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { getSessions } from '@/lib/sessions';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const session = getSessions().find(item => item.unique_id === sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Analysis not completed yet' });
    }

    // Check if PDF exists
    const pdfPath = session.pdf_path;
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF report not found' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sessionId}_report.pdf"`);

    // Stream the PDF file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ message: 'Failed to download PDF' });
  }
}
