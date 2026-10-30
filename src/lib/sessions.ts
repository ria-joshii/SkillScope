import fs from 'fs';
import path from 'path';

export interface Session {
  id: number;
  unique_id: string;
  file_name: string | null;
  file_path: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
  analysis_path?: string;
  pdf_path?: string;
}

const sessionsFile = () => path.join(process.cwd(), 'data', 'sessions.json');

export function getSessions(): Session[] {
  try {
    return JSON.parse(fs.readFileSync(sessionsFile(), 'utf-8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export function saveSessions(sessions: Session[]): void {
  const file = sessionsFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(sessions, null, 2));
}

export function updateSession(sessionId: string, updates: Partial<Session>): void {
  const sessions = getSessions();
  const session = sessions.find(item => item.unique_id === sessionId);
  if (session) Object.assign(session, updates);
  saveSessions(sessions);
}
