# Session Status API Documentation

## Overview

The Session Status API provides a secure endpoint to validate user sessions in the TEC ecosystem. This feature was added to track and verify active user sessions with configurable timeout periods.

## API Endpoint

### POST `/api/auth/session-status`

Validates a user's session and returns their current status.

#### Request Body

```json
{
  "piId": "string", // Pi Network user ID (optional if userId provided)
  "userId": "string" // Internal user ID (optional if piId provided)
}
```

**Note:** At least one of `piId` or `userId` must be provided.

#### Response

**Success Response (200):**

```json
{
  "success": true,
  "sessionValid": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "lastLoginAt": "2025-12-25T06:00:00.000Z"
  },
  "message": "Session is active"
}
```

**User Not Found (404):**

```json
{
  "success": false,
  "error": "User not found",
  "sessionValid": false
}
```

**Invalid Request (400):**

```json
{
  "error": "Missing piId or userId"
}
```

**Server Error (500):**

```json
{
  "success": false,
  "error": "Failed to check session status",
  "sessionValid": false
}
```

## Configuration

### Session Timeout

- **Default:** 7 days (604,800,000 milliseconds)
- **Configuration:** Modify `SESSION_TIMEOUT_MS` constant in the handler
- **Behavior:** Sessions older than the timeout are marked as invalid

### Rate Limiting

- **Limit:** 20 requests per minute per IP
- **Window:** 60 seconds
- **Response on limit:** 429 Too Many Requests

## Session Validation Logic

1. User is looked up by `piId` or `userId`
2. Last activity timestamp is determined:
   - Uses `lastLoginAt` if available
   - Falls back to `createdAt` if user never logged in
3. Session is valid if: `(current_time - last_activity) < SESSION_TIMEOUT_MS`

## Client Usage

### Using Pi SDK

```javascript
import { piSDK } from "./lib/pi-sdk";

// Check session status for the current authenticated user
const result = await piSDK.checkSessionStatus();

// Check session status for a specific user
const result = await piSDK.checkSessionStatus("specific_pi_id");

// Handle response
if (result.success && result.sessionValid) {
  console.log("Session is active:", result.user);
} else {
  console.log("Session expired or invalid");
  // Prompt user to re-authenticate
}
```

### Direct API Call

```javascript
const response = await fetch("/api/auth/session-status", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ piId: "user_pi_id" }),
});

const data = await response.json();
if (data.sessionValid) {
  // Session is active
} else {
  // Session expired
}
```

## Security Features

- ✅ Rate limiting to prevent abuse
- ✅ Input validation (requires piId or userId)
- ✅ Comprehensive error handling
- ✅ Logging for audit trail
- ✅ No sensitive data exposed in errors
- ✅ CodeQL scanned (0 vulnerabilities)

## Integration Points

1. **Authentication Flow:** Use after login to confirm session validity
2. **Protected Routes:** Check session before accessing protected resources
3. **Periodic Checks:** Implement in client for automatic session validation
4. **Re-authentication:** Trigger login flow when session expires

## Error Handling

The API uses try-catch blocks to handle:

- Database connection errors
- Invalid user lookups
- Malformed requests
- Unexpected exceptions

All errors are logged via the logger utility for monitoring and debugging.

## Logging

Session status checks are logged with:

- User ID
- Username
- Session validity result
- Timestamp

Failed checks log error details for troubleshooting.

## Future Enhancements

Potential improvements:

- Environment variable for session timeout configuration
- Support for different timeout periods per user tier
- Session refresh mechanism
- Multiple active sessions per user
- Session invalidation API

## Related Files

- `/pages/api/auth/session-status.js` - API endpoint handler
- `/lib/pi-sdk.js` - Client SDK with checkSessionStatus method
- `/middleware/ratelimit.js` - Rate limiting middleware
- `/lib/utils/logger.js` - Logging utility
- `/prisma/schema.prisma` - User model definition
