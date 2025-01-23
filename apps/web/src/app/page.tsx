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
        You are not logged in. <a href="/api/auth/signin">Sign in</a>
      </p>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Your email: {session.user?.email}</p>
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
