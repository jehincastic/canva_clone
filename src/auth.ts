import NextAuth from "next-auth";

import autConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(autConfig);
