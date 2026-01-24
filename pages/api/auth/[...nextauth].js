import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Helper to handle ESM/CommonJS interop
const Credentials = CredentialsProvider.default || CredentialsProvider;

export const authOptions = {
  providers: [
    Credentials({
      id: "pi-network",
      name: "Pi Network",
      credentials: {
        piId: { label: "Pi ID", type: "text" },
        username: { label: "Username", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist
          if (!credentials?.piId || !credentials?.username) {
            console.error("Missing Pi Network credentials");
            return null;
          }

          // For Pi Network auth, we trust the Pi SDK authentication
          // The user is already authenticated via Pi Browser
          // We just need to create a session

          const user = {
            id: credentials.piId,
            piId: credentials.piId,
            username: credentials.username,
            accessToken: credentials.accessToken,
            tier: "STANDARD",
            status: "ACTIVE",
          };

          console.log("Pi Network user authenticated:", user.username);
          return user;
        } catch (error) {
          console.error("NextAuth authorize error:", error);
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
        session.user = {
          id: token.id,
          piId: token.piId,
          username: token.username,
          tier: token.tier,
          status: token.status,
        };
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

  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
