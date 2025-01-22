import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 3,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const response: any = await fetch(
            'http://localhost:8000/api/auth/profile?email=' +
              credentials.email +
              '&password=' +
              credentials.password,
            {
              method: 'GET',
              next: {
                revalidate: 0,
              },
            },
          );

          // previously had 'as User[]'
          const data = await response.json();

          console.log("content of 'data'", data);

          if (!data) {
            throw new Error('User not found');
          }
          const user = data.data;
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
