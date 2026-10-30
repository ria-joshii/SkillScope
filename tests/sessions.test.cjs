const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/lib/sessions.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const sessionModule = new Module(filename, module);
sessionModule.paths = module.paths;
sessionModule._compile(compiled, filename);
const { getSessions, saveSessions, updateSession } = sessionModule.exports;

test('session storage handles first use, updates, and corrupt data', () => {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'skillscope-test-'));
  try {
    process.chdir(directory);
    assert.deepEqual(getSessions(), []);
    saveSessions([{ unique_id: 'OSCE-1', status: 'uploaded' }]);
    updateSession('OSCE-1', { status: 'completed', pdf_path: '/report.pdf' });
    assert.deepEqual(getSessions(), [{
      unique_id: 'OSCE-1', status: 'completed', pdf_path: '/report.pdf',
    }]);
    fs.writeFileSync('data/sessions.json', 'invalid JSON');
    assert.throws(() => getSessions(), SyntaxError);
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
