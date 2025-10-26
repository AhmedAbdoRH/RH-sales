'use client';

import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useEffect, type ReactNode } from 'react';

// This component ensures that a user is always signed in anonymously
// if they are not already authenticated.
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the user state is done loading and there's no user,
    // initiate an anonymous sign-in.
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  // While checking auth state, you might want to show a loader,
  // but for anonymous auth, it's often fine to just show the app.
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return <>{children}</>;
}
