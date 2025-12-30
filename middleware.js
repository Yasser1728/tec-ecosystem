import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDomainRoute, isPiDomain } from "./lib/domainRedirect";

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

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Handle validation-key.txt - rewrite to API route
  if (pathname === "/validation-key.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/validation-key";
    return NextResponse.rewrite(url);
  }

  // Handle .pi domain routing
  if (isPiDomain(hostname)) {
    const targetRoute = getDomainRoute(hostname);

    // If user visits root of .pi domain, redirect to business unit page
    if (pathname === "/" && targetRoute !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = targetRoute;
      return NextResponse.rewrite(url);
    }

    // If user visits a path on .pi domain, keep them on that path
    // e.g., life.pi/about stays on /life/about
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
