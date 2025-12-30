import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "pi-network",
      name: "Pi Network",
      credentials: {
        piId: { label: "Pi ID", type: "text" },
        username: { label: "Username", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.piId || !credentials?.username) {
            throw new Error("Missing Pi Network credentials");
          }

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { piId: credentials.piId },
          });

          if (!user) {
            // Create new user
            user = await prisma.user.create({
              data: {
                piId: credentials.piId,
                username: credentials.username,
                tier: "STANDARD",
                status: "ACTIVE",
                language: "en",
                lastLoginAt: new Date(),
              },
            });
          } else {
            // Update last login
            user = await prisma.user.update({
              where: { piId: credentials.piId },
              data: { lastLoginAt: new Date() },
            });
          }

          return {
            id: user.id,
            piId: user.piId,
            username: user.username,
            email: user.email,
            tier: user.tier,
            status: user.status,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.piId = user.piId;
        token.username = user.username;
        token.tier = user.tier;
        token.status = user.status;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.piId = token.piId;
        session.user.username = token.username;
        session.user.tier = token.tier;
        session.user.status = token.status;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
