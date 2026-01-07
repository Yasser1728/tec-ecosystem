# TEC Pi Network Integration Domain

## 🔐 Security First Design

This domain provides secure authentication and user management integration with the Pi Network ecosystem. It has been built with **enterprise-grade security standards** from the ground up.

---

## 🛡️ Security Policies

### ⚠️ MANDATORY SECURITY REQUIREMENTS

**All code in this domain MUST adhere to the following security policies:**

### 1. Password Security

✅ **REQUIRED:**
- **ALWAYS** use bcrypt (or stronger) for password hashing
- **ALWAYS** use salt rounds of 12 or higher
- **NEVER** store passwords in plaintext
- **NEVER** compare passwords directly using `===` or `==`
- **ALWAYS** use constant-time comparison (bcrypt.compare)

❌ **PROHIBITED:**
```javascript
// NEVER DO THIS - Insecure!
user.password = plainPassword;  // NO plaintext storage
if (inputPassword === storedPassword) { } // NO direct comparison
```

✅ **CORRECT:**
```javascript
// ALWAYS DO THIS - Secure!
const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

### 2. Random ID Generation

✅ **REQUIRED:**
- **ALWAYS** use `crypto.randomBytes()` for generating IDs, tokens, or secrets
- **ALWAYS** use sufficient entropy (minimum 16 bytes / 128 bits)

❌ **PROHIBITED:**
```javascript
// NEVER DO THIS - Predictable and insecure!
const id = Math.random().toString(36);  // NO Math.random()
const token = Date.now() + Math.random();  // NO predictable values
```

✅ **CORRECT:**
```javascript
// ALWAYS DO THIS - Cryptographically secure!
const crypto = require('crypto');
const secureId = crypto.randomBytes(16).toString('hex');
```

### 3. Code Review Requirements

**Every pull request MUST:**
- ✅ Pass automated security scanning (CodeQL, Codacy)
- ✅ Have zero security warnings or vulnerabilities
- ✅ Be reviewed for security best practices
- ✅ Include security testing for authentication flows

---

## 📚 Usage Examples

### Secure User Registration

```javascript
const TecPiService = require('./domains/tecpi');
const tecPi = new TecPiService();

// Register a new user - password is automatically hashed
try {
  const user = await tecPi.registerUser({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'SecureP@ssw0rd123',  // Will be hashed with bcrypt
    piNetworkId: 'pi_user_12345'    // Optional
  });
  
  console.log('User registered:', user);
  // Note: Returned user object does NOT contain password
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Secure User Authentication

```javascript
// Authenticate with username and password
try {
  const authResult = await tecPi.authenticateUser({
    username: 'johndoe',
    password: 'SecureP@ssw0rd123'  // Securely compared with hash
  });
  
  console.log('Authentication successful!');
  console.log('Session token:', authResult.sessionToken);
  console.log('Expires at:', authResult.expiresAt);
} catch (error) {
  console.error('Authentication failed:', error.message);
}
```

### Pi Network Integration

```javascript
// Authenticate using Pi Network credentials
try {
  const piAuthResult = await tecPi.authenticateWithPiNetwork({
    piNetworkId: 'pi_user_12345',
    accessToken: 'pi_access_token_from_sdk'
  });
  
  console.log('Pi Network authentication successful!');
  console.log('User:', piAuthResult.user);
} catch (error) {
  console.error('Pi Network authentication failed:', error.message);
}
```

### Session Validation

```javascript
// Validate a session token
const user = await tecPi.validateSession(sessionToken);

if (user) {
  console.log('Valid session for user:', user.username);
} else {
  console.log('Invalid or expired session');
}
```

### Secure Password Change

```javascript
// Change user password - both old and new passwords are handled securely
try {
  await tecPi.changePassword(
    'johndoe',
    'OldP@ssw0rd',
    'NewSecureP@ssw0rd456'
  );
  console.log('Password changed successfully');
} catch (error) {
  console.error('Password change failed:', error.message);
}
```

---

## 🏗️ Architecture

### Security Layers

1. **Password Layer**: Bcrypt hashing with salt rounds of 12
2. **ID Generation Layer**: Cryptographically secure random bytes
3. **Session Management**: Token-based with expiration
4. **Validation Layer**: Input validation and sanitization

### Dependencies

- **bcrypt**: Industry-standard password hashing
- **crypto** (Node.js built-in): Cryptographically secure random generation

---

## 🧪 Testing

All security features are thoroughly tested:

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage
```

### Test Coverage Requirements

- ✅ Password hashing and verification
- ✅ Secure ID generation (non-collision)
- ✅ User registration and authentication
- ✅ Session management
- ✅ Password change workflows
- ✅ Pi Network integration

---

## 🚨 Security Warnings

### ⚠️ DO NOT:

- ❌ Use `Math.random()` for any security-sensitive operations
- ❌ Store passwords in plaintext or use weak hashing (MD5, SHA1)
- ❌ Compare passwords directly without constant-time comparison
- ❌ Commit secrets or credentials to version control
- ❌ Disable security warnings or bypass security checks

### ✅ ALWAYS:

- ✅ Use bcrypt or Argon2 for password hashing
- ✅ Use `crypto.randomBytes()` for random generation
- ✅ Validate all user inputs
- ✅ Use parameterized queries to prevent SQL injection
- ✅ Keep dependencies up to date
- ✅ Run security scans before merging code

---

## 📊 Security Metrics

This module maintains:
- **Zero** critical security vulnerabilities
- **Zero** exposed credentials
- **100%** test coverage for authentication flows
- **Bcrypt cost factor**: 12 (adjustable for future-proofing)
- **ID entropy**: 128 bits (16 bytes)

---

## 🔄 Future Security Enhancements

Planned improvements:
1. Multi-factor authentication (MFA/2FA)
2. Rate limiting for login attempts
3. Account lockout after failed attempts
4. Password strength requirements enforcement
5. Suspicious activity detection
6. Integration with security monitoring tools

---

## 📞 Security Contact

If you discover a security vulnerability, please:
1. **DO NOT** open a public issue
2. Contact the security team privately
3. Allow time for the issue to be patched before disclosure

---

## 📄 License

This module is part of the TEC Ecosystem and follows the project's licensing terms.

---

**Last Updated**: January 2026  
**Security Review Date**: January 2026  
**Next Review**: July 2026
