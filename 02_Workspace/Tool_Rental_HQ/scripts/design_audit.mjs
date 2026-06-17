import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('Starting Figma design and token audit for Tool Rental HQ...');

// Components to scan
const components = [
  'ActiveRentals',
  'InventoryTable',
  'RentalForm',
  'SchedulingTab'
];

const report = {
  gates: [],
  discrepancies: [],
  structure: []
};

// 1. Structure Check (1 Component = 4 Files)
components.forEach(name => {
  const compDir = path.join(ROOT, 'src', 'components');
  const files = {
    tsx: path.join(compDir, `${name}.tsx`),
    stories: path.join(compDir, `${name}.stories.tsx`),
    css: path.join(compDir, `${name}.css`),
    test: path.join(compDir, `${name}.test.tsx`)
  };

  const status = {
    name,
    tsx: fs.existsSync(files.tsx),
    stories: fs.existsSync(files.stories),
    css: fs.existsSync(files.css),
    test: fs.existsSync(files.test)
  };

  report.structure.push(status);
});

// 2. Token Compliance Check (colors & layouts)
components.forEach(name => {
  const filePath = path.join(ROOT, 'src', 'components', `${name}.tsx`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Hex color regex: #[0-9a-fA-F]{3,6} (excluding CSS vars/variables)
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
  // Standard tailwind color regex: (bg|text|border)-(red|blue|green|gray|yellow|orange|purple|pink|indigo|emerald|teal|cyan|amber|lime|violet|fuchsia|rose|sky)-[0-9]{3}/g
  const twColorRegex = /\b(bg|text|border|accent|shadow|ring)-(red|blue|green|gray|yellow|orange|purple|pink|indigo|emerald|teal|cyan|amber|lime|violet|fuchsia|rose|sky)-[0-9]{3}\b/g;
  // Hardcoded pixel dimensions: e.g. p-[12px], w-[300px], style={{ width: '120px' }}
  const inlinePxRegex = /style=\{\{\s*[^}]*\b(width|height|padding|margin|gap|fontSize)\s*:\s*['"]\d+px['"]\s*[^}]*\}\}/gi;

  lines.forEach((line, index) => {
    // Avoid comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    let match;
    
    // Hex colors
    while ((match = hexRegex.exec(line)) !== null) {
      report.discrepancies.push({
        file: `src/components/${name}.tsx`,
        line: index + 1,
        type: 'Hardcoded Hex Color',
        value: match[0],
        suggestion: 'Replace with semantic CSS variable var(--color-*)'
      });
    }

    // Tailwind colors
    while ((match = twColorRegex.exec(line)) !== null) {
      report.discrepancies.push({
        file: `src/components/${name}.tsx`,
        line: index + 1,
        type: 'Tailwind Color Utility',
        value: match[0],
        suggestion: 'Use custom Tailwind configurations mapped to GEV brand style tokens or var(--color-*)'
      });
    }
  });
});

// 3. Build & TypeScript Compilation Checks
let buildStatus = 'PASS';
let buildLogs = '';
try {
  console.log('Running npm run build...');
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
  buildLogs = 'Build successful without warnings.';
} catch (error) {
  buildStatus = 'FAIL';
  buildLogs = error.stderr ? error.stderr.toString() : error.message;
}

let tsStatus = 'PASS';
let tsLogs = '';
try {
  console.log('Running TypeScript type check (tsc --noEmit)...');
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
  tsLogs = 'TypeScript compilation completed with no errors.';
} catch (error) {
  tsStatus = 'FAIL';
  tsLogs = error.stdout ? error.stdout.toString() : error.message;
}

// 4. Print Audit Report
console.log('\n======================================');
console.log('           DESIGN AUDIT REPORT        ');
console.log('======================================\n');

console.log('### 1. Build & TypeScript Gates');
console.log(`- Build Gate: ${buildStatus}`);
console.log(`- TypeScript Type Gate: ${tsStatus}\n`);

console.log('### 2. Component Structure (1 Component = 4 Files)');
console.log('| Component | TSX | Stories | CSS | Tests |');
console.log('|---|---|---|---|---|');
report.structure.forEach(s => {
  console.log(`| ${s.name} | ${s.tsx ? '✅ PASS' : '❌ FAIL'} | ${s.stories ? '✅ PASS' : '❌ FAIL'} | ${s.css ? '✅ PASS' : '❌ FAIL'} | ${s.test ? '✅ PASS' : '❌ FAIL'} |`);
});
console.log('\n');

console.log('### 3. Hardcoded Token Discrepancies');
if (report.discrepancies.length === 0) {
  console.log('No hardcoded styling variables detected. Excellent!');
} else {
  console.log('| File | Line | Type | Value | Suggestion |');
  console.log('|---|---|---|---|---|');
  report.discrepancies.forEach(d => {
    console.log(`| ${d.file} | ${d.line} | ${d.type} | \`${d.value}\` | ${d.suggestion} |`);
  });
}
console.log('\n======================================');
