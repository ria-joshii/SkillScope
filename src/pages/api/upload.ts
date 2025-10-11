import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
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

    // Get teacher ID from request headers or session
    const teacherId = req.headers['x-user-id'] as string;
    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'osce_feedback',
    });

    // Create session record
    await connection.execute(
      'INSERT INTO sessions (teacher_id, student_id, unique_id, file_name, file_path, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        teacherId,
        teacherId, // For now, teacher uploads for themselves - can be changed later
        sessionId,
        uploadedFile.originalFilename,
        finalPath,
        'uploaded'
      ]
    );

    await connection.end();

    // TODO: Trigger backend processing here
    // This would typically send the file to your Python backend for analysis

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