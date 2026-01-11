import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
});
