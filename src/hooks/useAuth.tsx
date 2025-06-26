
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserWithRole extends User {
  role?: 'client' | 'admin';
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore users collection
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role: 'client' | 'admin' = 'client'; // default role
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            role = userData.role || 'client';
          }
          
          setUser({
            ...firebaseUser,
            role
          });
        } catch (error) {
          console.error('Error fetching user role from Firestore:', error);
          // Fallback to default role if there's an error
          setUser({
            ...firebaseUser,
            role: 'client'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
