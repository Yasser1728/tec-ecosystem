const path = require('path');

function sanitizeName(name) {
  // Allow only letters, numbers and dashes (-), length 1-63 characters
  const re = /^[a-z0-9-]{1,63}$/i;
  if (!re.test(name)) {
    throw new Error('Invalid name format: Only alphanumeric and dashes allowed (1-63 characters).');
  }
  return name;
}

function safeResolveFile(baseDir, userInput) {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(base, userInput);
  
  // Use path.relative to check if resolved path is within base directory
  const relative = path.relative(base, resolved);
  
  // If relative path starts with '../' (or '..\' on Windows) or is an absolute path, it's outside base
  // Check for path separator after '..' to avoid blocking literal filenames like '..\filename' on Unix
  if (relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    throw new Error('Sovereign Security: Path traversal detected!');
  }
  
  return resolved;
}

module.exports = { sanitizeName, safeResolveFile };
