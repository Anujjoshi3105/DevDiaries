import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/action/user";
import { compare, genSaltSync } from "bcryptjs";

const generateUsername = (name: string) => {
  return name.replace(/[^a-z0-9]/g, '').toLowerCase() + genSaltSync(10);
};

const getProfile = (profile: any, idKey: string, nameKey: string, emailKey: string, imageKey: string) => {
  let name = (profile[nameKey] || profile[emailKey].split("@")[0] || "").toLowerCase();
  if (/[^a-z0-9]/.test(name)) {
    name = generateUsername(name);
  }
  return {
    id: String(profile[idKey]),
    name,
    email: profile[emailKey],
    image: profile[imageKey],
  };
};

const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => getProfile(profile, "id", "name", "email", "avatar_url"),
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (profile) => getProfile(profile, "sub", "name", "email", "picture"),
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validateFields = loginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const user = await getUserByEmail(email);
          if (user && user.password) {
            const correctPassword = await compare(password, user.password);
            if (correctPassword) {
              return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
            }
          }
        }
        return null;
      },
    }),
  ],
};

export default authConfig;
