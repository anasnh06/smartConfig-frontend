import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const isAuth = Boolean(accessToken)
  const { pathname } = request.nextUrl

  // si connecté et essaie d’aller sur /login → rediriger vers /
  if (isAuth && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login'],
}
