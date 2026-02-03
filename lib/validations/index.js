/**
 * Validation Middleware - W3SA-INPUT-001 Fix
 * 
 * Centralized validation middleware for all API endpoints
 * Security Level: HIGH
 * 
 * @see W3SA_REMEDIATION_PLAN.md - Phase 1
 */

import { z } from 'zod';

/**
 * Validate request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Middleware function
 */
export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      next(error);
    }
  };
}

/**
 * Validate query parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Middleware function
 */
export function validateQuery(schema) {
  return async (req, res, next) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      next(error);
    }
  };
}

/**
 * HOC to wrap API handlers with body validation
 * @param {Function} handler - Next.js API handler
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Wrapped handler
 */
export function withBodyValidation(handler, schema) {
  return async (req, res) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      return await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      throw error;
    }
  };
}

/**
 * HOC to wrap API handlers with query validation
 * @param {Function} handler - Next.js API handler
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Wrapped handler
 */
export function withQueryValidation(handler, schema) {
  return async (req, res) => {
    try {
      const validated = schema.parse(req.query);
      req.validatedQuery = validated;
      return await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      throw error;
    }
  };
}

export default {
  validateBody,
  validateQuery,
  withBodyValidation,
  withQueryValidation,
};
