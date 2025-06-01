// lib/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        }
      });
      return () => unsubscribe();
    }, [router]);

    return <Component {...props} />;
  };
}
