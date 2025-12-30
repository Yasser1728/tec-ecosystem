/**
 * Higher-Order Component (HOC) for protecting pages
 * Wraps pages that require authentication
 */

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * HOC to protect pages with authentication
 * @param {Component} Component - The component to protect
 * @param {Object} options - Configuration options
 * @returns {Component} - Protected component
 */
export function withAuth(Component, options = {}) {
  const { redirectTo = "/api/auth/signin", requiredRole = null } = options;

  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const loading = status === "loading";

    useEffect(() => {
      // If not authenticated, redirect to login
      if (!loading && !session) {
        router.push(redirectTo);
      }

      // If role is required and user doesn't have it, redirect
      if (!loading && session && requiredRole) {
        const userRole = session.user?.role || "user";
        if (userRole !== requiredRole) {
          router.push("/403"); // Forbidden page
        }
      }
    }, [loading, session, router]);

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render protected component if not authenticated
    if (!session) {
      return null;
    }

    // Check role if required
    if (requiredRole && session.user?.role !== requiredRole) {
      return null;
    }

    // Render the protected component
    return <Component {...props} session={session} />;
  };
}

/**
 * HOC specifically for admin-only pages
 */
export function withAdminAuth(Component) {
  return withAuth(Component, { requiredRole: "admin" });
}

/**
 * HOC for pages that require premium membership
 */
export function withPremiumAuth(Component) {
  return withAuth(Component, { requiredRole: "premium" });
}
