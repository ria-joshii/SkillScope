import { NextApiRequest, NextApiResponse } from 'next';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { updateSession } from '@/lib/sessions';

const execFileAsync = promisify(execFile);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, filePath } = req.body;

  if (typeof sessionId !== 'string' || !sessionId || typeof filePath !== 'string' || !filePath) {
    return res.status(400).json({ message: 'Missing sessionId or filePath' });
  }

  try {
    updateSession(sessionId, { status: 'processing' });

    const outputDir = path.join(process.cwd(), 'outputs');
    const scriptPath = path.join(process.cwd(), 'scripts', 'osce_analyzer.py');

    const { stdout } = await execFileAsync(
      'python3', [scriptPath, filePath, outputDir]
    );

    const outputFile = stdout.trim();

    // Generate PDF
    const pdfPath = outputFile.replace('.json', '.pdf');
    const pdfScript = path.join(process.cwd(), 'scripts', 'generate_pdf.py');
    try {
      await execFileAsync('python3', [pdfScript, outputFile, pdfPath, 'OSCE Evaluation Report']);
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
    }

    updateSession(sessionId, {
      status: 'completed',
      analysis_path: outputFile,
      pdf_path: pdfPath,
    });

    return res.status(200).json({ success: true, outputFile });
  } catch (error) {
    console.error('Processing error:', error);

    try {
      updateSession(sessionId, { status: 'failed' });
    } catch (fileError) {
      console.error('File update error:', fileError);
    }

    return res.status(500).json({
      message: 'Processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
