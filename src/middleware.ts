import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === "/login";

  // ❌ Not logged in → redirect everything to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Logged in → block login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
