import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { siteConfig } from "./config/siteConfig";


export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${siteConfig.baseUrl}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: credentials.phone,
                otp: credentials.otp,
              }),
            }
          );

          const data = await res.json();

          if (!data?.success || !data?.token) {
            return null;
          }

          return {
            id: "otp-user",
            token: data.token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.backendToken = token.backendToken;
      }
      return session;
    },
  },
});
