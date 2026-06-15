import path from 'path';

function checkProtection(filePath) {
  const baseName = path.basename(filePath);

  // Protected patterns (e.g. .env files, mcp configs, secret configs)
  const protectedPatterns = [
    /^\.env(\..+)?$/i,
    /^mcp_config\.json$/i,
    /^antigravity\.config\.json$/i
  ];

  const isProtected = protectedPatterns.some(pattern => pattern.test(baseName));

  if (isProtected) {
    console.error(`\x1b[31m❌ [Security Guard] ACCESS DENIED: Writing or modifying protected file: ${baseName}\x1b[0m`);
    console.error(`  - Modifying sensitive environment variables or agent configurations is forbidden.`);
    
    // Exit process with error code to abort git commit / saving pipeline
    process.exit(1);
  } else {
    console.log(`\x1b[32m✅ [Security Guard] File ${baseName} is safe to write.\x1b[0m`);
  }
}

const targetFile = process.argv[2];
if (targetFile) {
  checkProtection(path.resolve(targetFile));
} else {
  console.log('No file specified for protection check. Usage: node protect-files.mjs <filepath>');
}
