import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/myaccount",
  "/mybooks",
  "/users",
  "/usersbooksread",
  "/users/", // pour matcher les /users/:id
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("better-auth.session_token")?.value;

  console.log("💛💙💚 token", token);

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const redirectUrl = new URL("/auth/signin/", request.url);
    redirectUrl.searchParams.set("unauthorized", "1");

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/myaccount",
    "/mybooks",
    "/users",
    "/usersbooksread",
    "/users/:path*",
  ], // On n’inclut PAS /books ici → donc il reste accessible librement.
};
