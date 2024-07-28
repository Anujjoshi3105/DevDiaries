import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    console.log("Route: ", nextUrl.pathname);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some((route) => new RegExp(`^${route.replace(/\[.*\]/, '.*')}$`).test(nextUrl.pathname));
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        console.log("Api Auth Route");
        return NextResponse.next();
    }

    if (isAuthRoute) {
        console.log("Auth Route");
        if (isLoggedIn) {
            console.log("Is Logged In");
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        console.log("Not Logged In");
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        console.log("Not Logged In and not public route");
        return NextResponse.redirect(new URL(`/auth/login`, nextUrl));
    }
    console.log("Is Logged In and not public route");
    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};