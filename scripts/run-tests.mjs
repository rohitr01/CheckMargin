import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const testFile = path.join(rootDir, 'src', 'lib', 'calculator.test.ts');
const libFiles = [
  path.join(rootDir, 'src', 'lib', 'gst-directory.ts'),
  path.join(rootDir, 'src', 'lib', 'calculator.ts'),
  testFile,
];

console.log('Compiling test suite with TypeScript...');

const program = ts.createProgram(libFiles, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  skipLibCheck: true,
  outDir: path.join(rootDir, '.test-dist'),
});

const emitResult = program.emit();
const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

const errors = allDiagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
if (errors.length > 0) {
  for (const diag of errors) {
    const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    console.error(`TS Error: ${message}`);
  }
  process.exit(1);
}

console.log('Compilation succeeded. Executing test suite with strict assertions...\n');
const compiledTest = path.join(rootDir, '.test-dist', 'calculator.test.js');
const require = createRequire(import.meta.url);

try {
  require(compiledTest);
  console.log('\n✅ All test assertions passed release gating successfully.');
} catch (testErr) {
  console.error('\n❌ Release Gating Failed: Test assertion error caught.');
  console.error(testErr);
  process.exit(1);
}
