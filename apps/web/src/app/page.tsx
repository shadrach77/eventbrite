'use client';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <p>
        You are not logged in. <a href="/login">Sign in</a>
      </p>
    );
  }

  return (
    <div>
      <h1>
        Welcome, {session.user.id} {session.user.created_at}{' '}
        {session.user.full_name} {session.user.points} {session.user.role}{' '}
        {session.user.updated_at}
      </h1>
      <p>Your email: {session.user?.email}</p>
      <p>Your token: {session.user?.points}</p>
      <p>updated at: {session.user?.updated_at}</p>
      <p>pfp {session.user?.profile_picture}</p>
      <p>Token: {session.user.authentication_token}</p>
      <button
        onClick={async () => {
          await signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
