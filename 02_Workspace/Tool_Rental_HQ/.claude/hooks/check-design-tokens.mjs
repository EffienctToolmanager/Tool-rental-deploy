import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import notify script helper
const notifyPath = path.join(__dirname, 'notify.mjs');

async function triggerNotification(title, message) {
  try {
    const { notify } = await import(`./notify.mjs`);
    notify(title, message);
  } catch (err) {
    console.error('Failed to dispatch desktop notification:', err.message);
  }
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  // Only scan source files
  const ext = path.extname(filePath);
  if (!['.tsx', '.ts', '.css', '.jsx', '.js'].includes(ext)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  // 1. Hex Colors Regex: # followed by 3, 4, 6, or 8 hex digits, bounded
  const hexRegex = /\b#([a-fA-F0-9]{3,4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})\b/g;
  
  // 2. RGB/HSL functional notations
  const rgbRegex = /\b(rgb|hsl)a?\([^)]+\)/gi;

  // 3. Native Tailwind Color Classes (e.g., bg-white, text-red-500)
  // Exclude our custom branding terms if matched, but flag standard Tailwind color words.
  const tailwindColorRegex = /\b(bg|text|border|ring|stroke|fill)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-\d+)?\b/gi;

  lines.forEach((line, idx) => {
    let match;
    
    // Check hex
    while ((match = hexRegex.exec(line)) !== null) {
      // Exclude comments or valid variable names if needed
      violations.push({ line: idx + 1, content: line.trim(), match: match[0], type: 'HEX' });
    }

    // Check RGB/HSL
    while ((match = rgbRegex.exec(line)) !== null) {
      violations.push({ line: idx + 1, content: line.trim(), match: match[0], type: 'FUNCTIONAL' });
    }

    // Check Tailwind standard classes (exclude CSS variables)
    while ((match = tailwindColorRegex.exec(line)) !== null) {
      violations.push({ line: idx + 1, content: line.trim(), match: match[0], type: 'TAILWIND_STANDARD' });
    }
  });

  if (violations.length > 0) {
    const msg = `Found ${violations.length} token violations in ${path.basename(filePath)}!`;
    console.warn(`\x1b[33m⚠️  [Design Token Guard] ${msg}\x1b[0m`);
    violations.forEach(v => {
      console.warn(`  - Line ${v.line}: Found '${v.match}' in: "${v.content}"`);
    });
    
    triggerNotification('Design Token Violation', msg);
  } else {
    console.log(`\x1b[32m✅ [Design Token Guard] ${path.basename(filePath)} complies with design tokens.\x1b[0m`);
  }
}

const targetFile = process.argv[2];
if (targetFile) {
  scanFile(path.resolve(targetFile));
} else {
  console.log('No file specified for token scanning. Usage: node check-design-tokens.mjs <filepath>');
}
