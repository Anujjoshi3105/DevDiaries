import { AuthError, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/action/user";
import { compare, genSaltSync } from "bcryptjs";

const generateUsername = (name: string) => {
  return (name+genSaltSync(10)).toLowerCase().replace(/[^a-z0-9]/g, '');
};

const getProfile = (profile: any, idKey: string, nameKey: string, emailKey: string, imageKey: string) => {
  let name = generateUsername(profile[nameKey] || profile[emailKey].split("@")[0] || "");
  return {
    id: String(profile[idKey]),
    name,
    email: profile[emailKey],
    image: profile[imageKey],
  };
};

const authConfig: NextAuthConfig = {
  theme: {
    logo: "/logo.png",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => getProfile(profile, "id", "name", "email", "avatar_url"),
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (profile) => getProfile(profile, "sub", "name", "email", "picture"),
      allowDangerousEmailAccountLinking: true
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
          const user = await getUserByEmail(email.toLowerCase());
          if(!user || !user.password) return null;
          const correctPassword = await compare(password, user.password);
          if (correctPassword) {
            return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
          } else {
            throw new AuthError("Invalid Credentials");
          }
        } else {
          throw new AuthError("Invalid Credentials");
        }
      },
    }),
  ],
};

export default authConfig;
