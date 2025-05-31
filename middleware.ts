import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/static'))
    return NextResponse.next();

  const accessToken = req.cookies.get('access-token');
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: 
    ['/', '/home']
    //"/((?!login$).*)"
  
};
