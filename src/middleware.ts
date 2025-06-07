import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/vehicles', '/maintenance'];
const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const PUBLIC_HOME_ROUTE = '/';
const AUTH_TOKEN_COOKIE_NAME = 'authToken'; // Adjust if your token cookie name is different

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // Check if the current path is an authentication route
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // User is authenticated and accessing a protected route, set cache control headers
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache'); // For HTTP/1.0 caches
    response.headers.set('Expires', '0'); // Proxies
    return response;
  }

  if (isAuthRoute) {
    if (token) {
      // User is authenticated, redirect to dashboard from auth pages
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Handle root route redirection based on authentication status
  if (pathname === PUBLIC_HOME_ROUTE) {
    if (token) {
        // Authenticated user accessing root, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Unauthenticated user accessing root, allow (shows public home page)
    return NextResponse.next(); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
