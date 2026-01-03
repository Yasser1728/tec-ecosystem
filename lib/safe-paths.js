const path = require('path');

function sanitizeName(name) {
  // Allow only letters, numbers, and hyphens (-) [1-63 characters]
  // السماح فقط بالحروف والأرقام والواصل (-) [1-63 حرف]
  const re = /^[a-z0-9-]{1,63}$/i;
  if (!re.test(name)) {
    throw new Error('Invalid name format: Only alphanumeric characters and hyphens allowed (1-63 characters).');
  }
  return name;
}

function safeResolveFile(baseDir, userInput) {
  const base = path.resolve(baseDir);
  const normalized = path.normalize(String(userInput));
  const resolved = path.resolve(base, normalized);
  
  // Check if the resolved path is within the base directory
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error('Sovereign Security: Path traversal detected!');
  }
  return resolved;
}

module.exports = { sanitizeName, safeResolveFile };
