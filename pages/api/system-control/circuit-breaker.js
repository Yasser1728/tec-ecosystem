/**
 * System Control API - Circuit Breaker Toggle
 * Admin endpoint to manually control the emergency circuit breaker
 * 
 * W3SA-ACCESS-001: Enhanced with RBAC permissions
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { USER_TIERS } from "../../../lib/roles";
import { toggleCircuitBreaker } from "../../../lib/forensic-utils";
import { requirePermission } from "../../../lib/auth/permissions";
import { PERMISSIONS } from "../../../lib/roles/definitions";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify admin authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.tier !== USER_TIERS.ADMIN) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin access required",
      });
    }

    const { activate, reason } = req.body;

    if (typeof activate !== "boolean") {
      return res.status(400).json({
        error: "Invalid request",
        message: "activate must be a boolean value",
      });
    }

    if (activate && (!reason || reason.trim() === "")) {
      return res.status(400).json({
        error: "Invalid request",
        message:
          "reason is required and cannot be empty when activating circuit breaker",
      });
    }

    // Toggle circuit breaker
    const result = await toggleCircuitBreaker(
      session.user.id,
      activate,
      reason || "Manual deactivation by admin",
    );

    if (!result.success) {
      return res.status(500).json({
        error: "Failed to toggle circuit breaker",
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: activate
        ? "Circuit breaker activated - all transfers suspended"
        : "Circuit breaker deactivated - transfers resumed",
      systemControl: {
        circuitBreakerActive: result.systemControl.circuitBreakerActive,
        integrityLevel: result.systemControl.integrityLevel,
        lockReason: result.systemControl.lockReason,
        lockedBy: result.systemControl.lockedBy,
        lockedAt: result.systemControl.lockedAt,
      },
    });
  } catch (error) {
    console.error("[CIRCUIT BREAKER TOGGLE ERROR]", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// Apply permission-based access control
export default requirePermission(PERMISSIONS.CIRCUIT_BREAKER_TOGGLE)(handler);
