import { NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";

const RBAC = {
  owner: {
    allowed: /^\/dashboard\/owner/,
    redirect: "/dashboard/owner",
  },
  user: {
    allowed: /^\/dashboard\/user/,
    redirect: "/dashboard/user",
  },
};

const publicRoutes = ["/signin", "/signup"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const user = session?.user;

  const isPublic = publicRoutes.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  if (!user) {
    if (isDashboard) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  const roleConfig = RBAC[user.role as keyof typeof RBAC];

  if (!roleConfig) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (pathname === "/" && user.role === "owner") {
    return NextResponse.redirect(new URL("/dashboard/owner", request.url));
  }

  if (isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isDashboard && !roleConfig.allowed.test(pathname)) {
    return NextResponse.redirect(new URL(roleConfig.redirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
