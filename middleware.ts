// export { auth as middleware } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";

const protectedRoutes = ["/dashboard"];
const ownerRoutes = ["/dashboard/owner"];
const userRoutes = ["/dashboard/user"];
const publicRoutes = ["/", "/signin", "/signup"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await auth();
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  const isLoggedIn = !!session?.user;
  const isOwner = session?.user.role === "owner";
  const isUser = session?.user.role === "user";

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
  if (isUser && ownerRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard/user", request.nextUrl));
  }
  if (isOwner && userRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard/owner", request.nextUrl));
  }

  if (isPublicRoute && isOwner && path === "/") {
    return NextResponse.redirect(new URL("/dashboard/owner", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
