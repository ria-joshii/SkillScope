const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const sessionId = process.argv[2];
const filePath = process.argv[3];

(async () => {
  const sessionsFile = path.join(__dirname, '..', 'data', 'sessions.json');
  
  let sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
  const session = sessions.find(s => s.unique_id === sessionId);
  if (session) session.status = 'processing';
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  
  try {
    const analyzerScript = path.join(__dirname, 'osce_analyzer.py');
    const outputDir = path.join(__dirname, '..', 'outputs');
    
    const { stdout } = await execFileAsync('python3', [analyzerScript, filePath, outputDir]);
    const outputFile = stdout.trim();
    const pdfPath = outputFile.replace('.json', '.pdf');
    
    const pdfScript = path.join(__dirname, 'generate_pdf.py');
    await execFileAsync('python3', [pdfScript, outputFile, pdfPath]);
    
    sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
    const done = sessions.find(s => s.unique_id === sessionId);
    if (done) {
      done.status = 'completed';
      done.analysis_path = outputFile;
      done.pdf_path = pdfPath;
    }
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Processing error:', error);
    sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
    const failed = sessions.find(s => s.unique_id === sessionId);
    if (failed) failed.status = 'failed';
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  }
})();
