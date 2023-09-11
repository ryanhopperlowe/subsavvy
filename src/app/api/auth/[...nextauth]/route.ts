import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      return { ...token, ...user };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: token,
      };
    },
  },
  jwt: {
    maxAge: 15 * 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST };
