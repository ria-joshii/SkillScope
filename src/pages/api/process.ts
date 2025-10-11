import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

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
    const sessionsFile = path.join(process.cwd(), 'data', 'sessions.json');
    let sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
    const session = sessions.find((s: any) => s.unique_id === sessionId);
    if (session) session.status = 'processing';
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));

    const outputDir = path.join(process.cwd(), 'outputs');
    const scriptPath = path.join(process.cwd(), 'scripts', 'osce_analyzer.py');
    
    const { stdout } = await execAsync(
      `python3 "${scriptPath}" "${filePath}" "${outputDir}"`
    );

    const outputFile = stdout.trim();

    // Generate PDF
    const pdfPath = outputFile.replace('.json', '.pdf');
    const pdfScript = path.join(process.cwd(), 'scripts', 'generate_pdf.py');
    await execAsync(`python3 "${pdfScript}" "${outputFile}" "${pdfPath}" "OSCE Evaluation Report"`);

    sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
    const completedSession = sessions.find((s: any) => s.unique_id === sessionId);
    if (completedSession) {
      completedSession.status = 'completed';
      completedSession.analysis_path = outputFile;
      completedSession.pdf_path = pdfPath;
    }
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));

    return res.status(200).json({ success: true, outputFile });
  } catch (error) {
    console.error('Processing error:', error);
    
    try {
      const sessionsFile = path.join(process.cwd(), 'data', 'sessions.json');
      let sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
      const failedSession = sessions.find((s: any) => s.unique_id === sessionId);
      if (failedSession) failedSession.status = 'failed';
      fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
    } catch (fileError) {
      console.error('File update error:', fileError);
    }

    return res.status(500).json({ 
      message: 'Processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
