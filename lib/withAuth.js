import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { hasTierLevel, USER_TIERS } from "./roles";

/**
 * Higher-Order Component for protecting pages
 *
 * Usage:
 * export default withAuth(MyComponent, { requiredTier: 'PREMIUM' })
 */
export function withAuth(Component, options = {}) {
  const {
    requiredTier = USER_TIERS.STANDARD,
    redirectTo = "/auth/signin",
    loadingComponent = null,
  } = options;

  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      // Loading state
      if (status === "loading") return;

      // Not authenticated
      if (status === "unauthenticated") {
        const callbackUrl = encodeURIComponent(router.asPath);
        router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
        return;
      }

      // Check tier level
      if (session?.user) {
        const userTier = session.user.tier || USER_TIERS.GUEST;

        if (!hasTierLevel(userTier, requiredTier)) {
          router.push(
            `/upgrade?required=${requiredTier}&from=${encodeURIComponent(router.asPath)}`,
          );
          return;
        }

        // Check account status
        if (session.user.status !== "ACTIVE") {
          router.push("/auth/error?error=AccountInactive");
          return;
        }
      }
    }, [status, session, router]);

    // Show loading state
    if (status === "loading") {
      if (loadingComponent) {
        return loadingComponent;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    // Not authenticated
    if (status === "unauthenticated") {
      return null;
    }

    // Check tier
    if (session?.user) {
      const userTier = session.user.tier || USER_TIERS.GUEST;
      if (!hasTierLevel(userTier, requiredTier)) {
        return null;
      }
    }

    // Render protected component
    return <Component {...props} session={session} />;
  };
}

/**
 * Hook for checking authentication in components
 */
export function useAuth(options = {}) {
  const { requiredTier = USER_TIERS.STANDARD } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const hasRequiredTier = user
    ? hasTierLevel(user.tier || USER_TIERS.GUEST, requiredTier)
    : false;

  const redirectToSignIn = (callbackUrl) => {
    const url = callbackUrl || router.asPath;
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(url)}`);
  };

  const redirectToUpgrade = (required) => {
    const tier = required || requiredTier;
    router.push(
      `/upgrade?required=${tier}&from=${encodeURIComponent(router.asPath)}`,
    );
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    hasRequiredTier,
    redirectToSignIn,
    redirectToUpgrade,
  };
}

/**
 * Component for conditionally rendering based on auth
 */
export function AuthGuard({ children, requiredTier, fallback = null }) {
  const { isAuthenticated, isLoading, hasRequiredTier } = useAuth({
    requiredTier,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff9d]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRequiredTier) {
    return fallback;
  }

  return children;
}
