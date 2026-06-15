import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function triggerNotification(title, message) {
  try {
    const { notify } = await import(`./notify.mjs`);
    notify(title, message);
  } catch (err) {
    console.error('Failed to dispatch desktop notification:', err.message);
  }
}

function verifyStory(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  // Focus only on components files inside components directory
  if (!filePath.includes(path.join('src', 'components'))) {
    return;
  }

  // Skip files that are stories, styles, types, or tests themselves
  if (
    ext !== '.tsx' && ext !== '.jsx' ||
    baseName.endsWith('.stories') ||
    baseName.endsWith('.test') ||
    baseName.endsWith('.spec') ||
    baseName.toLowerCase() === 'types' ||
    baseName.toLowerCase() === 'index'
  ) {
    return;
  }

  const dir = path.dirname(filePath);
  const storyPath = path.join(dir, `${baseName}.stories.tsx`);
  const altStoryPath = path.join(dir, `${baseName}.stories.jsx`);

  if (!fs.existsSync(storyPath) && !fs.existsSync(altStoryPath)) {
    const warningMsg = `Missing Storybook file for component: ${baseName}`;
    console.warn(`\x1b[33m⚠️  [Storybook Guard] ${warningMsg}\x1b[0m`);
    console.warn(`  - Recommended action: Create ${baseName}.stories.tsx in ${dir}`);
    
    triggerNotification('Missing Storybook File', warningMsg);
  } else {
    console.log(`\x1b[32m✅ [Storybook Guard] Found matching Storybook file for ${baseName}.\x1b[0m`);
  }
}

const targetFile = process.argv[2];
if (targetFile) {
  verifyStory(path.resolve(targetFile));
} else {
  console.log('No file specified for Storybook verification. Usage: node check-story-exists.mjs <filepath>');
}
