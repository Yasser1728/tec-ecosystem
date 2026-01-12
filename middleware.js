import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDomainRoute, isPiDomain } from "./lib/domainRedirect";
import { getDomainConfig } from "./lib/config/domain-registry";

// Define route access levels
const routeConfig = {
  // Public routes - no authentication required
  public: [
    "/",
    "/ecosystem",
    "/auth/signin",
    "/auth/error",
    // Business unit landing pages (index only)
    "/fundx",
    "/explorer",
    "/commerce",
    "/assets",
    "/nbf",
    "/insure",
    "/vip",
    "/life",
    "/ecommerce",
    "/connection",
    "/elite",
    "/brookfield",
    "/zone",
    "/dx",
    "/nx",
    "/system",
    "/analytics",
    "/alert",
    "/titan",
    "/epic",
    "/legend",
  ],

  // Protected routes - require authentication
  protected: [
    "/dashboard",
    "/profile",
    // Business unit internal pages
    "/fundx/calculator",
    "/fundx/strategies",
    "/fundx/portfolio",
    "/explorer/analytics",
    "/explorer/portfolio",
    "/commerce/sellers",
    "/commerce/orders",
  ],

  // Premium routes - require premium tier
  premium: [
    "/fundx/advanced",
    "/explorer/premium",
    "/elite/consulting",
    "/vip/events",
  ],

  // Admin routes - require admin role
  admin: [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/business-units",
    "/admin/analytics",
  ],
};

/**
 * Helper function to check domain authentication and redirect if needed
 */
async function checkDomainAuth(request, domainConfig, pathname) {
  if (domainConfig && domainConfig.requiresAuth) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      signInUrl.searchParams.set("domain", domainConfig.domain);
      return NextResponse.redirect(signInUrl);
    }
  }
  return null;
}

/**
 * Helper function to add domain headers to response
 */
function addDomainHeaders(response, domainConfig) {
  if (domainConfig) {
    response.headers.set('X-Domain-Name', domainConfig.name);
    response.headers.set('X-Domain-Name-Ar', domainConfig.nameAr);
    response.headers.set('X-Domain-Tier', domainConfig.tier);
    response.headers.set('X-Domain-Theme', domainConfig.theme);
    response.headers.set('X-Domain-Analytics', domainConfig.analytics);
    response.headers.set('X-Domain-Independent', String(domainConfig.independent));
    response.headers.set('X-Domain-Value', domainConfig.value);
  }
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Handle validation-key.txt - serve directly
  if (pathname === "/validation-key.txt") {
    return NextResponse.next();
  }

  // Get domain configuration for .pi domains
  let domainConfig = null;
  if (isPiDomain(hostname)) {
    domainConfig = getDomainConfig(hostname);
  }

  // Handle .pi domain routing
  if (isPiDomain(hostname)) {
    const targetRoute = getDomainRoute(hostname);

    // If user visits root of .pi domain, redirect to business unit page
    if (pathname === "/" && targetRoute !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = targetRoute;
      
      // Check authentication first
      const authRedirect = await checkDomainAuth(request, domainConfig, pathname);
      if (authRedirect) return authRedirect;
      
      // Create response with domain headers
      let response = NextResponse.rewrite(url);
      response = addDomainHeaders(response, domainConfig);
      
      return response;
    }

    // If user visits a path on .pi domain, keep them on that path
    // e.g., life.pi/about stays on /life/about
    // But still add domain headers
    if (domainConfig && pathname.startsWith("/api") === false) {
      // Check authentication
      const authRedirect = await checkDomainAuth(request, domainConfig, pathname);
      if (authRedirect) return authRedirect;
      
      let response = NextResponse.next();
      response = addDomainHeaders(response, domainConfig);
      
      return response;
    }
  }

  // Allow API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = routeConfig.public.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get user session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if route requires authentication
  const isProtectedRoute = routeConfig.protected.some((route) =>
    pathname.startsWith(route),
  );

  const isPremiumRoute = routeConfig.premium.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = routeConfig.admin.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect to signin if not authenticated
  if ((isProtectedRoute || isPremiumRoute || isAdminRoute) && !token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check user status
  if (token && token.status !== "ACTIVE") {
    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", "AccountInactive");
    return NextResponse.redirect(errorUrl);
  }

  // Check premium access
  if (isPremiumRoute && token) {
    const premiumTiers = ["PREMIUM", "ENTERPRISE", "ADMIN"];
    if (!premiumTiers.includes(token.tier)) {
      const upgradeUrl = new URL("/upgrade", request.url);
      upgradeUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(upgradeUrl);
    }
  }

  // Check admin access
  if (isAdminRoute && token) {
    if (token.tier !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
