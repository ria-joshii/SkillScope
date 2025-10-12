import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const USE_S3 = process.env.USE_S3 === 'true';
const BUCKET = process.env.S3_BUCKET || 'osce-files';

const s3Client = USE_S3 ? new S3Client({ 
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
}) : null;

export async function getSessions(): Promise<any[]> {
  if (USE_S3 && s3Client) {
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET, Key: 'sessions.json' });
      const response = await s3Client.send(command);
      const data = await response.Body?.transformToString();
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  } else {
    const file = path.join(process.cwd(), 'data', 'sessions.json');
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return [];
    }
  }
}

export async function saveSessions(sessions: any[]) {
  if (USE_S3 && s3Client) {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'sessions.json',
      Body: JSON.stringify(sessions, null, 2),
      ContentType: 'application/json'
    });
    await s3Client.send(command);
  } else {
    const file = path.join(process.cwd(), 'data', 'sessions.json');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(sessions, null, 2));
  }
}

export async function updateSession(sessionId: string, updates: any) {
  const sessions = await getSessions();
  const session = sessions.find(s => s.unique_id === sessionId);
  if (session) Object.assign(session, updates);
  await saveSessions(sessions);
}
