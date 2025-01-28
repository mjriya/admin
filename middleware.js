import { NextResponse } from 'next/server';






export function middleware(request) {
  const token = request.cookies.get('token'); // Retrieve token from cookies
  const pathname = request.nextUrl.pathname; // Get the current path

  // Allow requests to the /login route or static files to proceed without checking the token
  if (pathname === '/login'||pathname.startsWith('/reset-password/') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Redirect to /login if the token is missing
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed if the token exists
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Match all routes
};