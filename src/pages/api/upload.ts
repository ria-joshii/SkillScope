import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse form data
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    const [fields, files] = await form.parse(req);
    
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(uploadedFile.mimetype || '')) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only MP4 video and MP3 audio files are allowed.' 
      });
    }

    // Generate unique session ID
    const sessionId = `OSCE-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Move file to final location
    const finalPath = path.join(uploadDir, `${sessionId}${path.extname(uploadedFile.originalFilename || '')}`);
    fs.renameSync(uploadedFile.filepath, finalPath);

    // Save session to JSON file
    const sessionsFile = path.join(process.cwd(), 'data', 'sessions.json');
    let sessions = [];
    try {
      const data = fs.readFileSync(sessionsFile, 'utf-8');
      sessions = JSON.parse(data);
    } catch {}
    
    sessions.push({
      id: sessions.length + 1,
      unique_id: sessionId,
      file_name: uploadedFile.originalFilename,
      file_path: finalPath,
      status: 'uploaded',
      created_at: new Date().toISOString()
    });
    
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));

    // Trigger async processing
    const { spawn } = require('child_process');
    const processScript = path.join(process.cwd(), 'scripts', 'process_async.js');
    const child = spawn('node', [processScript, sessionId, finalPath], { 
      detached: true, 
      stdio: 'ignore' 
    });
    child.unref();

    return res.status(200).json({
      success: true,
      sessionId: sessionId,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'File upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}