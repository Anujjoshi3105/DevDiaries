export const publicRoutes = [
    "/", 
    "/blog",
    "/blog/.*",
    "/user",
    "/user/.*",
    "/contact",
];
export const authRoutes = [
    "/auth/login", 
    "/auth/signup",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
    "/auth/verify",
];
export const apiAuthPrefix = "/api/";
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";