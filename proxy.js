import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/user-management",
  "/product-management",
];

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/user-management/:path*",
    "/product-management/:path*",
  ],
};
