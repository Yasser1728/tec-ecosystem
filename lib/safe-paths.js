const path = require('path');

function sanitizeName(name) {
  // Allow only letters (a-z, A-Z), numbers (0-9) and dashes (-), length 1-63 characters
  const re = /^[a-z0-9-]{1,63}$/i;
  if (!re.test(name)) {
    throw new Error('Invalid name format: Only letters (a-z, A-Z), numbers (0-9), and dashes (-) allowed (1-63 characters).');
  }
  return name;
}

function safeResolveFile(baseDir, userInput) {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(base, userInput);
  
  // Use path.relative to check if resolved path is within base directory
  const relative = path.relative(base, resolved);
  
  // Block if path goes to parent (..) or outside (starts with ../), or is absolute
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    throw new Error('Sovereign Security: Path traversal detected!');
  }
  
  return resolved;
}

module.exports = { sanitizeName, safeResolveFile };
