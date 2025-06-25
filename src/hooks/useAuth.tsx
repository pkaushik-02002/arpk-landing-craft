
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';

export interface UserWithRole extends User {
  role?: 'client' | 'admin';
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get custom claims to determine user role
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const role = idTokenResult.claims.role as 'client' | 'admin' || 'client';
        
        setUser({
          ...firebaseUser,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
