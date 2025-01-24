// next-auth.d.ts (create this file in your project root or inside `types` directory)
import { User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'CUSTOMER' | 'ORGANIZER';
    points?: number;
    profile_picture?: string;
    authentication_token?: string;
    created_at: string;
    updated_at: string;
  }
  interface Session {
    user: User & {
      id: string;
      email: string;
      full_name: string | null;
      role: 'CUSTOMER' | 'ORGANIZER';
      points?: number;
      profile_picture?: string;
      authentication_token?: string;
      created_at: string;
      updated_at: string;
    };
  }
}
