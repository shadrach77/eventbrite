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
            'http://localhost:8000/api/auth/profile',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              next: {
                revalidate: 0,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          // previously had 'as User[]'
          const data = await response.json();

          if (!data) {
            throw new Error('User not found');
          }

          const jwt_token = response.headers
            .get('Authorization')
            ?.split(' ')[1];

          if (!jwt_token) {
            throw new Error('Authentication failed due to missing JWT Token');
          }

          const user = data.data;
          user.authentication_token = jwt_token;

          return {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            points: user.points,
            profile_picture: user.profile_picture,
            created_at: user.created_at,
            updated_at: user.updated_at,
            authentication_token: user.authentication_token,
          };
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
        console.log('User before token => ', user);
        token.id = user.id;
        token.email = user.email;
        token.full_name = user.full_name;
        token.role = user.role;
        token.points = user.points;
        token.profile_picture = user.profile_picture;
        token.authentication_token = user.authentication_token;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        console.log('Token before session => ', token);
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.profile_picture = token.profile_picture as string;
        session.user.full_name = token.full_name as string;
        session.user.role = token.role as 'CUSTOMER' | 'ORGANIZER';
        session.user.points = Number(token.points);
        session.user.authentication_token =
          token.authentication_token as string;
        session.user.created_at = token.created_at as string;
        session.user.updated_at = token.updated_at as string;
      }
      return session;
    },
  },
});
