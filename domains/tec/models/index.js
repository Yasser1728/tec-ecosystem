/**
 * TEC Domain Models
 * 
 * This file contains placeholder model definitions for the TEC domain.
 * Models will be integrated with Prisma schema as the domain expands.
 * 
 * @module models/index
 */

// Placeholder for User Profile Model
const UserProfile = {
  id: 'string',
  username: 'string',
  name: 'string',
  email: 'string',
  tier: 'GUEST | STANDARD | PREMIUM | ADMIN',
  joinDate: 'Date',
  lastActive: 'Date',
  preferences: 'Object',
};

// Placeholder for Dashboard Activity Model
const Activity = {
  id: 'string',
  userId: 'string',
  type: 'string',
  domain: 'string',
  description: 'string',
  timestamp: 'Date',
  metadata: 'Object',
};

// Placeholder for Alert Model
const Alert = {
  id: 'string',
  userId: 'string',
  type: 'info | warning | error',
  title: 'string',
  message: 'string',
  timestamp: 'Date',
  read: 'boolean',
};

// Placeholder for Domain Model
const Domain = {
  id: 'string',
  name: 'string',
  category: 'string',
  status: 'active | coming-soon | maintenance',
  description: 'string',
  icon: 'string',
  url: 'string',
};

module.exports = {
  UserProfile,
  Activity,
  Alert,
  Domain,
};
