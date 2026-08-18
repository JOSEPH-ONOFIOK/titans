import NextAuth, { type DefaultSession } from "next-auth";
import Twitter from "next-auth/providers/twitter";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    username?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Twitter({
      userinfo:
        "https://api.x.com/2/users/me?user.fields=profile_image_url,username",
      profile(response) {
        const data = response.data as {
          id: string;
          name: string;
          username: string;
          profile_image_url?: string;
        };
        return {
          id: data.id,
          name: data.name,
          username: data.username,
          image: data.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.username) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.username) {
        session.user.username = token.username;
      }
      return session;
    },
  },
});
