import NextAuth, { SessionStrategy } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const OPTIONS = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0", // opt-in to Twitter OAuth 2.0
      profile(profile: any) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          image: profile.data.profile_image_url.replace("_normal", ""),
          username: profile.data.username, // Custom field
        };
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }: any) {
      return baseUrl + "/hunter"; 
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/api/auth/login",
    callback: "/",
    error: "/api/auth/error",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
